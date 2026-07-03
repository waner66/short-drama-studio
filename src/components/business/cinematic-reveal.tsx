'use client';

import React, { useEffect, useState } from 'react';

interface CinematicRevealProps {
  text: string;
  tag?: 'h1' | 'h2' | 'h3' | 'p';
  className?: string;
  delay?: number; // ms before start
  duration?: number; // ms per character
  glow?: boolean;
  color?: string;
}

export default function CinematicReveal({
  text,
  tag: Tag = 'h2',
  className = '',
  delay = 0,
  duration = 50,
  glow = false,
  color,
}: CinematicRevealProps) {
  const [revealed, setRevealed] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const startTimer = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(startTimer);
  }, [delay]);

  useEffect(() => {
    if (!started) return;
    if (revealed >= text.length) return;

    const timer = setTimeout(() => {
      setRevealed((r) => r + 1);
    }, duration);
    return () => clearTimeout(timer);
  }, [started, revealed, text.length, duration]);

  const chars = text.split('');

  return (
    <Tag className={className}>
      {chars.map((char, i) => (
        <span
          key={i}
          style={{
            opacity: started && i < revealed ? 1 : 0,
            transform: started && i < revealed
              ? 'translateY(0) scale(1)'
              : 'translateY(12px) scale(0.8)',
            transition: `all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)`,
            transitionDelay: `${i * 0.02}s`,
            display: char === ' ' ? 'inline' : 'inline-block',
            color: glow && color && i < revealed ? color : undefined,
            textShadow: glow && color && i < revealed
              ? `0 0 8px ${color}60, 0 0 16px ${color}30`
              : undefined,
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
      {/* Cursor blink */}
      {started && revealed < text.length && (
        <span
          className="inline-block w-0.5 h-[1em] ml-0.5 align-text-bottom bg-brand-400"
          style={{ animation: 'cinematicBlink 0.8s step-end infinite' }}
        />
      )}
      <style>{`
        @keyframes cinematicBlink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </Tag>
  );
}
