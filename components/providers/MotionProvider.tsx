'use client';

import { ReactNode, useEffect, useState } from 'react';
import { MotionConfig } from 'framer-motion';

export function MotionProvider({ children }: { children: ReactNode }) {
  const [reducedMotion, setReducedMotion] = useState(true);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setReducedMotion(event.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute(
      'data-reduced-motion',
      reducedMotion ? 'true' : 'false'
    );
  }, [reducedMotion]);

  return (
    <MotionConfig reducedMotion="user" transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}>
      {children}
    </MotionConfig>
  );
}
