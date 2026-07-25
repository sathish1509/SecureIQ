import React from 'react';
import { Link } from 'react-router-dom';

export default function NotificationsPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-heading text-2xl font-semibold text-brandText-main mb-1">Browser & In-App Security Notification States</h1>
        <p className="text-sm text-brandText-muted">Standardized visual alerts presented when users navigate to analyzed targets.</p>
      </div>

      {/* Dangerous Alert */}
      <section className="signals-container">
        <div className="signals-header bg-danger-bg border-b-danger-border">
          <div className="flex items-center gap-3">
            <span className="verdict-badge badge-danger">1. DANGEROUS STATE (RED)</span>
            <h2 className="signals-title text-danger-text">High-Risk Phishing Warning</h2>
          </div>
          <span className="font-mono text-xs text-danger-text">Risk Score: 94/100</span>
        </div>
        <div className="p-6 bg-danger-bg flex flex-col gap-4">
          <div className="flex gap-4 items-start">
            <div className="text-4xl leading-none">🛑</div>
            <div>
              <h3 className="text-base font-bold text-danger-text">Warning: Malicious Phishing Site Detected</h3>
              <p className="text-sm text-danger-text mt-1">
                SecureIQ prevented access to <code className="bg-surface/50 px-1 rounded">http://192.168.1.1/paypal/verify-account.login.xyz</code> because it attempts to steal credentials or financial passwords.
              </p>
            </div>
          </div>
          <div className="flex gap-3 mt-2">
            <button type="button" className="btn-primary bg-[#991b1b] border-[#991b1b]" onClick={() => alert('Redirecting back to safety...')}>🛡️ Leave Website Immediately (Recommended)</button>
            <button type="button" className="btn-outline text-danger-text border-danger-border" onClick={() => window.confirm('Warning: This site is unsafe. Are you sure you want to proceed?') && alert('Proceeding at your own risk.')}>Continue Anyway (Unsafe)</button>
          </div>
        </div>
      </section>

      {/* Suspicious Alert */}
      <section className="signals-container">
        <div className="signals-header bg-warn-bg border-b-warn-border">
          <div className="flex items-center gap-3">
            <span className="verdict-badge badge-warning">2. SUSPICIOUS STATE (YELLOW)</span>
            <h2 className="signals-title text-warn-text">Medium Risk Anomaly Flag</h2>
          </div>
          <span className="font-mono text-xs text-warn-text">Risk Score: 62/100</span>
        </div>
        <div className="p-6 bg-warn-bg flex flex-col gap-4">
          <div className="flex gap-4 items-start">
            <div className="text-4xl leading-none">⚠️</div>
            <div>
              <h3 className="text-base font-bold text-warn-text">Caution: Suspicious Domain Attributes Detected</h3>
              <p className="text-sm text-warn-text mt-1">
                The target <code className="bg-surface/50 px-1 rounded">http://secure-update-banking-verification.com/login</code> contains brand keywords and recent domain creation traits. Exercise extreme caution.
              </p>
            </div>
          </div>
          <div className="flex gap-3 mt-2">
            <button type="button" className="btn-primary bg-[#92400e] border-[#92400e]" onClick={() => alert('Returning to safe dashboard...')}>🛡️ Return to Safety</button>
            <button type="button" className="btn-outline text-warn-text border-warn-border" onClick={() => alert('Proceeding with caution.')}>Proceed Carefully</button>
          </div>
        </div>
      </section>

      {/* Safe Alert */}
      <section className="signals-container">
        <div className="signals-header bg-safe-bg border-b-safe-border">
          <div className="flex items-center gap-3">
            <span className="verdict-badge badge-safe">3. SAFE STATE (GREEN)</span>
            <h2 className="signals-title text-safe-text">Verified Legitimate Domain</h2>
          </div>
          <span className="font-mono text-xs text-safe-text">Risk Score: 04/100</span>
        </div>
        <div className="p-6 bg-safe-bg flex flex-col gap-4">
          <div className="flex gap-4 items-start">
            <div className="text-4xl leading-none">✅</div>
            <div>
              <h3 className="text-base font-bold text-safe-text">Domain Verified Safe to Visit</h3>
              <p className="text-sm text-safe-text mt-1">
                Target <code className="bg-surface/50 px-1 rounded">https://google.com</code> possesses valid SSL encryption, established domain reputation, and zero threat anomalies.
              </p>
            </div>
          </div>
          <div className="flex gap-3 mt-2">
            <button type="button" className="btn-primary bg-[#065f46] border-[#065f46]" onClick={() => alert('Navigating to target...')}>Continue to Website</button>
            <Link to="/scanner" className="btn-outline text-safe-text border-safe-border">Rescan Target</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
