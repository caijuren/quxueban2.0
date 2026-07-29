'use client';

import { cn } from '@/lib/utils';

interface CommandCardProps {
  children: React.ReactNode;
  className?: string;
  active?: boolean;
  success?: boolean;
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
  success = false,
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
        'relative rounded-2xl border transition-all duration-200 overflow-hidden',
        success
          ? 'bg-surface/70 border-border-default/80'
          : active
          ? 'bg-surface-light border-primary/25 shadow-glow-primary'
          : 'bg-surface border-border-default',
        hover && !active && 'hover:border-border-strong hover:bg-surface-light',
        isInteractive && 'cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        corner && 'corner-accent',
        className
      )}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role={role ?? (isInteractive ? 'button' : undefined)}
      tabIndex={tabIndex ?? (isInteractive ? 0 : undefined)}
      aria-label={ariaLabel}
    >
      {success && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-primary-glow to-primary shadow-glow-sm" />
      )}
      {children}
    </div>
  );
}
