'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import PageHeader from '@/components/ui/page-header';
import GlassCard from '@/components/ui/glass-card';
import GradientBtn from '@/components/ui/gradient-btn';
import StatCard from '@/components/ui/stat-card';
import TagGroup from '@/components/ui/tag-group';
import AiGeneratePanel from '@/components/business/ai-generate-panel';

const TABS = [
  { key: 'overview', label: '概览', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
  { key: 'script', label: '剧本', icon: 'M9 4h6v2H9zm0 6h6v2H9zm0 6h6v2H9zM5 4h2v2H5zm0 6h2v2H5zm0 6h2v2H5z' },
  { key: 'scenes', label: '场景', icon: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z' },
  { key: 'storyboard', label: '分镜', icon: 'M4 5a1 1 0 011-1h4a1 1 0 011 1v5a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 16a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1v-2zM14 16a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1h-4a1 1 0 01-1-1v-2z' },
  { key: 'characters', label: '角色', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
];

const mockProject = {
  id: '1',
  title: '穿越之我在古代当总裁',
  description: '现代女总裁穿越到古代，用商业头脑逆袭商界，收获真爱的甜宠短剧',
  genre: '古装仙侠',
  style: '写实',
  status: 'IN_PROGRESS',
  progress: 65,
  sceneCount: 8,
  storyboardCount: 24,
  characterCount: 4,
  scriptWords: 3200,
  createdAt: '2026-06-15',
};

const mockCharacters = [
  { id: '1', name: '苏晚晴', role: '女主', gender: '女' },
  { id: '2', name: '慕容瑾', role: '男主', gender: '男' },
  { id: '3', name: '柳如烟', role: '女配', gender: '女' },
  { id: '4', name: '赵管家', role: '配角', gender: '男' },
];

const recentActivity = [
  { action: '修改了第3幕剧本', time: '10分钟前', user: '老大' },
  { action: '添加了2个场景', time: '1小时前', user: '老大' },
  { action: 'AI 生成了分镜脚本', time: '3小时前', user: 'AI' },
  { action: '创建了角色「苏晚晴」', time: '昨天', user: '老大' },
];

export default function ProjectDetailClient() {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState('overview');
  const [project, setProject] = useState(mockProject);
  const [showAiPanel, setShowAiPanel] = useState(false);

  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      import('@/lib/store/data-service').then(({ projectService }) => {
        const projects = projectService.listByUser(user.id || 'demo');
        const p = projects.find((pr: Record<string, unknown>) => pr.id === id);
        if (p) setProject({ ...mockProject, ...p });
      });
    } catch {}
  }, [id]);

  return (
    <div>
      {/* 面包屑 + 标题 */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
        <Link href="/dashboard/projects" className="hover:text-white transition-colors">项目</Link>
        <span>/</span>
        <span className="text-white truncate">{project.title}</span>
      </div>

      <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold text-white">{project.title}</h1>
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              project.status === 'IN_PROGRESS' ? 'bg-blue-500/20 text-blue-400' :
              project.status === 'COMPLETED' ? 'bg-green-500/20 text-green-400' :
              project.status === 'PUBLISHED' ? 'bg-purple-500/20 text-purple-400' :
              'bg-gray-500/20 text-gray-400'
            }`}>
              {project.status === 'IN_PROGRESS' ? '制作中' :
               project.status === 'COMPLETED' ? '已完成' :
               project.status === 'PUBLISHED' ? '已发布' : '草稿'}
            </span>
          </div>
          <p className="text-gray-500 text-sm">{project.description}</p>
        </div>
        <div className="flex items-center gap-2">
          <GradientBtn onClick={() => setShowAiPanel(!showAiPanel)}>
            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            AI 助手
          </GradientBtn>
        </div>
      </div>

      {/* AI 面板 */}
      {showAiPanel && (
        <div className="mb-6">
          <AiGeneratePanel
            type="script"
            title="AI 创作助手"
            description="帮你生成剧本、场景描述和分镜脚本"
            onGenerate={(prompt) => console.log('AI generate:', prompt)}
          />
        </div>
      )}

      {/* Tab 导航 */}
      <div className="flex gap-1 mb-6 overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
              activeTab === tab.key
                ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/20'
                : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
            </svg>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 内容 */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* 进度 */}
          <GlassCard>
            <h3 className="text-sm font-medium text-gray-400 mb-3">制作进度</h3>
            <div className="flex items-center gap-4">
              <div className="flex-1 h-3 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${project.progress}%`,
                    background: 'linear-gradient(90deg, var(--brand-500), #00d4aa)',
                  }}
                />
              </div>
              <span className="text-white font-bold text-lg">{project.progress}%</span>
            </div>
          </GlassCard>

          {/* 统计卡片 */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <StatCard title="场景" value={String(project.sceneCount)} accent="cyan" />
            <StatCard title="分镜" value={String(project.storyboardCount)} accent="purple" />
            <StatCard title="角色" value={String(project.characterCount)} accent="green" />
            <StatCard title="字数" value={String(project.scriptWords)} accent="amber" />
          </div>

          {/* 角色列表 */}
          <GlassCard heading="项目角色">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {mockCharacters.map((ch) => (
                <Link
                  key={ch.id}
                  href={`/dashboard/characters/${ch.id}`}
                  className="flex items-center gap-3 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-500 to-[#00d4aa] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {ch.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-white group-hover:text-brand-500 transition-colors truncate">
                      {ch.name}
                    </div>
                    <div className="text-xs text-gray-500">{ch.role}</div>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded ${
                    ch.gender === '男' ? 'bg-blue-500/20 text-blue-400' : 'bg-pink-500/20 text-pink-400'
                  }`}>
                    {ch.gender}
                  </span>
                </Link>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t border-white/5">
              <Link href="/dashboard/characters" className="text-sm text-brand-500 hover:text-[#7b5eff] transition-colors">
                + 管理角色
              </Link>
            </div>
          </GlassCard>

          {/* 最近动态 */}
          <GlassCard heading="最近动态">
            <div className="space-y-3">
              {recentActivity.map((act, i) => (
                <div key={i} className="flex items-center gap-3 text-sm">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    act.user === 'AI' ? 'bg-brand-500' : 'bg-[#00d4aa]'
                  }`} />
                  <span className="text-gray-300">{act.action}</span>
                  <span className="text-gray-600 ml-auto text-xs">{act.time}</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      )}

      {activeTab === 'script' && (
        <GlassCard>
          <div className="text-center py-8">
            <div className="text-4xl mb-3">📝</div>
            <h3 className="text-lg font-bold text-white mb-2">剧本编辑器</h3>
            <p className="text-gray-500 text-sm mb-6">编辑和管理你的剧本内容</p>
            <Link href={`/dashboard/projects/${id}/script`}>
              <GradientBtn>打开剧本编辑器</GradientBtn>
            </Link>
          </div>
        </GlassCard>
      )}

      {activeTab === 'scenes' && (
        <GlassCard>
          <div className="text-center py-8">
            <div className="text-4xl mb-3">🎬</div>
            <h3 className="text-lg font-bold text-white mb-2">场景管理</h3>
            <p className="text-gray-500 text-sm mb-6">管理 {project.sceneCount} 个场景</p>
            <Link href={`/dashboard/projects/${id}/scenes`}>
              <GradientBtn>打开场景管理</GradientBtn>
            </Link>
          </div>
        </GlassCard>
      )}

      {activeTab === 'storyboard' && (
        <GlassCard>
          <div className="text-center py-8">
            <div className="text-4xl mb-3">🎞️</div>
            <h3 className="text-lg font-bold text-white mb-2">分镜编辑器</h3>
            <p className="text-gray-500 text-sm mb-6">编排 {project.storyboardCount} 个镜头</p>
            <Link href={`/dashboard/projects/${id}/storyboard`}>
              <GradientBtn>打开分镜编辑器</GradientBtn>
            </Link>
          </div>
        </GlassCard>
      )}

      {activeTab === 'characters' && (
        <GlassCard>
          <div className="text-center py-8">
            <div className="text-4xl mb-3">👥</div>
            <h3 className="text-lg font-bold text-white mb-2">角色管理</h3>
            <p className="text-gray-500 text-sm mb-6">{project.characterCount} 个角色已创建</p>
            <Link href="/dashboard/characters">
              <GradientBtn>管理所有角色</GradientBtn>
            </Link>
          </div>
        </GlassCard>
      )}
    </div>
  );
}
