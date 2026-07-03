'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { AnimatePresence, motion, Reorder } from 'framer-motion';
import GlassCard from '@/components/ui/glass-card';
import GradientBtn from '@/components/ui/gradient-btn';
import StatCardEnhanced from '@/components/ui/stat-card-enhanced';
import AiGeneratePanel from '@/components/business/ai-generate-panel';
import NeonText from '@/components/ui/neon-text';
import ParticleBg from '@/components/ui/particle-bg';
import GlowTrail from '@/components/ui/glow-trail';
import FloatingElements from '@/components/ui/floating-elements';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcut';

interface Storyboard {
  id: string;
  sceneNumber: number;
  shotNumber: number;
  shotType: 'WIDE' | 'MEDIUM' | 'CLOSE_UP' | 'EXTREME_CLOSE' | 'POV' | 'ESTABLISHING' | 'TWO_SHOT' | 'OVER_SHOULDER';
  description: string;
  dialogue?: string;
  duration: number;
  cameraMovement?: string;
  lighting?: string;
  status: 'DRAFT' | 'COMPLETED';
  thumbnail?: string;
  aiGenStatus?: 'idle' | 'loading' | 'done' | 'error';
}

const SHOT_TYPES: Record<string, { label: string; icon: string; color: string }> = {
  WIDE: { label: '远景', icon: '\u26F0\uFE0F', color: 'text-blue-400 bg-blue-500/20' },
  MEDIUM: { label: '中景', icon: '\uD83C\uDFAD', color: 'text-green-400 bg-green-500/20' },
  CLOSE_UP: { label: '特写', icon: '\uD83D\uDC41\uFE0F', color: 'text-purple-400 bg-purple-500/20' },
  EXTREME_CLOSE: { label: '大特写', icon: '\uD83D\uDD0D', color: 'text-pink-400 bg-pink-500/20' },
  POV: { label: '主观', icon: '\uD83D\uDC40', color: 'text-yellow-400 bg-yellow-500/20' },
  ESTABLISHING: { label: '定场', icon: '\uD83C\uDFD9\uFE0F', color: 'text-cyan-400 bg-cyan-500/20' },
  TWO_SHOT: { label: '双人中景', icon: '\uD83D\uDC65', color: 'text-orange-400 bg-orange-500/20' },
  OVER_SHOULDER: { label: '过肩', icon: '\uD83D\uDD04', color: 'text-red-400 bg-red-500/20' },
};

const mockStoryboards: Storyboard[] = [
  { id: 'sb1', sceneNumber: 1, shotNumber: 1, shotType: 'ESTABLISHING', description: '苏氏集团大厦外景，仰拍视角，玻璃幕墙反射午后的阳光', duration: 5, cameraMovement: '静态上升', lighting: '自然光', status: 'COMPLETED', aiGenStatus: 'idle' },
  { id: 'sb2', sceneNumber: 1, shotNumber: 2, shotType: 'MEDIUM', description: '总裁办公室内，苏晚晴站在落地窗前接电话，表情严肃', dialogue: '就这点手段，也想扳倒我？', duration: 8, cameraMovement: '缓慢推近', lighting: '侧逆光', status: 'COMPLETED', aiGenStatus: 'idle' },
  { id: 'sb3', sceneNumber: 1, shotNumber: 3, shotType: 'CLOSE_UP', description: '苏晚晴放下手机的特写，手指微微用力', duration: 3, cameraMovement: '静态', lighting: '面光', status: 'COMPLETED', aiGenStatus: 'idle' },
  { id: 'sb4', sceneNumber: 2, shotNumber: 1, shotType: 'WIDE', description: '城市夜景高架桥，红色跑车飞驰而过，后方有车追踪', duration: 6, cameraMovement: '跟拍', lighting: '夜景灯光', status: 'COMPLETED', aiGenStatus: 'idle' },
  { id: 'sb5', sceneNumber: 2, shotNumber: 2, shotType: 'CLOSE_UP', description: '苏晚晴紧握方向盘，后视镜中看到追踪车辆逼近', duration: 4, cameraMovement: '抖动', lighting: '车内暗光', status: 'COMPLETED', aiGenStatus: 'idle' },
  { id: 'sb6', sceneNumber: 2, shotNumber: 3, shotType: 'EXTREME_CLOSE', description: '碰撞瞬间，苏晚晴眼中的恐惧被一道白光吞没', duration: 2, cameraMovement: '抖动转静止', lighting: '高光爆破', status: 'COMPLETED', aiGenStatus: 'idle' },
  { id: 'sb7', sceneNumber: 2, shotNumber: 4, shotType: 'WIDE', description: '白光散去，镜头从高空俯瞰古代江南水乡全景', duration: 5, cameraMovement: '航拍下降', lighting: '金色晨光', status: 'COMPLETED', aiGenStatus: 'idle' },
  { id: 'sb8', sceneNumber: 2, shotNumber: 5, shotType: 'MEDIUM', description: '苏晚晴在古色古香的房间醒来，环顾四周，满脸迷茫', duration: 6, cameraMovement: '缓慢环绕', lighting: '柔光', status: 'COMPLETED', aiGenStatus: 'idle' },
  { id: 'sb9', sceneNumber: 3, shotNumber: 1, shotType: 'ESTABLISHING', description: '古色古香的江南商行外景，"苏氏商行"牌匾醒目', duration: 4, cameraMovement: '缓慢推进', lighting: '上午日光', status: 'DRAFT', aiGenStatus: 'idle' },
  { id: 'sb10', sceneNumber: 3, shotNumber: 2, shotType: 'MEDIUM', description: '苏晚晴站在商行柜台前，周围全是疑惑的伙计和客人', duration: 6, cameraMovement: '中景推近', lighting: '室内自然光', status: 'DRAFT', aiGenStatus: 'idle' },
];

function groupByScene(boards: Storyboard[]): { sceneNumber: number; boards: Storyboard[] }[] {
  const map = new Map<number, Storyboard[]>();
  boards.forEach((b) => {
    const existing = map.get(b.sceneNumber) || [];
    existing.push(b);
    map.set(b.sceneNumber, existing);
  });
  return Array.from(map.entries()).map(([sceneNumber, boards]) => ({ sceneNumber, boards }));
}

/* ---- Cinematic Timeline Visual ---- */
function CinematicTimeline({
  boards,
  selectedScene,
  onSelectScene,
  totalDuration,
}: {
  boards: Storyboard[];
  selectedScene: number;
  onSelectScene: (n: number) => void;
  totalDuration: number;
}) {
  const sceneNumbers = [...new Set(boards.map((b) => b.sceneNumber))].sort();
  const maxDuration = Math.max(...sceneNumbers.map(sn =>
    boards.filter(b => b.sceneNumber === sn).reduce((sum, b) => sum + b.duration, 0)
  ), 1);

  return (
    <div className="relative mb-6 surface-card border rounded-xl p-4 overflow-hidden">
      {/* Letterbox bars */}
      <div className="absolute inset-x-0 top-0 h-2 bg-black/60 z-10" />
      <div className="absolute inset-x-0 bottom-0 h-2 bg-black/60 z-10" />

      {/* Timeline track */}
      <div className="flex items-end gap-2 h-24 pt-4 pb-3 relative">
        {/* Time ruler */}
        {sceneNumbers.map((sn) => {
          const sceneBoards = boards.filter(b => b.sceneNumber === sn);
          const sceneDuration = sceneBoards.reduce((sum, b) => sum + b.duration, 0);
          const heightPct = (sceneDuration / maxDuration) * 100;
          const isActive = selectedScene === sn;
          const allDone = sceneBoards.every(b => b.status === 'COMPLETED');

          return (
            <motion.button
              key={sn}
              onClick={() => onSelectScene(sn)}
              whileHover={{ scaleY: 1.08 }}
              whileTap={{ scaleY: 0.95 }}
              className="relative flex-1 min-w-[40px] rounded-t-lg cursor-pointer transition-colors group"
              style={{
                height: Math.max(heightPct, 25) + '%',
                background: isActive
                  ? 'var(--brand-500)'
                  : allDone
                    ? 'linear-gradient(180deg, var(--brand-green) 0%, var(--brand-green)/40 100%)'
                    : 'linear-gradient(180deg, var(--surface-overlay) 0%, var(--surface-ground) 100%)',
                boxShadow: isActive ? '0 0 20px rgba(99, 102, 241, 0.4)' : undefined,
                borderLeft: '1px solid rgba(255,255,255,0.05)',
                borderRight: '1px solid rgba(255,255,255,0.05)',
              }}
            >
              {/* Shot dots */}
              <div className="absolute inset-0 flex flex-col justify-end items-center gap-1 pb-1">
                {sceneBoards.map((b, i) => (
                  <div
                    key={b.id}
                    className={`rounded transition-all ${
                      b.status === 'COMPLETED'
                        ? 'w-2 h-2 bg-white/80'
                        : 'w-1.5 h-1.5 bg-white/30'
                    }`}
                    title={`S${b.sceneNumber} #${b.shotNumber}`}
                  />
                ))}
              </div>

              {/* Scene label */}
              <div className="absolute -bottom-5 left-0 right-0 text-center">
                <span className={`text-[10px] font-bold whitespace-nowrap transition-colors ${
                  isActive ? 'text-brand-400' : 'text-[var(--text-muted)] group-hover:text-[var(--text-secondary)]'
                }`}>
                  场景{sn}
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Total duration */}
      <div className="flex items-center justify-end mt-4 text-xs text-[var(--text-muted)]">
        <span className="flex items-center gap-1">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          总时长 {totalDuration}s &middot; {sceneNumbers.length} 个场景 &middot; {boards.length} 个镜头
        </span>
      </div>
    </div>
  );
}

/* ---- Shot Type Visual Label ---- */
function ShotTypeLabel({ type }: { type: Storyboard['shotType'] }) {
  const st = SHOT_TYPES[type] || SHOT_TYPES.MEDIUM;
  return (
    <motion.span
      whileHover={{ scale: 1.05 }}
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium ${st.color}`}
    >
      <span>{st.icon}</span>
      <span>{st.label}</span>
    </motion.span>
  );
}

/* ---- Cinematic Frame Preview ---- */
function CinematicFrame({
  sb,
  isEditing,
  onEdit,
  onAiGen,
  onRemove,
  dragHandleProps,
  editForm,
  onEditFormChange,
  onSave,
  onCancel,
}: {
  sb: Storyboard;
  isEditing: boolean;
  onEdit: () => void;
  onAiGen: () => void;
  onRemove: () => void;
  dragHandleProps?: any;
  editForm: Partial<Storyboard>;
  onEditFormChange: (f: Partial<Storyboard>) => void;
  onSave: (id: string) => void;
  onCancel: () => void;
}) {
  const st = SHOT_TYPES[sb.shotType] || SHOT_TYPES.MEDIUM;
  const isGenLoading = sb.aiGenStatus === 'loading';
  const isGenDone = sb.aiGenStatus === 'done';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, y: -10 }}
      transition={{ duration: 0.25 }}
      className={`relative group ${
        sb.status === 'COMPLETED'
          ? 'border-l-2 border-l-[var(--brand-green)]'
          : 'border-l-2 border-l-transparent'
      }`}
    >
      <GlassCard hover={!isEditing} className="overflow-hidden">
        {!isEditing ? (
          <div>
            {/* Cinematic aspect ratio preview frame */}
            <div className="relative overflow-hidden rounded-lg mb-3 bg-black/40 border border-[var(--border-subtle)]"
              style={{ aspectRatio: '16/9' }}
            >
              {/* Letterbox bars */}
              <div className="absolute inset-x-0 top-0 h-[12%] bg-black/80 z-10" />
              <div className="absolute inset-x-0 bottom-0 h-[12%] bg-black/80 z-10" />

              {/* Content area */}
              <div className="absolute inset-0 flex items-center justify-center">
                {isGenDone && sb.thumbnail ? (
                  <img src={sb.thumbnail} alt={sb.description} className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center px-6">
                    <div className="text-3xl mb-2">{st.icon}</div>
                    <p className="text-xs text-[var(--text-secondary)] line-clamp-2">
                      {sb.description}
                    </p>
                  </div>
                )}
              </div>

              {/* Scene/timecode overlay */}
              <div className="absolute top-2 left-3 z-20 flex items-center gap-2">
                <span className="text-[10px] font-mono text-white/60 bg-black/40 px-1.5 py-0.5 rounded">
                  S{sb.sceneNumber}·{String(sb.shotNumber).padStart(2, '0')}
                </span>
              </div>

              {/* Duration overlay */}
              <div className="absolute bottom-2 right-3 z-20">
                <span className="text-[10px] font-mono text-white/60 bg-black/40 px-1.5 py-0.5 rounded">
                  {sb.duration}s
                </span>
              </div>
            </div>

            {/* Shot info row */}
            <div className="flex items-center gap-3 flex-wrap">
              {/* Drag handle */}
              <div
                className="cursor-grab active:cursor-grabbing text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors shrink-0"
                {...dragHandleProps}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M7 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM7 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM7 14a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 14a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" />
                </svg>
              </div>

              {/* Shot number badge */}
              <div
                className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold"
                style={{
                  background: (st.color.includes('brand') ? 'var(--brand-500)' : `var(--${st.color.split('-')[1] || 'brand'}-500)`) + '20',
                }}
              >
                <span className={st.color.split(' ')[0]}>{sb.shotNumber}</span>
              </div>

              {/* Description */}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-[var(--text-primary)] leading-relaxed">{sb.description}</p>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  {sb.cameraMovement && (
                    <span className="text-[10px] text-[var(--text-muted)] flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      {sb.cameraMovement}
                    </span>
                  )}
                  {sb.lighting && (
                    <span className="text-[10px] text-[var(--text-muted)] flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                      {sb.lighting}
                    </span>
                  )}
                </div>
                {sb.dialogue && (
                  <div className="mt-1.5 flex items-start gap-1.5">
                    <span className="text-brand-400 text-xs shrink-0 mt-0.5">&#x275D;</span>
                    <p className="text-xs text-[var(--text-secondary)] italic">{sb.dialogue}</p>
                  </div>
                )}
              </div>

              {/* Shot type */}
              <div className="shrink-0">
                <ShotTypeLabel type={sb.shotType} />
              </div>

              {/* AI Gen button */}
              <div className="shrink-0">
                {isGenLoading ? (
                  <span className="flex items-center gap-1 text-xs text-purple-400 animate-pulse px-2 py-1">
                    <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  </span>
                ) : (
                  <button
                    onClick={onAiGen}
                    className={`flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg transition-all ${
                      isGenDone
                        ? 'bg-[var(--brand-green)]/15 text-[var(--brand-green)] border border-[var(--brand-green)]/20'
                        : 'text-[var(--text-muted)] hover:text-purple-400 hover:bg-purple-500/10 border border-transparent hover:border-purple-500/20'
                    }`}
                    title={isGenDone ? '已生成' : 'AI生成画面'}
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    {isGenDone ? '已生成' : '生图'}
                  </button>
                )}
              </div>

              {/* Status */}
              <div className="shrink-0">
                <motion.span
                  whileHover={{ scale: 1.05 }}
                  className={`text-xs px-2.5 py-1 rounded-full inline-flex items-center gap-1 ${
                    sb.status === 'COMPLETED'
                      ? 'bg-[var(--brand-green)]/15 text-[var(--brand-green)]'
                      : 'bg-[var(--surface-elevated)] text-[var(--text-muted)]'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    sb.status === 'COMPLETED'
                      ? 'bg-[var(--brand-green)] animate-pulse'
                      : 'bg-[var(--text-muted)]'
                  }`} />
                  {sb.status === 'COMPLETED' ? '完成' : '草稿'}
                </motion.span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-0.5 shrink-0">
                <button
                  onClick={onEdit}
                  className="p-2 text-[var(--text-muted)] hover:text-brand-400 hover:bg-brand-500/10 rounded-lg transition-all"
                  title="编辑"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  onClick={onRemove}
                  className="p-2 text-[var(--text-muted)] hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                  title="删除"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Edit mode */
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-[var(--text-muted)] bg-[var(--surface-ground)] px-2 py-1 rounded">
                  S{sb.sceneNumber} #{sb.shotNumber}
                </span>
              </div>
              <select
                value={editForm.shotType}
                onChange={(e) => onEditFormChange({ ...editForm, shotType: e.target.value as any })}
                className="h-8 bg-[var(--surface-ground)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-primary)] px-2 text-xs focus:outline-none focus:border-brand-500"
              >
                {Object.entries(SHOT_TYPES).map(([key, val]) => (
                  <option key={key} value={key}>{val.icon} {val.label}</option>
                ))}
              </select>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min={1} max={60}
                  value={editForm.duration}
                  onChange={(e) => onEditFormChange({ ...editForm, duration: Number(e.target.value) })}
                  className="w-14 h-8 bg-[var(--surface-ground)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-primary)] px-2 text-xs text-center focus:outline-none focus:border-brand-500"
                />
                <span className="text-xs text-[var(--text-muted)]">s</span>
              </div>
            </div>

            <textarea
              value={editForm.description}
              onChange={(e) => onEditFormChange({ ...editForm, description: e.target.value })}
              rows={2}
              placeholder="分镜描述..."
              className="w-full bg-[var(--surface-ground)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-primary)] px-3 py-2 text-sm focus:outline-none focus:border-brand-500 resize-none"
              autoFocus
            />
            <input
              value={editForm.dialogue || ''}
              onChange={(e) => onEditFormChange({ ...editForm, dialogue: e.target.value })}
              placeholder="对白（可选）"
              className="w-full h-8 bg-[var(--surface-ground)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-primary)] px-3 text-sm focus:outline-none focus:border-brand-500"
            />
            <div className="flex justify-between items-center">
              <span className="text-xs text-[var(--text-muted)]">Ctrl+S 保存 &middot; Esc 取消</span>
              <div className="flex gap-2">
                <button
                  onClick={onCancel}
                  className="px-3 py-1.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] bg-[var(--surface-elevated)] rounded-lg hover:bg-[var(--surface-overlay)] transition-colors"
                >取消</button>
                <GradientBtn onClick={() => onSave(sb.id)}>保存</GradientBtn>
              </div>
            </div>
          </motion.div>
        )}
      </GlassCard>
    </motion.div>
  );
}

export default function StoryboardClient() {
  const { id } = useParams<{ id: string }>();
  const [boards, setBoards] = useState(mockStoryboards);
  const [showAi, setShowAi] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Storyboard>>({});
  const [dragOver, setDragOver] = useState<string | null>(null);
  const [selectedScene, setSelectedScene] = useState(1);

  // Keyboard shortcuts
  useKeyboardShortcuts([
    {
      key: 's', ctrl: true,
      handler: () => { if (editingId) saveEdit(editingId); },
      description: '保存当前编辑',
    },
    {
      key: 'Escape',
      handler: () => { if (editingId) setEditingId(null); },
      description: '取消编辑',
    },
  ]);

  const completedCount = boards.filter((b) => b.status === 'COMPLETED').length;
  const totalDuration = boards.reduce((sum, b) => sum + b.duration, 0);
  const aiGeneratedCount = boards.filter((b) => b.aiGenStatus === 'done').length;

  const startEdit = (sb: Storyboard) => {
    setEditingId(sb.id);
    setEditForm({ description: sb.description, dialogue: sb.dialogue || '', shotType: sb.shotType, duration: sb.duration });
  };

  const saveEdit = (sbId: string) => {
    setBoards((prev) =>
      prev.map((b) => (b.id === sbId ? { ...b, ...editForm, status: 'COMPLETED' as const } : b))
    );
    setEditingId(null);
  };

  const handleDrop = useCallback(
    (targetId: string) => {
      if (!dragOver || dragOver === targetId) { setDragOver(null); return; }
      setBoards((prev) => {
        const list = [...prev];
        const dragIdx = list.findIndex((b) => b.id === dragOver);
        const targetIdx = list.findIndex((b) => b.id === targetId);
        if (dragIdx < 0 || targetIdx < 0) return prev;
        const [item] = list.splice(dragIdx, 1);
        list.splice(targetIdx, 0, item);
        return list;
      });
      setDragOver(null);
    },
    [dragOver]
  );

  // 单帧AI生图
  const handleShotAiGen = (sbId: string) => {
    setBoards((prev) =>
      prev.map((b) => (b.id === sbId ? { ...b, aiGenStatus: 'loading' } : b))
    );

    const sb = boards.find((b) => b.id === sbId);
    if (!sb) return;

    setTimeout(() => {
      setBoards((prev) =>
        prev.map((b) =>
          b.id === sbId
            ? { ...b, aiGenStatus: 'done', thumbnail: 'https://images.unsplash.com/photo-1518834107812-67b0b7c58434?w=400&h=225&fit=crop' }
            : b
        )
      );
    }, 2000);
  };

  const sceneNumbers = [...new Set(boards.map((b) => b.sceneNumber))].sort();
  const filtered = boards.filter((b) => b.sceneNumber === selectedScene);

  return (
    <div className="relative min-h-screen">
      {/* Background effects */}
      <ParticleBg particleCount={40} colors={[240, 260]} />
      <GlowTrail enabled={true} trailCount={10} dotSize={6} lifetime={600} />
      <FloatingElements count={4} className="opacity-20" />

      <div className="relative z-10">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2 text-sm text-[var(--text-muted)] mb-2"
        >
          <Link href="/dashboard/projects" className="hover:text-[var(--text-primary)] transition-colors">项目</Link>
          <span>/</span>
          <Link href={`/dashboard/projects/${id}`} className="hover:text-[var(--text-primary)] transition-colors">穿越之我在古代当总裁</Link>
          <span>/</span>
          <span className="text-[var(--text-primary)] font-medium">分镜</span>
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="flex items-center justify-between mb-6 flex-wrap gap-3"
        >
          <NeonText
            as="h1"
            color="#6366f1"
            glowColor="#818cf8"
            className="text-2xl font-bold"
          >
            &#x1F3AC; 分镜编辑器
          </NeonText>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <GradientBtn onClick={() => setShowAi(!showAi)}>
              <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              AI 批量生成
            </GradientBtn>
          </motion.div>
        </motion.div>

      {showAi && (
        <div className="mb-6">
          <AiGeneratePanel
            type="storyboard"
            title="AI 分镜生成器"
            description="根据场景描述自动生成分镜脚本"
            onGenerate={(prompt) => { console.log('AI storyboard:', prompt); setShowAi(false); }}
          />
        </div>
      )}

      {/* Stat Cards - Enhanced with ring progress */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="grid grid-cols-4 gap-3 mb-4"
      >
        <StatCardEnhanced title="总镜头" value={boards.length} icon="&#x1F3AC;" accent="#6366f1" progress={100} progressColor="#6366f1" />
        <StatCardEnhanced title="已完成" value={completedCount} icon="&#x2705;" accent="#10b981" progress={(completedCount / boards.length) * 100} progressColor="#10b981" />
        <StatCardEnhanced title="总时长" value={totalDuration} icon="&#x23F1;" accent="#8b5cf6" suffix="s" progress={Math.min((totalDuration / 120) * 100, 100)} progressColor="#8b5cf6" />
        <StatCardEnhanced title="AI生图" value={aiGeneratedCount} icon="&#x26A1;" accent="#f59e0b" progress={(aiGeneratedCount / boards.length) * 100} progressColor="#f59e0b" />
      </motion.div>

      {/* Cinematic Timeline Scene Selector */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <CinematicTimeline
          boards={boards}
          selectedScene={selectedScene}
          onSelectScene={setSelectedScene}
          totalDuration={totalDuration}
        />
      </motion.div>

      {/* Shot List - Reorder & AnimatePresence */}
      <Reorder.Group
        axis="y"
        values={filtered}
        onReorder={(reordered) => {
          // Merge reordered back into full list
          const otherScenes = boards.filter(b => b.sceneNumber !== selectedScene);
          setBoards([...otherScenes, ...reordered]);
        }}
        className="space-y-2"
      >
        <AnimatePresence mode="popLayout">
          {filtered.map((sb) => {
            const isEditing = editingId === sb.id;
            return (
              <Reorder.Item key={sb.id} value={sb} dragListener={!isEditing}>
                <CinematicFrame
                  sb={sb}
                  isEditing={isEditing}
                  onEdit={() => startEdit(sb)}
                  onAiGen={() => handleShotAiGen(sb.id)}
                  onRemove={() => setBoards(prev => prev.filter(b => b.id !== sb.id))}
                  editForm={editForm}
                  onEditFormChange={setEditForm}
                  onSave={saveEdit}
                  onCancel={() => setEditingId(null)}
                />
              </Reorder.Item>
            );
          })}
        </AnimatePresence>
      </Reorder.Group>

      {/* Add shot button */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-3"
      >
        <GlassCard className="border-2 border-dashed border-[var(--border-subtle)] hover:border-brand-500/30 cursor-pointer group text-center py-6 transition-all duration-300 hover:bg-brand-500/5">
          <div className="text-[var(--text-muted)] group-hover:text-brand-400 transition-colors">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 90 }}
              transition={{ duration: 0.3 }}
            >
              <svg className="w-7 h-7 mx-auto mb-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </motion.div>
            <span className="text-sm font-medium">添加分镜到场景{selectedScene}</span>
          </div>
        </GlassCard>
      </motion.div>

      {/* Footer info */}
      <div className="mt-4 flex items-center gap-2 text-xs text-[var(--text-muted)]">
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        拖拽分镜可调整顺序 | 点击生图按钮用AI生成画面 | 场景间移动会自动重新编号
      </div>
      </div>
    </div>
  );
}
