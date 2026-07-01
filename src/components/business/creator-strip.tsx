'use client';

import GradientBtn from '../ui/gradient-btn';

interface Creator {
  id: string;
  name: string;
  avatar?: string;
  bio?: string;
  followers?: number;
  works?: number;
  rating?: number;
  isFollowing?: boolean;
}

interface CreatorStripProps {
  creator: Creator;
  onFollow?: () => void;
  onClick?: () => void;
  showBio?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function CreatorStrip({
  creator,
  onFollow,
  onClick,
  showBio = false,
  className = '',
  size = 'md',
}: CreatorStripProps) {
  const avatarSizes = { sm: 'h-8 w-8', md: 'h-10 w-10', lg: 'h-14 w-14' };
  const nameSizes = { sm: 'text-sm', md: 'text-base', lg: 'text-lg' };

  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {/* Avatar */}
      {creator.avatar ? (
        <img
          src={creator.avatar}
          alt={creator.name}
          className={`${avatarSizes[size]} rounded-full object-cover ring-1 ring-white/10`}
        />
      ) : (
        <div
          className={`${avatarSizes[size]} rounded-full bg-gradient-to-br from-purple-500/20 to-cyan-500/20 flex items-center justify-center text-purple-400 font-bold`}
        >
          {creator.name.charAt(0)}
        </div>
      )}

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={`${nameSizes[size]} font-semibold text-white truncate`}>
            {creator.name}
          </span>
          {creator.rating !== undefined && (
            <span className="text-xs text-amber-400">⭐ {creator.rating.toFixed(1)}</span>
          )}
        </div>
        <div className="flex items-center gap-3 mt-0.5">
          {creator.works !== undefined && (
            <span className="text-xs text-gray-500">{creator.works} 作品</span>
          )}
          {creator.followers !== undefined && (
            <span className="text-xs text-gray-500">{creator.followers.toLocaleString()} 关注者</span>
          )}
        </div>
        {showBio && creator.bio && (
          <p className="mt-1 text-xs text-gray-500 line-clamp-1">{creator.bio}</p>
        )}
      </div>

      {/* Follow button */}
      {onFollow && (
        <span onClick={(e) => e.stopPropagation()}>
          <GradientBtn
            size="sm"
            variant={creator.isFollowing ? 'outline' : 'primary'}
            onClick={onFollow}
          >
            {creator.isFollowing ? '已关注' : '关注'}
          </GradientBtn>
        </span>
      )}
    </div>
  );
}
