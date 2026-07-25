import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function EmailScannerPage() {
  const { token } = useAuth();
  const [tab, setTab] = useState('paste');
  const [rawInput, setRawInput] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

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

  const handleAnalyzeEmail = async (contentToScan) => {
    const textToAnalyze = contentToScan || rawInput;
    if (!textToAnalyze.trim()) {
      setErrorMsg('Please enter email content or raw header text to inspect.');
      return;
    }

    setErrorMsg('');
    setScanResult(null);
    setIsScanning(true);

    try {
      const headers = { 'Content-Type': 'application/json' };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch('/api/analyze-email', {
        method: 'POST',
        headers,
        body: JSON.stringify({ raw_text: textToAnalyze })
      });

      if (!response.ok) {
        throw new Error(`Email scan failed (HTTP ${response.status})`);
      }

      const data = await response.json();
      setScanResult(data);
    } catch (err) {
      console.error('Email analysis error:', err);
      setErrorMsg(err.message || 'Error occurred while submitting email content to scanner engine.');
    } finally {
      setIsScanning(false);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result || '';
      setRawInput(content);
      setTab('paste');
      handleAnalyzeEmail(content);
    };
    reader.onerror = () => {
      setErrorMsg('Failed to read uploaded email file.');
    };
    reader.readAsText(file);
  };

  const getVerdictBadge = (verdict) => {
    const v = (verdict || '').toLowerCase();
    if (v === 'phishing' || v === 'malicious') return <span className="verdict-badge badge-danger">High-Risk Phishing Attempt</span>;
    if (v === 'suspicious') return <span className="verdict-badge badge-warning">Suspicious Email Indicators</span>;
    return <span className="verdict-badge badge-safe">Safe Email Characteristics</span>;
  };

  const getRiskMeterClass = (score) => {
    const s = Number(score) || 0;
    if (s >= 70) return 'meter-danger text-danger-text';
    if (s >= 40) return 'meter-warning text-warn-text';
    return 'meter-safe text-safe-text';
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
          <form onSubmit={(e) => { e.preventDefault(); handleAnalyzeEmail(); }}>
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
            {errorMsg && (
              <div className="mt-2 text-xs text-danger-text bg-danger-bg border border-danger-border p-2.5 rounded-sm">
                {errorMsg}
              </div>
            )}
            <div className="flex justify-between items-center mt-4 flex-wrap gap-2">
              <span className="text-xs font-semibold text-brandText-muted uppercase tracking-wider">Quick Sample Email:</span>
              <div className="flex gap-2">
                <button 
                  type="button" 
                  disabled={isScanning}
                  className="bg-subtle text-brandText-secondary border border-brandBorder rounded-sm px-2 py-1 font-mono text-xs hover:bg-hover hover:text-brandText-main cursor-pointer" 
                  onClick={() => { setRawInput(sampleEmail); handleAnalyzeEmail(sampleEmail); }}
                >
                  Load Phishing EML Sample
                </button>
                <button type="submit" disabled={isScanning} className="btn-primary cursor-pointer disabled:opacity-60">
                  {isScanning ? 'Analyzing Email...' : 'Analyze Email Content'}
                </button>
              </div>
            </div>
          </form>
        ) : (
          <div className="border-2 border-dashed border-brandBorder-strong rounded-md p-8 text-center bg-subtle">
            <div className="text-3xl mb-2">📁</div>
            <h3 className="text-base font-semibold mb-1">Drag & Drop <code className="bg-surface px-1">.eml</code> or <code className="bg-surface px-1">.msg</code> File Here</h3>
            <p className="text-xs text-brandText-muted mb-4">Supports raw RFC-822 email files up to 25MB</p>
            <input type="file" id="eml-file" accept=".eml,.msg,.txt" className="hidden" onChange={handleFileUpload} />
            <button type="button" className="btn-secondary cursor-pointer" onClick={() => document.getElementById('eml-file').click()}>Browse Files</button>
          </div>
        )}
      </div>

      {isScanning && (
        <div className="p-8 bg-surface border border-brandBorder rounded-md text-center flex flex-col items-center gap-3 animate-pulse">
          <div className="w-8 h-8 border-2 border-accentBlue border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-semibold text-brandText-main">Running Multi-Vector Email & Embedded URL Analysis...</p>
          <p className="text-xs text-brandText-muted">Evaluating headers, Levenshtein brand lookalikes, social engineering urgency, and embedded payload URLs.</p>
        </div>
      )}

      {scanResult && !isScanning && (
        <section className="flex flex-col gap-6">
          {/* Main Verdict Summary Card */}
          <div className="bg-surface border border-brandBorder rounded-md shadow-sm overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-[240px_1fr]">
              <div className="p-6 bg-subtle border-r border-brandBorder-subtle flex flex-col justify-center">
                <div className="flex items-baseline gap-1 mb-2">
                  <span className={`score-number text-4xl ${scanResult.risk_score >= 70 ? 'text-danger-text' : scanResult.risk_score >= 40 ? 'text-warn-text' : 'text-safe-text'}`}>
                    {scanResult.risk_score}
                  </span>
                  <span className="score-scale">/100</span>
                </div>
                <div className="score-meter-track">
                  <div 
                    className={`score-meter-fill ${scanResult.risk_score >= 70 ? 'meter-danger' : scanResult.risk_score >= 40 ? 'meter-warning' : 'meter-safe'}`} 
                    style={{ width: `${scanResult.risk_score}%` }}
                  ></div>
                </div>
              </div>

              <div className="p-6 flex flex-col justify-center">
                <div className="flex items-center gap-4 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-brandText-muted">EMAIL THREAT VERDICT</span>
                  {getVerdictBadge(scanResult.verdict)}
                </div>
                <p className="text-sm text-brandText-secondary mb-3">
                  {scanResult.risk_score >= 70 
                    ? 'High probability of phishing or social engineering. Embedded links or header anomalies detected.'
                    : scanResult.risk_score >= 40 
                    ? 'Suspicious email indicators detected. Exercise caution before clicking links.'
                    : 'Target email displays low risk characteristics. No overt phishing indicators found.'}
                </p>
                <div className={`p-3 rounded-sm text-xs font-semibold border ${
                  scanResult.risk_score >= 70 
                    ? 'bg-danger-bg text-danger-text border-danger-border' 
                    : scanResult.risk_score >= 40
                    ? 'bg-warn-bg text-warn-text border-warn-border'
                    : 'bg-safe-bg text-safe-text border-safe-border'
                }`}>
                  {scanResult.risk_score >= 70 
                    ? 'RECOMMENDATION: 🚫 DO NOT CLICK LINKS OR REPLY. Quarantined for security review.'
                    : scanResult.risk_score >= 40
                    ? 'RECOMMENDATION: ⚡ PROCEED WITH CAUTION. Verify sender identity before responding.'
                    : 'RECOMMENDATION: ✅ SAFE EMAIL. No malicious social engineering signatures detected.'}
                </div>
              </div>
            </div>

            <div className="p-3 px-6 bg-[rgb(253,253,254)] flex gap-6 text-xs flex-wrap border-t border-brandBorder-subtle">
              <div className="flex items-center gap-2">
                <span className="text-brandText-muted">Analyzed Timestamp:</span>
                <span className="font-mono font-medium text-brandText-main">{scanResult.analyzed_at}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-brandText-muted">Inspection Engines:</span>
                <span className="font-mono font-medium text-brandText-main">
                  {scanResult.sources_checked?.join(', ') || 'Email Heuristics + ML'}
                </span>
              </div>
            </div>
          </div>

          {/* Specs Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-surface border border-brandBorder rounded-md p-4 shadow-sm flex flex-col gap-1">
              <span className="text-xs font-semibold text-brandText-muted uppercase">Extracted Sender (From)</span>
              <span className="text-xs font-mono font-semibold text-brandText-main break-all">
                {scanResult.sender || 'Not specified'}
              </span>
            </div>
            <div className="bg-surface border border-brandBorder rounded-md p-4 shadow-sm flex flex-col gap-1">
              <span className="text-xs font-semibold text-brandText-muted uppercase">Target Host Domain</span>
              <span className="text-xs font-mono font-semibold text-brandText-main break-all">
                {scanResult.domain || 'N/A'}
              </span>
            </div>
            <div className="bg-surface border border-brandBorder rounded-md p-4 shadow-sm flex flex-col gap-1">
              <span className="text-xs font-semibold text-brandText-muted uppercase">Subject Line</span>
              <span className="text-xs font-semibold text-brandText-main truncate" title={scanResult.subject}>
                {scanResult.subject || 'No Subject'}
              </span>
            </div>
            <div className="bg-surface border border-brandBorder rounded-md p-4 shadow-sm flex flex-col gap-1">
              <span className="text-xs font-semibold text-brandText-muted uppercase">Embedded Payload Links</span>
              <span className="text-xs font-mono font-semibold text-brandText-main">
                {scanResult.url_scores?.length ?? 0} URLs Scanned
              </span>
            </div>
          </div>

          {/* Signals Breakdown Table */}
          <div className="signals-container">
            <div className="signals-header">
              <div className="flex items-center gap-3">
                <h2 className="signals-title">Heuristic & ML Threat Vector Breakdown</h2>
                <span className="signals-count">{scanResult.signals?.length ?? 0} Signals Identified</span>
              </div>
            </div>

            <div className="table-wrapper">
              <table className="signals-table">
                <thead>
                  <tr>
                    <th style={{ width: '28%' }}>Threat Indicator</th>
                    <th style={{ width: '20%' }}>Category</th>
                    <th style={{ width: '15%' }}>Severity</th>
                    <th style={{ width: '37%' }}>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {scanResult.signals?.map((sig, idx) => (
                    <tr key={idx}>
                      <td className="font-semibold text-brandText-main">{sig.title}</td>
                      <td className="font-mono text-xs text-brandText-muted">{sig.category}</td>
                      <td>
                        <span className={`risk-tag ${
                          sig.risk === 'high' ? 'risk-high' : sig.risk === 'medium' ? 'risk-medium' : sig.risk === 'safe' ? 'risk-safe' : 'risk-low'
                        }`}>
                          {sig.risk}
                        </span>
                      </td>
                      <td>{sig.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
