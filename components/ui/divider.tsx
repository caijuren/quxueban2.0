'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical';
}

const Divider = React.forwardRef<HTMLDivElement, DividerProps>(
  ({ className, orientation = 'horizontal', ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="separator"
        className={cn(
          'bg-border-default',
          orientation === 'horizontal' && 'h-px w-full',
          orientation === 'vertical' && 'h-full w-px',
          className
        )}
        {...props}
      />
    );
  }
);
Divider.displayName = 'Divider';

export default Divider;
