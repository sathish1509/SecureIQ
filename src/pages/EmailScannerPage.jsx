import React, { useState } from 'react';

export default function EmailScannerPage() {
  const [tab, setTab] = useState('paste');
  const [rawInput, setRawInput] = useState('');
  const [showResults, setShowResults] = useState(false);

  const sampleEmail = `From: PayPal Security Team <notice-update-alert99@service-paypal-verify.xyz>
To: victim.user@corporate-domain.com
Subject: ACTION REQUIRED: Unusual login attempt from Moscow, Russia
Reply-To: support-paypal-security@consultant.ru

Dear Customer,
We noticed an unauthorized login to your account from IP 185.220.101.5. 
To secure your funds, you must verify your identity immediately by clicking the secure portal link below:

http://192.168.1.1/paypal/verify-account.login.xyz

If you do not verify within 24 hours, your account will be frozen permanently.

PayPal Security Operations`;

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowResults(true);
  };

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-heading text-2xl font-semibold text-brandText-main">AI Email Phishing & Header Scanner</h1>
        <p className="text-sm text-brandText-muted mt-1">Detect sender spoofing, high-urgency social engineering, fake corporate branding, and embedded malware payload links.</p>
      </div>

      <div className="bg-surface border border-brandBorder rounded-md p-8 shadow-sm">
        <div className="flex gap-4 mb-4">
          <button 
            type="button" 
            className={`px-3 py-1 text-xs font-medium border rounded-sm cursor-pointer ${tab === 'paste' ? 'bg-navy text-white border-navy' : 'bg-surface text-brandText-secondary border-brandBorder'}`}
            onClick={() => setTab('paste')}
          >
            Paste Raw Email Body / Headers
          </button>
          <button 
            type="button" 
            className={`px-3 py-1 text-xs font-medium border rounded-sm cursor-pointer ${tab === 'upload' ? 'bg-navy text-white border-navy' : 'bg-surface text-brandText-secondary border-brandBorder'}`}
            onClick={() => setTab('upload')}
          >
            Upload .EML File
          </button>
        </div>

        {tab === 'paste' ? (
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2">
              <label htmlFor="raw-email-input" className="text-xs font-semibold text-brandText-secondary">Raw Email Content or Header Text</label>
              <textarea 
                id="raw-email-input" 
                value={rawInput}
                onChange={(e) => setRawInput(e.target.value)}
                className="h-36 p-3 font-mono text-xs leading-relaxed text-brandText-main bg-surface border border-brandBorder-strong rounded-md focus:outline-none focus:border-accentBlue focus:ring-2 focus:ring-accentBlue/20" 
                placeholder="From: Security Desk <alert@security-update-center.com>&#10;To: target.user@company.com&#10;Subject: URGENT: Your Account will be suspended within 2 hours&#10;Reply-To: refund-dept@gmail.com&#10;&#10;Dear Customer, we detected suspicious logins..." 
                required
              />
            </div>
            <div className="flex justify-between items-center mt-4">
              <span className="text-xs font-semibold text-brandText-muted uppercase tracking-wider">Quick Sample Email:</span>
              <div className="flex gap-2">
                <button type="button" className="bg-subtle text-brandText-secondary border border-brandBorder rounded-sm px-2 py-1 font-mono text-xs hover:bg-hover hover:text-brandText-main" onClick={() => setRawInput(sampleEmail)}>
                  Load Phishing EML Sample
                </button>
                <button type="submit" className="btn-primary">Analyze Email Content</button>
              </div>
            </div>
          </form>
        ) : (
          <div className="border-2 border-dashed border-brandBorder-strong rounded-md p-8 text-center bg-subtle">
            <div className="text-3xl mb-2">📁</div>
            <h3 className="text-base font-semibold mb-1">Drag & Drop <code className="bg-surface px-1">.eml</code> or <code className="bg-surface px-1">.msg</code> File Here</h3>
            <p className="text-xs text-brandText-muted mb-4">Supports raw RFC-822 email files up to 25MB</p>
            <input type="file" id="eml-file" accept=".eml,.msg,.txt" className="hidden" onChange={() => setShowResults(true)} />
            <button type="button" className="btn-secondary" onClick={() => document.getElementById('eml-file').click()}>Browse Files</button>
          </div>
        )}
      </div>

      {showResults && (
        <section className="flex flex-col gap-6">
          <div className="bg-surface border border-brandBorder rounded-md shadow-sm overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-[240px_1fr]">
              <div className="p-6 bg-subtle border-r border-brandBorder-subtle flex flex-col justify-center">
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="score-number text-4xl text-danger-text">91</span>
                  <span className="score-scale">/100</span>
                </div>
                <div className="score-meter-track"><div className="score-meter-fill meter-danger" style={{ width: '91%' }}></div></div>
              </div>

              <div className="p-6 flex flex-col justify-center">
                <div className="flex items-center gap-4 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-brandText-muted">EMAIL THREAT VERDICT</span>
                  <span className="verdict-badge badge-danger">High-Risk Phishing Attempt</span>
                </div>
                <p className="text-sm text-brandText-secondary">
                  This email uses artificial urgency ("suspended within 2 hours"), mismatching Reply-To address headers, and embeds a known malicious credential harvesting URL.
                </p>
                <div className="mt-3 p-3 rounded-sm bg-danger-bg text-danger-text border border-danger-border font-semibold text-sm">
                  RECOMMENDATION: 🚫 DO NOT CLICK LINKS OR REPLY. Quarantined for security review.
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-surface border border-brandBorder rounded-md p-4 shadow-sm flex flex-col gap-1">
              <span className="text-xs font-semibold text-brandText-muted uppercase">Extracted Sender (From)</span>
              <span className="text-xs font-mono font-semibold text-danger-text break-all">Security Desk &lt;alert@security-update-center.com&gt;</span>
            </div>
            <div className="bg-surface border border-brandBorder rounded-md p-4 shadow-sm flex flex-col gap-1">
              <span className="text-xs font-semibold text-brandText-muted uppercase">Header Reply-To Mismatch</span>
              <span className="text-xs font-mono font-semibold text-danger-text break-all">refund-dept@gmail.com ⚠️</span>
            </div>
            <div className="bg-surface border border-brandBorder rounded-md p-4 shadow-sm flex flex-col gap-1">
              <span className="text-xs font-semibold text-brandText-muted uppercase">Subject Line</span>
              <span className="text-xs font-semibold text-brandText-main">URGENT: Your Account will be suspended...</span>
            </div>
            <div className="bg-surface border border-brandBorder rounded-md p-4 shadow-sm flex flex-col gap-1">
              <span className="text-xs font-semibold text-brandText-muted uppercase">Embedded Payload Links</span>
              <span className="text-xs font-mono font-semibold text-danger-text">1 High Risk URL Flagged</span>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
