'use client';

import React from 'react';

interface NeonTextProps {
  children: React.ReactNode;
  color?: string;
  glowColor?: string;
  pulse?: boolean;
  flicker?: boolean;
  as?: keyof JSX.IntrinsicElements;
  className?: string;
  style?: React.CSSProperties;
}

export default function NeonText({
  children,
  color = 'var(--brand-400)',
  glowColor,
  pulse = false,
  flicker = false,
  as: Tag = 'span',
  className = '',
  style = {},
}: NeonTextProps) {
  const glow = glowColor || color;

  return (
    <>
      <style>{`
        @keyframes neonPulse {
          0%, 100% {
            text-shadow:
              0 0 4px ${glow},
              0 0 8px ${glow},
              0 0 16px ${glow},
              0 0 32px ${glow},
              0 0 64px ${glow}40;
          }
          50% {
            text-shadow:
              0 0 6px ${glow},
              0 0 12px ${glow},
              0 0 24px ${glow},
              0 0 48px ${glow},
              0 0 80px ${glow}60;
          }
        }
        @keyframes neonFlicker {
          0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% {
            text-shadow:
              0 0 4px ${glow},
              0 0 8px ${glow},
              0 0 16px ${glow},
              0 0 32px ${glow},
              0 0 64px ${glow}40;
            opacity: 1;
          }
          20%, 24%, 55% {
            text-shadow:
              0 0 2px ${glow},
              0 0 4px ${glow},
              0 0 8px ${glow};
            opacity: 0.7;
          }
        }
      `}</style>
      <Tag
        className={className}
        style={{
          color,
          textShadow: `
            0 0 4px ${glow},
            0 0 8px ${glow},
            0 0 16px ${glow},
            0 0 32px ${glow},
            0 0 64px ${glow}40
          `,
          animation: pulse
            ? 'neonPulse 2s ease-in-out infinite'
            : flicker
            ? 'neonFlicker 2.5s infinite'
            : 'none',
          letterSpacing: '0.02em',
          ...style,
        }}
      >
        {children}
      </Tag>
    </>
  );
}
