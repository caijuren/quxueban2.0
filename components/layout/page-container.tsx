'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface PageContainerProps {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  className?: string;
}

const sizeMap = {
  sm: 'max-w-3xl',
  md: 'max-w-4xl',
  lg: 'max-w-5xl',
  xl: 'max-w-7xl',
  full: '',
};

export default function PageContainer({ children, size = 'full', className }: PageContainerProps) {
  return (
    <div className={cn('mx-auto w-full p-6 lg:p-8', sizeMap[size], className)}>{children}</div>
  );
}
