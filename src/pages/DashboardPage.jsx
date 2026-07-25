import React from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import ThreatTrendChart from '../components/ThreatTrendChart';

export default function DashboardPage() {
  return (
    <div className="app-dashboard-shell">
      <Sidebar />

      <div className="flex flex-col gap-6">
        {/* Header & Quick Actions */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="font-heading text-2xl font-semibold text-brandText-main mb-0.5">Security Command Center</h1>
            <p className="text-sm text-brandText-muted">Real-time threat monitoring and heuristic detection overview.</p>
          </div>
          <div className="flex gap-2">
            <Link to="/scanner" className="btn-primary btn-sm">+ Scan New URL</Link>
            <Link to="/email-scanner" className="btn-secondary btn-sm">+ Analyze Email</Link>
            <Link to="/report" className="btn-outline btn-sm">Export Summary</Link>
          </div>
        </div>

        {/* Top 4 Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-surface border border-brandBorder rounded-md p-4 shadow-sm flex flex-col gap-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-brandText-muted">URLs Scanned (Today)</span>
            <span className="score-number text-3xl">1,482</span>
            <span className="text-xs font-medium text-safe-text">↑ +14.2% from yesterday</span>
          </div>
          <div className="bg-surface border border-brandBorder rounded-md p-4 shadow-sm flex flex-col gap-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-brandText-muted">Safe Domains</span>
            <span className="score-number text-3xl text-safe-fill">1,210</span>
            <span className="text-xs font-medium text-brandText-muted">81.6% benign traffic</span>
          </div>
          <div className="bg-surface border border-brandBorder rounded-md p-4 shadow-sm flex flex-col gap-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-brandText-muted">Suspicious Flagged</span>
            <span className="score-number text-3xl text-warn-fill">184</span>
            <span className="text-xs font-medium text-warn-text">Medium risk heuristic match</span>
          </div>
          <div className="bg-surface border border-brandBorder rounded-md p-4 shadow-sm flex flex-col gap-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-brandText-muted">Malicious Blocked</span>
            <span className="score-number text-3xl text-danger-fill">88</span>
            <span className="text-xs font-medium text-danger-text">Confirmed phishing attempts</span>
          </div>
        </div>

        {/* Premium Threat Trend Area Chart */}
        <ThreatTrendChart />

        {/* Recent Activity Table */}
        <div className="signals-container">
          <div className="signals-header">
            <div className="flex items-center gap-3">
              <h2 className="signals-title">Recent Inspection Log</h2>
              <span className="signals-count">Last 5 Scans</span>
            </div>
            <Link to="/history" className="font-mono text-accentBlue no-underline text-xs">View Full History →</Link>
          </div>
          <div className="table-wrapper">
            <table className="signals-table">
              <thead>
                <tr>
                  <th>Target URL</th>
                  <th>Status</th>
                  <th>Risk Score</th>
                  <th>Category / Risk Signal</th>
                  <th>Time</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="font-mono">http://192.168.1.1/paypal/verify-account.login.xyz</td>
                  <td><span className="verdict-badge badge-danger">Malicious</span></td>
                  <td><span className="risk-tag risk-high">94 / 100</span></td>
                  <td>Raw IP + Typosquatting TLD</td>
                  <td className="font-mono">11:04:12 UTC</td>
                  <td><Link to="/report" className="btn-outline btn-sm">Report</Link></td>
                </tr>
                <tr>
                  <td className="font-mono">http://secure-update-banking-verification.com/login</td>
                  <td><span className="verdict-badge badge-warning">Suspicious</span></td>
                  <td><span className="risk-tag risk-medium">62 / 100</span></td>
                  <td>High-Risk Keywords + Hyphenation</td>
                  <td className="font-mono">10:58:30 UTC</td>
                  <td><Link to="/report" className="btn-outline btn-sm">Report</Link></td>
                </tr>
                <tr>
                  <td className="font-mono">https://github.com/security-advisories</td>
                  <td><span className="verdict-badge badge-safe">Safe</span></td>
                  <td><span className="risk-tag risk-safe">08 / 100</span></td>
                  <td>Encrypted TLS + Domain Reputation</td>
                  <td className="font-mono">10:45:15 UTC</td>
                  <td><Link to="/report" className="btn-outline btn-sm">Report</Link></td>
                </tr>
                <tr>
                  <td className="font-mono">http://free-apple-giftcard-claim.tk/auth</td>
                  <td><span className="verdict-badge badge-danger">Malicious</span></td>
                  <td><span className="risk-tag risk-high">88 / 100</span></td>
                  <td>Zero-Day Phishing Heuristic Match</td>
                  <td className="font-mono">10:12:04 UTC</td>
                  <td><Link to="/report" className="btn-outline btn-sm">Report</Link></td>
                </tr>
                <tr>
                  <td className="font-mono">https://google.com</td>
                  <td><span className="verdict-badge badge-safe">Safe</span></td>
                  <td><span className="risk-tag risk-safe">04 / 100</span></td>
                  <td>Verified Domain Authority</td>
                  <td className="font-mono">09:30:00 UTC</td>
                  <td><Link to="/report" className="btn-outline btn-sm">Report</Link></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
