import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { timeAgo } from '../utils/timeAgo';

export default function HistoryPage() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/history?limit=100')
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        setLogs(Array.isArray(data) ? data : []);
      })
      .catch(err => console.error('Error loading scan history:', err))
      .finally(() => setLoading(false));
  }, []);

  const getVerdictBadge = (verdict) => {
    const v = (verdict || '').toLowerCase();
    if (v === 'phishing' || v === 'malicious') return { badge: 'badge-danger', text: 'Phishing' };
    if (v === 'suspicious') return { badge: 'badge-warning', text: 'Suspicious' };
    return { badge: 'badge-safe', text: 'Safe' };
  };

  const getRiskScoreClass = (score) => {
    const s = Number(score) || 0;
    if (s >= 70) return 'risk-high';
    if (s >= 40) return 'risk-medium';
    return 'risk-safe';
  };

  const getPrimarySignal = (log) => {
    if (log.reasons && log.reasons.length > 0) return log.reasons[0].title || log.reasons[0].category;
    if (log.signals && log.signals.length > 0) return log.signals[0].title || log.signals[0].category;
    return log.verdict === 'Phishing' ? 'ML Phishing Vector' : 'Verified Domain Host';
  };

  const filteredLogs = logs.filter((log) => {
    const v = (log.verdict || '').toLowerCase();
    const matchesFilter = 
      filter === 'all' || 
      (filter === 'safe' && v === 'safe') ||
      (filter === 'suspicious' && v === 'suspicious') ||
      (filter === 'malicious' && (v === 'phishing' || v === 'malicious'));

    const searchLower = search.toLowerCase();
    const signalText = getPrimarySignal(log).toLowerCase();
    const matchesSearch = log.url.toLowerCase().includes(searchLower) || signalText.includes(searchLower);
    
    return matchesFilter && matchesSearch;
  });

  const safeCount = logs.filter(l => (l.verdict || '').toLowerCase() === 'safe').length;
  const suspiciousCount = logs.filter(l => (l.verdict || '').toLowerCase() === 'suspicious').length;
  const maliciousCount = logs.filter(l => ['phishing', 'malicious'].includes((l.verdict || '').toLowerCase())).length;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-brandText-main mb-0.5">Inspection History Log</h1>
          <p className="text-sm text-brandText-muted">Audit trail of all URLs and domains analyzed by the SecureIQ engine.</p>
        </div>
        <div className="flex gap-2">
          <button className="btn-primary btn-sm" onClick={() => navigate('/scanner')}>+ Scan New Target</button>
        </div>
      </div>

      <div className="signals-container p-4 px-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-brandText-muted uppercase tracking-wider">Filter by Verdict:</span>
            <button className={`px-3 py-1 text-xs font-medium border rounded-sm cursor-pointer ${filter === 'all' ? 'bg-navy text-white border-navy' : 'bg-surface text-brandText-secondary border-brandBorder'}`} onClick={() => setFilter('all')}>All ({logs.length})</button>
            <button className={`px-3 py-1 text-xs font-medium border rounded-sm cursor-pointer ${filter === 'safe' ? 'bg-navy text-white border-navy' : 'bg-surface text-brandText-secondary border-brandBorder'}`} onClick={() => setFilter('safe')}>Safe ({safeCount})</button>
            <button className={`px-3 py-1 text-xs font-medium border rounded-sm cursor-pointer ${filter === 'suspicious' ? 'bg-navy text-white border-navy' : 'bg-surface text-brandText-secondary border-brandBorder'}`} onClick={() => setFilter('suspicious')}>Suspicious ({suspiciousCount})</button>
            <button className={`px-3 py-1 text-xs font-medium border rounded-sm cursor-pointer ${filter === 'malicious' ? 'bg-navy text-white border-navy' : 'bg-surface text-brandText-secondary border-brandBorder'}`} onClick={() => setFilter('malicious')}>Phishing ({maliciousCount})</button>
          </div>

          <div className="flex gap-3 items-center flex-1 max-w-[400px]">
            <input 
              type="search" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search URL, domain, or signal..." 
              className="h-9 px-3 w-full font-body text-xs text-brandText-main bg-surface border border-brandBorder-strong rounded-md focus:outline-none focus:border-accentBlue"
            />
          </div>
        </div>
      </div>

      <div className="signals-container">
        {loading ? (
          <div className="p-6 space-y-3 animate-pulse">
            {Array.from({ length: 5 }).map((_, idx) => (
              <div key={idx} className="h-10 bg-slate-100 rounded w-full"></div>
            ))}
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="p-12 text-center text-brandText-muted text-sm">
            {logs.length === 0 ? "No scan history recorded yet." : "No scan logs match the selected filter."}
          </div>
        ) : (
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
                {filteredLogs.map((log) => {
                  const vb = getVerdictBadge(log.verdict);
                  return (
                    <tr 
                      key={log.id || log.url} 
                      className="cursor-pointer hover:bg-slate-50 transition-colors" 
                      onClick={() => navigate(`/report?id=${log.id}`)}
                    >
                      <td className="font-mono font-semibold max-w-[280px] truncate" title={log.url}>{log.url}</td>
                      <td><span className={`verdict-badge ${vb.badge}`}>{vb.text}</span></td>
                      <td><span className={`risk-tag ${getRiskScoreClass(log.risk_score)}`}>{log.risk_score} / 100</span></td>
                      <td>{getPrimarySignal(log)}</td>
                      <td className="font-mono text-xs text-brandText-muted">{timeAgo(log.scanned_at)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
