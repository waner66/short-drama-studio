'use client';

import GlassCard from '../ui/glass-card';

interface Character {
  id: string;
  name: string;
  gender?: string;
  age?: number | string;
  role?: string;
  personality?: string[];
  style?: string;
  avatarUrl?: string;
  status?: 'draft' | 'complete';
  projectCount?: number;
}

interface CharacterCardProps {
  character: Character;
  onClick?: () => void;
  className?: string;
}

const genderIcons: Record<string, string> = {
  男: '♂',
  女: '♀',
  male: '♂',
  female: '♀',
};

export default function CharacterCard({
  character,
  onClick,
  className = '',
}: CharacterCardProps) {
  const genderIcon = character.gender
    ? genderIcons[character.gender] || ''
    : '';

  const avatarGradient =
    character.gender === '女' || character.gender === 'female'
      ? 'from-pink-500/30 via-purple-500/20 to-cyan-500/10'
      : 'from-purple-500/30 via-cyan-500/20 to-purple-500/10';

  return (
    <GlassCard hover onClick={onClick} className={`p-0 overflow-hidden ${className}`}>
      {/* Avatar Area */}
      <div className={`h-32 bg-gradient-to-br ${avatarGradient} relative flex items-center justify-center`}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.05),transparent)]" />
        {character.avatarUrl ? (
          <img
            src={character.avatarUrl}
            alt={character.name}
            className="h-24 w-24 rounded-full border-2 border-white/20 object-cover"
          />
        ) : (
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/10 text-3xl font-bold text-white/60">
            {character.name.charAt(0)}
          </div>
        )}
        {character.status === 'complete' && (
          <span className="absolute top-3 right-3 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-medium text-emerald-400 border border-emerald-500/20">
            已完成
          </span>
        )}
      </div>

      {/* Info Area */}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-semibold text-white text-lg">{character.name}</h3>
          {genderIcon && (
            <span className="text-sm text-gray-400">{genderIcon}</span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs text-gray-400">
          {character.age && <span>{character.age}岁</span>}
          {character.role && (
            <>
              {character.age && <span className="text-gray-600">·</span>}
              <span>{character.role}</span>
            </>
          )}
        </div>

        {character.personality && character.personality.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {character.personality.slice(0, 3).map((trait) => (
              <span
                key={trait}
                className="rounded-md bg-purple-500/10 px-2 py-0.5 text-[10px] text-purple-400"
              >
                {trait}
              </span>
            ))}
            {character.personality.length > 3 && (
              <span className="rounded-md bg-white/5 px-2 py-0.5 text-[10px] text-gray-500">
                +{character.personality.length - 3}
              </span>
            )}
          </div>
        )}

        {character.style && (
          <div className="mt-2 flex items-center gap-1.5">
            <span className="text-[10px] text-gray-500">风格：</span>
            <span className="text-[10px] text-cyan-400 bg-cyan-500/10 px-1.5 py-0.5 rounded">
              {character.style}
            </span>
          </div>
        )}

        {character.projectCount !== undefined && character.projectCount > 0 && (
          <div className="mt-3 pt-3 border-t border-white/5 text-xs text-gray-500">
            {character.projectCount} 个关联项目
          </div>
        )}
      </div>
    </GlassCard>
  );
}
