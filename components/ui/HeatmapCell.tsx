'use client';

import { cn } from '@/lib/utils';

interface HeatmapCellProps {
  value?: number;
  label?: string;
  sublabel?: string;
  onClick?: () => void;
  className?: string;
}

export default function HeatmapCell({
  value,
  label,
  sublabel,
  onClick,
  className,
}: HeatmapCellProps) {
  const intensity = value === undefined ? 0 : Math.min(100, Math.max(0, value));

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'relative min-h-[72px] w-full rounded-lg border transition-all duration-200 text-left p-2',
        intensity === 0
          ? 'bg-transparent border-transparent'
          : intensity >= 70
          ? 'bg-success/10 border-success/20 hover:bg-success/15'
          : intensity >= 40
          ? 'bg-warning/10 border-warning/20 hover:bg-warning/15'
          : 'bg-surface-hover border-border-subtle hover:bg-surface-highlight',
        className
      )}
    >
      {label && (
        <p className="text-[11px] font-medium text-text-secondary line-clamp-2">{label}</p>
      )}
      {sublabel && (
        <p className="text-[10px] text-text-muted mt-0.5 tabular-nums">{sublabel}</p>
      )}
    </button>
  );
}
