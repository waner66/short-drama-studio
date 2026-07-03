'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import PageHeader from '@/components/ui/page-header';
import GlassCard from '@/components/ui/glass-card';
import GradientBtn from '@/components/ui/gradient-btn';
import { CardSkeleton } from '@/components/ui/loading-skeleton';
import AiGeneratePanel from '@/components/business/ai-generate-panel';

const ACTS = ['第一幕 · 开场', '第二幕 · 发展', '第三幕 · 高潮', '第四幕 · 转折', '第五幕 · 结局'];

const statusCfg: Record<string, { color: string; label: string; bg: string }> = {
  DRAFT: { color: 'text-gray-400', label: '草稿', bg: 'bg-gray-500/20' },
  IN_PROGRESS: { color: 'text-yellow-400', label: '编写中', bg: 'bg-yellow-500/20' },
  COMPLETED: { color: 'text-green-400', label: '已完成', bg: 'bg-green-500/20' },
};

interface SceneData {
  id: string;
  title: string;
  description: string;
  dialogue: string;
  duration: string;
  status: string;
  actId: number;
}

interface ActGroup {
  id: number;
  title: string;
  scenes: SceneData[];
}

export default function ScriptEditorClient() {
  const { id } = useParams<{ id: string }>();
  const [activeAct, setActiveAct] = useState(0);
  const [editingScene, setEditingScene] = useState<string | null>(null);
  const [showAi, setShowAi] = useState(false);
  const [editContent, setEditContent] = useState('');
  const [acts, setActs] = useState<ActGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [projectTitle, setProjectTitle] = useState('剧本');
  const [error, setError] = useState('');

  // 加载场景数据
  useEffect(() => {
    async function loadScenes() {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('token');
        const [projectRes, scenesRes] = await Promise.all([
          fetch(`/api/projects/${id}`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`/api/scenes?projectId=${id}`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        if (projectRes.ok) {
          const project = await projectRes.json();
          setProjectTitle(project.title || '剧本');
        }

        if (scenesRes.ok) {
          const scenes: SceneData[] = await scenesRes.json();
          // 将场景按幕分组
          const grouped = groupScenesIntoActs(scenes);
          setActs(grouped.length > 0 ? grouped : createEmptyActs());
        } else {
          setActs(createEmptyActs());
        }
      } catch {
        setActs(createEmptyActs());
        setError('加载失败，显示默认结构');
      } finally {
        setLoading(false);
      }
    }
    if (id) loadScenes();
  }, [id]);

  const startEdit = (scene: SceneData) => {
    setEditingScene(scene.id);
    setEditContent(scene.dialogue || scene.description || '');
  };

  const cancelEdit = () => setEditingScene(null);

  const saveEdit = async (sceneId: string) => {
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/scenes`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ id: sceneId, dialogue: editContent, status: 'IN_PROGRESS' }),
      });
      if (res.ok) {
        // 本地更新状态
        setActs(prev => prev.map(act => ({
          ...act,
          scenes: act.scenes.map(s =>
            s.id === sceneId ? { ...s, dialogue: editContent, status: 'IN_PROGRESS' } : s
          ),
        })));
      }
    } catch { /* 静默 */ }
    setEditingScene(null);
    setSaving(false);
  };

  const handleAiApply = (content: string) => {
    if (editingScene) {
      setEditContent(prev => prev + '\n' + content);
    }
    setShowAi(false);
  };

  const currentAct = acts[activeAct];
  const totalScenes = acts.reduce((sum, act) => sum + act.scenes.length, 0);
  const completedScenes = acts.reduce((sum, act) => sum + act.scenes.filter(s => s.status === 'COMPLETED').length, 0);

  // 加载中骨架屏
  if (loading) {
    return (
      <div className="space-y-4 p-6">
        <CardSkeleton /><CardSkeleton /><CardSkeleton />
      </div>
    );
  }

  // 空状态
  if (totalScenes === 0 && !loading) {
    return (
      <div>
        <PageHeader title="剧本编辑器" subtitle={projectTitle} />
        <GlassCard className="text-center py-16">
          <div className="text-5xl mb-4">📝</div>
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">还没有场景</h3>
          <p className="text-sm text-[var(--text-muted)] mb-6">创建场景后即可在此编辑剧本</p>
          <Link href={`/dashboard/projects/${id}/scenes`}>
            <GradientBtn>去创建场景</GradientBtn>
          </Link>
        </GlassCard>
      </div>
    );
  }

  return (
    <div>
      {/* 面包屑 */}
      <div className="flex items-center gap-2 text-sm text-[var(--text-muted)] mb-2">
        <Link href="/dashboard/projects" className="hover:text-[var(--text-primary)] transition-colors">项目</Link>
        <span>/</span>
        <Link href={`/dashboard/projects/${id}`} className="hover:text-[var(--text-primary)] transition-colors">{projectTitle}</Link>
        <span>/</span>
        <span className="text-[var(--text-primary)]">剧本</span>
      </div>

      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <PageHeader title="剧本编辑器" subtitle={projectTitle} />
        <div className="flex items-center gap-2">
          <span className="text-xs text-[var(--text-muted)]">{completedScenes}/{totalScenes} 场景完成</span>
          <GradientBtn onClick={() => setShowAi(!showAi)}>
            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            AI 续写
          </GradientBtn>
        </div>
      </div>

      {/* 错误提示 */}
      {error && (
        <div className="mb-4 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-lg text-sm text-red-400">
          {error}
        </div>
      )}

      {/* AI 面板 */}
      {showAi && (
        <div className="mb-6">
          <AiGeneratePanel
            type="script"
            title="AI 剧本助手"
            description={`为「${projectTitle}」续写剧本内容`}
            loading={false}
            onGenerate={async (prompt) => {
              const token = localStorage.getItem('token');
              try {
                const res = await fetch('/api/ai/generate', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                  body: JSON.stringify({ type: 'outline', params: { topic: prompt, genre: '短剧' } }),
                });
                if (res.ok) {
                  const data = await res.json();
                  handleAiApply(data.content || '');
                }
              } catch { /* 静默 */ }
            }}
          />
        </div>
      )}

      {/* 幕导航 */}
      <div className="flex gap-1 mb-6 overflow-x-auto pb-1">
        {acts.map((act, i) => (
          <button
            key={act.id}
            onClick={() => setActiveAct(i)}
            className={`px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
              activeAct === i
                ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/20'
                : 'bg-[var(--surface-elevated)] text-[var(--text-secondary)] hover:bg-[var(--surface-overlay)] hover:text-[var(--text-primary)]'
            }`}
          >
            {act.title}
          </button>
        ))}
      </div>

      {/* 场景列表 */}
      <div className="space-y-3">
        {currentAct?.scenes.map((scene) => {
          const st = statusCfg[scene.status] || statusCfg.DRAFT;
          const isEditing = editingScene === scene.id;

          return (
            <GlassCard key={scene.id} hover={!isEditing}>
              {!isEditing ? (
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    scene.status === 'COMPLETED' ? 'bg-[#00d4aa]/20 text-[#00d4aa]' :
                    scene.status === 'IN_PROGRESS' ? 'bg-brand-500/20 text-brand-500' :
                    'bg-[var(--surface-elevated)] text-[var(--text-muted)]'
                  }`}>
                    {scene.id.slice(-2)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-[var(--text-primary)]">{scene.title}</h4>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${st.bg} ${st.color}`}>
                        {st.label}
                      </span>
                    </div>
                    <p className="text-sm text-[var(--text-secondary)] mb-2">{scene.description}</p>
                    {scene.dialogue && (
                      <div className="bg-brand-500/5 border-l-2 border-brand-500/30 rounded-r-lg p-3 text-sm text-[var(--text-secondary)] italic">
                        &ldquo;{scene.dialogue}&rdquo;
                      </div>
                    )}
                    <div className="flex items-center gap-4 mt-2 text-xs text-[var(--text-muted)]">
                      <span>⏱ {scene.duration || '未设定'}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button onClick={() => startEdit(scene)} className="p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-elevated)] rounded-lg transition-colors" title="编辑">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <h4 className="font-semibold text-[var(--text-primary)] mb-3">{scene.title}</h4>
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    rows={5}
                    className="w-full bg-[var(--surface-ground)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-primary)] px-3 py-2.5 text-sm focus:outline-none focus:border-brand-500 transition-colors resize-none mb-3"
                    autoFocus
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[var(--text-muted)]">{editContent.length} 字</span>
                    <div className="flex gap-2">
                      <button onClick={cancelEdit} className="px-4 py-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] bg-[var(--surface-elevated)] rounded-lg hover:bg-[var(--surface-overlay)] transition-colors">
                        取消
                      </button>
                      <GradientBtn onClick={() => saveEdit(scene.id)} loading={saving}>保存</GradientBtn>
                    </div>
                  </div>
                </div>
              )}
            </GlassCard>
          );
        })}

        {(!currentAct || currentAct.scenes.length === 0) && (
          <GlassCard className="text-center py-12">
            <p className="text-[var(--text-muted)]">当前幕还没有场景</p>
          </GlassCard>
        )}
      </div>
    </div>
  );
}

// 将场景列表按幕分组
function groupScenesIntoActs(scenes: SceneData[]): ActGroup[] {
  const map = new Map<number, SceneData[]>();
  scenes.forEach(s => {
    const actId = s.actId || 1;
    if (!map.has(actId)) map.set(actId, []);
    map.get(actId)!.push(s);
  });
  return Array.from(map.entries())
    .sort(([a], [b]) => a - b)
    .map(([id, scenes]) => ({ id, title: ACTS[id - 1] || `第${id}幕`, scenes }));
}

// 空结构（无数据时使用）
function createEmptyActs(): ActGroup[] {
  return ACTS.map((title, i) => ({ id: i + 1, title, scenes: [] }));
}
