'use client';

interface SkeletonProps {
  className?: string;
}

function SkeletonBlock({ className = '' }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-[var(--surface-elevated)] ${className}`}
    />
  );
}

interface CardSkeletonProps {
  className?: string;
}

export function CardSkeleton({ className = '' }: CardSkeletonProps) {
  return (
    <div className={`rounded-2xl border border-white/10 bg-[var(--surface-elevated)] p-6 ${className}`}>
      <SkeletonBlock className="h-4 w-2/3 mb-4" />
      <SkeletonBlock className="h-8 w-1/2 mb-3" />
      <SkeletonBlock className="h-3 w-full mb-2" />
      <SkeletonBlock className="h-3 w-4/5" />
    </div>
  );
}

interface GridSkeletonProps {
  count?: number;
  columns?: number;
  className?: string;
}

export function GridSkeleton({ count = 6, columns = 3, className = '' }: GridSkeletonProps) {
  return (
    <div
      className={`grid gap-4 ${className}`}
      style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
    >
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

interface TableSkeletonProps {
  rows?: number;
  cols?: number;
  className?: string;
}

export function TableSkeleton({ rows = 5, cols = 4, className = '' }: TableSkeletonProps) {
  return (
    <div className={`rounded-2xl border border-white/10 bg-[var(--surface-elevated)] p-4 ${className}`}>
      <div className="flex gap-4 mb-4 pb-4 border-b border-white/5">
        {Array.from({ length: cols }).map((_, i) => (
          <SkeletonBlock key={i} className="h-4 flex-1" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex gap-4 py-3 border-b border-white/[0.02] last:border-0">
          {Array.from({ length: cols }).map((_, c) => (
            <SkeletonBlock key={c} className="h-4 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}

export default SkeletonBlock;
