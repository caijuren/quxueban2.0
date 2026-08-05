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
      <div className="flex items-center gap-3 min-w-0">
        {Icon && (
          <div className="w-9 h-9 rounded-xl bg-white/[0.04] flex items-center justify-center shrink-0">
            <Icon className={`w-4 h-4 ${variant === 'warning' ? 'text-warning' : 'text-text-tertiary'}`} />
          </div>
        )}
        <div className="min-w-0">
          <p className={`text-sm font-medium truncate ${variant === 'warning' ? 'text-warning' : 'text-text-secondary'}`}>
            {label}
          </p>
          {description && (
            <p className="text-xs text-text-muted truncate">{description}</p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {value && <span className="text-xs text-text-tertiary">{value}</span>}
        <ChevronRight className="w-4 h-4 text-text-muted" />
      </div>
    </>
  );

  const className =
    'flex items-center justify-between px-4 py-3.5 rounded-xl transition-colors hover:bg-white/[0.04] group';

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
