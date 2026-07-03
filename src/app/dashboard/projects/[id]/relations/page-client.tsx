'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import GlassCard from '@/components/ui/glass-card';
import GradientBtn from '@/components/ui/gradient-btn';
import NeonText from '@/components/ui/neon-text';
import ParticleBg from '@/components/ui/particle-bg';
import GlowTrail from '@/components/ui/glow-trail';
import FloatingElements from '@/components/ui/floating-elements';
import StatCardEnhanced from '@/components/ui/stat-card-enhanced';
import CharacterRelationshipRing, { type CharNode, type RelationEdge } from '@/components/business/character-relationship-ring';

// ─── relation type config ─────────────────────────────────
const RELATION_TYPES = [
  { value: '恋爱', color: '#ec4899' },
  { value: '敌对', color: '#ef4444' },
  { value: '朋友', color: '#3b82f6' },
  { value: '家人', color: '#f59e0b' },
  { value: '师生', color: '#8b5cf6' },
  { value: '竞争对手', color: '#f97316' },
  { value: '暗恋', color: '#f472b6' },
  { value: '合作', color: '#22c55e' },
  { value: '利用', color: '#9ca3af' },
  { value: '秘密', color: '#a855f7' },
  { value: '前世', color: '#14b8a6' },
];

const RELATION_COLOR_MAP: Record<string, string> = Object.fromEntries(
  RELATION_TYPES.map(t => [t.value, t.color])
);

const DEFAULT_CHAR_COLORS = ['#ec4899', '#3b82f6', '#f59e0b', '#22c55e', '#8b5cf6', '#f97316', '#06b6d4', '#ef4444'];

// ─── Mock Data ────────────────────────────────────────────
const mockChars: CharNode[] = [
  { id: 'c1', name: '苏晚晴', role: '女主', color: '#ec4899' },
  { id: 'c2', name: '慕容瑾', role: '男主', color: '#3b82f6' },
  { id: 'c3', name: '柳如烟', role: '女配', color: '#f59e0b' },
  { id: 'c4', name: '赵管家', role: '配角', color: '#22c55e' },
  { id: 'c5', name: '沈墨', role: '反派Boss', color: '#ef4444' },
];

const mockRelations: RelationEdge[] = [
  { from: 'c1', to: 'c2', type: '恋爱' },
  { from: 'c3', to: 'c1', type: '敌对' },
  { from: 'c3', to: 'c2', type: '暗恋' },
  { from: 'c4', to: 'c1', type: '合作' },
  { from: 'c4', to: 'c2', type: '师生' },
  { from: 'c5', to: 'c1', type: '竞争对手' },
  { from: 'c5', to: 'c2', type: '敌对' },
];

// ─── Sub-components ───────────────────────────────────────

function StatBadge({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <motion.div
      whileHover={{ scale: 1.04 }}
      className="flex items-center gap-3 px-4 py-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)]"
    >
      <div className="w-10 h-10 rounded-lg flex items-center justify-center text-lg" style={{ background: color + '20' }}>
        <span className="text-xl">{['👥', '🔗', '💕', '⚔️'][label.length % 4]}</span>
      </div>
      <div>
        <div className="text-lg font-bold text-[var(--text-primary)] leading-none">{value}</div>
        <div className="text-xs text-[var(--text-muted)]">{label}</div>
      </div>
    </motion.div>
  );
}

function RelationBadge({ type }: { type: string }) {
  const color = RELATION_COLOR_MAP[type] || '#6b7280';
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
      style={{ background: color + '18', color, border: `1px solid ${color}30` }}
    >
      {type}
    </span>
  );
}

// ─── Add Relation Modal ───────────────────────────────────
function AddRelationModal({
  open,
  onClose,
  chars,
  onAdd,
}: {
  open: boolean;
  onClose: () => void;
  chars: CharNode[];
  onAdd: (relation: RelationEdge) => void;
}) {
  const [charA, setCharA] = useState('');
  const [charB, setCharB] = useState('');
  const [type, setType] = useState('恋爱');

  const handleAdd = () => {
    if (!charA || !charB || charA === charB) return;
    onAdd({
      from: charA,
      to: charB,
      type,
    });
    setCharA('');
    setCharB('');
    setType('恋爱');
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={e => e.stopPropagation()}
            className="w-full max-w-md mx-4"
          >
            <GlassCard className="p-6">
              <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4">添加角色关系</h3>

              {/* Character A */}
              <label className="block text-sm text-[var(--text-secondary)] mb-1.5">角色 A</label>
              <div className="grid grid-cols-5 gap-1.5 mb-4">
                {chars.map(c => (
                  <button
                    key={c.id}
                    onClick={() => setCharA(c.id)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                      charA === c.id
                        ? 'border-current shadow-lg'
                        : 'border-transparent bg-[var(--surface-ground)] text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                    }`}
                    style={charA === c.id ? { color: c.color, borderColor: c.color + '60', background: c.color + '15' } : undefined}
                  >
                    {c.name}
                  </button>
                ))}
              </div>

              {/* Character B */}
              <label className="block text-sm text-[var(--text-secondary)] mb-1.5">角色 B</label>
              <div className="grid grid-cols-5 gap-1.5 mb-4">
                {chars.filter(c => c.id !== charA).map(c => (
                  <button
                    key={c.id}
                    onClick={() => setCharB(c.id)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                      charB === c.id
                        ? 'border-current shadow-lg'
                        : 'border-transparent bg-[var(--surface-ground)] text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                    }`}
                    style={charB === c.id ? { color: c.color, borderColor: c.color + '60', background: c.color + '15' } : undefined}
                  >
                    {c.name}
                  </button>
                ))}
              </div>

              {/* Relation type */}
              <label className="block text-sm text-[var(--text-secondary)] mb-1.5">关系类型</label>
              <div className="flex flex-wrap gap-1.5 mb-5">
                {RELATION_TYPES.map(rt => (
                  <button
                    key={rt.value}
                    onClick={() => setType(rt.value)}
                    className={`px-2.5 py-1.5 rounded-full text-xs font-medium transition-all border ${
                      type === rt.value ? 'shadow-md scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                    style={{
                      background: type === rt.value ? rt.color + '25' : 'var(--surface-ground)',
                      color: rt.color,
                      borderColor: type === rt.value ? rt.color + '50' : 'transparent',
                    }}
                  >
                    {rt.value}
                  </button>
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-2 justify-end">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-sm rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] bg-[var(--surface-elevated)] hover:bg-[var(--surface-overlay)] transition-colors"
                >
                  取消
                </button>
                <GradientBtn onClick={handleAdd} disabled={!charA || !charB}>
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  添加关系
                </GradientBtn>
              </div>
            </GlassCard>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Character Card ───────────────────────────────────────
function CharacterCard({ char, isSelected, onClick, relationCount }: {
  char: CharNode;
  isSelected: boolean;
  onClick: () => void;
  relationCount: number;
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.03, y: -2 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`relative p-3 rounded-xl border transition-all text-left w-full ${
        isSelected
          ? 'bg-[var(--surface-overlay)] border-[var(--border-strong)] shadow-lg'
          : 'bg-[var(--surface-ground)] border-[var(--border-subtle)] hover:border-[var(--border-strong)]'
      }`}
    >
      <div className="flex items-center gap-3">
        {/* Avatar circle */}
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold text-white shrink-0"
          style={{ background: char.color || '#6366f1' }}
        >
          {char.name[0]}
        </div>
        <div className="min-w-0">
          <div className="text-sm font-semibold text-[var(--text-primary)]">{char.name}</div>
          <div className="flex items-center gap-2 mt-0.5">
            {char.role && (
              <span className="text-[10px] text-[var(--text-muted)] bg-[var(--surface-elevated)] px-1.5 py-0.5 rounded">
                {char.role}
              </span>
            )}
            <span className="text-[10px] text-[var(--text-muted)]">{relationCount}条关系</span>
          </div>
        </div>
      </div>

      {/* Selected indicator */}
      {isSelected && (
        <motion.div
          layoutId="char-select"
          className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center"
          style={{ background: char.color }}
        >
          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </motion.div>
      )}
    </motion.button>
  );
}

// ==================== MAIN ==================================
export default function RelationsClient({ params }: { params: { id: string } }) {
  const [characters, setCharacters] = useState<CharNode[]>(mockChars);
  const [relations, setRelations] = useState<RelationEdge[]>(mockRelations);
  const [addModal, setAddModal] = useState(false);
  const [selectedChar, setSelectedChar] = useState<string | null>(null);

  // 从 localStorage 加载真实角色
  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const userId = user.id || 'demo';
      import('@/lib/store/data-service').then(({ characterService }) => {
        const chars = characterService.listByUser(userId);
        if (chars.length > 0) {
          const nodes: CharNode[] = chars.map((c: Record<string, unknown>, i: number) => ({
            id: String(c.id),
            name: String(c.name || ''),
            role: String(c.narrativeRole || c.archetype || ''),
            color: DEFAULT_CHAR_COLORS[i % DEFAULT_CHAR_COLORS.length],
          }));
          setCharacters(nodes);
        }
      });
    } catch { /* 加载失败则保持 mock 数据 */ }
  }, []);

  const handleAddRelation = (relation: RelationEdge) => {
    setRelations(prev => [...prev, relation]);
  };

  const handleDeleteRelation = (from: string, to: string) => {
    setRelations(prev => prev.filter(r => !(r.from === from && r.to === to)));
  };

  // Stats
  const loveCount = relations.filter(r => r.type === '恋爱' || r.type === '暗恋').length;
  const conflictCount = relations.filter(r => r.type === '敌对' || r.type === '竞争对手').length;
  const positiveCount = relations.filter(r => r.type === '朋友' || r.type === '合作' || r.type === '家人' || r.type === '师生').length;

  return (
    <div className="relative min-h-screen">
      {/* Background effects */}
      <ParticleBg particleCount={50} connectionDistance={120} speed={0.25} colors={[220, 160]} />
      <GlowTrail enabled={true} trailCount={12} dotSize={8} lifetime={600} />
      <FloatingElements count={5} emojis={['💕', '💫', '✨', '👥', '🌟']} className="opacity-15" />

      <div className="relative z-10">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2 text-sm text-[var(--text-muted)] mb-2"
        >
          <Link href="/dashboard/projects" className="hover:text-[var(--text-primary)] transition-colors">项目</Link>
          <span>/</span>
          <Link href={`/dashboard/projects/${params.id}`} className="hover:text-[var(--text-primary)] transition-colors">穿越之我在古代当总裁</Link>
          <span>/</span>
          <span className="text-[var(--text-primary)] font-medium">角色关系</span>
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
            color="#ec4899"
            glowColor="#f472b6"
            className="text-2xl font-bold"
          >
            💕 角色关系图
          </NeonText>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <GradientBtn onClick={() => setAddModal(true)}>
              <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              添加关系
            </GradientBtn>
          </motion.div>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
          className="grid grid-cols-4 gap-3 mb-6"
        >
          <StatCardEnhanced title="角色" value={characters.length} icon="👥" accent="#ec4899" progress={100} progressColor="#ec4899" />
          <StatCardEnhanced title="关系" value={relations.length} icon="🔗" accent="#3b82f6" progress={(relations.length / 15) * 100} progressColor="#3b82f6" />
          <StatCardEnhanced title="情感" value={loveCount} icon="💕" accent="#f472b6" progress={(loveCount / Math.max(relations.length, 1)) * 100} progressColor="#f472b6" />
          <StatCardEnhanced title="冲突" value={conflictCount} icon="⚔️" accent="#ef4444" progress={(conflictCount / Math.max(relations.length, 1)) * 100} progressColor="#ef4444" />
        </motion.div>

        {/* Main layout: Relationship Ring + Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Relationship Ring (spans 2 cols) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.18, duration: 0.4 }}
            className="lg:col-span-2"
          >
            <GlassCard className="p-4 min-h-[520px]">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-[var(--text-secondary)] flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                  </svg>
                  关系网络
                </h3>
                <div className="flex items-center gap-2 text-[10px] text-[var(--text-muted)]">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full" style={{ background: DEFAULT_CHAR_COLORS[0] }} />
                    角色
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-0.5 rounded" style={{ background: '#9ca3af' }} />
                    关系线
                  </span>
                </div>
              </div>
              <CharacterRelationshipRing
                characters={characters}
                relations={relations}
                size={480}
                onCharacterClick={(char) => setSelectedChar(selectedChar === char.id ? null : char.id)}
              />
            </GlassCard>
          </motion.div>

          {/* Right: Character list + relations */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.22, duration: 0.4 }}
            className="space-y-4"
          >
            {/* Character cards */}
            <GlassCard className="p-4">
              <h3 className="text-sm font-semibold text-[var(--text-secondary)] mb-3 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                角色列表
              </h3>
              <div className="space-y-2">
                {characters.map(char => {
                  const relCount = relations.filter(r => r.from === char.id || r.to === char.id).length;
                  return (
                    <CharacterCard
                      key={char.id}
                      char={char}
                      isSelected={selectedChar === char.id}
                      onClick={() => setSelectedChar(selectedChar === char.id ? null : char.id)}
                      relationCount={relCount}
                    />
                  );
                })}
              </div>
            </GlassCard>

            {/* Relation list for selected character */}
            <AnimatePresence mode="wait">
              {selectedChar && (
                <motion.div
                  key={selectedChar}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <GlassCard className="p-4">
                    <h3 className="text-sm font-semibold text-[var(--text-secondary)] mb-3 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                      {characters.find(c => c.id === selectedChar)?.name} 的关系
                    </h3>
                    {relations.filter(r => r.from === selectedChar || r.to === selectedChar).length === 0 ? (
                      <p className="text-xs text-[var(--text-muted)] text-center py-4">暂无关系</p>
                    ) : (
                      <div className="space-y-1.5">
                        {relations
                          .filter(r => r.from === selectedChar || r.to === selectedChar)
                          .map((r, i) => {
                            const isFrom = r.from === selectedChar;
                            const otherId = isFrom ? r.to : r.from;
                            const other = characters.find(c => c.id === otherId);
                            return (
                              <motion.div
                                key={`${r.from}-${r.to}-${i}`}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.06 }}
                                className="flex items-center justify-between p-2 rounded-lg bg-[var(--surface-elevated)] group hover:bg-[var(--surface-overlay)] transition-colors"
                              >
                                <div className="flex items-center gap-2 min-w-0">
                                  <div
                                    className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0"
                                    style={{ background: other?.color || '#6366f1' }}
                                  >
                                    {other?.name?.[0] || '?'}
                                  </div>
                                  <span className="text-xs font-medium text-[var(--text-primary)] truncate">
                                    {other?.name || '?'}
                                  </span>
                                  <RelationBadge type={r.type} />
                                </div>
                                <button
                                  onClick={() => handleDeleteRelation(r.from, r.to)}
                                  className="p-1 text-[var(--text-muted)] hover:text-red-400 hover:bg-red-500/10 rounded transition-all opacity-0 group-hover:opacity-100"
                                  title="删除"
                                >
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              </motion.div>
                            );
                          })}
                      </div>
                    )}
                  </GlassCard>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Quick add hint */}
            {!selectedChar && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-center py-6"
              >
                <span className="text-xs text-[var(--text-muted)]">
                  点击角色查看关系详情 · 点击按钮添加新关系
                </span>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Add Relation Modal */}
      <AddRelationModal
        open={addModal}
        onClose={() => setAddModal(false)}
        chars={characters}
        onAdd={handleAddRelation}
      />
    </div>
  );
}
