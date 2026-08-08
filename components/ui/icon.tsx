'use client';

import * as React from 'react';
import { icons, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

// Backward-compatible aliases for icons renamed in lucide-react v0.400+
const iconAliases: Record<string, keyof typeof icons> = {
  AlertCircle: 'CircleAlert',
  AlertTriangle: 'TriangleAlert',
  CheckCircle: 'CircleCheck',
  CheckCircle2: 'CircleCheckBig',
  HelpCircle: 'CircleHelp',
  Home: 'House',
  ImageIcon: 'Image',
  Loader2: 'LoaderCircle',
  XCircle: 'CircleX',
};

export type IconName = keyof typeof icons | keyof typeof iconAliases;

const sizeMap = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
};

export interface IconProps {
  name: IconName;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'filled' | 'gradient';
  animate?: 'spin' | 'pulse' | 'bounce';
  className?: string;
  style?: React.CSSProperties;
}

export function Icon({ name, size = 'md', variant = 'default', animate, className, style }: IconProps) {
  const resolvedName = iconAliases[name] ?? name;
  const LucideIconComponent = icons[resolvedName] as LucideIcon;

  if (!LucideIconComponent) {
    console.warn(`Icon "${name}" not found in lucide-react`);
    return null;
  }

  return (
    <LucideIconComponent
      size={sizeMap[size]}
      className={cn(
        'shrink-0',
        variant === 'gradient' && 'gradient-text',
        animate === 'spin' && 'animate-spin',
        animate === 'pulse' && 'animate-pulse',
        animate === 'bounce' && 'animate-bounce',
        className
      )}
      style={style}
      fill={variant === 'filled' ? 'currentColor' : 'none'}
    />
  );
}

export function createIcon(name: IconName) {
  return function CreatedIcon(props: Omit<IconProps, 'name'>) {
    return <Icon name={name} {...props} />;
  };
}

export function isIconName(value: unknown): value is IconName {
  return typeof value === 'string' && (value in icons || value in iconAliases);
}
