'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { OfficialTemplate } from '@/lib/data/character-templates';
import './character-detail-drawer.css';

type Props = {
  open: boolean;
  data: OfficialTemplate | null;
  onClose: () => void;
  onUse?: (data: OfficialTemplate) => void;
  onFavorite?: (id: string) => void;
  isFavorited?: boolean;
};

const personalityLabels: Record<string, string> = {
  extraversion: '外向性',
  agreeableness: '宜人性',
  conscientiousness: '尽责性',
  neuroticism: '神经质',
  openness: '开放性',
};

/* ================================================
   SVG 五边形雷达图 (内联渲染)
   ================================================ */
function RadarChart({ scores }: {
  scores: { key: string; value: number; label: string }[];
}) {
  const cx = 95, cy = 95, r = 70;
  const angleSlice = (Math.PI * 2) / scores.length;

  const getPoint = (i: number, value: number) => {
    const angle = angleSlice * i - Math.PI / 2;
    const dist = (value / 5) * r;
    return {
      x: cx + dist * Math.cos(angle),
      y: cy + dist * Math.sin(angle),
    };
  };

  // 数据多边形
  const dataPoints = scores.map((s, i) => getPoint(i, s.value));
  const dataPolygon = dataPoints.map((p) => `${p.x},${p.y}`).join(' ');

  // 五层背景网格
  const gridLevels = [1, 2, 3, 4, 5];
  const gridPolygons = gridLevels.map((level) => {
    const pts = scores.map((_, i) => getPoint(i, level));
    return pts.map((p) => `${p.x},${p.y}`).join(' ');
  });

  return (
    <svg viewBox="0 0 190 190" className="radar-svg">
      {/* 背景网格 */}
      {gridPolygons.map((pts, idx) => (
        <polygon
          key={`grid-${idx}`}
          points={pts}
          fill="none"
          stroke={idx === 4 ? 'var(--border-default)' : 'var(--border-subtle)'}
          strokeWidth={idx === 4 ? 1.5 : 0.8}
          strokeDasharray={idx < 4 ? '3,3' : undefined}
        />
      ))}
      {/* 轴线 */}
      {scores.map((_, i) => {
        const outer = getPoint(i, 5);
        return (
          <line
            key={`axis-${i}`}
            x1={cx} y1={cy}
            x2={outer.x} y2={outer.y}
            stroke="var(--border-default)"
            strokeWidth={0.8}
          />
        );
      })}
      {/* 数据填充 */}
      <polygon
        points={dataPolygon}
        fill="var(--brand-500)"
        fillOpacity={0.15}
        stroke="var(--brand-400)"
        strokeWidth={1.5}
      />
      {/* 数据点 */}
      {dataPoints.map((p, i) => (
        <circle
          key={`dot-${i}`}
          cx={p.x} cy={p.y}
          r={3.5}
          fill="var(--brand-500)"
          stroke="var(--surface-card)"
          strokeWidth={1.5}
        />
      ))}
      {/* 标签 */}
      {scores.map((s, i) => {
        const label = getPoint(i, 5.8);
        return (
          <text
            key={`label-${i}`}
            x={label.x} y={label.y}
            textAnchor="middle"
            dominantBaseline="middle"
            className="radar-label"
          >
            {s.label}
          </text>
        );
      })}
    </svg>
  );
}

/* ================================================
   主组件
   ================================================ */
export default function CharacterDetailDrawer({
  open,
  data,
  onClose,
  onUse,
  onFavorite,
  isFavorited = false,
}: Props) {
  const [visible, setVisible] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (open) {
      setVisible(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setAnimating(true));
      });
    } else {
      setAnimating(false);
      timerRef.current = setTimeout(() => setVisible(false), 350);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [open]);

  const handleCopyPrompt = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, []);

  if (!visible || !data) return null;

  const d = data.defaultData;
  const radarScores = [
    { key: 'extraversion', value: d.extraversion, label: '外向性' },
    { key: 'agreeableness', value: d.agreeableness, label: '宜人性' },
    { key: 'conscientiousness', value: d.conscientiousness, label: '尽责性' },
    { key: 'neuroticism', value: d.neuroticism, label: '神经质' },
    { key: 'openness', value: d.openness, label: '开放性' },
  ];

  return (
    <div className={`char-drawer-overlay ${animating ? 'open' : ''}`} onClick={onClose}>
      <div
        className={`char-drawer ${animating ? 'open' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ===== 关闭按钮 ===== */}
        <button className="char-drawer-close" onClick={onClose}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        {/* ===== 肖像封面 ===== */}
        <div className="char-drawer-hero" style={{ background: data.coverGradient }}>
          <div className="char-drawer-hero-aura" />
          <div className="char-drawer-emoji-ring">
            <span className="char-drawer-emoji">{data.coverEmoji}</span>
          </div>
          <div className="char-drawer-hero-info">
            <h2 className="char-drawer-hero-name">{data.name}</h2>
            <div className="char-drawer-hero-meta">
              <span className="char-drawer-hero-archetype">{d.archetype}</span>
              <span className="char-drawer-hero-dot">·</span>
              <span>{d.gender}</span>
              <span className="char-drawer-hero-dot">·</span>
              <span>{d.age}岁</span>
              <span className="char-drawer-hero-dot">·</span>
              <span>{d.style}</span>
            </div>
          </div>
        </div>

        {/* ===== 抽屉滚动内容 ===== */}
        <div className="char-drawer-scroll">
          {/* 简介 */}
          <section className="cd-section">
            <p className="cd-desc">{data.description}</p>
            <div className="cd-tags">
              {data.tags.map((t) => (
                <span key={t} className="cd-tag">{t}</span>
              ))}
            </div>
          </section>

          {/* 人格分析 */}
          <section className="cd-section">
            <h3 className="cd-section-title">
              <span className="cd-section-icon">🧠</span> 人格画像
            </h3>
            {/* 雷达图 */}
            <div className="cd-radar-wrap">
              <RadarChart scores={radarScores} />
            </div>
            {/* 双面人格 */}
            <div className="cd-dual-personality">
              <div className="cd-dual-card cd-dual-surface">
                <div className="cd-dual-label">🎭 表面特质</div>
                <div className="cd-dual-traits">
                  {d.surfaceTraits.map((t, i) => (
                    <span key={i} className="cd-dual-tag surface">{t}</span>
                  ))}
                </div>
              </div>
              <div className="cd-dual-arrow">⇄</div>
              <div className="cd-dual-card cd-dual-inner">
                <div className="cd-dual-label">💎 内在特质</div>
                <div className="cd-dual-traits">
                  {d.innerTraits.map((t, i) => (
                    <span key={i} className="cd-dual-tag inner">{t}</span>
                  ))}
                </div>
              </div>
            </div>
            <div className="cd-personality-narrative">
              <p>{d.personality}</p>
            </div>
            <div className="cd-meta-grid">
              <div className="cd-meta-grid-item">
                <span className="cd-meta-grid-label">成长弧</span>
                <span className="cd-meta-grid-value">{d.arcDescription}</span>
              </div>
              <div className="cd-meta-grid-item">
                <span className="cd-meta-grid-label">弱 点</span>
                <span className="cd-meta-grid-value">{d.weakness}</span>
              </div>
              <div className="cd-meta-grid-item">
                <span className="cd-meta-grid-label">欲 望</span>
                <span className="cd-meta-grid-value">{d.desire}</span>
              </div>
              <div className="cd-meta-grid-item">
                <span className="cd-meta-grid-label">声 线</span>
                <span className="cd-meta-grid-value">{d.voiceTone}</span>
              </div>
            </div>
          </section>

          {/* 外观档案 + 背景故事 */}
          <section className="cd-section">
            <h3 className="cd-section-title">
              <span className="cd-section-icon">📋</span> 外观档案
            </h3>
            <div className="cd-info-card">
              <p><strong>外貌：</strong>{d.appearanceDesc}</p>
              <p><strong>面部特征：</strong>{d.facialFeatures}</p>
              <p><strong>服装风格：</strong>{d.costumeStyle}</p>
            </div>
          </section>

          <section className="cd-section">
            <h3 className="cd-section-title">
              <span className="cd-section-icon">📖</span> 背景故事
            </h3>
            <div className="cd-backstory">
              <div className="cd-backstory-line" />
              <p>{d.backstory}</p>
            </div>
          </section>

          {/* 🎬 AI视频生成区 */}
          <section className="cd-section cd-section-ai">
            <h3 className="cd-section-title">
              <span className="cd-section-icon">🎬</span> AI 视频生成
            </h3>

            {/* 提示词 */}
            <div className="cd-ai-prompt-wrap">
              <div className="cd-ai-label">视觉提示词 (Visual Prompt)</div>
              <div className="cd-ai-prompt-box">
                <p className="cd-ai-prompt-text">{d.visualPromptTemplate}</p>
                <button
                  className={`cd-ai-copy-btn ${copied ? 'copied' : ''}`}
                  onClick={() => handleCopyPrompt(d.visualPromptTemplate)}
                >
                  {copied ? '✅ 已复制' : '📋 复制'}
                </button>
              </div>
            </div>

            {/* 灯光/机位信息 */}
            <div className="cd-ai-tech-grid">
              <div className="cd-ai-tech-item">
                <span className="cd-ai-tech-emoji">💡</span>
                <div>
                  <div className="cd-ai-tech-title">灯光风格</div>
                  <div className="cd-ai-tech-text">{d.lightingStyle}</div>
                </div>
              </div>
              <div className="cd-ai-tech-item">
                <span className="cd-ai-tech-emoji">📷</span>
                <div>
                  <div className="cd-ai-tech-title">机位/镜头</div>
                  <div className="cd-ai-tech-text">{d.cameraAngles}</div>
                </div>
              </div>
            </div>

            {/* 关键镜头卡片 */}
            <div className="cd-ai-label" style={{ marginTop: 16 }}>关键镜头 (Key Visual Scenes)</div>
            <div className="cd-ai-scenes">
              {d.keyVisualScenes.map((scene, i) => (
                <div key={i} className="cd-ai-scene-card">
                  <span className="cd-ai-scene-emoji">{scene.emoji}</span>
                  <div className="cd-ai-scene-content">
                    <div className="cd-ai-scene-title">{scene.title}</div>
                    <div className="cd-ai-scene-desc">{scene.description}</div>
                  </div>
                  <span className="cd-ai-scene-num">{String(i + 1).padStart(2, '0')}</span>
                </div>
              ))}
            </div>
          </section>

          {/* 底部留白 */}
          <div className="cd-bottom-spacer" />
        </div>

        {/* ===== 底部操作栏 ===== */}
        <div className="cd-footer">
          <button
            className="cd-footer-use"
            onClick={() => onUse?.(data)}
          >
            <span>立即使用此模板</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
          <button
            className={`cd-footer-fav ${isFavorited ? 'active' : ''}`}
            onClick={() => onFavorite?.(data.id)}
          >
            {isFavorited ? '❤️ 已收藏' : '🤍 收藏'}
          </button>
        </div>
      </div>
    </div>
  );
}
