import React from 'react';
import { useNavigate } from 'react-router-dom';
import ThreatTrendChart from '../components/ThreatTrendChart';

export default function ThreatIntelPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-8">
      {/* Page Header */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <div className="text-xs font-mono font-medium text-brandText-muted bg-subtle px-1.5 py-0.5 border border-brandBorder-subtle rounded-sm mb-1 inline-block">
            GLOBAL THREAT MATRIX
          </div>
          <h1 className="font-heading text-2xl font-semibold text-brandText-main mb-0.5">Threat Intelligence & Campaign Tracking</h1>
          <p className="text-sm text-brandText-muted">Live intelligence telemetry feeding the SecureIQ AI heuristic model.</p>
        </div>
        <div className="flex gap-2">
          <button className="btn-primary btn-sm" onClick={() => alert('Subscribed to automated threat feed alerts!')}>🔔 Subscribe Feed</button>
          <button className="btn-secondary btn-sm" onClick={() => navigate('/admin')}>API Feed Access</button>
        </div>
      </div>

      {/* Category Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-surface border border-brandBorder rounded-md p-4 shadow-sm flex flex-col gap-3">
          <div className="w-10 h-10 bg-danger-bg text-danger-text border border-danger-border rounded-sm flex items-center justify-center font-bold font-mono text-base">PH</div>
          <h3 className="text-sm font-bold">Phishing</h3>
          <span className="score-number text-2xl text-danger-text">8,410</span>
          <span className="text-xs text-brandText-muted">Active Domains</span>
        </div>

        <div className="bg-surface border border-brandBorder rounded-md p-4 shadow-sm flex flex-col gap-3">
          <div className="w-10 h-10 bg-warn-bg text-warn-text border border-warn-border rounded-sm flex items-center justify-center font-bold font-mono text-base">MW</div>
          <h3 className="text-sm font-bold">Malware</h3>
          <span className="score-number text-2xl text-warn-text">3,120</span>
          <span className="text-xs text-brandText-muted">Payload Hosts</span>
        </div>

        <div className="bg-surface border border-brandBorder rounded-md p-4 shadow-sm flex flex-col gap-3">
          <div className="w-10 h-10 bg-danger-bg text-danger-text border border-danger-border rounded-sm flex items-center justify-center font-bold font-mono text-base">RW</div>
          <h3 className="text-sm font-bold">Ransomware</h3>
          <span className="score-number text-2xl text-danger-text">418</span>
          <span className="text-xs text-brandText-muted">C2 Servers</span>
        </div>

        <div className="bg-surface border border-brandBorder rounded-md p-4 shadow-sm flex flex-col gap-3">
          <div className="w-10 h-10 bg-warn-bg text-warn-text border border-warn-border rounded-sm flex items-center justify-center font-bold font-mono text-base">BN</div>
          <h3 className="text-sm font-bold">Botnet</h3>
          <span className="score-number text-2xl text-warn-text">1,290</span>
          <span className="text-xs text-brandText-muted">Relay Nodes</span>
        </div>

        <div className="bg-surface border border-brandBorder rounded-md p-4 shadow-sm flex flex-col gap-3">
          <div className="w-10 h-10 bg-subtle text-brandText-main border border-brandBorder rounded-sm flex items-center justify-center font-bold font-mono text-base">SC</div>
          <h3 className="text-sm font-bold">Scam</h3>
          <span className="score-number text-2xl">2,840</span>
          <span className="text-xs text-brandText-muted">Impersonators</span>
        </div>
      </div>

      {/* Threat Detection Trend Graph */}
      <ThreatTrendChart 
        title="Global Threat Campaign Telemetry"
        subtitle="Live Feed Stream"
        rightText="HoneyNet + AlienVault OTX Feed Data"
        safeLabel="Phishing Campaign Vectors"
        threatLabel="Malware Payload Hosts"
      />

      {/* Main Stream Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
        <div className="signals-container">
          <div className="signals-header">
            <div className="flex items-center gap-3">
              <h2 className="signals-title">Live Phishing Campaign Stream</h2>
              <span className="w-2 h-2 rounded-full bg-safe-fill"></span>
              <span className="signals-count">Streaming...</span>
            </div>
            <div className="text-xs text-brandText-muted">Auto-updated via Threat Engine API</div>
          </div>
          <div className="table-wrapper">
            <table className="signals-table">
              <thead>
                <tr>
                  <th>Threat Domain / Target</th>
                  <th>Threat Category</th>
                  <th>Risk Score</th>
                  <th>Target Brand</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="font-mono"><code>auth-verify-chase-banking.xyz</code></td>
                  <td><span className="risk-tag risk-high">Phishing</span></td>
                  <td><span className="score-number text-base text-danger-text">98</span></td>
                  <td>Chase Bank</td>
                </tr>
                <tr>
                  <td className="font-mono"><code>update-microsoft365-login.net</code></td>
                  <td><span className="risk-tag risk-high">Phishing</span></td>
                  <td><span className="score-number text-base text-danger-text">96</span></td>
                  <td>Microsoft 365</td>
                </tr>
                <tr>
                  <td className="font-mono"><code>free-crypto-airdrop-claim.tech</code></td>
                  <td><span className="risk-tag risk-medium">Scam</span></td>
                  <td><span className="score-number text-base text-warn-text">78</span></td>
                  <td>Coinbase / Web3</td>
                </tr>
                <tr>
                  <td className="font-mono"><code>payload-cdn-download.ru</code></td>
                  <td><span className="risk-tag risk-high">Malware</span></td>
                  <td><span className="score-number text-base text-danger-text">99</span></td>
                  <td>Generic Trojan</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="signals-container">
            <div className="signals-header">
              <h2 className="signals-title">Top Impersonated Brands</h2>
            </div>
            <div className="p-4 flex flex-col gap-3 text-sm">
              <div className="flex justify-between"><span>1. Microsoft / Office 365</span><strong className="text-danger-text">31.2%</strong></div>
              <div className="flex justify-between"><span>2. PayPal / Financials</span><strong className="text-danger-text">22.4%</strong></div>
              <div className="flex justify-between"><span>3. Google Workspace</span><strong className="text-warn-text">15.8%</strong></div>
              <div className="flex justify-between"><span>4. Apple ID</span><strong className="text-warn-text">11.1%</strong></div>
              <div className="flex justify-between"><span>5. DHL / Shipping Scams</span><strong>8.3%</strong></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
