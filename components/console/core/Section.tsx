'use client';

import { ReactNode } from 'react';

interface SectionProps {
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick?: () => void;
    href?: string;
  };
  children: ReactNode;
}

export default function Section({ title, description, action, children }: SectionProps) {
  return (
    <section className="rounded-[20px] bg-surface border border-border-default overflow-hidden">
      <div className="px-5 py-4 border-b border-border-subtle flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-text-primary">{title}</h2>
          {description && (
            <p className="text-xs text-text-muted mt-0.5">{description}</p>
          )}
        </div>
        {action && (
          <button
            onClick={action.onClick}
            className="text-xs text-primary hover:text-primary-glow transition-colors"
          >
            {action.label}
          </button>
        )}
      </div>
      <div className="p-2">{children}</div>
    </section>
  );
}
