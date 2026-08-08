'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ContentGridProps {
  children: React.ReactNode;
  columns?: 1 | 2 | 3 | 4;
  gap?: 'sm' | 'md' | 'lg';
  className?: string;
}

const columnsMap = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 md:grid-cols-2',
  3: 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3',
  4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
};

const gapMap = {
  sm: 'gap-4',
  md: 'gap-6',
  lg: 'gap-8',
};

export default function ContentGrid({
  children,
  columns = 3,
  gap = 'md',
  className,
}: ContentGridProps) {
  return <div className={cn('grid', columnsMap[columns], gapMap[gap], className)}>{children}</div>;
}
