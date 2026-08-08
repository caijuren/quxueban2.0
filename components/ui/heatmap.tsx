'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface HeatmapDay {
  date: string;
  count: number;
  label?: string;
}

export interface HeatmapProps {
  data: HeatmapDay[];
  maxCount?: number;
  days?: number;
  cellSize?: number;
  className?: string;
}

function getIntensity(count: number, maxCount: number): string {
  if (count === 0) return 'bg-border-subtle';
  const ratio = count / maxCount;
  if (ratio <= 0.25) return 'bg-primary/30';
  if (ratio <= 0.5) return 'bg-primary/60';
  if (ratio <= 0.75) return 'bg-primary/80';
  return 'bg-primary';
}

export default function Heatmap({
  data,
  maxCount,
  days = 28,
  cellSize = 14,
  className,
}: HeatmapProps) {
  const displayData = data.slice(-days);
  const resolvedMax = maxCount ?? Math.max(...displayData.map((d) => d.count), 1);
  const gap = 3;

  return (
    <div className={cn('w-full', className)}>
      <div className="flex flex-wrap" style={{ gap }}>
        {displayData.map((day, i) => (
          <div
            key={day.date}
            className={cn(
              'rounded-sm transition-colors duration-micro',
              getIntensity(day.count, resolvedMax)
            )}
            style={{ width: cellSize, height: cellSize }}
            title={`${day.label ?? day.date}: ${day.count} 次`}
          />
        ))}
      </div>
      {displayData.length === 0 && (
        <p className="py-4 text-center text-sm text-text-muted">暂无打卡数据</p>
      )}
    </div>
  );
}