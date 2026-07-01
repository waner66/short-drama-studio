'use client';

import { useState } from 'react';
import PageHeader from '@/components/ui/page-header';
import TemplateCard from '@/components/business/template-card';
import GradientBtn from '@/components/ui/gradient-btn';
import TagGroup from '@/components/ui/tag-group';

const allTemplates = [
  {
    id: '1',
    title: '霸道总裁爱上我 · 短剧模板',
    description: '经典的现代都市甜宠短剧模板，包含完整的角色设定、3幕剧本结构和分镜脚本。适合新手快速上手。',
    category: '甜宠恋爱',
    price: 29.9,
    rating: 4.8,
    sales: 1234,
    tags: ['热门', '新手推荐', '三幕式'],
    isHot: true,
    creator: { name: '短剧达人王' },
  },
  {
    id: '2',
    title: '穿越古代当首富 · 完整模板',
    description: '穿越+经商双线并行，5幕结构，包含3个主要角色设定和完整分镜脚本。',
    category: '古装仙侠',
    price: 49.9,
    rating: 4.6,
    sales: 856,
    tags: ['古装', '逆袭', '五幕式'],
    isNew: true,
    creator: { name: '古风剧作家' },
  },
  {
    id: '3',
    title: '悬疑反转 · 8分钟短剧模板',
    description: '紧凑的反转剧情短剧模板，层层递进，适合制作悬疑推理类短剧。',
    category: '悬疑推理',
    price: 39.9,
    rating: 4.9,
    sales: 671,
    tags: ['悬疑', '反转', '精品'],
    creator: { name: '悬疑编剧李' },
  },
  {
    id: '4',
    title: '校园甜心 · 青春短剧模板',
    description: '清新甜美的校园青春短剧模板，3幕经典邂逅故事结构。',
    category: '校园青春',
    price: 19.9,
    rating: 4.5,
    sales: 2103,
    tags: ['校园', '甜宠', '新手推荐'],
    creator: { name: '青春制片人' },
  },
  {
    id: '5',
    title: '都市逆袭记 · 男频爽文模板',
    description: '男频爽文风格短剧模板，主角从底层逆袭到巅峰，节奏紧凑。',
    category: '逆袭爽文',
    price: 34.9,
    rating: 4.7,
    sales: 542,
    tags: ['爽文', '男频', '快节奏'],
    isHot: true,
    creator: { name: '爽文制造机' },
  },
  {
    id: '6',
    title: '古风虐恋 · 仙侠短剧模板',
    description: '仙侠虐恋风格，包含完整的仙界世界观设定和4个核心角色。',
    category: '古装仙侠',
    price: 45.9,
    rating: 4.4,
    sales: 389,
    tags: ['仙侠', '虐恋', '世界观'],
    creator: { name: '仙侠首席编剧' },
  },
  {
    id: '7',
    title: '爆笑穿越 · 喜剧短剧模板',
    description: '轻松搞笑的穿越喜剧模板，适合制作轻松向短剧内容。',
    category: '喜剧',
    price: 24.9,
    rating: 4.3,
    sales: 892,
    tags: ['喜剧', '穿越', '搞笑'],
    isNew: true,
    creator: { name: '笑匠工作室' },
  },
  {
    id: '8',
    title: '赛博朋克 · 科幻短剧模板',
    description: '未来都市科幻风，包含完整的世界观设定和视觉风格指南。',
    category: '科幻',
    price: 59.9,
    rating: 4.2,
    sales: 203,
    tags: ['科幻', '赛博', '未来'],
    creator: { name: '数字艺术家' },
  },
];

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
  { key: 'top', label: '👑 销量排行' },
  { key: 'price', label: '💰 价格' },
];

export default function MarketPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [sort, setSort] = useState('hot');

  const filtered = allTemplates
    .filter((t) => {
      if (category !== 'all' && t.category !== category) return false;
      if (search && !t.title.toLowerCase().includes(search.toLowerCase()) && !t.tags.some((tag) => tag.toLowerCase().includes(search.toLowerCase()))) return false;
      return true;
    })
    .sort((a, b) => {
      if (sort === 'hot') return (Number(b.isHot) - Number(a.isHot)) || b.sales - a.sales;
      if (sort === 'new') return (Number(b.isNew) - Number(a.isNew)) || b.sales - a.sales;
      if (sort === 'top') return b.sales - a.sales;
      if (sort === 'price') return a.price - b.price;
      return 0;
    });

  return (
    <div>
      <PageHeader
        title="模板市场"
        subtitle="浏览优质短剧模板，或上架自己的模板赚取收益"
        breadcrumbs={[{ label: '工作台', href: '/dashboard' }, { label: '模板市场' }]}
        actions={
          <GradientBtn variant="outline">上架模板</GradientBtn>
        }
      />

      {/* Search + Filters */}
      <div className="mb-6 space-y-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="搜索模板名称、标签..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/[0.03] pl-9 pr-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-all"
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <TagGroup
            tags={categoryTags}
            selected={category}
            onSelect={setCategory}
          />

          <div className="flex items-center gap-1 bg-white/[0.02] rounded-xl p-1 border border-white/5">
            {sortOptions.map((opt) => (
              <button
                key={opt.key}
                onClick={() => setSort(opt.key)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                  sort === opt.key
                    ? 'bg-purple-500/20 text-purple-400'
                    : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Template Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((tmpl) => (
            <TemplateCard key={tmpl.id} template={tmpl} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
          <svg className="h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <span className="text-sm">没有找到匹配的模板</span>
          <button onClick={() => { setSearch(''); setCategory('all'); }} className="mt-2 text-xs text-purple-400 hover:text-purple-300">
            清除筛选条件
          </button>
        </div>
      )}
    </div>
  );
}
