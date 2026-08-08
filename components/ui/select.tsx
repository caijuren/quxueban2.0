'use client';

import * as React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  options: SelectOption[];
  size?: 'sm' | 'md' | 'lg';
  error?: boolean;
  placeholder?: string;
}

const sizeMap = {
  sm: 'h-8 px-3 text-xs',
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-4 text-base',
};

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, options, size = 'md', error = false, placeholder, children, ...props }, ref) => {
    return (
      <div className="relative w-full">
        <select
          ref={ref}
          className={cn(
            'w-full appearance-none rounded-lg border bg-surface pr-10 text-text-primary',
            'transition-colors duration-fast',
            'focus:outline-none focus:ring-2',
            'disabled:cursor-not-allowed disabled:bg-bg-disabled disabled:opacity-60',
            sizeMap[size],
            error
              ? 'focus:ring-error/10 border-error focus:border-error'
              : 'focus:ring-primary/10 border-border-default focus:border-primary',
            className
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value} disabled={option.disabled}>
              {option.label}
            </option>
          ))}
          {children}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-text-muted" />
      </div>
    );
  }
);
Select.displayName = 'Select';

export default Select;
