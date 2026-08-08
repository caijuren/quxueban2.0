'use client';

import { ChevronRight, LucideIcon } from 'lucide-react';
import Link from 'next/link';

interface SettingRowProps {
  icon?: LucideIcon;
  label: string;
  value?: string;
  description?: string;
  href?: string;
  onClick?: () => void;
  variant?: 'default' | 'warning';
}

export default function SettingRow({
  icon: Icon,
  label,
  value,
  description,
  href,
  onClick,
  variant = 'default',
}: SettingRowProps) {
  const content = (
    <>
      <div className="flex min-w-0 items-center gap-3">
        {Icon && (
          <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-surface-hover">
            <Icon
              className={`size-4 ${variant === 'warning' ? 'text-warning' : 'text-text-tertiary'}`}
            />
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
        <ChevronRight className="size-4 text-text-muted" />
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
    <button onClick={onClick} className={className}>
      {content}
    </button>
  );
}
