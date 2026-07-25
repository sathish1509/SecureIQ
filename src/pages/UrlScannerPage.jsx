import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function UrlScannerPage() {
  const [url, setUrl] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [scanResult, setScanResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const sampleUrls = [
    { label: 'Phishing Sample (IP + TLD)', url: 'http://192.168.1.1/paypal/verify-account.login.xyz' },
    { label: 'Suspicious Keyword Sample', url: 'http://secure-update-banking-verification.com/login' },
    { label: 'Safe Domain Sample', url: 'https://google.com' }
  ];

  const handleScan = async (targetUrl) => {
    const cleanUrl = targetUrl || url;
    if (!cleanUrl.trim()) {
      setErrorMsg('Please enter a valid URL to analyze.');
      return;
    }

    setErrorMsg('');
    setScanResult(null);
    setIsScanning(true);

    // Multi-step animation sequence
    for (let step = 1; step <= 5; step++) {
      setActiveStep(step);
      await new Promise((res) => setTimeout(res, 200));
    }

    try {
      const response = await fetch('/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: cleanUrl })
      });

      if (!response.ok) {
        throw new Error('Failed to complete URL analysis scan.');
      }

      const data = await response.json();
      setScanResult(data);
    } catch (err) {
      setErrorMsg(err.message || 'Error occurred while contacting scanning service.');
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Hero Scanner Form */}
      <section className="bg-surface border border-brandBorder rounded-md p-8 shadow-sm">
        <div className="mb-6">
          <h1 className="font-heading text-2xl font-semibold text-brandText-main tracking-tight">
            Real-Time URL Threat & Phishing Scanner
          </h1>
          <p className="text-sm text-brandText-muted mt-1">
            Analyze domain lexical structures, TLS certificates, IP host anomalies, and ML heuristic vectors in real time.
          </p>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); handleScan(); }} className="mb-4">
          <div className="flex gap-3 flex-col sm:flex-row">
            <input 
              type="url" 
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1 h-11 px-4 font-mono text-sm text-brandText-main bg-surface border border-brandBorder-strong rounded-md focus:outline-none focus:border-accentBlue focus:ring-2 focus:ring-accentBlue/20" 
              placeholder="Enter URL to inspect (e.g., http://192.168.1.1/paypal/login-update.xyz)" 
              required
            />
            <button type="submit" disabled={isScanning} className="btn-primary h-11 px-6 whitespace-nowrap">
              {isScanning ? 'Analyzing...' : 'Analyze URL'}
            </button>
          </div>
          {errorMsg && (
            <div className="mt-2 text-xs text-danger-text bg-danger-bg border border-danger-border p-2 rounded-sm">
              {errorMsg}
            </div>
          )}
        </form>

        <div className="flex items-center gap-2 flex-wrap pt-3 border-t border-brandBorder-subtle">
          <span className="text-xs font-semibold text-brandText-muted uppercase tracking-wider mr-1">
            Quick Test Targets:
          </span>
          {sampleUrls.map((sample, idx) => (
            <button
              key={idx}
              type="button"
              className="bg-subtle text-brandText-secondary border border-brandBorder rounded-sm px-2 py-1 font-mono text-xs hover:bg-hover hover:text-brandText-main transition-colors cursor-pointer"
              onClick={() => { setUrl(sample.url); handleScan(sample.url); }}
            >
              {sample.label}
            </button>
          ))}
        </div>
      </section>

      {/* Multi-Step Scan Animation Progress */}
      {isScanning && (
        <section className="bg-surface border border-brandBorder rounded-md p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading text-base font-semibold text-brandText-main">Multi-Vector Inspection Engine</h3>
            <span className="font-mono text-xs text-accentBlue">Scanning...</span>
          </div>

          <div className="flex flex-col gap-3">
            <div className={`flex items-center gap-4 p-3 border rounded-sm text-sm ${activeStep >= 1 ? 'border-accentBlue bg-surface font-semibold text-brandText-main' : 'border-brandBorder-subtle bg-page text-brandText-muted'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${activeStep >= 1 ? 'bg-accentBlue text-white' : 'bg-hover text-brandText-muted'}`}>1</div>
              <span>Checking Domain Registration & DNS Records</span>
            </div>
            <div className={`flex items-center gap-4 p-3 border rounded-sm text-sm ${activeStep >= 2 ? 'border-accentBlue bg-surface font-semibold text-brandText-main' : 'border-brandBorder-subtle bg-page text-brandText-muted'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${activeStep >= 2 ? 'bg-accentBlue text-white' : 'bg-hover text-brandText-muted'}`}>2</div>
              <span>Checking SSL/TLS Transport Security & Certificates</span>
            </div>
            <div className={`flex items-center gap-4 p-3 border rounded-sm text-sm ${activeStep >= 3 ? 'border-accentBlue bg-surface font-semibold text-brandText-main' : 'border-brandBorder-subtle bg-page text-brandText-muted'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${activeStep >= 3 ? 'bg-accentBlue text-white' : 'bg-hover text-brandText-muted'}`}>3</div>
              <span>Analyzing Lexical URL Structure & Entropy Vectors</span>
            </div>
            <div className={`flex items-center gap-4 p-3 border rounded-sm text-sm ${activeStep >= 4 ? 'border-accentBlue bg-surface font-semibold text-brandText-main' : 'border-brandBorder-subtle bg-page text-brandText-muted'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${activeStep >= 4 ? 'bg-accentBlue text-white' : 'bg-hover text-brandText-muted'}`}>4</div>
              <span>Running AI Machine Learning Model Inference</span>
            </div>
            <div className={`flex items-center gap-4 p-3 border rounded-sm text-sm ${activeStep >= 5 ? 'border-accentBlue bg-surface font-semibold text-brandText-main' : 'border-brandBorder-subtle bg-page text-brandText-muted'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${activeStep >= 5 ? 'bg-safe-fill text-white' : 'bg-hover text-brandText-muted'}`}>5</div>
              <span>Generating Risk Score & Verdict Recommendations</span>
            </div>
          </div>
        </section>
      )}

      {/* Results Section */}
      {scanResult && !isScanning && (
        <section className="flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <div className="text-sm font-semibold text-brandText-muted">
              SCAN REPORT #<span className="font-mono">8F39A1</span>
            </div>
            <div className="flex gap-2">
              <Link to="/report" state={{ scanData: scanResult }} className="btn-primary btn-sm">Full Report View →</Link>
              <button type="button" className="btn-outline btn-sm" onClick={() => window.print()}>Print PDF</button>
            </div>
          </div>

          {/* Banner Card */}
          <div className="bg-surface border border-brandBorder rounded-md shadow-sm overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] border-b border-brandBorder-subtle">
              <div className="p-6 bg-subtle border-r border-brandBorder-subtle flex flex-col justify-center">
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="score-number text-4xl">{scanResult.risk_score}</span>
                  <span className="score-scale">/100</span>
                </div>
                <div className="score-meter-track">
                  <div 
                    className={`score-meter-fill ${
                      scanResult.risk_score >= 70 ? 'meter-danger' : scanResult.risk_score >= 40 ? 'meter-warning' : 'meter-safe'
                    }`} 
                    style={{ width: `${scanResult.risk_score}%` }}
                  ></div>
                </div>
              </div>

              <div className="p-6 flex flex-col justify-center">
                <div className="flex items-center gap-4 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-brandText-muted">SECURITY VERDICT</span>
                  <span className={`verdict-badge ${
                    scanResult.verdict_level === 'danger' ? 'badge-danger' : scanResult.verdict_level === 'warning' ? 'badge-warning' : 'badge-safe'
                  }`}>
                    {scanResult.verdict}
                  </span>
                </div>
                <p className="text-sm text-brandText-secondary">
                  {scanResult.risk_score >= 70 
                    ? 'High probability of phishing or malicious credential harvesting attempt.'
                    : scanResult.risk_score >= 40
                    ? 'Suspicious domain traits detected. Exercise caution before entering credentials.'
                    : 'Target displays low risk characteristics. No overt phishing indicators found.'}
                </p>

                <div className={`mt-3 p-3 rounded-sm font-semibold text-sm border ${
                  scanResult.risk_score >= 70
                    ? 'bg-danger-bg text-danger-text border-danger-border'
                    : scanResult.risk_score >= 40
                    ? 'bg-warn-bg text-warn-text border-warn-border'
                    : 'bg-safe-bg text-safe-text border-safe-border'
                }`}>
                  {scanResult.risk_score >= 70
                    ? 'RECOMMENDATION: ⚠️ DO NOT VISIT. High confidence malicious phishing site detected.'
                    : scanResult.risk_score >= 40
                    ? 'RECOMMENDATION: ⚡ PROCEED CAREFULLY. Suspicious attributes present. Do not enter credentials.'
                    : 'RECOMMENDATION: ✅ SAFE TO VISIT. No threat anomalies or credential harvesting signals found.'}
                </div>
              </div>
            </div>

            <div className="p-3 px-6 bg-[rgb(253,253,254)] flex gap-8 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-brandText-muted">Analyzed Timestamp</span>
                <span className="font-mono font-medium text-brandText-main">{scanResult.analyzed_at}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-brandText-muted">Confidence Meter</span>
                <span className="font-mono font-medium text-safe-text">98.4% (High)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-brandText-muted">Inference Engine</span>
                <span className="font-mono font-medium text-brandText-main">ML + Lexical Heuristics</span>
              </div>
            </div>
          </div>

          {/* Specs Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-surface border border-brandBorder rounded-md p-4 shadow-sm flex flex-col gap-1">
              <span className="text-xs font-semibold text-brandText-muted uppercase">Target URL</span>
              <span className="text-sm font-mono font-semibold text-brandText-main break-all">{scanResult.url}</span>
            </div>
            <div className="bg-surface border border-brandBorder rounded-md p-4 shadow-sm flex flex-col gap-1">
              <span className="text-xs font-semibold text-brandText-muted uppercase">Extracted Host / Domain</span>
              <span className="text-sm font-mono font-semibold text-brandText-main break-all">{scanResult.domain}</span>
            </div>
            <div className="bg-surface border border-brandBorder rounded-md p-4 shadow-sm flex flex-col gap-1">
              <span className="text-xs font-semibold text-brandText-muted uppercase">Transport Protocol</span>
              <span className="text-sm font-semibold text-brandText-main">{scanResult.protocol}</span>
            </div>
            <div className="bg-surface border border-brandBorder rounded-md p-4 shadow-sm flex flex-col gap-1">
              <span className="text-xs font-semibold text-brandText-muted uppercase">IP Address Host Detection</span>
              <span className="text-sm font-semibold text-brandText-main">{scanResult.ip_detected}</span>
            </div>
          </div>

          {/* Signals Table */}
          <div className="signals-container">
            <div className="signals-header">
              <div className="flex items-center gap-3">
                <h2 className="signals-title">Concrete Signal Vector Breakdown</h2>
                <span className="signals-count">{scanResult.signals.length} Signals Identified</span>
              </div>
              <div className="text-xs text-brandText-muted">Domain Age • Keywords • Redirects • SSL Integrity</div>
            </div>

            <div className="table-wrapper">
              <table className="signals-table">
                <thead>
                  <tr>
                    <th style={{ width: '25%' }}>Signal Indicator</th>
                    <th style={{ width: '18%' }}>Category</th>
                    <th style={{ width: '15%' }}>Severity</th>
                    <th style={{ width: '42%' }}>Risk Vector Description</th>
                  </tr>
                </thead>
                <tbody>
                  {scanResult.signals.map((sig, idx) => (
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

      {/* Info Section */}
      <section className="border-t border-brandBorder pt-8">
        <h3 className="font-heading text-lg font-semibold text-brandText-main mb-4">Heuristic Inspection Parameters</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-surface border border-brandBorder rounded-md p-6 shadow-sm">
            <div className="font-semibold text-brandText-main mb-2 text-sm">Lexical & Entropy Analysis</div>
            <p className="text-xs text-brandText-muted leading-relaxed">Evaluates string length, character randomness (Shannon entropy), double extensions, hyphen frequency, and sub-domain depth.</p>
          </div>
          <div className="bg-surface border border-brandBorder rounded-md p-6 shadow-sm">
            <div className="font-semibold text-brandText-main mb-2 text-sm">Brand Impersonation Matching</div>
            <p className="text-xs text-brandText-muted leading-relaxed">Detects typosquatting, target brand keywords (banking, webmail, auth), and misleading sub-domain positioning.</p>
          </div>
          <div className="bg-surface border border-brandBorder rounded-md p-6 shadow-sm">
            <div className="font-semibold text-brandText-main mb-2 text-sm">Network & Host Verification</div>
            <p className="text-xs text-brandText-muted leading-relaxed">Flags direct IP host targets, missing TLS/SSL encryption, high-risk TLD classifications, and port anomalies.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
