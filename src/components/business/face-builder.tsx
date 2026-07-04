'use client';

import { useState, useMemo } from 'react';
import { Scissors, User, Eye, Smile, Palette, Shuffle, RotateCcw } from '@/components/ui/icons';
import RefinedButton from '@/components/ui/refined-button';

// ================================================================
// Type definitions
// ================================================================
type HairStyle = 'short' | 'long' | 'ponytail' | 'ancient' | 'bob' | 'curly';
type FaceShape = 'round' | 'oval' | 'square' | 'heart';
type Expression = 'smile' | 'cool' | 'gentle' | 'serious' | 'mysterious';
type ColorTheme = 'warm' | 'cool' | 'dark' | 'fantasy';
type EyebrowStyle = 'jian' | 'liuye' | 'cuping' | 'wan';
type EyeShape = 'round' | 'danfeng' | 'taohua' | 'xiacui';
type MouthStyle = 'weixiao' | 'baochun' | 'houcun' | 'yingtao';
type SkinTone = 'fair' | 'natural' | 'wheat' | 'warmYellow';
type Accessory = 'none' | 'roundGlasses' | 'squareGlasses';
type EarringStyle = 'none' | 'stud' | 'hoop';
type CollarStyle = 'round' | 'vneck' | 'turtleneck' | 'ancientCross';
type NoseType = 'small' | 'tall' | 'round' | 'delicate';

export interface FaceConfig {
  hairStyle: HairStyle;
  faceShape: FaceShape;
  expression: Expression;
  colorTheme: ColorTheme;
  eyebrow: EyebrowStyle;
  eyeShape: EyeShape;
  mouthStyle: MouthStyle;
  skinTone: SkinTone;
  accessory: Accessory;
  earring: EarringStyle;
  collarStyle: CollarStyle;
  noseType: NoseType;
}

interface FaceBuilderProps {
  gender: string;
  value: FaceConfig;
  onChange: (config: FaceConfig) => void;
}

// ================================================================
// Option arrays
// ================================================================
const HAIR_OPTIONS: { key: HairStyle; label: string }[] = [
  { key: 'short', label: '短发' },
  { key: 'long', label: '长发' },
  { key: 'ponytail', label: '马尾' },
  { key: 'ancient', label: '古风' },
  { key: 'bob', label: '波波头' },
  { key: 'curly', label: '卷发' },
];

const FACE_OPTIONS: { key: FaceShape; label: string }[] = [
  { key: 'round', label: '圆脸' },
  { key: 'oval', label: '鹅蛋脸' },
  { key: 'square', label: '方脸' },
  { key: 'heart', label: '瓜子脸' },
];

const EXPRESSION_OPTIONS: { key: Expression; label: string }[] = [
  { key: 'smile', label: '微笑' },
  { key: 'cool', label: '冷酷' },
  { key: 'gentle', label: '温柔' },
  { key: 'serious', label: '严肃' },
  { key: 'mysterious', label: '神秘' },
];

const THEME_OPTIONS: { key: ColorTheme; label: string }[] = [
  { key: 'warm', label: '暖色' },
  { key: 'cool', label: '冷色' },
  { key: 'dark', label: '暗黑' },
  { key: 'fantasy', label: '仙气' },
];

const EYEBROW_OPTIONS: { key: EyebrowStyle; label: string }[] = [
  { key: 'jian', label: '剑眉' },
  { key: 'liuye', label: '柳叶眉' },
  { key: 'cuping', label: '粗平眉' },
  { key: 'wan', label: '弯眉' },
];

const EYE_OPTIONS: { key: EyeShape; label: string }[] = [
  { key: 'round', label: '圆眼' },
  { key: 'danfeng', label: '丹凤眼' },
  { key: 'taohua', label: '桃花眼' },
  { key: 'xiacui', label: '下垂眼' },
];

const MOUTH_OPTIONS: { key: MouthStyle; label: string }[] = [
  { key: 'weixiao', label: '微笑唇' },
  { key: 'baochun', label: '薄唇' },
  { key: 'houcun', label: '厚唇' },
  { key: 'yingtao', label: '樱桃嘴' },
];

const SKIN_OPTIONS: { key: SkinTone; label: string }[] = [
  { key: 'fair', label: '白皙' },
  { key: 'natural', label: '自然' },
  { key: 'wheat', label: '小麦' },
  { key: 'warmYellow', label: '暖黄' },
];

const ACCESSORY_OPTIONS: { key: Accessory; label: string }[] = [
  { key: 'none', label: '无' },
  { key: 'roundGlasses', label: '圆框眼镜' },
  { key: 'squareGlasses', label: '方框眼镜' },
];

const EARRING_OPTIONS: { key: EarringStyle; label: string }[] = [
  { key: 'none', label: '无' },
  { key: 'stud', label: '耳钉' },
  { key: 'hoop', label: '耳环' },
];

const COLLAR_OPTIONS: { key: CollarStyle; label: string }[] = [
  { key: 'round', label: '圆领' },
  { key: 'vneck', label: 'V领' },
  { key: 'turtleneck', label: '高领' },
  { key: 'ancientCross', label: '古风交领' },
];

const NOSE_OPTIONS: { key: NoseType; label: string }[] = [
  { key: 'small', label: '小巧' },
  { key: 'tall', label: '挺拔' },
  { key: 'round', label: '圆润' },
  { key: 'delicate', label: '精致' },
];

// ================================================================
// SVG rendering functions
// ================================================================
import {
  renderParticles,
  renderShoulders,
  renderHairBack,
  renderHairFront,
  renderHairHighlight,
  renderFace,
  renderEyebrows,
  renderEyes,
  renderNose,
  renderMouth,
  renderGlasses,
  renderEarrings,
  getFacePath,
} from './face-builder-svg';

// ================================================================
// Color theme definitions
// ================================================================
const THEME_COLORS: Record<ColorTheme, { accent: string; skin: string; hair: string; eye: string }> = {
  warm:  { accent: '#f97316', skin: '#fddcab', hair: '#78350f', eye: '#422006' },
  cool:  { accent: '#3b82f6', skin: '#fde8d0', hair: '#1e293b', eye: '#0f172a' },
  dark:  { accent: '#a855f7', skin: '#f5d5cb', hair: '#0f0f1a', eye: '#1a0533' },
  fantasy: { accent: '#c084fc', skin: '#ffe4d0', hair: '#2d1b4e', eye: '#4c1d95' },
};

const SKIN_COLORS: Record<SkinTone, string> = {
  fair: '#fce4d6',
  natural: '#e8c9a0',
  wheat: '#c4956a',
  warmYellow: '#f0c75e',
};

// ================================================================
// Random face config
// ================================================================
function randomFaceConfig(): FaceConfig {
  const pick = <T,>(arr: { key: T }[]): T => arr[Math.floor(Math.random() * arr.length)].key;
  return {
    hairStyle: pick(HAIR_OPTIONS),
    faceShape: pick(FACE_OPTIONS),
    expression: pick(EXPRESSION_OPTIONS),
    colorTheme: pick(THEME_OPTIONS),
    eyebrow: pick(EYEBROW_OPTIONS),
    eyeShape: pick(EYE_OPTIONS),
    mouthStyle: pick(MOUTH_OPTIONS),
    skinTone: pick(SKIN_OPTIONS),
    accessory: pick(ACCESSORY_OPTIONS),
    earring: pick(EARRING_OPTIONS),
    collarStyle: pick(COLLAR_OPTIONS),
    noseType: pick(NOSE_OPTIONS),
  };
}

// ================================================================
// SVG Avatar Preview
// ================================================================
function FaceAvatarPreview({ cfg, isMale }: { cfg: FaceConfig; isMale: boolean }) {
  const theme = THEME_COLORS[cfg.colorTheme];
  const skinColor = SKIN_COLORS[cfg.skinTone];

  return (
    <svg viewBox="0 0 240 240" className="w-full h-full">
      <defs>
        <linearGradient id="lipGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e8536c" />
          <stop offset="100%" stopColor="#c2416c" />
        </linearGradient>
      </defs>
      {/* Background particles */}
      {renderParticles(theme.accent)}
      {/* Hair back layer */}
      {renderHairBack(cfg.hairStyle, isMale, theme.hair)}
      {/* Shoulders & neck */}
      {renderShoulders(cfg.collarStyle, skinColor, isMale, theme.accent)}
      {/* Face */}
      {renderFace(cfg.faceShape, skinColor)}
      {/* Eyebrows */}
      {renderEyebrows(cfg.eyebrow, theme.eye)}
      {/* Eyes */}
      {renderEyes(cfg.eyeShape, cfg.expression, theme.eye)}
      {/* Nose */}
      {renderNose(cfg.noseType, theme.eye)}
      {/* Mouth */}
      {renderMouth(cfg.mouthStyle, cfg.expression)}
      {/* Glasses */}
      {renderGlasses(cfg.accessory, theme.accent)}
      {/* Earrings */}
      {renderEarrings(cfg.earring, theme.accent, isMale)}
      {/* Hair front */}
      {renderHairFront(cfg.hairStyle, isMale, theme.hair)}
      {/* Hair highlight */}
      {renderHairHighlight(cfg.hairStyle, isMale)}
    </svg>
  );
}

// ================================================================
// Option Group Component
// ================================================================
function OptionGroup<T extends string>({
  label,
  icon,
  options,
  value,
  onChange,
}: {
  label: string;
  icon: React.ReactNode;
  options: { key: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="fb-option-group">
      <div className="fb-option-label">
        {icon}
        <span>{label}</span>
      </div>
      <div className="fb-option-chips">
        {options.map((opt) => (
          <RefinedButton
            key={opt.key}
            variant="tag-chip"
            size="sm"
            selected={value === opt.key}
            onClick={() => onChange(opt.key)}
          >
            {opt.label}
          </RefinedButton>
        ))}
      </div>
    </div>
  );
}

// ================================================================
// FaceBuilder Component
// ================================================================
export default function FaceBuilder({ gender, value, onChange }: FaceBuilderProps) {
  const isMale = gender === '男';
  const [activeTab, setActiveTab] = useState<'face' | 'eyes' | 'style'>('face');

  const update = (patch: Partial<FaceConfig>) => onChange({ ...value, ...patch });

  return (
    <div className="face-builder">
      {/* SVG Preview */}
      <div className="fb-preview">
        <FaceAvatarPreview cfg={value} isMale={isMale} />
      </div>

      {/* Action buttons */}
      <div className="fb-actions">
        <RefinedButton
          variant="ghost-glass"
          size="sm"
          icon={<Shuffle size={14} />}
          onClick={() => onChange(randomFaceConfig())}
        >
          随机
        </RefinedButton>
        <RefinedButton
          variant="ghost-glass"
          size="sm"
          icon={<RotateCcw size={14} />}
          onClick={() => onChange({
            hairStyle: 'long', faceShape: 'oval', expression: 'smile', colorTheme: 'warm',
            eyebrow: 'jian', eyeShape: 'round', mouthStyle: 'weixiao',
            skinTone: 'fair', accessory: 'none', earring: 'none',
            collarStyle: 'round', noseType: 'small',
          })}
        >
          重置
        </RefinedButton>
      </div>

      {/* Tab bar */}
      <div className="fb-tabs">
        {(['face', 'eyes', 'style'] as const).map((t) => (
          <button
            key={t}
            className={`fb-tab ${activeTab === t ? 'active' : ''}`}
            onClick={() => setActiveTab(t)}
          >
            {t === 'face' ? '脸型' : t === 'eyes' ? '眉眼' : '风格'}
          </button>
        ))}
      </div>

      {/* Tab panels */}
      <div className="fb-panels">
        {activeTab === 'face' && (
          <>
            <OptionGroup label="脸型" icon={<User size={14} />} options={FACE_OPTIONS} value={value.faceShape} onChange={(v) => update({ faceShape: v })} />
            <OptionGroup label="发型" icon={<Scissors size={14} />} options={HAIR_OPTIONS} value={value.hairStyle} onChange={(v) => update({ hairStyle: v })} />
            <OptionGroup label="嘴型" icon={<Smile size={14} />} options={MOUTH_OPTIONS} value={value.mouthStyle} onChange={(v) => update({ mouthStyle: v })} />
            <OptionGroup label="鼻子" icon={<Smile size={14} />} options={NOSE_OPTIONS} value={value.noseType} onChange={(v) => update({ noseType: v })} />
            <OptionGroup label="肤色" icon={<Palette size={14} />} options={SKIN_OPTIONS} value={value.skinTone} onChange={(v) => update({ skinTone: v })} />
          </>
        )}
        {activeTab === 'eyes' && (
          <>
            <OptionGroup label="眉形" icon={<Eye size={14} />} options={EYEBROW_OPTIONS} value={value.eyebrow} onChange={(v) => update({ eyebrow: v })} />
            <OptionGroup label="眼型" icon={<Eye size={14} />} options={EYE_OPTIONS} value={value.eyeShape} onChange={(v) => update({ eyeShape: v })} />
            <OptionGroup label="表情" icon={<Smile size={14} />} options={EXPRESSION_OPTIONS} value={value.expression} onChange={(v) => update({ expression: v })} />
            <OptionGroup label="眼镜" icon={<Eye size={14} />} options={ACCESSORY_OPTIONS} value={value.accessory} onChange={(v) => update({ accessory: v })} />
            <OptionGroup label="耳饰" icon={<Eye size={14} />} options={EARRING_OPTIONS} value={value.earring} onChange={(v) => update({ earring: v })} />
          </>
        )}
        {activeTab === 'style' && (
          <>
            <OptionGroup label="主题色" icon={<Palette size={14} />} options={THEME_OPTIONS} value={value.colorTheme} onChange={(v) => update({ colorTheme: v })} />
            <OptionGroup label="领口" icon={<User size={14} />} options={COLLAR_OPTIONS} value={value.collarStyle} onChange={(v) => update({ collarStyle: v })} />
          </>
        )}
      </div>
    </div>
  );
}

// Re-export types for external use
export type { HairStyle, FaceShape, Expression, ColorTheme, EyebrowStyle, EyeShape, MouthStyle, SkinTone, Accessory, EarringStyle, CollarStyle, NoseType };
