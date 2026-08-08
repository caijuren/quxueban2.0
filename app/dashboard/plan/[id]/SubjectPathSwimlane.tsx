'use client';

import { motion } from 'framer-motion';
import { Route, Target } from 'lucide-react';
import type { SubjectPath } from '@/lib/plans';

interface SubjectPathSwimlaneProps {
  paths: SubjectPath[];
}

export default function SubjectPathSwimlane({ paths }: SubjectPathSwimlaneProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.25 }}
      className="rounded-2xl border border-border-subtle bg-surface-elevated p-6"
    >
      <h2 className="mb-6 flex items-center gap-2 font-display text-xl font-bold">
        <Route className="size-5 text-secondary" />
        学科路径泳道图
      </h2>

      <div className="space-y-4">
        {paths.map((path, pathIndex) => {
          const Icon = path.icon;

          return (
            <motion.div
              key={path.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + pathIndex * 0.1 }}
              className="overflow-hidden rounded-xl border border-border-subtle bg-surface-elevated"
            >
              {/* Lane header */}
              <div className="flex items-center gap-3 border-b border-border-subtle bg-surface-elevated px-4 py-3">
                <div
                  className={`size-10 rounded-lg bg-gradient-to-br ${path.color} flex shrink-0 items-center justify-center`}
                >
                  <Icon className="size-5 text-text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-text-secondary">{path.name}</h3>
                  <p className="text-xs text-text-muted">起始时间：{path.startTime}</p>
                </div>
              </div>

              {/* Lane phases */}
              <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 lg:grid-cols-4">
                {path.phases.map((phase, phaseIndex) => (
                  <motion.div
                    key={phase.title}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 + pathIndex * 0.1 + phaseIndex * 0.05 }}
                    className="hover:border-primary/30 group rounded-lg border border-border-subtle bg-surface-elevated p-3 transition-all hover:bg-surface-highlight"
                  >
                    <p className="mb-1.5 text-xs font-medium text-primary">{phase.time}</p>
                    <h4 className="mb-1.5 text-sm font-bold text-text-secondary">{phase.title}</h4>
                    <p className="mb-2.5 text-xs leading-relaxed text-text-tertiary">
                      {phase.content}
                    </p>
                    <div className="flex items-start gap-1.5 border-t border-border-subtle pt-2">
                      <Target className="mt-0.5 size-3 shrink-0 text-warning" />
                      <p className="text-xs text-text-muted">{phase.milestone}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
