'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useReducedMotion } from './use-reduced-motion';

interface ScaleOnHoverProps {
  children: React.ReactNode;
  scale?: number;
  lift?: number;
  disabled?: boolean;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

export function ScaleOnHover({
  children,
  scale = 1.01,
  lift = -2,
  disabled = false,
  className,
  as = 'div',
}: ScaleOnHoverProps) {
  const shouldReduceMotion = useReducedMotion();
  const Component = motion[as as 'div'];

  return (
    <Component
      whileHover={
        disabled || shouldReduceMotion
          ? undefined
          : {
              y: lift,
              scale,
            }
      }
      whileTap={
        disabled || shouldReduceMotion
          ? undefined
          : {
              scale: 0.98,
            }
      }
      transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
      className={cn(className)}
    >
      {children}
    </Component>
  );
}
