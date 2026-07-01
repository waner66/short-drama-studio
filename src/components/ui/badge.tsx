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

const variantConfig: Record<BadgeVariant, { icon: string; label: string; cls: string }> = {
  hot:    { icon: '🔥', label: '热销', cls: 'bg-rose-500/20 text-rose-400 border-rose-500/30' },
  new:    { icon: '🆕', label: '新品', cls: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
  limited:{ icon: '⏰', label: '限时', cls: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
  free:   { icon: '🎁', label: '免费', cls: 'bg-green-500/20 text-green-400 border-green-500/30' },
  purchased:{ icon: '✅', label: '已购', cls: 'bg-sky-500/20 text-sky-400 border-sky-500/30' },
  premium:{ icon: '👑', label: '精选', cls: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
  best:   { icon: '⭐', label: '好评', cls: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
};

const sizeClasses: Record<BadgeSize, string> = {
  sm: 'text-[10px] px-1.5 py-0.5 gap-0.5',
  md: 'text-xs px-2 py-0.5 gap-1',
};

export default function Badge({ variant, size = 'sm', children, className = '' }: BadgeProps) {
  const cfg = variantConfig[variant];
  return (
    <span
      className={`inline-flex items-center rounded-full border font-medium ${sizeClasses[size]} ${cfg.cls} ${className}`}
    >
      {cfg.icon}
      {children || cfg.label}
    </span>
  );
}
