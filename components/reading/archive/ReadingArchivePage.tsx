'use client';

import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Icon, type IconName } from '@/components/ui/icon';
import { useChildren } from '@/components/dashboard/ChildrenContext';
import EmptyState from '@/components/ui/EmptyState';
import BookshelfSection from '@/components/reading/archive/BookshelfSection';
import ReadingRecordsSection from '@/components/reading/archive/ReadingRecordsSection';
import ImportSection from '@/components/reading/archive/ImportSection';
import { cn } from '@/lib/utils';

const TABS: Array<{ id: string; label: string; icon: IconName }> = [
  { id: 'bookshelf', label: '书房', icon: 'Library' },
  { id: 'records', label: '阅读记录', icon: 'BookOpen' },
  { id: 'import', label: '批量导入', icon: 'Upload' },
];

export default function ReadingArchivePage() {
  const shouldReduceMotion = useReducedMotion();
  const { currentChild } = useChildren();
  const [tab, setTab] = useState('bookshelf');

  return (
    <div className="min-h-[calc(100vh-8rem)] space-y-6">
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="bg-accent/10 border-accent/20 flex size-10 items-center justify-center rounded-xl border">
            <Icon name="Library" size="md" className="text-accent" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-text-primary sm:text-3xl">
              阅读档案
            </h1>
            <p className="mt-0.5 text-sm text-text-muted">
              个人书房、已读书目与阅读记录，支持小花生等数据批量导入
            </p>
          </div>
        </div>
      </motion.div>

      {!currentChild ? (
        <EmptyState
          icon="Library"
          title="请先选择孩子"
          description="阅读档案按孩子独立管理，请先在顶部选择孩子"
        />
      ) : (
        <>
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="flex items-center gap-1 rounded-xl border border-border-default bg-surface p-1"
          >
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={cn(
                  'flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  tab === t.id
                    ? 'bg-primary/10 text-primary'
                    : 'text-text-muted hover:text-text-secondary'
                )}
              >
                <Icon name={t.icon} size="sm" />
                {t.label}
              </button>
            ))}
          </motion.div>

          <motion.div
            key={tab}
            initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {tab === 'bookshelf' && <BookshelfSection childId={currentChild.id} />}
            {tab === 'records' && <ReadingRecordsSection childId={currentChild.id} />}
            {tab === 'import' && <ImportSection childId={currentChild.id} />}
          </motion.div>
        </>
      )}
    </div>
  );
}
