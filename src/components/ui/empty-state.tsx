'use client';

import { ReactNode, useEffect, useState } from 'react';
import GradientBtn from './gradient-btn';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  actions?: ReactNode;
  className?: string;
}

export default function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  actions,
  className = '',
}: EmptyStateProps) {
  const [show, setShow] = useState(false);
  useEffect(() => { setShow(true); }, []);

  return (
    <div
      className={`flex flex-col items-center justify-center py-16 px-4 transition-opacity duration-500 ${show ? 'opacity-100' : 'opacity-0'} ${className}`}
    >
      {icon ? (
        <div className="mb-5 text-[var(--text-muted)]/40">{icon}</div>
      ) : (
        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--surface-elevated)] border border-[var(--border-subtle)]">
          <svg className="w-8 h-8 text-[var(--text-muted)]/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12l-3-3m0 0l-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
        </div>
      )}
      <h3 className="text-base font-semibold text-[var(--text-secondary)]">{title}</h3>
      {description && (
        <p className="mt-1.5 max-w-sm text-center text-sm text-[var(--text-muted)] leading-relaxed">
          {description}
        </p>
      )}
      {actions ? (
        <div className="mt-6">{actions}</div>
      ) : actionLabel && onAction ? (
        <div className="mt-6">
          <GradientBtn onClick={onAction} variant="primary" size="sm">
            {actionLabel}
          </GradientBtn>
        </div>
      ) : null}
    </div>
  );
}
