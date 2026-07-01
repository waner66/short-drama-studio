'use client';

import { useState } from 'react';
import PageHeader from '@/components/ui/page-header';
import GlassCard from '@/components/ui/glass-card';
import GradientBtn from '@/components/ui/gradient-btn';
import ScrollReveal from '@/components/ui/scroll-reveal';
import CreatorStrip from '@/components/business/creator-strip';
import { FireOutlined, CrownOutlined, HeartOutlined, MessageOutlined, ShareAltOutlined } from '@ant-design/icons';

const mockFeedItems = [
  {
    id: '1',
    type: 'template_publish',
    creator: { id: 'u1', name: '短剧达人王', followers: 8902, works: 12, rating: 4.8, isFollowing: false },
    title: '霸道总裁爱上我 · 短剧模板',
    description: '新上架模板，三幕式结构，含完整角色设定',
    time: '2 小时前',
    likes: 234, comments: 45,
    tags: ['甜宠', '现代'],
    price: 29.9,
  },
  {
    id: '2',
    type: 'project_share',
    creator: { id: 'u2', name: '青春制片人', followers: 5601, works: 8, rating: 4.5, isFollowing: true },
    title: '校园甜心日记 · 幕后花絮',
    description: '分享了最新项目的第一集片段，校园青春短剧，3个核心角色',
    time: '4 小时前',
    likes: 167, comments: 23,
    tags: ['校园', '青春'],
  },
  {
    id: '3',
    type: 'template_publish',
    creator: { id: 'u3', name: '古风剧作家', followers: 4210, works: 6, rating: 4.7, isFollowing: false },
    title: '穿越古代当首富 · 完整模板',
    description: '穿越+经商双线并行，5幕结构，含3个主要角色设定和完整分镜脚本',
    time: '6 小时前',
    likes: 312, comments: 67,
    tags: ['古装', '逆袭'],
    price: 49.9,
  },
  {
    id: '4',
    type: 'project_share',
    creator: { id: 'u4', name: '悬疑编剧李', followers: 3204, works: 4, rating: 4.9, isFollowing: false },
    title: '午夜调查局 · 角色征集',
    description: '正在创作悬疑推理短剧，开放 3 个配角供社区共创',
    time: '10 小时前',
    likes: 198, comments: 52,
    tags: ['悬疑', '共创'],
  },
  {
    id: '5',
    type: 'template_purchase',
    creator: { id: 'u5', name: '爽文制造机', followers: 2150, works: 5, rating: 4.3, isFollowing: true },
    title: '都市逆袭记 · 男频爽文模板',
    description: '刚被 23 位创作者购买，逆袭爽文模板热度飙升',
    time: '12 小时前',
    likes: 256, comments: 34,
    tags: ['爽文', '逆袭'],
    price: 34.9,
  },
];

const hotCreators = [
  { id: 'c1', name: '短剧达人王', followers: 8902, works: 12, rating: 4.8, isFollowing: false, bio: '专注甜宠短剧，月更 2-3 部' },
  { id: 'c2', name: '古风剧作家', followers: 4210, works: 6, rating: 4.7, isFollowing: false, bio: '古装仙侠专业户' },
  { id: 'c5', name: '仙侠首席编剧', followers: 3100, works: 5, rating: 4.6, isFollowing: true, bio: '专注仙侠世界观构建' },
];

const hotTopics = ['甜宠', '逆袭爽文', '古装仙侠', '穿越', '霸总', 'AI创作', '共创招募', '新人报道'];

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState<'feed' | 'creators'>('feed');
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());

  const toggleLike = (id: string) => {
    setLikedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

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
          {activeTab === 'feed' && mockFeedItems.map((item, idx) => (
            <ScrollReveal key={item.id} delay={idx * 60}>
              <GlassCard className="p-5">
                {/* Creator + Time */}
                <div className="flex items-center justify-between mb-4">
                  <CreatorStrip creator={item.creator} size="sm" />
                  <span className="text-xs text-[var(--text-muted)]">{item.time}</span>
                </div>

                {/* Content */}
                <h4 className="font-semibold text-[var(--text-primary)] text-sm">{item.title}</h4>
                <p className="mt-1.5 text-sm text-[var(--text-secondary)] leading-relaxed">{item.description}</p>

                {/* Tags + Price */}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {item.tags.map((tag) => (
                    <span key={tag} className="rounded-md bg-[var(--surface-elevated)] px-2 py-0.5 text-[10px] text-[var(--text-muted)] font-medium">
                      {tag}
                    </span>
                  ))}
                  {item.price !== undefined && (
                    <span className="rounded-md bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 text-[10px] text-purple-400 font-semibold">
                      ¥{item.price}
                    </span>
                  )}
                </div>

                {/* Action buttons */}
                <div className="mt-4 flex items-center gap-5 pt-3 border-t border-[var(--border-subtle)]">
                  <button
                    onClick={() => toggleLike(item.id)}
                    className={`flex items-center gap-1.5 text-xs transition-colors ${
                      likedIds.has(item.id) ? 'text-pink-400' : 'text-[var(--text-muted)] hover:text-pink-400'
                    }`}
                  >
                    <HeartOutlined /> {likedIds.has(item.id) ? item.likes + 1 : item.likes}
                  </button>
                  <button className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] hover:text-cyan-400 transition-colors">
                    <MessageOutlined /> {item.comments}
                  </button>
                  <button className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] hover:text-cyan-400 transition-colors">
                    <ShareAltOutlined /> 分享
                  </button>
                </div>
              </GlassCard>
            </ScrollReveal>
          ))}

          {activeTab === 'creators' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[...hotCreators].map((creator, idx) => (
                <ScrollReveal key={creator.id} delay={idx * 80}>
                  <GlassCard className="p-5">
                    <CreatorStrip creator={creator} size="md" showBio />
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {['甜宠', '古装', '悬疑'].slice(0, 1 + (idx % 3)).map(tag => (
                        <span key={tag} className="rounded-md bg-[var(--surface-elevated)] px-2 py-0.5 text-[10px] text-[var(--text-muted)]">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </GlassCard>
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Latest */}
          <GlassCard className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <FireOutlined className="text-cyan-400" />
              <h4 className="text-sm font-semibold text-[var(--text-primary)]">最新上架</h4>
            </div>
            <div className="space-y-2">
              {mockFeedItems.filter(i => i.type === 'template_publish').slice(0, 3).map((item) => (
                <div key={item.id}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-[var(--surface-elevated)] transition-colors cursor-pointer">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500/15 to-blue-500/10 text-[10px] font-bold text-cyan-400">
                    {item.title.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-[var(--text-secondary)] truncate">{item.title}</p>
                    <p className="text-[10px] text-[var(--text-muted)]">{item.time}</p>
                  </div>
                  {item.price !== undefined && (
                    <span className="text-xs font-semibold text-purple-400 shrink-0">¥{item.price}</span>
                  )}
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Hot Topics Tag Cloud */}
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
              {hotCreators.map((creator) => (
                <CreatorStrip key={creator.id} creator={creator} size="sm" />
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
            <GradientBtn variant="community" size="sm" className="w-full">发布动态</GradientBtn>
          </div>
        </div>
      </div>
    </div>
  );
}
