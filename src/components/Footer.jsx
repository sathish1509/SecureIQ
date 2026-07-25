import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-surface border-t border-brandBorder py-6 mt-auto">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-brandText-muted gap-2">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-brandText-main">SecureIQ Security Labs</span>
          <span className="text-brandBorder-strong">•</span>
          <span>Hackathon Edition</span>
          <span className="text-brandBorder-strong">•</span>
          <span>ML Inference & Heuristics Pipeline</span>
        </div>
        <div>
          <span>&copy; 2026 SecureIQ Inc. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}
