'use client';

import { useEffect, useState, useRef, useCallback } from 'react';

interface TrailDot {
  id: number;
  x: number;
  y: number;
  createdAt: number;
  size: number;
  hue: number;
}

interface GlowTrailProps {
  enabled?: boolean;
  trailCount?: number;
  dotSize?: number;
  lifetime?: number; // ms
  colors?: number[]; // hue range [start, end]
  className?: string;
}

export default function GlowTrail({
  enabled = true,
  trailCount = 20,
  dotSize = 8,
  lifetime = 800,
  colors = [260, 200],
  className = '',
}: GlowTrailProps) {
  const [dots, setDots] = useState<TrailDot[]>([]);
  const idRef = useRef(0);
  const lastPosRef = useRef({ x: -9999, y: -9999 });
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!enabled) return;
      const now = Date.now();
      const dx = e.clientX - lastPosRef.current.x;
      const dy = e.clientY - lastPosRef.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Throttle by distance - only add dot when mouse moved enough
      if (dist < 15) return;

      lastPosRef.current = { x: e.clientX, y: e.clientY };
      const hue = colors[0] + Math.random() * (colors[1] - colors[0]);

      setDots((prev) => {
        const newDots = [
          ...prev,
          {
            id: ++idRef.current,
            x: e.clientX + (Math.random() - 0.5) * 12,
            y: e.clientY + (Math.random() - 0.5) * 12,
            createdAt: now,
            size: dotSize * (0.5 + Math.random() * 0.5),
            hue,
          },
        ];
        // Keep only trailCount recent dots
        if (newDots.length > trailCount * 2) {
          return newDots.slice(-trailCount * 2);
        }
        return newDots;
      });
    },
    [enabled, dotSize, colors, trailCount]
  );

  useEffect(() => {
    if (!enabled) return;
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [enabled, handleMouseMove]);

  // Cleanup expired dots
  useEffect(() => {
    if (!enabled) {
      setDots([]);
      return;
    }
    intervalRef.current = setInterval(() => {
      const now = Date.now();
      setDots((prev) => prev.filter((d) => now - d.createdAt < lifetime));
    }, 200);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [enabled, lifetime]);

  if (!enabled) return null;

  return (
    <div
      className={`fixed inset-0 pointer-events-none z-[9998] ${className}`}
      style={{ overflow: 'hidden' }}
    >
      {dots.map((dot) => {
        const age = Date.now() - dot.createdAt;
        const progress = age / lifetime;
        const opacity = Math.max(0, 1 - progress);
        const scale = 1 - progress * 0.5;
        return (
          <div
            key={dot.id}
            style={{
              position: 'fixed',
              left: dot.x,
              top: dot.y,
              width: dot.size,
              height: dot.size,
              borderRadius: '50%',
              background: `radial-gradient(circle, hsla(${dot.hue}, 80%, 75%, ${opacity * 0.8}) 0%, hsla(${dot.hue}, 80%, 60%, ${opacity * 0.2}) 100%)`,
              boxShadow: `0 0 ${dot.size * 2}px hsla(${dot.hue}, 80%, 60%, ${opacity * 0.5})`,
              transform: `translate(-50%, -50%) scale(${scale})`,
              transition: 'opacity 0.3s ease-out, transform 0.3s ease-out',
            }}
          />
        );
      })}
    </div>
  );
}
