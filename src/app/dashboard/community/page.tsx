'use client';

import { useState } from 'react';
import PageHeader from '@/components/ui/page-header';
import GlassCard from '@/components/ui/glass-card';
import GradientBtn from '@/components/ui/gradient-btn';
import ScrollReveal from '@/components/ui/scroll-reveal';
import CreatorStrip from '@/components/business/creator-strip';

const mockFeedItems = [
  {
    id: '1',
    type: 'template_publish',
    creator: { id: 'u1', name: '短剧达人王', followers: 8902, works: 12, rating: 4.8, isFollowing: false },
    title: '霸道总裁爱上我 · 短剧模板',
    description: '新上架模板，三幕式结构，含完整角色设定',
    time: '2 小时前',
    likes: 234,
    comments: 45,
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
    likes: 167,
    comments: 23,
    tags: ['校园', '青春'],
  },
  {
    id: '3',
    type: 'template_publish',
    creator: { id: 'u3', name: '古风剧作家', followers: 4210, works: 6, rating: 4.7, isFollowing: false },
    title: '穿越古代当首富 · 完整模板',
    description: '穿越+经商双线并行，5幕结构，含3个主要角色设定和完整分镜脚本',
    time: '6 小时前',
    likes: 312,
    comments: 67,
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
    likes: 198,
    comments: 52,
    tags: ['悬疑', '共创'],
  },
  {
    id: '5',
    type: 'template_purchase',
    creator: { id: 'u5', name: '爽文制造机', followers: 2150, works: 5, rating: 4.3, isFollowing: true },
    title: '都市逆袭记 · 男频爽文模板',
    description: '刚被 23 位创作者购买，逆袭爽文模板热度飙升',
    time: '12 小时前',
    likes: 256,
    comments: 34,
    tags: ['爽文', '逆袭'],
    price: 34.9,
  },
];

const hotCreators = [
  { id: 'c1', name: '短剧达人王', followers: 8902, works: 12, rating: 4.8, isFollowing: false, bio: '专注甜宠短剧，月更 2-3 部' },
  { id: 'c2', name: '古风剧作家', followers: 4210, works: 6, rating: 4.7, isFollowing: false, bio: '古装仙侠专业户' },
  { id: 'c5', name: '仙侠首席编剧', followers: 3100, works: 5, rating: 4.6, isFollowing: true, bio: '专注仙侠世界观构建' },
];

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState<'feed' | 'creators'>('feed');

  return (
    <div>
      <PageHeader
        title="社区广场"
        subtitle="与创作者连接，发现灵感，分享作品"
        breadcrumbs={[{ label: '工作台', href: '/dashboard' }, { label: '社区' }]}
      />

      {/* Tab switch */}
      <div className="flex gap-1 mb-6 bg-white/[0.02] rounded-xl p-1 border border-white/5 w-fit">
        <button
          onClick={() => setActiveTab('feed')}
          className={`rounded-lg px-5 py-2 text-sm font-medium transition-all ${
            activeTab === 'feed'
              ? 'bg-purple-500/20 text-purple-400'
              : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          📰 动态流
        </button>
        <button
          onClick={() => setActiveTab('creators')}
          className={`rounded-lg px-5 py-2 text-sm font-medium transition-all ${
            activeTab === 'creators'
              ? 'bg-purple-500/20 text-purple-400'
              : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          🌟 热门创作者
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-4">
          {activeTab === 'feed' && (
            <>
              {mockFeedItems.map((item, idx) => (
                <ScrollReveal key={item.id} delay={idx * 80}>
                  <GlassCard className="p-5">
                    {/* Creator + Time */}
                    <div className="flex items-center justify-between mb-4">
                      <CreatorStrip creator={item.creator} size="sm" />
                      <span className="text-xs text-gray-600">{item.time}</span>
                    </div>

                    {/* Content */}
                    <h4 className="font-medium text-white">{item.title}</h4>
                    <p className="mt-1 text-sm text-gray-400">{item.description}</p>

                    {/* Tags */}
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {item.tags.map((tag) => (
                        <span key={tag} className="rounded-md bg-white/5 px-2 py-0.5 text-[10px] text-gray-500">
                          {tag}
                        </span>
                      ))}
                      {item.price !== undefined && (
                        <span className="rounded-md bg-purple-500/10 px-2 py-0.5 text-[10px] text-purple-400">
                          ¥{item.price}
                        </span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="mt-4 flex items-center gap-4 pt-4 border-t border-white/5">
                      <button className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-purple-400 transition-colors">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        {item.likes}
                      </button>
                      <button className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-cyan-400 transition-colors">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        {item.comments}
                      </button>
                      <button className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-pink-400 transition-colors">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                        </svg>
                        分享
                      </button>
                    </div>
                  </GlassCard>
                </ScrollReveal>
              ))}
            </>
          )}

          {activeTab === 'creators' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[...hotCreators, ...hotCreators.map(c => ({...c, id: c.id + 'x', name: c.name + '2', followers: Math.floor(c.followers * 0.7)}))].slice(0, 6).map((creator, idx) => (
                <ScrollReveal key={creator.id} delay={idx * 80}>
                  <GlassCard className="p-5">
                    <CreatorStrip creator={creator} size="md" showBio />
                    <div className="mt-4 flex items-center gap-2">
                      {['甜宠', '古装', '悬疑'].slice(0, 1 + (idx % 3)).map((tag) => (
                        <span key={tag} className="rounded bg-white/5 px-2 py-0.5 text-[10px] text-gray-500">
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
        <div className="space-y-6">
          {/* New Template Alert */}
          <GlassCard className="p-5" glow>
            <h4 className="text-sm font-medium text-white mb-3">📢 最新上架</h4>
            <div className="space-y-3">
              {mockFeedItems.filter((i) => i.type === 'template_publish').slice(0, 3).map((item) => (
                <div key={item.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/[0.02] transition-colors cursor-pointer">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500/20 to-cyan-500/10 text-[10px] text-purple-400">
                    {item.title.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-gray-300 truncate">{item.title}</p>
                    <p className="text-[10px] text-gray-600">{item.time}</p>
                  </div>
                  {item.price !== undefined && (
                    <span className="text-xs font-medium text-purple-400 shrink-0">¥{item.price}</span>
                  )}
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Hot Creators sidebar */}
          <GlassCard className="p-5">
            <h4 className="text-sm font-medium text-white mb-3">🌟 热门创作者</h4>
            <div className="space-y-3">
              {hotCreators.map((creator) => (
                <CreatorStrip key={creator.id} creator={creator} size="sm" />
              ))}
            </div>
          </GlassCard>

          {/* CTA */}
          <div className="rounded-2xl p-5 bg-gradient-to-br from-purple-500/10 to-cyan-500/10 border border-purple-500/10 text-center">
            <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-xl bg-white/5 mb-3">
              <svg className="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <h4 className="font-medium text-white">分享你的创作</h4>
            <p className="text-xs text-gray-400 mt-1 mb-4">将项目发布到社区获得更多灵感</p>
            <GradientBtn size="sm" className="w-full">发布动态</GradientBtn>
          </div>
        </div>
      </div>
    </div>
  );
}
