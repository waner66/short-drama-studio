'use client';

import React, { useState } from 'react';
import type { OfficialTemplate } from '@/lib/data/character-templates';
import './character-card.css';

type CharacterCardProps = {
  data: OfficialTemplate;
  onClick?: (data: OfficialTemplate) => void;
  onUse?: (data: OfficialTemplate) => void;
  onFavorite?: (id: string) => void;
  isFavorited?: boolean;
};

const genreThemeColors: Record<string, { accent: string; light: string; dark: string; glow: string }> = {
  '甜宠恋爱':   { accent: '#ff6b9d', light: '#ffe0ec', dark: '#c44569', glow: 'rgba(255,107,157,0.35)' },
  '悬疑推理':   { accent: '#5b6abf', light: '#e8eaf6', dark: '#3a4790', glow: 'rgba(91,106,191,0.35)' },
  '古装仙侠':   { accent: '#d4a574', light: '#fef5ed', dark: '#8b5e3c', glow: 'rgba(212,165,116,0.35)' },
  '校园青春':   { accent: '#48c9b0', light: '#e0f7f4', dark: '#1e8e7a', glow: 'rgba(72,201,176,0.35)' },
  '逆袭爽文':   { accent: '#e67e22', light: '#fdf2e9', dark: '#ba4a00', glow: 'rgba(230,126,34,0.35)' },
};

const personalityLabels: Record<string, string> = {
  extraversion: '外向性',
  agreeableness: '宜人性',
  conscientiousness: '尽责性',
  neuroticism: '神经质',
  openness: '开放性',
};

export default function CharacterCard({
  data,
  onClick,
  onUse,
  onFavorite,
  isFavorited = false,
}: CharacterCardProps) {
  const [imageError, setImageError] = useState(false);
  const theme = genreThemeColors[data.genre] || genreThemeColors['甜宠恋爱'];

  const d = data.defaultData;
  const personalityScores = [
    { key: 'extraversion', value: d.extraversion, emoji: '🎭' },
    { key: 'agreeableness', value: d.agreeableness, emoji: '🤝' },
    { key: 'conscientiousness', value: d.conscientiousness, emoji: '🎯' },
    { key: 'neuroticism', value: d.neuroticism, emoji: '🌊' },
    { key: 'openness', value: d.openness, emoji: '💡' },
  ];

  return (
    <div
      className={`character-card ${theme.accent ? '' : ''}`}
      style={{ '--card-accent': theme.accent, '--card-light': theme.light, '--card-dark': theme.dark, '--card-glow': theme.glow } as React.CSSProperties}
      onClick={() => onClick?.(data)}
    >
      {/* ===== 封面区 ===== */}
      <div className="cc-cover" style={{ background: data.coverGradient }}>
        {/* 装饰光晕 */}
        <div className="cc-cover-aura" />
        <div className="cc-cover-circle cc-cover-circle-1" />
        <div className="cc-cover-circle cc-cover-circle-2" />

        {/* Emoji */}
        {!imageError && (
          <div className="cc-cover-emoji-wrap">
            <span className="cc-cover-emoji">{data.coverEmoji}</span>
          </div>
        )}

        {/* Archetype 金标 */}
        <div className="cc-archetype-badge">
          <span className="cc-archetype-icon">✦</span>
          {d.archetype}
        </div>

        {/* 底部渐变遮罩 */}
        <div className="cc-cover-gradient-mask" />
      </div>

      {/* ===== 信息区 ===== */}
      <div className="cc-body">
        {/* 名字 + 价格 */}
        <div className="cc-header">
          <h3 className="cc-name">{data.name}</h3>
          <span className={`cc-price ${data.price === 0 ? 'free' : 'paid'}`}>
            {data.price === 0 ? '免费' : `¥${data.price}`}
          </span>
        </div>

        {/* 基本信息条 */}
        <div className="cc-meta-strip">
          <span className="cc-meta-item">
            <span className="cc-meta-dot" style={{ background: d.gender === '女' ? '#ff6b9d' : '#4a90d9' }} />
            {d.gender}
          </span>
          <span className="cc-meta-sep" />
          <span className="cc-meta-item">{d.age}岁</span>
          <span className="cc-meta-sep" />
          <span className="cc-meta-item cc-meta-style">{d.style}</span>
        </div>

        {/* 描述 */}
        <p className="cc-desc">{data.description}</p>

        {/* 标签 */}
        <div className="cc-tags">
          {d.surfaceTraits.map((t, i) => (
            <span key={`s-${i}`} className="cc-tag cc-tag-surface">{t}</span>
          ))}
          {d.surfaceTraits.length > 0 && d.innerTraits.length > 0 && (
            <span className="cc-tag-divider">→</span>
          )}
          {d.innerTraits.map((t, i) => (
            <span key={`i-${i}`} className="cc-tag cc-tag-inner">{t}</span>
          ))}
        </div>

        {/* 大五人格迷你进度条 */}
        <div className="cc-personality">
          <div className="cc-personality-label">大五人格</div>
          <div className="cc-personality-bars">
            {personalityScores.map(p => (
              <div key={p.key} className="cc-pbar-wrap" title={`${personalityLabels[p.key]}: ${p.value}/5`}>
                <span className="cc-pbar-emoji">{p.emoji}</span>
                <div className="cc-pbar-track">
                  <div
                    className="cc-pbar-fill"
                    style={{
                      width: `${(p.value / 5) * 100}%`,
                      background: p.value >= 4 ? theme.accent : p.value >= 3 ? theme.dark : '#999',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 口头禅 + 招牌动作 */}
        <div className="cc-signatures">
          <div className="cc-sig-item cc-sig-catchphrase">
            <span className="cc-sig-icon">💬</span>
            <span className="cc-sig-text">{d.catchphrase}</span>
          </div>
          <div className="cc-sig-item cc-sig-action">
            <span className="cc-sig-icon">🎬</span>
            <span className="cc-sig-text">{d.signatureAction}</span>
          </div>
        </div>

        {/* 底部操作栏 */}
        <div className="cc-actions">
          <button
            className="cc-btn-use"
            style={{ background: theme.accent }}
            onClick={(e) => { e.stopPropagation(); onUse?.(data); }}
          >
            使用此模板
          </button>
          <button
            className={`cc-btn-fav ${isFavorited ? 'active' : ''}`}
            onClick={(e) => { e.stopPropagation(); onFavorite?.(data.id); }}
          >
            {isFavorited ? '❤️' : '🤍'}
          </button>
        </div>
      </div>
    </div>
  );
}
