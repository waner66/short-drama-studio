'use client';

import { useMemo } from 'react';

interface FormProgressRingProps {
  filledFields: number;
  totalFields: number;
  size?: number;
}

export default function FormProgressRing({ filledFields, totalFields, size = 80 }: FormProgressRingProps) {
  const percent = useMemo(() => {
    if (totalFields === 0) return 0;
    return Math.round((filledFields / totalFields) * 100);
  }, [filledFields, totalFields]);

  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  const color = percent < 30 ? '#ef4444' : percent < 70 ? '#f59e0b' : '#22c55e';

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} viewBox="0 0 80 80">
        {/* 背景环 */}
        <circle cx="40" cy="40" r={radius} fill="none" stroke="white" strokeOpacity="0.08" strokeWidth="3" />
        {/* 进度环 */}
        <circle
          cx="40" cy="40" r={radius}
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 40 40)"
          style={{ transition: 'stroke-dashoffset 0.6s ease-out' }}
          filter={`drop-shadow(0 0 4px ${color}60)`}
        />
        {/* 中间装饰 */}
        <circle cx="40" cy="40" r="18" fill="none" stroke="white" strokeOpacity="0.04" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-lg font-bold text-white leading-none">{percent}</span>
        <span className="text-[9px] text-gray-500 mt-0.5">%</span>
      </div>
    </div>
  );
}
