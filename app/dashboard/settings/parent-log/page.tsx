'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@/components/ui/icon';
import { useChildren } from '@/components/dashboard/ChildrenContext';
import EmptyState from '@/components/ui/EmptyState';
import ConsolePageShell from '@/components/console/core/ConsolePageShell';
import SettingsSection from '@/components/settings/SettingsSection';
import {
  useParentLogs,
  useCreateParentLog,
  useUpdateParentLog,
  useDeleteParentLog,
} from '@/lib/hooks/useParentLogs';

function getTodayStr() {
  return new Date().toISOString().split('T')[0];
}

function getWeekStart(dateStr: string): string {
  const date = new Date(dateStr);
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(date.setDate(diff));
  return monday.toISOString().split('T')[0];
}

export default function ParentLogSettingsPage() {
  const { currentChild } = useChildren();
  const childId = currentChild?.id;
  const { data: logs = [], isLoading } = useParentLogs(childId);
  const createLog = useCreateParentLog();
  const updateLog = useUpdateParentLog();
  const deleteLog = useDeleteParentLog();

  const [date, setDate] = useState(getTodayStr());
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [imageUrls, setImageUrls] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [view, setView] = useState<'daily' | 'weekly'>('daily');

  const handleEdit = (log: (typeof logs)[0]) => {
    setEditingId(log.id);
    setDate(log.date);
    setContent(log.content);
    setTags(log.tags.join(' '));
    setImageUrls(log.imageUrls.join('\n'));
  };

  const resetForm = () => {
    setEditingId(null);
    setDate(getTodayStr());
    setContent('');
    setTags('');
    setImageUrls('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!childId || !content.trim()) return;

    const payload = {
      date,
      content: content.trim(),
      imageUrls: imageUrls
        .split('\n')
        .map((url) => url.trim())
        .filter(Boolean),
      tags: tags
        .split(/[\s,，]+/)
        .map((tag) => tag.trim())
        .filter(Boolean),
    };

    if (editingId) {
      await updateLog.mutateAsync({ childId, logId: editingId, data: payload });
    } else {
      await createLog.mutateAsync({ childId, data: payload });
    }
    resetForm();
  };

  const handleDelete = async (logId: string) => {
    if (!childId) return;
    if (!confirm('确定删除这条记录吗？')) return;
    await deleteLog.mutateAsync({ childId, logId });
    if (editingId === logId) resetForm();
  };

  const groupedByWeek = useMemo(() => {
    const groups: Record<string, typeof logs> = {};
    for (const log of logs) {
      const weekStart = getWeekStart(log.date);
      if (!groups[weekStart]) groups[weekStart] = [];
      groups[weekStart].push(log);
    }
    return groups;
  }, [logs]);

  return (
    <ConsolePageShell title="家长日志" description="记录每日/每周观察与成长点滴">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <SettingsSection
          title={editingId ? '编辑记录' : '写一条观察'}
          description="记录今天的学习状态、情绪变化、进步或需要关注的地方"
        >
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="mb-1 block text-xs text-text-muted">日期</label>
              <div className="flex items-center gap-2 rounded-lg border border-border-default bg-surface px-3 py-2">
                <Icon name="Calendar" size="sm" className="text-text-muted" />
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  className="flex-1 bg-transparent text-sm text-text-secondary focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs text-text-muted">观察内容</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="记录今天的学习状态、情绪变化、进步或需要关注的地方…"
                rows={5}
                required
                className="focus:border-primary/50 w-full resize-none rounded-lg border border-border-default bg-surface px-3 py-2 text-sm text-text-secondary placeholder:text-text-muted focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs text-text-muted">
                <Icon name="Tag" size="xs" className="mr-1 inline" />
                标签（用空格或逗号分隔）
              </label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="例如：数学 情绪 阅读习惯"
                className="focus:border-primary/50 w-full rounded-lg border border-border-default bg-surface px-3 py-2 text-sm text-text-secondary placeholder:text-text-muted focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs text-text-muted">
                <Icon name="Image" size="xs" className="mr-1 inline" />
                图片链接（每行一个）
              </label>
              <textarea
                value={imageUrls}
                onChange={(e) => setImageUrls(e.target.value)}
                placeholder="https://example.com/photo1.jpg"
                rows={2}
                className="focus:border-primary/50 w-full resize-none rounded-lg border border-border-default bg-surface px-3 py-2 text-sm text-text-secondary placeholder:text-text-muted focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="submit"
                disabled={createLog.isPending || updateLog.isPending || !content.trim()}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-text-primary transition-all hover:opacity-90 disabled:opacity-60"
              >
                {createLog.isPending || updateLog.isPending ? (
                  <Icon name="Loader2" size="sm" animate="spin" />
                ) : (
                  <Icon name="Save" size="sm" />
                )}
                {editingId ? '保存修改' : '保存记录'}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-lg border border-border-default bg-surface px-4 py-2 text-sm text-text-secondary transition-colors hover:bg-surface-highlight"
                >
                  <Icon name="X" size="sm" />
                </button>
              )}
            </div>
          </form>
        </SettingsSection>

        <SettingsSection title="历史记录" description="按日期或按周查看已记录的成长观察">
          <div className="mb-3 flex items-center justify-end">
            <div className="flex items-center gap-1 rounded-lg border border-border-default bg-surface p-0.5">
              <button
                onClick={() => setView('daily')}
                className={`rounded-md px-2.5 py-1 text-xs transition-colors ${
                  view === 'daily'
                    ? 'bg-primary/10 text-primary'
                    : 'text-text-muted hover:text-text-secondary'
                }`}
              >
                按日期
              </button>
              <button
                onClick={() => setView('weekly')}
                className={`rounded-md px-2.5 py-1 text-xs transition-colors ${
                  view === 'weekly'
                    ? 'bg-primary/10 text-primary'
                    : 'text-text-muted hover:text-text-secondary'
                }`}
              >
                按周
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Icon name="Loader2" size="lg" animate="spin" className="text-primary" />
            </div>
          ) : logs.length === 0 ? (
            <EmptyState
              icon="BookHeart"
              title="还没有家长日志"
              description="在左侧写下第一条观察记录，开始追踪孩子的成长"
            />
          ) : view === 'daily' ? (
            <div className="max-h-[32rem] space-y-2 overflow-y-auto pr-1">
              {logs.map((log) => (
                <LogCard
                  key={log.id}
                  log={log}
                  onEdit={() => handleEdit(log)}
                  onDelete={() => handleDelete(log.id)}
                />
              ))}
            </div>
          ) : (
            <div className="max-h-[32rem] space-y-4 overflow-y-auto pr-1">
              {Object.entries(groupedByWeek)
                .sort(([a], [b]) => b.localeCompare(a))
                .map(([weekStart, weekLogs]) => (
                  <div key={weekStart}>
                    <p className="sticky top-0 mb-2 bg-surface-elevated py-1 text-xs font-medium text-text-muted">
                      {weekStart} 所在周
                    </p>
                    <div className="space-y-2">
                      {weekLogs.map((log) => (
                        <LogCard
                          key={log.id}
                          log={log}
                          onEdit={() => handleEdit(log)}
                          onDelete={() => handleDelete(log.id)}
                        />
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </SettingsSection>
      </div>
    </ConsolePageShell>
  );
}

function LogCard({
  log,
  onEdit,
  onDelete,
}: {
  log: {
    id: string;
    date: string;
    content: string;
    tags: string[];
    imageUrls: string[];
  };
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="rounded-lg border border-border-default bg-surface p-3">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="mb-1 text-2xs text-text-muted">{log.date}</p>
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-text-secondary">
            {log.content}
          </p>
          {log.tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {log.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-secondary/10 rounded-md px-1.5 py-0.5 text-[10px] text-secondary"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          {log.imageUrls.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {log.imageUrls.map((url, idx) => (
                <a
                  key={idx}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="max-w-48 truncate text-[10px] text-primary hover:underline"
                >
                  图片 {idx + 1}
                </a>
              ))}
            </div>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <button
            onClick={onEdit}
            className="flex size-7 items-center justify-center rounded-md bg-surface-hover text-text-muted transition-colors hover:text-primary"
            title="编辑"
          >
            <Icon name="Edit2" size="xs" />
          </button>
          <button
            onClick={onDelete}
            className="flex size-7 items-center justify-center rounded-md bg-surface-hover text-text-muted transition-colors hover:text-error"
            title="删除"
          >
            <Icon name="Trash2" size="xs" />
          </button>
        </div>
      </div>
    </div>
  );
}
