'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface GlassCardProps {
  children: React.ReactNode;
  strength?: 'subtle' | 'default' | 'strong';
  hover?: boolean;
  glow?: 'none' | 'primary' | 'secondary' | 'ai';
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

const strengthMap = {
  subtle: 'glass-subtle',
  default: 'glass',
  strong: 'glass-strong',
};

const glowMap = {
  none: '',
  primary: 'glass-glow-primary',
  secondary: 'glass-glow-secondary',
  ai: 'glass-glow-ai',
};

function GlassCardComponent(
  {
    children,
    strength = 'default',
    hover = false,
    glow = 'none',
    className,
    as: Component = 'div',
    ...props
  }: GlassCardProps & Omit<React.HTMLAttributes<HTMLElement>, 'as'>,
  ref: React.ForwardedRef<HTMLElement>
) {
  const Tag = Component as React.ElementType;

  return (
    <Tag
      ref={ref}
      className={cn(
        'relative rounded-xl transition-colors duration-layout',
        strengthMap[strength],
        hover && 'glass-hover cursor-pointer',
        glowMap[glow],
        className
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}

const GlassCard = React.forwardRef(GlassCardComponent) as <
  T extends keyof JSX.IntrinsicElements = 'div'
>(
  props: GlassCardProps & {
    as?: T;
  } & Omit<React.ComponentPropsWithRef<T>, 'as' | 'className' | 'children' | 'strength' | 'hover' | 'glow'>,
  ref: React.ForwardedRef<React.ElementRef<T>>
) => React.ReactElement | null;

(GlassCard as React.ForwardRefExoticComponent<unknown>).displayName = 'GlassCard';

export default GlassCard;
