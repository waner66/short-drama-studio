'use client';

import { memo } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const statusConfig: Record<string, { color: string; bg: string; label: string }> = {
  DRAFT:     { color: '#71717a', bg: 'rgba(113,113,122,0.15)', label: '草稿' },
  WRITING:   { color: '#38bdf8', bg: 'rgba(56,189,248,0.15)', label: '编写中' },
  IN_PROGRESS: { color: '#38bdf8', bg: 'rgba(56,189,248,0.15)', label: '编写中' },
  REVIEW:    { color: '#fbbf24', bg: 'rgba(251,191,36,0.15)', label: '审核中' },
  COMPLETED: { color: '#00d4aa', bg: 'rgba(0,212,170,0.15)', label: '已完成' },
  PUBLISHED: { color: '#a78bfa', bg: 'rgba(167,139,250,0.15)', label: '已发布' },
};

interface StoryCardProps {
  id: string;
  title: string;
  subtitle?: string;
  status: keyof typeof statusConfig;
  progress?: number; // 0-100
  meta?: string;     // e.g. "3 角色 · 5 场景"
  href?: string;
  onClick?: () => void;
}

export const StoryCard = memo(function StoryCard({
  id, title, subtitle, status, progress, meta, href, onClick,
}: StoryCardProps) {
  const st = statusConfig[status] || statusConfig.DRAFT;

  const content = (
    <motion.div
      whileTap={{ scale: 0.985 }}
      className="group relative overflow-hidden rounded-xl cursor-pointer border transition-all duration-200"
      style={{
        background: 'var(--surface-card)',
        borderColor: 'var(--border-subtle)',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'var(--border-default)';
        e.currentTarget.style.boxShadow = 'var(--shadow-elevated)';
        e.currentTarget.style.transform = 'translateY(-1px)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'var(--border-subtle)';
        e.currentTarget.style.boxShadow = 'var(--shadow-card)';
        e.currentTarget.style.transform = 'none';
      }}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') onClick?.(); }}
    >
      {/* 左侧状态条 */}
      <div className="absolute left-0 top-2 bottom-2 w-[3px] rounded-r-full transition-all duration-200 group-hover:w-[5px]"
        style={{ background: st.color }}
      />

      <div className="pl-5 pr-4 py-4">
        {/* 标题行 */}
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <h4 className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
            {title}
          </h4>
          <span className="flex-shrink-0 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium"
            style={{ background: st.bg, color: st.color }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: st.color }}/>
            {st.label}
          </span>
        </div>

        {/* 副标题 */}
        {subtitle && (
          <p className="text-xs mb-2 line-clamp-2" style={{ color: 'var(--text-secondary)' }}>
            {subtitle}
          </p>
        )}

        {/* 进度条 */}
        {progress !== undefined && (
          <div className="mb-2">
            <div className="h-1 rounded-full" style={{ background: 'var(--surface-elevated)' }}>
              <div className="h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, Math.max(0, progress))}%`, background: st.color }}
              />
            </div>
          </div>
        )}

        {/* Meta 信息 */}
        {meta && (
          <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{meta}</p>
        )}
      </div>
    </motion.div>
  );

  if (href) {
    return <Link href={href} className="no-underline">{content}</Link>;
  }
  return content;
});
