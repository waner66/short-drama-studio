'use client';

import GlassCard from '../ui/glass-card';

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
    name: string;
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

export default function TemplateCard({
  template,
  onClick,
  className = '',
}: TemplateCardProps) {
  return (
    <GlassCard hover onClick={onClick} className={`p-0 overflow-hidden ${className}`}>
      {/* Cover */}
      <div className="relative h-40 bg-gradient-to-br from-purple-900/50 via-slate-900 to-cyan-900/30 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(139,92,246,0.1),transparent)]" />
        {template.coverUrl ? (
          <img src={template.coverUrl} alt={template.title} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center">
            <svg className="h-10 w-10 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-1.5">
          {template.isFree && (
            <span className="rounded-md bg-emerald-500/20 px-2 py-0.5 text-[10px] font-medium text-emerald-400 border border-emerald-500/20">
              免费
            </span>
          )}
          {template.isNew && (
            <span className="rounded-md bg-purple-500/20 px-2 py-0.5 text-[10px] font-medium text-purple-400 border border-purple-500/20">
              新品
            </span>
          )}
          {template.isHot && (
            <span className="rounded-md bg-amber-500/20 px-2 py-0.5 text-[10px] font-medium text-amber-400 border border-amber-500/20">
              热门
            </span>
          )}
        </div>
        {template.category && (
          <span className="absolute bottom-3 left-3 rounded-md bg-black/50 backdrop-blur-sm px-2 py-0.5 text-[10px] text-gray-300">
            {template.category}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <h4 className="font-semibold text-white truncate">{template.title}</h4>
        {template.description && (
          <p className="mt-1 text-xs text-gray-500 line-clamp-2">{template.description}</p>
        )}

        {/* Tags */}
        {template.tags && template.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {template.tags.slice(0, 2).map((tag) => (
              <span key={tag} className="rounded bg-white/5 px-1.5 py-0.5 text-[10px] text-gray-500">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="mt-3 flex items-center justify-between pt-3 border-t border-white/5">
          <div className="flex items-center gap-2">
            {template.creator?.avatar ? (
              <img src={template.creator.avatar} className="h-5 w-5 rounded-full" alt="" />
            ) : (
              <div className="h-5 w-5 rounded-full bg-purple-500/20 flex items-center justify-center text-[8px] text-purple-400">
                {template.creator?.name?.charAt(0) || '?'}
              </div>
            )}
            <span className="text-xs text-gray-500 truncate max-w-[80px]">
              {template.creator?.name || '匿名'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {template.rating !== undefined && (
              <span className="flex items-center gap-0.5 text-xs text-amber-400">
                ⭐ {template.rating.toFixed(1)}
              </span>
            )}
            {template.price !== undefined && !template.isFree && (
              <span className="text-xs font-semibold text-purple-400">
                ¥{template.price}
              </span>
            )}
            {template.sales !== undefined && template.sales > 0 && (
              <span className="text-[10px] text-gray-600">{template.sales} 次购买</span>
            )}
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
