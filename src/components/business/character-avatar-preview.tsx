'use client';

import { renderFace, renderHairBack, renderHairFront, renderHairHighlight, renderEyebrows, renderEyes, renderNose, renderMouth, renderGlasses, renderEarrings, getFacePath } from './face-builder-svg';

interface CharacterAvatarPreviewProps {
  name: string;
  gender: string;
  age: number;
  personality: string[];
  archetype: string;
  surfaceTraits: string[];
  innerTraits: string[];
  hairStyle: string;
  faceShape: string;
  expression: string;
  colorTheme: string;
  eyeShape?: string;
  eyebrow?: string;
  mouthStyle?: string;
  skinTone?: string;
  accessory?: string;
  earring?: string;
  noseType?: string;
}

const THEME_GRADIENTS: Record<string, [string, string]> = {
  warm: ['#f97316', '#ef4444'],
  cool: ['#3b82f6', '#6366f1'],
  dark: ['#6b21a8', '#1e1b4b'],
  fantasy: ['#a78bfa', '#67e8f9'],
};

const THEME_COLORS: Record<string, { accent: string; hair: string; eye: string }> = {
  warm: { accent: '#f97316', hair: '#78350f', eye: '#422006' },
  cool: { accent: '#3b82f6', hair: '#1e293b', eye: '#0f172a' },
  dark: { accent: '#a855f7', hair: '#0f0f1a', eye: '#1a0533' },
  fantasy: { accent: '#c084fc', hair: '#2d1b4e', eye: '#4c1d95' },
};

const SKIN_COLORS: Record<string, string> = {
  fair: '#fde8d8',
  natural: '#f5d0b0',
  wheat: '#d4a574',
  warmYellow: '#e8c99b',
  '': '#fde8d8',
};

const HAIR_MAP: Record<string, string> = { short: '短发', long: '长发', ponytail: '马尾', ancient: '古风', bob: '波波头', curly: '卷发' };
const FACE_MAP: Record<string, string> = { round: '圆脸', oval: '鹅蛋脸', square: '方脸', heart: '瓜子脸' };
const EXPR_MAP: Record<string, string> = { smile: '微笑', cool: '冷酷', gentle: '温柔', serious: '严肃', mysterious: '神秘' };

export default function CharacterAvatarPreview({
  name, gender, age, personality, archetype,
  surfaceTraits, innerTraits,
  hairStyle, faceShape, expression, colorTheme,
  eyeShape = 'round', eyebrow = 'jian', mouthStyle = 'yingtao',
  skinTone = 'fair', accessory = 'none', earring = 'none',
  noseType = 'small',
}: CharacterAvatarPreviewProps) {
  const [g1, g2] = THEME_GRADIENTS[colorTheme] || THEME_GRADIENTS['warm'];
  const theme = THEME_COLORS[colorTheme] || THEME_COLORS['fantasy'];
  const genderColor = gender === '男' ? '#60a5fa' : '#f472b6';
  const allTraits = [...surfaceTraits, ...innerTraits, ...personality].slice(0, 6);
  const skin = SKIN_COLORS[skinTone] || SKIN_COLORS['fair'];
  const isMale = gender === '男';

  return (
    <div className="relative overflow-hidden rounded-2xl bg-white/[0.03] border border-white/10 p-5">
      {/* 背景光晕 */}
      <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full blur-3xl opacity-20" style={{ background: `linear-gradient(135deg, ${g1}, ${g2})` }} />
      <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full blur-3xl opacity-10" style={{ background: genderColor }} />

      <div className="relative flex items-start gap-5">
        {/* SVG头像 — 替代emoji */}
        <div className="flex-shrink-0">
          <div
            className="w-24 h-24 rounded-2xl shadow-lg ring-2 ring-white/10 relative overflow-hidden"
            style={{ background: `linear-gradient(135deg, ${g1}40, ${g2}30)` }}
          >
            <svg viewBox="0 0 240 240" className="w-full h-full">
              <defs>
                <radialGradient id={`av-blush-${name}`} cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#f9a8d4" stopOpacity="0.1" />
                  <stop offset="100%" stopColor="#f9a8d4" stopOpacity="0" />
                </radialGradient>
                <linearGradient id={`av-lipGrad-${name}`} x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#e8536c" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#c2416c" stopOpacity="0.4" />
                </linearGradient>
              </defs>

              {/* Decorative circles */}
              <circle cx="120" cy="105" r="95" fill="none" stroke={theme.accent} strokeWidth="0.6" strokeOpacity="0.1" />

              {/* Hair back */}
              {renderHairBack(hairStyle as any, isMale, theme.hair)}
              {/* Face */}
              {renderFace(faceShape as any, skin)}
              {/* Face light */}
              <path d={getFacePath(faceShape as any)} fill="white" opacity="0.04" />
              {/* Eyebrows */}
              {renderEyebrows(eyebrow as any, theme.eye)}
              {/* Eyes */}
              {renderEyes(eyeShape as any, expression as any, theme.eye)}
              {/* Nose */}
              {renderNose(noseType as any, theme.eye)}
              {/* Mouth */}
              {renderMouth(mouthStyle as any, expression as any)}
              {/* Blush */}
              <ellipse cx="82" cy="125" rx="14" ry="8" fill={`url(#av-blush-${name})`} />
              <ellipse cx="158" cy="125" rx="14" ry="8" fill={`url(#av-blush-${name})`} />
              {/* Nose highlight */}
              <ellipse cx="120" cy="114" rx="3" ry="2" fill="white" opacity="0.1" />
              {/* Accessories */}
              {renderGlasses(accessory as any, theme.accent)}
              {renderEarrings(earring as any, theme.accent, isMale)}
              {/* Hair front */}
              {renderHairFront(hairStyle as any, isMale, theme.hair)}
              {/* Hair highlight */}
              {renderHairHighlight(hairStyle as any, isMale)}
            </svg>
            <div className="absolute inset-0 rounded-2xl" style={{ border: `1px solid ${g1}30` }} />
          </div>
          {archetype && (
            <span className="block text-center mt-1.5 text-[10px] font-medium" style={{ color: genderColor }}>
              {archetype}
            </span>
          )}
        </div>

        {/* 信息 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2">
            <h3 className="text-lg font-bold text-white truncate">{name || '未命名角色'}</h3>
            <span className="text-xs text-gray-500">{gender} · {age}岁</span>
          </div>

          {/* 性格标签 */}
          {allTraits.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {allTraits.map((t) => (
                <span key={t} className="text-[10px] px-1.5 py-0.5 rounded-full"
                  style={{ backgroundColor: `${genderColor}15`, color: genderColor, border: `1px solid ${genderColor}30` }}>
                  {t}
                </span>
              ))}
            </div>
          )}

          {/* 捏脸属性行 — emoji→文本 */}
          <div className="flex items-center gap-3 mt-2.5 text-[10px] text-gray-500">
            <span className="flex items-center gap-1">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/></svg>
              {HAIR_MAP[hairStyle] || '短发'}
            </span>
            <span className="flex items-center gap-1">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/></svg>
              {FACE_MAP[faceShape] || '标准'}
            </span>
            <span className="flex items-center gap-1">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>
              {EXPR_MAP[expression] || '微笑'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
