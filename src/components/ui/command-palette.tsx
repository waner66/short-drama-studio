'use client';

import { useState, useEffect, useCallback, useRef, memo } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

interface CommandItem {
  id: string;
  label: string;
  icon: string;
  group: string;
  action: () => void;
}

export const CommandPalette = memo(function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // ⌘K / Ctrl+K 唤起
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(prev => !prev);
        setQuery('');
        setActiveIndex(0);
      }
      if (e.key === 'Escape' && open) {
        setOpen(false);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open]);

  // 自动聚焦输入框
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  const close = useCallback(() => setOpen(false), []);

  // 命令列表
  const commands: CommandItem[] = [
    { id: 'new-project',  label: '新建项目',     icon: '📝', group: '快速操作', action: () => { close(); router.push('/dashboard/projects/new'); } },
    { id: 'new-char',     label: '创建角色',     icon: '👤', group: '快速操作', action: () => { close(); router.push('/dashboard/characters/new'); } },
    { id: 'market',       label: '浏览模板市场', icon: '🛒', group: '页面导航', action: () => { close(); router.push('/dashboard/market'); } },
    { id: 'scripts',      label: '剧本中心',     icon: '📜', group: '页面导航', action: () => { close(); router.push('/dashboard/scripts'); } },
    { id: 'community',    label: '社区广场',     icon: '💬', group: '页面导航', action: () => { close(); router.push('/dashboard/community'); } },
    { id: 'orders',       label: '我的订单',     icon: '📦', group: '页面导航', action: () => { close(); router.push('/dashboard/orders'); } },
    { id: 'templates',    label: '我的模板',     icon: '🎨', group: '创作者',   action: () => { close(); router.push('/dashboard/templates'); } },
    { id: 'profile',      label: '个人中心',     icon: '⚙️', group: '设置',     action: () => { close(); router.push('/dashboard/profile'); } },
  ];

  // 过滤
  const filtered = query
    ? commands.filter(c => c.label.toLowerCase().includes(query.toLowerCase()))
    : commands;

  // 分组
  const grouped = new Map<string, CommandItem[]>();
  filtered.forEach(c => {
    if (!grouped.has(c.group)) grouped.set(c.group, []);
    grouped.get(c.group)!.push(c);
  });

  // 键盘导航
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(i => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(i => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const item = filtered[activeIndex];
      if (item) item.action();
    }
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-[15vh]">
        {/* 遮罩 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={close}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* 面板 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          transition={{ duration: 0.15 }}
          className="relative w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl border"
          style={{ background: 'var(--surface-card)', borderColor: 'var(--border-default)' }}
        >
          {/* 搜索框 */}
          <div className="flex items-center gap-3 px-4 py-3 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
            <svg className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--text-muted)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={e => { setQuery(e.target.value); setActiveIndex(0); }}
              onKeyDown={handleKeyDown}
              placeholder="搜索项目、角色、页面..."
              className="flex-1 bg-transparent border-none outline-none text-sm placeholder:text-[var(--text-muted)]"
              style={{ color: 'var(--text-primary)' }}
            />
            <kbd className="text-[10px] px-1.5 py-0.5 rounded font-mono border"
              style={{ background: 'var(--surface-elevated)', color: 'var(--text-muted)', borderColor: 'var(--border-subtle)' }}>
              esc
            </kbd>
          </div>

          {/* 命令列表 */}
          <div className="max-h-72 overflow-y-auto p-2">
            {grouped.size === 0 ? (
              <p className="text-center py-8 text-sm" style={{ color: 'var(--text-muted)' }}>无匹配结果</p>
            ) : (
              Array.from(grouped.entries()).map(([group, items]) => (
                <div key={group} className="mb-1">
                  <p className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider"
                    style={{ color: 'var(--text-muted)' }}>
                    {group}
                  </p>
                  {items.map(item => {
                    const idx = filtered.indexOf(item);
                    const isActive = idx === activeIndex;
                    return (
                      <button
                        key={item.id}
                        onClick={item.action}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-sm transition-colors ${
                          isActive ? 'bg-brand-500/10 text-brand-500' : ''
                        }`}
                        style={{ color: isActive ? 'var(--brand-500)' : 'var(--text-primary)' }}
                        onMouseEnter={() => setActiveIndex(idx)}
                      >
                        <span className="text-base w-5 text-center">{item.icon}</span>
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              ))
            )}
          </div>

          {/* 底部提示 */}
          <div className="flex items-center gap-4 px-4 py-2 border-t text-[10px]"
            style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-muted)' }}>
            <span>↑↓ 导航</span>
            <span>↵ 选择</span>
            <span>esc 关闭</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
});
