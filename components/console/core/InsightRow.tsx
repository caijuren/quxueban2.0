'use client';

import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface InsightRowProps {
  icon: LucideIcon;
  label: string;
  value: string;
  trend?: string;
  trendDirection?: 'up' | 'down' | 'flat';
  description?: string;
}

export default function InsightRow({
  icon: Icon,
  label,
  value,
  trend,
  trendDirection = 'flat',
  description,
}: InsightRowProps) {
  const TrendIcon =
    trendDirection === 'up' ? TrendingUp : trendDirection === 'down' ? TrendingDown : Minus;
  const trendColor =
    trendDirection === 'up'
      ? 'text-success'
      : trendDirection === 'down'
        ? 'text-warning'
        : 'text-text-muted';

  return (
    <div className="flex items-center justify-between rounded-xl px-4 py-3.5 transition-colors hover:bg-white/[0.02]">
      <div className="flex items-center gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-surface-hover">
          <Icon className="size-4 text-text-tertiary" />
        </div>
        <div>
          <p className="text-sm font-medium text-text-secondary">{label}</p>
          {description && <p className="text-xs text-text-muted">{description}</p>}
        </div>
      </div>
      <div className="text-right">
        <p className="text-base font-bold text-text-primary">{value}</p>
        {trend && (
          <p className={`flex items-center justify-end gap-0.5 text-xs ${trendColor}`}>
            <TrendIcon className="size-3" />
            {trend}
          </p>
        )}
      </div>
    </div>
  );
}
