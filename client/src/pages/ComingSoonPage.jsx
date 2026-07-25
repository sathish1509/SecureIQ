import React from 'react';
import { Link } from 'react-router-dom';

export default function ComingSoonPage() {
  return (
    <div className="text-center max-w-[600px] mx-auto my-12">
      <div className="bg-surface border border-brandBorder rounded-md p-8 shadow-sm">
        <span className="text-xs font-mono font-medium text-brandText-muted bg-subtle px-2 py-1 border border-brandBorder-subtle rounded-sm mb-3 inline-block">
          FEATURE IN DEVELOPMENT
        </span>
        <h1 className="font-heading text-3xl font-semibold text-brandText-main mb-3">Coming Soon</h1>
        <p className="text-sm text-brandText-muted mb-6">
          This feature module is currently undergoing security audits and performance tuning. It will be available in the next platform release.
        </p>
        <div className="flex gap-4 justify-center">
          <Link to="/dashboard" className="btn-primary">Return to Dashboard</Link>
          <Link to="/scanner" className="btn-secondary">Go to URL Scanner</Link>
        </div>
      </div>
    </div>
  );
}
