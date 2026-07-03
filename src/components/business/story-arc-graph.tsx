'use client';

import React, { useEffect, useRef, useState } from 'react';

export interface StoryPoint {
  label: string;       // scene name / event
  tension: number;     // 0-10
  mood?: string;       // 紧张/温馨/悲伤/欢乐/悬疑
  description?: string;
}

interface StoryArcGraphProps {
  points: StoryPoint[];
  width?: number;
  height?: number;
  className?: string;
  title?: string;
}

const MOOD_COLORS: Record<string, string> = {
  '紧张': '#ef4444',
  '温馨': '#f59e0b',
  '悲伤': '#3b82f6',
  '欢乐': '#22c55e',
  '悬疑': '#8b5cf6',
  '史诗': '#ec4899',
  '浪漫': '#f472b6',
};

export default function StoryArcGraph({
  points,
  width = 700,
  height = 280,
  className = '',
  title = '故事张力曲线',
}: StoryArcGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [animProgress, setAnimProgress] = useState(0);

  // Entrance animation - must be before early return (React Hooks rules)
  useEffect(() => {
    let start: number | null = null;
    const animate = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / 1500, 1);
      setAnimProgress(1 - Math.pow(1 - p, 3));
      if (p < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, []);

  const validPoints = points.filter((p) => p.tension >= 0 && p.tension <= 10);
  if (validPoints.length === 0) return null;

  const padding = { top: 40, right: 30, bottom: 50, left: 40 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;
  const maxTension = 10;

  const getX = (i: number) => {
    if (validPoints.length === 1) return padding.left + chartW / 2;
    return padding.left + (chartW * i) / (validPoints.length - 1);
  };

  const getY = (tension: number) => {
    const ratio = 1 - tension / maxTension; // high tension = top
    return padding.top + ratio * chartH;
  };

  // Build area path
  const areaPath = validPoints
    .map((p, i) => {
      const x = getX(i);
      const y = getY(p.tension);
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    })
    .join(' ');

  const lastX = getX(validPoints.length - 1);
  const baseline = padding.top + chartH;
  const areaClosePath = `${areaPath} L ${lastX} ${baseline} L ${getX(0)} ${baseline} Z`;

  // Build curve line
  const linePath = validPoints
    .map((p, i) => {
      const x = getX(i);
      const y = getY(p.tension);
      // Catmull-Rom smooth curve
      if (i === 0) return `M ${x} ${y}`;
      const prev = getX(i - 1);
      const prevY = getY(validPoints[i - 1].tension);
      const cpx1 = prev + (x - prev) * 0.4;
      const cpx2 = prev + (x - prev) * 0.6;
      return `C ${cpx1} ${prevY} ${cpx2} ${y} ${x} ${y}`;
    })
    .join(' ');

  return (
    <div className={`surface-card p-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-primary">{title}</span>
        </div>
        <span className="text-xs text-muted">
          {validPoints.length} 个节点
        </span>
      </div>

      <svg
        ref={svgRef}
        viewBox={`0 0 ${width} ${height}`}
        width="100%"
        height={height}
        style={{ maxWidth: width }}
      >
        <defs>
          <linearGradient id="tensionGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ef4444" stopOpacity="0.35" />
            <stop offset="40%" stopColor="#f59e0b" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.05" />
          </linearGradient>
          <linearGradient id="storyLineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#ec4899" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#ef4444" stopOpacity="0.9" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Grid lines */}
        {[2, 4, 6, 8].map((t) => (
          <line
            key={t}
            x1={padding.left}
            x2={padding.left + chartW}
            y1={getY(t)}
            y2={getY(t)}
            stroke="var(--border-subtle)"
            strokeWidth="0.5"
            strokeDasharray="3 6"
            opacity="0.5"
          />
        ))}

        {/* Y-axis labels */}
        {[0, 5, 10].map((t) => (
          <text
            key={t}
            x={padding.left - 8}
            y={getY(t) + 4}
            textAnchor="end"
            fontSize="10"
            fill="var(--text-muted)"
          >
            {t}
          </text>
        ))}

        {/* Area fill */}
        <path
          d={areaClosePath}
          fill="url(#tensionGradient)"
          opacity={0.6 * animProgress}
          style={{ transition: 'opacity 0.5s ease' }}
        />

        {/* Main line */}
        <path
          d={linePath}
          fill="none"
          stroke="url(#storyLineGrad)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#glow)"
          opacity={animProgress}
          style={{ transition: 'opacity 0.5s ease' }}
          strokeDasharray={`${animProgress * 5000} 5000`}
        />

        {/* Data points */}
        {validPoints.map((p, i) => {
          const x = getX(i);
          const y = getY(p.tension);
          const isHovered = hoveredIdx === i;
          const color = MOOD_COLORS[p.mood || ''] || '#8b5cf6';

          return (
            <g key={i} onMouseEnter={() => setHoveredIdx(i)} onMouseLeave={() => setHoveredIdx(null)}>
              {/* Hit area */}
              <circle cx={x} cy={y} r="18" fill="transparent" style={{ cursor: 'pointer' }} />

              {/* Point */}
              <circle
                cx={x}
                cy={y}
                r={isHovered ? 7 : 4.5}
                fill={color}
                stroke="var(--surface-card)"
                strokeWidth="2"
                style={{
                  transition: 'r 0.2s ease',
                  filter: isHovered ? 'drop-shadow(0 0 6px currentColor)' : 'none',
                }}
              />

              {/* Hover tooltip */}
              {isHovered && (
                <g>
                  <rect
                    x={x - 50}
                    y={y - 55}
                    width="100"
                    height="40"
                    rx="6"
                    fill="var(--surface-elevated)"
                    stroke="var(--border-default)"
                    strokeWidth="1"
                  />
                  <text
                    x={x}
                    y={y - 38}
                    textAnchor="middle"
                    fontSize="11"
                    fill="var(--text-primary)"
                    fontWeight="600"
                  >
                    {p.label}
                  </text>
                  <text
                    x={x}
                    y={y - 24}
                    textAnchor="middle"
                    fontSize="10"
                    fill={color}
                  >
                    张力 {p.tension} {p.mood ? `/ ${p.mood}` : ''}
                  </text>
                </g>
              )}
            </g>
          );
        })}

        {/* X-axis labels */}
        {validPoints.map((p, i) => {
          const x = getX(i);
          const show = validPoints.length <= 12 || i % Math.ceil(validPoints.length / 10) === 0;
          if (!show) return null;
          return (
            <text
              key={`label-${i}`}
              x={x}
              y={baseline + 20}
              textAnchor="middle"
              fontSize="10"
              fill="var(--text-muted)"
              transform={`rotate(-25, ${x}, ${baseline + 20})`}
            >
              {p.label.length > 8 ? p.label.slice(0, 8) + '…' : p.label}
            </text>
          );
        })}
      </svg>
    </div>
  );
}
