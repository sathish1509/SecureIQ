import os
import re
import time
from concurrent.futures import ThreadPoolExecutor, TimeoutError as FuturesTimeoutError
from datetime import datetime, timezone
from urllib.parse import urlparse

import joblib
import pandas as pd
from flask import Flask, jsonify, request, send_from_directory

from feature_extractor import extract_features

app = Flask(__name__, static_folder="dist", static_url_path="")

try:
    from flask_cors import CORS

    cors_origins_env = os.getenv("CORS_ORIGINS", "*")
    if cors_origins_env == "*":
        CORS(app, origins="*")
    else:
        CORS(app, origins=[o.strip() for o in cors_origins_env.split(",") if o.strip()])
except ImportError:
    pass

MODEL_PATH = os.path.join(os.path.dirname(__file__), "Model", "phishing_model.pkl")
FEATURE_COLUMNS_PATH = os.path.join(os.path.dirname(__file__), "Model", "feature_columns.pkl")
ANALYZE_TIMEOUT_SECONDS = 8
START_TIME = time.monotonic()

MODEL = joblib.load(MODEL_PATH)
FEATURE_COLUMNS = joblib.load(FEATURE_COLUMNS_PATH)
PHISHING_CLASS_INDEX = list(MODEL.classes_).index(1)

FEATURE_LABELS = {
    "UsingIP": {
        "title": "Raw IP Address Host",
        "category": "Infrastructure",
        "risk": "high",
        "description": "URL targets an IP address directly instead of a domain name.",
        "safe_description": "URL uses a standard domain name rather than a raw IP address.",
    },
    "LongURL": {
        "title": "Abnormally Long URL Length",
        "category": "Lexical",
        "risk": "medium",
        "description": "URL length exceeds thresholds commonly seen in phishing pages.",
        "safe_description": "URL length is within normal bounds.",
    },
    "ShortURL": {
        "title": "URL Shortener Detected",
        "category": "Infrastructure",
        "risk": "medium",
        "description": "Shortened URL may hide the final malicious destination.",
        "safe_description": "URL does not use a known link-shortening service.",
    },
    "Symbol@": {
        "title": "At-Symbol in URL",
        "category": "Lexical",
        "risk": "high",
        "description": "The '@' symbol can mislead users about the true destination host.",
        "safe_description": "No deceptive '@' symbol detected in the URL authority.",
    },
    "Redirecting//": {
        "title": "Suspicious Double-Slash Redirect",
        "category": "Infrastructure",
        "risk": "medium",
        "description": "Extra '//' segments may indicate redirect-based obfuscation.",
        "safe_description": "No suspicious double-slash redirect pattern detected.",
    },
    "PrefixSuffix-": {
        "title": "Hyphenated Domain Label",
        "category": "Lexical",
        "risk": "low",
        "description": "Hyphens in the domain may mimic legitimate brand names.",
        "safe_description": "Domain label does not use suspicious hyphenation.",
    },
    "SubDomains": {
        "title": "Excessive Subdomain Depth",
        "category": "Infrastructure",
        "risk": "medium",
        "description": "Multiple nested subdomains can indicate deceptive URL structure.",
        "safe_description": "Subdomain depth appears normal.",
    },
    "HTTPS": {
        "title": "Unencrypted HTTP Protocol",
        "category": "Transport Security",
        "risk": "high",
        "description": "No TLS/SSL certificate present. Transmission is vulnerable to interception.",
        "safe_description": "Traffic encrypted via HTTPS protocol.",
        "safe_title": "Valid HTTPS Protocol",
        "safe_risk": "safe",
    },
    "DomainRegLen": {
        "title": "Short Domain Registration Period",
        "category": "Domain Intelligence",
        "risk": "medium",
        "description": "Domain registration length is shorter than typical legitimate sites.",
        "safe_description": "Domain registration period appears established.",
    },
    "Favicon": {
        "title": "External Favicon Source",
        "category": "Page Content",
        "risk": "medium",
        "description": "Favicon is loaded from a different domain than the page host.",
        "safe_description": "Favicon source matches the page domain.",
    },
    "NonStdPort": {
        "title": "Non-Standard Port Usage",
        "category": "Infrastructure",
        "risk": "medium",
        "description": "Page is served on a non-standard HTTP/HTTPS port.",
        "safe_description": "Standard web port usage detected.",
    },
    "HTTPSDomainURL": {
        "title": "HTTPS Token in Domain",
        "category": "Lexical",
        "risk": "high",
        "description": "The literal 'https' token appears inside the domain portion of the URL.",
        "safe_description": "Domain portion does not embed deceptive protocol tokens.",
    },
    "RequestURL": {
        "title": "External Page Resources",
        "category": "Page Content",
        "risk": "medium",
        "description": "Most linked resources originate outside the page domain.",
        "safe_description": "Linked resources predominantly belong to the same domain.",
    },
    "AnchorURL": {
        "title": "External Anchor Links",
        "category": "Page Content",
        "risk": "medium",
        "description": "Anchor links mostly point to external domains.",
        "safe_description": "Anchor links mostly remain on the same domain.",
    },
    "LinksInScriptTags": {
        "title": "Links Embedded in Scripts",
        "category": "Page Content",
        "risk": "medium",
        "description": "Script blocks contain embedded external URLs.",
        "safe_description": "No suspicious embedded links found in script tags.",
    },
    "ServerFormHandler": {
        "title": "Off-Domain Form Handler",
        "category": "Page Content",
        "risk": "high",
        "description": "Form submission target points away from the current domain.",
        "safe_description": "Form handlers appear to stay on the same domain.",
    },
    "InfoEmail": {
        "title": "Email-Based Form Submission",
        "category": "Page Content",
        "risk": "medium",
        "description": "Page forms submit sensitive information via email handlers.",
        "safe_description": "No email-based form submission pattern detected.",
    },
    "AbnormalURL": {
        "title": "Abnormal Final URL",
        "category": "Infrastructure",
        "risk": "high",
        "description": "Resolved page URL domain differs from the requested host.",
        "safe_description": "Final URL domain matches the requested host.",
    },
    "WebsiteForwarding": {
        "title": "Cross-Domain Forwarding",
        "category": "Infrastructure",
        "risk": "medium",
        "description": "Request was forwarded to a different registered domain.",
        "safe_description": "No suspicious cross-domain forwarding detected.",
    },
    "StatusBarCust": {
        "title": "Status Bar Manipulation",
        "category": "Page Content",
        "risk": "low",
        "description": "JavaScript may attempt to customize the browser status bar.",
        "safe_description": "No status bar manipulation patterns detected.",
    },
    "DisableRightClick": {
        "title": "Right-Click Disabled",
        "category": "Page Content",
        "risk": "low",
        "description": "Page scripts attempt to disable the browser context menu.",
        "safe_description": "No right-click blocking behavior detected.",
    },
    "UsingPopupWindow": {
        "title": "Popup Window Usage",
        "category": "Page Content",
        "risk": "medium",
        "description": "JavaScript opens popup windows, a common phishing tactic.",
        "safe_description": "No popup-window behavior detected.",
    },
    "IframeRedirection": {
        "title": "Cross-Domain Iframe",
        "category": "Page Content",
        "risk": "high",
        "description": "Page embeds iframes from external domains.",
        "safe_description": "No suspicious cross-domain iframe redirection detected.",
    },
    "AgeofDomain": {
        "title": "Recently Registered Domain",
        "category": "Domain Intelligence",
        "risk": "high",
        "description": "Domain appears younger than six months.",
        "safe_description": "Domain age appears established.",
    },
    "DNSRecording": {
        "title": "Missing DNS/WHOIS Records",
        "category": "Domain Intelligence",
        "risk": "medium",
        "description": "WHOIS lookup did not return expected DNS registration records.",
        "safe_description": "DNS/WHOIS records were found for the domain.",
    },
    "WebsiteTraffic": {
        "title": "Traffic Reputation Unknown",
        "category": "Reputation",
        "risk": "medium",
        "description": "Website traffic reputation data is unavailable in this scan scope.",
        "safe_description": "Website traffic reputation data is unavailable in this scan scope.",
    },
    "PageRank": {
        "title": "PageRank Data Unavailable",
        "category": "Reputation",
        "risk": "medium",
        "description": "External PageRank data is not queried in this hackathon build.",
        "safe_description": "External PageRank data is not queried in this hackathon build.",
    },
    "GoogleIndex": {
        "title": "Search Index Data Unavailable",
        "category": "Reputation",
        "risk": "medium",
        "description": "Google index presence is not queried in this hackathon build.",
        "safe_description": "Google index presence is not queried in this hackathon build.",
    },
    "LinksPointingToPage": {
        "title": "Backlink Data Unavailable",
        "category": "Reputation",
        "risk": "medium",
        "description": "Backlink reputation data is not queried in this hackathon build.",
        "safe_description": "Backlink reputation data is not queried in this hackathon build.",
    },
    "StatsReport": {
        "title": "Statistical Reputation Unavailable",
        "category": "Reputation",
        "risk": "medium",
        "description": "Third-party statistical reputation feeds are not queried in this build.",
        "safe_description": "Third-party statistical reputation feeds are not queried in this build.",
    },
}


def normalize_url(url_str: str) -> str:
    clean_url = url_str.strip()
    if not clean_url.startswith(("http://", "https://")):
        return "https://" + clean_url
    return clean_url


def is_valid_url(url_str: str) -> bool:
    if not url_str or len(url_str) > 2048:
        return False
    if " " in url_str or "\n" in url_str or "\t" in url_str:
        return False
    normalized = normalize_url(url_str)
    parsed = urlparse(normalized)
    if parsed.scheme not in ("http", "https"):
        return False
    host = parsed.netloc.split("@")[-1].split(":")[0]
    return bool(host)


def extract_host_info(url_str: str) -> tuple[str, str, bool]:
    normalized = normalize_url(url_str)
    parsed = urlparse(normalized)
    host = parsed.netloc.split("@")[-1]
    has_http = parsed.scheme == "http"
    has_ip = bool(re.search(r"^\d{1,3}(?:\.\d{1,3}){3}$", host.split(":")[0]))
    protocol = "HTTP (Unencrypted)" if has_http else "HTTPS (TLS Encrypted)"
    return normalized, host, has_ip, protocol


def build_signals(features: dict[str, int], predicted_class: int, top_n: int = 5) -> list[dict]:
    importances = MODEL.feature_importances_
    scored = []

    for idx, feature_name in enumerate(FEATURE_COLUMNS):
        value = features.get(feature_name, 0)
        importance = importances[idx]
        aligns = (predicted_class == 1 and value == 1) or (predicted_class == -1 and value == -1)
        if not aligns or value == 0:
            continue
        scored.append((importance, feature_name, value))

    scored.sort(reverse=True, key=lambda item: item[0])
    selected = scored[:top_n]
    signals = []

    for _, feature_name, value in selected:
        meta = FEATURE_LABELS.get(feature_name, {})
        is_safe_signal = predicted_class == -1 and value == -1
        title = meta.get("safe_title", meta.get("title", feature_name)) if is_safe_signal else meta.get("title", feature_name)
        risk = meta.get("safe_risk", meta.get("risk", "medium")) if is_safe_signal else meta.get("risk", "medium")
        description = meta.get("safe_description", meta.get("description", "Feature contributed to the model decision.")) if is_safe_signal else meta.get("description", "Feature contributed to the model decision.")
        signals.append(
            {
                "title": title,
                "category": meta.get("category", "Model Feature"),
                "risk": risk,
                "description": description,
            }
        )

    if not signals:
        if predicted_class == 1:
            signals.append(
                {
                    "title": "Model Phishing Classification",
                    "category": "Machine Learning",
                    "risk": "high",
                    "description": "The trained RandomForest model classified this URL as phishing based on combined feature patterns.",
                }
            )
        else:
            signals.append(
                {
                    "title": "Reputable Domain Pattern",
                    "category": "Reputation",
                    "risk": "safe",
                    "description": "No anomalous lexical or structural traits detected.",
                }
            )

    return signals


def analyze_with_model(url_str: str) -> dict:
    normalized, host, has_ip, protocol = extract_host_info(url_str)
    features = extract_features(normalized)
    row = pd.DataFrame([[features[col] for col in FEATURE_COLUMNS]], columns=FEATURE_COLUMNS)

    prediction = int(MODEL.predict(row)[0])
    probabilities = MODEL.predict_proba(row)[0]
    phishing_probability = float(probabilities[PHISHING_CLASS_INDEX])
    confidence = float(max(probabilities))
    risk_score = int(round(phishing_probability * 100))

    if risk_score >= 70:
        verdict = "Phishing"
        verdict_level = "danger"
    elif risk_score >= 40:
        verdict = "Suspicious"
        verdict_level = "warning"
    else:
        verdict = "Safe"
        verdict_level = "success"

    signals = build_signals(features, prediction)

    return {
        "url": normalized,
        "domain": host,
        "protocol": protocol,
        "ip_detected": "Yes" if has_ip else "No",
        "risk_score": risk_score,
        "verdict": verdict,
        "verdict_level": verdict_level,
        "analyzed_at": datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC"),
        "confidence": confidence,
        "signals": signals,
    }


def format_uptime(seconds: float) -> str:
    total_minutes = int(seconds // 60)
    hours, minutes = divmod(total_minutes, 60)
    return f"{hours}h {minutes}m"


@app.route("/api/health", methods=["GET"])
def health():
    return jsonify(
        {
            "status": "ok",
            "model_loaded": MODEL is not None,
            "engine": "SecureIQ AI Threat Pipeline v1.0",
        }
    )


@app.route("/api/stats", methods=["GET"])
def stats():
    uptime_seconds = time.monotonic() - START_TIME
    return jsonify(
        {
            "total_scans": 0,
            "phishing_detected": 0,
            "uptime": format_uptime(uptime_seconds),
        }
    )


@app.route("/api/analyze", methods=["POST"])
@app.route("/analyze", methods=["POST"])
def analyze():
    data = request.get_json(silent=True) or request.form
    url = (data.get("url") or "").strip()

    if not url:
        return jsonify({"error": "URL parameter is required."}), 400

    if not is_valid_url(url):
        return jsonify({"error": "Malformed URL. Provide a valid http(s) URL."}), 400

    try:
        with ThreadPoolExecutor(max_workers=1) as executor:
            future = executor.submit(analyze_with_model, url)
            result = future.result(timeout=ANALYZE_TIMEOUT_SECONDS)
        return jsonify(result)
    except FuturesTimeoutError:
        return jsonify({"error": "Analysis timed out after 8 seconds."}), 504
    except Exception as exc:
        return jsonify({"error": f"Analysis failed: {exc}"}), 500


@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve(path):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    if os.path.exists(os.path.join(app.static_folder, "index.html")):
        return send_from_directory(app.static_folder, "index.html")
    return jsonify({"status": "ok", "model_loaded": True})


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
