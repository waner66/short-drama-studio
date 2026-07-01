'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import PageHeader from '@/components/ui/page-header';
import GlassCard from '@/components/ui/glass-card';
import GradientBtn from '@/components/ui/gradient-btn';
import ScrollReveal from '@/components/ui/scroll-reveal';
import CreatorStrip from '@/components/business/creator-strip';
import { FireOutlined, CrownOutlined, HeartOutlined, MessageOutlined, ShareAltOutlined } from '@ant-design/icons';

interface FeedItem {
  id: string;
  type: string;
  title: string;
  description?: string;
  user: string;
  userId?: string;
  time: string;
  tags?: string[];
  price?: number;
  rating?: number;
  templateId?: string;
  templateTitle?: string;
}

interface CreatorData {
  id: string;
  name: string;
  avatar?: string;
  bio?: string;
  works?: number;
  followers?: number;
  rating?: number;
  totalSales?: number;
}

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

const hotTopics = ['甜宠', '逆袭爽文', '古装仙侠', '穿越', '霸总', 'AI创作', '共创招募', '新人报道'];

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState<'feed' | 'creators'>('feed');
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
  const [creators, setCreators] = useState<CreatorData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [feedRes, creatorsRes] = await Promise.all([
          fetch('/api/community/feed?limit=30'),
          fetch('/api/community/creators'),
        ]);

        if (feedRes.ok) {
          const feedData = await feedRes.json();
          setFeedItems(feedData.data || []);
        }
        if (creatorsRes.ok) {
          const creatorsData = await creatorsRes.json();
          setCreators(creatorsData.data || []);
        }
      } catch {
        // keep empty
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const toggleLike = (id: string) => {
    setLikedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  // Latest publishes
  const latestPublish = feedItems.filter(i => i.type === 'publish').slice(0, 3);

  return (
    <div>
      <PageHeader
        title="社区广场"
        subtitle="与创作者连接，发现灵感，分享作品"
        breadcrumbs={[{ label: '发现首页', href: '/dashboard' }, { label: '社区广场' }]}
      />

      {/* Tab switch */}
      <div className="flex gap-1 mb-6 bg-[var(--surface-elevated)] rounded-xl p-1 border border-[var(--border-subtle)] w-fit">
        <button
          onClick={() => setActiveTab('feed')}
          className={`rounded-lg px-5 py-2 text-sm font-medium transition-all ${
            activeTab === 'feed' ? 'bg-cyan-500/15 text-cyan-400' : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
          }`}
        >动态流</button>
        <button
          onClick={() => setActiveTab('creators')}
          className={`rounded-lg px-5 py-2 text-sm font-medium transition-all ${
            activeTab === 'creators' ? 'bg-cyan-500/15 text-cyan-400' : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
          }`}
        >热门创作者</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-4">
          {loading ? (
            <div className="text-center py-12 text-gray-400">加载中...</div>
          ) : activeTab === 'feed' && feedItems.length > 0 ? (
            feedItems.map((item, idx) => (
              <ScrollReveal key={item.id} delay={idx * 60}>
                <Link
                  href={item.templateId ? `/dashboard/market/${item.templateId}` : '#'}
                  className="no-underline block"
                >
                  <GlassCard className="p-5 hover:border-purple-500/20 transition-colors">
                    {/* User + Time */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500/20 to-cyan-500/20 flex items-center justify-center text-purple-400 font-bold text-xs">
                          {item.user.charAt(0)}
                        </div>
                        <span className="text-sm font-medium text-[var(--text-primary)]">{item.user}</span>
                      </div>
                      <span className="text-xs text-[var(--text-muted)]">{timeAgo(item.time)}</span>
                    </div>

                    {/* Content */}
                    <h4 className="font-semibold text-[var(--text-primary)] text-sm">{item.title}</h4>
                    {item.description && (
                      <p className="mt-1.5 text-sm text-[var(--text-secondary)] leading-relaxed line-clamp-2">{item.description}</p>
                    )}

                    {/* Tags + Price */}
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {item.tags?.map((tag) => (
                        <span key={tag} className="rounded-md bg-[var(--surface-elevated)] px-2 py-0.5 text-[10px] text-[var(--text-muted)] font-medium">
                          {tag}
                        </span>
                      ))}
                      {item.rating !== undefined && (
                        <span className="rounded-md bg-yellow-500/10 px-2 py-0.5 text-[10px] text-yellow-400 font-medium">
                          {'★'.repeat(item.rating)} {item.rating}分
                        </span>
                      )}
                      {item.price !== undefined && (
                        <span className="rounded-md bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 text-[10px] text-purple-400 font-semibold">
                          ¥{item.price.toFixed(1)}
                        </span>
                      )}
                      <span className={`rounded-full px-2 py-0.5 text-[10px] ${
                        item.type === 'purchase' ? 'bg-cyan-500/10 text-cyan-400' :
                        item.type === 'publish' ? 'bg-amber-500/10 text-amber-400' :
                        'bg-purple-500/10 text-purple-400'
                      }`}>
                        {item.type === 'purchase' ? '购买' : item.type === 'publish' ? '上架' : '评价'}
                      </span>
                    </div>
                  </GlassCard>
                </Link>
              </ScrollReveal>
            ))
          ) : activeTab === 'feed' ? (
            <div className="text-center py-12 text-gray-400">
              <FireOutlined className="text-3xl text-gray-500/30 mb-3 block" />
              暂无动态，去模板市场看看
            </div>
          ) : null}

          {activeTab === 'creators' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {creators.length > 0 ? (
                creators.map((c, idx) => (
                  <ScrollReveal key={c.id} delay={idx * 80}>
                    <Link href={`/dashboard/creator/${c.id}`} className="no-underline block">
                      <GlassCard className="p-5 hover:border-purple-500/20 transition-colors">
                        <CreatorStrip
                          creator={{
                            id: c.id,
                            name: c.name,
                            avatar: c.avatar,
                            bio: c.bio,
                            followers: c.followers,
                            works: c.works,
                            rating: c.rating,
                          }}
                          size="md"
                          showBio
                        />
                      </GlassCard>
                    </Link>
                  </ScrollReveal>
                ))
              ) : (
                <div className="text-center py-12 text-gray-400 col-span-2">暂无创作者数据</div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Latest Publish */}
          <GlassCard className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <FireOutlined className="text-cyan-400" />
              <h4 className="text-sm font-semibold text-[var(--text-primary)]">最新上架</h4>
            </div>
            <div className="space-y-2">
              {latestPublish.length > 0 ? (
                latestPublish.map((item) => (
                  <Link key={item.id} href={`/dashboard/market/${item.templateId}`} className="no-underline block">
                    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-[var(--surface-elevated)] transition-colors cursor-pointer">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500/15 to-blue-500/10 text-[10px] font-bold text-cyan-400">
                        {item.title.charAt(0)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-[var(--text-secondary)] truncate">{item.title}</p>
                        <p className="text-[10px] text-[var(--text-muted)]">{timeAgo(item.time)}</p>
                      </div>
                      {item.price !== undefined && (
                        <span className="text-xs font-semibold text-purple-400 shrink-0">¥{item.price.toFixed(1)}</span>
                      )}
                    </div>
                  </Link>
                ))
              ) : (
                <div className="text-center py-4 text-xs text-gray-500">暂无上架模板</div>
              )}
            </div>
          </GlassCard>

          {/* Hot Topics */}
          <GlassCard className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <FireOutlined className="text-pink-400" />
              <h4 className="text-sm font-semibold text-[var(--text-primary)]">热门话题</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {hotTopics.map((topic) => (
                <span key={topic}
                  className="rounded-lg bg-[var(--surface-elevated)] border border-[var(--border-subtle)] px-3 py-1.5 text-xs text-[var(--text-secondary)] hover:border-cyan-500/30 hover:text-cyan-400 cursor-pointer transition-colors">
                  #{topic}
                </span>
              ))}
            </div>
          </GlassCard>

          {/* Hot Creators */}
          <GlassCard className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <CrownOutlined className="text-yellow-400" />
              <h4 className="text-sm font-semibold text-[var(--text-primary)]">热门创作者</h4>
            </div>
            <div className="space-y-3">
              {creators.slice(0, 5).map((c) => (
                <Link key={c.id} href={`/dashboard/creator/${c.id}`} className="no-underline block">
                  <CreatorStrip
                    creator={{
                      id: c.id,
                      name: c.name,
                      avatar: c.avatar,
                      bio: c.bio,
                      followers: c.followers,
                      works: c.works,
                      rating: c.rating,
                    }}
                    size="sm"
                  />
                </Link>
              ))}
            </div>
          </GlassCard>

          {/* CTA */}
          <div className="rounded-2xl p-5 border border-[var(--border-subtle)] text-center"
            style={{ background: 'linear-gradient(135deg, rgba(6,182,212,0.06), rgba(59,130,246,0.04)), var(--surface-card)' }}>
            <div className="flex h-10 w-10 mx-auto items-center justify-center rounded-xl bg-cyan-500/10 mb-3">
              <svg className="h-5 w-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <h4 className="font-medium text-[var(--text-primary)] text-sm">分享你的创作</h4>
            <p className="text-xs text-[var(--text-muted)] mt-1 mb-4">将项目发布到社区获得更多灵感</p>
            <Link href="/dashboard/projects/new">
              <GradientBtn variant="community" size="sm" className="w-full">发布动态</GradientBtn>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
