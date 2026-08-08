'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { useReducedMotion } from '@/components/motion/use-reduced-motion';

export interface ProgressRingProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  strokeWidth?: number;
  showLabel?: boolean;
  label?: string;
  className?: string;
}

const sizeMap = {
  sm: 48,
  md: 64,
  lg: 80,
  xl: 104,
};

const labelSizeMap = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-lg',
  xl: 'text-2xl',
};

export default function ProgressRing({
  value,
  max = 100,
  size = 'md',
  strokeWidth: sw,
  showLabel = true,
  label,
  className,
}: ProgressRingProps) {
  const shouldReduceMotion = useReducedMotion();
  const dimension = sizeMap[size];
  const strokeWidth = sw ?? Math.round(dimension * 0.08);
  const radius = (dimension - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <svg
        width={dimension}
        height={dimension}
        viewBox={`0 0 ${dimension} ${dimension}`}
        className="-rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={dimension / 2}
          cy={dimension / 2}
          r={radius}
          fill="none"
          stroke="var(--border-subtle)"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <circle
          cx={dimension / 2}
          cy={dimension / 2}
          r={radius}
          fill="none"
          stroke="url(#progress-ring-gradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{
            transition: shouldReduceMotion
              ? 'none'
              : 'stroke-dashoffset 600ms cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        />
        <defs>
          <linearGradient id="progress-ring-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--color-primary)" />
            <stop offset="100%" stopColor="var(--color-secondary)" />
          </linearGradient>
        </defs>
      </svg>
      {showLabel && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className={cn(
              'font-bold tabular-nums text-text-primary',
              labelSizeMap[size]
            )}
          >
            {label ?? `${Math.round(percentage)}%`}
          </span>
        </div>
      )}
    </div>
  );
}