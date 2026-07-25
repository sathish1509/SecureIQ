import os
from flask import Flask, render_template, request, jsonify, send_from_directory
import time
from datetime import datetime, timezone
import re

app = Flask(__name__, static_folder='dist', static_url_path='')
try:
    from flask_cors import CORS
    CORS(app)
except ImportError:
    pass

def analyze_url_heuristics(url_str):
    """
    Placeholder analysis engine.
    In the future, this will hook directly into the ML model (phishing_model.pkl).
    For now, it generates structured dummy responses with intelligent heuristic rules.
    """
    clean_url = url_str.strip()
    if not clean_url.startswith(("http://", "https://")):
        clean_url_with_proto = "https://" + clean_url
    else:
        clean_url_with_proto = clean_url

    url_lower = clean_url.lower()
    
    # Simple extraction helpers for dummy display
    has_http = url_lower.startswith("http://")
    has_ip = bool(re.search(r'https?://\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}', url_lower)) or bool(re.match(r'^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}', clean_url))
    suspicious_keywords = ["login", "verify", "secure", "update", "banking", "paypal", "account", "signin", "checkpoint", "confirm", "free", "claim"]
    keyword_matches = [kw for kw in suspicious_keywords if kw in url_lower]
    suspicious_tld = any(url_lower.endswith(tld) or f"{tld}/" in url_lower for tld in [".xyz", ".tk", ".top", ".club", ".work", ".gq", ".ml", ".site"])

    signals = []
    
    # Calculate score heuristically for demo fidelity
    base_score = 12

    if has_ip:
        base_score += 35
        signals.append({
            "title": "Raw IP Address Host",
            "category": "Infrastructure",
            "risk": "high",
            "description": "URL targets an IP address directly instead of a domain name."
        })

    if has_http:
        base_score += 25
        signals.append({
            "title": "Unencrypted HTTP Protocol",
            "category": "Transport Security",
            "risk": "high",
            "description": "No TLS/SSL certificate present. Transmission is vulnerable to interception."
        })
    else:
        signals.append({
            "title": "Valid HTTPS Protocol",
            "category": "Transport Security",
            "risk": "safe",
            "description": "Traffic encrypted via HTTPS protocol."
        })

    if keyword_matches:
        base_score += 20 * len(keyword_matches)
        signals.append({
            "title": f"Targeted Keywords ({', '.join(keyword_matches[:3])})",
            "category": "Pattern Analysis",
            "risk": "high",
            "description": f"URL path or query contains keywords commonly used in credentials harvesting."
        })

    if suspicious_tld:
        base_score += 20
        signals.append({
            "title": "High-Risk TLD Classifier",
            "category": "Domain Intelligence",
            "risk": "medium",
            "description": "Domain extension is statistically linked to high rates of phishing deployment."
        })

    if len(clean_url) > 65:
        base_score += 15
        signals.append({
            "title": "Abnormally Long URL Length",
            "category": "Lexical",
            "risk": "medium",
            "description": f"URL length ({len(clean_url)} chars) exceeds 95th percentile standard."
        })

    if url_lower.count("-") > 3:
        base_score += 10
        signals.append({
            "title": "Excessive Hyphenation",
            "category": "Lexical",
            "risk": "low",
            "description": "Domain contains multiple hyphens used to mimic legitimate organization names."
        })

    # Clamp score
    risk_score = min(max(base_score, 4), 98)

    if risk_score >= 70:
        verdict = "Phishing"
        verdict_level = "danger"
    elif risk_score >= 40:
        verdict = "Suspicious"
        verdict_level = "warning"
    else:
        verdict = "Safe"
        verdict_level = "success"
        if not signals:
            signals.append({
                "title": "Reputable Domain Pattern",
                "category": "Reputation",
                "risk": "safe",
                "description": "No anomalous lexical or structural traits detected."
            })

    # Extract pseudo host
    domain_match = re.search(r'https?://([^/]+)', clean_url_with_proto)
    host_domain = domain_match.group(1) if domain_match else clean_url.split('/')[0]

    return {
        "url": clean_url_with_proto,
        "domain": host_domain,
        "protocol": "HTTP (Unencrypted)" if has_http else "HTTPS (TLS Encrypted)",
        "ip_detected": "Yes" if has_ip else "No",
        "risk_score": risk_score,
        "verdict": verdict,
        "verdict_level": verdict_level,
        "analyzed_at": datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC"),
        "metrics": {
            "domain_age": "3 days" if risk_score > 50 else "8+ years",
            "subdomains": url_lower.count('.'),
            "url_length": len(clean_url),
            "entropy": "4.65 bits/char" if risk_score > 50 else "3.12 bits/char"
        },
        "signals": signals
    }

@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "online", "engine": "SecureIQ AI Threat Pipeline v1.0"})

@app.route("/analyze", methods=["POST"])
def analyze():
    data = request.get_json(silent=True) or request.form
    url = data.get("url", "").strip()
    
    if not url:
        return jsonify({
            "error": "URL parameter is required."
        }), 400

    # Add a brief 300ms realistic delay for frontend loading state testing
    time.sleep(0.3)
    
    result = analyze_url_heuristics(url)
    return jsonify(result)

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    if os.path.exists(os.path.join(app.static_folder, 'index.html')):
        return send_from_directory(app.static_folder, 'index.html')
    return jsonify({"status": "online", "engine": "SecureIQ AI Threat Pipeline v1.0"})

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)