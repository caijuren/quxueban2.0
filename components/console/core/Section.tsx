'use client';

import { ReactNode } from 'react';
import Button from '@/components/ui/button';

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
    <section className="overflow-hidden rounded-[20px] border border-border-default bg-surface">
      <div className="flex items-center justify-between border-b border-border-subtle px-5 py-4">
        <div>
          <h2 className="text-base font-bold text-text-primary">{title}</h2>
          {description && <p className="mt-0.5 text-xs text-text-muted">{description}</p>}
        </div>
        {action && (
          <Button
            onClick={action.onClick}
            variant="link"
            size="xs"
            className="text-xs text-primary transition-colors hover:text-primary-glow"
          >
            {action.label}
          </Button>
        )}
      </div>
      <div className="p-2">{children}</div>
    </section>
  );
}
