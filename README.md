# SecureIQ — AI-Powered Threat Intelligence & Phishing Detection Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Python 3.10+](https://img.shields.io/badge/Python-3.10%2B-brightgreen.svg)](https://www.python.org/)
[![React 18](https://img.shields.io/badge/React-18-blue.svg)](https://react.dev/)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)](https://www.docker.com/)

**SecureIQ** is an enterprise-grade, AI-powered threat detection platform built for security operations teams and organizational users. It combines a machine learning classification engine, heuristic web analysis, WHOIS domain intelligence, DOM inspection, live multi-vector threat intelligence lookups (URLhaus & VirusTotal), independent email heuristic scanning, and an SQLite scan persistence layer to score suspicious URLs and emails in real-time — delivering a fully explainable risk breakdown.

---

## 📊 Summary of What Has Been Built

### 1. Enterprise UI & Design System
- **Design Philosophy**: Built around **Enterprise Minimalism / Trust & Authority**. Avoids glassmorphism and ambient glow clutter in favor of crisp 1px borders, solid opaque surfaces, soft restrained shadows, and an 8px layout grid.
- **Typography & Icons**: Styled with Google Fonts (**Poppins** for headers/navigation, **Inter** for data tables/forms/metrics) paired with **Lucide React** icons.
- **14 Production Pages**:
  1. **Landing Page** (`/`): High-converting SaaS landing page with hero CTA, product showcase, 6-feature grid, live proof band, and customer trust section.
  2. **Login Page** (`/login`): Clean enterprise authentication interface with email/password and single sign-on options.
  3. **Dashboard** (`/dashboard`): Dynamic security ops command center featuring live KPI metrics, 7-day threat trend chart (SVG/Recharts), inspection logs, and manual refresh telemetry.
  4. **URL Scanner** (`/scanner`): Real-time URL threat analyzer with step-by-step scan visualization, live progress states, and risk indicators.
  5. **Scan Report** (`/report`): Fully dynamic assessment report with circular risk gauge, feature importances, SSL status, WHOIS age, threat intel matches, timeline audit, and PDF export/print capabilities.
  6. **Email Scanner** (`/email-scanner`): Live email header & body analyzer detecting sender spoofing (From/Reply-To mismatch), brand lookalikes (Levenshtein distance), pressure language, generic greetings, CTAs, and embedded ML URL scoring.
  7. **Scan History** (`/history`): Filterable archive of past URL & Email scans fetched directly from the database.
  8. **Threat Intelligence** (`/threat-intel`): Live feed of top phishing domains, attack categories (Ransomware, Phishing, Botnet), and regional attack distribution.
  9. **Browser Extension Popup** (`/extension`): Simulation of the SecureIQ browser extension for instant site checks.
  10. **Notifications** (`/notifications`): Centralized alert center categorized by Safe, Suspicious, and Dangerous risk levels.
  11. **Settings** (`/settings`): Profile, security settings, API key management, dark mode, and retention policies.
  12. **User Profile** (`/profile`): User account details, scan stats, and enterprise organization membership.
  13. **About Page** (`/about`): Architecture breakdown, mission statement, and detection methodology.
  14. **Coming Soon / Fallback** (`/coming-soon`): Clean fallback page for upcoming features.

### 2. Python Flask AI Backend, Email Heuristics & SQLite Persistence
- **Trained RandomForest Classifier**: Pre-trained Scikit-Learn model (`Model/phishing_model.pkl`) evaluating **30 UCI Phishing Website features**.
- **Independent Email Analyzer (`email_analyzer.py`)**:
  - **`extract_and_score_urls(email_body)`**: Extracts all embedded URLs from the email body and scores each using the real ML model pipeline (`extract_features` + `MODEL.predict()`).
  - **`score_email_signals(sender, reply_to, subject, body)`**: Evaluates sender vs. reply-to domain mismatches, brand lookalikes via Levenshtein distance (`paypal`, `amazon`, `microsoft`, etc.), urgency language counts, generic greetings, and credential-harvesting CTAs.
  - **`combine_email_verdict(url_scores, email_signal_score)`**: Blends embedded ML URL scores with email heuristic sub-scores into an honest, unified verdict.
- **External Threat Intelligence Integration (`threat_intel.py`)**:
  - **URLhaus (abuse.ch)**: Queries active malicious URL database with 4s fail-safe timeout. Boosts risk score (+20) when flagged.
  - **VirusTotal API v3**: Submits and polls analysis results using `VIRUSTOTAL_KEY` with 4s fail-safe timeout. Boosts risk score (+10) when flagged.
- **SQLite Database Persistence (`database.py`)**:
  - Automatically initializes `scans.db` and `scans` table on startup (with `scan_type` column distinguishing `url` vs `email` scans).

---

## 🏗️ Architecture Overview

```
               ┌─────────────────────────────────────────┐
               │    React 18 + Vite + Tailwind Frontend  │
               └────────────────────┬────────────────────┘
                                    │ HTTP REST API
                                    ▼
               ┌─────────────────────────────────────────┐
               │       Python Flask API (app.py)         │
               └─────────┬──────────────┬────────────────┘
                         │              │
        ┌────────────────┼──────────────┼────────────────┐
        ▼                ▼              ▼                ▼
┌──────────────┐  ┌────────────┐  ┌────────────┐  ┌─────────────┐
│ SQLite DB    │  │ ML Model   │  │ ThreatIntel│  │ Email Engine│
│(database.py) │  │(RandomFor) │  │(URLhaus/VT)│  │(email_analy)│
└──────────────┘  └────────────┘  └────────────┘  └─────────────┘
```

---

## 🔌 API Documentation

### 1. Health Check
- **Endpoint**: `GET /api/health`

### 2. System Statistics
- **Endpoint**: `GET /api/stats`

### 3. Scan History Log
- **Endpoint**: `GET /api/history?limit=20`

### 4. Analyze URL / Threat Scan
- **Endpoint**: `POST /api/analyze` (or `POST /analyze`)

### 5. Analyze Email / Header & Body Scan
- **Endpoint**: `POST /api/analyze-email`
- **Request Body**:
```json
{
  "sender": "PayPal Security Team <notice@service-paypal-verify.xyz>",
  "reply_to": "support@consultant.ru",
  "subject": "ACTION REQUIRED: Account suspended",
  "body": "Dear Customer, click here to verify: http://192.168.1.1/paypal/login"
}
```
- **Sample Response**:
```json
{
  "url": "ACTION REQUIRED: Account suspended",
  "domain": "service-paypal-verify.xyz",
  "sender": "PayPal Security Team <notice@service-paypal-verify.xyz>",
  "subject": "ACTION REQUIRED: Account suspended",
  "verdict": "Phishing",
  "verdict_level": "danger",
  "risk_score": 100,
  "confidence": 0.95,
  "scan_type": "email",
  "signals": [
    {
      "title": "Sender / Reply-To Domain Mismatch",
      "category": "Header Spoofing",
      "risk": "high",
      "description": "Sender domain ('service-paypal-verify.xyz') differs from Reply-To domain ('consultant.ru')."
    },
    {
      "title": "Brand Keyword Positioning (Paypal)",
      "category": "Domain Intelligence",
      "risk": "medium",
      "description": "Sender domain label 'service-paypal-verify' embeds brand name 'paypal'."
    }
  ],
  "sources_checked": [
    "Email Heuristics",
    "ML Model (embedded URL)"
  ]
}
```

---

## 🐳 Dockerization (Backend & Fullstack)

The backend and database services are containerized using Docker, persistent named volumes, and production-ready WSGI server (**Gunicorn**).

### Option A: Running Backend Standalone with Docker Compose (Recommended)

```bash
docker-compose up -d --build
```

---

## 🛡️ License

Distributed under the MIT License. See `LICENSE` for more details.
