'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { Typography, Tag } from 'antd';
import {
  ShopOutlined,
  FireOutlined,
  PlayCircleOutlined,
  TeamOutlined,
  FileTextOutlined,
  ArrowRightOutlined,
  StarFilled,
  UserOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
  RocketOutlined,
  CrownOutlined,
} from '@ant-design/icons';
import GlassCard from '@/components/ui/glass-card';
import Badge from '@/components/ui/badge';
import GradientBtn from '@/components/ui/gradient-btn';
import { CardSkeleton } from '@/components/ui/loading-skeleton';

const { Title, Text } = Typography;

interface TemplateItem {
  id: string;
  title: string;
  description?: string;
  price: number;
  salesCount: number;
  avgRating: number;
  category?: string;
  tags?: string[];
  creator?: { username: string };
}

interface CommunityItem {
  id: string;
  type: string;
  title: string;
  user: string;
  userId?: string;
  time: string;
  description?: string;
  tags?: string[];
  price?: number;
  rating?: number;
  templateId?: string;
  templateTitle?: string;
}

interface CreatorItem {
  id: string;
  name: string;
  avatar?: string;
  bio?: string;
  works?: number;
  followers?: number;
  rating?: number;
  totalSales?: number;
}

/* ---- Relative time formatter ---- */
function timeAgo(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return '刚刚';
  if (mins < 60) return `${mins} 分钟前`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} 小时前`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} 天前`;
  const months = Math.floor(days / 30);
  return `${months} 月前`;
}

/* ---- Animated Counter Hook ---- */
function useCountUp(end: number, duration = 800) {
  const [count, setCount] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    if (end === 0) { setCount(0); return; }
    const step = Math.ceil(end / (duration / 16));
    let current = 0;
    const timer = setInterval(() => {
      current += step;
      if (current >= end) { setCount(end); clearInterval(timer); }
      else setCount(current);
    }, 16);
    return () => clearInterval(timer);
  }, [end, duration]);

  return count;
}

/* ---- Category → gradient mapping ---- */
function categoryGradient(cat?: string): string {
  const map: Record<string, string> = {
    '甜宠': 'from-pink-500/30 to-rose-400/20',
    '恋爱': 'from-red-500/30 to-pink-400/20',
    '古装': 'from-amber-500/30 to-yellow-400/20',
    '悬疑': 'from-slate-500/30 to-blue-400/20',
    '逆袭': 'from-orange-500/30 to-red-400/20',
    '都市': 'from-cyan-500/30 to-blue-400/20',
    '奇幻': 'from-purple-500/30 to-violet-400/20',
  };
  return map[cat || ''] || 'from-violet-500/30 to-cyan-400/20';
}

const CATEGORY_ORDER = ['甜宠', '恋爱', '古装', '悬疑', '逆袭', '都市', '奇幻'];

export default function DashboardPage() {
  const [hotTemplates, setHotTemplates] = useState<TemplateItem[]>([]);
  const [communityItems, setCommunityItems] = useState<CommunityItem[]>([]);
  const [topCreators, setTopCreators] = useState<CreatorItem[]>([]);
  const [stats, setStats] = useState({ templates: 0, creators: 0, revenue: 0 });
  const [loadingData, setLoadingData] = useState(true);

  const animatedTemplates = useCountUp(stats.templates, 600);
  const animatedCreators = useCountUp(stats.creators, 600);
  const animatedRevenue = useCountUp(stats.revenue, 600);

  useEffect(() => {
    async function loadData() {
      const results = await Promise.allSettled([
        fetch('/api/templates?sort=hot&limit=6').then(r => r.ok ? r.json() : { data: [] }),
        fetch('/api/community/feed?limit=5').then(r => r.ok ? r.json() : { data: [] }),
        fetch('/api/dashboard/stats').then(r => r.ok ? r.json() : { templates: 0, creators: 0, revenue: 0 }),
        fetch('/api/community/creators?limit=5').then(r => r.ok ? r.json() : { data: [] }),
      ]);

      const tmpl = results[0].status === 'fulfilled' ? results[0].value : { data: [] };
      const comm = results[1].status === 'fulfilled' ? results[1].value : { data: [] };
      const st = results[2].status === 'fulfilled' ? results[2].value : { templates: 0, creators: 0, revenue: 0 };
      const creators = results[3].status === 'fulfilled' ? results[3].value : { data: [] };

      setHotTemplates(tmpl.data || []);
      setCommunityItems(comm.data || []);
      setTopCreators(creators.data || []);
      setStats({
        templates: st.templates || 0,
        creators: st.creators || 0,
        revenue: st.revenue || 0,
      });
      setLoadingData(false);
    }
    loadData();
  }, []);

  const quickStart = [
    { icon: <TeamOutlined />, title: '创建角色', desc: '构建你的短剧角色库', link: '/dashboard/characters/new', color: 'from-violet-500 to-purple-600' },
    { icon: <FileTextOutlined />, title: '编写剧本', desc: 'AI 辅助生成高质量剧本', link: '/dashboard/scripts', color: 'from-cyan-500 to-blue-600' },
    { icon: <ShopOutlined />, title: '上架模板', desc: '分享创意，赚取收益', link: '/dashboard/templates', color: 'from-amber-500 to-orange-600' },
  ];

  return (
    <div className="space-y-8">
      {/* ============ HERO BANNER ============ */}
      <div className="relative overflow-hidden rounded-2xl border border-[var(--border-subtle)]"
        style={{
          background: 'linear-gradient(135deg, rgba(139,92,246,0.12) 0%, rgba(6,182,212,0.06) 50%, rgba(245,158,11,0.04) 100%), var(--surface-card)',
        }}
      >
        {/* Decorative blobs */}
        <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-violet-500/8 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-cyan-400/6 blur-3xl pointer-events-none" />

        <div className="relative px-6 py-8 lg:px-10 lg:py-12">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Text + CTA */}
            <div className="max-w-lg">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-xs text-violet-400 font-medium mb-4">
                <RocketOutlined /> 短剧创作交易平台
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold text-[var(--text-primary)] mb-2 leading-tight"
                style={{ letterSpacing: '-0.03em' }}>
                发现<span className="gradient-text-brand">爆款</span>短剧模板
              </h1>
              <p className="text-[var(--text-secondary)] text-base mb-6 leading-relaxed">
                浏览创作者社区、购买专业模板，或上架你的创意作品 —— 一站式的短剧创作交易平台
              </p>
              <div className="flex items-center gap-3 flex-wrap">
                <Link href="/dashboard/market">
                  <GradientBtn variant="market" size="md">
                    <ShopOutlined className="mr-1.5" /> 浏览市场
                  </GradientBtn>
                </Link>
                <Link href="/dashboard/projects/new">
                  <GradientBtn variant="primary" size="md">
                    <PlayCircleOutlined className="mr-1.5" /> 开始创作
                  </GradientBtn>
                </Link>
              </div>
            </div>

            {/* Stats cards */}
            <div className="flex gap-4 flex-shrink-0">
              <div className="surface-card p-4 text-center min-w-[100px] animate-fade-in"
                style={{ animationDelay: '0.1s', opacity: 0, animationFillMode: 'forwards' }}>
                <div className="text-2xl font-bold text-[var(--text-primary)]">{animatedTemplates}</div>
                <div className="text-xs text-[var(--text-muted)] mt-1">热门模板</div>
              </div>
              <div className="surface-card p-4 text-center min-w-[100px] animate-fade-in"
                style={{ animationDelay: '0.2s', opacity: 0, animationFillMode: 'forwards' }}>
                <div className="text-2xl font-bold text-[var(--text-primary)]">{animatedCreators}</div>
                <div className="text-xs text-[var(--text-muted)] mt-1">创作者</div>
              </div>
              <div className="surface-card p-4 text-center min-w-[100px] animate-fade-in"
                style={{ animationDelay: '0.3s', opacity: 0, animationFillMode: 'forwards' }}>
                <div className="text-2xl font-bold text-green-400">¥{animatedRevenue}</div>
                <div className="text-xs text-[var(--text-muted)] mt-1">累计交易额</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============ 2-COLUMN CONTENT ============ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left — Hot Templates (2-col grid) */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FireOutlined className="text-amber-400 text-lg" />
              <Title level={5} className="!text-[var(--text-primary)] !mb-0">热门模板</Title>
            </div>
            <Link href="/dashboard/market" className="flex items-center gap-1 text-sm text-[var(--brand-400)] hover:text-[var(--brand-300)] no-underline">
              查看全部 <ArrowRightOutlined className="text-xs" />
            </Link>
          </div>

          {loadingData ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)}
            </div>
          ) : hotTemplates.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {hotTemplates.slice(0, 6).map((tpl) => (
                <Link key={tpl.id} href="/dashboard/market" className="no-underline group">
                  <div className="surface-card surface-card-hover overflow-hidden">
                    {/* Cover image area */}
                    <div className={`h-32 bg-gradient-to-br ${categoryGradient(tpl.category)} flex items-center justify-center relative`}>
                      <PlayCircleOutlined className="text-white/30 text-3xl group-hover:scale-110 transition-transform duration-300" />
                      {tpl.tags && tpl.tags.length > 0 && (
                        <span className="absolute top-3 left-3 px-2 py-0.5 rounded-full text-[10px] font-medium bg-black/40 text-white/80 backdrop-blur-sm">
                          {tpl.tags[0]}
                        </span>
                      )}
                      <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-bold bg-black/50 text-amber-400 backdrop-blur-sm">
                        ¥{typeof tpl.price === 'number' ? tpl.price.toFixed(1) : tpl.price}
                      </span>
                    </div>
                    {/* Info area */}
                    <div className="p-4">
                      <h3 className="text-[var(--text-primary)] font-semibold text-sm mb-1 truncate group-hover:text-[var(--brand-400)] transition-colors">
                        {tpl.title}
                      </h3>
                      <p className="text-[var(--text-muted)] text-xs line-clamp-2 mb-3 leading-relaxed">
                        {tpl.description || '暂无描述'}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1 text-xs text-[var(--text-secondary)]">
                          <UserOutlined className="text-[10px]" />
                          {tpl.creator?.username || '匿名'}
                        </span>
                        <div className="flex items-center gap-3 text-xs text-[var(--text-muted)]">
                          <span className="flex items-center gap-1">
                            <StarFilled className="text-yellow-500 text-[10px]" /> {tpl.avgRating || '-'}
                          </span>
                          <span>{tpl.salesCount || 0} 购买</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="surface-card">
              <div className="text-center py-12">
                <ShopOutlined className="text-4xl text-[var(--text-muted)]/30 mb-4" />
                <div className="text-[var(--text-secondary)] text-sm mb-4">模板市场上线后，热门模板将在这里展示</div>
                <Link href="/dashboard/market">
                  <GradientBtn variant="market" size="sm">浏览模板市场</GradientBtn>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Right — Community + Creators */}
        <div className="lg:col-span-1 space-y-6">
          {/* Community Feed */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FireOutlined className="text-rose-400 text-lg" />
                <Title level={5} className="!text-[var(--text-primary)] !mb-0">社区动态</Title>
              </div>
            </div>

            <div className="surface-card p-4">
              {communityItems.length > 0 ? (
                <div className="space-y-1">
                  {communityItems.map((item, i) => (
                    <div key={i}
                      className="flex items-center gap-3 px-2 py-2.5 rounded-lg hover:bg-[var(--surface-elevated)] transition-colors cursor-pointer group"
                    >
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500/15 to-cyan-500/15 flex items-center justify-center flex-shrink-0 border border-white/5">
                        <UserOutlined className="text-white/40 text-xs" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[var(--text-primary)] text-xs truncate group-hover:text-[var(--brand-400)] transition-colors">{item.title}</p>
                        <div className="flex items-center gap-2 text-[10px] text-[var(--text-muted)] mt-0.5">
                          <span>{item.user}</span>
                          <span>·</span>
                          <span>{timeAgo(item.time)}</span>
                        </div>
                      </div>
                      <div>
                        {item.type === 'purchase' && <Tag className="!bg-cyan-500/10 !border-cyan-500/20 !text-cyan-400 !text-[10px] !rounded-full !m-0 !leading-tight">购买</Tag>}
                        {item.type === 'publish' && <Tag className="!bg-amber-500/10 !border-amber-500/20 !text-amber-400 !text-[10px] !rounded-full !m-0 !leading-tight">上架</Tag>}
                        {item.type === 'review' && <Tag className="!bg-purple-500/10 !border-purple-500/20 !text-purple-400 !text-[10px] !rounded-full !m-0 !leading-tight">评论</Tag>}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FireOutlined className="text-3xl text-[var(--text-muted)]/30 mb-3" />
                  <div className="text-[var(--text-muted)] text-sm mb-4">更多精彩动态即将到来</div>
                  <Link href="/dashboard/community">
                    <GradientBtn variant="community" size="sm">去社区看看</GradientBtn>
                  </Link>
                </div>
              )}
            </div>

            <Link href="/dashboard/community" className="flex items-center gap-1 mt-3 text-sm text-[var(--brand-400)] hover:text-[var(--brand-300)] no-underline">
              进入社区 <ArrowRightOutlined className="text-xs" />
            </Link>
          </div>

          {/* Top Creators */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <CrownOutlined className="text-yellow-400 text-lg" />
              <Title level={5} className="!text-[var(--text-primary)] !mb-0">热门创作者</Title>
            </div>
            <div className="surface-card p-4">
              <div className="space-y-3">
                {topCreators.length > 0 ? (
                  topCreators.map((creator, i) => {
                    const name = creator.name;
                    const colors = ['from-amber-400 to-orange-500', 'from-slate-400 to-slate-500', 'from-orange-600 to-red-600', 'from-violet-500 to-purple-600', 'from-cyan-500 to-blue-600'];
                    return (
                      <div key={creator.id} className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
                        <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${colors[i % colors.length]} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                          {name[0] || '?'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[var(--text-primary)] text-xs font-medium truncate">{name}</p>
                          <p className="text-[var(--text-muted)] text-[10px]">{creator.totalSales || 0} 次销售</p>
                        </div>
                        <span className="text-[var(--text-muted)] text-xs">#{i + 1}</span>
                      </div>
                    );
                  })
                ) : (
                  hotTemplates.filter((_, i) => i < 5).map((tpl, i) => {
                    const name = tpl.creator?.username || '创作者';
                    const colors = ['from-amber-400 to-orange-500', 'from-slate-400 to-slate-500', 'from-orange-600 to-red-600', 'from-violet-500 to-purple-600', 'from-cyan-500 to-blue-600'];
                    return (
                      <div key={i} className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
                        <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${colors[i % colors.length]} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                          {name[0] || '?'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[var(--text-primary)] text-xs font-medium truncate">{name}</p>
                          <p className="text-[var(--text-muted)] text-[10px]">{tpl.salesCount || 0} 次销售</p>
                        </div>
                        <span className="text-[var(--text-muted)] text-xs">#{i + 1}</span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============ QUICK START ============ */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <RocketOutlined className="text-purple-400 text-lg" />
          <Title level={5} className="!text-[var(--text-primary)] !mb-0">快速开始</Title>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {quickStart.map((item, i) => (
            <Link key={i} href={item.link} className="no-underline group">
              <div className="surface-card surface-card-hover p-5">
                <div className="flex items-start gap-4">
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}>
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="text-[var(--text-primary)] font-semibold text-sm mb-1 group-hover:text-[var(--brand-400)] transition-colors">{item.title}</h3>
                    <p className="text-[var(--text-muted)] text-xs leading-relaxed">{item.desc}</p>
                  </div>
                  <ArrowRightOutlined className="ml-auto text-[var(--text-muted)]/40 group-hover:text-[var(--brand-400)] group-hover:translate-x-0.5 transition-all flex-shrink-0 mt-2" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
