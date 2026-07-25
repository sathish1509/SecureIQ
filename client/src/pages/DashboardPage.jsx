import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import ThreatTrendChart from '../components/ThreatTrendChart';
import { timeAgo } from '../utils/timeAgo';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../config';

export default function DashboardPage() {
  const { token } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentScans, setRecentScans] = useState([]);
  const [trendData, setTrendData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchDashboardData = async (isManual = false) => {
    if (isManual) setIsRefreshing(true);
    else setLoading(true);

    const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

    try {
      const [statsRes, historyRes, trendRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/stats`, { headers }).then(res => res.ok ? res.json() : null),
        fetch(`${API_BASE_URL}/api/history?limit=10`, { headers }).then(res => res.ok ? res.json() : []),
        fetch(`${API_BASE_URL}/api/trend?days=7`, { headers }).then(res => res.ok ? res.json() : [])
      ]);

      if (statsRes) setStats(statsRes);
      if (Array.isArray(historyRes)) setRecentScans(historyRes);
      if (Array.isArray(trendRes)) setTrendData(trendRes);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const getVerdictBadge = (verdict) => {
    const v = (verdict || '').toLowerCase();
    if (v === 'phishing' || v === 'malicious' || v === 'danger') {
      return <span className="verdict-badge badge-danger">Phishing</span>;
    }
    if (v === 'suspicious' || v === 'warning') {
      return <span className="verdict-badge badge-warning">Suspicious</span>;
    }
    return <span className="verdict-badge badge-safe">Safe</span>;
  };

  const getRiskTag = (score) => {
    const num = Number(score) || 0;
    if (num >= 70) {
      return <span className="risk-tag risk-high">{num} / 100</span>;
    }
    if (num >= 40) {
      return <span className="risk-tag risk-medium">{num} / 100</span>;
    }
    return <span className="risk-tag risk-safe">{num.toString().padStart(2, '0')} / 100</span>;
  };

  const getPrimarySignal = (scan) => {
    if (scan.reasons && scan.reasons.length > 0) {
      return scan.reasons[0].title || scan.reasons[0].category || 'Heuristic Match';
    }
    if (scan.signals && scan.signals.length > 0) {
      return scan.signals[0].title || scan.signals[0].category || 'Heuristic Match';
    }
    return scan.verdict === 'Phishing' ? 'ML Model Phishing Signal' : 'Verified Host Structure';
  };

  const isEmptyState = !loading && stats && stats.total_scans === 0 && recentScans.length === 0;

  return (
    <div className="app-dashboard-shell">
      <Sidebar />

      <div className="flex flex-col gap-6">
        {/* Header & Actions */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="font-heading text-2xl font-semibold text-brandText-main mb-0.5">
              Security Command Center
            </h1>
            <p className="text-sm text-brandText-muted">
              Real-time threat monitoring and heuristic detection overview.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchDashboardData(true)}
              disabled={isRefreshing || loading}
              className="btn-outline btn-sm flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              title="Refresh scan telemetry data"
            >
              <span className={`inline-block ${isRefreshing ? 'animate-spin' : ''}`}>↻</span>
              <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
            </button>
            <Link to="/scanner" className="btn-primary btn-sm">+ Scan New URL</Link>
            <Link to="/email-scanner" className="btn-secondary btn-sm">+ Analyze Email</Link>
          </div>
        </div>

        {/* Top 4 Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {loading ? (
            // Skeleton state for stat cards
            Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="bg-surface border border-brandBorder rounded-md p-4 shadow-sm flex flex-col gap-3 animate-pulse">
                <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                <div className="h-8 bg-slate-300 rounded w-3/4"></div>
                <div className="h-3 bg-slate-200 rounded w-2/3"></div>
              </div>
            ))
          ) : (
            <>
              <div className="bg-surface border border-brandBorder rounded-md p-4 shadow-sm flex flex-col gap-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-brandText-muted">
                  Total URLs Scanned
                </span>
                <span className="score-number text-3xl">
                  {stats?.total_scans?.toLocaleString() ?? 0}
                </span>
                <span className="text-xs font-medium text-brandText-muted">
                  Uptime: {stats?.uptime ?? 'Active'}
                </span>
              </div>

              <div className="bg-surface border border-brandBorder rounded-md p-4 shadow-sm flex flex-col gap-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-brandText-muted">
                  Safe Sites
                </span>
                <span className="score-number text-3xl text-safe-fill">
                  {stats?.safe_count?.toLocaleString() ?? 0}
                </span>
                <span className="text-xs font-medium text-safe-text">
                  {stats?.total_scans ? `${Math.round((stats.safe_count / stats.total_scans) * 100)}% benign traffic` : '0% benign traffic'}
                </span>
              </div>

              <div className="bg-surface border border-brandBorder rounded-md p-4 shadow-sm flex flex-col gap-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-brandText-muted">
                  Suspicious Flagged
                </span>
                <span className="score-number text-3xl text-warn-fill">
                  {stats?.suspicious_count?.toLocaleString() ?? 0}
                </span>
                <span className="text-xs font-medium text-warn-text">
                  Medium risk heuristic match
                </span>
              </div>

              <div className="bg-surface border border-brandBorder rounded-md p-4 shadow-sm flex flex-col gap-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-brandText-muted">
                  Phishing Detected
                </span>
                <span className="score-number text-3xl text-danger-fill">
                  {stats?.phishing_count?.toLocaleString() ?? 0}
                </span>
                <span className="text-xs font-medium text-danger-text">
                  Confirmed threat attempts
                </span>
              </div>
            </>
          )}
        </div>

        {/* 7-Day Threat Trend Area Chart */}
        {loading ? (
          <div className="signals-container p-6 animate-pulse flex flex-col gap-4">
            <div className="h-4 bg-slate-200 rounded w-1/4"></div>
            <div className="h-48 bg-slate-200 rounded w-full"></div>
          </div>
        ) : (
          <ThreatTrendChart 
            data={trendData} 
            subtitle={`Engine Uptime: ${stats?.uptime || 'Active'}`}
          />
        )}

        {/* Recent Activity Table */}
        <div className="signals-container">
          <div className="signals-header">
            <div className="flex items-center gap-3">
              <h2 className="signals-title">Recent Inspection Log</h2>
              <span className="signals-count">
                {recentScans.length > 0 ? `Last ${recentScans.length} Scans` : 'Telemetry Log'}
              </span>
            </div>
            <Link to="/history" className="font-mono text-accentBlue no-underline text-xs">
              View Full History →
            </Link>
          </div>

          {loading ? (
            // Skeleton state for table
            <div className="p-4 space-y-3 animate-pulse">
              {Array.from({ length: 5 }).map((_, idx) => (
                <div key={idx} className="h-10 bg-slate-100 rounded w-full"></div>
              ))}
            </div>
          ) : isEmptyState ? (
            // Empty state view
            <div className="p-12 text-center flex flex-col items-center justify-center gap-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 text-xl">
                🔍
              </div>
              <h3 className="text-base font-semibold text-brandText-main">No scans recorded yet</h3>
              <p className="text-sm text-brandText-muted max-w-md">
                Try scanning a URL to run live heuristic extraction and scikit-learn threat model classification.
              </p>
              <Link to="/scanner" className="btn-primary btn-sm mt-2">
                Launch URL Scanner →
              </Link>
            </div>
          ) : (
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
                  {recentScans.map((scan) => (
                    <tr key={scan.id || scan.url}>
                      <td className="font-mono max-w-[280px] truncate" title={scan.url}>
                        {scan.url}
                      </td>
                      <td>{getVerdictBadge(scan.verdict)}</td>
                      <td>{getRiskTag(scan.risk_score)}</td>
                      <td>{getPrimarySignal(scan)}</td>
                      <td className="font-mono text-brandText-muted">
                        {timeAgo(scan.scanned_at)}
                      </td>
                      <td>
                        <Link to={`/report${scan.id ? `?id=${scan.id}` : ''}`} className="btn-outline btn-sm">
                          Report
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
