'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Icon } from '@/components/ui/icon';

export interface TimeInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  size?: 'sm' | 'md' | 'lg';
  error?: boolean;
  helperText?: string;
}

const sizeMap = {
  sm: 'h-8 px-3 pl-9 text-xs',
  md: 'h-10 px-4 pl-10 text-sm',
  lg: 'h-12 px-4 pl-11 text-base',
};

const iconSizeMap = {
  sm: 'xs' as const,
  md: 'sm' as const,
  lg: 'md' as const,
};

const TimeInput = React.forwardRef<HTMLInputElement, TimeInputProps>(
  ({ className, size = 'md', error = false, helperText, ...props }, ref) => {
    return (
      <div className="w-full">
        <div className="relative">
          <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
            <Icon name="Clock" size={iconSizeMap[size]} />
          </div>
          <input
            ref={ref}
            type="time"
            className={cn(
              'w-full appearance-none rounded-lg border bg-surface pr-3 text-text-primary',
              'transition-colors duration-fast',
              'focus:outline-none focus:ring-2',
              'disabled:cursor-not-allowed disabled:bg-bg-disabled disabled:opacity-60',
              '[&::-webkit-calendar-picker-indicator]:hidden',
              '[&::-webkit-datetime-edit-fields-wrapper]:p-0',
              sizeMap[size],
              error
                ? 'focus:ring-error/10 border-error focus:border-error'
                : 'focus:ring-primary/10 border-border-default focus:border-primary',
              className
            )}
            {...props}
          />
        </div>
        {helperText && (
          <p className={cn('mt-1.5 text-xs', error ? 'text-error' : 'text-text-muted')}>
            {helperText}
          </p>
        )}
      </div>
    );
  }
);
TimeInput.displayName = 'TimeInput';

export default TimeInput;
