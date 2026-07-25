# SecureIQ — AI-Powered Threat Intelligence & Phishing Detection Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Python 3.10+](https://img.shields.io/badge/Python-3.10%2B-brightgreen.svg)](https://www.python.org/)
[![React 18](https://img.shields.io/badge/React-18-blue.svg)](https://react.dev/)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)](https://www.docker.com/)

**SecureIQ** is an enterprise-grade, AI-powered threat detection platform built for security operations teams and organizational users. It combines a machine learning classification engine, heuristic web analysis, WHOIS domain intelligence, DOM inspection, and an SQLite scan persistence layer to score suspicious URLs in real-time — delivering a fully explainable risk breakdown.

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
  6. **Email Scanner** (`/email-scanner`): Email header and body analyzer detecting social engineering, urgency cues, spoofed senders, and malicious embedded links.
  7. **Scan History** (`/history`): Filterable archive of past URL scans fetched directly from the SQLite database.
  8. **Threat Intelligence** (`/threat-intel`): Live feed of top phishing domains, attack categories (Ransomware, Phishing, Botnet), and regional attack distribution.
  9. **Browser Extension Popup** (`/extension`): Simulation of the SecureIQ browser extension for instant site checks.
  10. **Notifications** (`/notifications`): Centralized alert center categorized by Safe, Suspicious, and Dangerous risk levels.
  11. **Settings** (`/settings`): Profile, security settings, API key management, dark mode, and retention policies.
  12. **User Profile** (`/profile`): User account details, scan stats, and enterprise organization membership.
  13. **About Page** (`/about`): Architecture breakdown, mission statement, and detection methodology.
  14. **Coming Soon / Fallback** (`/coming-soon`): Clean fallback page for upcoming features.

### 2. Python Flask AI Backend, SQLite Persistence & Feature Extractor
- **Trained RandomForest Classifier**: Pre-trained Scikit-Learn model (`Model/phishing_model.pkl`) evaluating **30 UCI Phishing Website features**.
- **SQLite Database Persistence (`database.py`)**:
  - Automatically initializes `scans.db` and `scans` table on startup.
  - Persists target URLs, extracted host domain, verdict (`Phishing`, `Suspicious`, `Safe`), risk score (0-100), confidence, signal reasons, and ISO timestamps.
  - Provides fast aggregation queries for dashboard KPI stats (`get_stats()`), scan history (`get_recent_scans()`), and date-grouped daily detection trends (`get_daily_trend()`).
- **Live Feature Extraction Pipeline** (`feature_extractor.py`):
  - **Lexical Analysis**: IP literal host check, long URL detection, shortener domain resolution (`bit.ly`, `t.co`, etc.), '@' symbol abuse, hyphenated domain labels, subdomain depth, and `https` token misuse.
  - **Domain Intelligence**: Thread-safe WHOIS lookups for domain creation date, expiration period, domain age (>180 days check), and DNS record availability.
  - **DOM & Page Content Parser**: Live HTTP fetching using BeautifulSoup4 to detect cross-domain favicons, non-standard port usage (outside 80/443), external resource link ratios (`RequestURL`, `AnchorURL`), embedded links in script tags, off-domain form handlers, mailto form submissions, cross-domain forwarding, and iframe redirections.
- **Explainable Risk Engine**: Maps model feature importances to concrete human-readable risk signals (High, Medium, Safe) to eliminate black-box prediction ambiguity.

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
               └───────────┬─────────────────┬───────────┘
                           │                 │
                           ▼                 ▼
             ┌────────────────────────┐  ┌────────────────────────┐
             │ SQLite Storage         │  │ RandomForest Model     │
             │ (database.py / scans.db│  │ (Model/phishing_model) │
             └────────────────────────┘  └────────────────────────┘
```

---

## 🔌 API Documentation

### 1. Health Check
- **Endpoint**: `GET /api/health`
- **Response**:
```json
{
  "status": "ok",
  "model_loaded": true,
  "engine": "SecureIQ AI Threat Pipeline v1.0"
}
```

### 2. System Statistics
- **Endpoint**: `GET /api/stats`
- **Response**:
```json
{
  "total_scans": 12,
  "phishing_count": 3,
  "suspicious_count": 2,
  "safe_count": 7,
  "avg_risk_score": 38.5,
  "uptime": "1h 24m"
}
```

### 3. Scan History Log
- **Endpoint**: `GET /api/history?limit=20`
- **Response**: Array of scan records ordered by ID descending.

### 4. Daily Detection Trend
- **Endpoint**: `GET /api/trend?days=7`
- **Response**: Array of scan counts grouped by date for the last N days (`[{"date": "2026-07-25", "total": 12, "phishing": 3, "safe": 9}, ...]`).

### 5. Fetch Single Scan Report by ID
- **Endpoint**: `GET /api/scan/<id>`
- **Response**: Full scan result payload matching the given scan ID.

### 6. Analyze URL / Threat Scan
- **Endpoint**: `POST /api/analyze` (or `POST /analyze`)
- **Request Body**:
```json
{
  "url": "https://example-phishing-domain.com/login"
}
```
- **Sample Response**:
```json
{
  "url": "https://example-phishing-domain.com/login",
  "domain": "example-phishing-domain.com",
  "protocol": "HTTPS (TLS Encrypted)",
  "ip_detected": "No",
  "risk_score": 85,
  "verdict": "Phishing",
  "verdict_level": "danger",
  "confidence": 0.89,
  "analyzed_at": "2026-07-25 13:40:00 UTC",
  "signals": [
    {
      "title": "Short Domain Registration Period",
      "category": "Domain Intelligence",
      "risk": "high",
      "description": "Domain registration length is shorter than typical legitimate sites."
    }
  ]
}
```

---

## 🐳 Dockerization (Backend & Fullstack)

The backend and database services are containerized using Docker, persistent named volumes, and production-ready WSGI server (**Gunicorn**).

### Option A: Running Backend Standalone with Docker Compose (Recommended)

1. **Build and Start Backend**:
   ```bash
   docker-compose up -d --build
   ```
2. **Verify Container Health**:
   ```bash
   docker-compose ps
   curl http://localhost:5000/api/health
   ```
3. **Stop Backend**:
   ```bash
   docker-compose down
   ```

### Option B: Building Backend Docker Image Directly

1. **Build Backend Image**:
   ```bash
   docker build -t secureiq-backend -f Dockerfile.backend .
   ```
2. **Run Container with Volume**:
   ```bash
   docker run -d -p 5000:5000 --name secureiq-backend -e PORT=5000 -e CORS_ORIGINS="*" -v secureiq_data:/app/data secureiq-backend
   ```

### Option C: Multi-Stage Unified Container (React SPA + Python Flask)

1. **Build Unified Image**:
   ```bash
   docker build -t secureiq-fullstack -f Dockerfile .
   ```
2. **Run Container**:
   ```bash
   docker run -d -p 5000:5000 --name secureiq-fullstack secureiq-fullstack
   ```

---

## 💻 Local Development Setup

### Prerequisites
- **Node.js**: v18+ and `npm`
- **Python**: v3.10+ and `pip`

### 1. Backend Setup
```bash
# Install Python dependencies
pip install -r requirements.txt

# Start Flask development server
python app.py
```
The API server will start on `http://localhost:5000`.

### 2. Frontend Setup
```bash
# Install Node dependencies
npm install

# Start Vite development server
npm run dev
```
The React frontend will start on `http://localhost:5173`.

---

## 📁 Repository Structure

```
SecureIQ/
├── app.py                      # Flask REST API server & Gunicorn entrypoint
├── database.py                 # SQLite database persistence layer (scans.db)
├── feature_extractor.py        # 30-feature UCI phishing extraction engine
├── requirements.txt            # Python backend dependencies
├── Dockerfile                  # Multi-stage Dockerfile (React SPA + Flask)
├── Dockerfile.backend          # Dedicated standalone backend Dockerfile
├── docker-compose.yml          # Docker Compose orchestration & data volume
├── .dockerignore               # Files excluded from Docker builds
├── Model/                      # ML Model Assets
│   ├── phishing_model.pkl      # Trained RandomForest Classifier
│   └── feature_columns.pkl     # Feature column names matching UCI schema
├── src/                        # React Frontend Source Code
│   ├── App.jsx                 # Main Router & Application layout
│   ├── index.css               # Tailwind CSS & custom design tokens
│   ├── components/             # Reusable UI components (Navbar, Sidebar, Charts)
│   ├── context/                # React Authentication Context
│   ├── utils/                  # Plain JS utilities (timeAgo.js)
│   └── pages/                  # 14 Full Application Pages
├── package.json                # Frontend NPM dependencies & scripts
├── tailwind.config.js          # Tailwind CSS theme configuration
└── README.md                   # Project documentation
```

---

## 🛡️ License

Distributed under the MIT License. See `LICENSE` for more details.
