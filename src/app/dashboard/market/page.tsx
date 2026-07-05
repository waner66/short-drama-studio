'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import './market-page.css';
import PageHeader from '@/components/ui/page-header';
import GradientBtn from '@/components/ui/gradient-btn';
import MarketTabs, { type TabKey } from '@/components/business/market-tabs';
import TemplateCardV2, { type TemplateCardV2Data } from '@/components/business/template-card-v2';
import TemplateDetailDrawer from '@/components/business/template-detail-drawer';
import CharacterCard from '@/components/business/character-card';
import CharacterDetailDrawer from '@/components/business/character-detail-drawer';
import { officialTemplates, type OfficialTemplate } from '@/lib/data/character-templates';
import { sceneTemplates, type SceneTemplate } from '@/lib/data/scene-templates';
import { plotTemplates, type PlotTemplate } from '@/lib/data/plot-templates';

// 从 API 动态加载角色模板（替代静态数据）
async function fetchCharacterTemplates(): Promise<OfficialTemplate[]> {
  try {
    const res = await fetch('/api/character-templates?published=true');
    if (res.ok) return await res.json();
  } catch { /* 回退静态数据 */ }
  return officialTemplates;
}

/* ================================================
   数据转换：将三种模板转为统一的 TemplateCardV2Data
   ================================================ */

function characterToCard(tpl: OfficialTemplate): TemplateCardV2Data {
  return {
    id: tpl.id,
    name: tpl.name,
    description: tpl.description,
    tags: tpl.tags,
    price: tpl.price,
    coverEmoji: getCharacterEmoji(tpl.genre),
    coverGradient: tpl.coverColor.includes('gradient')
      ? tpl.coverColor
      : `linear-gradient(135deg, ${tpl.coverColor} 0%, ${adjustColor(tpl.coverColor, 30)} 100%)`,
    genre: tpl.genre,
    atmosphere: undefined,
    era: undefined,
  };
}

function sceneToCard(tpl: SceneTemplate): TemplateCardV2Data {
  return {
    id: tpl.id,
    name: tpl.name,
    description: tpl.description,
    tags: tpl.tags,
    price: 0, // 场景模板暂定免费
    coverEmoji: tpl.coverEmoji,
    coverGradient: tpl.coverGradient,
    era: tpl.era,
    atmosphere: tpl.atmosphere,
    genre: undefined,
  };
}

function plotToCard(tpl: PlotTemplate): TemplateCardV2Data {
  return {
    id: tpl.id,
    name: tpl.name,
    description: tpl.description,
    tags: tpl.tags,
    price: 0, // 剧情模板暂定免费
    coverEmoji: tpl.coverEmoji,
    coverGradient: tpl.coverGradient,
    genre: tpl.genre,
    atmosphere: undefined,
    era: undefined,
  };
}

function getCharacterEmoji(genre: string): string {
  const map: Record<string, string> = {
    '甜宠恋爱': '💕', '悬疑推理': '🔍', '古装仙侠': '🏯',
    '校园青春': '🎓', '逆袭爽文': '🔥',
  };
  return map[genre] || '🎭';
}

function adjustColor(hex: string, amount: number): string {
  // 简单的颜色调整函数，支持 hex 字符串的简单偏移
  try {
    const num = parseInt(hex.replace('#', ''), 16);
    const r = Math.min(255, Math.max(0, ((num >> 16) & 0xff) + amount));
    const g = Math.min(255, Math.max(0, ((num >> 8) & 0xff) + amount));
    const b = Math.min(255, Math.max(0, (num & 0xff) + amount));
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
  } catch {
    return hex;
  }
}

/* ================================================
   分类筛选配置（根据 Tab 动态变化）
   ================================================ */

const characterCategories = [
  { key: 'all', label: '全部', color: 'gray' as const },
  { key: '甜宠恋爱', label: '💕 甜宠', color: 'pink' as const },
  { key: '悬疑推理', label: '🔍 悬疑', color: 'cyan' as const },
  { key: '古装仙侠', label: '🏯 古装', color: 'purple' as const },
  { key: '校园青春', label: '🎓 校园', color: 'green' as const },
  { key: '逆袭爽文', label: '🔥 逆袭', color: 'amber' as const },
];

const sceneCategories = [
  { key: 'all', label: '全部', color: 'gray' as const },
  { key: '浪漫', label: '💕 浪漫', color: 'pink' as const },
  { key: '紧张', label: '⚡ 紧张', color: 'red' as const },
  { key: '悲伤', label: '💧 悲伤', color: 'blue' as const },
  { key: '欢乐', label: '🎉 欢乐', color: 'yellow' as const },
  { key: '神秘', label: '🌙 神秘', color: 'purple' as const },
  { key: '震撼', label: '🔥 震撼', color: 'orange' as const },
];

const plotCategories = [
  { key: 'all', label: '全部', color: 'gray' as const },
  { key: '甜宠恋爱', label: '💕 甜宠', color: 'pink' as const },
  { key: '古装仙侠', label: '🏯 古装', color: 'purple' as const },
  { key: '悬疑推理', label: '🔍 悬疑', color: 'cyan' as const },
  { key: '校园青春', label: '🎓 校园', color: 'green' as const },
  { key: '逆袭爽文', label: '🔥 逆袭', color: 'amber' as const },
  { key: '都市现实', label: '🌆 都市', color: 'blue' as const },
  { key: '科幻未来', label: '🚀 科幻', color: 'indigo' as const },
];

const sortOptions = [
  { key: 'default', label: '默认排序' },
  { key: 'name', label: '名称 A-Z' },
  { key: 'price', label: '价格从低' },
];

/* ================================================
   主页面组件
   ================================================ */

export default function MarketPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // ==== 状态 ====
  const tabFromUrl = (searchParams?.get('tab') || 'character') as TabKey;
  const [activeTab, setActiveTab] = useState<TabKey>(tabFromUrl);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [sort, setSort] = useState('default');
  const [loading, setLoading] = useState(true);
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [characterTemplates, setCharacterTemplates] = useState<OfficialTemplate[]>(officialTemplates);

  // 从 API 加载角色模板（回退静态数据）
  useEffect(() => {
    fetchCharacterTemplates().then(data => setCharacterTemplates(data));
  }, []);

  // 抽屉状态
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerData, setDrawerData] = useState<TemplateCardV2Data | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [toast, setToast] = useState<string | null>(null);

  // 角色专属抽屉状态
  const [characterDrawerOpen, setCharacterDrawerOpen] = useState(false);
  const [characterDrawerData, setCharacterDrawerData] = useState<OfficialTemplate | null>(null);

  // 模拟加载骨架屏
  useEffect(() => {
    const t = setTimeout(() => {
      setLoading(false);
      setTimeout(() => setShowSkeleton(false), 300);
    }, 600);
    return () => clearTimeout(t);
  }, [activeTab]);

  // Tab切换时重置筛选
  useEffect(() => {
    setCategory('all');
    setSearch('');
    setSort('default');
    setLoading(true);
    setShowSkeleton(true);
    setDrawerOpen(false);
    setCharacterDrawerOpen(false);
    const t = setTimeout(() => {
      setLoading(false);
      setTimeout(() => setShowSkeleton(false), 300);
    }, 400);
    return () => clearTimeout(t);
  }, [activeTab]);

  // ==== 数据源 ====
  const allData = useMemo(() => {
    switch (activeTab) {
      case 'character':
        return characterTemplates.map(characterToCard);
      case 'scene':
        return sceneTemplates.map(sceneToCard);
      case 'plot':
        return plotTemplates.map(plotToCard);
    }
  }, [activeTab]);

  // ==== 筛选逻辑 ====
  const currentCategories = useMemo(() => {
    switch (activeTab) {
      case 'character': return characterCategories;
      case 'scene': return sceneCategories;
      case 'plot': return plotCategories;
    }
  }, [activeTab]);

  const filteredData = useMemo(() => {
    let result = [...allData];

    // 搜索过滤
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(d =>
        d.name.toLowerCase().includes(q) ||
        d.description.toLowerCase().includes(q) ||
        d.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    // 分类过滤
    if (category !== 'all') {
      if (activeTab === 'scene') {
        result = result.filter(d => d.atmosphere === category);
      } else {
        result = result.filter(d => d.genre === category);
      }
    }

    // 排序
    if (sort === 'name') {
      result.sort((a, b) => a.name.localeCompare(b.name, 'zh'));
    } else if (sort === 'price') {
      result.sort((a, b) => a.price - b.price);
    }

    return result;
  }, [allData, search, category, sort, activeTab]);

  // 角色Tab专用筛选（直接使用 OfficialTemplate，保留大五人格等富数据）
  const filteredCharacterData = useMemo(() => {
    let result = [...characterTemplates];
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(d =>
        d.name.toLowerCase().includes(q) ||
        d.description.toLowerCase().includes(q) ||
        d.tags.some(t => t.toLowerCase().includes(q))
      );
    }
    if (category !== 'all') {
      result = result.filter(d => d.genre === category);
    }
    if (sort === 'name') {
      result.sort((a, b) => a.name.localeCompare(b.name, 'zh'));
    } else if (sort === 'price') {
      result.sort((a, b) => a.price - b.price);
    }
    return result;
  }, [search, category, sort]);

  // ==== 事件处理 ====
  const handleTabChange = useCallback((tab: TabKey) => {
    setActiveTab(tab);
    const params = new URLSearchParams(searchParams?.toString() || '');
    params.set('tab', tab);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }, [router, pathname, searchParams]);

  const handleCardClick = useCallback((data: TemplateCardV2Data) => {
    setDrawerData(data);
    setDrawerOpen(true);
  }, []);

  const handleUseTemplate = useCallback((data: TemplateCardV2Data) => {
    const routes: Record<string, string> = {
      character: '/dashboard/characters/new',
      scene: '/dashboard/scenes/new',
      plot: '/dashboard/projects/new',
    };
    const route = routes[activeTab] || '/dashboard';
    router.push(`${route}?template=${data.id}`);
  }, [activeTab, router]);

  const handleFavorite = useCallback((id: string) => {
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        setToast('已取消收藏');
      } else {
        next.add(id);
        setToast('已添加收藏');
      }
      return next;
    });
    setTimeout(() => setToast(null), 2000);
  }, []);

  const handleCharacterCardClick = useCallback((data: OfficialTemplate) => {
    setCharacterDrawerData(data);
    setCharacterDrawerOpen(true);
  }, []);

  const handleCharacterUse = useCallback((data: OfficialTemplate) => {
    router.push(`/dashboard/characters/new?template=${data.id}`);
  }, [router]);

  // ==== 渲染骨架屏 ====
  const renderSkeleton = () => (
    <div className="skeleton-grid">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="skeleton-card">
          <div className="skeleton-cover shimmer" />
          <div className="skeleton-info">
            <div className="skeleton-line shimmer" style={{ width: '70%', height: 16 }} />
            <div className="skeleton-line shimmer" style={{ width: '90%', height: 12, marginTop: 8 }} />
            <div className="skeleton-tags">
              <div className="skeleton-tag shimmer" />
              <div className="skeleton-tag shimmer" />
              <div className="skeleton-tag shimmer" style={{ width: 40 }} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  // ==== 渲染空状态 ====
  const renderEmpty = () => (
    <div className="empty-state">
      <div className="empty-icon">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <h3 className="empty-title">没有找到匹配的模板</h3>
      <p className="empty-desc">试试调整搜索关键词或筛选条件</p>
      <div className="empty-suggestions">
        <span className="empty-suggest-label">试试这些：</span>
        {currentCategories.slice(1, 5).map(cat => (
          <button
            key={cat.key}
            className="empty-suggest-tag"
            onClick={() => { setCategory(cat.key); setSearch(''); }}
          >
            {cat.label.replace(/^.{2}/, '')}
          </button>
        ))}
      </div>
      <button
        className="empty-reset-btn"
        onClick={() => { setSearch(''); setCategory('all'); setSort('default'); }}
      >
        清除所有筛选
      </button>
    </div>
  );

  return (
    <div>
      {/* ===== 页面标题 ===== */}
      <PageHeader
        title="创造，属于你的世界"
        subtitle="浏览优质短剧模板，快速启动创作"
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: '模板市场' }]}
        actions={
          <Link href="/dashboard/templates">
            <GradientBtn variant="sell">上架模板</GradientBtn>
          </Link>
        }
      />

      {/* ===== Tab 切换 ===== */}
      <MarketTabs activeTab={activeTab} onTabChange={handleTabChange} />

      {/* ===== 搜索栏 ===== */}
      <div className="market-search-wrapper">
        <svg className="market-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="搜索模板名称、描述、标签..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="market-search-input"
        />
        {search && (
          <button className="market-search-clear" onClick={() => setSearch('')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* ===== 分类筛选 + 排序 ===== */}
      <div className="market-filters">
        <div className="market-categories">
          {currentCategories.map(cat => (
            <button
              key={cat.key}
              onClick={() => setCategory(cat.key)}
              className={`market-cat-btn ${category === cat.key ? 'active' : ''} cat-${cat.color}`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="market-sort-group">
          {sortOptions.map(opt => (
            <button
              key={opt.key}
              onClick={() => setSort(opt.key)}
              className={`market-sort-btn ${sort === opt.key ? 'active' : ''}`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* ===== 结果计数 ===== */}
      <div className="market-result-count">
        共 <strong>{activeTab === 'character' ? filteredCharacterData.length : filteredData.length}</strong> 个模板
        {category !== 'all' && (
          <span className="market-filter-badge">
            {currentCategories.find(c => c.key === category)?.label}
            <button onClick={() => setCategory('all')} className="market-filter-remove">×</button>
          </span>
        )}
      </div>

      {/* ===== 模板网格 ===== */}
      {showSkeleton ? (
        renderSkeleton()
      ) : activeTab === 'character' ? (
        /* --- 人物Tab：使用角色专属卡片 --- */
        filteredCharacterData.length > 0 ? (
          <div className="market-grid">
            {filteredCharacterData.map(data => (
              <CharacterCard
                key={data.id}
                data={data}
                onClick={handleCharacterCardClick}
                onUse={handleCharacterUse}
                onFavorite={handleFavorite}
                isFavorited={favorites.has(data.id)}
              />
            ))}
          </div>
        ) : (
          renderEmpty()
        )
      ) : (
        /* --- 场景/剧情Tab：使用通用模板卡片 --- */
        filteredData.length > 0 ? (
          <div className="market-grid">
            {filteredData.map(data => (
              <TemplateCardV2
                key={data.id}
                data={data}
                type={activeTab}
                onClick={handleCardClick}
                onUse={handleUseTemplate}
                onFavorite={handleFavorite}
                isFavorited={favorites.has(data.id)}
              />
            ))}
          </div>
        ) : (
          renderEmpty()
        )
      )}

      {/* ===== 详情抽屉 ===== */}
      {activeTab === 'character' ? (
        <CharacterDetailDrawer
          open={characterDrawerOpen}
          data={characterDrawerData}
          onClose={() => setCharacterDrawerOpen(false)}
          onUse={handleCharacterUse}
          onFavorite={handleFavorite}
          isFavorited={characterDrawerData ? favorites.has(characterDrawerData.id) : false}
        />
      ) : (
        <TemplateDetailDrawer
          open={drawerOpen}
          data={drawerData}
          type={activeTab}
          onClose={() => setDrawerOpen(false)}
          onUse={handleUseTemplate}
          onFavorite={handleFavorite}
          isFavorited={drawerData ? favorites.has(drawerData.id) : false}
        />
      )}

      {/* ===== Toast 提示 ===== */}
      {toast && (
        <div className="market-toast">{toast}</div>
      )}
    </div>
  );
}
