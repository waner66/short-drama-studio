'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import PageHeader from '@/components/ui/page-header';
import GlassCard from '@/components/ui/glass-card';
import GradientBtn from '@/components/ui/gradient-btn';
import EmptyState from '@/components/ui/empty-state';

const statusMap: Record<string, { color: string; label: string; bg: string }> = {
  DRAFT: { color: 'text-gray-400', label: '草稿', bg: 'bg-gray-500/20' },
  IN_PROGRESS: { color: 'text-blue-400', label: '制作中', bg: 'bg-blue-500/20' },
  COMPLETED: { color: 'text-green-400', label: '已完成', bg: 'bg-green-500/20' },
  PUBLISHED: { color: 'text-purple-400', label: '已发布', bg: 'bg-purple-500/20' },
};

const progressMap: Record<string, number> = {
  DRAFT: 15, IN_PROGRESS: 60, COMPLETED: 100, PUBLISHED: 100,
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);

  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      import('@/lib/store/data-service').then(({ projectService }) => {
        const list = projectService.listByUser(user.id || 'anonymous');
        setProjects(list.map((p: any) => ({
          ...p,
          updatedAt: p.createdAt || 'N/A',
          sceneCount: p.sceneCount || 0,
          storyboardCount: p.storyboardCount || 0,
        })));
      });
    } catch { setProjects([]); }
  }, []);

  return (
    <div>
      <PageHeader
        title="我的项目"
        actions={
          <Link href="/dashboard/projects/new">
            <GradientBtn>+ 创建新项目</GradientBtn>
          </Link>
        }
      />

      {projects.length === 0 ? (
        <GlassCard>
          <EmptyState
            title="还没有项目"
            description="创建你的第一个短剧项目"
            actions={
              <Link href="/dashboard/projects/new">
                <GradientBtn>创建第一个项目</GradientBtn>
              </Link>
            }
          />
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => {
            const st = statusMap[project.status] || statusMap.DRAFT;
            const progress = progressMap[project.status] || 15;

            return (
              <GlassCard key={project.id} hover className="group">
                {/* 标题 & 状态 */}
                <div className="flex items-start justify-between mb-3">
                  <Link href={`/dashboard/projects/${project.id}`} className="font-bold text-white group-hover:text-brand-500 transition-colors truncate flex-1 mr-2">
                    {project.title}
                  </Link>
                  <span className={`flex-shrink-0 text-xs px-2 py-0.5 rounded-full ${st.bg} ${st.color}`}>
                    {st.label}
                  </span>
                </div>

                {/* 类型 */}
                <div className="flex items-center gap-1 text-sm text-gray-500 mb-3">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  {project.genre || '未分类'}
                </div>

                {/* 进度条 */}
                <div className="mb-3">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>制作进度</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${progress}%`,
                        background: 'linear-gradient(90deg, var(--brand-500), #00d4aa)',
                      }}
                    />
                  </div>
                </div>

                {/* 底部信息 */}
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{project.sceneCount} 场景 · {project.storyboardCount} 分镜</span>
                  <span className="truncate ml-2 text-[10px]">{project.updatedAt}</span>
                </div>

                {/* 操作栏 */}
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/10">
                  <Link
                    href={`/dashboard/projects/${project.id}`}
                    className="text-sm text-gray-400 hover:text-brand-500 transition-colors flex items-center gap-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    编辑
                  </Link>
                  <div className="relative">
                    <button
                      onClick={() => setMenuOpen(menuOpen === project.id ? null : project.id)}
                      className="text-gray-400 hover:text-white p-1"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                      </svg>
                    </button>
                    {menuOpen === project.id && (
                      <div className="absolute right-0 top-8 z-50 w-36 bg-[#141428] border border-white/10 rounded-lg py-1 shadow-xl backdrop-blur-xl">
                        <button
                          className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
                          onClick={() => setMenuOpen(null)}
                        >导出为模板</button>
                        <button
                          className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                          onClick={() => setMenuOpen(null)}
                        >删除</button>
                      </div>
                    )}
                  </div>
                </div>
              </GlassCard>
            );
          })}
        </div>
      )}
    </div>
  );
}
