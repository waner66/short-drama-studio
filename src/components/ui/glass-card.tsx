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
      initial={animate ? { opacity: 0, y: 20, scale: 0.97 } : undefined}
      whileInView={animate ? { opacity: 1, y: 0, scale: 1 } : undefined}
      viewport={animate ? { once: true, margin: '-50px' } : undefined}
      transition={animate ? { duration: 0.5, delay, ease: [0.25, 0.46, 0.45, 0.94] } : undefined}
      whileHover={hover ? { y: -4, scale: 1.01, transition: { duration: 0.25 } } : undefined}
      whileTap={onClick ? { scale: 0.98 } : undefined}
      layout
      className={`
        rounded-2xl border border-white/10
        bg-white/[0.03] backdrop-blur-xl
        ${hover ? 'cursor-pointer' : ''}
        ${glow ? 'shadow-lg shadow-purple-500/5' : ''}
        ${className}
      `}
    >
      {heading && (
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <h3 className="text-base font-semibold text-white/80">{heading}</h3>
          {headingAction}
        </div>
      )}
      {children}
    </motion.div>
  );
}
