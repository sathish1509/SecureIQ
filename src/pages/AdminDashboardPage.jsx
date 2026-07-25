import React from 'react';
import Sidebar from '../components/Sidebar';

export default function AdminDashboardPage() {
  return (
    <div className="app-dashboard-shell">
      <Sidebar />

      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div>
            <span className="verdict-badge badge-danger mb-1.5 inline-block">ENTERPRISE ADMIN PORTAL</span>
            <h1 className="font-heading text-2xl font-semibold text-brandText-main mb-0.5">System Infrastructure & Telemetry</h1>
            <p className="text-sm text-brandText-muted">Model performance metrics, user quotas, and live cluster health.</p>
          </div>
          <div className="flex gap-2">
            <button className="btn-primary btn-sm" onClick={() => alert('Retraining ML model cluster on latest 50k samples...')}>⚡ Retrain Model</button>
            <button className="btn-secondary btn-sm" onClick={() => alert('Flushed edge caching nodes.')}>🧹 Flush Cache</button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-surface border border-brandBorder rounded-md p-4 shadow-sm flex flex-col gap-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-brandText-muted">Inference Engine Latency</span>
            <span className="score-number text-3xl text-safe-fill">18.4 ms</span>
            <span className="text-xs font-medium text-safe-text">p99 &lt; 25ms SLA</span>
          </div>
          <div className="bg-surface border border-brandBorder rounded-md p-4 shadow-sm flex flex-col gap-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-brandText-muted">Active API Users</span>
            <span className="score-number text-3xl">1,842</span>
            <span className="text-xs font-medium text-brandText-muted">482 Enterprise Accounts</span>
          </div>
          <div className="bg-surface border border-brandBorder rounded-md p-4 shadow-sm flex flex-col gap-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-brandText-muted">Model Accuracy</span>
            <span className="score-number text-3xl text-safe-fill">99.42%</span>
            <span className="text-xs font-medium text-brandText-muted">Precision: 99.1% • Recall: 99.6%</span>
          </div>
          <div className="bg-surface border border-brandBorder rounded-md p-4 shadow-sm flex flex-col gap-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-brandText-muted">Daily API Throughput</span>
            <span className="score-number text-3xl">4.8M</span>
            <span className="text-xs font-medium text-brandText-muted">Requests / 24 Hours</span>
          </div>
        </div>

        <div className="signals-container">
          <div className="signals-header">
            <div className="flex items-center gap-3">
              <h2 className="signals-title">Enterprise User & API Quota Management</h2>
              <span className="signals-count">5 Active Organizations</span>
            </div>
          </div>
          <div className="table-wrapper">
            <table className="signals-table">
              <thead>
                <tr>
                  <th>Organization</th>
                  <th>Admin Email</th>
                  <th>API Quota Usage</th>
                  <th>Tier</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="font-semibold">Acme Corp Cyber Team</td>
                  <td className="font-mono text-xs">security@acmecorp.com</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="score-meter-track flex-1"><div className="score-meter-fill meter-safe" style={{ width: '42%' }}></div></div>
                      <span className="font-mono text-xs">42K / 100K</span>
                    </div>
                  </td>
                  <td><span className="verdict-badge badge-safe">Enterprise</span></td>
                  <td><span className="w-2 h-2 rounded-full bg-safe-fill inline-block mr-1"></span> Active</td>
                  <td><button className="btn-outline btn-sm" onClick={() => alert('Managing Acme Corp settings...')}>Manage</button></td>
                </tr>
                <tr>
                  <td className="font-semibold">Global Financial Services</td>
                  <td className="font-mono text-xs">soc@globalfin.org</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="score-meter-track flex-1"><div className="score-meter-fill meter-warning" style={{ width: '88%' }}></div></div>
                      <span className="font-mono text-xs">88K / 100K</span>
                    </div>
                  </td>
                  <td><span className="verdict-badge badge-safe">Enterprise Pro</span></td>
                  <td><span className="w-2 h-2 rounded-full bg-safe-fill inline-block mr-1"></span> Active</td>
                  <td><button className="btn-outline btn-sm" onClick={() => alert('Managing Global Financial settings...')}>Manage</button></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="signals-container">
          <div className="signals-header">
            <div className="flex items-center gap-3">
              <h2 className="signals-title">Live Engine Inference Console Logs</h2>
              <span className="w-2 h-2 rounded-full bg-safe-fill"></span>
              <span className="signals-count">STDOUT Stream</span>
            </div>
            <span className="text-xs font-mono text-brandText-muted">Auto-refreshing</span>
          </div>
          <div className="p-4 bg-surface text-brandText-main font-mono text-xs h-52 overflow-y-auto leading-relaxed flex flex-col gap-2.5 rounded-b-md border-t border-brandBorder-subtle">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-brandText-muted">[2026-07-25 11:04:12.182]</span>
              <span className="text-accentBlue font-bold">INFO</span>
              <span className="text-navy font-semibold">engine.inference:</span>
              <span>Analyzed <code className="bg-subtle px-1.5 py-0.5 rounded text-navy">http://192.168.1.1/paypal/login</code> — Score: <strong className="text-danger-text">94</strong></span>
              <span className="verdict-badge badge-danger">MALICIOUS</span>
              <span className="text-brandText-muted">(24.1ms)</span>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-brandText-muted">[2026-07-25 11:04:12.190]</span>
              <span className="text-warn-text font-bold">WARN</span>
              <span className="text-navy font-semibold">engine.rules:</span>
              <span>IP_HOST_MATCHED: <code className="bg-subtle px-1.5 py-0.5 rounded text-navy">192.168.1.1</code> flagged under severe vector #38</span>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-brandText-muted">[2026-07-25 11:04:15.801]</span>
              <span className="text-accentBlue font-bold">INFO</span>
              <span className="text-navy font-semibold">engine.inference:</span>
              <span>Analyzed <code className="bg-subtle px-1.5 py-0.5 rounded text-navy">https://github.com/security</code> — Score: <strong className="text-safe-text">08</strong></span>
              <span className="verdict-badge badge-safe">SAFE</span>
              <span className="text-brandText-muted">(12.4ms)</span>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-brandText-muted">[2026-07-25 11:04:18.004]</span>
              <span className="text-accentBlue font-bold">INFO</span>
              <span className="text-navy font-semibold">engine.intel_feed:</span>
              <span>Synced 1,240 new telemetry pulses from AlienVault OTX</span>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-brandText-muted">[2026-07-25 11:04:20.912]</span>
              <span className="text-accentBlue font-bold">INFO</span>
              <span className="text-navy font-semibold">engine.inference:</span>
              <span>Analyzed <code className="bg-subtle px-1.5 py-0.5 rounded text-navy">http://free-apple-giftcard-claim.tk</code> — Score: <strong className="text-danger-text">88</strong></span>
              <span className="verdict-badge badge-danger">MALICIOUS</span>
              <span className="text-brandText-muted">(18.9ms)</span>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-brandText-muted">[2026-07-25 11:04:22.400]</span>
              <span className="text-safe-text font-bold">OK</span>
              <span className="text-navy font-semibold">cluster.health:</span>
              <span>4/4 inference worker nodes healthy <span className="text-brandText-muted">(CPU: 14%, MEM: 38%)</span></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
