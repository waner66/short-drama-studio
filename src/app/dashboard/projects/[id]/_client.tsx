'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import PageHeader from '@/components/ui/page-header';
import GlassCard from '@/components/ui/glass-card';
import GradientBtn from '@/components/ui/gradient-btn';
import StatCardEnhanced from '@/components/ui/stat-card-enhanced';
import TagGroup from '@/components/ui/tag-group';
import NeonText from '@/components/ui/neon-text';
import ParticleBg from '@/components/ui/particle-bg';
import FloatingElements from '@/components/ui/floating-elements';
import GlowTrail from '@/components/ui/glow-trail';
import CharacterRelationshipRing, { type CharNode, type RelationEdge } from '@/components/business/character-relationship-ring';
import WorldviewCanvas, { type WorldNode, type WorldEdge } from '@/components/business/worldview-canvas';
import AiGeneratePanel from '@/components/business/ai-generate-panel';

// ─── Tabs ──────────────────────────────────────────────────
const TABS = [
  { key: 'overview', label: '概览',   icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
  { key: 'script', label: '剧本',     icon: 'M9 4h6v2H9zm0 6h6v2H9zm0 6h6v2H9zM5 4h2v2H5zm0 6h2v2H5zm0 6h2v2H5z' },
  { key: 'scenes', label: '场景',     icon: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z' },
  { key: 'storyboard', label: '分镜', icon: 'M4 5a1 1 0 011-1h4a1 1 0 011 1v5a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 16a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1v-2zM14 16a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1h-4a1 1 0 01-1-1v-2z' },
  { key: 'worldview', label: '世界观', icon: 'M21 12a9 9 0 11-18 0 9 9 0 0118 0z M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z' },
];

// ─── mock data ─────────────────────────────────────────────
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

const mockCharacters: CharNode[] = [
  { id: '1', name: '苏晚晴', role: '女主', color: '#ec4899' },
  { id: '2', name: '慕容瑾', role: '男主', color: '#3b82f6' },
  { id: '3', name: '柳如烟', role: '女配', color: '#f59e0b' },
  { id: '4', name: '赵管家', role: '配角', color: '#22c55e' },
];

const mockRelations: RelationEdge[] = [
  { from: '1', to: '2', type: '恋爱' },
  { from: '3', to: '1', type: '敌对' },
  { from: '3', to: '2', type: '暗恋' },
  { from: '4', to: '1', type: '合作' },
  { from: '4', to: '2', type: '师生' },
];

const DEFAULT_CHAR_COLORS = ['#ec4899', '#3b82f6', '#f59e0b', '#22c55e', '#8b5cf6', '#f97316', '#06b6d4', '#ef4444'];

const recentActivity = [
  { action: '修改了第3幕剧本',  time: '10分钟前', user: '老大', icon: '📝' },
  { action: '添加了2个场景',    time: '1小时前',  user: '老大', icon: '🎬' },
  { action: 'AI 生成了分镜脚本', time: '3小时前',  user: 'AI',   icon: '🤖' },
  { action: '创建了角色「苏晚晴」', time: '昨天',   user: '老大', icon: '👤' },
  { action: '调整了世界观设定',  time: '2天前',    user: '老大', icon: '🌍' },
];

// ─── worldview mock data ──────────────────────────────────
const mockWorldNodes: WorldNode[] = [
  { id: 'c1', name: '苏晚晴',       type: 'character', x: 0.55, y: 0.25, color: '#ec4899', description: '现代女总裁，穿越到古代', tags: ['女主', '穿越者', '商业天才'], timeline: 0 },
  { id: 'c2', name: '慕容瑾',       type: 'character', x: 0.75, y: 0.4,  color: '#3b82f6', description: '古代世子，冷酷外表下的暖男', tags: ['男主', '世子', '深情'], timeline: 10 },
  { id: 'c3', name: '柳如烟',       type: 'character', x: 0.6,  y: 0.55, color: '#f59e0b', description: '女配，嫉妒女主', tags: ['女配', '反派', '嫉妒'], timeline: 20 },
  { id: 'c4', name: '赵管家',       type: 'character', x: 0.4,  y: 0.3,  color: '#22c55e', description: '苏府管家，忠心耿耿', tags: ['配角', '管家', '忠心'], timeline: 5 },
  { id: 's1', name: '苏府大院',     type: 'scene',      x: 0.35, y: 0.15, color: '#06b6d4', description: '第一幕主要场景', tags: ['苏府', '庭院', '日景'], timeline: 5 },
  { id: 's2', name: '京城商会',     type: 'scene',      x: 0.7,  y: 0.65, color: '#06b6d4', description: '商业谈判场景', tags: ['商会', '谈判', '白日'], timeline: 40 },
  { id: 's3', name: '郊外竹林',     type: 'scene',      x: 0.85, y: 0.2,  color: '#06b6d4', description: '男女主初次交心', tags: ['竹林', '夜景', '浪漫'], timeline: 60 },
  { id: 'e1', name: '穿越',         type: 'event',      x: 0.6,  y: 0.08, color: '#f97316', description: '女主穿越到古代', timeline: 0 },
  { id: 'e2', name: '商会比拼',     type: 'event',      x: 0.65, y: 0.7,  color: '#f97316', description: '商会年度大比拼', timeline: 50 },
  { id: 'e3', name: '身份曝光',     type: 'event',      x: 0.5,  y: 0.5,  color: '#f97316', description: '女主穿越者身份曝光', timeline: 80 },
];

const mockWorldEdges: WorldEdge[] = [
  { id: 'r1',  from: 'c1', to: 'c2', type: '恋爱' },
  { id: 'r2',  from: 'c3', to: 'c1', type: '敌对' },
  { id: 'r3',  from: 'c3', to: 'c2', type: '暗恋' },
  { id: 'r4',  from: 'c4', to: 'c1', type: '合作' },
  { id: 'r5',  from: 'c4', to: 'c2', type: '师生' },
  { id: 'r6',  from: 'c1', to: 's1', type: '出场' },
  { id: 'r7',  from: 'c2', to: 's2', type: '出场' },
  { id: 'r8',  from: 'c1', to: 's3', type: '出场' },
  { id: 'r9',  from: 'c2', to: 's3', type: '出场' },
  { id: 'r10', from: 'e1', to: 'c1', type: '发生' },
  { id: 'r11', from: 'e2', to: 'c1', type: '发生' },
  { id: 'r12', from: 'e2', to: 'c2', type: '发生' },
];

// ─── Progress Gauge (large ring dashboard) ─────────────────
function ProgressGauge({ progress, size = 140 }: { progress: number; size?: number }) {
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - Math.min(progress, 100) / 100);

  const getGradientId = `gauge-grad-${progress}`;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id={getGradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--brand-400)" />
            <stop offset="50%" stopColor="#a78bfa" />
            <stop offset="100%" stopColor="#00d4aa" />
          </linearGradient>
        </defs>
        {/* Background track */}
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={strokeWidth} />
        {/* Progress arc */}
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none"
          stroke={`url(#${getGradientId})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{
            transition: 'stroke-dashoffset 2s cubic-bezier(0.4, 0, 0.2, 1)',
            filter: 'drop-shadow(0 0 12px rgba(139, 92, 246, 0.4))',
          }}
        />
      </svg>
      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-white leading-none">{progress}%</span>
        <span className="text-[10px] text-gray-500 mt-1">完成度</span>
      </div>
    </div>
  );
}

// ─── Animated Timeline ─────────────────────────────────────
function AnimatedTimeline({ activities }: { activities: typeof recentActivity }) {
  return (
    <div className="relative pl-6">
      {/* Vertical line */}
      <div className="absolute left-[7px] top-2 bottom-2 w-px bg-gradient-to-b from-brand-500/50 via-purple-500/30 to-transparent" />
      {activities.map((act, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.12, duration: 0.35 }}
          className="relative mb-4 last:mb-0"
        >
          {/* Timeline dot */}
          <div className={`absolute left-[-20px] top-1.5 w-3 h-3 rounded-full border-2 flex items-center justify-center ${
            act.user === 'AI'
              ? 'bg-brand-500/20 border-brand-500'
              : 'bg-[#00d4aa]/20 border-[#00d4aa]'
          }`}>
            <div className={`w-1.5 h-1.5 rounded-full ${
              act.user === 'AI' ? 'bg-brand-500 animate-pulse' : 'bg-[#00d4aa]'
            }`} />
          </div>
          {/* Content */}
          <div className="flex items-start gap-2">
            <span className="text-sm">{act.icon}</span>
            <div className="flex-1 min-w-0">
              <span className="text-sm text-gray-300">{act.action}</span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                  act.user === 'AI' ? 'bg-brand-500/15 text-brand-400' : 'bg-white/5 text-gray-500'
                }`}>
                  {act.user}
                </span>
                <span className="text-[10px] text-gray-600">{act.time}</span>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// ─── tab content animation variants ────────────────────────
const tabVariants = {
  enter: (dir: string) => ({ opacity: 0, x: dir === 'forward' ? 30 : -30 }),
  center: { opacity: 1, x: 0 },
  exit: (dir: string) => ({ opacity: 0, x: dir === 'forward' ? -30 : 30 }),
};

// ==================== MAIN ==================================
export default function ProjectDetailClient() {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState('overview');
  const [project, setProject] = useState(mockProject);
  const [showAiPanel, setShowAiPanel] = useState(false);
  const [tabDirection, setTabDirection] = useState('forward');
  const [charNodes, setCharNodes] = useState<CharNode[]>([]);
  const [loadingChars, setLoadingChars] = useState(true);

  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const userId = user.id || 'demo';
      import('@/lib/store/data-service').then(({ projectService, characterService }) => {
        // 加载项目
        const projects = projectService.listByUser(userId);
        const p = projects.find((pr: Record<string, unknown>) => pr.id === id);
        if (p) setProject({ ...mockProject, ...p });

        // 加载角色
        const characters = characterService.listByUser(userId);
        if (characters.length > 0) {
          const nodes: CharNode[] = characters.map((c: Record<string, unknown>, i: number) => ({
            id: String(c.id),
            name: String(c.name || ''),
            role: String(c.narrativeRole || c.archetype || ''),
            color: DEFAULT_CHAR_COLORS[i % DEFAULT_CHAR_COLORS.length],
          }));
          setCharNodes(nodes);
        }
        setLoadingChars(false);
      });
    } catch {
      setLoadingChars(false);
    }
  }, [id]);

  // 动态世界观节点：根据真实角色 + 静态场景/事件节点生成
  const worldNodes = useMemo<WorldNode[]>(() => {
    const chars = charNodes.length > 0 ? charNodes : mockCharacters;
    const positions = [
      { x: 0.55, y: 0.25 }, { x: 0.75, y: 0.4 }, { x: 0.6, y: 0.55 },
      { x: 0.4, y: 0.3 }, { x: 0.3, y: 0.5 }, { x: 0.8, y: 0.7 },
      { x: 0.5, y: 0.75 }, { x: 0.2, y: 0.6 },
    ];
    const charNodes_: WorldNode[] = chars.map((c, i) => ({
      id: `c_${c.id}`,
      name: c.name,
      type: 'character' as const,
      x: positions[i % positions.length].x,
      y: positions[i % positions.length].y,
      color: c.color || DEFAULT_CHAR_COLORS[i % DEFAULT_CHAR_COLORS.length],
      description: c.role || '',
      tags: [c.role || '角色'],
      timeline: i * 10,
    }));
    const staticNodes = mockWorldNodes.filter(n => n.type !== 'character');
    return [...charNodes_, ...staticNodes];
  }, [charNodes]);

  const switchTab = (newTab: string) => {
    const currentIdx = TABS.findIndex((t) => t.key === activeTab);
    const newIdx = TABS.findIndex((t) => t.key === newTab);
    setTabDirection(newIdx > currentIdx ? 'forward' : 'backward');
    setActiveTab(newTab);
  };

  return (
    <div className="relative min-h-screen">
      {/* Full-page particle background */}
      <ParticleBg particleCount={80} connectionDistance={130} speed={0.3} colors={[250, 200]} />

      {/* Floating decorative elements */}
      <FloatingElements density="low" emojis={['🎬', '📽️', '🎭', '✨', '💫', '🌟']} />

      {/* Cursor trail glow */}
      <GlowTrail enabled={true} trailCount={15} lifetime={600} />

      {/* Breadcrumb + Title */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative z-10"
      >
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
          <Link href="/dashboard/projects" className="hover:text-white transition-colors">项目</Link>
          <span>/</span>
          <span className="text-white truncate">{project.title}</span>
        </div>

        <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <NeonText as="h1" color="white" glowColor="#a78bfa" pulse>
                {project.title}
              </NeonText>
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: 'spring', stiffness: 300 }}
                className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full ${
                  project.status === 'IN_PROGRESS' ? 'bg-blue-500/20 text-blue-400' :
                  project.status === 'COMPLETED' ? 'bg-green-500/20 text-green-400' :
                  project.status === 'PUBLISHED' ? 'bg-purple-500/20 text-purple-400' :
                  'bg-gray-500/20 text-gray-400'
                }`}
              >
                <span className={`relative flex h-2 w-2 ${project.status === 'IN_PROGRESS' ? '' : ''}`}>
                  <span className={`absolute inline-flex h-full w-full rounded-full ${
                    project.status === 'IN_PROGRESS' ? 'bg-blue-400 animate-ping opacity-75' :
                    project.status === 'COMPLETED' ? 'bg-green-400' :
                    project.status === 'PUBLISHED' ? 'bg-purple-400' : 'bg-gray-400'
                  }`}
                    style={project.status !== 'IN_PROGRESS' ? { animation: 'none' } : { animationDuration: '2s' }}
                  />
                  <span className={`relative inline-flex rounded-full h-2 w-2 ${
                    project.status === 'IN_PROGRESS' ? 'bg-blue-400' :
                    project.status === 'COMPLETED' ? 'bg-green-400' :
                    project.status === 'PUBLISHED' ? 'bg-purple-400' : 'bg-gray-400'
                  }`} />
                </span>
                {project.status === 'IN_PROGRESS' ? '制作中' :
                 project.status === 'COMPLETED' ? '已完成' :
                 project.status === 'PUBLISHED' ? '已发布' : '草稿'}
              </motion.span>
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
      </motion.div>

      {/* AI Panel */}
      <AnimatePresence>
        {showAiPanel && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-6 overflow-hidden relative z-10"
          >
            <AiGeneratePanel
              type="script"
              title="AI 创作助手"
              description="帮你生成剧本、场景描述和分镜脚本"
              onGenerate={(prompt) => console.log('AI generate:', prompt)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tab Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="flex gap-1 mb-6 overflow-x-auto relative z-10"
      >
        {TABS.map((tab) => (
          <motion.button
            key={tab.key}
            onClick={() => switchTab(tab.key)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
              activeTab === tab.key
                ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/25'
                : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
            </svg>
            {tab.label}
          </motion.button>
        ))}
      </motion.div>

      {/* Tab Content with AnimatePresence */}
      <AnimatePresence mode="wait" custom={tabDirection}>
        {/* ─── OVERVIEW ──────────────────────────────────── */}
        {activeTab === 'overview' && (
          <motion.div
            key="overview"
            custom={tabDirection}
            variants={tabVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="space-y-6 relative z-10"
          >
            {/* Progress Gauge + Quick Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {/* Gauge */}
              <GlassCard className="flex flex-col items-center justify-center py-6">
                <h3 className="text-sm font-medium text-gray-400 mb-4">制作进度</h3>
                <ProgressGauge progress={project.progress} size={140} />
                <div className="mt-4 text-xs text-gray-500">
                  已进行 {project.progress}%，继续加油！
                </div>
              </GlassCard>

              {/* Quick stats */}
              <div className="lg:col-span-2 grid grid-cols-2 gap-3">
                <StatCardEnhanced title="场景" value={project.sceneCount} icon="🎬" accent="#06b6d4" size="md" />
                <StatCardEnhanced title="分镜" value={project.storyboardCount} icon="🎞️" accent="#a855f7" size="md" />
                <StatCardEnhanced title="角色" value={project.characterCount} icon="👥" accent="#22c55e" size="md" />
                <StatCardEnhanced title="字数" value={project.scriptWords} icon="📝" accent="#f59e0b" size="md" />
              </div>
            </div>

            {/* Character ring + Timeline row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* Mini character relationship ring */}
              <GlassCard heading="角色关系网">
                <CharacterRelationshipRing
                  characters={charNodes.length > 0 ? charNodes : mockCharacters}
                  relations={mockRelations}
                  size={260}
                  onCharacterClick={(char) => console.log('clicked:', char.name)}
                />
                <div className="mt-2 pt-2 border-t border-white/5 flex justify-between items-center">
                  <span className="text-xs text-gray-500">{(charNodes.length > 0 ? charNodes : mockCharacters).length} 个角色 · {mockRelations.length} 条关系</span>
                  <Link href="/dashboard/characters" className="text-xs text-brand-400 hover:text-brand-300 transition-colors">
                    管理角色 →
                  </Link>
                </div>
              </GlassCard>

              {/* Animated timeline */}
              <GlassCard heading="最近动态">
                <AnimatedTimeline activities={recentActivity} />
              </GlassCard>
            </div>

            {/* Characters list */}
            <GlassCard heading="项目角色">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(charNodes.length > 0 ? charNodes : mockCharacters).map((ch) => (
                  <motion.div
                    key={ch.id}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link
                      href={`/dashboard/characters/${ch.id}`}
                      className="flex items-center gap-3 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors group"
                    >
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                        style={{
                          background: `linear-gradient(135deg, ${ch.color || '#8b5cf6'}, ${ch.color || '#8b5cf6'}80)`,
                        }}
                      >
                        {ch.name[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-white group-hover:text-brand-500 transition-colors truncate">
                          {ch.name}
                        </div>
                        <div className="text-xs text-gray-500">{ch.role}</div>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded ${
                        ch.id === '1' || ch.id === '3'
                          ? 'bg-pink-500/20 text-pink-400'
                          : 'bg-blue-500/20 text-blue-400'
                      }`}>
                        {['1', '3'].includes(ch.id) ? '女' : '男'}
                      </span>
                    </Link>
                  </motion.div>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t border-white/5">
                <Link href="/dashboard/characters" className="text-sm text-brand-400 hover:text-brand-300 transition-colors">
                  + 管理角色
                </Link>
              </div>
            </GlassCard>
          </motion.div>
        )}

        {/* ─── SCRIPT ────────────────────────────────────── */}
        {activeTab === 'script' && (
          <motion.div
            key="script"
            custom={tabDirection}
            variants={tabVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="relative z-10"
          >
            <GlassCard>
              <div className="text-center py-10">
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                  className="text-5xl mb-4"
                >
                  📝
                </motion.div>
                <NeonText as="h3" color="var(--brand-400)" glowColor="#a78bfa" pulse>
                  剧本编辑器
                </NeonText>
                <p className="text-gray-500 text-sm mt-2 mb-8">编辑和管理你的剧本内容</p>
                <Link href={`/dashboard/projects/${id}/script`}>
                  <GradientBtn>打开剧本编辑器</GradientBtn>
                </Link>
              </div>
            </GlassCard>
          </motion.div>
        )}

        {/* ─── SCENES ────────────────────────────────────── */}
        {activeTab === 'scenes' && (
          <motion.div
            key="scenes"
            custom={tabDirection}
            variants={tabVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="relative z-10"
          >
            <GlassCard>
              <div className="text-center py-10">
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                  className="text-5xl mb-4"
                >
                  🎬
                </motion.div>
                <NeonText as="h3" color="var(--brand-400)" glowColor="#06b6d4" pulse>
                  场景管理
                </NeonText>
                <p className="text-gray-500 text-sm mt-2 mb-8">管理 {project.sceneCount} 个场景</p>
                <Link href={`/dashboard/projects/${id}/scenes`}>
                  <GradientBtn>打开场景管理</GradientBtn>
                </Link>
              </div>
            </GlassCard>
          </motion.div>
        )}

        {/* ─── STORYBOARD ────────────────────────────────── */}
        {activeTab === 'storyboard' && (
          <motion.div
            key="storyboard"
            custom={tabDirection}
            variants={tabVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="relative z-10"
          >
            <GlassCard>
              <div className="text-center py-10">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                  className="text-5xl mb-4"
                >
                  🎞️
                </motion.div>
                <NeonText as="h3" color="var(--brand-400)" glowColor="#c084fc" pulse>
                  分镜编辑器
                </NeonText>
                <p className="text-gray-500 text-sm mt-2 mb-8">编排 {project.storyboardCount} 个镜头</p>
                <Link href={`/dashboard/projects/${id}/storyboard`}>
                  <GradientBtn>打开分镜编辑器</GradientBtn>
                </Link>
              </div>
            </GlassCard>
          </motion.div>
        )}

        {/* ─── WORLDVIEW (new!) ──────────────────────────── */}
        {activeTab === 'worldview' && (
          <motion.div
            key="worldview"
            custom={tabDirection}
            variants={tabVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="relative z-10"
          >
            <GlassCard className="overflow-hidden p-0">
              <div className="p-4 border-b border-white/5 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">世界观视图</h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    角色关系 · 场景分布 · 剧情连线 — 拖拽画布平移，滚轮缩放
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-purple-500" /> 角色</span>
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-cyan-500" style={{ clipPath: 'polygon(50% 0%, 85% 50%, 50% 100%, 15% 50%)' }} /> 场景</span>
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-amber-500" /> 事件</span>
                </div>
              </div>
              <WorldviewCanvas
                nodes={worldNodes}
                edges={mockWorldEdges}
                onNodeClick={(node) => console.log('node clicked:', node.name)}
              />
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
