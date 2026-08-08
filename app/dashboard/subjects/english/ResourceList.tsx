'use client';

import { motion } from 'framer-motion';
import { Icon } from '@/components/ui/icon';
import { englishResources, englishCheckpoints } from '@/lib/subjects/english';

export default function ResourceList() {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="rounded-2xl border border-border-subtle bg-surface-elevated p-6"
      >
        <h2 className="mb-6 flex items-center gap-2 font-display text-xl font-bold">
          <Icon name="BookOpen" size="md" className="text-accent" />
          已有资源清单
        </h2>
        <div className="space-y-3">
          {englishResources.map((resource, index) => (
            <motion.div
              key={resource.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.45 + index * 0.05 }}
              className="flex items-start gap-3 rounded-xl border border-border-subtle bg-surface-elevated p-4"
            >
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-accent/10">
                <span className="text-xs font-bold text-accent">{index + 1}</span>
              </div>
              <div>
                <p className="mb-1 font-medium text-text-secondary">{resource.name}</p>
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
        className="rounded-2xl border border-border-subtle bg-surface-elevated p-6"
      >
        <h2 className="mb-6 flex items-center gap-2 font-display text-xl font-bold">
          <Icon name="CheckCircle2" size="md" className="text-success" />
          关键检查点
        </h2>
        <div className="space-y-3">
          {englishCheckpoints.map((checkpoint, index) => (
            <motion.div
              key={checkpoint.time}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.55 + index * 0.05 }}
              className="rounded-xl border border-border-subtle bg-surface-elevated p-4"
            >
              <p className="mb-1 text-xs font-medium text-primary">{checkpoint.time}</p>
              <p className="mb-2 text-sm text-text-secondary">{checkpoint.target}</p>
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
