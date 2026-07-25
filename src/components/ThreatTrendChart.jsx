import React, { useState } from 'react';

export default function ThreatTrendChart({ 
  title = "7-Day Threat Detection Trend", 
  subtitle = "Live Database Metrics", 
  rightText = "Heuristics + ML Model Predictions",
  safeLabel = "Total Scans",
  threatLabel = "Phishing Detected",
  data = null
}) {
  const [hoverIndex, setHoverIndex] = useState(null);

  // Palette
  const totalColor = '#0f172a';   // Deep Slate Navy
  const threatColor = '#dc2626'; // Alert Red for Phishing

  let dataPoints = [];
  
  if (data && data.length > 0) {
    const maxVal = Math.max(10, ...data.map(d => Math.max(d.total || 0, d.phishing || 0)));
    const step = data.length > 1 ? 680 / (data.length - 1) : 0;

    dataPoints = data.map((item, idx) => {
      const total = item.total || 0;
      const threat = item.phishing || 0;
      const x = 70 + idx * step;
      const totalY = 170 - (total / maxVal) * 130;
      const threatY = 170 - (threat / maxVal) * 130;

      let dayLabel = item.date || `Day ${idx + 1}`;
      if (item.date) {
        const parts = item.date.split('-');
        if (parts.length === 3) {
          dayLabel = `${parts[1]}/${parts[2]}`;
        }
      }

      return {
        day: dayLabel,
        total: total,
        threat: threat,
        x: x,
        totalY: totalY,
        threatY: threatY
      };
    });
  } else {
    dataPoints = [
      { day: 'Mon', total: 0, threat: 0, x: 70, totalY: 170, threatY: 170 },
      { day: 'Tue', total: 0, threat: 0, x: 170, totalY: 170, threatY: 170 },
      { day: 'Wed', total: 0, threat: 0, x: 270, totalY: 170, threatY: 170 },
      { day: 'Thu', total: 0, threat: 0, x: 370, totalY: 170, threatY: 170 },
      { day: 'Fri', total: 0, threat: 0, x: 470, totalY: 170, threatY: 170 },
      { day: 'Sat', total: 0, threat: 0, x: 570, totalY: 170, threatY: 170 },
      { day: 'Sun', total: 0, threat: 0, x: 670, totalY: 170, threatY: 170 },
      { day: 'Today', total: 0, threat: 0, x: 750, totalY: 170, threatY: 170 }
    ];
  }

  const activeIndex = hoverIndex !== null && hoverIndex < dataPoints.length ? hoverIndex : dataPoints.length - 1;
  const activePoint = dataPoints[activeIndex] || dataPoints[0];

  const totalPolyline = dataPoints.map(p => `${p.x},${p.totalY}`).join(' ');
  const threatPolyline = dataPoints.map(p => `${p.x},${p.threatY}`).join(' ');

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

          {/* Polyline Data Lines */}
          <polyline 
            points={totalPolyline} 
            fill="none" 
            stroke={totalColor}
            strokeWidth="2.5"
          />
          <polyline 
            points={threatPolyline} 
            fill="none" 
            stroke={threatColor}
            strokeWidth="2.5"
          />

          {/* End Circles */}
          {dataPoints.map((pt, idx) => (
            <g key={idx}>
              <circle cx={pt.x} cy={pt.totalY} r="3" fill={totalColor}/>
              <circle cx={pt.x} cy={pt.threatY} r="3" fill={threatColor}/>
            </g>
          ))}

          {/* Vertical Guide Line on Hover */}
          {activePoint && (
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
            <span className="w-3 h-0.5 inline-block" style={{ backgroundColor: totalColor }}></span> 
            {safeLabel} ({activePoint ? activePoint.total : 0})
          </span>
          <span className="flex items-center gap-1.5 font-medium text-brandText-secondary">
            <span className="w-3 h-0.5 inline-block" style={{ backgroundColor: threatColor }}></span> 
            {threatLabel} ({activePoint ? activePoint.threat : 0})
          </span>
        </div>
      </div>
    </div>
  );
}
