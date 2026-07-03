'use client';

import { useState } from 'react';

type HairStyle = 'short' | 'long' | 'ponytail' | 'ancient' | 'bob' | 'curly';
type FaceShape = 'round' | 'oval' | 'square' | 'heart';
type Expression = 'smile' | 'cool' | 'gentle' | 'serious' | 'mysterious';
type ColorTheme = 'warm' | 'cool' | 'dark' | 'fantasy';

export interface FaceConfig {
  hairStyle: HairStyle;
  faceShape: FaceShape;
  expression: Expression;
  colorTheme: ColorTheme;
}

interface FaceBuilderProps {
  gender: string;
  value: FaceConfig;
  onChange: (config: FaceConfig) => void;
}

const HAIR_OPTIONS: { key: HairStyle; label: string; icon: string }[] = [
  { key: 'short', label: '短发', icon: '✂' },
  { key: 'long', label: '长发', icon: '💇' },
  { key: 'ponytail', label: '马尾', icon: '🎀' },
  { key: 'ancient', label: '古风', icon: '🏮' },
  { key: 'bob', label: '波波头', icon: '💁' },
  { key: 'curly', label: '卷发', icon: '🌀' },
];

const FACE_OPTIONS: { key: FaceShape; label: string; icon: string }[] = [
  { key: 'round', label: '圆脸', icon: '😊' },
  { key: 'oval', label: '鹅蛋脸', icon: '😌' },
  { key: 'square', label: '方脸', icon: '😐' },
  { key: 'heart', label: '瓜子脸', icon: '😏' },
];

const EXPRESSION_OPTIONS: { key: Expression; label: string; icon: string }[] = [
  { key: 'smile', label: '微笑', icon: '😊' },
  { key: 'cool', label: '冷酷', icon: '😎' },
  { key: 'gentle', label: '温柔', icon: '🥰' },
  { key: 'serious', label: '严肃', icon: '🤨' },
  { key: 'mysterious', label: '神秘', icon: '🤫' },
];

const COLOR_OPTIONS: { key: ColorTheme; label: string; colors: string[] }[] = [
  { key: 'warm', label: '暖色', colors: ['#f97316', '#ef4444', '#fbbf24'] },
  { key: 'cool', label: '冷色', colors: ['#3b82f6', '#6366f1', '#06b6d4'] },
  { key: 'dark', label: '暗黑', colors: ['#6b21a8', '#4c1d95', '#1e1b4b'] },
  { key: 'fantasy', label: '仙气', colors: ['#a78bfa', '#f0abfc', '#67e8f9'] },
];

const THEME_COLORS: Record<ColorTheme, { bg: string; accent: string; skin: string; hair: string; eye: string }> = {
  warm: { bg: 'url(#warmGrad)', accent: '#f97316', skin: '#fddcab', hair: '#78350f', eye: '#422006' },
  cool: { bg: 'url(#coolGrad)', accent: '#3b82f6', skin: '#fde8d0', hair: '#1e293b', eye: '#0f172a' },
  dark: { bg: 'url(#darkGrad)', accent: '#a855f7', skin: '#f5d5cb', hair: '#0f0f1a', eye: '#1a0533' },
  fantasy: { bg: 'url(#fantasyGrad)', accent: '#c084fc', skin: '#ffe4d0', hair: '#2d1b4e', eye: '#4c1d95' },
};

export default function FaceBuilder({ gender, value, onChange }: FaceBuilderProps) {
  const update = (partial: Partial<FaceConfig>) => onChange({ ...value, ...partial });
  const theme = THEME_COLORS[value.colorTheme];
  const isMale = gender === '男';

  return (
    <div className="space-y-5">
      {/* 头像预览 */}
      <div className="flex justify-center">
        <div className="relative w-48 h-48 rounded-2xl overflow-hidden shadow-2xl ring-2 ring-white/10 group">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <defs>
              <linearGradient id="warmGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f97316" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#ef4444" stopOpacity="0.2" />
              </linearGradient>
              <linearGradient id="coolGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#6366f1" stopOpacity="0.2" />
              </linearGradient>
              <linearGradient id="darkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6b21a8" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#1e1b4b" stopOpacity="0.3" />
              </linearGradient>
              <linearGradient id="fantasyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#67e8f9" stopOpacity="0.2" />
              </linearGradient>
            </defs>
            {/* 背景 */}
            <rect width="200" height="200" fill={theme.bg} rx="1" />
            {/* 装饰光环 */}
            <circle cx="100" cy="90" r="72" fill="none" stroke={theme.accent} strokeWidth="1" strokeOpacity="0.15" />
            <circle cx="100" cy="90" r="68" fill="none" stroke={theme.accent} strokeWidth="0.5" strokeOpacity="0.1"
              strokeDasharray="4 8">
              <animateTransform attributeName="transform" type="rotate" from="0 100 90" to="360 100 90"
                dur="20s" repeatCount="indefinite" />
            </circle>

            {/* 头发 - 根据发型变化 */}
            {renderHair(value.hairStyle, isMale, theme.hair)}
            {/* 脸型 */}
            {renderFace(value.faceShape, theme.skin)}
            {/* 表情 */}
            {renderExpression(value.expression, theme.eye)}
          </svg>
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-3">
            <span className="text-white/80 text-xs font-medium">正在捏脸中...</span>
          </div>
        </div>
      </div>

      {/* 配色主题选择器 */}
      <div>
        <label className="block text-xs text-gray-400 mb-2 font-medium">🎨 配色主题</label>
        <div className="grid grid-cols-4 gap-2">
          {COLOR_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              onClick={() => update({ colorTheme: opt.key })}
              className={`h-12 rounded-xl flex flex-col items-center justify-center gap-1 transition-all ${
                value.colorTheme === opt.key
                  ? 'ring-2 ring-white/60 scale-105'
                  : 'ring-1 ring-white/10 hover:ring-white/30'
              }`}
              style={{ background: `linear-gradient(135deg, ${opt.colors.join(', ')})` }}
            >
              <span className="text-xs font-bold text-white drop-shadow-md">{opt.label}</span>
              <div className="flex gap-0.5">
                {opt.colors.map((c, i) => (
                  <span key={i} className="w-2 h-2 rounded-full ring-1 ring-white/40" style={{ backgroundColor: c }} />
                ))}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 发型选择器 */}
      <div>
        <label className="block text-xs text-gray-400 mb-2 font-medium">💈 发型</label>
        <div className="grid grid-cols-6 gap-1.5">
          {HAIR_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              onClick={() => update({ hairStyle: opt.key })}
              className={`py-2 rounded-lg text-xs transition-all flex flex-col items-center gap-0.5 ${
                value.hairStyle === opt.key
                  ? 'bg-brand-500/20 ring-1 ring-brand-500/50 text-white'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-gray-200'
              }`}
            >
              <span className="text-lg">{opt.icon}</span>
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* 脸型选择器 */}
      <div>
        <label className="block text-xs text-gray-400 mb-2 font-medium">👤 脸型</label>
        <div className="grid grid-cols-4 gap-2">
          {FACE_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              onClick={() => update({ faceShape: opt.key })}
              className={`py-2.5 rounded-lg text-sm transition-all flex flex-col items-center gap-1 ${
                value.faceShape === opt.key
                  ? 'bg-brand-500/20 ring-1 ring-brand-500/50 text-white'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-gray-200'
              }`}
            >
              <span className="text-2xl">{opt.icon}</span>
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* 表情选择器 */}
      <div>
        <label className="block text-xs text-gray-400 mb-2 font-medium">😊 表情</label>
        <div className="grid grid-cols-5 gap-1.5">
          {EXPRESSION_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              onClick={() => update({ expression: opt.key })}
              className={`py-2 rounded-lg text-xs transition-all flex flex-col items-center gap-0.5 ${
                value.expression === opt.key
                  ? 'bg-brand-500/20 ring-1 ring-brand-500/50 text-white'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-gray-200'
              }`}
            >
              <span className="text-xl">{opt.icon}</span>
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============ SVG 渲染函数 ============

function renderHair(style: HairStyle, isMale: boolean, hairColor: string) {
  const renderMap: Record<HairStyle, () => React.ReactElement> = {
    short: () => (
      <g>
        <ellipse cx="100" cy="35" rx="52" ry="42" fill={hairColor} />
        <rect x="48" y="25" width="104" height="30" rx="15" fill={hairColor} />
        {isMale && <rect x="55" y="20" width="90" height="18" rx="4" fill={hairColor} />}
      </g>
    ),
    long: () => (
      <g>
        <ellipse cx="100" cy="32" rx="50" ry="40" fill={hairColor} />
        <path d="M48 55 Q40 100 48 145 Q52 155 55 145 Q60 100 55 55" fill={hairColor} />
        <path d="M152 55 Q160 100 152 145 Q148 155 145 145 Q140 100 145 55" fill={hairColor} />
        <rect x="48" y="22" width="104" height="28" rx="14" fill={hairColor} />
      </g>
    ),
    ponytail: () => (
      <g>
        <ellipse cx="100" cy="30" rx="48" ry="38" fill={hairColor} />
        <path d="M90 60 Q100 90 95 150 Q93 160 100 162 Q107 160 105 150 Q100 90 110 60" fill={hairColor} />
        <rect x="50" y="20" width="100" height="24" rx="12" fill={hairColor} />
      </g>
    ),
    ancient: () => (
      <g>
        <ellipse cx="100" cy="34" rx="46" ry="36" fill={hairColor} />
        <path d="M50 55 Q35 100 50 155" fill="none" stroke={hairColor} strokeWidth="6" strokeLinecap="round" />
        <path d="M150 55 Q165 100 150 155" fill="none" stroke={hairColor} strokeWidth="5" strokeLinecap="round" />
        <rect x="52" y="24" width="96" height="22" rx="11" fill={hairColor} />
        {/* 古风发饰 */}
        <circle cx="80" cy="70" r="4" fill="#fbbf24" />
        <circle cx="120" cy="70" r="4" fill="#fbbf24" />
        <line x1="80" y1="70" x2="120" y2="70" stroke="#fbbf24" strokeWidth="1.5" />
      </g>
    ),
    bob: () => (
      <g>
        <ellipse cx="100" cy="35" rx="50" ry="38" fill={hairColor} />
        <path d="M48 55 Q42 90 50 108 Q55 110 58 105 Q56 90 55 55" fill={hairColor} />
        <path d="M152 55 Q158 90 150 108 Q145 110 142 105 Q144 90 145 55" fill={hairColor} />
        <rect x="48" y="22" width="104" height="26" rx="13" fill={hairColor} />
      </g>
    ),
    curly: () => (
      <g>
        <ellipse cx="100" cy="36" rx="54" ry="44" fill={hairColor} />
        <circle cx="65" cy="28" r="18" fill={hairColor} />
        <circle cx="90" cy="22" r="20" fill={hairColor} />
        <circle cx="115" cy="22" r="20" fill={hairColor} />
        <circle cx="138" cy="28" r="18" fill={hairColor} />
        <circle cx="78" cy="30" r="15" fill={hairColor} />
        <circle cx="125" cy="30" r="15" fill={hairColor} />
      </g>
    ),
  };
  return renderMap[style]();
}

function renderFace(shape: FaceShape, skinColor: string) {
  const pathMap: Record<FaceShape, string> = {
    round: 'M50 90 Q50 50 100 45 Q150 50 150 90 Q150 140 100 145 Q50 140 50 90',
    oval: 'M55 85 Q55 45 100 40 Q145 45 145 85 Q145 135 100 142 Q55 135 55 85',
    square: 'M52 70 L52 70 Q52 50 100 46 Q148 50 148 70 L148 125 Q148 140 100 143 Q52 140 52 125 Z',
    heart: 'M100 50 Q130 30 150 55 Q158 70 150 85 L100 148 L50 85 Q42 70 50 55 Q70 30 100 50',
  };
  return <path d={pathMap[shape]} fill={skinColor} />;
}

function renderExpression(expr: Expression, eyeColor: string) {
  const eyeMap: Record<Expression, { leftEye: React.ReactElement; rightEye: React.ReactElement; mouth: React.ReactElement }> = {
    smile: {
      leftEye: <path d="M70 78 Q75 73 80 78" fill="none" stroke={eyeColor} strokeWidth="2.5" strokeLinecap="round" />,
      rightEye: <path d="M120 78 Q125 73 130 78" fill="none" stroke={eyeColor} strokeWidth="2.5" strokeLinecap="round" />,
      mouth: <path d="M88 105 Q100 118 112 105" fill="none" stroke="#c2416c" strokeWidth="2" strokeLinecap="round" />,
    },
    cool: {
      leftEye: <line x1="66" y1="78" x2="84" y2="78" stroke={eyeColor} strokeWidth="2.5" strokeLinecap="round" />,
      rightEye: <line x1="116" y1="78" x2="134" y2="78" stroke={eyeColor} strokeWidth="2.5" strokeLinecap="round" />,
      mouth: <line x1="94" y1="110" x2="106" y2="110" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" />,
    },
    gentle: {
      leftEye: <path d="M68 76 Q75 70 82 76" fill="none" stroke={eyeColor} strokeWidth="2" strokeLinecap="round">
        <animate attributeName="d" values="M68 76 Q75 70 82 76;M68 78 Q75 74 82 78;M68 76 Q75 70 82 76" dur="4s" repeatCount="indefinite" />
      </path>,
      rightEye: <path d="M118 76 Q125 70 132 76" fill="none" stroke={eyeColor} strokeWidth="2" strokeLinecap="round">
        <animate attributeName="d" values="M118 76 Q125 70 132 76;M118 78 Q125 74 132 78;M118 76 Q125 70 132 76" dur="4s" repeatCount="indefinite" />
      </path>,
      mouth: <path d="M90 107 Q100 114 110 107" fill="none" stroke="#f9a8d4" strokeWidth="1.8" strokeLinecap="round" />,
    },
    serious: {
      leftEye: <circle cx="77" cy="77" r="4.5" fill={eyeColor} />,
      rightEye: <circle cx="123" cy="77" r="4.5" fill={eyeColor} />,
      mouth: <line x1="93" y1="112" x2="107" y2="112" stroke={eyeColor} strokeWidth="2" strokeLinecap="round" />,
    },
    mysterious: {
      leftEye: (
        <g>
          <ellipse cx="77" cy="77" rx="5" ry="3" fill={eyeColor} />
          <path d="M72 77 Q77 74 82 77" fill="none" stroke={eyeColor} strokeWidth="1" opacity="0.5" />
        </g>
      ),
      rightEye: (
        <g>
          <ellipse cx="123" cy="77" rx="5" ry="3" fill={eyeColor} />
          <path d="M118 77 Q123 74 128 77" fill="none" stroke={eyeColor} strokeWidth="1" opacity="0.5" />
        </g>
      ),
      mouth: <path d="M92 108 Q96 114 100 108 Q104 114 108 108" fill="none" stroke="#c084fc" strokeWidth="1.5" strokeLinecap="round" />,
    },
  };

  const { leftEye, rightEye, mouth } = eyeMap[expr];

  return (
    <g>
      {/* 眉毛 */}
      <path d="M66 68 Q77 64 84 68" fill="none" stroke={eyeColor} strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
      <path d="M116 68 Q123 64 134 68" fill="none" stroke={eyeColor} strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
      {/* 眼睛 */}
      {leftEye}
      {rightEye}
      {/* 鼻子 */}
      <path d="M97 85 Q100 95 103 85" fill="none" stroke={eyeColor} strokeWidth="1" strokeOpacity="0.2" />
      {/* 嘴巴 */}
      {mouth}
      {/* 腮红 */}
      <ellipse cx="65" cy="95" rx="9" ry="5" fill="#f9a8d4" opacity="0.08" />
      <ellipse cx="135" cy="95" rx="9" ry="5" fill="#f9a8d4" opacity="0.08" />
    </g>
  );
}
