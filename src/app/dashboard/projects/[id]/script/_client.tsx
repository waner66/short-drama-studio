'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import PageHeader from '@/components/ui/page-header';
import GlassCard from '@/components/ui/glass-card';
import GradientBtn from '@/components/ui/gradient-btn';
import { CardSkeleton } from '@/components/ui/loading-skeleton';
import AiGeneratePanel from '@/components/business/ai-generate-panel';
import ScriptFlipbook from '@/components/business/script-flipbook';
import NeonText from '@/components/ui/neon-text';
import ParticleBg from '@/components/ui/particle-bg';
import GlowTrail from '@/components/ui/glow-trail';
import FloatingElements from '@/components/ui/floating-elements';

const ACTS = ['开场', '发展', '高潮', '转折', '结局'];

const statusCfg: Record<string, { color: string; label: string; bg: string }> = {
  DRAFT: { color: 'text-gray-400', label: '草稿', bg: 'bg-gray-500/20' },
  IN_PROGRESS: { color: 'text-yellow-400', label: '编写中', bg: 'bg-yellow-500/20' },
  COMPLETED: { color: 'text-green-400', label: '已完成', bg: 'bg-green-500/20' },
};

// Chat bubble emotion config
const emotionColors: Record<string, string> = {
  '开心': '#f59e0b',
  '愤怒': '#ef4444',
  '悲伤': '#3b82f6',
  '紧张': '#8b5cf6',
  '平静': '#10b981',
  '惊讶': '#ec4899',
  '温柔': '#f472b6',
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

// Parse dialogue into chat bubble format
function parseDialogueToChats(dialogue: string): { character: string; text: string; emotion?: string }[] {
  if (!dialogue) return [];
  const lines = dialogue.split('\n').filter(l => l.trim());
  const chats: { character: string; text: string; emotion?: string }[] = [];

  for (const line of lines) {
    const match = line.match(/^(.+?)[：:]\s*(.+)$/);
    if (match) {
      const rawName = match[1].trim();
      // Check for emotion tag like "角色名(开心)"
      const emoMatch = rawName.match(/^(.+?)\((.+?)\)$/);
      chats.push({
        character: emoMatch ? emoMatch[1] : rawName,
        text: match[2].trim(),
        emotion: emoMatch ? emoMatch[2] : undefined,
      });
    } else {
      if (chats.length > 0 && chats[chats.length - 1].character) {
        chats[chats.length - 1].text += '\n' + line;
      } else {
        chats.push({ character: '', text: line });
      }
    }
  }
  return chats;
}

// Convert scenes to flipbook pages
function scenesToPages(scenes: SceneData[]) {
  return scenes.map((scene, idx) => {
    const chats = parseDialogueToChats(scene.dialogue);
    const firstChat = chats.length > 0 ? chats[0] : null;
    return {
      id: scene.id,
      title: scene.title,
      content: scene.dialogue || scene.description || '',
      type: (scene.dialogue ? 'dialogue' : 'narration') as 'dialogue' | 'narration',
      character: firstChat?.character || scene.title,
      emotion: scene.status === 'COMPLETED' ? '已完成' : scene.status === 'IN_PROGRESS' ? '编写中' : '草稿',
    };
  });
}

// Animated word count component
function AnimatedWordCount({ count, className = '' }: { count: number; className?: string }) {
  const [display, setDisplay] = useState(0);
  const prevCount = useRef(0);

  useEffect(() => {
    prevCount.current = display;
    const diff = count - prevCount.current;
    if (diff === 0) return;

    const steps = Math.min(Math.abs(diff), 30);
    const stepSize = diff / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      if (step >= steps) {
        setDisplay(count);
        clearInterval(timer);
      } else {
        setDisplay(Math.round(prevCount.current + stepSize * step));
      }
    }, 50);

    return () => clearInterval(timer);
  }, [count]);

  return (
    <motion.span
      key={count}
      initial={{ scale: 1.3, color: 'var(--brand-400)' }}
      animate={{ scale: 1, color: 'var(--text-secondary)' }}
      className={className}
    >
      {display.toLocaleString()}
    </motion.span>
  );
}

// Clapperboard scene card
function ClapperboardCard({ scene, onEdit }: { scene: SceneData; onEdit: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative"
    >
      {/* Clapperboard top bar */}
      <div className="absolute -top-3 left-4 right-4 h-6 bg-gradient-to-r from-[#1a1a2e] to-[#16213e] rounded-t-lg border border-white/10 flex items-center px-3">
        <div className="flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5 text-brand-400" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15l-5-5 1.41-1.41L11 14.17l5.59-5.59L18 10l-7 7z"/>
          </svg>
          <span className="text-xs text-white/70 font-mono tabular-nums">
            场景 {scene.id.slice(-4).toUpperCase()}
          </span>
        </div>
        <div className="flex items-center gap-1.5 ml-auto">
          <span className="text-xs text-white/50">TAKE</span>
          <span className="text-xs text-brand-400 font-bold">1</span>
        </div>
      </div>

      {/* Clapperboard body */}
      <GlassCard className="pt-6">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex-1">
            <h4 className="text-base font-bold text-[var(--text-primary)] mb-1">
              {scene.title}
            </h4>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              {scene.description || '暂无场景描述'}
            </p>
          </div>
          <span className={`shrink-0 text-xs px-2.5 py-1 rounded-full ${statusCfg[scene.status]?.bg || statusCfg.DRAFT.bg} ${statusCfg[scene.status]?.color || statusCfg.DRAFT.color}`}>
            {statusCfg[scene.status]?.label || '草稿'}
          </span>
        </div>

        {/* Duration & meta */}
        <div className="flex items-center gap-4 text-xs text-[var(--text-muted)] mb-3">
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {scene.duration || '未设定'}
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
            {(scene.dialogue || scene.description || '').length} 字
          </span>
        </div>

        {/* Action */}
        <button
          onClick={onEdit}
          className="w-full py-2.5 rounded-lg bg-brand-500/10 border border-brand-500/20 text-brand-400 text-sm font-medium
            hover:bg-brand-500/20 hover:border-brand-500/30 transition-all flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
          编辑剧本
        </button>
      </GlassCard>
    </motion.div>
  );
}

// Chat bubble component for dialogue display
function ChatBubbles({ dialogue }: { dialogue: string }) {
  const chats = parseDialogueToChats(dialogue);
  if (chats.length === 0) return null;

  return (
    <div className="space-y-3 mb-4">
      {chats.map((chat, i) => {
        const isLeft = i % 2 === 0; // alternate left/right
        const emoColor = chat.emotion ? emotionColors[chat.emotion] : undefined;

        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: isLeft ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08, duration: 0.3 }}
            className={`flex ${isLeft ? 'justify-start' : 'justify-end'}`}
          >
            <div className={`max-w-[75%] ${isLeft ? '' : 'items-end'}`}>
              {/* Avatar + name */}
              {chat.character && (
                <div className={`flex items-center gap-2 mb-1 ${isLeft ? '' : 'flex-row-reverse'}`}>
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{
                      background: (emoColor || '#6366f1') + '30',
                      color: emoColor || '#818cf8',
                    }}
                  >
                    {chat.character[0]}
                  </div>
                  <span className="text-xs font-medium text-[var(--text-secondary)]">
                    {chat.character}
                    {chat.emotion && (
                      <span className="ml-1 opacity-70">· {chat.emotion}</span>
                    )}
                  </span>
                </div>
              )}

              {/* Bubble */}
              <div
                className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  isLeft
                    ? 'bg-[var(--surface-elevated)] text-[var(--text-primary)] rounded-tl-sm'
                    : 'bg-brand-500/15 text-[var(--text-primary)] rounded-tr-sm border border-brand-500/20'
                }`}
                style={emoColor ? { borderLeftColor: emoColor, borderLeftWidth: isLeft ? '3px' : undefined } : undefined}
              >
                {chat.text}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
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
  const [viewMode, setViewMode] = useState<'flipbook' | 'list'>('flipbook');
  const [flipKey, setFlipKey] = useState(0);

  // Load scenes
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

  // Act switching resets flipbook
  const handleActChange = (i: number) => {
    if (i === activeAct) return;
    setActiveAct(i);
    setFlipKey(prev => prev + 1);
    setEditingScene(null);
  };

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
        setActs(prev => prev.map(act => ({
          ...act,
          scenes: act.scenes.map(s =>
            s.id === sceneId ? { ...s, dialogue: editContent, status: 'IN_PROGRESS' } : s
          ),
        })));
      }
    } catch { /* silent */ }
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
  const flipbookPages = currentAct ? scenesToPages(currentAct.scenes) : [];
  const totalScenes = acts.reduce((sum, act) => sum + act.scenes.length, 0);
  const completedScenes = acts.reduce((sum, act) => sum + act.scenes.filter(s => s.status === 'COMPLETED').length, 0);
  const totalWords = acts.reduce((sum, act) =>
    sum + act.scenes.reduce((s, scene) => s + (scene.dialogue || scene.description || '').length, 0), 0
  );

  // Loading
  if (loading) {
    return (
      <div className="space-y-4 p-6">
        <CardSkeleton /><CardSkeleton /><CardSkeleton />
      </div>
    );
  }

  // Empty
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
    <>
      {/* Background effects */}
      <ParticleBg particleCount={35} />
      <GlowTrail />
      <FloatingElements
        count={6}
        emojis={['📝', '🎬', '💬', '⭐', '✨', '📖', '🎭']}
      />

      <div className="relative z-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-[var(--text-muted)] mb-2">
          <Link href="/dashboard/projects" className="hover:text-[var(--text-primary)] transition-colors">项目</Link>
          <span>/</span>
          <Link href={`/dashboard/projects/${id}`} className="hover:text-[var(--text-primary)] transition-colors">{projectTitle}</Link>
          <span>/</span>
          <span className="text-[var(--text-primary)]">剧本</span>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <NeonText as="h1" pulse glowColor="var(--brand-400)" className="text-2xl font-bold">
              剧本编辑器
            </NeonText>
            <p className="text-sm text-[var(--text-muted)] mt-1">{projectTitle}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs">
              <span className="flex items-center gap-1 text-[var(--text-muted)]">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                {completedScenes}/{totalScenes}
              </span>
              <span className="flex items-center gap-1 text-brand-400 font-semibold tabular-nums">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <AnimatedWordCount count={totalWords} /> 字
              </span>
            </div>
            <GradientBtn onClick={() => setShowAi(!showAi)}>
              <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              AI 续写
            </GradientBtn>
          </div>
        </div>

        {/* Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-lg text-sm text-red-400"
          >
            {error}
          </motion.div>
        )}

        {/* AI Panel */}
        <AnimatePresence>
          {showAi && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 overflow-hidden"
            >
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
                  } catch { /* silent */ }
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-4 gap-3 mb-6"
        >
          <StatMini label="总场景" value={totalScenes} icon="🎬" />
          <StatMini label="已完成" value={completedScenes} icon="✅" color="var(--brand-green)" />
          <StatMini label="当前幕" value={currentAct?.scenes.length || 0} icon="📖" color="var(--brand-400)" />
          <StatMini label="总字数" value={totalWords} icon="📝" color="var(--brand-purple)" isAnimated />
        </motion.div>

        {/* Act Navigation */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`acts-${activeAct}`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-1.5 mb-6 overflow-x-auto pb-1"
          >
            {acts.map((act, i) => {
              const isActive = activeAct === i;
              const actScenes = act.scenes.length;
              const actCompleted = act.scenes.filter(s => s.status === 'COMPLETED').length;

              return (
                <motion.button
                  key={act.id}
                  onClick={() => handleActChange(i)}
                  className={`relative px-5 py-3 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/25 scale-105'
                      : 'bg-[var(--surface-elevated)] text-[var(--text-secondary)] hover:bg-[var(--surface-overlay)] hover:text-[var(--text-primary)]'
                }`}
              >
                {isActive ? (
                  <div className="flex flex-col items-center">
                    <NeonText color="#fff" pulse className="text-sm font-bold">{act.title}</NeonText>
                    <span className="text-[10px] opacity-80 mt-0.5">{actCompleted}/{actScenes} 完成</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <span>{act.title}</span>
                    {actScenes > 0 && (
                      <span className="text-[10px] text-[var(--text-muted)] mt-0.5">{actCompleted}/{actScenes}</span>
                    )}
                  </div>
                )}
              </motion.button>
            );
          })}
        </motion.div>
      </AnimatePresence>

      {/* View Mode Toggle */}
      <div className="flex items-center gap-2 mb-5">
        <button
          onClick={() => setViewMode('flipbook')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
            viewMode === 'flipbook'
              ? 'bg-brand-500/15 text-brand-400 border border-brand-500/30'
              : 'bg-[var(--surface-elevated)] text-[var(--text-muted)] border border-transparent hover:border-[var(--border-subtle)]'
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          翻书
        </button>
        <button
          onClick={() => setViewMode('list')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
            viewMode === 'list'
              ? 'bg-brand-500/15 text-brand-400 border border-brand-500/30'
              : 'bg-[var(--surface-elevated)] text-[var(--text-muted)] border border-transparent hover:border-[var(--border-subtle)]'
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
          列表
        </button>
      </div>

      {/* Content Area */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`act-${activeAct}-${viewMode}-${flipKey}`}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.35 }}
        >
          {viewMode === 'flipbook' ? (
            <div className="max-w-3xl mx-auto">
              {currentAct && currentAct.scenes.length > 0 ? (
                <>
                  <ScriptFlipbook key={flipKey} pages={flipbookPages} />
                  {/* Edit button for current scene */}
                  {currentAct.scenes.length > 0 && (
                    <div className="mt-4 flex justify-center">
                      <GradientBtn onClick={() => startEdit(currentAct.scenes[0])}>
                        <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                        编辑剧本
                      </GradientBtn>
                    </div>
                  )}
                </>
              ) : (
                <GlassCard className="text-center py-12">
                  <div className="text-4xl mb-3">📖</div>
                  <p className="text-[var(--text-muted)]">当前幕还没有场景</p>
                  <p className="text-xs text-[var(--text-muted)] mt-1">在&ldquo;场景&rdquo;页面创建场景后即可在此编辑</p>
                </GlassCard>
              )}
            </div>
          ) : (
            /* List view with enhanced scene cards */
            <div className="space-y-4">
              {currentAct?.scenes.map((scene, idx) => {
                const isEditing = editingScene === scene.id;
                return (
                  <motion.div
                    key={scene.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.06 }}
                  >
                    {isEditing ? (
                      <GlassCard>
                        <div className="flex items-start gap-4 mb-3">
                          <div className="shrink-0 w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                            </svg>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-[var(--text-primary)]">{scene.title}</h4>
                            <p className="text-xs text-[var(--text-muted)]">{scene.description || '编辑对话内容'}</p>
                          </div>
                        </div>

                        {/* Chat bubble preview of current edit content */}
                        <div className="mb-3 max-h-48 overflow-y-auto pr-1">
                          <ChatBubbles dialogue={editContent || ''} />
                        </div>

                        <textarea
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          rows={4}
                          className="w-full bg-[var(--surface-ground)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-primary)] px-3 py-2.5 text-sm focus:outline-none focus:border-brand-500 transition-colors resize-none mb-3"
                          placeholder="输入对话内容，格式：角色名：台词"
                          autoFocus
                        />

                        <div className="flex items-center justify-between">
                          <motion.span
                            key={editContent.length}
                            initial={{ scale: 1.2, opacity: 0.5 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="text-sm font-medium tabular-nums text-brand-400"
                          >
                            {editContent.length} 字
                          </motion.span>
                          <div className="flex gap-2">
                            <button
                              onClick={cancelEdit}
                              className="px-4 py-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] bg-[var(--surface-elevated)] rounded-lg hover:bg-[var(--surface-overlay)] transition-colors"
                            >
                              取消
                            </button>
                            <GradientBtn onClick={() => saveEdit(scene.id)} loading={saving}>保存</GradientBtn>
                          </div>
                        </div>
                      </GlassCard>
                    ) : (
                      /* Preview card */
                      <GlassCard hover>
                        <div className="flex items-start gap-4">
                          {/* Scene number badge */}
                          <div
                            className={`shrink-0 w-11 h-11 rounded-xl flex items-center justify-center text-sm font-bold border ${
                              scene.status === 'COMPLETED' ? 'bg-green-500/10 border-green-500/20 text-green-400' :
                              scene.status === 'IN_PROGRESS' ? 'bg-brand-500/10 border-brand-500/20 text-brand-400' :
                              'bg-[var(--surface-elevated)] border-[var(--border-subtle)] text-[var(--text-muted)]'
                            }`}
                          >
                            {idx + 1}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1.5">
                              <h4 className="font-semibold text-[var(--text-primary)] text-sm">
                                {scene.title}
                              </h4>
                              <span className={`text-[10px] px-2 py-0.5 rounded-full ${statusCfg[scene.status]?.bg || statusCfg.DRAFT.bg} ${statusCfg[scene.status]?.color || statusCfg.DRAFT.color}`}>
                                {statusCfg[scene.status]?.label || '草稿'}
                              </span>
                            </div>

                            {/* Scene description with clapperboard style */}
                            {scene.description && (
                              <div className="flex items-start gap-2 mb-2 p-2.5 rounded-lg bg-[var(--surface-ground)] border border-[var(--border-subtle)]">
                                <span className="shrink-0 text-sm mt-0.5">🎬</span>
                                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{scene.description}</p>
                              </div>
                            )}

                            {/* Chat bubble preview for dialogue */}
                            {scene.dialogue && (
                              <ChatBubbles dialogue={scene.dialogue} />
                            )}

                            <div className="flex items-center gap-3 text-[10px] text-[var(--text-muted)]">
                              <span className="flex items-center gap-1">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {scene.duration || '未设定'}
                              </span>
                              <span>{(scene.dialogue || scene.description || '').length} 字</span>
                            </div>
                          </div>

                          <button
                            onClick={() => { setShowAi(false); startEdit(scene); }}
                            className="shrink-0 p-2.5 text-[var(--text-muted)] hover:text-brand-400 hover:bg-brand-500/10 rounded-lg transition-all"
                            title="编辑"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                        </div>
                      </GlassCard>
                    )}
                  </motion.div>
                );
              })}

              {(!currentAct || currentAct.scenes.length === 0) && (
                <GlassCard className="text-center py-12">
                  <div className="text-4xl mb-3">📖</div>
                  <p className="text-[var(--text-muted)]">当前幕还没有场景</p>
                </GlassCard>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
    </>
  );
}

/* ---- Mini Stat Card ---- */
function StatMini({ label, value, icon, color, isAnimated }: {
  label: string;
  value: number;
  icon: string;
  color?: string;
  isAnimated?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.03, y: -2 }}
      className="surface-card border rounded-xl p-3 flex items-center gap-3 transition-all cursor-default"
    >
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
        style={{ background: (color || 'var(--brand-400)') + '15' }}
      >
        {icon}
      </div>
      <div>
        <div className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">{label}</div>
        <div
          className="text-lg font-bold tabular-nums"
          style={{ color: color || 'var(--text-primary)' }}
        >
          {isAnimated ? <AnimatedWordCount count={value} /> : value.toLocaleString()}
        </div>
      </div>
    </motion.div>
  );
}

/* ---- Helpers ---- */
function groupScenesIntoActs(scenes: SceneData[]): ActGroup[] {
  const map = new Map<number, SceneData[]>();
  scenes.forEach(s => {
    const actId = s.actId || 1;
    if (!map.has(actId)) map.set(actId, []);
    map.get(actId)!.push(s);
  });
  return Array.from(map.entries())
    .sort(([a], [b]) => a - b)
    .map(([id, scenes]) => ({ id, title: ACTS[id - 1] || '第' + id + '幕', scenes }));
}

function createEmptyActs(): ActGroup[] {
  return ACTS.map((title, i) => ({ id: i + 1, title, scenes: [] }));
}