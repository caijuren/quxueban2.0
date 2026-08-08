'use client';

import * as React from 'react';
import { motion, type Transition } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useReducedMotion } from './use-reduced-motion';

interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
  once?: boolean;
  as?: keyof JSX.IntrinsicElements;
}

export function FadeIn({
  children,
  delay = 0,
  duration = 0.4,
  className,
  once = true,
  as = 'div',
}: FadeInProps) {
  const shouldReduceMotion = useReducedMotion();
  const Component = motion[as as 'div'];

  const transition: Transition = {
    duration: shouldReduceMotion ? 0 : duration,
    delay,
    ease: [0.16, 1, 0.3, 1],
  };

  return (
    <Component
      initial={{ opacity: shouldReduceMotion ? 1 : 0 }}
      animate={{ opacity: 1 }}
      transition={transition}
      className={cn(className)}
      {...(once ? {} : { exit: { opacity: 0 } })}
    >
      {children}
    </Component>
  );
}
