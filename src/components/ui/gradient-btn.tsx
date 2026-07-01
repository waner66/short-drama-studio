'use client';

import { ReactNode } from 'react';

interface GradientBtnProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'market' | 'community' | 'create' | 'sell';
  size?: 'sm' | 'md' | 'lg';
  icon?: ReactNode;
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  href?: string;
}

const sizeClasses = {
  sm: 'px-4 py-2 text-sm rounded-lg',
  md: 'px-6 py-3 text-base rounded-xl',
  lg: 'px-8 py-4 text-lg rounded-xl',
};

const variantClasses = {
  primary:
    'bg-gradient-to-r from-brand-500 to-brand-400 text-white hover:from-brand-400 hover:to-brand-300 shadow-md shadow-brand-500/20',
  secondary:
    'bg-[var(--surface-elevated)] text-[var(--text-primary)] hover:bg-[var(--surface-overlay)] border border-[var(--border-default)]',
  outline:
    'bg-transparent text-[var(--text-secondary)] border border-[var(--border-default)] hover:border-[var(--brand-400)] hover:text-[var(--brand-400)]',
  ghost:
    'bg-transparent text-[var(--text-muted)] hover:bg-[var(--surface-elevated)] hover:text-[var(--text-secondary)]',
  /* Scene CTA variants — still use gradient, but softer */
  market:
    'bg-gradient-to-r from-amber-500/90 to-orange-500/90 text-white hover:from-amber-400 hover:to-orange-400 shadow-md shadow-amber-500/20',
  community:
    'bg-gradient-to-r from-cyan-500/90 to-blue-500/90 text-white hover:from-cyan-400 hover:to-blue-400 shadow-md shadow-cyan-500/20',
  create:
    'bg-gradient-to-r from-violet-500/90 to-purple-500/90 text-white hover:from-violet-400 hover:to-purple-400 shadow-md shadow-violet-500/20',
  sell:
    'bg-gradient-to-r from-indigo-500/90 to-pink-500/90 text-white hover:from-indigo-400 hover:to-pink-400 shadow-md shadow-indigo-500/20',
};

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
}: GradientBtnProps) {
  const baseClasses = `
    inline-flex items-center justify-center gap-2 font-semibold
    transition-all duration-300 cursor-pointer
    disabled:opacity-50 disabled:cursor-not-allowed
    active:scale-95
    ${sizeClasses[size]}
    ${variantClasses[variant]}
    ${className}
  `;

  if (href) {
    return (
      <a href={href} className={baseClasses}>
        {loading && (
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {!loading && icon}
        {children}
      </a>
    );
  }

  return (
    <button onClick={onClick} disabled={disabled || loading} className={baseClasses}>
      {loading && (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {!loading && icon}
      {children}
    </button>
  );
}
