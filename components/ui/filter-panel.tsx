'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import Button from './button';
import { Icon } from './icon';

export interface FilterPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  onClear?: () => void;
  activeCount?: number;
  clearLabel?: string;
}

export default function FilterPanel({
  children,
  onClear,
  activeCount = 0,
  clearLabel = '清除筛选',
  className,
  ...props
}: FilterPanelProps) {
  const hasActiveFilters = activeCount > 0;

  return (
    <section
      aria-label="筛选条件"
      className={cn(
        'rounded-xl border border-border-default bg-surface-elevated p-4 shadow-sm sm:p-5',
        className
      )}
      {...props}
    >
      {children}
      {onClear && hasActiveFilters && (
        <div className="mt-3 flex justify-end border-t border-border-subtle pt-3 sm:hidden">
          <Button type="button" variant="secondary" size="sm" onClick={onClear}>
            <Icon name="RotateCcw" size="sm" />
            {clearLabel}
          </Button>
        </div>
      )}
    </section>
  );
}
