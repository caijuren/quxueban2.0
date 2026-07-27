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
        'rounded-xl border transition-all duration-200 overflow-hidden',
        active
          ? 'bg-white/[0.05] border-primary/20 shadow-glow-primary'
          : 'bg-white/[0.03] border-white/[0.06]',
        hover && !active && 'hover:border-white/[0.12] hover:bg-white/[0.05]',
        isInteractive && 'cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950',
        corner && 'corner-accent',
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
