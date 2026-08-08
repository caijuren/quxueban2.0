'use client';

import { cn } from '@/lib/utils';
import Card from './card';
import Button from './button';
import { Icon, type IconName } from './icon';

export interface EmptyStateProps {
  icon?: IconName;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  compact?: boolean;
  className?: string;
}

export default function EmptyState({
  icon,
  title,
  description,
  action,
  compact = false,
  className,
}: EmptyStateProps) {
  const iconNode = icon ? (
    <Icon name={icon} size={compact ? 'md' : 'lg'} className="text-text-tertiary" />
  ) : null;

  if (compact) {
    return (
      <div className={cn('flex flex-col items-center justify-center py-8 text-center', className)}>
        {iconNode && (
          <div className="rounded-full bg-surface-hover p-2.5 text-text-tertiary">{iconNode}</div>
        )}
        <p className="mt-3 text-sm font-medium text-text-secondary">{title}</p>
        {description && <p className="mt-1 text-xs text-text-muted">{description}</p>}
        {action && (
          <Button variant="primary" size="sm" className="mt-3" onClick={action.onClick}>
            {action.label}
          </Button>
        )}
      </div>
    );
  }

  return (
    <Card padding="lg" className={cn('text-center', className)}>
      {iconNode && (
        <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-surface-hover">
          {iconNode}
        </div>
      )}
      <p className="mb-1 font-medium text-text-secondary">{title}</p>
      {description && <p className="mb-4 text-sm text-text-muted">{description}</p>}
      {action && (
        <Button variant="primary" size="sm" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </Card>
  );
}
