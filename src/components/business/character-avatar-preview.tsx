'use client';

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
}

const THEME_GRADIENTS: Record<string, [string, string]> = {
  warm: ['#f97316', '#ef4444'],
  cool: ['#3b82f6', '#6366f1'],
  dark: ['#6b21a8', '#1e1b4b'],
  fantasy: ['#a78bfa', '#67e8f9'],
};

const GENDER_COLORS = { '男': '#60a5fa', '女': '#f472b6' };

export default function CharacterAvatarPreview({
  name, gender, age, personality, archetype,
  surfaceTraits, innerTraits, hairStyle, faceShape, expression, colorTheme,
}: CharacterAvatarPreviewProps) {
  const [g1, g2] = THEME_GRADIENTS[colorTheme] || THEME_GRADIENTS['warm'];
  const genderColor = GENDER_COLORS[gender as keyof typeof GENDER_COLORS] || '#a78bfa';
  const allTraits = [...surfaceTraits, ...innerTraits, ...personality].slice(0, 6);

  return (
    <div className="relative overflow-hidden rounded-2xl bg-white/[0.03] border border-white/10 p-5">
      {/* 背景光晕 */}
      <div
        className="absolute -top-12 -right-12 w-40 h-40 rounded-full blur-3xl opacity-20"
        style={{ background: `linear-gradient(135deg, ${g1}, ${g2})` }}
      />
      <div
        className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full blur-3xl opacity-10"
        style={{ background: genderColor }}
      />

      <div className="relative flex items-start gap-5">
        {/* 头像 */}
        <div className="flex-shrink-0">
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl shadow-lg ring-2 ring-white/10 relative overflow-hidden"
            style={{ background: `linear-gradient(135deg, ${g1}40, ${g2}30)` }}
          >
            <span className="relative z-10">
              {gender === '男' ? '👤' : '👩'}
            </span>
            {/* 装饰圆环 */}
            <div className="absolute inset-0 rounded-2xl" style={{ border: `1px solid ${g1}30` }} />
          </div>
          {archetype && (
            <span className="block text-center mt-1.5 text-[10px] font-medium"
              style={{ color: genderColor }}>
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
                  style={{
                    backgroundColor: `${genderColor}15`,
                    color: genderColor,
                    border: `1px solid ${genderColor}30`,
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
          )}

          {/* 捏脸属性行 */}
          <div className="flex items-center gap-3 mt-2.5 text-[10px] text-gray-500">
            <span>💈 {HAIR_MAP[hairStyle] || '短发'}</span>
            <span>👤 {FACE_MAP[faceShape] || '标准'}</span>
            <span>😊 {EXPR_MAP[expression] || '微笑'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

const HAIR_MAP: Record<string, string> = { short: '短发', long: '长发', ponytail: '马尾', ancient: '古风', bob: '波波头', curly: '卷发' };
const FACE_MAP: Record<string, string> = { round: '圆脸', oval: '鹅蛋脸', square: '方脸', heart: '瓜子脸' };
const EXPR_MAP: Record<string, string> = { smile: '微笑', cool: '冷酷', gentle: '温柔', serious: '严肃', mysterious: '神秘' };
