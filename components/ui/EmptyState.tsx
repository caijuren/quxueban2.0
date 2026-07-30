'use client';

import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export default function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="rounded-2xl glass p-8 text-center border border-border-subtle">
      {Icon && (
        <div className="w-12 h-12 rounded-xl bg-surface-elevated flex items-center justify-center mx-auto mb-4">
          <Icon className="w-6 h-6 text-text-secondary" />
        </div>
      )}
      <p className="text-text-primary font-medium mb-1">{title}</p>
      {description && <p className="text-sm text-text-secondary mb-4">{description}</p>}
      {action && (
        <button
          onClick={action.onClick}
          className="px-4 py-2 rounded-lg bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 transition-all focus-ring"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
