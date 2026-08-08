'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Library } from 'lucide-react';
import TaskLibrarySection from '@/components/settings/TaskLibrarySection';

export default function TaskLibraryPage() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="space-y-8">
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="bg-secondary/10 border-secondary/20 flex size-10 items-center justify-center rounded-xl border">
            <Library className="size-5 text-secondary" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold sm:text-3xl">任务库</h1>
          </div>
        </div>
      </motion.div>
      <TaskLibrarySection />
    </div>
  );
}
