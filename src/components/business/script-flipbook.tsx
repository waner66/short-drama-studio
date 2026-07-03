'use client';

import React, { useState } from 'react';

interface ScriptFlibookProps {
  pages: {
    id: string;
    title: string;
    content: string;
    type?: 'dialogue' | 'narration' | 'stage_direction';
    character?: string;
    emotion?: string;
  }[];
  className?: string;
}

export default function ScriptFlipbook({
  pages,
  className = '',
}: ScriptFlibookProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState<'next' | 'prev'>('next');
  const [showTyping, setShowTyping] = useState(true);

  const totalPages = pages.length;

  const goToPage = (direction: 'next' | 'prev') => {
    if (isFlipping) return;
    if (direction === 'next' && currentPage >= totalPages - 1) return;
    if (direction === 'prev' && currentPage <= 0) return;

    setFlipDirection(direction);
    setIsFlipping(true);
    setShowTyping(true);

    setTimeout(() => {
      setCurrentPage((p) => (direction === 'next' ? p + 1 : p - 1));
      setIsFlipping(false);
    }, 500);
  };

  const currentPageData = pages[currentPage];
  if (!currentPageData) return null;

  const typeConfig = {
    dialogue: { icon: '💬', label: '对话', border: '#ec4899', bg: '#ec489910' },
    narration: { icon: '📖', label: '叙述', border: '#8b5cf6', bg: '#8b5cf610' },
    stage_direction: { icon: '🎬', label: '舞台指示', border: '#f59e0b', bg: '#f59e0b10' },
  };

  const config = typeConfig[currentPageData.type || 'narration'];

  return (
    <div className={`relative ${className}`}>
      {/* Page counter */}
      <div className="flex items-center justify-between mb-4 px-2">
        <span className="text-sm text-muted">
          {config.icon} {config.label}
        </span>
        <span className="text-xs text-muted tabular-nums">
          {currentPage + 1} / {totalPages}
        </span>
      </div>

      {/* Book container */}
      <div className="relative overflow-hidden" style={{ perspective: '1200px' }}>
        {/* Current page */}
        <div
          className={`
            surface-card border rounded-xl p-6 relative
            transition-all duration-500
            ${isFlipping
              ? flipDirection === 'next'
                ? 'origin-left'
                : 'origin-right'
              : ''
            }
          `}
          style={{
            borderLeftColor: config.border,
            borderLeftWidth: '3px',
            transform: isFlipping
              ? flipDirection === 'next'
                ? 'rotateY(-95deg)'
                : 'rotateY(95deg)'
              : 'rotateY(0deg)',
            transformStyle: 'preserve-3d',
            opacity: isFlipping ? 0.15 : 1,
            minHeight: '260px',
          }}
        >
          {/* Stage direction / character info */}
          {currentPageData.type === 'dialogue' && currentPageData.character && (
            <div className="flex items-center gap-2 mb-3">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                style={{
                  background: config.border + '25',
                  color: config.border,
                }}
              >
                {currentPageData.character[0]}
              </div>
              <div>
                <div className="text-sm font-semibold text-primary">
                  {currentPageData.character}
                </div>
                {currentPageData.emotion && (
                  <div className="text-xs" style={{ color: config.border }}>
                    {currentPageData.emotion}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Title */}
          <h3 className="text-base font-bold text-primary mb-3 gradient-text">
            {currentPageData.title}
          </h3>

          {/* Content with simulated typing effect */}
          <div
            className={`
              text-sm leading-relaxed text-secondary whitespace-pre-wrap
              ${currentPageData.type === 'dialogue'
                ? 'pl-4 border-l-2 italic'
                : ''
              }
            `}
            style={{
              borderLeftColor: currentPageData.type === 'dialogue' ? config.border : undefined,
            }}
          >
            {showTyping ? (
              <TypingText
                text={currentPageData.content}
                speed={20}
                onComplete={() => setShowTyping(false)}
              />
            ) : (
              currentPageData.content
            )}
          </div>
        </div>

        {/* Next page preview (flip incoming) */}
        {isFlipping && (
          <div
            className={`
              absolute inset-0 surface-card border rounded-xl p-6
              transition-all duration-500
              ${flipDirection === 'next' ? 'origin-right' : 'origin-left'}
            `}
            style={{
              borderRightColor: 'var(--border-subtle)',
              borderRightWidth: '3px',
              transform:
                flipDirection === 'next' ? 'rotateY(85deg)' : 'rotateY(-85deg)',
              opacity: 0.6,
              zIndex: -1,
            }}
          >
            <div className="w-8 h-8 rounded-full bg-surface-elevated shimmer-bg mb-3" />
            <div className="w-1/3 h-4 bg-surface-elevated shimmer-bg rounded mb-2" />
            <div className="w-2/3 h-3 bg-surface-elevated shimmer-bg rounded mb-1" />
            <div className="w-1/2 h-3 bg-surface-elevated shimmer-bg rounded mb-1" />
            <div className="w-3/4 h-3 bg-surface-elevated shimmer-bg rounded" />
          </div>
        )}
      </div>

      {/* Navigation controls */}
      <div className="flex items-center justify-between mt-4 px-2">
        <button
          onClick={() => goToPage('prev')}
          disabled={currentPage === 0 || isFlipping}
          className="px-4 py-2 text-sm rounded-lg border border-subtle text-secondary
            hover:border-brand-400 hover:text-brand-400 disabled:opacity-30 disabled:cursor-not-allowed
            transition-all flex items-center gap-1"
        >
          ← 上一页
        </button>

        <div className="flex gap-1">
          {pages.slice(0, Math.min(totalPages, 15)).map((_, i) => (
            <button
              key={i}
              onClick={() => {
                if (!isFlipping && i !== currentPage) {
                  setFlipDirection(i > currentPage ? 'next' : 'prev');
                  setIsFlipping(true);
                  setShowTyping(true);
                  setTimeout(() => {
                    setCurrentPage(i);
                    setIsFlipping(false);
                  }, 500);
                }
              }}
              className={`
                w-2 h-2 rounded-full transition-all
                ${i === currentPage
                  ? 'bg-brand-500 scale-125'
                  : 'bg-border-subtle hover:bg-brand-400/50'
                }
              `}
            />
          ))}
          {totalPages > 15 && (
            <span className="text-xs text-muted ml-1">...</span>
          )}
        </div>

        <button
          onClick={() => goToPage('next')}
          disabled={currentPage >= totalPages - 1 || isFlipping}
          className="px-4 py-2 text-sm rounded-lg border border-subtle text-secondary
            hover:border-brand-400 hover:text-brand-400 disabled:opacity-30 disabled:cursor-not-allowed
            transition-all flex items-center gap-1"
        >
          下一页 →
        </button>
      </div>
    </div>
  );
}

// Typing text sub-component
function TypingText({
  text,
  speed = 30,
  onComplete,
}: {
  text: string;
  speed?: number;
  onComplete?: () => void;
}) {
  const [displayed, setDisplayed] = useState('');
  const [cursor, setCursor] = useState(true);

  React.useEffect(() => {
    if (displayed.length >= text.length) {
      onComplete?.();
      return;
    }
    const timer = setTimeout(() => {
      setDisplayed(text.slice(0, displayed.length + 1));
    }, speed);
    return () => clearTimeout(timer);
  }, [displayed, text, speed, onComplete]);

  React.useEffect(() => {
    const blink = setInterval(() => setCursor((c) => !c), 500);
    return () => clearInterval(blink);
  }, []);

  return (
    <>
      {displayed}
      {displayed.length < text.length && (
        <span
          className="inline-block w-0.5 h-4 ml-0.5 align-text-bottom bg-brand-400"
          style={{ opacity: cursor ? 1 : 0, transition: 'opacity 0.1s' }}
        />
      )}
    </>
  );
}
