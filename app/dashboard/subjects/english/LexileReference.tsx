'use client';

import { motion } from 'framer-motion';
import { Icon } from '@/components/ui/icon';
import { lexileReference } from '@/lib/subjects/english';
import DataTable from '@/components/ui/data-table';

export default function LexileReference() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.35 }}
      className="rounded-xl border border-border-subtle bg-surface-elevated p-6"
    >
      <div className="mb-6 flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-success to-accent">
          <Icon name="BarChart3" size="md" className="text-text-primary" />
        </div>
        <div>
          <h2 className="font-display text-xl font-bold">RAZ / 蓝思 / 证书对应参考</h2>
          <p className="text-sm text-text-tertiary">各 RAZ 级别对应的蓝思值和证书水平</p>
        </div>
      </div>

      <DataTable
        columns={[
          {
            key: 'razLevel',
            title: 'RAZ 级别',
            render: (row) => (
              <span className="bg-success/10 border-success/20 rounded-md border px-2 py-1 text-xs text-success">
                {row.razLevel}
              </span>
            ),
          },
          { key: 'lexileRange', title: '蓝思值' },
          { key: 'equivalent', title: '对应证书' },
          { key: 'description', title: '阶段说明' },
        ]}
        data={lexileReference}
        emptyText="暂无数据"
      />

      <div className="mt-4 flex items-start gap-3 border-t border-border-subtle pt-4">
        <Icon name="BookOpen" size="sm" className="mt-0.5 shrink-0 text-success" />
        <p className="text-xs text-text-muted">
          RAZ 到 K/L 后，阅读能力已足够支撑小托福 850+。后续重点是学术听力、语法和考试题型适应。
        </p>
      </div>
    </motion.div>
  );
}
