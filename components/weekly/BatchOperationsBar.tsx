'use client';

import { motion } from 'framer-motion';
import { Icon } from '@/components/ui/icon';
import Button from '@/components/ui/button';
import Select from '@/components/ui/select';
import { type TaskCategory } from '@/lib/storage.types';
import { TASK_CATEGORY_LABELS } from '@/lib/taskTemplates';
import { allCategories } from './weeklyConstants';

interface BatchOperationsBarProps {
  selectedCount: number;
  totalCount: number;
  onSelectAll: () => void;
  onClear: () => void;
  onDelete: () => void;
  onChangeCategory: (category: TaskCategory) => void;
  onMove: () => void;
  onExit: () => void;
}

export function BatchOperationsBar({
  selectedCount,
  totalCount,
  onSelectAll,
  onClear,
  onDelete,
  onChangeCategory,
  onMove,
  onExit,
}: BatchOperationsBarProps) {
  const allSelected = totalCount > 0 && selectedCount === totalCount;
  const categoryOptions = [
    { value: '', label: '改分类', disabled: true },
    ...allCategories.map((c) => ({ value: c, label: TASK_CATEGORY_LABELS[c] })),
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-wrap items-center gap-2 rounded-xl border border-primary/20 bg-primary/[0.06] p-3"
    >
      <span className="text-sm font-semibold text-text-primary">已选 {selectedCount} 项</span>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={allSelected ? onClear : onSelectAll}
        leftIcon={<Icon name={allSelected ? 'Square' : 'CheckSquare'} size="xs" />}
      >
        {allSelected ? '取消全选' : '全选'}
      </Button>

      <div className="hidden h-6 w-px bg-border-subtle sm:block" />

      <Select
        size="sm"
        className="w-auto min-w-[110px] bg-surface"
        containerClassName="w-auto"
        value=""
        onChange={(e) => {
          const value = e.target.value as TaskCategory;
          if (value) onChangeCategory(value);
        }}
        options={categoryOptions}
      />

      <Button
        type="button"
        variant="secondary"
        size="sm"
        onClick={onMove}
        disabled={selectedCount === 0}
        leftIcon={<Icon name="MoveRight" size="xs" />}
      >
        移到其他周
      </Button>

      <Button
        type="button"
        variant="danger"
        size="sm"
        onClick={onDelete}
        disabled={selectedCount === 0}
        leftIcon={<Icon name="Trash2" size="xs" />}
      >
        删除
      </Button>

      <div className="flex-1" />

      <Button type="button" variant="ghost" size="sm" onClick={onExit}>
        退出
      </Button>
    </motion.div>
  );
}
