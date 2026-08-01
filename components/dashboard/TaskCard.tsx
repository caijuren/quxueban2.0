'use client';

import { CheckCircle2, Circle, Clock } from 'lucide-react';
import { WeeklyTaskItem } from '@/lib/storage.types';
import { TASK_CATEGORY_LABELS } from '@/lib/taskTemplates';
import { getCategoryColorClass } from '@/lib/taskAlignment';
import { categoryIcons } from '@/lib/taskIcons';
import { cn } from '@/lib/utils';

interface TaskCardProps {
  task: WeeklyTaskItem;
  onToggle: () => void;
  onNoteBlur?: (note: string) => void;
  showNote?: boolean;
  isDraft?: boolean;
  compact?: boolean;
}

export default function TaskCard({
  task,
  onToggle,
  onNoteBlur,
  showNote = false,
  isDraft = false,
  compact = false,
}: TaskCardProps) {
  const isDone = task.status === 'done';
  const CategoryIcon = categoryIcons[task.category];

  return (
    <div
      onClick={onToggle}
      className={cn(
        'group relative rounded-2xl border transition-all duration-200 cursor-pointer',
        'bg-surface hover:bg-surface-elevated',
        isDone
          ? 'border-l-2 border-l-primary/60 border-y-border-default border-r-border-default'
          : 'border-l-2 border-l-transparent border-border-default hover:border-border-strong'
      )}
      role="button"
      tabIndex={0}
      aria-label={isDone ? '标记为未完成' : '标记为完成'}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onToggle();
        }
      }}
    >
      <div className={cn('flex items-start gap-3', compact ? 'p-3' : 'p-4')}>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
          className="shrink-0 mt-0.5 rounded-full focus-ring"
          aria-label={isDone ? '标记为未完成' : '标记为完成'}
        >
          {isDone ? (
            <CheckCircle2 className="w-6 h-6 text-primary" />
          ) : (
            <Circle className="w-6 h-6 text-text-muted group-hover:text-primary transition-colors" />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <div
              className={cn(
                'flex items-center justify-center rounded-lg border',
                getCategoryColorClass(task.category),
                compact ? 'w-7 h-7' : 'w-8 h-8'
              )}
            >
              <CategoryIcon className={compact ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
            </div>
            <span
              className={cn(
                'text-xs font-medium text-text-tertiary',
                isDone && 'text-text-muted'
              )}
            >
              {TASK_CATEGORY_LABELS[task.category]}
            </span>

            <span className="ml-auto text-2xs px-2 py-0.5 rounded-full bg-surface-elevated text-text-tertiary border border-border-subtle flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span className="tabular-nums">{task.duration}</span>
            </span>
          </div>

          <p
            className={cn(
              'font-semibold text-sm leading-snug',
              isDone ? 'text-text-muted line-through' : 'text-text-primary'
            )}
          >
            {task.focus}
          </p>

          {task.materials.length > 0 && !compact && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {task.materials.map((m) => (
                <span
                  key={m}
                  className="text-2xs px-2 py-0.5 rounded-md bg-surface-elevated text-text-tertiary"
                >
                  {m}
                </span>
              ))}
            </div>
          )}

          {showNote && !isDraft && onNoteBlur && (
            <textarea
              defaultValue={task.note ?? ''}
              onBlur={(e) => onNoteBlur(e.target.value)}
              placeholder="完成备注（正确率、感受等）"
              onClick={(e) => e.stopPropagation()}
              className="w-full mt-3 text-xs bg-surface-highlight border border-border-default rounded-xl px-3 py-2 text-text-secondary placeholder:text-text-muted focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20 resize-none"
              rows={2}
            />
          )}
        </div>
      </div>
    </div>
  );
}
