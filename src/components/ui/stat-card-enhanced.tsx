'use client';

import { useEffect, useRef, useState } from 'react';

interface StatCardEnhancedProps {
  title: string;
  value: number;
  icon?: string;
  accent?: string; // CSS color
  suffix?: string;
  prefix?: string;
  progress?: number; // 0-100, shows ring progress
  progressColor?: string;
  onClick?: () => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

function formatNumber(n: number): string {
  if (n >= 10000) return (n / 10000).toFixed(1) + '万';
  if (n >= 1000) return n.toLocaleString();
  return String(n);
}

export default function StatCardEnhanced({
  title,
  value,
  icon,
  accent,
  suffix,
  prefix,
  progress,
  progressColor,
  onClick,
  className = '',
  size = 'md',
}: StatCardEnhancedProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number>(0);

  const sizeClasses = {
    sm: 'p-3',
    md: 'p-5',
    lg: 'p-6',
  };

  const titleSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  const valueSizes = {
    sm: 'text-xl',
    md: 'text-3xl',
    lg: 'text-4xl',
  };

  // Animated counter
  useEffect(() => {
    const startTime = performance.now();
    const duration = 1200;
    const startValue = 0;

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.round(startValue + (value - startValue) * eased));

      if (progress < 1) {
        animRef.current = requestAnimationFrame(animate);
      }
    };

    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [value]);

  // 3D tilt effect
  const handleMouseMove = (e: React.MouseEvent) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -5;
    const rotateY = ((x - centerX) / centerX) * 5;

    card.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = 'perspective(600px) rotateX(0deg) rotateY(0deg) translateY(0px)';
  };

  const ringRadius = size === 'sm' ? 16 : size === 'lg' ? 28 : 22;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const ringOffset = progress !== undefined ? ringCircumference * (1 - progress / 100) : 0;

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`
        relative surface-card cursor-pointer
        overflow-hidden
        transition-all duration-300 ease-out
        ${sizeClasses[size]} ${className}
      `}
      style={{
        borderColor: accent ? `${accent}40` : undefined,
      }}
    >
      {/* Hover glow border */}
      <div
        className="absolute inset-0 opacity-0 transition-opacity duration-300 rounded-[var(--radius-lg)]"
        style={{
          background: accent
            ? `linear-gradient(135deg, ${accent}18, transparent 60%)`
            : 'linear-gradient(135deg, var(--brand-500)18, transparent 60%)',
        }}
      />

      <div className="relative z-10 flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className={`${titleSizes[size]} text-muted mb-1 flex items-center gap-1.5`}>
            {icon && <span>{icon}</span>}
            {title}
          </div>
          <div
            className={`${valueSizes[size]} font-bold tracking-tight`}
            style={{ color: accent || 'var(--text-primary)' }}
          >
            {prefix && <span className="text-lg mr-0.5 opacity-60">{prefix}</span>}
            {formatNumber(displayValue)}
            {suffix && <span className="text-base ml-1 opacity-60">{suffix}</span>}
          </div>
        </div>

        {/* Ring progress */}
        {progress !== undefined && (
          <div className="relative flex-shrink-0">
            <svg
              width={ringRadius * 2 + 8}
              height={ringRadius * 2 + 8}
              className="-rotate-90"
            >
              {/* Background ring */}
              <circle
                cx={ringRadius + 4}
                cy={ringRadius + 4}
                r={ringRadius}
                fill="none"
                stroke="var(--border-subtle)"
                strokeWidth="3"
              />
              {/* Progress ring */}
              <circle
                cx={ringRadius + 4}
                cy={ringRadius + 4}
                r={ringRadius}
                fill="none"
                stroke={progressColor || accent || 'var(--brand-500)'}
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={ringCircumference}
                strokeDashoffset={ringOffset}
                style={{
                  transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)',
                  filter: `drop-shadow(0 0 4px ${progressColor || accent || 'var(--brand-500)'}60)`,
                }}
              />
            </svg>
            <span
              className="absolute inset-0 flex items-center justify-center text-xs font-semibold"
              style={{ color: progressColor || accent || 'var(--brand-500)' }}
            >
              {Math.round(progress)}%
            </span>
          </div>
        )}
      </div>

      {/* Corner sparkle */}
      <div
        className="absolute -top-6 -right-6 w-12 h-12 rounded-full opacity-0 transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle, ${accent || 'var(--brand-500)'}40 0%, transparent 70%)`,
        }}
      />
    </div>
  );
}
