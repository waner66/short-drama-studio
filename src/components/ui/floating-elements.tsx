'use client';

import { useMemo } from 'react';

interface FloatingElement {
  id: number;
  emoji: string;
  x: number; // % from left
  y: number; // % from top
  size: number; // em
  delay: number; // seconds
  duration: number; // seconds
  drift: number; // px horizontal drift
  rotation: number; // degrees of rotation
  opacity: number;
}

interface FloatingElementsProps {
  count?: number;
  emojis?: string[];
  className?: string;
  density?: 'low' | 'medium' | 'high';
}

const DEFAULT_EMOJIS = ['⭐', '✨', '💫', '🎬', '📽️', '🎭', '🎪', '🌟', '💎', '🔮', '🎨', '📺'];

const DENSITY_MAP = {
  low: { count: 4, sizeMin: 0.8, sizeMax: 1.4, opMin: 0.05, opMax: 0.12 },
  medium: { count: 7, sizeMin: 1, sizeMax: 2.0, opMin: 0.06, opMax: 0.16 },
  high: { count: 12, sizeMin: 1.2, sizeMax: 2.8, opMin: 0.08, opMax: 0.22 },
};

export default function FloatingElements({
  count: propCount,
  emojis = DEFAULT_EMOJIS,
  className = '',
  density = 'medium',
}: FloatingElementsProps) {
  const elements = useMemo(() => {
    const config = DENSITY_MAP[density];
    const count = propCount || config.count;
    const items: FloatingElement[] = [];

    // Use fixed seed positions for consistent layout
    for (let i = 0; i < count; i++) {
      // Distribute elements across 4 quadrants
      const quadrant = i % 4;
      const baseX = quadrant === 0 || quadrant === 3 ? 5 : 75;
      const baseY = quadrant < 2 ? 8 : 65;

      items.push({
        id: i,
        emoji: emojis[i % emojis.length],
        x: baseX + Math.random() * 20,
        y: baseY + Math.random() * 25,
        size: config.sizeMin + Math.random() * (config.sizeMax - config.sizeMin),
        delay: Math.random() * 6,
        duration: 6 + Math.random() * 10,
        drift: 15 + Math.random() * 35,
        rotation: (Math.random() - 0.5) * 30,
        opacity: config.opMin + Math.random() * (config.opMax - config.opMin),
      });
    }
    return items;
  }, [propCount, emojis, density]);

  return (
    <div className={`fixed inset-0 pointer-events-none overflow-hidden z-0 ${className}`}>
      {elements.map((el) => (
        <div
          key={el.id}
          style={{
            position: 'absolute',
            left: `${el.x}%`,
            top: `${el.y}%`,
            fontSize: `${el.size}em`,
            opacity: el.opacity,
            animation: `floatEl-${el.id} ${el.duration}s ease-in-out infinite`,
            animationDelay: `${el.delay}s`,
            filter: 'blur(0.5px)',
            userSelect: 'none',
          }}
        >
          <style>{`
            @keyframes floatEl-${el.id} {
              0%, 100% {
                transform: translateY(0px) translateX(0px) rotate(0deg);
              }
              25% {
                transform: translateY(-${el.drift * 0.6}px) translateX(${el.drift * 0.4}px) rotate(${el.rotation}deg);
              }
              50% {
                transform: translateY(-${el.drift * 0.3}px) translateX(-${el.drift * 0.3}px) rotate(${-el.rotation * 0.5}deg);
              }
              75% {
                transform: translateY(-${el.drift * 0.7}px) translateX(${el.drift * 0.5}px) rotate(${el.rotation * 0.7}deg);
              }
            }
          `}</style>
          {el.emoji}
        </div>
      ))}
    </div>
  );
}
