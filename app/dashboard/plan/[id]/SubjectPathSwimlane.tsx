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
      className="rounded-2xl glass p-6 border border-border-subtle"
    >
      <h2 className="text-xl font-bold font-display mb-6 flex items-center gap-2">
        <Route className="w-5 h-5 text-secondary" />
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
              className="rounded-xl bg-surface-elevated border border-border-subtle overflow-hidden"
            >
              {/* Lane header */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-border-subtle bg-surface-elevated">
                <div
                  className={`w-10 h-10 rounded-lg bg-gradient-to-br ${path.color} flex items-center justify-center shrink-0`}
                >
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-text-secondary">{path.name}</h3>
                  <p className="text-xs text-text-muted">起始时间：{path.startTime}</p>
                </div>
              </div>

              {/* Lane phases */}
              <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {path.phases.map((phase, phaseIndex) => (
                  <motion.div
                    key={phase.title}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 + pathIndex * 0.1 + phaseIndex * 0.05 }}
                    className="rounded-lg bg-surface-elevated border border-border-subtle p-3 hover:border-primary/30 hover:bg-surface-highlight transition-all group"
                  >
                    <p className="text-xs text-primary font-medium mb-1.5">{phase.time}</p>
                    <h4 className="font-bold text-text-secondary text-sm mb-1.5">{phase.title}</h4>
                    <p className="text-xs text-text-tertiary leading-relaxed mb-2.5">{phase.content}</p>
                    <div className="flex items-start gap-1.5 pt-2 border-t border-border-subtle">
                      <Target className="w-3 h-3 text-warning shrink-0 mt-0.5" />
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
