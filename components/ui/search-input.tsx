'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Icon } from '@/components/ui/icon';
import Button from '@/components/ui/button';
import Input, { InputProps } from './input';

export interface SearchInputProps extends Omit<InputProps, 'leftIcon' | 'type'> {
  onClear?: () => void;
}

const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, value, onChange, onClear, ...props }, ref) => {
    const inputValue = String(value ?? '');
    const hasValue = inputValue.length > 0;

    return (
      <div className={cn('relative', className)}>
        <Input
          ref={ref}
          type="text"
          value={value}
          onChange={onChange}
          leftIcon={<Icon name="Search" size="sm" />}
          className="pr-9"
          {...props}
        />
        {hasValue && onClear && (
          <Button
            type="button"
            onClick={onClear}
            variant="ghost"
            size="xs"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted transition-colors hover:text-text-secondary"
            aria-label="清除"
          >
            <Icon name="X" size="sm" />
          </Button>
        )}
      </div>
    );
  }
);
SearchInput.displayName = 'SearchInput';

export default SearchInput;
