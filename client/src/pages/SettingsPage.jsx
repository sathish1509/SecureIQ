import React from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

export default function SettingsPage() {
  return (
    <div className="app-dashboard-shell">
      <Sidebar />

      <div className="flex flex-col gap-6">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-brandText-main mb-0.5">System Settings & Preferences</h1>
          <p className="text-sm text-brandText-muted">Manage real-time heuristics, API integration keys, and display preferences.</p>
        </div>

        <div className="signals-container">
          <div className="signals-header">
            <h2 className="signals-title">General Preferences</h2>
          </div>
          <div className="p-6 flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="language" className="text-xs font-semibold text-brandText-secondary">Platform Language</label>
              <select id="language" className="h-10 px-3 max-w-xs text-sm text-brandText-main bg-surface border border-brandBorder-strong rounded-md">
                <option value="en">English (United States)</option>
                <option value="es">Español (Spanish)</option>
                <option value="de">Deutsch (German)</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-brandText-secondary">Theme Mode</label>
              <div className="flex gap-4 text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="theme" defaultChecked className="accent-navy" /> Light Mode (Default SaaS)
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-brandText-muted">
                  <input type="radio" name="theme" disabled className="accent-navy" /> Dark Mode (Enterprise Pro)
                </label>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="retention" className="text-xs font-semibold text-brandText-secondary">Scan History Retention</label>
              <select id="retention" className="h-10 px-3 max-w-xs text-sm text-brandText-main bg-surface border border-brandBorder-strong rounded-md">
                <option value="30">30 Days</option>
                <option value="90">90 Days (Recommended)</option>
                <option value="365">365 Days (1 Year)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="signals-container">
          <div className="signals-header">
            <h2 className="signals-title">Engine Automation & Notifications</h2>
          </div>
          <div className="p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between text-sm">
              <div>
                <div className="font-semibold">Real-time Auto Scan</div>
                <div className="text-xs text-brandText-muted">Automatically evaluate links opened in the browser extension.</div>
              </div>
              <input type="checkbox" defaultChecked className="accent-navy w-4.5 h-4.5" />
            </div>

            <div className="flex items-center justify-between text-sm border-t border-brandBorder-subtle pt-3">
              <div>
                <div className="font-semibold">High-Risk Email Alerts</div>
                <div className="text-xs text-brandText-muted">Send instant desktop notifications when phishing links are detected.</div>
              </div>
              <input type="checkbox" defaultChecked className="accent-navy w-4.5 h-4.5" />
            </div>
          </div>
        </div>

        <div className="signals-container">
          <div className="signals-header">
            <h2 className="signals-title">API Authentication Keys</h2>
          </div>
          <div className="p-6 flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-brandText-secondary">Active API Key</label>
              <div className="flex gap-2">
                <input type="text" className="h-10 px-3 font-mono text-sm text-brandText-main bg-subtle border border-brandBorder-strong rounded-md flex-1" value="siq_live_99f38a109bc48d7120aef" readOnly />
                <button type="button" className="btn-secondary btn-sm" onClick={() => { navigator.clipboard.writeText('siq_live_99f38a109bc48d7120aef'); alert('API Key copied!'); }}>Copy</button>
                <button type="button" className="btn-outline btn-sm" onClick={() => alert('Regenerated new API key!')}>Regenerate</button>
              </div>
            </div>
          </div>
        </div>

        <div>
          <button type="button" className="btn-primary btn-lg" onClick={() => alert('Settings saved successfully!')}>Save Preferences</button>
        </div>
      </div>
    </div>
  );
}
