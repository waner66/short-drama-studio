'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import PageHeader from '@/components/ui/page-header';
import TemplateCard from '@/components/business/template-card';
import GradientBtn from '@/components/ui/gradient-btn';
import TagGroup from '@/components/ui/tag-group';
import { Spin } from 'antd';
import { LoadingOutlined, FireOutlined, ShopOutlined } from '@ant-design/icons';

interface TemplateItem {
  id: string; title: string; description?: string; price: number;
  category?: string; avgRating: number; salesCount: number;
  tags: string[]; creator?: { id?: string; username?: string; avatarUrl?: string; name?: string };
  coverUrl?: string; publishedAt?: string;
}

const categoryTags = [
  { key: 'all', label: '全部', color: 'gray' as const },
  { key: '甜宠恋爱', label: '甜宠', color: 'pink' as const },
  { key: '古装仙侠', label: '古装', color: 'purple' as const },
  { key: '悬疑推理', label: '悬疑', color: 'cyan' as const },
  { key: '校园青春', label: '校园', color: 'green' as const },
  { key: '逆袭爽文', label: '逆袭', color: 'amber' as const },
  { key: '喜剧', label: '喜剧', color: 'green' as const },
  { key: '科幻', label: '科幻', color: 'purple' as const },
];

const sortOptions = [
  { key: 'hot', label: '热门推荐' },
  { key: 'new', label: '最新上架' },
  { key: 'top', label: '好评排行' },
  { key: 'price_asc', label: '价格从低' },
];

export default function MarketPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [sort, setSort] = useState('hot');
  const [templates, setTemplates] = useState<TemplateItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const searchTimer = useRef<ReturnType<typeof setTimeout>>();

  const fetchData = (cat: string, srt: string, q: string) => {
    setLoading(true);
    setError('');
    const params = new URLSearchParams();
    if (cat !== 'all') params.set('category', cat);
    params.set('sort', srt);
    if (q) params.set('search', q);
    params.set('limit', '20');

    fetch(`/api/templates?${params.toString()}`)
      .then(r => { if (!r.ok) throw new Error('加载失败'); return r.json(); })
      .then(d => setTemplates(d.data || []))
      .catch(e => setError(e.message || '加载模板失败'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(category, sort, search); }, [category, sort]);

  const handleSearch = (val: string) => {
    setSearch(val);
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => fetchData(category, sort, val), 400);
  };

  return (
    <div>
      <PageHeader
        title="模板市场"
        subtitle="浏览优质短剧模板，或上架自己的模板赚取收益"
        breadcrumbs={[{ label: '发现首页', href: '/dashboard' }, { label: '模板市场' }]}
        actions={
          <Link href="/dashboard/templates">
            <GradientBtn variant="sell">上架模板</GradientBtn>
          </Link>
        }
      />

      {/* ===== Featured Banner ===== */}
      {!loading && templates.length > 0 && (
        <div className="relative overflow-hidden rounded-2xl border border-[var(--border-subtle)] mb-6"
          style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.08), rgba(249,115,22,0.05), rgba(139,92,246,0.04)), var(--surface-card)' }}>
          <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-amber-400/5 blur-3xl" />
          <div className="relative px-6 py-8">
            <div className="flex items-center gap-2 text-amber-400 text-sm font-medium mb-2">
              <FireOutlined /> 本周精选
            </div>
            <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">爆款模板精选</h2>
            <p className="text-[var(--text-secondary)] text-sm mb-5 max-w-md">
              社区评分最高、销量最好的短剧模板，助你快速打造下一部爆款
            </p>
            {/* Featured template cards — horizontal scroll */}
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-none">
              {templates.slice(0, 5).map((tpl) => (
                <Link key={tpl.id} href={`/dashboard/market/${tpl.id}`} className="flex-shrink-0 no-underline">
                  <div className="w-44 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border-subtle)] overflow-hidden hover:border-amber-500/30 transition-colors">
                    <div className="h-24 bg-gradient-to-br from-amber-500/20 to-orange-400/10 flex items-center justify-center">
                      <ShopOutlined className="text-amber-400/30 text-xl" />
                    </div>
                    <div className="p-3">
                      <p className="text-[var(--text-primary)] text-xs font-semibold truncate">{tpl.title}</p>
                      <div className="flex items-center justify-between mt-1.5">
                        <span className="text-[10px] text-[var(--text-muted)]">{tpl.salesCount || 0} 购买</span>
                        <span className="text-xs font-bold text-amber-400">¥{typeof tpl.price === 'number' ? tpl.price.toFixed(1) : tpl.price}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ===== Search + Filters ===== */}
      <div className="mb-6 space-y-4">
        {/* Search bar — prominent */}
        <div className="relative">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--text-muted)]"
            fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="搜索模板名称、标签、创作者..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full rounded-xl bg-[var(--surface-elevated)] border border-[var(--border-default)] pl-11 pr-4 py-3.5 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500/50 transition-all"
          />
        </div>

        <div className="flex items-center justify-between flex-wrap gap-3">
          <TagGroup tags={categoryTags} selected={category} onSelect={setCategory} />
          <div className="flex items-center gap-1 bg-[var(--surface-elevated)] rounded-xl p-1 border border-[var(--border-subtle)]">
            {sortOptions.map((opt) => (
              <button
                key={opt.key}
                onClick={() => setSort(opt.key)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all whitespace-nowrap ${
                  sort === opt.key
                    ? 'bg-amber-500/15 text-amber-400 shadow-sm'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ===== Template Grid ===== */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Spin indicator={<LoadingOutlined style={{ fontSize: 32, color: '#f59e0b' }} spin />} />
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-sm text-red-400 mb-2">{error}</p>
          <button onClick={() => fetchData(category, sort, search)} className="text-xs text-[var(--brand-400)] hover:text-[var(--brand-300)]">
            重试
          </button>
        </div>
      ) : templates.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {templates.map((tmpl) => (
            <TemplateCard
              key={tmpl.id}
              template={{
                id: tmpl.id,
                title: tmpl.title,
                description: tmpl.description || '',
                category: tmpl.category || '其他',
                price: Number(tmpl.price),
                rating: tmpl.avgRating || 0,
                sales: tmpl.salesCount || 0,
                tags: tmpl.tags || [],
                creator: { name: tmpl.creator?.name || tmpl.creator?.username || '未知' },
                coverUrl: tmpl.coverUrl,
              }}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-[var(--text-muted)]">
          <svg className="h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <span className="text-sm">没有找到匹配的模板</span>
          <button onClick={() => { setSearch(''); setCategory('all'); }}
            className="mt-2 text-xs text-amber-400 hover:text-amber-300">
            清除筛选条件
          </button>
        </div>
      )}
    </div>
  );
}
