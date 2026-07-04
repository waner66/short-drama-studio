'use client';

import { useState, memo } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

interface QuickAction {
  id: string;
  icon: React.ReactNode;
  label: string;
  href?: string;
  onClick?: () => void;
  color?: string;
}

const defaultActions: QuickAction[] = [
  {
    id: 'new-project',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="12" y1="18" x2="12" y2="12"/>
        <line x1="9" y1="15" x2="15" y2="15"/>
      </svg>
    ),
    label: '新建项目',
    href: '/dashboard/projects/new',
    color: '#8b5cf6',
  },
  {
    id: 'new-character',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
        <line x1="20" y1="8" x2="20" y2="14"/>
        <line x1="17" y1="11" x2="23" y2="11"/>
      </svg>
    ),
    label: '创建角色',
    href: '/dashboard/characters/new',
    color: '#06b6d4',
  },
  {
    id: 'market',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
      </svg>
    ),
    label: '模板市场',
    href: '/dashboard/market',
    color: '#f59e0b',
  },
];

export const QuickActionFAB = memo(function QuickActionFAB() {
  const [expanded, setExpanded] = useState(false);
  const router = useRouter();

  const handleClick = (action: QuickAction) => {
    setExpanded(false);
    if (action.onClick) {
      action.onClick();
    } else if (action.href) {
      router.push(action.href);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
      {/* 展开的操作按钮 */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.15 }}
            className="flex flex-col gap-2 mb-2"
          >
            {defaultActions.map((action, i) => (
              <motion.button
                key={action.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: i * 0.04 }}
                onClick={() => handleClick(action)}
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all shadow-lg hover:shadow-xl"
                style={{
                  background: 'var(--surface-card)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-subtle)',
                  boxShadow: `0 4px 12px ${action.color}20`,
                }}
              >
                <span style={{ color: action.color }}>{action.icon}</span>
                <span>{action.label}</span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 主按钮 */}
      <motion.button
        onClick={() => setExpanded(!expanded)}
        animate={{ rotate: expanded ? 45 : 0 }}
        transition={{ duration: 0.2 }}
        whileTap={{ scale: 0.92 }}
        className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg text-white"
        style={{
          background: 'linear-gradient(135deg, var(--brand-500), var(--brand-600))',
          boxShadow: '0 4px 20px rgba(139, 92, 246, 0.35)',
        }}
        aria-label="快捷操作"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <line x1="12" y1="5" x2="12" y2="19"/>
          <line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
      </motion.button>
    </div>
  );
});
