'use client';

import { CheckCircle2, Circle, Clock } from 'lucide-react';
import { WeeklyTaskItem } from '@/lib/storage.types';
import { TASK_CATEGORY_LABELS, TASK_ALIGNMENT_LABELS } from '@/lib/taskTemplates';
import {
  getCategoryColorClass,
  getAlignmentColorClass,
} from '@/lib/taskAlignment';
import { categoryIcons } from '@/lib/taskIcons';

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
      className={`group relative rounded-2xl border transition-all duration-200 overflow-hidden cursor-pointer hud-panel${
        !isDone ? ' hud-panel-hover' : ''
      } ${isDone ? 'border-l-2 border-l-primary/70' : 'border-l-2 border-l-transparent'} ${
        isDone ? 'bg-surface/60' : ''
      }`}
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
      <div className={`flex items-start gap-3 ${compact ? 'p-3' : 'p-4'}`}>
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
            <CheckCircle2 className="w-6 h-6 text-primary drop-shadow-[0_0_8px_var(--shadow-primary)]" />
          ) : (
            <Circle className="w-6 h-6 text-text-muted group-hover:text-primary-glow transition-colors" />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <div
              className={`flex items-center justify-center rounded-lg border ${getCategoryColorClass(
                task.category
              )} ${compact ? 'w-7 h-7' : 'w-8 h-8'}`}
            >
              <CategoryIcon className={`${compact ? 'w-3.5 h-3.5' : 'w-4 h-4'}`} />
            </div>
            <span className={`text-caption font-semibold text-text-secondary ${isDone ? 'text-text-muted' : ''}`}>
              {TASK_CATEGORY_LABELS[task.category]}
            </span>

            {task.alignment && !compact && (
              <span
                className={`text-micro px-2 py-0.5 rounded-md border ${getAlignmentColorClass(
                  task.alignment
                )}`}
              >
                {TASK_ALIGNMENT_LABELS[task.alignment]}
              </span>
            )}

            <span className="ml-auto text-micro px-2.5 py-1 rounded-full bg-surface-elevated text-text-tertiary border border-border-default flex items-center gap-1.5">
              <Clock className="w-3 h-3" />
              <span className="data-value">{task.duration}</span>
            </span>
          </div>

          <p
            className={`font-bold mb-1 text-body ${
              isDone
                ? 'text-text-muted line-through'
                : 'text-text-primary'
            }`}
          >
            {task.focus}
          </p>

          {task.materials.length > 0 && !compact && (
            <div className="flex flex-wrap gap-2 mb-2">
              {task.materials.map((m) => (
                <span
                  key={m}
                  className="text-micro px-2.5 py-1 rounded-full bg-surface-light text-text-tertiary border border-border-subtle"
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
              className="w-full text-caption bg-surface-light border border-border-default rounded-xl px-3 py-2 text-text-secondary placeholder:text-text-muted focus:outline-none focus:border-primary/50 focus:shadow-glow-accent resize-none mt-2"
              rows={2}
            />
          )}
        </div>
      </div>
    </div>
  );
}
