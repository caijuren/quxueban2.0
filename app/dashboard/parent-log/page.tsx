'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  BookHeart,
  Calendar,
  Loader2,
  Save,
  Trash2,
  Edit2,
  X,
  Tag,
  Image as ImageIcon,
} from 'lucide-react';
import { useChildren } from '@/components/dashboard/ChildrenContext';
import EmptyState from '@/components/ui/EmptyState';
import ConsolePageShell from '@/components/console/core/ConsolePageShell';
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

export default function ParentLogPage() {
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-card bg-surface-elevated border border-border-default p-4 space-y-3 h-fit"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold font-display text-text-primary">
              {editingId ? '编辑记录' : '写一条观察'}
            </h2>
            {editingId && (
              <button
                onClick={resetForm}
                className="flex items-center gap-1 text-xs text-text-muted hover:text-text-secondary"
              >
                <X className="w-3.5 h-3.5" />
                取消
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-xs text-text-muted mb-1">日期</label>
              <div className="flex items-center gap-2 rounded-lg bg-surface border border-border-default px-3 py-2">
                <Calendar className="w-4 h-4 text-text-muted" />
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
              <label className="block text-xs text-text-muted mb-1">观察内容</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="记录今天的学习状态、情绪变化、进步或需要关注的地方…"
                rows={5}
                required
                className="w-full rounded-lg bg-surface border border-border-default px-3 py-2 text-sm text-text-secondary placeholder:text-text-muted focus:outline-none focus:border-primary/50 resize-none"
              />
            </div>

            <div>
              <label className="block text-xs text-text-muted mb-1">
                <Tag className="w-3 h-3 inline mr-1" />
                标签（用空格或逗号分隔）
              </label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="例如：数学 情绪 阅读习惯"
                className="w-full rounded-lg bg-surface border border-border-default px-3 py-2 text-sm text-text-secondary placeholder:text-text-muted focus:outline-none focus:border-primary/50"
              />
            </div>

            <div>
              <label className="block text-xs text-text-muted mb-1">
                <ImageIcon className="w-3 h-3 inline mr-1" />
                图片链接（每行一个）
              </label>
              <textarea
                value={imageUrls}
                onChange={(e) => setImageUrls(e.target.value)}
                placeholder="https://example.com/photo1.jpg"
                rows={2}
                className="w-full rounded-lg bg-surface border border-border-default px-3 py-2 text-sm text-text-secondary placeholder:text-text-muted focus:outline-none focus:border-primary/50 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={
                createLog.isPending || updateLog.isPending || !content.trim()
              }
              className="w-full flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-text-primary text-sm font-medium hover:opacity-90 transition-all disabled:opacity-60"
            >
              {createLog.isPending || updateLog.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {editingId ? '保存修改' : '保存记录'}
            </button>
          </form>
        </motion.div>

        {/* List */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-card bg-surface-elevated border border-border-default p-4 min-h-[24rem]"
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold font-display text-text-primary">历史记录</h2>
            <div className="flex items-center gap-1 rounded-lg bg-surface border border-border-default p-0.5">
              <button
                onClick={() => setView('daily')}
                className={`px-2.5 py-1 rounded-md text-xs transition-colors ${
                  view === 'daily'
                    ? 'bg-primary/10 text-primary'
                    : 'text-text-muted hover:text-text-secondary'
                }`}
              >
                按日期
              </button>
              <button
                onClick={() => setView('weekly')}
                className={`px-2.5 py-1 rounded-md text-xs transition-colors ${
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
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : logs.length === 0 ? (
            <EmptyState
              icon={BookHeart}
              title="还没有家长日志"
              description="在左侧写下第一条观察记录，开始追踪孩子的成长"
            />
          ) : view === 'daily' ? (
            <div className="space-y-2 max-h-[32rem] overflow-y-auto pr-1">
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
            <div className="space-y-4 max-h-[32rem] overflow-y-auto pr-1">
              {Object.entries(groupedByWeek)
                .sort(([a], [b]) => b.localeCompare(a))
                .map(([weekStart, weekLogs]) => (
                  <div key={weekStart}>
                    <p className="text-xs font-medium text-text-muted mb-2 sticky top-0 bg-surface-elevated py-1">
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
        </motion.div>
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
    <div className="rounded-lg bg-surface border border-border-default p-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-2xs text-text-muted mb-1">{log.date}</p>
          <p className="text-sm text-text-secondary whitespace-pre-wrap leading-relaxed">
            {log.content}
          </p>
          {log.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {log.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-1.5 py-0.5 rounded-md bg-secondary/10 text-secondary text-[10px]"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          {log.imageUrls.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {log.imageUrls.map((url, idx) => (
                <a
                  key={idx}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] text-primary hover:underline truncate max-w-[12rem]"
                >
                  图片 {idx + 1}
                </a>
              ))}
            </div>
          )}
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={onEdit}
            className="w-7 h-7 rounded-md bg-surface-hover flex items-center justify-center text-text-muted hover:text-primary transition-colors"
            title="编辑"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onDelete}
            className="w-7 h-7 rounded-md bg-surface-hover flex items-center justify-center text-text-muted hover:text-error transition-colors"
            title="删除"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
