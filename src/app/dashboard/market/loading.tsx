import './market-page.css';

export default function MarketLoading() {
  return (
    <div>
      {/* 页面标题骨架 */}
      <div className="h-20 mb-6 rounded-2xl shimmer" style={{ background: 'rgba(255,255,255,0.03)' }} />

      {/* Tab 骨架 */}
      <div className="h-16 w-96 mb-6 rounded-2xl bg-[rgba(255,255,255,0.03)] shimmer" />

      {/* 搜索栏骨架 */}
      <div className="h-14 mb-6 rounded-2xl bg-[rgba(255,255,255,0.03)] shimmer" />

      {/* 筛选栏骨架 */}
      <div className="flex gap-3 mb-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-10 w-24 rounded-xl bg-[rgba(255,255,255,0.03)] shimmer" />
        ))}
      </div>

      {/* 卡片网格骨架 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-2xl overflow-hidden bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.05)]">
            <div className="h-48 bg-[rgba(255,255,255,0.03)] shimmer" />
            <div className="p-5 space-y-3">
              <div className="h-4 w-3/4 rounded bg-[rgba(255,255,255,0.06)] shimmer" />
              <div className="h-3 w-full rounded bg-[rgba(255,255,255,0.04)] shimmer" />
              <div className="h-3 w-2/3 rounded bg-[rgba(255,255,255,0.04)] shimmer" />
              <div className="flex gap-2">
                <div className="h-6 w-16 rounded shimmer" />
                <div className="h-6 w-16 rounded shimmer" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
