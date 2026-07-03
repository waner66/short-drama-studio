'use client';

import { useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import PageHeader from '@/components/ui/page-header';
import GlassCard from '@/components/ui/glass-card';
import GradientBtn from '@/components/ui/gradient-btn';
import StatCardEnhanced from '@/components/ui/stat-card-enhanced';
import NeonText from '@/components/ui/neon-text';
import FloatingElements from '@/components/ui/floating-elements';
import SceneTimelineVisual, { type TimelineScene } from '@/components/business/scene-timeline-visual';
import AiGeneratePanel from '@/components/business/ai-generate-panel';

// ─── mood config ──────────────────────────────────────────
const MOOD_CONFIG: Record<string, { color: string; bg: string; emoji: string }> = {
  '紧张': { color: '#ef4444', bg: 'rgba(239,68,68,0.12)', emoji: '😰' },
  '压抑': { color: '#f97316', bg: 'rgba(249,115,22,0.12)', emoji: '😞' },
  '惊恐': { color: '#dc2626', bg: 'rgba(220,38,38,0.12)', emoji: '😱' },
  '迷茫': { color: '#9ca3af', bg: 'rgba(156,163,175,0.12)', emoji: '😶' },
  '震惊': { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', emoji: '😲' },
  '佩服': { color: '#22c55e', bg: 'rgba(34,197,94,0.12)', emoji: '👏' },
  '好奇': { color: '#06b6d4', bg: 'rgba(6,182,212,0.12)', emoji: '🤔' },
  '试探': { color: '#a78bfa', bg: 'rgba(167,139,250,0.12)', emoji: '🕵️' },
  '热血': { color: '#ef4444', bg: 'rgba(239,68,68,0.12)', emoji: '🔥' },
  '振奋': { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', emoji: '💪' },
  '温馨': { color: '#ec4899', bg: 'rgba(236,72,153,0.12)', emoji: '💕' },
  '甜蜜': { color: '#f472b6', bg: 'rgba(244,114,182,0.12)', emoji: '💖' },
};

function getMoodConfig(emotion: string) {
  // Split comma-separated emotions, pick first match
  const emotions = emotion.split(/[,，、]/).map((e) => e.trim());
  for (const e of emotions) {
    for (const [key, cfg] of Object.entries(MOOD_CONFIG)) {
      if (e.includes(key)) return { ...cfg, label: e };
    }
  }
  return { color: '#8b5cf6', bg: 'rgba(139,92,246,0.12)', emoji: '🎭', label: emotions[0] || '未知' };
}

const statusCfg: Record<string, { color: string; label: string; bg: string }> = {
  DRAFT: { color: 'text-gray-400', label: '草稿', bg: 'bg-gray-500/20' },
  IN_PROGRESS: { color: 'text-yellow-400', label: '制作中', bg: 'bg-yellow-500/20' },
  COMPLETED: { color: 'text-green-400', label: '完成', bg: 'bg-green-500/20' },
};

const SCENE_AI_TAGS = ['玄幻穿越', '都市爱情', '古装权谋', '悬疑惊悚', '甜宠搞笑'];

// ─── mock data ─────────────────────────────────────────────
const initialScenes = [
  { id: '1', number: 1, title: '现代办公室', location: '苏氏集团 · 总裁办公室', time: '白天', description: '苏晚晴在办公室处理公司事务，竞争对手暗中布局。主要展现女主职场精英形象。', emotion: '紧张、压抑', props: ['办公桌', '电脑', '文件夹', '咖啡杯'], characterIds: ['1'], duration: '2分钟', status: 'IN_PROGRESS' as const, storyboardCount: 3, characters: ['苏晚晴'] },
  { id: '2', number: 2, title: '意外穿越', location: '城市高架桥', time: '夜晚', description: '苏晚晴遭遇车祸后穿越到古代。玄幻感强烈的转场，从现代到古代的视觉冲击。', emotion: '惊恐、迷茫', props: ['红色跑车', '手机', '现代服装'], characterIds: ['1'], duration: '1.5分钟', status: 'COMPLETED' as const, storyboardCount: 5, characters: ['苏晚晴'] },
  { id: '3', number: 3, title: '古代商行', location: '苏家商行', time: '上午', description: '苏晚晴在父亲商行中初次展示现代商业理念，令众人目瞪口呆。', emotion: '震惊、佩服', props: ['算盘', '账本', '古代铜钱'], characterIds: ['1', '2'], duration: '2分钟', status: 'DRAFT' as const, storyboardCount: 0, characters: ['苏晚晴', '慕容瑾'] },
  { id: '4', number: 4, title: '初次交锋', location: '江南茶楼', time: '午后', description: '在茶楼偶遇神秘富商慕容瑾，两人商业理念碰撞，言辞交锋。', emotion: '好奇、试探', props: ['茶具', '扇子', '古琴'], characterIds: ['1', '2'], duration: '2.5分钟', status: 'DRAFT' as const, storyboardCount: 0, characters: ['苏晚晴', '慕容瑾'] },
  { id: '5', number: 5, title: '商业对决', location: '江南商会 · 大厅', time: '上午', description: '苏晚晴用现代商业理念击败老派对手，一鸣惊人。全场高潮。', emotion: '热血、振奋', props: ['商会令牌', '契约书', '毛笔'], characterIds: ['1', '2', '3'], duration: '3分钟', status: 'DRAFT' as const, storyboardCount: 0, characters: ['苏晚晴', '慕容瑾', '柳如烟'] },
];

// ─── flowing line animation CSS ────────────────────────────
const FLOW_LINE_STYLE = `
@keyframes flowDash {
  0% { stroke-dashoffset: 24; }
  100% { stroke-dashoffset: 0; }
}
.flow-line {
  stroke-dasharray: 8 16;
  animation: flowDash 2s linear infinite;
}
`;

// ==================== MAIN ==================================
export default function ScenesClient() {
  const { id } = useParams<{ id: string }>();
  const [scenes, setScenes] = useState(initialScenes);
  const [showAi, setShowAi] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<string | null>(null);
  const [showTimeline, setShowTimeline] = useState(true);
  const [hoveredSceneId, setHoveredSceneId] = useState<string | null>(null);

  const completedCount = scenes.filter((s) => s.status === 'COMPLETED').length;
  const totalDuration = scenes.reduce((sum, s) => {
    const mins = parseFloat(s.duration);
    return sum + (isNaN(mins) ? 0 : mins);
  }, 0);
  const totalStoryboards = scenes.reduce((sum, s) => sum + s.storyboardCount, 0);

  const handleReorder = useCallback((fromIdx: number, toIdx: number) => {
    setScenes((prev) => {
      const arr = [...prev];
      const [removed] = arr.splice(fromIdx, 1);
      arr.splice(toIdx, 0, removed);
      return arr.map((s, i) => ({ ...s, number: i + 1 }));
    });
  }, []);

  const handleAiGenerateScene = (prompt: string) => {
    if (!prompt.trim()) return;
    setAiLoading(true);
    setTimeout(() => {
      const isNight = prompt.includes('夜') || prompt.includes('晚上');
      const locationMap: Record<string, { title: string; location: string; props: string[]; emotion: string }> = {
        '玄幻': { title: '初入异界', location: '幻境之门', props: ['灵器', '卷轴', '丹药'], emotion: '震撼、好奇' },
        '都市': { title: '高楼对决', location: 'CBD天台', props: ['手机', '文件', '咖啡杯'], emotion: '紧张、刺激' },
        '古装': { title: '朝堂辩论', location: '金銮殿', props: ['奏章', '玉佩', '毛笔'], emotion: '严肃、激昂' },
        '悬疑': { title: '深夜追踪', location: isNight ? '废弃工厂' : '昏暗小巷', props: ['手电筒', '证据袋', '对讲机'], emotion: '紧张、恐惧' },
        '甜宠': { title: '甜蜜邂逅', location: '音乐咖啡厅', props: ['咖啡', '吉他', '书信'], emotion: '甜蜜、温馨' },
      };
      let map = locationMap['都市'];
      for (const [key, val] of Object.entries(locationMap)) {
        if (prompt.includes(key)) { map = val; break; }
      }
      const newScene = {
        id: String(Date.now()),
        number: scenes.length + 1,
        title: map.title,
        location: map.location,
        time: isNight ? '夜晚' : '白天',
        description: prompt,
        emotion: map.emotion,
        props: map.props,
        characterIds: [],
        duration: '2分钟',
        status: 'DRAFT' as const,
        storyboardCount: 0,
        characters: [],
      };
      setScenes((prev) => [...prev, newScene]);
      setAiResult(`场景${scenes.length + 1}: ${map.title}\n📍 ${map.location} · ${isNight ? '夜晚' : '白天'}\n💭 ${map.emotion}\n\n${prompt}\n\n🎬 AI已为你生成新场景，请继续编辑细节。`);
      setAiLoading(false);
    }, 1200);
  };

  // Convert to TimelineScene
  const timelineScenes: TimelineScene[] = scenes.map((s) => ({
    id: s.id,
    title: s.title,
    location: s.location,
    time: s.time,
    mood: s.emotion.split(/[,，、]/)[0]?.trim(),
    characters: s.characters,
    summary: s.description,
    order: s.number,
  }));

  return (
    <div className="relative min-h-screen">
      <style>{FLOW_LINE_STYLE}</style>
      <FloatingElements density="low" emojis={['🎬', '🎥', '📍', '🎭', '🌟']} />

      {/* Breadcrumb */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-2 text-sm text-gray-500 mb-2 relative z-10"
      >
        <Link href="/dashboard/projects" className="hover:text-white transition-colors">项目</Link>
        <span>/</span>
        <Link href={`/dashboard/projects/${id}`} className="hover:text-white transition-colors">穿越之我在古代当总裁</Link>
        <span>/</span>
        <span className="text-white">场景</span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex items-center justify-between mb-6 flex-wrap gap-3 relative z-10"
      >
        <PageHeader
          title={
            <NeonText as="span" color="var(--brand-400)" glowColor="#06b6d4" pulse>
              场景管理
            </NeonText>
          }
        />
        <div className="flex items-center gap-2">
          <GradientBtn
            onClick={() => setShowTimeline(!showTimeline)}
            variant={showTimeline ? 'secondary' : undefined}
          >
            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {showTimeline ? '隐藏时间轴' : '时间轴概览'}
          </GradientBtn>
          <GradientBtn onClick={() => setShowAi(!showAi)} variant={showAi ? 'secondary' : undefined}>
            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            AI 生成场景
          </GradientBtn>
        </div>
      </motion.div>

      {/* AI Panel */}
      <AnimatePresence>
        {showAi && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 overflow-hidden relative z-10"
          >
            <AiGeneratePanel
              type="scene"
              title="AI 场景生成器"
              description="描述你想要的场景氛围和情节，AI 自动生成场景设定"
              placeholder="例：深夜废弃工厂，主角在黑暗中寻找关键证据，气氛紧张..."
              quickTags={SCENE_AI_TAGS}
              loading={aiLoading}
              onGenerate={handleAiGenerateScene}
              lastResult={aiResult || undefined}
              onApply={() => setShowAi(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats Row */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 relative z-10"
      >
        <StatCardEnhanced title="场景总数" value={scenes.length} icon="🎬" accent="#06b6d4" size="sm" />
        <StatCardEnhanced title="已完成" value={completedCount} icon="✅" accent="#22c55e" size="sm" suffix={`/${scenes.length}`} />
        <StatCardEnhanced title="总分镜" value={totalStoryboards} icon="🎞️" accent="#a855f7" size="sm" />
        <StatCardEnhanced title="总时长" value={totalDuration} icon="⏱️" accent="#f59e0b" size="sm" suffix="分钟" />
      </motion.div>

      {/* 3D Timeline Overview */}
      <AnimatePresence>
        {showTimeline && scenes.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 relative z-10"
          >
            <GlassCard heading="时间轴概览">
              <SceneTimelineVisual
                scenes={timelineScenes}
                onSceneClick={(s) => {
                  document.getElementById(`scene-${s.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }}
                onReorder={handleReorder}
              />
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scene list with drag reorder */}
      <Reorder.Group axis="y" values={scenes} onReorder={(items) => {
        setScenes(items.map((s, i) => ({ ...s, number: i + 1 })));
      }} className="space-y-4 relative z-10">
        {scenes.map((scene, i) => {
          const st = statusCfg[scene.status];
          const mood = getMoodConfig(scene.emotion);
          const isLast = i === scenes.length - 1;

          return (
            <Reorder.Item key={scene.id} value={scene} id={`scene-${scene.id}`}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.06, duration: 0.4 }}
                className="flex gap-3 group/scene"
                onMouseEnter={() => setHoveredSceneId(scene.id)}
                onMouseLeave={() => setHoveredSceneId(null)}
              >
                {/* Timeline node with flowing line */}
                <div className="flex flex-col items-center flex-shrink-0 pt-1">
                  <motion.div
                    whileHover={{ scale: 1.2 }}
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      scene.status === 'COMPLETED'
                        ? 'bg-gradient-to-br from-green-400 to-emerald-500 text-black shadow-lg shadow-green-500/30'
                        : scene.status === 'IN_PROGRESS'
                        ? 'bg-gradient-to-br from-brand-500 to-purple-500 text-white shadow-lg shadow-brand-500/30 animate-pulse'
                        : 'bg-white/10 text-gray-400'
                    }`}
                    style={{
                      animationDuration: '3s',
                      boxShadow: scene.status === 'IN_PROGRESS'
                        ? '0 0 16px rgba(139, 92, 246, 0.4)'
                        : undefined,
                    }}
                  >
                    {scene.status === 'COMPLETED' ? '✓' : scene.number}
                  </motion.div>
                  {!isLast && (
                    <div className="relative w-px flex-1 min-h-[20px] my-0.5">
                      <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                        <line
                          x1="0" y1="0" x2="0" y2="100%"
                          className="flow-line"
                          stroke="rgba(139,92,246,0.3)"
                          strokeWidth="1.5"
                          vectorEffect="non-scaling-stroke"
                        />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Card */}
                <GlassCard hover className="flex-1 pb-6 relative overflow-hidden">
                  {/* Left gradient accent bar (mood color) */}
                  <div
                    className="absolute left-0 top-0 bottom-0 w-1 transition-all duration-300 group-hover/scene:w-1.5"
                    style={{ background: `linear-gradient(180deg, ${mood.color}, ${mood.color}40)` }}
                  />

                  <div className="flex items-start justify-between mb-3 ml-1">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-white">场景{scene.number}: {scene.title}</h3>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${st.bg} ${st.color}`}>
                          {st.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {scene.location}
                        </span>
                        <span>{scene.time}</span>
                        <span>{scene.duration}</span>
                      </div>
                    </div>

                    {/* Drag handle */}
                    <div className="cursor-grab active:cursor-grabbing text-gray-600 hover:text-gray-400 p-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M7 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM7 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM7 14a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 14a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" />
                      </svg>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-400 mb-3 ml-1">{scene.description}</p>

                  {/* Characters */}
                  <div className="flex items-center gap-1.5 mb-3 ml-1 flex-wrap">
                    <span className="text-xs text-gray-600">角色:</span>
                    {scene.characters.map((name) => (
                      <span key={name} className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-gray-300">{name}</span>
                    ))}
                    <button className="text-xs text-brand-400 hover:text-brand-300 transition-colors">+ 添加</button>
                  </div>

                  {/* Props */}
                  <div className="flex items-center gap-1.5 mb-3 ml-1 flex-wrap">
                    <span className="text-xs text-gray-600">道具:</span>
                    {scene.props.map((prop) => (
                      <motion.span
                        key={prop}
                        whileHover={{ scale: 1.1, y: -1 }}
                        className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-gray-500 cursor-default"
                      >{prop}</motion.span>
                    ))}
                  </div>

                  {/* Emotion badges */}
                  <div className="flex items-center gap-1.5 mb-3 ml-1 flex-wrap">
                    <span className="text-xs text-gray-600">情绪:</span>
                    {scene.emotion.split(/[,，、]/).map((e) => {
                      const emo = e.trim();
                      if (!emo) return null;
                      const cfg = Object.entries(MOOD_CONFIG).find(([k]) => emo.includes(k));
                      const color = cfg ? cfg[1].color : '#8b5cf6';
                      const bg = cfg ? cfg[1].bg : 'rgba(139,92,246,0.12)';
                      return (
                        <span
                          key={emo}
                          className="text-xs px-2 py-0.5 rounded-full transition-all hover:scale-110 cursor-default"
                          style={{ backgroundColor: bg, color, border: `1px solid ${color}30` }}
                        >
                          {cfg ? cfg[1].emoji : '🎭'} {emo}
                        </span>
                      );
                    })}
                  </div>

                  {/* Action bar */}
                  <div className="flex items-center justify-between pt-3 border-t border-white/5 ml-1">
                    <Link
                      href={`/dashboard/projects/${id}/storyboard`}
                      className="text-sm text-brand-400 hover:text-brand-300 transition-colors flex items-center gap-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v5a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 16a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1v-2zM14 16a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1h-4a1 1 0 01-1-1v-2z" />
                      </svg>
                      编辑分镜 ({scene.storyboardCount})
                    </Link>
                    <div className="flex gap-1">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </motion.button>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            </Reorder.Item>
          );
        })}
      </Reorder.Group>
    </div>
  );
}
