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
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-secondary/10 border border-secondary/20 flex items-center justify-center">
            <Library className="w-5 h-5 text-secondary" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold font-display">任务库</h1>
          </div>
        </div>
      </motion.div>
      <TaskLibrarySection />
    </div>
  );
}
