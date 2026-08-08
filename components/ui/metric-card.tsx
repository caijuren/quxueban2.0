'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Icon, type IconName } from '@/components/ui/icon';
import { CountUp } from '@/components/motion/count-up';
import Card from './card';

export interface MetricCardProps {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  trend?: 'up' | 'down' | 'flat';
  trendValue?: number;
  icon?: IconName;
  variant?: 'default' | 'glass' | 'ai';
  countUp?: boolean;
  decimals?: number;
  className?: string;
}

const trendIcons: Record<string, IconName> = {
  up: 'TrendingUp',
  down: 'TrendingDown',
  flat: 'Minus',
};

const trendColors = {
  up: 'text-success',
  down: 'text-error',
  flat: 'text-text-tertiary',
};

export default function MetricCard({
  label,
  value,
  prefix = '',
  suffix = '',
  trend,
  trendValue,
  icon,
  variant = 'default',
  countUp = false,
  decimals = 0,
  className,
}: MetricCardProps) {
  return (
    <Card
      padding="md"
      className={cn(
        variant === 'glass' && 'glass',
        variant === 'ai' && 'glass border-ai',
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm text-text-secondary">{label}</p>
          <div className="mt-1 flex items-baseline gap-1.5">
            {countUp ? (
              <CountUp
                value={value}
                decimals={decimals}
                prefix={prefix}
                suffix={suffix}
                className="truncate text-2xl font-bold tabular-nums text-text-primary"
              />
            ) : (
              <span className="truncate text-2xl font-bold tabular-nums text-text-primary">
                {prefix}
                {decimals > 0 ? value.toFixed(decimals) : value}
                {suffix}
              </span>
            )}
          </div>
          {trend && trendValue !== undefined && (
            <div className={cn('mt-1.5 flex items-center gap-1 text-xs', trendColors[trend])}>
              <Icon name={trendIcons[trend]} size="xs" />
              <span className="tabular-nums">{trendValue > 0 ? '+' : ''}{trendValue}%</span>
            </div>
          )}
        </div>
        {icon && (
          <div
            className={cn(
              'shrink-0 rounded-lg p-2.5',
              variant === 'ai'
                ? 'bg-secondary/10 text-secondary'
                : 'bg-primary/10 text-primary'
            )}
          >
            <Icon name={icon} size="md" />
          </div>
        )}
      </div>
    </Card>
  );
}