'use client';

import { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  trend?: number;
  suffix?: string;
  className?: string;
  accent?: 'purple' | 'cyan' | 'pink' | 'amber' | 'green';
}

const accentColors = {
  purple: 'from-purple-500/20 to-purple-600/5 text-purple-400',
  cyan: 'from-cyan-500/20 to-cyan-600/5 text-cyan-400',
  pink: 'from-pink-500/20 to-pink-600/5 text-pink-400',
  amber: 'from-amber-500/20 to-amber-600/5 text-amber-400',
  green: 'from-emerald-500/20 to-emerald-600/5 text-emerald-400',
};

export default function StatCard({
  title,
  value,
  icon,
  trend,
  suffix,
  className = '',
  accent = 'purple',
}: StatCardProps) {
  const colors = accentColors[accent];

  return (
    <div
      className={`
        relative overflow-hidden rounded-2xl border border-white/10
        bg-gradient-to-br ${colors.split(' ')[0]} ${colors.split(' ')[1]}
        backdrop-blur-xl p-5 transition-all duration-300
        hover:-translate-y-0.5 hover:border-purple-500/20
        ${className}
      `}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-400">{title}</p>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-3xl font-bold text-white">{value}</span>
            {suffix && <span className="text-sm text-gray-500">{suffix}</span>}
          </div>
          {trend !== undefined && (
            <p className={`mt-1 text-xs ${trend >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
            </p>
          )}
        </div>
        {icon && (
          <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 ${colors.split(' ')[2]}`}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
