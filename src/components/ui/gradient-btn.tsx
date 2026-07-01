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
    'bg-gradient-to-r from-purple-600 to-cyan-500 text-white hover:from-purple-500 hover:to-cyan-400 shadow-lg shadow-purple-500/25',
  secondary:
    'bg-white/10 text-white hover:bg-white/15 border border-white/10',
  outline:
    'bg-transparent text-purple-400 border border-purple-500/30 hover:bg-purple-500/10',
  ghost:
    'bg-transparent text-gray-300 hover:bg-white/5',
  market:
    'bg-gradient-to-r from-amber-500 to-rose-500 text-white hover:from-amber-400 hover:to-rose-400 shadow-lg shadow-amber-500/25',
  community:
    'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white hover:from-emerald-400 hover:to-cyan-400 shadow-lg shadow-emerald-500/25',
  create:
    'bg-gradient-to-r from-purple-600 to-violet-500 text-white hover:from-purple-500 hover:to-violet-400 shadow-lg shadow-purple-500/25',
  sell:
    'bg-gradient-to-r from-indigo-500 to-pink-500 text-white hover:from-indigo-400 hover:to-pink-400 shadow-lg shadow-indigo-500/25',
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
