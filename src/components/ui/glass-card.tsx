'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  heading?: string;
  headingAction?: ReactNode;
  hover?: boolean;
  glow?: boolean;
  animate?: boolean;
  delay?: number;
  onClick?: () => void;
}

export default function GlassCard({
  children,
  className = '',
  heading,
  headingAction,
  hover = false,
  glow = false,
  animate = false,
  delay = 0,
  onClick,
}: GlassCardProps) {
  return (
    <motion.div
      onClick={onClick}
      initial={animate ? { opacity: 0, y: 16, scale: 0.98 } : undefined}
      whileInView={animate ? { opacity: 1, y: 0, scale: 1 } : undefined}
      viewport={animate ? { once: true, margin: '-30px' } : undefined}
      transition={animate ? { duration: 0.4, delay, ease: [0.25, 0.46, 0.45, 0.94] } : undefined}
      whileHover={hover ? { y: -2, transition: { duration: 0.2 } } : undefined}
      whileTap={onClick ? { scale: 0.985 } : undefined}
      layout
      className={`
        rounded-2xl
        bg-[var(--surface-card)] border border-[var(--border-subtle)]
        backdrop-blur-xl
        shadow-[var(--shadow-card)]
        ${hover ? 'cursor-pointer transition-shadow duration-200 hover:border-[var(--border-default)] hover:shadow-[var(--shadow-elevated)]' : ''}
        ${glow ? 'shadow-[var(--shadow-glow-scene)]' : ''}
        ${className}
      `}
    >
      {heading && (
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-subtle)]">
          <h3 className="text-sm font-semibold text-[var(--text-primary)]">{heading}</h3>
          {headingAction}
        </div>
      )}
      {children}
    </motion.div>
  );
}
