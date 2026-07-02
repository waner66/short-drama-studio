'use client';

import { useEffect } from 'react';

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Dashboard error:', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-4">⚠</div>
        <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-2">页面加载出错</h2>
        <p className="text-sm text-[var(--text-secondary)] mb-6">
          {error.message || '发生了意外错误，请稍后重试'}
        </p>
        <button
          onClick={reset}
          className="px-6 py-2.5 bg-brand-500 text-white rounded-xl font-medium hover:bg-brand-600 transition-colors"
        >
          重新加载
        </button>
      </div>
    </div>
  );
}
