import React from 'react';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="flex flex-col gap-8">
      {/* Hero Section */}
      <section className="bg-surface border border-brandBorder rounded-md p-8 shadow-sm">
        <div className="mb-6">
          <span className="text-xs font-mono font-medium text-brandText-muted bg-subtle px-2 py-1 border border-brandBorder-subtle rounded-sm mb-3 inline-block">
            AI-POWERED THREAT ENGINE v1.0
          </span>
          <h1 className="font-heading text-3xl font-semibold text-brandText-main tracking-tight leading-tight">
            Real-Time Phishing & Malicious URL / Email Detection
          </h1>
          <p className="text-base text-brandText-muted mt-2 max-w-[720px]">
            Protect your organization and users with machine learning inference, lexical heuristics, and explainable risk vectors—scoring malicious URLs and emails in milliseconds.
          </p>
          <div className="flex items-center gap-4 mt-6">
            <Link to="/scanner" className="btn-primary btn-lg">Start Scanning Now</Link>
            <Link to="/about" className="btn-secondary btn-lg">Explore Technology</Link>
          </div>
        </div>

        {/* Quick Test Strip */}
        <div className="flex items-center gap-2 flex-wrap pt-3 border-t border-brandBorder-subtle mt-6">
          <span className="text-xs font-semibold text-brandText-muted uppercase tracking-wider mr-1">
            Try Live Scanners:
          </span>
          <Link to="/scanner" className="bg-subtle text-brandText-secondary border border-brandBorder rounded-sm px-2 py-1 font-mono text-xs hover:bg-hover hover:text-brandText-main transition-colors no-underline">
            URL Scanner →
          </Link>
          <Link to="/email-scanner" className="bg-subtle text-brandText-secondary border border-brandBorder rounded-sm px-2 py-1 font-mono text-xs hover:bg-hover hover:text-brandText-main transition-colors no-underline">
            Email Scanner →
          </Link>
          <Link to="/threat-intel" className="bg-subtle text-brandText-secondary border border-brandBorder rounded-sm px-2 py-1 font-mono text-xs hover:bg-hover hover:text-brandText-main transition-colors no-underline">
            Threat Intelligence Feed →
          </Link>
        </div>
      </section>

      {/* 6-Feature Grid */}
      <section className="pt-2">
        <h2 className="font-heading text-xl font-semibold text-brandText-main mb-6">
          Enterprise Security Features
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-surface border border-brandBorder rounded-md p-6 shadow-sm flex flex-col gap-3 hover:border-brandBorder-strong hover:shadow-md transition-all">
            <div className="w-10 h-10 bg-subtle border border-brandBorder-subtle rounded-sm flex items-center justify-center font-bold font-mono text-accentBlue text-base">URL</div>
            <h3 className="font-heading text-base font-semibold text-brandText-main">URL Scanner</h3>
            <p className="text-sm text-brandText-muted leading-normal">Inspect domain age, typosquatting vectors, double extensions, raw IP hosts, and SSL certificate validity instantly.</p>
            <Link to="/scanner" className="font-mono text-xs text-accentBlue no-underline mt-auto">Open Scanner →</Link>
          </div>

          <div className="bg-surface border border-brandBorder rounded-md p-6 shadow-sm flex flex-col gap-3 hover:border-brandBorder-strong hover:shadow-md transition-all">
            <div className="w-10 h-10 bg-subtle border border-brandBorder-subtle rounded-sm flex items-center justify-center font-bold font-mono text-accentBlue text-base">EML</div>
            <h3 className="font-heading text-base font-semibold text-brandText-main">Email Scanner</h3>
            <p className="text-sm text-brandText-muted leading-normal">Paste raw email headers or upload <code className="bg-subtle px-1 rounded">.eml</code> files to detect sender spoofing, fake branding, and urgent social engineering.</p>
            <Link to="/email-scanner" className="font-mono text-xs text-accentBlue no-underline mt-auto">Analyze Email →</Link>
          </div>

          <div className="bg-surface border border-brandBorder rounded-md p-6 shadow-sm flex flex-col gap-3 hover:border-brandBorder-strong hover:shadow-md transition-all">
            <div className="w-10 h-10 bg-subtle border border-brandBorder-subtle rounded-sm flex items-center justify-center font-bold font-mono text-accentBlue text-base">ML</div>
            <h3 className="font-heading text-base font-semibold text-brandText-main">AI Detection Engine</h3>
            <p className="text-sm text-brandText-muted leading-normal">Trained on multi-million threat corpora using gradient boosting and NLP lexical tokenizers to flag zero-day phishing.</p>
            <Link to="/about" className="font-mono text-xs text-accentBlue no-underline mt-auto">Model Architecture →</Link>
          </div>

          <div className="bg-surface border border-brandBorder rounded-md p-6 shadow-sm flex flex-col gap-3 hover:border-brandBorder-strong hover:shadow-md transition-all">
            <div className="w-10 h-10 bg-subtle border border-brandBorder-subtle rounded-sm flex items-center justify-center font-bold font-mono text-accentBlue text-base">EXP</div>
            <h3 className="font-heading text-base font-semibold text-brandText-main">Explainable Risk Score</h3>
            <p className="text-sm text-brandText-muted leading-normal">No black boxes. Every scan generates concrete evidence: Shannon entropy, domain age metrics, and severity indicators.</p>
            <Link to="/report" className="font-mono text-xs text-accentBlue no-underline mt-auto">View Sample Report →</Link>
          </div>

          <div className="bg-surface border border-brandBorder rounded-md p-6 shadow-sm flex flex-col gap-3 hover:border-brandBorder-strong hover:shadow-md transition-all">
            <div className="w-10 h-10 bg-subtle border border-brandBorder-subtle rounded-sm flex items-center justify-center font-bold font-mono text-accentBlue text-base">EXT</div>
            <h3 className="font-heading text-base font-semibold text-brandText-main">Browser Protection</h3>
            <p className="text-sm text-brandText-muted leading-normal">Lightweight extension popup delivers instant notifications (Safe, Suspicious, Dangerous) before you submit credentials.</p>
            <Link to="/extension" className="font-mono text-xs text-accentBlue no-underline mt-auto">Preview Extension →</Link>
          </div>

          <div className="bg-surface border border-brandBorder rounded-md p-6 shadow-sm flex flex-col gap-3 hover:border-brandBorder-strong hover:shadow-md transition-all">
            <div className="w-10 h-10 bg-subtle border border-brandBorder-subtle rounded-sm flex items-center justify-center font-bold font-mono text-accentBlue text-base">INT</div>
            <h3 className="font-heading text-base font-semibold text-brandText-main">Threat Intelligence</h3>
            <p className="text-sm text-brandText-muted leading-normal">Real-time threat feeds tracking top phishing domains, active botnet C2 servers, and regional campaign matrices.</p>
            <Link to="/threat-intel" className="font-mono text-xs text-accentBlue no-underline mt-auto">Explore Feed →</Link>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="bg-surface border border-brandBorder rounded-md p-8 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="font-heading text-xl font-semibold text-brandText-main mb-2">Ready to secure your credentials and traffic?</h3>
          <p className="text-sm text-brandText-muted">Scan any suspicious link or email right now—no installation required.</p>
        </div>
        <div className="flex gap-3 shrink-0">
          <Link to="/scanner" className="btn-primary">Scan a URL</Link>
          <Link to="/dashboard" className="btn-secondary">Go to Dashboard</Link>
        </div>
      </section>
    </div>
  );
}
