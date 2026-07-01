'use client';

import GlassCard from '../ui/glass-card';

interface Scene {
  id: string;
  number?: number;
  title: string;
  timeOfDay?: string;
  weather?: string;
  location?: string;
  description?: string;
  thumbnail?: string;
  shotCount?: number;
  duration?: string;
}

interface SceneCardProps {
  scene: Scene;
  onClick?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  className?: string;
  active?: boolean;
}

const weatherIcons: Record<string, string> = {
  晴: '☀️',
  阴: '☁️',
  雨: '🌧️',
  雪: '❄️',
  夜: '🌙',
  黄昏: '🌅',
  雾: '🌫️',
};

const timeIcons: Record<string, string> = {
  白天: '☀️',
  上午: '🌤️',
  下午: '⛅',
  傍晚: '🌅',
  夜晚: '🌙',
  深夜: '🌃',
};

export default function SceneCard({
  scene,
  onClick,
  onEdit,
  onDelete,
  className = '',
  active = false,
}: SceneCardProps) {
  const weatherEmoji = scene.weather ? weatherIcons[scene.weather] || '' : '';
  const timeEmoji = scene.timeOfDay ? timeIcons[scene.timeOfDay] || '' : '';

  return (
    <GlassCard
      hover
      onClick={onClick}
      className={`p-0 overflow-hidden ${active ? 'ring-2 ring-purple-500/40' : ''} ${className}`}
    >
      <div className="flex">
        {/* Shot number badge */}
        <div className="flex items-center justify-center w-14 bg-gradient-to-b from-purple-500/10 to-transparent">
          <div className="text-center">
            <span className="block text-xs text-gray-500">场景</span>
            <span className="block text-xl font-bold text-purple-400">
              {scene.number ?? '?'}
            </span>
          </div>
        </div>

        <div className="flex-1 p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-white truncate">{scene.title}</h4>
              {scene.location && (
                <p className="mt-0.5 text-xs text-gray-500">📍 {scene.location}</p>
              )}
            </div>

            <div className="flex items-center gap-1 ml-2">
              {onEdit && (
                <button
                  onClick={(e) => { e.stopPropagation(); onEdit(); }}
                  className="rounded-lg p-1.5 text-gray-500 hover:text-purple-400 hover:bg-white/5 transition-colors"
                >
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
              )}
              {onDelete && (
                <button
                  onClick={(e) => { e.stopPropagation(); onDelete(); }}
                  className="rounded-lg p-1.5 text-gray-500 hover:text-red-400 hover:bg-white/5 transition-colors"
                >
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Meta info bar */}
          <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-gray-400">
            {timeEmoji && <span>{timeEmoji} {scene.timeOfDay}</span>}
            {weatherEmoji && <span>{weatherEmoji} {scene.weather}</span>}
            {scene.shotCount !== undefined && (
              <span className="text-purple-400">🎬 {scene.shotCount} 分镜</span>
            )}
            {scene.duration && (
              <span className="text-cyan-400">⏱ {scene.duration}</span>
            )}
          </div>

          {scene.description && (
            <p className="mt-2 text-xs text-gray-500 line-clamp-2">
              {scene.description}
            </p>
          )}
        </div>

        {scene.thumbnail && (
          <div className="w-20 shrink-0">
            <img
              src={scene.thumbnail}
              alt={scene.title}
              className="h-full w-full object-cover"
            />
          </div>
        )}
      </div>
    </GlassCard>
  );
}
