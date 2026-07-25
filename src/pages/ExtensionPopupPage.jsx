import React from 'react';
import { Link } from 'react-router-dom';

export default function ExtensionPopupPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="text-center">
        <h1 className="font-heading text-2xl font-semibold text-brandText-main">Browser Extension Protection Mockup</h1>
        <p className="text-sm text-brandText-muted">Real-time web browsing companion popup interface.</p>
      </div>

      <div className="w-[360px] mx-auto bg-surface border border-brandBorder-strong rounded-md shadow-md overflow-hidden">
        <div className="p-4 bg-navy text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-heading font-bold text-base tracking-wider text-white">
              SECURE<span className="text-blue-400">IQ</span>
            </span>
            <span className="text-[10px] font-mono font-medium bg-white/15 text-white px-1.5 py-0.5 rounded-sm">v1.0 EXT</span>
          </div>
          <span className="w-2 h-2 rounded-full bg-safe-fill"></span>
        </div>

        <div className="p-3 px-4 bg-subtle border-b border-brandBorder-subtle text-xs">
          <div className="text-brandText-muted font-semibold uppercase text-[10px] mb-0.5">Active Tab URL</div>
          <div className="font-mono text-danger-text font-bold break-all">
            http://192.168.1.1/paypal/verify-account.login.xyz
          </div>
        </div>

        <div className="p-6 text-center">
          <span className="verdict-badge badge-danger text-sm px-3 py-1">CRITICAL PHISHING RISK</span>
          
          <div className="my-4 flex items-center justify-center gap-2">
            <span className="score-number text-5xl text-danger-text">94</span>
            <span className="score-scale">/ 100</span>
          </div>
          <p className="text-xs text-brandText-secondary">High probability credential harvesting payload.</p>
        </div>

        <div className="px-4 pb-4 border-t border-brandBorder-subtle pt-3">
          <div className="text-[10px] font-bold text-brandText-muted uppercase mb-2">Detected Threat Vectors</div>
          <div className="flex flex-col gap-1.5 text-xs text-danger-text">
            <div>⚠️ Raw IP Host (192.168.1.1)</div>
            <div>⚠️ Unencrypted HTTP Protocol</div>
            <div>⚠️ Typosquatting TLD (.xyz)</div>
          </div>
        </div>

        <div className="p-4 bg-subtle border-t border-brandBorder flex flex-col gap-2">
          <Link to="/report" className="btn-primary btn-sm w-full justify-center">Open Full Dashboard Report</Link>
          <div className="flex gap-2">
            <button type="button" className="btn-secondary btn-sm flex-1" onClick={() => alert('Rescanning active page tab...')}>🔄 Scan Again</button>
            <button type="button" className="btn-outline btn-sm flex-1" onClick={() => alert('Domain reported to SecureIQ Threat Desk!')}>🚩 Report Site</button>
          </div>
        </div>
      </div>
    </div>
  );
}
