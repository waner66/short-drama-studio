'use client';

import { ReactNode } from 'react';

type BadgeVariant = 'hot' | 'new' | 'limited' | 'free' | 'purchased' | 'premium' | 'best';
type BadgeSize = 'sm' | 'md';

interface BadgeProps {
  variant: BadgeVariant;
  size?: BadgeSize;
  children?: ReactNode;
  className?: string;
}

/* ---- SVG icons replacing emoji ---- */
const Icons: Record<BadgeVariant, ReactNode> = {
  hot: (
    <svg viewBox="0 0 16 16" fill="none" className="w-3 h-3">
      <path d="M8 1C6.5 4 4 5.5 4 8.5a4 4 0 008 0C12 5.5 9.5 4 8 1Z" fill="currentColor" opacity="0.8"/>
      <path d="M8 4C7 5.5 6 7 6 9a2 2 0 004 0C10 7 9 5.5 8 4Z" fill="currentColor"/>
    </svg>
  ),
  new: (
    <svg viewBox="0 0 16 16" fill="none" className="w-3 h-3">
      <path d="M8 2l1.5 4.5H14l-3.5 2.8 1.3 4.7L8 11.2 4.2 14l1.3-4.7L2 6.5h4.5L8 2Z" fill="currentColor"/>
    </svg>
  ),
  limited: (
    <svg viewBox="0 0 16 16" fill="none" className="w-3 h-3">
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M8 5v3.5M8 11V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  free: (
    <svg viewBox="0 0 16 16" fill="none" className="w-3 h-3">
      <rect x="3" y="5" width="10" height="7" rx="1" stroke="currentColor" strokeWidth="1.3"/>
      <path d="M8 5V3a2 2 0 012-2h0a2 2 0 012 2v2" stroke="currentColor" strokeWidth="1.3"/>
      <path d="M8 9v1.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  ),
  purchased: (
    <svg viewBox="0 0 16 16" fill="none" className="w-3 h-3">
      <path d="M3 8l3.5 3.5L13 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  premium: (
    <svg viewBox="0 0 16 16" fill="none" className="w-3 h-3">
      <path d="M8 1l2 5h5l-4 3 1.5 5L8 11l-4.5 3L5 9l-4-3h5L8 1Z" fill="currentColor"/>
    </svg>
  ),
  best: (
    <svg viewBox="0 0 16 16" fill="none" className="w-3 h-3">
      <path d="M8 1l1.8 3.6 4 .6-2.9 2.8.7 4L8 10.3 4.4 12l.7-4-2.9-2.8 4-.6L8 1Z" fill="currentColor"/>
    </svg>
  ),
};

const variantConfig: Record<BadgeVariant, { label: string; cls: string }> = {
  hot:       { label: '热销', cls: 'bg-rose-500/10 text-rose-400 border-rose-500/20' },
  new:       { label: '新品', cls: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  limited:   { label: '限时', cls: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  free:      { label: '免费', cls: 'bg-green-500/10 text-green-400 border-green-500/20' },
  purchased: { label: '已购', cls: 'bg-sky-500/10 text-sky-400 border-sky-500/20' },
  premium:   { label: '精选', cls: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
  best:      { label: '好评', cls: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' },
};

const sizeClasses: Record<BadgeSize, string> = {
  sm: 'text-[10px] px-1.5 py-0.5 gap-1',
  md: 'text-xs px-2 py-1 gap-1',
};

export default function Badge({ variant, size = 'sm', children, className = '' }: BadgeProps) {
  const cfg = variantConfig[variant];
  return (
    <span
      className={`inline-flex items-center rounded-full border font-medium leading-none ${sizeClasses[size]} ${cfg.cls} ${className}`}
    >
      {Icons[variant]}
      {children || cfg.label}
    </span>
  );
}
