'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import PageHeader from '@/components/ui/page-header';
import TemplateCard from '@/components/business/template-card';
import GradientBtn from '@/components/ui/gradient-btn';
import TagGroup from '@/components/ui/tag-group';
import Badge from '@/components/ui/badge';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

interface TemplateItem {
  id: string; title: string; description?: string; price: number;
  category?: string; avgRating: number; salesCount: number;
  tags: string[]; creator?: { username: string; avatarUrl?: string };
  coverUrl?: string; publishedAt?: string;
}

const categoryTags = [
  { key: 'all', label: '全部', color: 'gray' as const },
  { key: '甜宠恋爱', label: '甜宠恋爱', color: 'pink' as const },
  { key: '古装仙侠', label: '古装仙侠', color: 'purple' as const },
  { key: '悬疑推理', label: '悬疑推理', color: 'cyan' as const },
  { key: '校园青春', label: '校园青春', color: 'green' as const },
  { key: '逆袭爽文', label: '逆袭爽文', color: 'amber' as const },
  { key: '喜剧', label: '喜剧', color: 'green' as const },
  { key: '科幻', label: '科幻', color: 'purple' as const },
];

const sortOptions = [
  { key: 'hot', label: '🔥 热门推荐' },
  { key: 'new', label: '✨ 最新上架' },
  { key: 'top', label: '👑 好评排行' },
  { key: 'price_asc', label: '💰 价格从低' },
];

const WELCOME_TEMPLATE = {
  id: 'welcome',
  title: '🔥 新手入门 · 短剧创作指南',
  description: '欢迎来到短剧工坊！这是你的短剧创作之旅起点。精选模板助你快速上手。',
  category: '教程',
  price: 0,
  rating: 5.0,
  sales: 9999,
  tags: ['免费', '新手', '入门'],
  isHot: true,
  creator: { name: '短剧工坊官方' },
};

export default function MarketPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [sort, setSort] = useState('hot');
  const [templates, setTemplates] = useState<TemplateItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTemplates = async () => {
      setLoading(true);
      setError('');
      try {
        const params = new URLSearchParams();
        if (category !== 'all') params.set('category', category);
        params.set('sort', sort);
        if (search) params.set('search', search);
        params.set('limit', '20');

        const res = await fetch(`/api/templates?${params.toString()}`);
        if (!res.ok) throw new Error('加载失败');
        const data = await res.json();
        setTemplates(data.data || []);
      } catch (err: any) {
        setError(err.message || '加载模板失败');
      } finally {
        setLoading(false);
      }
    };
    fetchTemplates();
  }, [category, sort, search]);

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

      {/* Search + Filters */}
      <div className="mb-6 space-y-4">
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500"
            fill="none" viewBox="0 0 24 24" stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="搜索模板名称、标签..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/[0.03] pl-9 pr-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-500/30 transition-all"
          />
        </div>

        <div className="flex items-center justify-between flex-wrap gap-3">
          <TagGroup tags={categoryTags} selected={category} onSelect={setCategory} />
          <div className="flex items-center gap-1 bg-white/[0.02] rounded-xl p-1 border border-white/5">
            {sortOptions.map((opt) => (
              <button
                key={opt.key}
                onClick={() => setSort(opt.key)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all whitespace-nowrap ${
                  sort === opt.key
                    ? 'bg-amber-500/20 text-amber-400'
                    : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Template Grid or Loading */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Spin indicator={<LoadingOutlined style={{ fontSize: 32, color: '#ffb020' }} spin />} />
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
          <span className="text-sm text-red-400">{error}</span>
          <button onClick={() => window.location.reload()} className="mt-2 text-xs text-purple-400 hover:text-purple-300">重试</button>
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
                creator: { name: tmpl.creator?.username || '未知' },
              }}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
          <svg className="h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <span className="text-sm">没有找到匹配的模板</span>
          <button onClick={() => { setSearch(''); setCategory('all'); }} className="mt-2 text-xs text-amber-400 hover:text-amber-300">
            清除筛选条件
          </button>
        </div>
      )}
    </div>
  );
}
