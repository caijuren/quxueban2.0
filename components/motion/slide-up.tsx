'use client';

import * as React from 'react';
import { motion, type Transition } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useReducedMotion } from './use-reduced-motion';

interface SlideUpProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  distance?: number;
  className?: string;
  once?: boolean;
  as?: keyof JSX.IntrinsicElements;
}

export function SlideUp({
  children,
  delay = 0,
  duration = 0.4,
  distance = 8,
  className,
  once = true,
  as = 'div',
}: SlideUpProps) {
  const shouldReduceMotion = useReducedMotion();
  const Component = motion[as as 'div'];

  const transition: Transition = {
    duration: shouldReduceMotion ? 0 : duration,
    delay,
    ease: [0.16, 1, 0.3, 1],
  };

  return (
    <Component
      initial={{
        opacity: shouldReduceMotion ? 1 : 0,
        y: shouldReduceMotion ? 0 : distance,
      }}
      animate={{ opacity: 1, y: 0 }}
      transition={transition}
      className={cn(className)}
    >
      {children}
    </Component>
  );
}
