'use client';

import { cn } from '@/lib/utils';

interface CommandCardProps {
  children: React.ReactNode;
  className?: string;
  active?: boolean;
  hover?: boolean;
  corner?: boolean;
  onClick?: () => void;
  role?: string;
  tabIndex?: number;
  'aria-label'?: string;
}

export default function CommandCard({
  children,
  className,
  active = false,
  hover = true,
  corner = false,
  onClick,
  role,
  tabIndex,
  'aria-label': ariaLabel,
}: CommandCardProps) {
  const isInteractive = !!onClick;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!onClick) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div
      className={cn(
        'overflow-hidden rounded-xl border transition-colors duration-200',
        active ? 'command-panel-active' : 'command-panel',
        hover && !active && 'hover:border-border-strong hover:bg-surface-hover',
        isInteractive &&
          'focus-visible:ring-primary/50 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        className
      )}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role={role ?? (isInteractive ? 'button' : undefined)}
      tabIndex={tabIndex ?? (isInteractive ? 0 : undefined)}
      aria-label={ariaLabel}
    >
      {children}
    </div>
  );
}
