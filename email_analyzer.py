"""
Independent Email Scoring Module for SecureIQ.
Extracts embedded URLs and scores them using the real ML model pipeline,
while evaluating email-specific heuristics (domain mismatches, lookalikes, urgency, CTA).
"""

from __future__ import annotations

import re
from datetime import datetime, timezone


def _levenshtein_distance(s1: str, s2: str) -> int:
    if len(s1) < len(s2):
        return _levenshtein_distance(s2, s1)
    if len(s2) == 0:
        return len(s1)
    
    previous_row = list(range(len(s2) + 1))
    for i, c1 in enumerate(s1):
        current_row = [i + 1]
        for j, c2 in enumerate(s2):
            insertions = previous_row[j + 1] + 1
            deletions = current_row[j] + 1
            substitutions = previous_row[j] + (c1 != c2)
            current_row.append(min(insertions, deletions, substitutions))
        previous_row = current_row
    return previous_row[-1]


TARGET_BRANDS = [
    "paypal",
    "amazon",
    "microsoft",
    "google",
    "apple",
    "bankofamerica",
]

URGENCY_PHRASES = [
    "act now",
    "24 hours",
    "suspended",
    "verify immediately",
    "limited access",
    "unauthorized login",
    "account frozen",
    "action required",
    "unusual login",
    "immediate action",
    "within 2 hours",
]

GENERIC_GREETINGS = [
    "dear customer",
    "dear user",
    "dear account holder",
    "dear member",
    "valued customer",
]

CREDENTIAL_CTA_PHRASES = [
    "click here",
    "verify your account",
    "login to secure",
    "update your information",
    "confirm your identity",
    "secure portal link",
    "verify identity",
]


def extract_domain_from_email_string(email_str: str) -> str:
    if not email_str:
        return ""
    match = re.search(r"[\w\.-]+@([\w\.-]+\.[\w]+)", email_str)
    if match:
        return match.group(1).lower()
    if "@" in email_str:
        return email_str.split("@")[-1].strip("> \t\n\r").lower()
    return email_str.strip().lower()


def extract_and_score_urls(email_body: str, analyze_fn=None) -> list[dict]:
    if not email_body:
        return []

    url_pattern = re.compile(r"https?://[^\s<>'\"`\)]+", re.IGNORECASE)
    raw_urls = url_pattern.findall(email_body)
    unique_urls = list(dict.fromkeys([u.rstrip(".,;:") for u in raw_urls]))

    results = []
    for url in unique_urls:
        if analyze_fn:
            try:
                res = analyze_fn(url)
                results.append(res)
            except Exception:
                pass
    return results


def score_email_signals(
    sender: str,
    reply_to: str,
    subject: str,
    body: str,
) -> dict:
    score = 0
    reasons = []

    sender_domain = extract_domain_from_email_string(sender)
    reply_domain = extract_domain_from_email_string(reply_to)

    # 1. Sender vs Reply-To Domain Mismatch
    if sender_domain and reply_domain and sender_domain != reply_domain:
        score += 25
        reasons.append({
            "title": "Sender / Reply-To Domain Mismatch",
            "category": "Header Spoofing",
            "risk": "high",
            "description": f"Sender domain ('{sender_domain}') differs from Reply-To domain ('{reply_domain}').",
        })

    # 2. Brand Lookalike Domain Detection (Levenshtein distance)
    if sender_domain:
        domain_label = sender_domain.split(".")[0]
        for brand in TARGET_BRANDS:
            dist = _levenshtein_distance(domain_label, brand)
            if 0 < dist <= 2 and len(domain_label) >= 4:
                score += 30
                reasons.append({
                    "title": f"Brand Impersonation ({brand.capitalize()})",
                    "category": "Domain Intelligence",
                    "risk": "high",
                    "description": f"Sender domain label '{domain_label}' is a typosquatting lookalike of '{brand}'.",
                })
                break
            elif brand in domain_label and domain_label != brand:
                score += 25
                reasons.append({
                    "title": f"Brand Keyword Positioning ({brand.capitalize()})",
                    "category": "Domain Intelligence",
                    "risk": "medium",
                    "description": f"Sender domain label '{domain_label}' embeds brand name '{brand}'.",
                })
                break

    # 3. Urgency & Pressure Language Detection
    combined_text = f"{subject} {body}".lower()
    urgency_matches = [phrase for phrase in URGENCY_PHRASES if phrase in combined_text]
    if urgency_matches:
        match_count = len(urgency_matches)
        urgency_points = min(30, match_count * 10)
        score += urgency_points
        reasons.append({
            "title": "Artificial Urgency Language Detected",
            "category": "Social Engineering",
            "risk": "high" if match_count >= 2 else "medium",
            "description": f"Found {match_count} pressure phrase(s): {', '.join(urgency_matches[:3])}.",
        })

    # 4. Generic Greeting Detection
    body_lower = body.lower() if body else ""
    generic_greeting_found = any(greeting in body_lower[:200] for greeting in GENERIC_GREETINGS)
    if generic_greeting_found:
        score += 15
        reasons.append({
            "title": "Generic Unpersonalized Greeting",
            "category": "Content Inspection",
            "risk": "medium",
            "description": "Email uses an impersonal generic salutation ('Dear Customer') instead of a recipient name.",
        })

    # 5. Credential-Harvesting CTA Near Link
    cta_matches = [cta for cta in CREDENTIAL_CTA_PHRASES if cta in body_lower]
    has_http = "http://" in body_lower or "https://" in body_lower
    if cta_matches and has_http:
        score += 20
        reasons.append({
            "title": "Credential Harvesting CTA Near Payload Link",
            "category": "Call-To-Action Risk",
            "risk": "high",
            "description": f"Action phrase ('{cta_matches[0]}') paired with embedded hyperlink.",
        })

    final_subscore = min(100, score)
    return {
        "score": final_subscore,
        "reasons": reasons,
    }


def combine_email_verdict(
    url_scores: list[dict],
    email_signal_result: dict,
    sender: str,
    subject: str,
) -> dict:
    email_heuristic_score = email_signal_result.get("score", 0)
    email_reasons = list(email_signal_result.get("reasons", []))

    max_url_score = 0
    high_risk_url_flagged = False
    flagged_url_signals = []

    for item in url_scores:
        u_score = item.get("risk_score", 0)
        if u_score > max_url_score:
            max_url_score = u_score
        if u_score >= 70:
            high_risk_url_flagged = True
            flagged_url_signals.append({
                "title": f"Malicious Embedded URL ({item.get('domain', 'Link')})",
                "category": "ML Model (embedded URL)",
                "risk": "high",
                "description": f"Embedded URL '{item.get('url')}' scored {u_score}/100 Phishing by ML model.",
            })

    if high_risk_url_flagged:
        final_risk_score = max(max_url_score, email_heuristic_score)
    else:
        final_risk_score = max(email_heuristic_score, max_url_score)

    final_risk_score = min(100, max(0, final_risk_score))

    if final_risk_score >= 70:
        verdict = "Phishing"
        verdict_level = "danger"
    elif final_risk_score >= 40:
        verdict = "Suspicious"
        verdict_level = "warning"
    else:
        verdict = "Safe"
        verdict_level = "success"

    all_reasons = flagged_url_signals + email_reasons
    if not all_reasons:
        if verdict == "Safe":
            all_reasons.append({
                "title": "Email Heuristics Clean",
                "category": "Email Inspection",
                "risk": "safe",
                "description": "No header mismatch, lookalike domain, or pressure cues detected.",
            })

    sources_checked = ["Email Heuristics"]
    if url_scores:
        sources_checked.append("ML Model (embedded URL)")

    sender_domain = extract_domain_from_email_string(sender)

    return {
        "url": subject or "Email Inspection",
        "domain": sender_domain or sender or "Email Header",
        "sender": sender,
        "subject": subject,
        "verdict": verdict,
        "verdict_level": verdict_level,
        "risk_score": final_risk_score,
        "confidence": 0.95 if final_risk_score >= 70 else 0.85,
        "signals": all_reasons,
        "reasons": all_reasons,
        "sources_checked": sources_checked,
        "url_scores": url_scores,
        "analyzed_at": datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC"),
        "scan_type": "email",
    }
