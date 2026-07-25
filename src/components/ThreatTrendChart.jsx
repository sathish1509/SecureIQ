import React, { useState } from 'react';

export default function ThreatTrendChart({ 
  title = "7-Day Threat Detection Trend", 
  subtitle = "Updated 2m ago", 
  rightText = "Heuristics + ML Model Predictions",
  safeLabel = "Safe Traffic",
  threatLabel = "Malicious Threats"
}) {
  const [hoverIndex, setHoverIndex] = useState(7); // Default to "Today"

  // Monochrome Palette (Slate Dark & Muted Slate)
  const safeColor = '#0f172a';   // Deep Slate Navy
  const threatColor = '#64748b'; // Muted Slate Gray

  const dataPoints = [
    { day: 'Mon', safe: 240, threat: 58, x: 70, safeY: 60, threatY: 150 },
    { day: 'Tue', safe: 260, threat: 42, x: 170, safeY: 50, threatY: 160 },
    { day: 'Wed', safe: 220, threat: 78, x: 270, safeY: 70, threatY: 140 },
    { day: 'Thu', safe: 280, threat: 88, x: 370, safeY: 40, threatY: 135 },
    { day: 'Fri', safe: 250, threat: 48, x: 470, safeY: 55, threatY: 155 },
    { day: 'Sat', safe: 290, threat: 120, x: 570, safeY: 35, threatY: 120 },
    { day: 'Sun', safe: 270, threat: 98, x: 670, safeY: 45, threatY: 130 },
    { day: 'Today', safe: 284, threat: 110, x: 750, safeY: 38, threatY: 125 }
  ];

  const activePoint = dataPoints[hoverIndex] || dataPoints[7];

  return (
    <div className="signals-container">
      {/* Header */}
      <div className="signals-header">
        <div className="flex items-center gap-3">
          <h2 className="signals-title">{title}</h2>
          <span className="signals-count">{subtitle}</span>
        </div>
        <div className="text-xs text-brandText-muted hidden sm:block">{rightText}</div>
      </div>

      {/* SVG Line Chart */}
      <div className="p-6">
        <svg viewBox="0 0 800 200" className="w-full h-auto font-mono text-[11px] overflow-visible">
          {/* Grid lines */}
          <line x1="50" y1="30" x2="770" y2="30" stroke="#e2e8f0" strokeDasharray="4"/>
          <line x1="50" y1="80" x2="770" y2="80" stroke="#e2e8f0" strokeDasharray="4"/>
          <line x1="50" y1="130" x2="770" y2="130" stroke="#e2e8f0" strokeDasharray="4"/>
          <line x1="50" y1="170" x2="770" y2="170" stroke="#cbd5e1"/>

          {/* Y-Axis Labels */}
          <text x="35" y="34" textAnchor="end" fill="#64748b">300</text>
          <text x="35" y="84" textAnchor="end" fill="#64748b">200</text>
          <text x="35" y="134" textAnchor="end" fill="#64748b">100</text>
          <text x="35" y="174" textAnchor="end" fill="#64748b">0</text>

          {/* Polyline Data Lines */}
          <polyline 
            points="70,60 170,50 270,70 370,40 470,55 570,35 670,45 750,38" 
            fill="none" 
            stroke={safeColor}
            strokeWidth="2.5"
          />
          <polyline 
            points="70,150 170,160 270,140 370,135 470,155 570,120 670,130 750,125" 
            fill="none" 
            stroke={threatColor}
            strokeWidth="2.5"
          />

          {/* End Circles */}
          <circle cx="750" cy="38" r="4" fill={safeColor}/>
          <circle cx="750" cy="125" r="4" fill={threatColor}/>

          {/* Vertical Guide Line on Hover */}
          {hoverIndex !== null && (
            <line
              x1={activePoint.x}
              y1="30"
              x2={activePoint.x}
              y2="170"
              stroke="#94a3b8"
              strokeWidth="1"
              strokeDasharray="3 3"
            />
          )}

          {/* Transparent Hover Areas */}
          {dataPoints.map((pt, idx) => (
            <g key={idx} onMouseEnter={() => setHoverIndex(idx)} className="cursor-pointer">
              <rect
                x={pt.x - 30}
                y="20"
                width="60"
                height="150"
                fill="transparent"
              />
              <text
                x={pt.x}
                y="190"
                textAnchor="middle"
                fill={hoverIndex === idx ? '#0f172a' : '#64748b'}
                fontWeight={hoverIndex === idx ? 'bold' : 'normal'}
                className="text-[11px]"
              >
                {pt.day}
              </text>
            </g>
          ))}
        </svg>

        {/* Legend */}
        <div className="flex gap-6 justify-center mt-3 text-xs">
          <span className="flex items-center gap-1.5 font-medium text-brandText-secondary">
            <span className="w-3 h-0.5 inline-block" style={{ backgroundColor: safeColor }}></span> 
            {safeLabel} ({activePoint.safe})
          </span>
          <span className="flex items-center gap-1.5 font-medium text-brandText-secondary">
            <span className="w-3 h-0.5 inline-block" style={{ backgroundColor: threatColor }}></span> 
            {threatLabel} ({activePoint.threat})
          </span>
        </div>
      </div>
    </div>
  );
}
