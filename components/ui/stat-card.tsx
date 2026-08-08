'use client';

import * as React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import Card from './card';
import Badge from './badge';
import Skeleton from './skeleton';

export interface StatCardProps {
  title: string;
  value: string | number;
  icon?: LucideIcon;
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
  icon: Icon,
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
                <TrendingUp className="mr-0.5 size-3" />
              ) : (
                <TrendingDown className="mr-0.5 size-3" />
              )}
              {trend.value}%
            </Badge>
          )}
        </div>
        {Icon && (
          <div className="bg-primary/10 shrink-0 rounded-lg p-2 text-primary">
            <Icon className="size-5" />
          </div>
        )}
      </div>
    </Card>
  );
}
