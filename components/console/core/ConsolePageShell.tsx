'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface ConsolePageShellProps {
  title: string;
  description?: string;
  children?: ReactNode;
}

export default function ConsolePageShell({ title, description, children }: ConsolePageShellProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      <div className="px-1">
        <h1 className="text-xl font-bold font-display text-text-primary">{title}</h1>
        {description && <p className="text-sm text-text-muted mt-1">{description}</p>}
      </div>
      {children}
    </motion.div>
  );
}
