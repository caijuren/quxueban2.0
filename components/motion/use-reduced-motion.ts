'use client';

import { useReducedMotion as useFramerReducedMotion } from 'framer-motion';

/**
 * Returns true if the user prefers reduced motion.
 * Wraps Framer Motion's hook for SSR safety and consistency with MotionProvider.
 */
export function useReducedMotion(): boolean {
  const framerReduced = useFramerReducedMotion();
  // During SSR, default to true to avoid hydration mismatch and unnecessary animation.
  if (typeof window === 'undefined') return true;
  return framerReduced ?? false;
}
