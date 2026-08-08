'use client';

import { Icon } from '@/components/ui/icon';
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
        'group relative cursor-pointer rounded-2xl border transition-all duration-200',
        'bg-surface hover:bg-surface-elevated',
        isDone
          ? 'border-l-primary/60 border-l-2 border-y-border-default border-r-border-default'
          : 'border-l-2 border-border-default border-l-transparent hover:border-border-strong'
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
          className="focus-ring mt-0.5 shrink-0 rounded-full"
          aria-label={isDone ? '标记为未完成' : '标记为完成'}
        >
          {isDone ? (
            <Icon name="CheckCircle2" size="lg" className="text-primary" />
          ) : (
            <Icon
              name="Circle"
              size="lg"
              className="text-text-muted transition-colors group-hover:text-primary"
            />
          )}
        </button>

        <div className="min-w-0 flex-1">
          <div className="mb-1.5 flex flex-wrap items-center gap-2">
            <div
              className={cn(
                'flex items-center justify-center rounded-lg border',
                getCategoryColorClass(task.category),
                compact ? 'h-7 w-7' : 'h-8 w-8'
              )}
            >
              <CategoryIcon className="size-4" />
            </div>
            <span
              className={cn('text-xs font-medium text-text-tertiary', isDone && 'text-text-muted')}
            >
              {TASK_CATEGORY_LABELS[task.category]}
            </span>

            <span className="ml-auto flex items-center gap-1 rounded-full border border-border-subtle bg-surface-elevated px-2 py-0.5 text-2xs text-text-tertiary">
              <Icon name="Clock" size="sm" />
              <span className="tabular-nums">{task.duration}</span>
            </span>
          </div>

          <p
            className={cn(
              'text-sm font-semibold leading-snug',
              isDone ? 'text-text-muted line-through' : 'text-text-primary'
            )}
          >
            {task.focus}
          </p>

          {task.materials.length > 0 && !compact && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {task.materials.map((m) => (
                <span
                  key={m}
                  className="rounded-md bg-surface-elevated px-2 py-0.5 text-2xs text-text-tertiary"
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
              className="focus:border-primary/40 focus:ring-primary/20 mt-3 w-full resize-none rounded-lg border border-border-default bg-surface-highlight px-3 py-2 text-xs text-text-secondary placeholder:text-text-muted focus:outline-none focus:ring-1"
              rows={2}
            />
          )}
        </div>
      </div>
    </div>
  );
}
