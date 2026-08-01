'use client';

import { motion } from 'framer-motion';
import { BookOpen, CheckCircle2 } from 'lucide-react';
import { englishResources, englishCheckpoints } from '@/lib/subjects/english';

export default function ResourceList() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="rounded-2xl glass p-6 border border-border-subtle"
      >
        <h2 className="text-xl font-bold font-display mb-6 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-accent" />
          已有资源清单
        </h2>
        <div className="space-y-3">
          {englishResources.map((resource, index) => (
            <motion.div
              key={resource.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.45 + index * 0.05 }}
              className="flex items-start gap-3 rounded-xl bg-surface-elevated border border-border-subtle p-4"
            >
              <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                <span className="text-xs font-bold text-accent">{index + 1}</span>
              </div>
              <div>
                <p className="font-medium text-text-secondary mb-1">{resource.name}</p>
                <p className="text-sm text-text-tertiary">{resource.usage}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="rounded-2xl glass p-6 border border-border-subtle"
      >
        <h2 className="text-xl font-bold font-display mb-6 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-success" />
          关键检查点
        </h2>
        <div className="space-y-3">
          {englishCheckpoints.map((checkpoint, index) => (
            <motion.div
              key={checkpoint.time}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.55 + index * 0.05 }}
              className="rounded-xl bg-surface-elevated border border-border-subtle p-4"
            >
              <p className="text-xs text-primary font-medium mb-1">{checkpoint.time}</p>
              <p className="text-sm text-text-secondary mb-2">{checkpoint.target}</p>
              <p className="text-xs text-text-muted">
                <span className="text-warning">Fallback：</span>
                {checkpoint.fallback}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
