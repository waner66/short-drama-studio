'use client';

import { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  trend?: number;
  trendLabel?: string;
  suffix?: string;
  className?: string;
  accent?: 'purple' | 'cyan' | 'pink' | 'amber' | 'green';
}

const accentColors: Record<string, string> = {
  purple: 'bg-violet-500/10 text-violet-400',
  cyan:   'bg-cyan-500/10 text-cyan-400',
  pink:   'bg-pink-500/10 text-pink-400',
  amber:  'bg-amber-500/10 text-amber-400',
  green:  'bg-emerald-500/10 text-emerald-400',
};

export default function StatCard({
  title,
  value,
  icon,
  trend,
  trendLabel,
  suffix,
  className = '',
  accent = 'purple',
}: StatCardProps) {
  return (
    <div
      className={`
        surface-card p-5 transition-shadow duration-200
        hover:shadow-[var(--shadow-elevated)]
        ${className}
      `}
    >
      {/* Title row */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs text-[var(--text-muted)] font-medium tracking-wide uppercase">{title}</p>
        {icon && (
          <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${accentColors[accent]}`}>
            {icon}
          </div>
        )}
      </div>

      {/* Value */}
      <div className="flex items-baseline gap-1">
        <span className="text-[28px] font-bold text-[var(--text-primary)] leading-tight tracking-tight">
          {value}
        </span>
        {suffix && <span className="text-sm text-[var(--text-muted)]">{suffix}</span>}
      </div>

      {/* Trend indicator */}
      {trend !== undefined && (
        <div className="mt-2 flex items-center gap-1.5">
          {trend >= 0 ? (
            <svg viewBox="0 0 12 12" className="w-3 h-3 text-emerald-400" fill="none">
              <path d="M6 2.5v7M3.5 5L6 2.5 8.5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          ) : (
            <svg viewBox="0 0 12 12" className="w-3 h-3 text-red-400" fill="none">
              <path d="M6 9.5v-7M3.5 7L6 9.5 8.5 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
          <span className={`text-xs font-medium ${trend >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {trend >= 0 ? '+' : ''}{trend}%
          </span>
          {trendLabel && <span className="text-xs text-[var(--text-muted)]">{trendLabel}</span>}
        </div>
      )}
    </div>
  );
}
