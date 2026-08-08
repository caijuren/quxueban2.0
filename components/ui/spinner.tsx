'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'xs' | 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'text' | 'current';
}

const sizeMap = {
  xs: 'size-3',
  sm: 'size-4',
  md: 'size-6',
  lg: 'size-8',
};

const colorMap = {
  primary: 'text-primary',
  secondary: 'text-secondary',
  text: 'text-text-secondary',
  current: 'text-current',
};

const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  ({ className, size = 'md', color = 'text', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'animate-spin rounded-full border-2 border-current border-t-transparent',
          sizeMap[size],
          colorMap[color],
          className
        )}
        {...props}
      />
    );
  }
);
Spinner.displayName = 'Spinner';

export default Spinner;
