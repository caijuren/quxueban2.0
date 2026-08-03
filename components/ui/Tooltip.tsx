'use client';

import { cn } from '@/lib/utils';

interface TooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

export default function Tooltip({
  children,
  content,
  position = 'bottom',
  className,
}: TooltipProps) {
  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  return (
    <div className={cn('relative group inline-flex', className)}>
      {children}
      <div
        role="tooltip"
        className={cn(
          'absolute z-30 w-48 p-3 rounded-lg bg-surface-elevated border border-border-default shadow-xl',
          'opacity-0 invisible group-hover:opacity-100 group-hover:visible',
          'group-focus-within:opacity-100 group-focus-within:visible',
          'transition-all duration-200 pointer-events-none',
          positionClasses[position]
        )}
      >
        {content}
      </div>
    </div>
  );
}
