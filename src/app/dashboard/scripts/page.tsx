'use client';

import { useState } from 'react';
import Link from 'next/link';
import PageHeader from '@/components/ui/page-header';
import GlassCard from '@/components/ui/glass-card';
import GradientBtn from '@/components/ui/gradient-btn';
import ScrollReveal from '@/components/ui/scroll-reveal';
import LoadingSkeleton from '@/components/ui/loading-skeleton';
import EmptyState from '@/components/ui/empty-state';

const mockScripts = [
  {
    id: '1',
    title: '第1集 · 穿越古代的第一天',
    projectTitle: '穿越之我在古代当总裁',
    acts: 3,
    scenes: 5,
    words: 2847,
    characters: 4,
    status: 'complete',
    updatedAt: '2026-06-29',
    progress: 100,
  },
  {
    id: '2',
    title: '第2集 · 商场风云初起',
    projectTitle: '穿越之我在古代当总裁',
    acts: 3,
    scenes: 4,
    words: 1956,
    characters: 4,
    status: 'draft',
    updatedAt: '2026-06-28',
    progress: 65,
  },
  {
    id: '3',
    title: '第1集 · 初遇',
    projectTitle: '校园甜心日记',
    acts: 3,
    scenes: 3,
    words: 1205,
    characters: 2,
    status: 'complete',
    updatedAt: '2026-06-25',
    progress: 100,
  },
  {
    id: '4',
    title: '第1集 · 迷雾重重',
    projectTitle: '午夜调查局',
    acts: 5,
    scenes: 7,
    words: 4203,
    characters: 6,
    status: 'draft',
    updatedAt: '2026-06-20',
    progress: 40,
  },
  {
    id: '5',
    title: '第2集 · 线索浮现',
    projectTitle: '午夜调查局',
    acts: 3,
    scenes: 4,
    words: 0,
    characters: 4,
    status: 'outline',
    updatedAt: '2026-06-18',
    progress: 5,
  },
  {
    id: '6',
    title: '第1集 · 仙界坠落',
    projectTitle: '剑仙也要谈恋爱',
    acts: 0,
    scenes: 0,
    words: 0,
    characters: 0,
    status: 'outline',
    updatedAt: '2026-06-15',
    progress: 0,
  },
];

const statusConfig: Record<string, { label: string; color: string }> = {
  complete: { label: '已完成', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  draft: { label: '草稿', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  outline: { label: '大纲', color: 'bg-gray-500/10 text-gray-400 border-gray-500/20' },
};

export default function ScriptsPage() {
  const [search, setSearch] = useState('');

  const filtered = mockScripts.filter(
    (s) =>
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.projectTitle.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <PageHeader
        title="剧本中心"
        subtitle="管理所有项目的剧本创作进度"
        breadcrumbs={[{ label: '工作台', href: '/dashboard' }, { label: '剧本中心' }]}
        actions={
          <div className="flex gap-3">
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="搜索剧本..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-48 rounded-xl border border-white/10 bg-white/[0.03] pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-all"
              />
            </div>
            <Link href="/dashboard/projects/new">
              <GradientBtn>+ 新建剧本</GradientBtn>
            </Link>
          </div>
        }
      />

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((script, idx) => (
            <ScrollReveal key={script.id} delay={idx * 80}>
              <Link href={`/dashboard/projects/${script.projectTitle === '穿越之我在古代当总裁' ? 'demo' : 'demo'}`}>
                <GlassCard hover className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <span className="text-xs text-gray-500">{script.projectTitle}</span>
                      <h3 className="font-semibold text-white mt-0.5">{script.title}</h3>
                    </div>
                    <span
                      className={`rounded-md border px-2 py-0.5 text-[10px] font-medium ${statusConfig[script.status]?.color}`}
                    >
                      {statusConfig[script.status]?.label}
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="mb-4">
                    <div className="h-1.5 rounded-full bg-white/[0.04] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-purple-500 to-cyan-400 transition-all duration-500"
                        style={{ width: `${script.progress}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-gray-600 mt-1 block">{script.progress}%</span>
                  </div>

                  {/* Meta info */}
                  <div className="flex items-center gap-4 text-xs text-gray-400 mb-4">
                    <span className="flex items-center gap-1">
                      <span className="text-purple-400">🎭</span> {script.acts} 幕
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="text-cyan-400">🎬</span> {script.scenes} 场景
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="text-pink-400">👤</span> {script.characters} 角色
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="text-gray-500">📝</span> {script.words.toLocaleString()} 字
                    </span>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-white/5">
                    <span className="text-[11px] text-gray-600">更新于 {script.updatedAt}</span>
                    {script.status === 'complete' ? (
                      <span className="text-xs text-emerald-400">✓ 可导出</span>
                    ) : script.status === 'outline' ? (
                      <span className="text-xs text-purple-400">继续创作 →</span>
                    ) : (
                      <span className="text-xs text-amber-400">继续编辑 →</span>
                    )}
                  </div>
                </GlassCard>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      ) : search ? (
        <EmptyState
          title="未找到匹配剧本"
          description={`没有找到与 "${search}" 相关的剧本`}
          actionLabel="清空搜索"
          onAction={() => setSearch('')}
        />
      ) : (
        <EmptyState
          title="还没有剧本"
          description="创建你的第一个短剧项目，AI 将帮助你快速生成剧本"
          actionLabel="创建项目"
          onAction={() => {}}
        />
      )}

      {/* Quick Actions */}
      <div className="mt-8">
        <h3 className="text-sm font-medium text-gray-400 mb-4">快速操作</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <GlassCard hover className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-600/5">
                <svg className="h-5 w-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <span className="text-sm font-medium text-white">AI 生成大纲</span>
                <p className="text-xs text-gray-500 mt-0.5">输入创意，一键生成剧本大纲</p>
              </div>
            </div>
          </GlassCard>

          <GlassCard hover className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/20 to-cyan-600/5">
                <svg className="h-5 w-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <div>
                <span className="text-sm font-medium text-white">AI 续写对话</span>
                <p className="text-xs text-gray-500 mt-0.5">选中场景，AI 自动生成角色对话</p>
              </div>
            </div>
          </GlassCard>

          <GlassCard hover className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500/20 to-pink-600/5">
                <svg className="h-5 w-5 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                </svg>
              </div>
              <div>
                <span className="text-sm font-medium text-white">分镜拆解</span>
                <p className="text-xs text-gray-500 mt-0.5">剧本自动拆解为分镜脚本</p>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
