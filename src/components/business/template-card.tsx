'use client';

import React from 'react';

interface Template {
  id: string;
  title: string;
  description?: string;
  coverUrl?: string;
  price?: number;
  rating?: number;
  sales?: number;
  category?: string;
  creator?: {
    id?: string;
    name?: string;
    username?: string;
    avatar?: string;
  };
  tags?: string[];
  isFree?: boolean;
  isNew?: boolean;
  isHot?: boolean;
}

interface TemplateCardProps {
  template: Template;
  onClick?: () => void;
  className?: string;
}

/* Category → gradient mapping (cover background) */
const catGradients: Record<string, string> = {
  '甜宠': 'from-pink-500/40 via-pink-400/20 to-rose-300/10',
  '恋爱': 'from-red-500/40 via-rose-400/20 to-pink-300/10',
  '古装': 'from-amber-500/40 via-yellow-400/20 to-orange-300/10',
  '悬疑': 'from-slate-500/40 via-gray-400/20 to-blue-300/10',
  '逆袭': 'from-orange-500/40 via-red-400/20 to-amber-300/10',
  '都市': 'from-cyan-500/40 via-blue-400/20 to-teal-300/10',
  '奇幻': 'from-purple-500/40 via-violet-400/20 to-fuchsia-300/10',
};

const catAccents: Record<string, string> = {
  '甜宠': 'text-pink-400',
  '恋爱': 'text-red-400',
  '古装': 'text-amber-400',
  '悬疑': 'text-slate-400',
  '逆袭': 'text-orange-400',
  '都市': 'text-cyan-400',
  '奇幻': 'text-purple-400',
};

export default function TemplateCard({
  template,
  onClick,
  className = '',
}: TemplateCardProps) {
  const gradient = catGradients[template.category || ''] || 'from-violet-500/40 via-purple-400/20 to-cyan-300/10';
  const accent = catAccents[template.category || ''] || 'text-violet-400';
  const creatorName = template.creator?.name || template.creator?.username || '匿名';

  return (
    <div
      onClick={onClick}
      className={`
        group cursor-pointer rounded-xl overflow-hidden
        bg-[var(--surface-card)] border border-[var(--border-subtle)]
        shadow-[var(--shadow-card)]
        transition-all duration-200 ease-out
        hover:border-[var(--border-default)] hover:shadow-[var(--shadow-elevated)] hover:-translate-y-0.5
        ${className}
      `}
    >
      {/* ---- Cover area (160px) ---- */}
      <div className={`relative h-40 bg-gradient-to-br ${gradient} overflow-hidden`}>
        {/* Glow effect */}
        <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-white/5 blur-2xl" />

        {template.coverUrl ? (
          <img src={template.coverUrl} alt={template.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="flex h-full items-center justify-center">
            <svg className="h-10 w-10 text-white/20 group-hover:scale-110 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2}
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
        )}

        {/* Category badge */}
        {template.category && (
          <span className="absolute top-3 left-3 rounded-md bg-black/50 backdrop-blur-sm px-2 py-0.5 text-[10px] text-white/70 font-medium">
            {template.category}
          </span>
        )}

        {/* Price badge (top-right) */}
        <span className="absolute top-3 right-3">
          {template.isFree ? (
            <span className="rounded-md bg-emerald-500/80 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-sm">
              免费
            </span>
          ) : (
            <span className="rounded-md bg-black/60 backdrop-blur-sm px-2 py-0.5 text-[10px] font-bold text-amber-400">
              ¥{typeof template.price === 'number' ? template.price.toFixed(1) : template.price}
            </span>
          )}
        </span>
      </div>

      {/* ---- Info area ---- */}
      <div className="p-4">
        {/* Title */}
        <h4 className="font-semibold text-[var(--text-primary)] text-sm truncate group-hover:text-[var(--brand-400)] transition-colors">
          {template.title}
        </h4>

        {/* Description */}
        {template.description && (
          <p className="mt-1 text-xs text-[var(--text-muted)] line-clamp-2 leading-relaxed">
            {template.description}
          </p>
        )}

        {/* Tags */}
        {template.tags && template.tags.length > 0 && (
          <div className="mt-2.5 flex flex-wrap gap-1">
            {template.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="rounded-md bg-[var(--surface-elevated)] px-1.5 py-0.5 text-[10px] text-[var(--text-muted)] font-medium">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* ---- Footer bar ---- */}
        <div className="mt-3 flex items-center justify-between pt-3 border-t border-[var(--border-subtle)]">
          {/* Creator */}
          <div className="flex items-center gap-2 min-w-0">
            {template.creator?.avatar ? (
              <img src={template.creator.avatar} className="h-5 w-5 rounded-full object-cover" alt="" />
            ) : (
              <div className={`h-5 w-5 rounded-full bg-gradient-to-br ${accent} flex items-center justify-center text-[9px] font-bold text-white`}>
                {creatorName.charAt(0).toUpperCase()}
              </div>
            )}
            <span className="text-xs text-[var(--text-muted)] truncate max-w-[80px]">
              {creatorName}
            </span>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {template.rating !== undefined && template.rating > 0 && (
              <span className="flex items-center gap-0.5 text-xs text-amber-400">
                <svg viewBox="0 0 12 12" className="w-2.5 h-2.5" fill="currentColor">
                  <path d="M6 1l1.5 3 3.2.5L8.4 7l.6 3.2L6 8.8 3 10.2l.6-3.2L1.3 4.5 4.5 4 6 1Z"/>
                </svg>
                {template.rating.toFixed(1)}
              </span>
            )}
            {template.sales !== undefined && template.sales > 0 && (
              <span className="text-[10px] text-[var(--text-muted)]">
                {template.sales} 购买
              </span>
            )}
            {template.isHot && (
              <span className="rounded-full bg-rose-500/10 px-1.5 py-0.5 text-[9px] font-medium text-rose-400 border border-rose-500/20">
                热销
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
