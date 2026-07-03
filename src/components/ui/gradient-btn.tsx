'use client';

import { ReactNode } from 'react';

interface GradientBtnProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'market' | 'community' | 'create' | 'sell' | 'tag-chip' | 'icon-round';
  size?: 'sm' | 'md' | 'lg';
  icon?: ReactNode;
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  href?: string;
  /** Whether tag-chip is in active/selected state */
  active?: boolean;
}

const sizeClasses = {
  sm: 'px-4 py-2 text-sm rounded-lg',
  md: 'px-6 py-3 text-base rounded-xl',
  lg: 'px-8 py-4 text-lg rounded-xl',
};

const variantClasses: Record<string, string> = {
  primary:
    'bg-gradient-to-r from-brand-500 to-brand-400 text-white hover:from-brand-400 hover:to-brand-300 shadow-md shadow-brand-500/20',
  secondary:
    'bg-[var(--surface-elevated)] text-[var(--text-primary)] hover:bg-[var(--surface-overlay)] border border-[var(--border-default)]',
  outline:
    'bg-transparent text-[var(--text-secondary)] border border-[var(--border-default)] hover:border-[var(--brand-400)] hover:text-[var(--brand-400)]',
  ghost:
    'bg-transparent text-[var(--text-muted)] hover:bg-[var(--surface-elevated)] hover:text-[var(--text-secondary)]',
  /* Scene CTA variants */
  market:
    'bg-gradient-to-r from-amber-500/90 to-orange-500/90 text-white hover:from-amber-400 hover:to-orange-400 shadow-md shadow-amber-500/20',
  community:
    'bg-gradient-to-r from-cyan-500/90 to-blue-500/90 text-white hover:from-cyan-400 hover:to-blue-400 shadow-md shadow-cyan-500/20',
  create:
    'bg-gradient-to-r from-violet-500/90 to-purple-500/90 text-white hover:from-violet-400 hover:to-purple-400 shadow-md shadow-violet-500/20',
  sell:
    'bg-gradient-to-r from-indigo-500/90 to-pink-500/90 text-white hover:from-indigo-400 hover:to-pink-400 shadow-md shadow-indigo-500/20',
  'tag-chip':
    'rounded-full px-3 py-1 text-xs font-medium bg-white/5 text-gray-400 border border-white/5 hover:bg-purple-500/10 hover:text-purple-400 hover:border-purple-500/20',
  'icon-round':
    'rounded-full p-2 text-gray-400 hover:text-purple-400 hover:bg-purple-500/10 hover:scale-110 active:scale-95',
};

/** Variants that use their own sizing (skip sizeClasses) */
const SELF_SIZED_VARIANTS = new Set(['tag-chip', 'icon-round']);

/** Variants that receive the shine-sweep overlay animation */
const SHINE_VARIANTS = new Set(['primary', 'market', 'community', 'create', 'sell']);

export default function GradientBtn({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  icon,
  className = '',
  disabled = false,
  loading = false,
  href,
  active = false,
}: GradientBtnProps) {
  const hasShine = SHINE_VARIANTS.has(variant);

  const baseClasses = [
    'inline-flex items-center justify-center gap-2 font-semibold',
    'transition-all duration-300 cursor-pointer',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    'active:scale-95',
    'hover:scale-[1.03]',
    !SELF_SIZED_VARIANTS.has(variant) ? (size !== 'lg' ? sizeClasses[size] : sizeClasses.lg) : '',
    variantClasses[variant] || variantClasses.primary,
    active ? 'ring-2 ring-purple-500/30 animate-pulse' : '',
    hasShine ? 'relative overflow-hidden group' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const content = (
    <>
      {loading ? (
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-current animate-pulse" style={{ animationDelay: '0ms' }} />
          <span className="h-2 w-2 rounded-full bg-current animate-pulse" style={{ animationDelay: '200ms' }} />
          <span className="h-2 w-2 rounded-full bg-current animate-pulse" style={{ animationDelay: '400ms' }} />
        </span>
      ) : (
        <>
          {icon && <span className="shrink-0">{icon}</span>}
          {children && <span>{children}</span>}
        </>
      )}
      {/* Shine sweep overlay */}
      {hasShine && (
        <span
          className="
            pointer-events-none absolute inset-0
            bg-gradient-to-r from-transparent via-white/20 to-transparent
            -translate-x-full group-hover:translate-x-full
            transition-transform duration-700 ease-in-out
          "
          aria-hidden
        />
      )}
      {/* Shine animation keyframes injection */}
      {hasShine && (
        <style>{`
          @keyframes gb-shine {
            0%   { transform: translateX(-100%); }
            100% { transform: translateX(200%); }
          }
        `}</style>
      )}
    </>
  );

  if (href) {
    return (
      <a href={href} className={baseClasses}>
        {content}
      </a>
    );
  }

  return (
    <button onClick={onClick} disabled={disabled || loading} className={baseClasses}>
      {content}
    </button>
  );
}
