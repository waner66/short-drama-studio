'use client';

import { ReactNode } from 'react';
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
  return (
    <div className={`flex flex-col items-center justify-center py-16 ${className}`}>
      {icon ? (
        <div className="mb-6 text-gray-600">{icon}</div>
      ) : (
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-white/[0.03] border border-white/[0.06]">
          <svg className="h-10 w-10 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        </div>
      )}
      <h3 className="text-lg font-semibold text-gray-300">{title}</h3>
      {description && (
        <p className="mt-2 max-w-md text-center text-sm text-gray-500">{description}</p>
      )}
      {actions && (
        <div className="mt-6">{actions}</div>
      )}
      {!actions && actionLabel && onAction && (
        <div className="mt-6">
          <GradientBtn onClick={onAction}>{actionLabel}</GradientBtn>
        </div>
      )}
    </div>
  );
}
