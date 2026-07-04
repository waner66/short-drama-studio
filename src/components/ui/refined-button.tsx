'use client';

import { ReactNode, ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

// ================================================================
// RefinedButton — 面向 GenZ 的精致按钮系统
// 支持光泽动效、发光、按压反馈、涟漪效果
// ================================================================

type ButtonVariant = 'primary' | 'ghost-glass' | 'tag-chip' | 'icon-round' | 'primary-gradient' | 'glass-elevated' | 'heart-toggle';

interface RefinedButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  icon?: ReactNode;
  loading?: boolean;
  selected?: boolean;   // for tag-chip
  accent?: string;      // custom accent color for tag-chip (hex)
  circle?: boolean;
  gradientFrom?: string; // for primary-gradient (hex)
  gradientTo?: string;   // for primary-gradient (hex)
  isToggled?: boolean;   // for heart-toggle
  children?: ReactNode;
}

// ================================================================
// 1. RefinedButton — 主按钮组件
// ================================================================
export default function RefinedButton({
  variant = 'primary',
  size = 'md',
  icon,
  loading = false,
  selected = false,
  accent,
  circle = false,
  gradientFrom,
  gradientTo,
  isToggled = false,
  className,
  children,
  disabled,
  ...rest
}: RefinedButtonProps) {
  if (variant === 'tag-chip') {
    return (
      <TagChipButton
        selected={selected}
        accent={accent}
        size={size}
        className={className}
        disabled={disabled}
        {...rest}
      >
        {children}
      </TagChipButton>
    );
  }

  if (variant === 'icon-round') {
    return (
      <IconRoundButton
        size={size}
        loading={loading}
        disabled={disabled}
        className={className}
        {...rest}
      >
        {icon}
      </IconRoundButton>
    );
  }

  if (variant === 'heart-toggle') {
    return (
      <HeartToggleButton
        size={size}
        isToggled={isToggled}
        disabled={disabled}
        className={className}
        {...rest}
      >
        {icon}
      </HeartToggleButton>
    );
  }

  const sizeClasses = {
    sm: 'px-4 py-2 text-xs rounded-lg gap-1.5',
    md: 'px-5 py-2.5 text-sm rounded-xl gap-2',
    lg: 'px-7 py-3 text-sm rounded-xl gap-2.5',
    xl: 'px-9 py-3.5 text-base rounded-2xl gap-3',
  };

  const baseClasses = cn(
    'inline-flex items-center justify-center font-semibold',
    'transition-all duration-300 ease-out cursor-pointer',
    'disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100',
    'active:scale-[0.97]',
    'select-none',
    'relative overflow-hidden',
    sizeClasses[size],
    circle && 'rounded-full',
  );

  if (variant === 'primary') {
    return (
      <button
        disabled={disabled || loading}
        className={cn(
          baseClasses,
          // Gradient background
          'bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500',
          'text-white',
          // Shadow glow
          'shadow-lg shadow-purple-500/25',
          // Hover: intensify glow + slight lift + shine sweep
          'hover:shadow-xl hover:shadow-purple-500/35 hover:scale-[1.03]',
          'hover:from-violet-400 hover:via-purple-400 hover:to-fuchsia-400',
          // Shine sweep overlay
          'before:absolute before:inset-0 before:-translate-x-full',
          'before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent',
          'before:transition-transform before:duration-700 before:ease-out',
          'hover:before:translate-x-full',
          className,
        )}
        {...rest}
      >
        {loading ? (
          <PulseDots />
        ) : (
          <>
            {icon}
            {children}
          </>
        )}
      </button>
    );
  }

  if (variant === 'primary-gradient') {
    const gFrom = gradientFrom || '#8b5cf6';
    const gTo = gradientTo || '#d946ef';
    return (
      <button
        disabled={disabled || loading}
        className={cn(
          baseClasses,
          'text-white',
          'shadow-lg hover:shadow-xl',
          'hover:-translate-y-0.5',
          'before:absolute before:inset-0 before:-translate-x-full',
          'before:bg-gradient-to-r before:from-transparent before:via-white/25 before:to-transparent',
          'before:transition-transform before:duration-700 before:ease-out',
          'hover:before:translate-x-full',
          className,
        )}
        style={{
          background: `linear-gradient(135deg, ${gFrom}, ${gTo})`,
          boxShadow: `0 4px 14px ${gFrom}44`,
        }}
        {...rest}
      >
        {loading ? <PulseDots /> : <>{icon}{children}</>}
      </button>
    );
  }

  if (variant === 'glass-elevated') {
    return (
      <button
        disabled={disabled || loading}
        className={cn(
          baseClasses,
          'bg-white/[0.07] backdrop-blur-md border border-white/[0.12] text-white/90',
          'shadow-md shadow-black/10',
          'hover:bg-white/[0.12] hover:border-white/[0.25] hover:text-white',
          'hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/20',
          className,
        )}
        {...rest}
      >
        {loading ? <PulseDots /> : <>{icon}{children}</>}
      </button>
    );
  }

  // ghost-glass
  return (
    <button
      disabled={disabled || loading}
      className={cn(
        baseClasses,
        'bg-white/5 border border-white/10 text-gray-300',
        'backdrop-blur-sm',
        'hover:bg-white/10 hover:border-white/20 hover:text-white',
        'hover:scale-[1.02] hover:shadow-lg hover:shadow-black/10',
        className,
      )}
      {...rest}
    >
      {loading ? <PulseDots /> : <>{icon}{children}</>}
    </button>
  );
}

// ================================================================
// 2. TagChip — 胶囊形标签按钮
// ================================================================
function TagChipButton({
  selected,
  accent = '#8b5cf6',
  size = 'md',
  className,
  children,
  disabled,
  ...rest
}: Omit<RefinedButtonProps, 'variant'>) {
  const sizeClasses: Record<string, string> = {
    sm: 'px-2.5 py-1 text-[11px] rounded-full',
    md: 'px-3 py-1.5 text-xs rounded-full',
    lg: 'px-4 py-2 text-sm rounded-full',
    xl: 'px-5 py-2.5 text-sm rounded-full',
  };

  return (
    <button
      disabled={disabled}
      className={cn(
        'inline-flex items-center gap-1 font-medium',
        'transition-all duration-300 ease-out',
        'disabled:opacity-40 disabled:cursor-not-allowed',
        'active:scale-95',
        'select-none',
        sizeClasses[size],
        selected
          ? 'bg-opacity-20 border shadow-inner'
          : 'bg-white/5 border border-white/10 text-gray-400 hover:border-white/20 hover:text-gray-300 hover:bg-white/8',
        selected && 'animate-pulse-glow',
        className,
      )}
      style={selected ? {
        backgroundColor: accent + '22',
        borderColor: accent + '66',
        color: accent,
        boxShadow: '0 0 12px ' + accent + '22, inset 0 1px 2px ' + accent + '15',
      } : undefined}
      {...rest}
    >
      {selected && (
        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      )}
      {children}
    </button>
  );
}

// ================================================================
// 3. IconRound — 圆形图标按钮
// ================================================================
function IconRoundButton({
  size = 'md',
  loading,
  className,
  children,
  disabled,
  ...rest
}: Omit<RefinedButtonProps, 'variant'>) {
  const sizeMap = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-14 h-14',
  };

  return (
    <button
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center rounded-full',
        'bg-white/5 border border-white/10 text-gray-400',
        'transition-all duration-300 ease-out',
        'hover:bg-white/10 hover:border-white/20 hover:text-white',
        'hover:rotate-6 hover:scale-110',
        'active:scale-90 active:rotate-0',
        'disabled:opacity-40 disabled:cursor-not-allowed',
        sizeMap[size],
        className,
      )}
      {...rest}
    >
      {loading ? <PulseDots /> : children}
    </button>
  );
}

// ================================================================
// 4. SegmentedControl — iOS 风格分段控制器
// ================================================================
interface SegmentedOption<T extends string> {
  value: T;
  label: string;
  icon?: ReactNode;
}

interface SegmentedControlProps<T extends string> {
  options: SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
  size?: 'sm' | 'md';
  className?: string;
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  size = 'md',
  className,
}: SegmentedControlProps<T>) {
  const sizeClasses = size === 'sm'
    ? 'px-3 py-1.5 text-xs'
    : 'px-4 py-2 text-sm';

  return (
    <div className={cn(
      'flex bg-white/5 rounded-lg p-0.5',
      'border border-white/5',
      className,
    )}>
      {options.map((opt, i) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={cn(
              'relative flex items-center gap-1.5 font-medium rounded-md',
              'transition-all duration-300 ease-out',
              'active:scale-95',
              sizeClasses,
              active
                ? 'bg-gradient-to-r from-violet-500/90 to-purple-500/90 text-white shadow-md shadow-purple-500/20'
                : 'text-gray-400 hover:text-white hover:bg-white/5',
            )}
          >
            {active && (
              <span className="absolute inset-0 rounded-md bg-white/10 animate-shimmer-in" />
            )}
            {opt.icon}
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

// ================================================================
// 5. HeartToggle — 心形收藏按钮（带填充动画 + 脉冲波纹）
// ================================================================
function HeartToggleButton({
  size = 'md',
  isToggled = false,
  className,
  children,
  disabled,
  ...rest
}: Omit<RefinedButtonProps, 'variant'> & { isToggled?: boolean }) {
  const sizeMap: Record<string, string> = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-14 h-14',
  };

  return (
    <button
      disabled={disabled}
      className={cn(
        'inline-flex items-center justify-center rounded-full',
        'transition-all duration-300 ease-out',
        'active:scale-90',
        'disabled:opacity-40 disabled:cursor-not-allowed',
        'relative',
        isToggled
          ? 'bg-pink-500/15 border border-pink-400/40 text-pink-400 shadow-[0_0_12px_rgba(236,72,153,0.2)]'
          : 'bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 hover:border-white/25 hover:text-gray-300',
        sizeMap[size],
        className,
      )}
      {...rest}
    >
      <span className={cn(
        'inline-flex transition-transform duration-300',
        isToggled && 'animate-heart-pop',
      )}>
        {children}
      </span>
      {isToggled && (
        <span
          className="absolute inset-0 rounded-full animate-ping bg-pink-400/20 pointer-events-none"
          style={{ animationDuration: '0.5s', animationIterationCount: '1' }}
        />
      )}
    </button>
  );
}

// ================================================================
// Shared: PulseDots — 加载中的三个脉冲点
// ================================================================
function PulseDots() {
  return (
    <span className="flex items-center gap-1">
      <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce [animation-delay:0ms]" />
      <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce [animation-delay:150ms]" />
      <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce [animation-delay:300ms]" />
    </span>
  );
}
