'use client';

import { useState, useRef } from 'react';
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';
import {
  CalendarCheck,
  Clock,
  CheckCircle2,
  Circle,
  AlertCircle,
  Flag,
  Plus,
  Trash2,
  X,
  Image as ImageIcon,
} from 'lucide-react';
import { useChildren } from '@/components/dashboard/ChildrenContext';
import { gradeLabel } from '@/lib/children';
import ChildEmptyState from '@/components/dashboard/ChildEmptyState';
import {
  useMilestones,
  useUpdateMilestone,
  useDeleteMilestone,
  useCreateMilestone,
  type Milestone,
} from '@/lib/hooks/useMilestones';

const statusConfig: Record<
  string,
  { icon: typeof CheckCircle2; color: string; bg: string; label: string; next: string }
> = {
  completed: {
    icon: CheckCircle2,
    color: 'text-success',
    bg: 'bg-success/10',
    label: '已完成',
    next: 'pending',
  },
  in_progress: {
    icon: Clock,
    color: 'text-warning',
    bg: 'bg-warning/10',
    label: '进行中',
    next: 'completed',
  },
  pending: {
    icon: Circle,
    color: 'text-text-tertiary',
    bg: 'bg-surface-hover',
    label: '待开始',
    next: 'in_progress',
  },
};

function groupByGrade(milestones: Milestone[]) {
  const map = new Map<number, Milestone[]>();
  for (const m of milestones) {
    const grade = m.targetGrade ?? 0;
    if (!map.has(grade)) map.set(grade, []);
    map.get(grade)!.push(m);
  }
  return Array.from(map.entries()).sort(([a], [b]) => a - b);
}

export default function MilestonesPage() {
  const { currentChild } = useChildren();
  const shouldReduceMotion = useReducedMotion();
  const { data: milestones = [], isLoading } = useMilestones(currentChild?.id);
  const updateMilestone = useUpdateMilestone();
  const deleteMilestone = useDeleteMilestone();
  const createMilestone = useCreateMilestone(currentChild?.id);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingFor, setUploadingFor] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newGrade, setNewGrade] = useState(currentChild?.grade ?? 1);

  const handleStatusToggle = (milestone: Milestone) => {
    const next = (statusConfig[milestone.status]?.next ?? 'in_progress') as
      'pending' | 'in_progress' | 'completed';
    updateMilestone.mutate({ id: milestone.id, data: { status: next } });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, milestoneId: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingFor(milestoneId);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'certificates');
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || '上传失败');

      const milestone = milestones.find((m) => m.id === milestoneId);
      const urls = [...(milestone?.certificateUrls || []), data.url];
      updateMilestone.mutate({ id: milestoneId, data: { certificateUrls: urls } });
    } catch (err) {
      alert(err instanceof Error ? err.message : '上传失败');
    } finally {
      setUploadingFor(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = (milestoneId: string, url: string) => {
    const milestone = milestones.find((m) => m.id === milestoneId);
    const urls = milestone?.certificateUrls.filter((u) => u !== url) || [];
    updateMilestone.mutate({ id: milestoneId, data: { certificateUrls: urls } });
  };

  const handleAdd = async () => {
    if (!newTitle.trim()) return;
    await createMilestone.mutateAsync({
      title: newTitle.trim(),
      targetGrade: newGrade,
      status: 'pending',
    });
    setNewTitle('');
    setShowAdd(false);
  };

  const grouped = groupByGrade(milestones);
  const currentGrade = currentChild?.grade ?? 0;

  return (
    <div className="space-y-8">
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 border-primary/20 flex size-10 items-center justify-center rounded-lg border">
            <Flag className="size-5 text-primary" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold sm:text-3xl">
              {currentChild ? `${currentChild.name}的里程碑任务` : '里程碑任务'}
            </h1>
          </div>
        </div>
        {currentChild && (
          <button
            onClick={() => setShowAdd(true)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-medium text-text-primary transition-all hover:opacity-90"
          >
            <Plus className="size-3.5" />
            添加里程碑
          </button>
        )}
      </motion.div>

      {!currentChild && (
        <ChildEmptyState description="添加孩子后，系统会根据年级展示对应的里程碑任务" />
      )}

      {isLoading && currentChild && (
        <div className="flex items-center justify-center py-12 text-text-muted">
          <Clock className="mr-2 size-5 animate-spin" />
          加载中...
        </div>
      )}

      <AnimatePresence>
        {showAdd && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="space-y-4 rounded-2xl border border-border-default bg-surface-elevated p-5"
          >
            <h3 className="font-bold text-text-primary">添加自定义里程碑</h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="里程碑名称"
                className="w-full rounded-lg border border-border-default bg-surface-elevated px-3 py-2 text-sm text-text-secondary placeholder:text-text-muted focus:border-primary focus:outline-none sm:col-span-2"
              />
              <input
                type="number"
                value={newGrade}
                onChange={(e) => setNewGrade(parseInt(e.target.value) || 1)}
                placeholder="年级"
                min={1}
                max={12}
                className="w-full rounded-lg border border-border-default bg-surface-elevated px-3 py-2 text-sm text-text-secondary placeholder:text-text-muted focus:border-primary focus:outline-none"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowAdd(false)}
                className="rounded-lg px-3 py-1.5 text-xs text-text-tertiary hover:bg-surface-hover"
              >
                取消
              </button>
              <button
                onClick={handleAdd}
                disabled={!newTitle.trim() || createMilestone.isPending}
                className="rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-text-primary hover:opacity-90 disabled:opacity-50"
              >
                {createMilestone.isPending ? '保存中...' : '保存'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-6">
        {currentChild &&
          grouped.map(([grade, items], index) => (
            <motion.div
              key={grade}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="rounded-2xl bg-surface-elevated p-6"
            >
              <div className="mb-6 flex items-center gap-4">
                <div className="flex size-12 items-center justify-center rounded-lg bg-gradient-to-br from-secondary to-secondary-glow">
                  <CalendarCheck className="size-6 text-text-primary" />
                </div>
                <div>
                  <h2 className="font-display text-xl font-bold">
                    {gradeLabel(grade, currentChild.educationSystem)}
                  </h2>
                  <p className="text-sm text-text-tertiary">
                    {items.filter((i) => i.status === 'completed').length}/{items.length} 已完成
                  </p>
                </div>
                {grade === currentGrade && (
                  <span className="bg-primary/10 border-primary/30 ml-auto rounded-full border px-3 py-1 text-xs font-medium text-primary">
                    当前阶段
                  </span>
                )}
              </div>

              <div className="space-y-3">
                {items.map((milestone) => {
                  const config = statusConfig[milestone.status] || statusConfig.pending;
                  const m = milestones.find((x) => x.id === milestone.id)!;
                  return (
                    <div
                      key={milestone.id}
                      className="flex flex-col gap-3 rounded-lg bg-surface-hover p-4 transition-all hover:bg-surface-hover"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <button
                            onClick={() => handleStatusToggle(milestone)}
                            className={`size-10 rounded-lg ${config.bg} flex items-center justify-center transition-opacity hover:opacity-80`}
                            title={`标记为${statusConfig[config.next]?.label ?? ''}`}
                          >
                            <config.icon className={`size-5 ${config.color}`} />
                          </button>
                          <div>
                            <span className="font-medium text-text-secondary">
                              {milestone.title}
                            </span>
                            {milestone.description && (
                              <p className="mt-0.5 text-xs text-text-muted">
                                {milestone.description}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-medium ${config.color}`}>
                            {config.label}
                          </span>
                          <button
                            onClick={() => deleteMilestone.mutate(milestone.id)}
                            className="hover:bg-error/10 rounded-lg p-1.5 text-text-tertiary transition-colors hover:text-error"
                            title="删除"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-3 pl-14">
                        {m.certificateUrls.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {m.certificateUrls.map((url) => (
                              <div
                                key={url}
                                className="group relative size-20 overflow-hidden rounded-lg border border-border-subtle"
                              >
                                <img src={url} alt="证书" className="size-full object-cover" />
                                <button
                                  onClick={() => handleRemoveImage(milestone.id, url)}
                                  className="absolute right-0.5 top-0.5 rounded bg-black/60 p-0.5 text-white opacity-0 transition-opacity group-hover:opacity-100"
                                >
                                  <X className="size-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}

                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploadingFor === milestone.id}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-surface-elevated px-3 py-1.5 text-xs text-text-secondary transition-colors hover:bg-surface-highlight disabled:opacity-50"
                          >
                            {uploadingFor === milestone.id ? (
                              <Clock className="size-3.5 animate-spin" />
                            ) : (
                              <ImageIcon className="size-3.5" />
                            )}
                            {uploadingFor === milestone.id ? '上传中...' : '上传证书/截图'}
                          </button>
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleFileChange(e, milestone.id)}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ))}
      </div>

      {currentChild && milestones.length === 0 && !isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="border-warning/20 bg-warning/5 rounded-2xl border p-6"
        >
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 size-5 shrink-0 text-warning" />
            <div>
              <h3 className="mb-1 font-semibold text-warning">暂无里程碑</h3>
              <p className="text-sm text-text-tertiary">
                系统会根据孩子的年级和路线自动生成里程碑，你也可以点击右上角手动添加。
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
