'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface RadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  ({ className, label, ...props }, ref) => {
    return (
      <label
        className={cn(
          'inline-flex cursor-pointer items-center gap-2',
          props.disabled && 'cursor-not-allowed opacity-60'
        )}
      >
        <input
          ref={ref}
          type="radio"
          className={cn(
            'size-4 rounded-full border bg-surface text-primary',
            'focus:ring-primary/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background',
            'checked:border-primary checked:bg-primary',
            'disabled:cursor-not-allowed disabled:opacity-60',
            className
          )}
          {...props}
        />
        {label && <span className="text-sm text-text-secondary">{label}</span>}
      </label>
    );
  }
);
Radio.displayName = 'Radio';

export default Radio;
