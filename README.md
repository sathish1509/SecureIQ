# SecureIQ — AI-Powered Phishing URL & Email Threat Detection Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Python 3.10+](https://img.shields.io/badge/Python-3.10%2B-brightgreen.svg)](https://www.python.org/)
[![React 18](https://img.shields.io/badge/React-18-blue.svg)](https://react.dev/)
[![Flask](https://img.shields.io/badge/Flask-3.0%2B-red.svg)](https://flask.palletsprojects.org/)
[![Deploy on Vercel](https://img.shields.io/badge/Vercel-Deployed-black.svg)](https://secure-iq-iwv4.vercel.app)
[![Deploy on Render](https://img.shields.io/badge/Render-Deployed-informational.svg)](https://secureiq-0g5n.onrender.com/api/health)

> **InnovaHack Chapter-1 Submission** | **Domain:** Cybersecurity — *Phishing & Malicious URL Detector*

SecureIQ is a multi-vector, AI-driven threat intelligence platform built to detect phishing URLs and deceptive emails in real time. By combining a Scikit-Learn **RandomForestClassifier** trained on 30 lexical and structural web features with real-time **URLhaus** and **VirusTotal API v3** lookups, SecureIQ provides actionable, fully explainable threat breakdowns rather than black-box scores.

---

## 🌐 Live Deployments

- **Live Web Application (Vercel):** [https://secure-iq-iwv4.vercel.app](https://secure-iq-iwv4.vercel.app)
- **Live Backend API (Render):** [https://secureiq-0g5n.onrender.com](https://secureiq-0g5n.onrender.com)
- **API Health Check:** [https://secureiq-0g5n.onrender.com/api/health](https://secureiq-0g5n.onrender.com/api/health)

---

## 📋 Table of Contents

- [Problem Statement](#-problem-statement)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [System Architecture](#-system-architecture)
- [How It Works](#-how-it-works)
- [API Endpoints](#-api-endpoints)
- [Model Details](#-model-details)
- [Local Setup](#-local-setup)
- [Known Limitations](#-known-limitations)
- [Team Information](#-team-information)
- [License](#-license)

---

## 🎯 Problem Statement

Phishing attacks remain the leading entry vector for enterprise security breaches and credential theft. Traditional blocklists struggle to catch zero-day phishing sites, while plain machine-learning models lack real-time threat intelligence cross-referencing and contextual email analysis.

**SecureIQ** addresses this problem statement by providing:
1. **Multi-Vector Detection:** Fusing machine learning lexical analysis with live malware threat feeds.
2. **Explainable Attribution:** Breaking down the specific risk indicators (IP host usage, domain age, typosquatting, urgency language) behind every verdict.
3. **Email Body & Header Inspection:** Extracting embedded payload links for ML scoring while evaluating header spoofing and brand lookalikes.

---

## ✨ Key Features

- **Real-Time URL Scanning:** Extracts 30 structural, domain, and lexical features to score suspicious links on a `0-100` risk scale.
- **Multi-Vector Threat Intelligence:** Cross-references submitted targets against **URLhaus (abuse.ch)** and **VirusTotal API v3** (70+ security engines).
- **Independent Email Analyzer:** Extracts embedded payload links and scores each via the ML model pipeline, alongside heuristic checks for:
  - Sender vs. Reply-To domain mismatches.
  - Typosquatting & brand lookalikes (via Levenshtein distance checks for `PayPal`, `Amazon`, `Microsoft`, `Google`, `Apple`, `Bank of America`).
  - Artificial pressure/urgency phrases (`act now`, `suspended`, `24 hours`, `verify immediately`).
  - Impersonal generic salutations (`Dear Customer`, `Dear User`).
  - Credential-harvesting calls-to-action near links.
- **Explainable Attribution:** Renders individual risk cards detailing exact signals instead of a non-transparent score.
- **Dynamic Telemetry Timeline:** Measures precise stage-by-stage latency (`t0` to `t4`) via `time.perf_counter()`.
- **Stateless User Authentication:** JWT-based authentication with `bcrypt` password hashing supporting registered accounts and anonymous scans.
- **Persistent Analytics Dashboard:** Tracks total scans, detected phishing counts, daily trend charts, and filterable history logs.
- **Shareable Assessment Reports:** Permalinks accessible at `/report/:scanId` with one-click clipboard copying.

---

## 💻 Tech Stack

| Component | Technology | Description / Role |
| :--- | :--- | :--- |
| **Frontend** | React 18, Vite, React Router | Responsive, single-page application with enterprise design system |
| **Hosting (Frontend)** | Vercel | Production CDN hosting with wildcard route rewrites (`vercel.json`) |
| **Backend** | Python 3.10+, Flask, Gunicorn | REST API serving inference, heuristics, threat lookups, and auth |
| **Hosting (Backend)** | Render | WSGI web service deployment with CORS configuration (`Procfile`, `render.yaml`) |
| **Machine Learning** | Scikit-learn, Pandas, Joblib | RandomForestClassifier trained on 30 URL features |
| **Threat Intelligence**| URLhaus API, VirusTotal v3 API | Real-time external reputation lookups with 4s fail-safe timeouts |
| **Database** | SQLite3 / PostgreSQL | Persistent scan history and user account storage |
| **Auth & Security** | PyJWT, bcrypt | Stateless 24-hour Bearer JWT authentication & salted password hashing |

---

## 🏗️ System Architecture

```
                      ┌───────────────────────────────────────┐
                      │      React 18 SPA (Vercel CDN)        │
                      └───────────────────┬───────────────────┘
                                          │ HTTP REST API (JWT Bearer)
                                          ▼
                      ┌───────────────────────────────────────┐
                      │    Python Flask API (Render WSGI)     │
                      └─────┬─────────────┬─────────────┬─────┘
                            │             │             │
        ┌───────────────────┘             │             └───────────────────┐
        ▼                                 ▼                                 ▼
┌──────────────┐                 ┌─────────────────┐               ┌──────────────────┐
│  SQLite DB   │                 │ Scikit-Learn ML │               │ Threat Intel APIs│
│ (scans.db)   │                 │ (RandomForest)  │               │ (URLhaus + VT)   │
└──────────────┘                 └─────────────────┘               └──────────────────┘
```

---

## ⚙️ How It Works

1. **Submission & Feature Extraction (`t0` - `t1`):** User submits a URL or raw email text. For URLs, `feature_extractor.py` extracts 30 features (IP host detection, scheme, length, subdomains, WHOIS age, etc.). For emails, `email_analyzer.py` extracts embedded URLs and evaluates header fields.
2. **ML Model Inference (`t1` - `t2`):** The 30-feature vector is fed into `phishing_model.pkl` (`RandomForestClassifier`), generating a baseline probability score and verdict (`Phishing` vs `Safe`).
3. **Multi-Vector Threat Intelligence (`t2` - `t3`):** Target URLs are queried against URLhaus and VirusTotal v3 APIs via `threat_intel.py`. Confirmed detections add weighted risk boosts (`+20` for URLhaus, `+10` for VirusTotal).
4. **Verdict Blending & Timeline Telemetry (`t3` - `t4`):** Risk scores are blended, explainable signal cards are compiled, and high-resolution timing counters compute stage latency.
5. **Persistence & Presentation (`t4`):** The scan record is saved to SQLite (`scans.db`) and returned to the React frontend for display in the command dashboard or detailed assessment report.

---

## 🔌 API Endpoints

| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Backend engine health and ML model status check | Public |
| `POST` | `/api/analyze` | Scans a target URL and returns blended risk score, signals, and timing | Optional |
| `POST` | `/api/analyze-email` | Analyzes email text, extracts embedded URLs, and checks headers | Optional |
| `GET` | `/api/stats` | Fetches aggregate scan counts, phishing detections, and average risk | Optional |
| `GET` | `/api/history` | Returns recent scan log records (filtered by user if authenticated) | Optional |
| `GET` | `/api/trend` | Returns 7-day scan and threat count trend metrics | Public |
| `GET` | `/api/scan/<id>` | Retrieves a single saved scan report by ID | Public |
| `POST` | `/api/auth/register` | Registers a new user account and returns a 24-hour JWT token | Public |
| `POST` | `/api/auth/login` | Authenticates email/password credentials and returns a JWT token | Public |
| `GET` | `/api/auth/me` | Fetches authenticated user account details | Required |

---

## 🤖 Model Details

- **Dataset:** [UCI Phishing Websites Dataset](https://archive.ics.uci.edu/ml/datasets/phishing+websites)
- **Sample Size:** ~11,000 web page samples (balanced phishing & safe URLs)
- **Features (30):** `UsingIP`, `LongURL`, `ShortURL`, `Symbol@`, `Redirecting//`, `PrefixSuffix-`, `SubDomains`, `HTTPS`, `DomainRegLen`, `Favicon`, `NonStdPort`, `HTTPSDomainURL`, `RequestURL`, `AnchorURL`, `LinksInScriptTags`, `ServerFormHandler`, `InfoEmail`, `AbnormalURL`, `WebsiteForwarding`, `StatusBarCust`, `DisableRightClick`, `UsingPopupWindow`, `IframeRedirection`, `AgeofDomain`, `DNSRecording`, `WebsiteTraffic`, `PageRank`, `GoogleIndex`, `LinksPointingToPage`, `StatsReport`.
- **Classifier:** Scikit-Learn `RandomForestClassifier` (100 estimators)
- **Model File:** `Model/phishing_model.pkl`

---

## 🛠️ Local Setup

### Prerequisites
- Python 3.10+
- Node.js 18+ & npm

### 1. Backend Setup (Python Flask)
```bash
# Clone the repository
git clone https://github.com/sathish1509/SecureIQ.git
cd SecureIQ

# Create a virtual environment (optional but recommended)
python -m venv venv
# On Windows: venv\Scripts\activate | On macOS/Linux: source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create environment configuration
cp .env.example .env

# Run the Flask backend development server
python app.py
```
*The backend API will run locally at `http://localhost:5000`.*

### 2. Frontend Setup (React / Vite)
```bash
# In the project root directory
npm install

# Start the Vite development server
npm run dev
```
*The React frontend will run locally at `http://localhost:3000` (or `http://localhost:5173`).*

---

## ⚠️ Known Limitations

1. **Static Reputation Fallbacks:** 5 out of the 30 UCI features (`WebsiteTraffic`, `PageRank`, `GoogleIndex`, `LinksPointingToPage`, `StatsReport`) fall back to neutral values during live scanning because commercial Alexa/PageRank live lookup APIs require paid enterprise subscriptions.
2. **Render Free-Tier Cold Starts:** The backend API hosted on Render's free tier spins down after inactivity. The first request after a sleep period may take ~30–50 seconds to complete while the container boots.
3. **URLhaus & VirusTotal API Rate Limits:** VirusTotal v3 free API keys have a rate limit of 4 requests/minute. If exceeded, the fail-safe fallback gracefully relies on the ML model without crashing the scan.

---

## 👥 Team Information

- **Team Name:** [Insert Team Name]
- **Team Leader:** Sathish Kumar ([@sathish1509](https://github.com/sathish1509))
- **Team Members:**
  - Varshan ([@Varshan](https://github.com/))
  - [Member 2]
  - [Member 3]

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
