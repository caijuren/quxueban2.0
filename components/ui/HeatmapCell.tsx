'use client';

import { cn } from '@/lib/utils';
import Button from '@/components/ui/button';

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
    <Button
      type="button"
      onClick={onClick}
      variant="ghost"
      className={cn(
        'relative min-h-[72px] w-full rounded-lg border p-2 text-left transition-all duration-200',
        intensity === 0
          ? 'border-transparent bg-transparent'
          : intensity >= 70
            ? 'bg-success/10 border-success/20 hover:bg-success/15'
            : intensity >= 40
              ? 'bg-warning/10 border-warning/20 hover:bg-warning/15'
              : 'border-border-subtle bg-surface-hover hover:bg-surface-highlight',
        className
      )}
    >
      {label && <p className="line-clamp-2 text-[11px] font-medium text-text-secondary">{label}</p>}
      {sublabel && <p className="mt-0.5 text-[10px] tabular-nums text-text-muted">{sublabel}</p>}
    </Button>
  );
}
