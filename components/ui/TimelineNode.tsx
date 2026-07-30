'use client';

import { cn } from '@/lib/utils';

interface TimelineNodeProps {
  title: string;
  subtitle?: string;
  status?: 'completed' | 'current' | 'upcoming';
  isLast?: boolean;
  className?: string;
}

const statusConfig = {
  completed: {
    dot: 'bg-success border-success',
    line: 'bg-success/30',
    text: 'text-text-secondary',
  },
  current: {
    dot: 'bg-primary border-primary shadow-glow-primary',
    line: 'bg-border-default',
    text: 'text-text-primary',
  },
  upcoming: {
    dot: 'bg-surface-elevated border-border-default',
    line: 'bg-border-default',
    text: 'text-text-secondary',
  },
};

export default function TimelineNode({
  title,
  subtitle,
  status = 'upcoming',
  isLast = false,
  className,
}: TimelineNodeProps) {
  const config = statusConfig[status];

  return (
    <div className={cn('flex gap-3', className)}>
      <div className="flex flex-col items-center">
        <div
          className={cn(
            'w-2 h-2 rounded-full border transition-shadow duration-200',
            config.dot
          )}
        />
        {!isLast && (
          <div className={cn('w-px flex-1 mt-1.5', config.line)} />
        )}
      </div>
      <div className={cn('pb-4 -mt-1', isLast && 'pb-0')}>
        <p className={cn('text-sm font-medium', config.text)}>{title}</p>
        {subtitle && <p className="text-xs text-text-secondary mt-0.5">{subtitle}</p>}
      </div>
    </div>
  );
}
