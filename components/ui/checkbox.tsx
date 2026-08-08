'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Icon } from '@/components/ui/icon';

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  indeterminate?: boolean;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, indeterminate = false, ...props }, ref) => {
    return (
      <label
        className={cn(
          'inline-flex cursor-pointer items-center gap-2',
          props.disabled && 'cursor-not-allowed opacity-60'
        )}
      >
        <span className="relative inline-flex">
          <input
            ref={ref}
            type="checkbox"
            className={cn(
              'peer size-4 rounded border bg-surface text-primary',
              'focus:ring-primary/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background',
              'checked:border-primary checked:bg-primary',
              'disabled:cursor-not-allowed disabled:opacity-60',
              indeterminate && 'border-primary bg-primary',
              className
            )}
            {...props}
          />
          <span className="pointer-events-none absolute inset-0 flex items-center justify-center text-text-primary opacity-0 peer-checked:opacity-100 peer-indeterminate:opacity-100">
            {indeterminate ? <Icon name="Minus" size="xs" /> : <Icon name="Check" size="xs" />}
          </span>
        </span>
        {label && <span className="text-sm text-text-secondary">{label}</span>}
      </label>
    );
  }
);
Checkbox.displayName = 'Checkbox';

export default Checkbox;
