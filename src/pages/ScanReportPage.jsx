import React from 'react';

export default function ScanReportPage() {
  return (
    <div className="flex flex-col gap-8">
      {/* Header & Export Action Bar */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="text-xs font-mono font-medium text-brandText-muted bg-subtle px-1.5 py-0.5 border border-brandBorder-subtle rounded-sm mb-1 inline-block">
            INSPECTION REPORT ID: #SIQ-8F39A1
          </div>
          <h1 className="font-heading text-2xl font-semibold text-brandText-main mb-0.5">Detailed Security Assessment Report</h1>
          <p className="text-sm text-brandText-muted">Full ML feature-importance attribution and threat vector audit.</p>
        </div>
        <div className="flex gap-2">
          <button type="button" className="btn-primary btn-sm" onClick={() => alert('Report PDF generated and downloading!')}>📥 Download PDF</button>
          <button type="button" className="btn-secondary btn-sm" onClick={() => { navigator.clipboard.writeText(window.location.href); alert('Report link copied to clipboard!'); }}>🔗 Copy Link</button>
          <button type="button" className="btn-outline btn-sm" onClick={() => alert('Report shared with team security desk!')}>✉️ Share Report</button>
        </div>
      </div>

      {/* Main Summary & Circular Gauge */}
      <div className="bg-surface border border-brandBorder rounded-md shadow-sm overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] border-b border-brandBorder-subtle">
          <div className="p-6 bg-surface border-r border-brandBorder-subtle flex flex-col items-center justify-center text-center">
            <div className="relative w-36 h-36">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle cx="50" cy="50" r="42" stroke="#e2e8f0" strokeWidth="8" fill="none"/>
                <circle cx="50" cy="50" r="42" stroke="#ef4444" strokeWidth="8" fill="none" strokeDasharray="263.89" strokeDashoffset="15.8" strokeLinecap="round"/>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-heading font-bold text-4xl text-danger-text">94</span>
                <span className="text-[10px] font-bold text-brandText-muted uppercase">HIGH RISK</span>
              </div>
            </div>
            <span className="verdict-badge badge-danger mt-3">CRITICAL PHISHING</span>
          </div>

          <div className="p-6 flex flex-col justify-center">
            <div className="flex items-center gap-4 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-brandText-muted">EVALUATION VERDICT</span>
              <span className="text-xs text-brandText-muted">Analyzed 2026-07-25 11:04:12 UTC</span>
            </div>
            <h3 className="font-heading text-base font-semibold text-brandText-main mb-2">
              Target URL: <code className="font-mono text-sm bg-subtle px-1 rounded">http://192.168.1.1/paypal/verify-account.login.xyz</code>
            </h3>
            <p className="text-sm text-brandText-secondary mb-4">
              This target exhibits multiple critical malicious threat signatures including direct IP address hosting, credential harvesting keywords, typosquatting domain extension (<code className="bg-subtle px-1 rounded">.xyz</code>), and unencrypted HTTP transport.
            </p>
            <div className="flex gap-6 border-t border-brandBorder-subtle pt-3 text-xs">
              <div>
                <span className="text-brandText-muted">ML Prediction Score: </span>
                <strong className="text-danger-text">96.2% Phishing</strong>
              </div>
              <div>
                <span className="text-brandText-muted">Heuristic Score: </span>
                <strong className="text-danger-text">92.0 / 100</strong>
              </div>
              <div>
                <span className="text-brandText-muted">Confidence Rating: </span>
                <strong className="text-safe-text">99.1% High</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Importance & Threat Intel Matches */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="signals-container">
          <div className="signals-header">
            <h2 className="signals-title">Feature-Importance Attribution</h2>
            <span className="signals-count">SHAP Model Weights</span>
          </div>
          <div className="p-6 flex flex-col gap-4">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span>Raw IP Address Host</span>
                <span className="text-danger-text">+38.5% Contribution</span>
              </div>
              <div className="score-meter-track"><div className="score-meter-fill meter-danger" style={{ width: '85%' }}></div></div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span>Unencrypted HTTP Protocol</span>
                <span className="text-danger-text">+25.0% Contribution</span>
              </div>
              <div className="score-meter-track"><div className="score-meter-fill meter-danger" style={{ width: '70%' }}></div></div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span>Credential Harvesting Keywords ("paypal", "verify")</span>
                <span className="text-danger-text">+20.0% Contribution</span>
              </div>
              <div className="score-meter-track"><div className="score-meter-fill meter-warning" style={{ width: '60%' }}></div></div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span>High-Risk TLD Classifier (.xyz)</span>
                <span className="text-danger-text">+12.5% Contribution</span>
              </div>
              <div className="score-meter-track"><div className="score-meter-fill meter-warning" style={{ width: '45%' }}></div></div>
            </div>
          </div>
        </div>

        <div className="signals-container">
          <div className="signals-header">
            <h2 className="signals-title">Global Threat Intelligence Matches</h2>
            <span className="signals-count">3 Feeds Matched</span>
          </div>
          <div className="p-6 flex flex-col gap-4">
            <div className="p-3 border border-danger-border bg-danger-bg rounded-sm">
              <div className="font-bold text-danger-text text-sm">PhishTank Global Blacklist</div>
              <div className="text-xs text-brandText-secondary mt-0.5">Flagged under active PayPal harvesting campaign #PT-99410.</div>
            </div>

            <div className="p-3 border border-danger-border bg-danger-bg rounded-sm">
              <div className="font-bold text-danger-text text-sm">VirusTotal Domain Reputation</div>
              <div className="text-xs text-brandText-secondary mt-0.5">18/92 security vendors flagged host as malicious.</div>
            </div>

            <div className="p-3 border border-warn-border bg-warn-bg rounded-sm">
              <div className="font-bold text-warn-text text-sm">AlienVault OTX Pulse</div>
              <div className="text-xs text-brandText-secondary mt-0.5">Associated with recent credential stuffing infrastructure in North America.</div>
            </div>
          </div>
        </div>
      </div>

      {/* Execution Timeline */}
      <div className="signals-container">
        <div className="signals-header">
          <h2 className="signals-title">Scan Pipeline Execution Timeline</h2>
          <span className="signals-count">Total Duration: 24ms</span>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 text-center">
            <div className="bg-subtle p-4 rounded-sm border border-brandBorder">
              <div className="font-mono text-xs text-accentBlue font-bold">+0.0ms</div>
              <div className="font-semibold text-sm mt-1">Request Received</div>
              <div className="text-xs text-brandText-muted">Payload parsed</div>
            </div>
            <div className="bg-subtle p-4 rounded-sm border border-brandBorder">
              <div className="font-mono text-xs text-accentBlue font-bold">+4.2ms</div>
              <div className="font-semibold text-sm mt-1">Lexical Audit</div>
              <div className="text-xs text-brandText-muted">Tokenizer run</div>
            </div>
            <div className="bg-subtle p-4 rounded-sm border border-brandBorder">
              <div className="font-mono text-xs text-accentBlue font-bold">+11.8ms</div>
              <div className="font-semibold text-sm mt-1">ML Inference</div>
              <div className="text-xs text-brandText-muted">Model scored</div>
            </div>
            <div className="bg-subtle p-4 rounded-sm border border-brandBorder">
              <div className="font-mono text-xs text-accentBlue font-bold">+18.5ms</div>
              <div className="font-semibold text-sm mt-1">Intel Lookup</div>
              <div className="text-xs text-brandText-muted">Feeds cross-checked</div>
            </div>
            <div className="bg-danger-bg p-4 rounded-sm border border-danger-border">
              <div className="font-mono text-xs text-danger-text font-bold">+24.1ms</div>
              <div className="font-semibold text-sm text-danger-text mt-1">Report Finalized</div>
              <div className="text-xs text-danger-text">Verdict emitted</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
