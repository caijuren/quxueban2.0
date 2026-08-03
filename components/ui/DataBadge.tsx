'use client';

import { cn } from '@/lib/utils';

interface DataBadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error' | 'default';
  size?: 'sm' | 'md';
  className?: string;
}

const variantMap = {
  primary: 'bg-primary/[0.08] text-primary border-primary/15',
  secondary: 'bg-secondary/[0.08] text-secondary border-secondary/15',
  accent: 'bg-accent/[0.08] text-accent border-accent/15',
  success: 'bg-success/[0.08] text-success border-success/15',
  warning: 'bg-warning/[0.08] text-warning border-warning/15',
  error: 'bg-error/[0.08] text-error border-error/15',
  default: 'bg-surface-elevated text-text-tertiary border-border-default',
};

const sizeMap = {
  sm: 'px-1.5 py-0.5 text-2xs rounded',
  md: 'px-2 py-0.5 text-xs rounded-md',
};

export default function DataBadge({
  children,
  variant = 'default',
  size = 'md',
  className,
}: DataBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 font-medium tabular-nums tracking-tight',
        variantMap[variant],
        sizeMap[size],
        className
      )}
    >
      {children}
    </span>
  );
}
