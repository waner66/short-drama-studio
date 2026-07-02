'use client';

export default function CharactersError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="text-center py-20">
      <div className="text-5xl mb-4">⚠</div>
      <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-2">角色页加载出错</h2>
      <p className="text-sm text-[var(--text-muted)] mb-4">{error.message}</p>
      <button onClick={reset} className="px-5 py-2 bg-brand-500 text-white rounded-lg font-medium">
        重试
      </button>
    </div>
  );
}
