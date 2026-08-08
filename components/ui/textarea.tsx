'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
  maxLength?: number;
  showCount?: boolean;
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
}

const resizeMap = {
  none: 'resize-none',
  vertical: 'resize-y',
  horizontal: 'resize-x',
  both: 'resize',
};

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      error = false,
      maxLength,
      showCount = false,
      resize = 'vertical',
      value,
      defaultValue,
      onChange,
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = React.useState(
      typeof defaultValue === 'string' ? defaultValue : ''
    );
    const isControlled = value !== undefined;
    const currentValue = isControlled ? String(value) : String(internalValue);
    const length = currentValue.length;
    const isOverLimit = maxLength !== undefined && length > maxLength;

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (!isControlled) {
        setInternalValue(e.target.value);
      }
      onChange?.(e);
    };

    return (
      <div className="w-full">
        <textarea
          ref={ref}
          value={value}
          defaultValue={defaultValue}
          onChange={handleChange}
          maxLength={maxLength}
          className={cn(
            'min-h-[80px] w-full rounded-lg border bg-surface p-3 text-sm text-text-primary placeholder:text-text-muted',
            'transition-colors duration-fast',
            'focus:outline-none focus:ring-2',
            'disabled:cursor-not-allowed disabled:bg-bg-disabled disabled:opacity-60',
            resizeMap[resize],
            error
              ? 'focus:ring-error/10 border-error focus:border-error'
              : 'focus:ring-primary/10 border-border-default focus:border-primary',
            className
          )}
          {...props}
        />
        {showCount && maxLength !== undefined && (
          <p
            className={cn(
              'mt-1.5 text-right text-xs',
              isOverLimit ? 'text-error' : 'text-text-muted'
            )}
          >
            {length} / {maxLength}
          </p>
        )}
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';

export default Textarea;
