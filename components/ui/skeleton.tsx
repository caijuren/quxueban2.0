'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'shimmer';
  glass?: boolean;
}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  (
    {
      className,
      variant = 'text',
      width,
      height,
      animation = 'pulse',
      glass = false,
      style,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          animation === 'pulse' && 'animate-pulse',
          animation === 'shimmer' &&
            'animate-shimmer bg-[length:200%_100%] bg-gradient-to-r from-surface-hover via-surface-elevated to-surface-hover',
          glass
            ? 'bg-glass-bg-subtle'
            : 'bg-surface-hover',
          variant === 'circular' && 'rounded-full',
          variant === 'text' && 'rounded-md',
          variant === 'rectangular' && 'rounded-lg',
          variant === 'rounded' && 'rounded-xl',
          className
        )}
        style={{
          width,
          height,
          ...style,
        }}
        {...props}
      />
    );
  }
);
Skeleton.displayName = 'Skeleton';

export default Skeleton;