'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import Spinner from './spinner';

export interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'size'> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'link';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const variantMap = {
  primary: 'bg-primary text-inverse hover:bg-primary/90 focus-visible:ring-primary/50',
  secondary:
    'bg-surface text-text-secondary border border-border-default hover:bg-surface-hover focus-visible:ring-primary/50',
  ghost:
    'bg-transparent text-text-secondary hover:bg-surface-hover hover:text-text-primary focus-visible:ring-primary/50',
  danger: 'bg-error/10 text-error hover:bg-error/20 focus-visible:ring-error/50',
  link: 'bg-transparent text-primary hover:underline focus-visible:ring-primary/50',
};

const sizeMap = {
  xs: 'h-7 px-2.5 text-xs',
  sm: 'h-8 px-3 text-xs',
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-6 text-base',
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading;

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-lg font-medium',
          'transition-colors duration-fast focus-visible:outline-none focus-visible:ring-2',
          'focus-visible:ring-offset-2 focus-visible:ring-offset-background',
          'disabled:pointer-events-none disabled:opacity-60',
          variantMap[variant],
          sizeMap[size],
          isLoading && 'cursor-wait',
          className
        )}
        disabled={isDisabled}
        {...props}
      >
        {isLoading && <Spinner size={size === 'lg' ? 'sm' : 'xs'} color="current" />}
        {!isLoading && leftIcon}
        {children && <span className={cn(isLoading && 'opacity-70')}>{children}</span>}
        {!isLoading && rightIcon}
      </button>
    );
  }
);
Button.displayName = 'Button';

export default Button;
