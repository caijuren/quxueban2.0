'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { useReducedMotion } from './use-reduced-motion';

interface ProgressBarProps {
  value: number;
  max?: number;
  animated?: boolean;
  className?: string;
  barClassName?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'gradient';
}

const sizeMap = {
  sm: 'h-1',
  md: 'h-1.5',
  lg: 'h-2',
};

export function ProgressBar({
  value,
  max = 100,
  animated = true,
  className,
  barClassName,
  size = 'md',
  variant = 'default',
}: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  const shouldReduceMotion = useReducedMotion();

  return (
    <div
      className={cn(
        'w-full overflow-hidden rounded-full bg-border-subtle',
        sizeMap[size],
        className
      )}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
    >
      <div
        className={cn(
          'h-full rounded-full',
          variant === 'gradient'
            ? 'bg-gradient-to-r from-primary to-secondary'
            : 'bg-primary',
          barClassName
        )}
        style={{
          width: `${percentage}%`,
          transition: animated && !shouldReduceMotion ? 'width 300ms cubic-bezier(0.16, 1, 0.3, 1)' : 'none',
        }}
      />
    </div>
  );
}
