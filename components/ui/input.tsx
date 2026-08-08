'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: 'sm' | 'md' | 'lg';
  error?: boolean;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const sizeMap = {
  sm: 'h-8 px-3 text-xs',
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-4 text-base',
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, size = 'md', error = false, helperText, leftIcon, rightIcon, ...props }, ref) => {
    const hasLeftIcon = !!leftIcon;
    const hasRightIcon = !!rightIcon;

    return (
      <div className="w-full">
        <div className="relative">
          {hasLeftIcon && (
            <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              'w-full rounded-lg border bg-surface text-text-primary placeholder:text-text-muted',
              'transition-colors duration-fast',
              'focus:outline-none focus:ring-2',
              'disabled:cursor-not-allowed disabled:bg-bg-disabled disabled:opacity-60',
              sizeMap[size],
              hasLeftIcon && 'pl-9',
              hasRightIcon && 'pr-9',
              error
                ? 'focus:ring-error/10 border-error focus:border-error'
                : 'focus:ring-primary/10 border-border-default focus:border-primary',
              className
            )}
            {...props}
          />
          {hasRightIcon && (
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-muted">
              {rightIcon}
            </div>
          )}
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
Input.displayName = 'Input';

export default Input;
