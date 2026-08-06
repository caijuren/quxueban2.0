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

const statusConfig: Record<string, { icon: typeof CheckCircle2; color: string; bg: string; label: string; next: string }> = {
  completed: { icon: CheckCircle2, color: 'text-success', bg: 'bg-success/10', label: '已完成', next: 'pending' },
  in_progress: { icon: Clock, color: 'text-warning', bg: 'bg-warning/10', label: '进行中', next: 'completed' },
  pending: { icon: Circle, color: 'text-text-tertiary', bg: 'bg-surface-hover', label: '待开始', next: 'in_progress' },
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
    const next = (statusConfig[milestone.status]?.next ?? 'in_progress') as 'pending' | 'in_progress' | 'completed';
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
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
            <Flag className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold font-display">
              {currentChild ? `${currentChild.name}的里程碑任务` : '里程碑任务'}
            </h1>
          </div>
        </div>
        {currentChild && (
          <button
            onClick={() => setShowAdd(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary text-text-primary text-xs font-medium hover:opacity-90 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            添加里程碑
          </button>
        )}
      </motion.div>

      {!currentChild && (
        <ChildEmptyState description="添加孩子后，系统会根据年级展示对应的里程碑任务" />
      )}

      {isLoading && currentChild && (
        <div className="flex items-center justify-center py-12 text-text-muted">
          <Clock className="w-5 h-5 animate-spin mr-2" />
          加载中...
        </div>
      )}

      <AnimatePresence>
        {showAdd && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="rounded-2xl bg-surface-elevated p-5 border border-border-default space-y-4"
          >
            <h3 className="font-bold text-text-primary">添加自定义里程碑</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="里程碑名称"
                className="sm:col-span-2 w-full px-3 py-2 rounded-lg bg-surface-elevated border border-border-default text-sm text-text-secondary placeholder:text-text-muted focus:outline-none focus:border-primary"
              />
              <input
                type="number"
                value={newGrade}
                onChange={(e) => setNewGrade(parseInt(e.target.value) || 1)}
                placeholder="年级"
                min={1}
                max={12}
                className="w-full px-3 py-2 rounded-lg bg-surface-elevated border border-border-default text-sm text-text-secondary placeholder:text-text-muted focus:outline-none focus:border-primary"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowAdd(false)}
                className="px-3 py-1.5 rounded-lg text-xs text-text-tertiary hover:bg-surface-hover"
              >
                取消
              </button>
              <button
                onClick={handleAdd}
                disabled={!newTitle.trim() || createMilestone.isPending}
                className="px-3 py-1.5 rounded-lg bg-primary text-text-primary text-xs font-medium hover:opacity-90 disabled:opacity-50"
              >
                {createMilestone.isPending ? '保存中...' : '保存'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-6">
        {currentChild && grouped.map(([grade, items], index) => (
          <motion.div
            key={grade}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="rounded-2xl bg-surface-elevated p-6"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-secondary to-secondary-glow flex items-center justify-center">
                <CalendarCheck className="w-6 h-6 text-text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold font-display">{gradeLabel(grade, currentChild.educationSystem)}</h2>
                <p className="text-sm text-text-tertiary">
                  {items.filter((i) => i.status === 'completed').length}/{items.length} 已完成
                </p>
              </div>
              {grade === currentGrade && (
                <span className="ml-auto px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium border border-primary/30">
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
                    className="flex flex-col gap-3 p-4 rounded-lg bg-surface-hover hover:bg-surface-hover transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => handleStatusToggle(milestone)}
                          className={`w-10 h-10 rounded-lg ${config.bg} flex items-center justify-center hover:opacity-80 transition-opacity`}
                          title={`标记为${statusConfig[config.next]?.label ?? ''}`}
                        >
                          <config.icon className={`w-5 h-5 ${config.color}`} />
                        </button>
                        <div>
                          <span className="text-text-secondary font-medium">{milestone.title}</span>
                          {milestone.description && (
                            <p className="text-xs text-text-muted mt-0.5">{milestone.description}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-medium ${config.color}`}>{config.label}</span>
                        <button
                          onClick={() => deleteMilestone.mutate(milestone.id)}
                          className="p-1.5 rounded-lg text-text-tertiary hover:text-error hover:bg-error/10 transition-colors"
                          title="删除"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="pl-14 space-y-3">
                      {m.certificateUrls.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {m.certificateUrls.map((url) => (
                            <div key={url} className="relative group w-20 h-20 rounded-lg overflow-hidden border border-border-subtle">
                              <img src={url} alt="证书" className="w-full h-full object-cover" />
                              <button
                                onClick={() => handleRemoveImage(milestone.id, url)}
                                className="absolute top-0.5 right-0.5 p-0.5 rounded bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          disabled={uploadingFor === milestone.id}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-elevated text-text-secondary text-xs hover:bg-surface-highlight transition-colors disabled:opacity-50"
                        >
                          {uploadingFor === milestone.id ? (
                            <Clock className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <ImageIcon className="w-3.5 h-3.5" />
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
          className="rounded-2xl bg-surface-elevated p-6 border border-warning/20 bg-warning/5"
        >
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-warning mb-1">暂无里程碑</h3>
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
