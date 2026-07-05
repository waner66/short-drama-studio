'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import GradientBtn from '@/components/ui/gradient-btn';

interface BundleItem {
  id: string;
  name: string;
  price: number;
  coverEmoji?: string;
  type: 'character' | 'scene' | 'plot';
}

interface TemplateBundleModalProps {
  open: boolean;
  onClose: () => void;
  primaryId: string;
  primaryType: 'character' | 'scene' | 'plot';
  primaryName: string;
}

export default function TemplateBundleModal({ open, onClose, primaryId, primaryType, primaryName }: TemplateBundleModalProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [bundle, setBundle] = useState<{ matchedScenes: BundleItem[]; matchedPlots: BundleItem[]; matchedCharacters: BundleItem[] } | null>(null);
  const [selectedScene, setSelectedScene] = useState<string>('');
  const [selectedPlot, setSelectedPlot] = useState<string>('');
  const [selectedCharacter, setSelectedCharacter] = useState<string>('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (!open || !primaryId) return;
    async function loadBundle() {
      setLoading(true);
      const res = await fetch(`/api/templates/bundle?type=${primaryType}&id=${primaryId}`);
      if (res.ok) {
        const data = await res.json();
        setBundle(data);
        if (data.matchedScenes?.[0]) setSelectedScene(data.matchedScenes[0].id);
        if (data.matchedPlots?.[0]) setSelectedPlot(data.matchedPlots[0].id);
        if (data.matchedCharacters?.[0]) setSelectedCharacter(data.matchedCharacters[0].id);
      }
      setLoading(false);
    }
    loadBundle();
  }, [open, primaryId, primaryType]);

  const allItems: BundleItem[] = [
    ...(bundle?.matchedCharacters || []).map(c => ({ ...c, type: 'character' as const })),
    ...(bundle?.matchedScenes || []).map(s => ({ ...s, type: 'scene' as const })),
    ...(bundle?.matchedPlots || []).map(p => ({ ...p, type: 'plot' as const })),
  ];

  const totalPrice = allItems
    .filter(item =>
      (item.type === 'character' && item.id === selectedCharacter) ||
      (item.type === 'scene' && item.id === selectedScene) ||
      (item.type === 'plot' && item.id === selectedPlot)
    )
    .reduce((sum, item) => sum + (item.price || 0), 0);

  const handleCreateProject = () => {
    setCreating(true);
    const bundleParam = [selectedCharacter, selectedScene, selectedPlot].filter(Boolean).join(',');
    router.push(`/dashboard/projects/new?bundle=${bundleParam}&name=${encodeURIComponent(primaryName)}`);
    setCreating(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border"
            style={{ background: 'var(--surface-card)', borderColor: 'var(--border-subtle)' }}
          >
            <div className="px-6 pt-6 pb-4 text-center">
              <span className="text-3xl">🎁</span>
              <h3 className="text-lg font-bold mt-2" style={{ color: 'var(--text-primary)' }}>创作 Starter Kit</h3>
              <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>一键打包：角色 + 场景 + 剧情</p>
            </div>

            {loading ? (
              <div className="px-6 pb-6 space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-16 rounded-xl animate-pulse" style={{ background: 'var(--surface-elevated)' }} />
                ))}
              </div>
            ) : bundle ? (
              <div className="px-6 pb-4 space-y-2">
                {/* 角色 */}
                {(bundle?.matchedCharacters ?? []).length > 0 && (
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>👤 角色</p>
                    <div className="flex flex-wrap gap-2">
                      {(bundle?.matchedCharacters ?? []).map(c => (
                        <button key={c.id}
                          onClick={() => setSelectedCharacter(c.id)}
                          className={`px-3 py-2 rounded-lg text-xs transition-all ${
                            selectedCharacter === c.id ? 'ring-2 ring-brand-500 bg-brand-500/10 text-brand-500' : 'text-[var(--text-secondary)]'
                          }`}
                          style={{ background: selectedCharacter === c.id ? 'rgba(139,92,246,0.1)' : 'var(--surface-elevated)' }}>
                          {c.coverEmoji || ''} {c.name} {c.price > 0 ? `¥${c.price}` : '免费'}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* 场景 */}
                {(bundle?.matchedScenes ?? []).length > 0 && (
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>🎬 场景</p>
                    <div className="flex flex-wrap gap-2">
                      {(bundle?.matchedScenes ?? []).map(s => (
                        <button key={s.id}
                          onClick={() => setSelectedScene(s.id)}
                          className={`px-3 py-2 rounded-lg text-xs transition-all ${
                            selectedScene === s.id ? 'ring-2 ring-cyan-500 bg-cyan-500/10 text-cyan-400' : 'text-[var(--text-secondary)]'
                          }`}
                          style={{ background: selectedScene === s.id ? 'rgba(6,182,212,0.1)' : 'var(--surface-elevated)' }}>
                          {s.coverEmoji || ''} {s.name} {s.price > 0 ? `¥${s.price}` : '免费'}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* 剧情 */}
                {(bundle?.matchedPlots ?? []).length > 0 && (
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>📖 剧情</p>
                    <div className="flex flex-wrap gap-2">
                      {bundle.matchedPlots.map(p => (
                        <button key={p.id}
                          onClick={() => setSelectedPlot(p.id)}
                          className={`px-3 py-2 rounded-lg text-xs transition-all ${
                            selectedPlot === p.id ? 'ring-2 ring-amber-500 bg-amber-500/10 text-amber-400' : 'text-[var(--text-secondary)]'
                          }`}
                          style={{ background: selectedPlot === p.id ? 'rgba(245,158,11,0.1)' : 'var(--surface-elevated)' }}>
                          {p.coverEmoji || ''} {p.name} {p.price > 0 ? `¥${p.price}` : '免费'}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : null}

            {/* Footer */}
            <div className="px-6 pb-6 flex gap-3">
              <button onClick={onClose}
                className="flex-1 py-3 rounded-xl text-sm font-medium transition-colors"
                style={{ background: 'var(--surface-elevated)', color: 'var(--text-secondary)' }}>
                取消
              </button>
              <GradientBtn onClick={handleCreateProject} loading={creating} className="flex-[2] justify-center">
                🚀 一键创建项目
              </GradientBtn>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
