'use client';

import Link from 'next/link';
import { Icon, type IconName } from '@/components/ui/icon';
import Button from '@/components/ui/button';

interface SettingRowProps {
  icon?: IconName;
  label: string;
  value?: string;
  description?: string;
  href?: string;
  onClick?: () => void;
  variant?: 'default' | 'warning';
}

export default function SettingRow({
  icon,
  label,
  value,
  description,
  href,
  onClick,
  variant = 'default',
}: SettingRowProps) {
  const iconNode = icon ? (
    <Icon
      name={icon}
      size="sm"
      className={variant === 'warning' ? 'text-warning' : 'text-text-tertiary'}
    />
  ) : null;

  const content = (
    <>
      <div className="flex min-w-0 items-center gap-3">
        {iconNode && (
          <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-surface-hover">
            {iconNode}
          </div>
        )}
        <div className="min-w-0">
          <p
            className={`truncate text-sm font-medium ${variant === 'warning' ? 'text-warning' : 'text-text-secondary'}`}
          >
            {label}
          </p>
          {description && <p className="truncate text-xs text-text-muted">{description}</p>}
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        {value && <span className="text-xs text-text-tertiary">{value}</span>}
        <Icon name="ChevronRight" size="sm" className="text-text-muted" />
      </div>
    </>
  );

  const className =
    'flex items-center justify-between px-4 py-3.5 rounded-xl transition-colors hover:bg-surface-hover group';

  if (href) {
    return (
      <Link href={href} className={className}>
        {content}
      </Link>
    );
  }

  return (
    <Button variant="ghost" size="md" onClick={onClick} className={className}>
      {content}
    </Button>
  );
}
