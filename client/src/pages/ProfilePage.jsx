import React from 'react';
import { Link } from 'react-router-dom';

export default function ProfilePage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="bg-surface border border-brandBorder rounded-md p-6 shadow-sm">
        <div className="flex items-center gap-6 flex-wrap">
          <div className="w-20 h-20 bg-navy text-white rounded-full flex items-center justify-center text-2xl font-bold font-heading">
            SA
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="font-heading text-2xl font-semibold text-brandText-main">Sathish Kumar</h1>
              <span className="verdict-badge badge-safe">Enterprise Security Analyst</span>
            </div>
            <div className="font-mono text-xs text-brandText-muted mt-1">sathish@secureiq.io • Organization: SecureIQ Security Labs</div>
            <div className="text-xs text-brandText-secondary mt-1.5">Member since January 2026 • Role: Lead Security Analyst</div>
          </div>

          <div>
            <Link to="/settings" className="btn-secondary">Edit Account Settings</Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-surface border border-brandBorder rounded-md p-4 shadow-sm flex flex-col gap-1">
          <span className="text-xs font-semibold text-brandText-muted uppercase">User Security Score</span>
          <span className="score-number text-3xl text-safe-fill">98 / 100</span>
          <span className="text-xs font-medium text-safe-text">Grade A+ Operational Security</span>
        </div>
        <div className="bg-surface border border-brandBorder rounded-md p-4 shadow-sm flex flex-col gap-1">
          <span className="text-xs font-semibold text-brandText-muted uppercase">Total Lifetime Scans</span>
          <span className="score-number text-3xl">12,840</span>
          <span className="text-xs font-medium text-brandText-muted">URLs & Emails Evaluated</span>
        </div>
        <div className="bg-surface border border-brandBorder rounded-md p-4 shadow-sm flex flex-col gap-1">
          <span className="text-xs font-semibold text-brandText-muted uppercase">Threats Quarantined</span>
          <span className="score-number text-3xl text-danger-fill">1,420</span>
          <span className="text-xs font-medium text-danger-text">Credential Harvesters Blocked</span>
        </div>
        <div className="bg-surface border border-brandBorder rounded-md p-4 shadow-sm flex flex-col gap-1">
          <span className="text-xs font-semibold text-brandText-muted uppercase">Active API Integration</span>
          <span className="score-number text-2xl text-accentBlue">Enabled</span>
          <span className="text-xs font-medium text-brandText-muted">Quota: 100,000 req/mo</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="signals-container">
          <div className="signals-header">
            <h2 className="signals-title">Authorized Sessions & Devices</h2>
          </div>
          <div className="p-6 flex flex-col gap-3">
            <div className="flex justify-between items-center text-sm">
              <div>
                <strong>Chrome on Windows 11 (This Device)</strong>
                <div className="font-mono text-xs text-brandText-muted">IP: 192.168.1.45 • Active Now</div>
              </div>
              <span className="verdict-badge badge-safe">Current Session</span>
            </div>
            <div className="flex justify-between items-center text-sm border-t border-brandBorder-subtle pt-2">
              <div>
                <strong>SecureIQ Browser Extension (v1.0.4)</strong>
                <div className="font-mono text-xs text-brandText-muted">IP: 192.168.1.45 • Synced 10m ago</div>
              </div>
              <button className="btn-outline btn-sm" onClick={() => alert('Revoked session token.')}>Revoke</button>
            </div>
          </div>
        </div>

        <div className="signals-container">
          <div className="signals-header">
            <h2 className="signals-title">Authentication & Security Status</h2>
          </div>
          <div className="p-6 flex flex-col gap-3 text-sm">
            <div className="flex justify-between items-center">
              <span>Two-Factor Authentication (2FA)</span>
              <span className="risk-tag risk-safe">ENABLED (TOTP)</span>
            </div>
            <div className="flex justify-between items-center border-t border-brandBorder-subtle pt-2">
              <span>Password Strength</span>
              <span className="risk-tag risk-safe">STRONG (16 CHARS)</span>
            </div>
            <div className="flex justify-between items-center border-t border-brandBorder-subtle pt-2">
              <span>SSO Enterprise Federation</span>
              <span className="risk-tag risk-low">NOT CONFIGURED</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
