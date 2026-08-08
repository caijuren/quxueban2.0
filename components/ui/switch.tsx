'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: 'sm' | 'md';
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

const trackSizeMap = {
  sm: 'w-9 h-5',
  md: 'w-11 h-6',
};

const thumbSizeMap = {
  sm: 'size-4',
  md: 'size-5',
};

const thumbTranslateMap = {
  sm: 'translate-x-4',
  md: 'translate-x-5',
};

const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, size = 'md', checked, onCheckedChange, onChange, disabled, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onCheckedChange?.(e.target.checked);
      onChange?.(e);
    };

    const isChecked = checked ?? props.defaultChecked;

    return (
      <label
        className={cn(
          'relative inline-flex cursor-pointer items-center',
          disabled && 'cursor-not-allowed opacity-60',
          className
        )}
      >
        <input
          ref={ref}
          type="checkbox"
          role="switch"
          className="peer sr-only"
          checked={checked}
          onChange={handleChange}
          disabled={disabled}
          {...props}
        />
        <span
          className={cn(
            'relative rounded-full transition-colors duration-fast',
            'focus-visible:ring-primary/50 focus-visible:outline-none focus-visible:ring-2',
            'bg-bg-disabled peer-checked:bg-primary',
            trackSizeMap[size]
          )}
        >
          <span
            className={cn(
              'absolute left-0.5 top-1/2 -translate-y-1/2 rounded-full bg-text-primary',
              'transition-transform duration-fast',
              thumbSizeMap[size],
              'peer-checked:' + thumbTranslateMap[size]
            )}
          />
        </span>
      </label>
    );
  }
);
Switch.displayName = 'Switch';

export default Switch;
