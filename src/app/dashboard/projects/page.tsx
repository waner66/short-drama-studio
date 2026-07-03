'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import PageHeader from '@/components/ui/page-header';
import GlassCard from '@/components/ui/glass-card';
import GradientBtn from '@/components/ui/gradient-btn';
import EmptyState from '@/components/ui/empty-state';
import FloatingElements from '@/components/ui/floating-elements';
import GlowTrail from '@/components/ui/glow-trail';
import NeonText from '@/components/ui/neon-text';

// ─── status config ────────────────────────────────────────
const statusMap: Record<string, { color: string; label: string; bg: string; glow: string; pulse: boolean }> = {
  DRAFT:        { color: 'text-gray-400',   label: '草稿',   bg: 'bg-gray-500/20',   glow: '#9ca3af', pulse: false },
  IN_PROGRESS:  { color: 'text-blue-400',   label: '制作中', bg: 'bg-blue-500/20',   glow: '#60a5fa', pulse: true  },
  COMPLETED:    { color: 'text-green-400',  label: '已完成', bg: 'bg-green-500/20',  glow: '#4ade80', pulse: false },
  PUBLISHED:    { color: 'text-purple-400', label: '已发布', bg: 'bg-purple-500/20', glow: '#c084fc', pulse: false },
};

const progressMap: Record<string, number> = {
  DRAFT: 15, IN_PROGRESS: 60, COMPLETED: 100, PUBLISHED: 100,
};

// ─── hash to gradient color ─────────────────────────────────
const coverPalettes = [
  ['#6366f1', '#a855f7'], // violet→purple
  ['#3b82f6', '#06b6d4'], // blue→cyan
  ['#f59e0b', '#ef4444'], // amber→red
  ['#10b981', '#06b6d4'], // emerald→cyan
  ['#ec4899', '#8b5cf6'], // pink→violet
  ['#f97316', '#eab308'], // orange→yellow
  ['#84cc16', '#22d3ee'], // lime→cyan
  ['#14b8a6', '#3b82f6'], // teal→blue
];

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function getCoverGradient(title: string): [string, string] {
  return coverPalettes[hashString(title) % coverPalettes.length] as [string, string];
}

// ─── ring progress (SVG) ───────────────────────────────────
function RingProgress({ progress, size = 52, strokeWidth = 4 }: { progress: number; size?: number; strokeWidth?: number }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - progress / 100);
  const color = progress >= 100 ? '#4ade80' : progress >= 60 ? '#60a5fa' : '#a78bfa';

  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke={color} strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{
            transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)',
            filter: `drop-shadow(0 0 6px ${color}50)`,
          }}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-xs font-bold" style={{ color }}>
        {Math.round(progress)}%
      </span>
    </div>
  );
}

// ─── breathing dot ─────────────────────────────────────────
function StatusDot({ color, pulse }: { color: string; pulse: boolean }) {
  return (
    <span className="relative flex h-2 w-2">
      <span
        className="absolute inline-flex h-full w-full rounded-full"
        style={{ backgroundColor: color }}
      />
      {pulse && (
        <span
          className="absolute inline-flex h-full w-full rounded-full animate-ping opacity-75"
          style={{ backgroundColor: color, animationDuration: '2s' }}
        />
      )}
    </span>
  );
}

// ─── glow ring CSS (injected once) ─────────────────────────
const GLOW_RING_STYLE = `
@keyframes glowRotate {
  0% { --glow-angle: 0deg; }
  100% { --glow-angle: 360deg; }
}
@property --glow-angle {
  syntax: '<angle>';
  initial-value: 0deg;
  inherits: false;
}
.project-card-glow::before {
  content: '';
  position: absolute;
  inset: -1.5px;
  border-radius: inherit;
  background: conic-gradient(from var(--glow-angle, 0deg), #6366f1, #a855f7, #06b6d4, #6366f1);
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask-composite: exclude;
  -webkit-mask-composite: xor;
  padding: 1.5px;
  animation: glowRotate 6s linear infinite;
  opacity: 0;
  transition: opacity 0.4s;
}
.project-card-glow:hover::before {
  opacity: 1;
}
.group:hover .project-card-glow::before {
  opacity: 1;
}
`;

// ─── hover preview popup ───────────────────────────────────
function HoverPreview({ project, visible }: { project: any; visible: boolean }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 8, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 4, scale: 0.98 }}
          transition={{ duration: 0.2 }}
          className="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-50 w-56 bg-[#0f0f23]/95 backdrop-blur-2xl border border-white/10 rounded-xl p-4 shadow-2xl shadow-black/50"
        >
          <div className="text-sm font-bold text-white mb-2 truncate">{project.title}</div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <div className="text-lg font-bold text-cyan-400">{project.sceneCount || 0}</div>
              <div className="text-[10px] text-gray-500">场景</div>
            </div>
            <div>
              <div className="text-lg font-bold text-purple-400">{project.storyboardCount || 0}</div>
              <div className="text-[10px] text-gray-500">分镜</div>
            </div>
            <div>
              <div className="text-lg font-bold text-green-400">{project.characterCount || 0}</div>
              <div className="text-[10px] text-gray-500">角色</div>
            </div>
          </div>
          <div className="mt-2 pt-2 border-t border-white/5 text-[10px] text-gray-600 truncate">
            更新于 {project.updatedAt || 'N/A'}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── corner sparkles ───────────────────────────────────────
function CornerSparkles({ colors }: { colors: [string, string] }) {
  const sparkles = [
    { x: '8%', y: '12%', delay: '0s', size: 3 },
    { x: '85%', y: '8%', delay: '1.2s', size: 2 },
    { x: '92%', y: '88%', delay: '0.6s', size: 3 },
    { x: '6%', y: '85%', delay: '1.8s', size: 2 },
  ];

  return (
    <>
      {sparkles.map((s, i) => (
        <span
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: s.x,
            top: s.y,
            width: s.size,
            height: s.size,
            background: `radial-gradient(circle, ${colors[0]} 0%, transparent 70%)`,
            animation: `sparkleFloat 3s ease-in-out infinite`,
            animationDelay: s.delay,
            opacity: 0.6,
          }}
        />
      ))}
      <style>{`
        @keyframes sparkleFloat {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.4; }
          50% { transform: translate(4px, -4px) scale(1.8); opacity: 0.9; }
        }
      `}</style>
    </>
  );
}

// ─── main component ────────────────────────────────────────
export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [hoverId, setHoverId] = useState<string | null>(null);
  const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tiltRefs = useRef<Map<string, HTMLDivElement>>(new Map());

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
          characterCount: p.characterCount || 0,
        })));
      });
    } catch { setProjects([]); }
  }, []);

  const handleMouseEnter = useCallback((id: string) => {
    hoverTimerRef.current = setTimeout(() => setHoverId(id), 600);
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    setHoverId(null);
  }, []);

  // 3D tilt
  const handleCardMouseMove = (e: React.MouseEvent, id: string) => {
    const card = tiltRefs.current.get(id);
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rx = ((y - rect.height / 2) / (rect.height / 2)) * -8;
    const ry = ((x - rect.width / 2) / (rect.width / 2)) * 8;
    card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px)`;
    card.style.zIndex = '10';
  };

  const handleCardMouseLeave = (id: string) => {
    const card = tiltRefs.current.get(id);
    if (!card) return;
    card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    card.style.zIndex = '1';
  };

  return (
    <div className="relative min-h-screen">
      <style>{GLOW_RING_STYLE}</style>

      {/* Visual layer: floating emoji background */}
      <FloatingElements density="low" emojis={['🎬', '📽️', '🎭', '✨', '💫', '🌟']} />

      <PageHeader
        title={
          <NeonText as="span" color="var(--brand-400)" glowColor="#a78bfa" pulse>
            我的项目
          </NeonText>
        }
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((project, idx) => {
            const st = statusMap[project.status] || statusMap.DRAFT;
            const progress = progressMap[project.status] || 15;
            const [c1, c2] = getCoverGradient(project.title);

            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  duration: 0.45,
                  delay: idx * 0.08,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
                onMouseEnter={() => handleMouseEnter(project.id)}
                onMouseLeave={handleMouseLeave}
                onMouseMove={(e) => handleCardMouseMove(e, project.id)}
                className="relative group"
                style={{ perspective: '800px' }}
              >
                {/* 3D tilt wrapper */}
                <div
                  ref={(el) => { if (el) tiltRefs.current.set(project.id, el); }}
                  onMouseMove={(e) => handleCardMouseMove(e as any, project.id)}
                  onMouseLeave={() => handleCardMouseLeave(project.id)}
                  className="project-card-glow relative surface-card rounded-[var(--radius-xl)] overflow-hidden cursor-pointer transition-shadow duration-300"
                  style={{
                    background: 'linear-gradient(135deg, rgba(15,15,35,0.95), rgba(20,20,45,0.9))',
                    border: '1px solid rgba(255,255,255,0.06)',
                    boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
                  }}
                >
                  {/* Corner sparkles */}
                  <CornerSparkles colors={[c1, c2]} />

                  {/* Gradient cover image */}
                  <Link href={`/dashboard/projects/${project.id}`} className="block">
                    <div
                      className="h-28 relative overflow-hidden flex items-center justify-center"
                      style={{
                        background: `linear-gradient(135deg, ${c1}90, ${c2}90)`,
                      }}
                    >
                      {/* Decorative rings */}
                      <div
                        className="absolute w-32 h-32 rounded-full border border-white/10"
                        style={{ animation: 'coverPulse 4s ease-in-out infinite' }}
                      />
                      <div
                        className="absolute w-24 h-24 rounded-full border border-white/8"
                        style={{ animation: 'coverPulse 4s ease-in-out infinite 0.5s' }}
                      />
                      <div
                        className="absolute w-16 h-16 rounded-full border border-white/6"
                        style={{ animation: 'coverPulse 4s ease-in-out infinite 1s' }}
                      />
                      {/* Title overlay on cover */}
                      <span
                        className="relative z-10 text-white font-bold text-lg px-4 text-center drop-shadow-lg"
                        style={{ textShadow: '0 2px 8px rgba(0,0,0,0.4)' }}
                      >
                        {project.title}
                      </span>
                      {/* Genre badge */}
                      <span className="absolute top-2 right-2 text-[10px] px-2 py-0.5 rounded-full bg-black/30 text-white/70 backdrop-blur-sm">
                        {project.genre || '未分类'}
                      </span>
                    </div>
                  </Link>

                  {/* Card body */}
                  <div className="p-4 space-y-3">
                    {/* Status + Ring Progress row */}
                    <div className="flex items-center justify-between">
                      <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full ${st.bg} ${st.color}`}>
                        <StatusDot color={st.glow} pulse={st.pulse} />
                        {st.label}
                      </span>
                      <RingProgress progress={progress} size={44} strokeWidth={3.5} />
                    </div>

                    {/* Stats row */}
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <svg className="w-3.5 h-3.5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        {project.sceneCount}场景
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="w-3.5 h-3.5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v5a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 16a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1v-2zM14 16a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1h-4a1 1 0 01-1-1v-2z" />
                        </svg>
                        {project.storyboardCount}分镜
                      </span>
                      <span className="ml-auto text-[10px] text-gray-600 truncate">{project.updatedAt}</span>
                    </div>

                    {/* Action bar */}
                    <div className="flex items-center justify-between pt-3 border-t border-white/5">
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
                          onClick={(e) => { e.preventDefault(); setMenuOpen(menuOpen === project.id ? null : project.id); }}
                          className="text-gray-400 hover:text-white p-1 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                          </svg>
                        </button>
                        <AnimatePresence>
                          {menuOpen === project.id && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.9, y: -4 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.9, y: -4 }}
                              transition={{ duration: 0.15 }}
                              className="absolute right-0 top-8 z-50 w-36 bg-[#141428] border border-white/10 rounded-lg py-1 shadow-xl backdrop-blur-xl"
                            >
                              <button
                                className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
                                onClick={() => setMenuOpen(null)}
                              >导出为模板</button>
                              <button
                                className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                                onClick={() => setMenuOpen(null)}
                              >删除</button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>

                  {/* Hover preview popup */}
                  <HoverPreview project={project} visible={hoverId === project.id} />
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Cover pulse animation */}
      <style>{`
        @keyframes coverPulse {
          0%, 100% { transform: scale(1); opacity: 0.15; }
          50% { transform: scale(1.05); opacity: 0.3; }
        }
      `}</style>
    </div>
  );
}
