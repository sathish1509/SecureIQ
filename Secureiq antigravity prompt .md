# Build Prompt — SecureIQ

Paste everything below into Antigravity as your build brief.

---

## Product

Build **SecureIQ**, an AI-powered phishing and malicious-URL/email detection platform for security teams and everyday users. It combines a machine-learning model, heuristic analysis, and live threat intelligence to score URLs and emails in real time, with a fully explainable risk breakdown (not a black-box score).

This is a **real, professional SaaS product** — think Stripe, Vercel, Linear, Datadog — not a hackathon demo or a portfolio piece. Every screen should read as something a Fortune 500 security team would trust and pay for.

## Design direction — explicit

**Do not use glassmorphism.** No frosted-glass panels, no backdrop-blur cards, no translucent layers stacked over busy backgrounds. That look reads as "AI demo," not "enterprise software."

Instead, build in an **Enterprise Minimalism / Trust & Authority** direction:
- Solid, opaque surfaces with crisp 1px borders — not blur.
- Flat or near-flat cards with restrained elevation: one soft, low-opacity drop shadow, not glow effects.
- Generous whitespace and a strict grid. Confidence comes from restraint, not decoration.
- Sharp, precise data visualization (charts, gauges, tables) — this is a security analytics product, so the UI should feel closer to a monitoring/observability dashboard than a marketing site.
- Motion is subtle and functional: fade/slide-in on load, smooth number/chart transitions, hover states with 150–250ms easing. No floating orbs, no constant ambient animation, no particle effects.
- Avoid the generic "AI product" purple/pink gradient wash. If gradients are used at all, keep them small and purposeful (a logo mark, a single CTA, a chart fill) — never as a full-bleed background.

**Reference the attached brand kit exactly** (palette hex values, gradient names, typography — Poppins for headings/nav/cards, Inter for body/tables/forms, the given type scale and 8px spacing system). Reinterpret the same colors and fonts through a flatter, more corporate execution instead of the glass/glow treatment.

## Brand

- Name: **SecureIQ** (wordmark: "SECURE" in white/near-black, "IQ" in the accent blue — no "AI" suffix, no shield-and-network cliché icon; design a simpler, geometric mark — e.g., a monogram or an abstract lock/checkmark form).
- Voice: precise, calm, authoritative. Plain verbs, no hype ("Detect phishing before it reaches your inbox," not "Revolutionize your security posture with next-gen AI").
- Tone throughout copy: an analyst briefing a colleague, not a marketer selling a dream.

## Pages to build

### 1. Landing Page
- Solid nav bar (not transparent-over-hero), logo, nav links, Login, primary "Get Started" button.
- Hero: headline + subheadline + primary CTA ("Start Scanning") + secondary CTA ("View Live Demo"). Hero visual should be a real product screenshot/mock (e.g., a risk-score card or dashboard snippet) in a clean device frame — not an abstract animated illustration.
- Feature grid: URL Scanner, Email Scanner, AI Detection, Explainable Risk Score, Browser Protection, Threat Intelligence.
- Proof/stats band: scan volume, detection accuracy, threats blocked, average scan time.
- Logo strip or short customer-trust section (placeholder company names is fine).
- Footer with Product / Company / Legal columns.

### 2. Login Page
- Centered card on a plain, solid background (no blur). Email, password, remember me, forgot password, Login button, "Continue with Google," sign-up link.

### 3. Dashboard
- Left sidebar: Dashboard, URL Scanner, Email Scanner, History, Reports, Settings, Logout.
- Top stat cards: URLs Scanned, Safe, Suspicious, Malicious.
- Threat trend chart (line/area, phishing detections over time).
- Recent activity table (URL, Status, Risk, Time).
- Quick actions panel.

### 4. URL Scanner
- Large input, Analyze button, example URL link.
- Multi-step scan progress (Checking Domain → Checking SSL → Analyzing URL Structure → Running AI Model → Generating Risk Score).
- Results: URL, risk score, risk badge, confidence, threat level.
- Explanation panel listing concrete signals (domain age, keywords, redirects, SSL status, etc.).
- Recommendation: Do Not Visit / Proceed Carefully / Safe to Visit.

### 5. Email Scanner
- Paste email or upload .eml.
- Extracted fields: sender, reply-to, subject, attachments, embedded URLs.
- AI analysis: urgency detection, social engineering detection, sender spoofing, fake branding, malicious links.
- Output: risk score, reasons, recommendations.

### 6. Scan Report
- Summary, circular risk gauge, ML prediction score, heuristic score, threat intelligence matches, feature-importance breakdown, confidence meter, timeline of scan steps.
- Export: Download PDF, Share Report, Copy Link.

### 7. History
- Table of past scans (URL, Date, Risk, Category, Result) with filters (Today, Last Week, Safe, Suspicious, Malicious) and search. Row click opens the full report.

### 8. Threat Intelligence
- Threat feed, top phishing domains, latest attacks, trending threats, a country/region map, and category cards (Malware, Phishing, Scam, Botnet, Ransomware).

### 9. Browser Extension Popup
- Current URL, scan status, risk score, reasons, Open Dashboard / Scan Again / Report Website actions.

### 10. Notification States
- Safe (green), Suspicious (yellow), Dangerous (red) — each with message and Leave Website / Continue Anyway actions.

### 11. Settings
- Profile, password, dark mode, language, notifications, auto-scan, API keys, threat-intelligence toggle, history retention.

### 12. User Profile
- Avatar, name, email, organization, total scans, security score, account settings.

### 13. About / 14. Help Center
- Standard informational pages: mission, technology, how it works, privacy, contact, FAQs, docs, support, tutorials, feedback.

## Navigation flow

```
Landing → Login → Dashboard → {URL Scanner, Email Scanner, History, Threat Intel}
URL Scanner / Email Scanner → Scan Report → Export
```

## Build priority

Build in this order and confirm each stage before moving to the next: **(1) Landing → (2) Login → (3) Dashboard → (4) URL Scanner → (5) Scan Report**, then the remaining pages.

## Technical

- Stack: React + Tailwind CSS (component library such as shadcn/ui is welcome for tables, dropdowns, and dialogs — keep components flat/bordered, not glass).
- Fully responsive: 375px, 768px, 1024px, 1440px breakpoints.
- Real charting library for the trend chart and gauges (e.g., Recharts).
- Accessible: visible focus states, 4.5:1 text contrast minimum, `prefers-reduced-motion` respected, no color-only status indicators (pair with icon + label).

## Pre-delivery checklist

- [ ] No glassmorphism, no blur, no floating gradient orbs
- [ ] No emoji-as-icon; use a proper icon set (Lucide/Heroicons)
- [ ] Solid card surfaces with 1px borders and a single restrained shadow
- [ ] cursor-pointer on all interactive elements, consistent hover/focus states
- [ ] Every status/risk indicator pairs color with an icon and text label
- [ ] Copy sounds like an analyst, not an ad
- [ ] Consistent 8px spacing grid and the provided type scale throughout