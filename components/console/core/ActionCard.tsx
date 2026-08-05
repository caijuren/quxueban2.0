'use client';

import { LucideIcon } from 'lucide-react';

interface Action {
  label: string;
  variant?: 'primary' | 'secondary';
  onClick?: () => void;
}

interface ActionCardProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  actions?: Action[];
}

export default function ActionCard({ icon: Icon, title, description, actions }: ActionCardProps) {
  return (
    <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-4">
      <div className="flex items-start gap-3">
        {Icon && (
          <div className="w-9 h-9 rounded-xl bg-ai/10 flex items-center justify-center shrink-0">
            <Icon className="w-4 h-4 text-ai" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-text-secondary">{title}</p>
          {description && <p className="text-xs text-text-muted mt-1">{description}</p>}
        </div>
      </div>
      {actions && actions.length > 0 && (
        <div className="flex items-center gap-2 mt-3 justify-end">
          {actions.map((action, index) => (
            <button
              key={index}
              onClick={action.onClick}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                action.variant === 'primary'
                  ? 'bg-primary text-white hover:opacity-90'
                  : 'bg-white/[0.06] text-text-secondary hover:bg-white/[0.10]'
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
