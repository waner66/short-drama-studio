'use client';

import React, { useState, useRef, useEffect } from 'react';

export interface TimelineScene {
  id: string;
  title: string;
  location?: string;
  time?: string;
  mood?: string;   // 紧张/温馨/悲伤/欢乐/悬疑
  characters?: string[];
  summary?: string;
  order: number;
}

interface SceneTimelineVisualProps {
  scenes: TimelineScene[];
  onSceneClick?: (scene: TimelineScene) => void;
  onReorder?: (fromIndex: number, toIndex: number) => void;
  className?: string;
}

const MOOD_GRADIENTS: Record<string, string> = {
  '紧张': '#ef4444',
  '温馨': '#f59e0b',
  '悲伤': '#3b82f6',
  '欢乐': '#22c55e',
  '悬疑': '#8b5cf6',
};

const MOOD_EMOJI: Record<string, string> = {
  '紧张': '😰',
  '温馨': '🏠',
  '悲伤': '😢',
  '欢乐': '🎉',
  '悬疑': '🔍',
};

export default function SceneTimelineVisual({
  scenes,
  onSceneClick,
  onReorder,
  className = '',
}: SceneTimelineVisualProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const sortedScenes = [...scenes].sort((a, b) => a.order - b.order);

  // Auto-advance active index animation
  useEffect(() => {
    if (sortedScenes.length <= 1) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % sortedScenes.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [sortedScenes.length]);

  const handleDragStart = (index: number) => {
    setDragIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDrop = (index: number) => {
    if (dragIndex !== null && dragIndex !== index) {
      onReorder?.(dragIndex, index);
    }
    setDragIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDragIndex(null);
    setDragOverIndex(null);
  };

  if (sortedScenes.length === 0) {
    return (
      <div className={`surface-card p-8 text-center text-muted ${className}`}>
        暂无场景
      </div>
    );
  }

  return (
    <div ref={containerRef} className={`${className}`}>
      {/* Timeline track */}
      <div className="relative">
        {/* Central track line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-brand-500/60 via-brand-400/30 to-brand-500/10 transform -translate-x-1/2" />

        <div className="relative">
          {sortedScenes.map((scene, idx) => {
            const isLeft = idx % 2 === 0;
            const isActive = idx === activeIndex;
            const isDragging = idx === dragIndex;
            const isDragOver = idx === dragOverIndex;
            const moodColor = scene.mood ? MOOD_GRADIENTS[scene.mood] || '#8b5cf6' : '#8b5cf6';
            const moodEmoji = scene.mood ? MOOD_EMOJI[scene.mood] || '📍' : '📍';

            return (
              <div
                key={scene.id}
                draggable
                onDragStart={() => handleDragStart(idx)}
                onDragOver={(e) => handleDragOver(e, idx)}
                onDrop={() => handleDrop(idx)}
                onDragEnd={handleDragEnd}
                onClick={() => {
                  setActiveIndex(idx);
                  onSceneClick?.(scene);
                }}
                className={`
                  relative flex items-center mb-4 cursor-pointer group
                  transition-all duration-300
                  ${isDragging ? 'opacity-40 scale-95' : ''}
                  ${isDragOver ? 'scale-105' : ''}
                `}
                style={{
                  flexDirection: isLeft ? 'row' : 'row-reverse',
                }}
              >
                {/* Content card */}
                <div
                  className={`
                    w-[calc(50%-32px)] surface-card border p-4 transition-all duration-300
                    ${isActive
                      ? 'border-brand-500/50 shadow-glow-brand scale-[1.02]'
                      : 'border-subtle hover:border-default hover:shadow-elevated'
                    }
                    ${isLeft ? 'mr-auto' : 'ml-auto'}
                  `}
                  style={{
                    borderLeftColor: isLeft ? moodColor : undefined,
                    borderLeftWidth: isLeft ? '3px' : undefined,
                    borderRightColor: !isLeft ? moodColor : undefined,
                    borderRightWidth: !isLeft ? '3px' : undefined,
                  }}
                >
                  {/* Header */}
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span
                        className="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold"
                        style={{
                          background: moodColor + '20',
                          color: moodColor,
                          border: `1.5px solid ${moodColor}40`,
                        }}
                      >
                        {idx + 1}
                      </span>
                      <span className="text-sm font-semibold text-primary">{scene.title}</span>
                    </div>
                    <span className="text-lg">{moodEmoji}</span>
                  </div>

                  {/* Meta info */}
                  <div className="flex items-center gap-3 text-xs text-muted mb-1.5">
                    {scene.location && (
                      <span className="flex items-center gap-0.5">📍 {scene.location}</span>
                    )}
                    {scene.time && (
                      <span className="flex items-center gap-0.5">🕐 {scene.time}</span>
                    )}
                  </div>

                  {/* Characters */}
                  {scene.characters && scene.characters.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-1.5">
                      {scene.characters.map((c) => (
                        <span
                          key={c}
                          className="px-1.5 py-0.5 text-[10px] rounded-full bg-surface-elevated text-muted border border-subtle"
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Summary */}
                  {scene.summary && (
                    <p className="text-xs text-secondary leading-relaxed line-clamp-2">
                      {scene.summary}
                    </p>
                  )}
                </div>

                {/* Timeline node */}
                <div
                  className={`
                    absolute left-1/2 transform -translate-x-1/2 z-10
                    w-5 h-5 rounded-full border-2 transition-all duration-300
                    ${isActive ? 'scale-125' : 'scale-100'}
                  `}
                  style={{
                    background: isActive ? moodColor : 'var(--surface-card)',
                    borderColor: moodColor,
                    boxShadow: isActive
                      ? `0 0 12px ${moodColor}, 0 0 24px ${moodColor}40`
                      : `0 0 0 0 ${moodColor}00`,
                    animation: isActive ? `timelinePulse 2s ease-in-out infinite` : 'none',
                  }}
                />

                {/* Connection line to node */}
                <div
                  className={`absolute top-1/2 w-[32px] h-0.5 -translate-y-1/2 ${isLeft ? 'right-1/2' : 'left-1/2'}`}
                  style={{
                    background: `linear-gradient(${isLeft ? 'to right' : 'to left'}, ${moodColor}50, ${moodColor})`,
                    opacity: isActive ? 1 : 0.4,
                    transition: 'opacity 0.3s',
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        @keyframes timelinePulse {
          0%, 100% { box-shadow: 0 0 8px currentColor, 0 0 16px currentColor 40; }
          50% { box-shadow: 0 0 16px currentColor, 0 0 32px currentColor 60; }
        }
      `}</style>
    </div>
  );
}
