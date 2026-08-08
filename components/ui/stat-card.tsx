'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Icon, type IconName } from '@/components/ui/icon';
import Card from './card';
import Badge from './badge';
import Skeleton from './skeleton';

export interface StatCardProps {
  title: string;
  value: string | number;
  icon?: IconName;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  loading?: boolean;
  className?: string;
}

export default function StatCard({
  title,
  value,
  icon,
  trend,
  loading = false,
  className,
}: StatCardProps) {
  return (
    <Card padding="md" className={cn(className)}>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm text-text-secondary">{title}</p>
          {loading ? (
            <Skeleton className="mt-2 h-8 w-20" />
          ) : (
            <p className="mt-1 truncate text-2xl font-bold text-text-primary">{value}</p>
          )}
          {!loading && trend && (
            <Badge variant={trend.isPositive ? 'success' : 'error'} size="sm" className="mt-2">
              {trend.isPositive ? (
                <Icon name="TrendingUp" size="xs" className="mr-0.5" />
              ) : (
                <Icon name="TrendingDown" size="xs" className="mr-0.5" />
              )}
              {trend.value}%
            </Badge>
          )}
        </div>
        {icon && (
          <div className="bg-primary/10 shrink-0 rounded-lg p-2 text-primary">
            <Icon name={icon} size="md" />
          </div>
        )}
      </div>
    </Card>
  );
}
