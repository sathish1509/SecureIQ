"""
SQLite Database Layer for SecureIQ Scan Persistence & Analytics
"""

import json
import os
import sqlite3
from datetime import datetime, timedelta, timezone

DB_PATH = os.getenv("DATABASE_PATH", os.path.join(os.path.dirname(__file__), "scans.db"))


def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    with get_db_connection() as conn:
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS scans (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                url TEXT NOT NULL,
                domain TEXT,
                verdict TEXT NOT NULL,
                risk_score INTEGER NOT NULL,
                confidence REAL NOT NULL,
                reasons TEXT,
                scanned_at TEXT NOT NULL
            );
            """
        )
        conn.commit()


def save_scan(scan_dict: dict) -> int:
    url = scan_dict.get("url", "")
    domain = scan_dict.get("domain", "")
    verdict = scan_dict.get("verdict", "Safe")
    risk_score = int(scan_dict.get("risk_score", 0))
    confidence = float(scan_dict.get("confidence", 0.0))

    signals = scan_dict.get("signals") or scan_dict.get("reasons") or []
    reasons_json = json.dumps(signals)

    scanned_at = scan_dict.get("analyzed_at")
    if not scanned_at:
        scanned_at = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC")

    with get_db_connection() as conn:
        cursor = conn.execute(
            """
            INSERT INTO scans (url, domain, verdict, risk_score, confidence, reasons, scanned_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            """,
            (url, domain, verdict, risk_score, confidence, reasons_json, scanned_at),
        )
        conn.commit()
        return cursor.lastrowid


def get_scan_by_id(scan_id: int) -> dict | None:
    with get_db_connection() as conn:
        cursor = conn.execute(
            """
            SELECT id, url, domain, verdict, risk_score, confidence, reasons, scanned_at
            FROM scans
            WHERE id = ?
            """,
            (scan_id,),
        )
        row = cursor.fetchone()
        if not row:
            return None

        reasons_data = []
        if row["reasons"]:
            try:
                reasons_data = json.loads(row["reasons"])
            except Exception:
                reasons_data = []

        return {
            "id": row["id"],
            "url": row["url"],
            "domain": row["domain"],
            "verdict": row["verdict"],
            "risk_score": row["risk_score"],
            "confidence": row["confidence"],
            "reasons": reasons_data,
            "signals": reasons_data,
            "scanned_at": row["scanned_at"],
        }


def get_recent_scans(limit: int = 20) -> list[dict]:
    with get_db_connection() as conn:
        cursor = conn.execute(
            """
            SELECT id, url, domain, verdict, risk_score, confidence, reasons, scanned_at
            FROM scans
            ORDER BY id DESC
            LIMIT ?
            """,
            (limit,),
        )
        rows = cursor.fetchall()
        result = []
        for row in rows:
            reasons_data = []
            if row["reasons"]:
                try:
                    reasons_data = json.loads(row["reasons"])
                except Exception:
                    reasons_data = []

            result.append(
                {
                    "id": row["id"],
                    "url": row["url"],
                    "domain": row["domain"],
                    "verdict": row["verdict"],
                    "risk_score": row["risk_score"],
                    "confidence": row["confidence"],
                    "reasons": reasons_data,
                    "signals": reasons_data,
                    "scanned_at": row["scanned_at"],
                }
            )
        return result


def get_stats() -> dict:
    with get_db_connection() as conn:
        cursor = conn.execute(
            """
            SELECT 
                COUNT(*) as total_scans,
                SUM(CASE WHEN verdict = 'Phishing' THEN 1 ELSE 0 END) as phishing_count,
                SUM(CASE WHEN verdict = 'Suspicious' THEN 1 ELSE 0 END) as suspicious_count,
                SUM(CASE WHEN verdict = 'Safe' THEN 1 ELSE 0 END) as safe_count,
                AVG(risk_score) as avg_risk_score
            FROM scans
            """
        )
        row = cursor.fetchone()

        total_scans = row["total_scans"] or 0
        phishing_count = row["phishing_count"] or 0
        suspicious_count = row["suspicious_count"] or 0
        safe_count = row["safe_count"] or 0
        avg_risk = round(float(row["avg_risk_score"]), 1) if row["avg_risk_score"] is not None else 0.0

        return {
            "total_scans": total_scans,
            "phishing_count": phishing_count,
            "phishing_detected": phishing_count,
            "suspicious_count": suspicious_count,
            "safe_count": safe_count,
            "safe_sites": safe_count,
            "avg_risk_score": avg_risk,
        }


def get_daily_trend(days: int = 7) -> list[dict]:
    today = datetime.now(timezone.utc).date()
    dates_map = {}
    for i in range(days - 1, -1, -1):
        d_str = (today - timedelta(days=i)).strftime("%Y-%m-%d")
        dates_map[d_str] = {"date": d_str, "total": 0, "phishing": 0, "safe": 0}

    with get_db_connection() as conn:
        cursor = conn.execute(
            """
            SELECT 
                substr(scanned_at, 1, 10) as scan_date,
                COUNT(*) as total,
                SUM(CASE WHEN verdict = 'Phishing' THEN 1 ELSE 0 END) as phishing,
                SUM(CASE WHEN verdict = 'Safe' THEN 1 ELSE 0 END) as safe
            FROM scans
            GROUP BY scan_date
            """
        )
        rows = cursor.fetchall()

        for row in rows:
            s_date = row["scan_date"]
            if s_date in dates_map:
                dates_map[s_date]["total"] = row["total"] or 0
                dates_map[s_date]["phishing"] = row["phishing"] or 0
                dates_map[s_date]["safe"] = row["safe"] or 0

    return list(dates_map.values())
