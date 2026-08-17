'use client';

import * as React from 'react';
import { motion, type Variants, type Transition } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useReducedMotion } from './use-reduced-motion';

interface StaggerContainerProps {
  children: React.ReactNode;
  stagger?: number;
  delayChildren?: number;
  duration?: number;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

const containerVariants = (stagger: number, delayChildren: number, duration: number): Variants => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: stagger,
      delayChildren,
    },
  },
});

const itemVariants = (duration: number): Variants => ({
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration,
      ease: [0.16, 1, 0.3, 1],
    },
  },
});

export function StaggerContainer({
  children,
  stagger = 0.05,
  delayChildren = 0,
  duration = 0.4,
  className,
  as = 'div',
}: StaggerContainerProps) {
  const shouldReduceMotion = useReducedMotion();
  const Component = motion[as as 'div'];

  const transition: Transition = {
    staggerChildren: shouldReduceMotion ? 0 : stagger,
    delayChildren: shouldReduceMotion ? 0 : delayChildren,
  };

  return (
    <Component
      suppressHydrationWarning
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: shouldReduceMotion ? 1 : 0 },
        visible: {
          opacity: 1,
          transition,
        },
      }}
      className={cn(className)}
    >
      {children}
    </Component>
  );
}

interface StaggerItemProps {
  children: React.ReactNode;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

export function StaggerItem({ children, className, as = 'div' }: StaggerItemProps) {
  const shouldReduceMotion = useReducedMotion();
  const Component = motion[as as 'div'];

  return (
    <Component
      suppressHydrationWarning
      variants={{
        hidden: { opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 8 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: shouldReduceMotion ? 0 : 0.4,
            ease: [0.16, 1, 0.3, 1],
          },
        },
      }}
      className={cn(className)}
    >
      {children}
    </Component>
  );
}
