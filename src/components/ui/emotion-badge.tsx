'use client';

import { memo } from 'react';

const presets: Record<string, { emoji: string; label: string }> = {
  angry:  { emoji: '😤', label: '愤怒' },
  sad:    { emoji: '🌧️', label: '悲伤' },
  hope:   { emoji: '✨', label: '希望' },
  fire:   { emoji: '🔥', label: '燃' },
  warmth: { emoji: '💚', label: '温情' },
  horror: { emoji: '😱', label: '惊悚' },
  calm:   { emoji: '🌿', label: '平静' },
  joy:    { emoji: '🎉', label: '欢乐' },
  tense:  { emoji: '⚡', label: '紧张' },
};

const palette: Record<string, { bg: string; color: string }> = {
  angry:  { bg: 'rgba(239,68,68,0.12)',  color: '#fca5a5' },
  sad:    { bg: 'rgba(59,130,246,0.12)', color: '#93c5fd' },
  hope:   { bg: 'rgba(251,191,36,0.12)', color: '#fde68a' },
  fire:   { bg: 'rgba(249,115,22,0.12)', color: '#fdba74' },
  warmth: { bg: 'rgba(236,72,153,0.12)', color: '#f9a8d4' },
  horror: { bg: 'rgba(99,102,241,0.12)', color: '#c4b5fd' },
  calm:   { bg: 'rgba(16,185,129,0.12)', color: '#6ee7b7' },
  joy:    { bg: 'rgba(245,158,11,0.12)', color: '#fcd34d' },
  tense:  { bg: 'rgba(6,182,212,0.12)',  color: '#67e8f9' },
};

interface EmotionBadgeProps {
  type: keyof typeof presets;
  size?: 'sm' | 'md';
  className?: string;
}

export const EmotionBadge = memo(function EmotionBadge({ type, size = 'md', className = '' }: EmotionBadgeProps) {
  const preset = presets[type] || { emoji: '❓', label: type };
  const color = palette[type] || { bg: 'rgba(139,92,246,0.12)', color: '#a78bfa' };
  const sizeClass = size === 'sm' ? 'text-[10px] px-1.5 py-0.5 gap-0.5' : 'text-xs px-2.5 py-1 gap-1';

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium transition-all duration-200 hover:scale-[1.05] ${sizeClass} ${className}`}
      style={{ background: color.bg, color: color.color }}
    >
      <span className="leading-none">{preset.emoji}</span>
      <span>{preset.label}</span>
    </span>
  );
});

export const emotionTypes = Object.keys(presets);
