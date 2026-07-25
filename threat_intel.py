"""
Threat Intelligence Module for SecureIQ.
Integrates URLhaus (abuse.ch) and VirusTotal v3 API lookups.
All functions are non-blocking / fail-safe with short timeouts (4 seconds).
Returns None on any error or timeout.
"""

from __future__ import annotations

import os
import time
import requests

TIMEOUT_SECONDS = 4


def check_urlhaus(url: str) -> dict | None:
    """
    Queries URLhaus API by abuse.ch (no API key required).
    POST https://urlhaus-api.abuse.ch/v1/url/
    Body (form-encoded): {"url": url}

    Returns:
        {"flagged": bool, "threat_type": str | None, "reference": str | None, "tags": list} or None on failure/timeout
    """
    try:
        api_url = "https://urlhaus-api.abuse.ch/v1/url/"
        response = requests.post(
            api_url,
            data={"url": url},
            timeout=TIMEOUT_SECONDS,
            headers={"User-Agent": "SecureIQ-Threat-Scanner/1.0"},
        )
        if response.status_code != 200:
            return None

        data = response.json()
        status = data.get("query_status")

        if status == "ok":
            threat = data.get("threat")
            reference = data.get("urlhaus_reference")
            tags = data.get("tags") or []
            return {
                "flagged": True,
                "threat_type": threat,
                "reference": reference,
                "tags": tags,
            }
        elif status == "no_results":
            return {
                "flagged": False,
                "threat_type": None,
                "reference": None,
                "tags": [],
            }
        return None
    except Exception:
        return None


def check_virustotal(url: str, api_key: str | None = None) -> dict | None:
    """
    Queries VirusTotal API v3 for URL analysis.
    Requires VIRUSTOTAL_KEY environment variable or explicit api_key param.
    Flow: POST submit URL -> GET analysis result (poll up to 3 times, 1s apart).

    Returns:
        {"malicious_count": int, "total_engines": int, "flagged": bool} or None on failure/timeout
    """
    key = api_key or os.environ.get("VIRUSTOTAL_KEY")
    if not key or key.strip() == "" or key == "your_virustotal_api_key_here":
        return None

    headers = {
        "x-apikey": key.strip(),
        "User-Agent": "SecureIQ-Threat-Scanner/1.0",
    }

    try:
        # Step 1: Submit URL for scanning
        submit_url = "https://www.virustotal.com/api/v3/urls"
        sub_resp = requests.post(
            submit_url,
            data={"url": url},
            headers=headers,
            timeout=TIMEOUT_SECONDS,
        )
        if sub_resp.status_code not in (200, 201):
            return None

        sub_json = sub_resp.json()
        analysis_id = sub_json.get("data", {}).get("id")
        if not analysis_id:
            return None

        # Step 2: Poll analysis results (max 3 attempts, 1 second apart)
        analysis_url = f"https://www.virustotal.com/api/v3/analyses/{analysis_id}"
        stats = None

        for attempt in range(3):
            time.sleep(1)
            poll_resp = requests.get(
                analysis_url,
                headers=headers,
                timeout=TIMEOUT_SECONDS,
            )
            if poll_resp.status_code == 200:
                poll_json = poll_resp.json()
                attrs = poll_json.get("data", {}).get("attributes", {})
                status = attrs.get("status")
                if status == "completed":
                    stats = attrs.get("stats", {})
                    break

        if not stats:
            return None

        malicious_count = int(stats.get("malicious", 0))
        total_engines = sum(int(v) for v in stats.values())
        flagged = malicious_count > 0

        return {
            "malicious_count": malicious_count,
            "total_engines": total_engines,
            "flagged": flagged,
        }
    except Exception:
        return None
