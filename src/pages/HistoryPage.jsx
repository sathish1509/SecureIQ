import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function HistoryPage() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const logs = [
    { url: 'http://192.168.1.1/paypal/verify-account.login.xyz', verdict: 'malicious', badge: 'badge-danger', badgeText: 'Malicious', score: '94 / 100', scoreClass: 'risk-high', signal: 'Raw IP Address + Typosquatting TLD', time: '2026-07-25 11:04:12 UTC' },
    { url: 'http://secure-update-banking-verification.com/login', verdict: 'suspicious', badge: 'badge-warning', badgeText: 'Suspicious', score: '62 / 100', scoreClass: 'risk-medium', signal: 'Targeted Credential Keywords', time: '2026-07-25 10:58:30 UTC' },
    { url: 'https://github.com/security-advisories', verdict: 'safe', badge: 'badge-safe', badgeText: 'Safe', score: '08 / 100', scoreClass: 'risk-safe', time: '2026-07-25 10:45:15 UTC' },
    { url: 'http://free-apple-giftcard-claim.tk/auth', verdict: 'malicious', badge: 'badge-danger', badgeText: 'Malicious', score: '88 / 100', scoreClass: 'risk-high', signal: 'Zero-Day Phishing Heuristic Match', time: '2026-07-25 10:12:04 UTC' },
    { url: 'https://google.com', verdict: 'safe', badge: 'badge-safe', badgeText: 'Safe', score: '04 / 100', scoreClass: 'risk-safe', signal: 'Verified Domain Authority', time: '2026-07-25 09:30:00 UTC' },
    { url: 'http://account-recovery-portal.net/signin', verdict: 'suspicious', badge: 'badge-warning', badgeText: 'Suspicious', score: '54 / 100', scoreClass: 'risk-medium', signal: 'Young Domain Registration (< 5 days)', time: '2026-07-24 18:22:10 UTC' },
    { url: 'http://bit.ly/3xY9P1k-fake-auth', verdict: 'malicious', badge: 'badge-danger', badgeText: 'Malicious', score: '92 / 100', scoreClass: 'risk-high', signal: 'Shortener Obfuscation & Redirect Chain', time: '2026-07-24 15:40:02 UTC' }
  ];

  const filteredLogs = logs.filter((log) => {
    const matchesFilter = filter === 'all' || log.verdict === filter;
    const matchesSearch = log.url.toLowerCase().includes(search.toLowerCase()) || (log.signal && log.signal.toLowerCase().includes(search.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-brandText-main mb-0.5">Inspection History Log</h1>
          <p className="text-sm text-brandText-muted">Audit trail of all URLs, domains, and emails analyzed by the SecureIQ engine.</p>
        </div>
        <div className="flex gap-2">
          <button className="btn-primary btn-sm" onClick={() => navigate('/scanner')}>+ Scan New Target</button>
          <button className="btn-secondary btn-sm" onClick={() => alert('Exporting CSV log of past 500 scans...')}>📥 Export CSV</button>
        </div>
      </div>

      <div className="signals-container p-4 px-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-brandText-muted uppercase tracking-wider">Filter by Verdict:</span>
            <button className={`px-3 py-1 text-xs font-medium border rounded-sm ${filter === 'all' ? 'bg-navy text-white border-navy' : 'bg-surface text-brandText-secondary border-brandBorder'}`} onClick={() => setFilter('all')}>All (2,491)</button>
            <button className={`px-3 py-1 text-xs font-medium border rounded-sm ${filter === 'safe' ? 'bg-navy text-white border-navy' : 'bg-surface text-brandText-secondary border-brandBorder'}`} onClick={() => setFilter('safe')}>Safe (1,850)</button>
            <button className={`px-3 py-1 text-xs font-medium border rounded-sm ${filter === 'suspicious' ? 'bg-navy text-white border-navy' : 'bg-surface text-brandText-secondary border-brandBorder'}`} onClick={() => setFilter('suspicious')}>Suspicious (420)</button>
            <button className={`px-3 py-1 text-xs font-medium border rounded-sm ${filter === 'malicious' ? 'bg-navy text-white border-navy' : 'bg-surface text-brandText-secondary border-brandBorder'}`} onClick={() => setFilter('malicious')}>Malicious (221)</button>
          </div>

          <div className="flex gap-3 items-center flex-1 max-w-[400px]">
            <input 
              type="search" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search URL, domain, or keyword..." 
              className="h-9 px-3 w-full font-body text-xs text-brandText-main bg-surface border border-brandBorder-strong rounded-md focus:outline-none focus:border-accentBlue"
            />
          </div>
        </div>
      </div>

      <div className="signals-container">
        <div className="table-wrapper">
          <table className="signals-table">
            <thead>
              <tr>
                <th style={{ width: '35%' }}>Analyzed Target / URL</th>
                <th style={{ width: '15%' }}>Verdict</th>
                <th style={{ width: '12%' }}>Risk Score</th>
                <th style={{ width: '20%' }}>Top Triggered Signal</th>
                <th style={{ width: '18%' }}>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log, idx) => (
                <tr key={idx} className="cursor-pointer" onClick={() => navigate('/report')}>
                  <td className="font-mono font-semibold">{log.url}</td>
                  <td><span className={`verdict-badge ${log.badge}`}>{log.badgeText}</span></td>
                  <td><span className={`risk-tag ${log.scoreClass}`}>{log.score}</span></td>
                  <td>{log.signal}</td>
                  <td className="font-mono text-xs">{log.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
