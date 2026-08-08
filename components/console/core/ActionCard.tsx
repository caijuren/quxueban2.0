'use client';

import { Icon, type IconName } from '@/components/ui/icon';

interface Action {
  label: string;
  variant?: 'primary' | 'secondary';
  onClick?: () => void;
}

interface ActionCardProps {
  icon?: IconName;
  title: string;
  description?: string;
  actions?: Action[];
}

export default function ActionCard({ icon, title, description, actions }: ActionCardProps) {
  const iconNode = icon ? <Icon name={icon} size="sm" className="text-ai" /> : null;

  return (
    <div className="rounded-xl border border-border-subtle bg-surface-hover p-4">
      <div className="flex items-start gap-3">
        {iconNode && (
          <div className="bg-ai/10 flex size-9 shrink-0 items-center justify-center rounded-xl">
            {iconNode}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-text-secondary">{title}</p>
          {description && <p className="mt-1 text-xs text-text-muted">{description}</p>}
        </div>
      </div>
      {actions && actions.length > 0 && (
        <div className="mt-3 flex items-center justify-end gap-2">
          {actions.map((action, index) => (
            <button
              key={index}
              onClick={action.onClick}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                action.variant === 'primary'
                  ? 'bg-primary text-inverse hover:opacity-90'
                  : 'bg-surface-hover text-text-secondary hover:bg-surface-hover'
              }`}
            >
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
