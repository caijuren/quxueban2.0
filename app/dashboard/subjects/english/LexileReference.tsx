'use client';

import { motion } from 'framer-motion';
import { BookOpen, BarChart3, Award } from 'lucide-react';
import { lexileReference } from '@/lib/subjects/english';

export default function LexileReference() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.35 }}
      className="rounded-2xl border border-border-subtle bg-surface-elevated p-6"
    >
      <div className="mb-6 flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-success to-accent">
          <BarChart3 className="size-5 text-text-primary" />
        </div>
        <div>
          <h2 className="font-display text-xl font-bold">RAZ / 蓝思 / 证书对应参考</h2>
          <p className="text-sm text-text-tertiary">各 RAZ 级别对应的蓝思值和证书水平</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border-default">
              <th className="p-3 text-left text-xs font-medium text-text-muted">RAZ 级别</th>
              <th className="p-3 text-left text-xs font-medium text-text-muted">蓝思值</th>
              <th className="p-3 text-left text-xs font-medium text-text-muted">对应证书</th>
              <th className="p-3 text-left text-xs font-medium text-text-muted">阶段说明</th>
            </tr>
          </thead>
          <tbody>
            {lexileReference.map((row, index) => (
              <motion.tr
                key={row.razLevel}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.05 }}
                className="border-b border-border-subtle transition-colors last:border-0 hover:bg-surface-elevated"
              >
                <td className="p-3">
                  <span className="bg-success/10 border-success/20 rounded-md border px-2 py-1 text-xs text-success">
                    {row.razLevel}
                  </span>
                </td>
                <td className="p-3 text-sm text-text-secondary">{row.lexileRange}</td>
                <td className="p-3 text-sm text-text-secondary">{row.equivalent}</td>
                <td className="p-3 text-sm text-text-tertiary">{row.description}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-start gap-3 border-t border-border-subtle pt-4">
        <BookOpen className="mt-0.5 size-4 shrink-0 text-success" />
        <p className="text-xs text-text-muted">
          RAZ 到 K/L 后，阅读能力已足够支撑小托福 850+。后续重点是学术听力、语法和考试题型适应。
        </p>
      </div>
    </motion.div>
  );
}
