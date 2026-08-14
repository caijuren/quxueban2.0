'use client';
import { Icon, type IconName } from '@/components/ui/icon';
import Button from '@/components/ui/button';
import Textarea from '@/components/ui/textarea';
import Input from '@/components/ui/input';

import { useEffect, useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

import Link from 'next/link';
import { useSubjectPlan, useUpdateSubjectPlan } from '@/lib/hooks/useSubjectPlan';
import {
  SubjectPlanConfigData,
  SubjectPlanTrack,
  SubjectPlanTimeAxisItem,
  SubjectPlanNode,
  SubjectPlanKeyAchievement,
  SubjectPlanExamEvent,
  SubjectId,
} from '@/lib/subjects/subjectPlan';
import { subjectPlanConfigDataSchema } from '@/lib/validation';
import Select from '@/components/ui/select';
import { ZodError } from 'zod';

const TABS = [
  { id: 'tracks', label: '线路管理', icon: 'Route' },
  { id: 'timeAxis', label: '时间轴', icon: 'Clock' },
  { id: 'nodes', label: '地图节点', icon: 'MapPin' },
  { id: 'keyAchievements', label: '阶段目标矩阵', icon: 'Target' },
  { id: 'examTimeline', label: '赛事时间轴', icon: 'Award' },
] as const;

type TabId = (typeof TABS)[number]['id'];

function generateId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

interface SubjectPlanConfigEditorProps {
  subject: SubjectId;
  title: string;
  subtitle: string;
  backHref: string;
  backLabel: string;
  headerIcon?: IconName;
  description?: React.ReactNode;
  childId?: string;
}

export default function SubjectPlanConfigEditor({
  subject,
  title,
  subtitle,
  backHref,
  backLabel,
  headerIcon = 'Target',
  description,
  childId,
}: SubjectPlanConfigEditorProps) {
  const shouldReduceMotion = useReducedMotion();
  const { data: config, isLoading, error: queryError } = useSubjectPlan(subject, childId);
  const updateConfig = useUpdateSubjectPlan(subject, childId);

  const [activeTab, setActiveTab] = useState<TabId>('tracks');
  const [draft, setDraft] = useState<SubjectPlanConfigData | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (config) {
      const { id, createdAt, updatedAt, isSystem, ...data } = config;
      setDraft(data);
      setParseError(null);
      setSaveSuccess(false);
    }
  }, [config]);

  const hasChanges = useMemo(() => {
    if (!config || !draft) return false;
    const { id, createdAt, updatedAt, isSystem, ...original } = config;
    return JSON.stringify(original) !== JSON.stringify(draft);
  }, [config, draft]);

  const handleReset = () => {
    if (!confirm('确定要恢复为默认配置吗？当前未保存的修改会丢失。')) return;
    if (config) {
      const { id, createdAt, updatedAt, isSystem, ...data } = config;
      setDraft(data);
      setParseError(null);
      setSaveSuccess(false);
    }
  };

  const handleSave = async () => {
    if (!draft) return;
    setParseError(null);
    setSaveSuccess(false);

    const validation = subjectPlanConfigDataSchema.safeParse(draft);
    if (!validation.success) {
      const issues = (validation.error as ZodError).issues
        .map((issue) => `${issue.path.join('.')}：${issue.message}`)
        .slice(0, 10)
        .join('\n');
      setParseError(`校验失败：\n${issues}`);
      return;
    }

    try {
      await updateConfig.mutateAsync(validation.data as SubjectPlanConfigData);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setParseError(err instanceof Error ? err.message : '保存失败');
    }
  };

  const updateDraft = (updater: (prev: SubjectPlanConfigData) => SubjectPlanConfigData) => {
    setDraft((prev) => (prev ? updater(prev) : prev));
  };

  // ---------- Tracks ----------
  const addTrack = () => {
    updateDraft((prev) => ({
      ...prev,
      tracks: [
        ...prev.tracks,
        {
          id: generateId('track'),
          name: '新线路',
          // 默认线路色，后续可由用户自定义
          color: 'var(--info)',
          description: '',
        },
      ],
    }));
  };

  const updateTrack = (index: number, updates: Partial<SubjectPlanTrack>) => {
    updateDraft((prev) => {
      const tracks = [...prev.tracks];
      tracks[index] = { ...tracks[index], ...updates };
      return { ...prev, tracks };
    });
  };

  const removeTrack = (index: number) => {
    if (!confirm('删除线路会同时移除该线路下的节点和矩阵成果，确定继续？')) return;
    updateDraft((prev) => {
      const trackId = prev.tracks[index].id;
      const tracks = prev.tracks.filter((_, i) => i !== index);
      const nodes = prev.nodes.filter((n) => n.trackId !== trackId);
      const keyAchievements = { ...prev.keyAchievements };
      delete keyAchievements[trackId];
      return { ...prev, tracks, nodes, keyAchievements };
    });
  };

  // ---------- Time Axis ----------
  const addTimeAxisItem = () => {
    updateDraft((prev) => {
      const lastPosition = prev.timeAxis[prev.timeAxis.length - 1]?.position ?? -10;
      return {
        ...prev,
        timeAxis: [
          ...prev.timeAxis,
          {
            label: '新节点',
            position: Math.min(100, lastPosition + 10),
          },
        ],
      };
    });
  };

  const updateTimeAxisItem = (index: number, updates: Partial<SubjectPlanTimeAxisItem>) => {
    updateDraft((prev) => {
      const timeAxis = [...prev.timeAxis];
      timeAxis[index] = { ...timeAxis[index], ...updates };
      return { ...prev, timeAxis };
    });
  };

  const removeTimeAxisItem = (index: number) => {
    updateDraft((prev) => ({
      ...prev,
      timeAxis: prev.timeAxis.filter((_, i) => i !== index),
    }));
  };

  // ---------- Nodes ----------
  const addNode = () => {
    updateDraft((prev) => {
      const firstTrackId = prev.tracks[0]?.id ?? '';
      return {
        ...prev,
        nodes: [
          ...prev.nodes,
          {
            id: generateId('node'),
            trackId: firstTrackId,
            label: '新节点',
            position: 50,
            time: '',
            detail: '',
          },
        ],
      };
    });
  };

  const updateNode = (index: number, updates: Partial<SubjectPlanNode>) => {
    updateDraft((prev) => {
      const nodes = [...prev.nodes];
      nodes[index] = { ...nodes[index], ...updates };
      return { ...prev, nodes };
    });
  };

  const removeNode = (index: number) => {
    updateDraft((prev) => ({
      ...prev,
      nodes: prev.nodes.filter((_, i) => i !== index),
    }));
  };

  // ---------- Key Achievements ----------
  const getAchievements = (trackId: string): SubjectPlanKeyAchievement[] => {
    return draft?.keyAchievements[trackId] ?? [];
  };

  const addAchievement = (trackId: string) => {
    updateDraft((prev) => {
      const items = [...(prev.keyAchievements[trackId] ?? [])];
      items.push({ time: '新时间点', keyword: '新成果', detail: '', milestones: [] });
      return {
        ...prev,
        keyAchievements: { ...prev.keyAchievements, [trackId]: items },
      };
    });
  };

  const updateAchievement = (
    trackId: string,
    index: number,
    updates: Partial<SubjectPlanKeyAchievement>
  ) => {
    updateDraft((prev) => {
      const items = [...(prev.keyAchievements[trackId] ?? [])];
      items[index] = { ...items[index], ...updates };
      return {
        ...prev,
        keyAchievements: { ...prev.keyAchievements, [trackId]: items },
      };
    });
  };

  const removeAchievement = (trackId: string, index: number) => {
    updateDraft((prev) => {
      const items = (prev.keyAchievements[trackId] ?? []).filter((_, i) => i !== index);
      const keyAchievements = { ...prev.keyAchievements, [trackId]: items };
      if (items.length === 0) delete keyAchievements[trackId];
      return { ...prev, keyAchievements };
    });
  };

  const addMilestone = (trackId: string, index: number) => {
    updateDraft((prev) => {
      const items = [...(prev.keyAchievements[trackId] ?? [])];
      const milestones = [...(items[index].milestones ?? []), '新里程碑'];
      items[index] = { ...items[index], milestones };
      return {
        ...prev,
        keyAchievements: { ...prev.keyAchievements, [trackId]: items },
      };
    });
  };

  const updateMilestone = (
    trackId: string,
    index: number,
    milestoneIndex: number,
    value: string
  ) => {
    updateDraft((prev) => {
      const items = [...(prev.keyAchievements[trackId] ?? [])];
      const milestones = [...(items[index].milestones ?? [])];
      milestones[milestoneIndex] = value;
      items[index] = { ...items[index], milestones };
      return {
        ...prev,
        keyAchievements: { ...prev.keyAchievements, [trackId]: items },
      };
    });
  };

  const removeMilestone = (trackId: string, index: number, milestoneIndex: number) => {
    updateDraft((prev) => {
      const items = [...(prev.keyAchievements[trackId] ?? [])];
      const milestones = (items[index].milestones ?? []).filter((_, i) => i !== milestoneIndex);
      items[index] = { ...items[index], milestones };
      return {
        ...prev,
        keyAchievements: { ...prev.keyAchievements, [trackId]: items },
      };
    });
  };

  // ---------- Exam Timeline ----------
  const addExamEvent = () => {
    updateDraft((prev) => ({
      ...prev,
      examTimeline: [
        ...prev.examTimeline,
        {
          id: generateId('exam'),
          name: '新赛事',
          target: '',
          date: '',
          month: '',
          registerBefore: '',
          notes: '',
        },
      ],
    }));
  };

  const updateExamEvent = (index: number, updates: Partial<SubjectPlanExamEvent>) => {
    updateDraft((prev) => {
      const examTimeline = [...prev.examTimeline];
      examTimeline[index] = { ...examTimeline[index], ...updates };
      return { ...prev, examTimeline };
    });
  };

  const removeExamEvent = (index: number) => {
    updateDraft((prev) => ({
      ...prev,
      examTimeline: prev.examTimeline.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="space-y-6">
      <Link
        href={backHref}
        className="mb-2 inline-flex items-center gap-1 text-sm text-text-tertiary transition-colors hover:text-primary"
      >
        <Icon name="ArrowLeft" size="sm" />
        {backLabel}
      </Link>

      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="bg-secondary/10 border-secondary/20 flex size-10 items-center justify-center rounded-xl border">
            <Icon name={headerIcon} size="md" className="size-5 text-secondary" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold sm:text-3xl">{title}</h1>
            <p className="mt-0.5 text-sm text-text-tertiary">{subtitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="md"
            onClick={handleReset}
            disabled={isLoading || !draft}
            className="border-border-subtle bg-surface-elevated hover:text-text-primary"
          >
            <Icon name="RotateCcw" size="sm" />
            重置
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={handleSave}
            disabled={isLoading || updateConfig.isPending || !draft || !hasChanges}
            className="hover:bg-primary/90"
          >
            {updateConfig.isPending ? (
              <Icon name="Loader2" size="sm" animate="spin" />
            ) : saveSuccess ? (
              <Icon name="Check" size="sm" />
            ) : (
              <Icon name="Save" size="sm" />
            )}
            {updateConfig.isPending ? '保存中' : saveSuccess ? '已保存' : '保存'}
          </Button>
        </div>
      </motion.div>

      {isLoading && (
        <div className="flex h-[40vh] items-center justify-center">
          <Icon name="Loader2" size="xl" animate="spin" className="text-primary" />
        </div>
      )}

      {queryError && (
        <div className="border-error/20 bg-error/10 rounded-xl border p-6 text-error">
          {queryError instanceof Error ? queryError.message : '加载失败'}
        </div>
      )}

      {!isLoading && !queryError && draft && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="space-y-4"
        >
          {parseError && (
            <div className="border-error/20 bg-error/10 whitespace-pre-wrap rounded-xl border p-4 text-sm text-error">
              <div className="mb-1 flex items-center gap-2">
                <Icon name="AlertCircle" size="sm" />
                <span className="font-medium">配置有误</span>
              </div>
              {parseError}
            </div>
          )}

          {saveSuccess && (
            <div className="border-success/20 bg-success/10 flex items-center gap-2 rounded-xl border p-4 text-sm text-success">
              <Icon name="Check" size="sm" />
              <span className="font-medium">配置已保存</span>
            </div>
          )}

          {config?.isSystem && (
            <div className="border-secondary/20 bg-secondary/10 flex items-center gap-2 rounded-xl border p-4 text-sm text-secondary">
              <Icon name="AlertCircle" size="sm" />
              <span className="font-medium">当前使用系统默认配置</span>
              <span className="text-text-tertiary">保存后会复制为个人配置</span>
            </div>
          )}

          {description && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-primary/5 border-primary/20 flex items-start gap-3 rounded-xl border p-4"
            >
              <Icon name="AlertCircle" size="md" className="mt-0.5 shrink-0 text-primary" />
              <div className="text-sm">{description}</div>
            </motion.div>
          )}

          {/* Tabs */}
          <div className="flex flex-wrap gap-2">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <Button
                  key={tab.id}
                  variant={isActive ? 'primary' : 'secondary'}
                  size="md"
                  onClick={() => setActiveTab(tab.id)}
                  className={isActive ? '' : 'border-border-subtle bg-surface-elevated hover:text-text-primary'}
                >
                  <Icon name={tab.icon} size="sm" className="size-4" />
                  {tab.label}
                </Button>
              );
            })}
          </div>

          {/* Tracks Tab */}
          {activeTab === 'tracks' && (
            <ConfigSection
              title="线路管理"
              subtitle={`配置 ${draft.tracks.length} 条学科线路的名称、颜色和说明`}
            >
              <div className="space-y-3">
                {draft.tracks.map((track, index) => (
                  <div
                    key={track.id}
                    className="rounded-xl border border-border-subtle bg-surface-elevated p-4"
                  >
                    <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-12">
                      <div className="md:col-span-3">
                        <label className="mb-1.5 block text-xs text-text-tertiary">线路 ID</label>
                        <Input
                          type="text"
                          value={track.id}
                          readOnly
                          className="w-full rounded-lg border border-border-subtle bg-surface-highlight px-3 py-2 text-sm text-text-muted focus:outline-none"
                        />
                      </div>
                      <div className="md:col-span-3">
                        <label className="mb-1.5 block text-xs text-text-tertiary">名称</label>
                        <Input
                          type="text"
                          value={track.name}
                          onChange={(e) => updateTrack(index, { name: e.target.value })}
                          className="w-full rounded-lg border border-border-subtle bg-surface px-3 py-2 text-sm text-text-secondary focus:border-primary focus:outline-none"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="mb-1.5 block text-xs text-text-tertiary">颜色</label>
                        <div className="flex items-center gap-2">
                          <Input
                            type="color"
                            value={track.color}
                            onChange={(e) => updateTrack(index, { color: e.target.value })}
                            className="h-9 w-10 cursor-pointer rounded-lg border border-border-subtle bg-transparent"
                          />
                          <Input
                            type="text"
                            value={track.color}
                            onChange={(e) => updateTrack(index, { color: e.target.value })}
                            className="flex-1 rounded-lg border border-border-subtle bg-surface px-3 py-2 font-mono text-sm text-text-secondary focus:border-primary focus:outline-none"
                          />
                        </div>
                      </div>
                      <div className="md:col-span-3">
                        <label className="mb-1.5 block text-xs text-text-tertiary">说明</label>
                        <Input
                          type="text"
                          value={track.description ?? ''}
                          onChange={(e) => updateTrack(index, { description: e.target.value })}
                          className="w-full rounded-lg border border-border-subtle bg-surface px-3 py-2 text-sm text-text-secondary focus:border-primary focus:outline-none"
                        />
                      </div>
                      <div className="flex md:col-span-1 md:justify-end">
                        <Button
                          variant="ghost"
                          size="xs"
                          onClick={() => removeTrack(index)}
                          className="hover:bg-error/10 hover:text-error text-text-tertiary"
                          title="删除"
                        >
                          <Icon name="Trash2" size="sm" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                <Button
                  variant="ghost"
                  size="md"
                  onClick={addTrack}
                  className="hover:border-primary/40 hover:bg-primary/5 hover:text-primary w-full border border-dashed border-border-default py-3 text-text-tertiary"
                >
                  <Icon name="Plus" size="sm" />
                  添加线路
                </Button>
              </div>
            </ConfigSection>
          )}

          {/* Time Axis Tab */}
          {activeTab === 'timeAxis' && (
            <ConfigSection title="时间轴" subtitle="配置地图底部时间轴的节点标签和位置（0-100）">
              <div className="space-y-3">
                {draft.timeAxis.map((item, index) => (
                  <div
                    key={`${item.label}-${index}`}
                    className="flex items-center gap-4 rounded-xl border border-border-subtle bg-surface-elevated p-4"
                  >
                    <Icon name="GripVertical" size="sm" className="text-text-muted" />
                    <div className="grid flex-1 grid-cols-1 gap-4 md:grid-cols-2">
                      <div>
                        <label className="mb-1.5 block text-xs text-text-tertiary">标签</label>
                        <Input
                          type="text"
                          value={item.label}
                          onChange={(e) => updateTimeAxisItem(index, { label: e.target.value })}
                          className="w-full rounded-lg border border-border-subtle bg-surface px-3 py-2 text-sm text-text-secondary focus:border-primary focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-xs text-text-tertiary">
                          位置（0-100）
                        </label>
                        <Input
                          type="number"
                          min={0}
                          max={100}
                          value={item.position}
                          onChange={(e) =>
                            updateTimeAxisItem(index, { position: Number(e.target.value) })
                          }
                          className="w-full rounded-lg border border-border-subtle bg-surface px-3 py-2 text-sm text-text-secondary focus:border-primary focus:outline-none"
                        />
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="xs"
                      onClick={() => removeTimeAxisItem(index)}
                      className="hover:bg-error/10 hover:text-error text-text-tertiary"
                      title="删除"
                    >
                      <Icon name="Trash2" size="sm" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="ghost"
                  size="md"
                  onClick={addTimeAxisItem}
                  className="hover:border-primary/40 hover:bg-primary/5 hover:text-primary w-full border border-dashed border-border-default py-3 text-text-tertiary"
                >
                  <Icon name="Plus" size="sm" />
                  添加时间轴节点
                </Button>
              </div>
            </ConfigSection>
          )}

          {/* Nodes Tab */}
          {activeTab === 'nodes' && (
            <ConfigSection title="地图节点" subtitle="配置每条线路上的关键节点">
              <div className="space-y-3">
                {draft.nodes.map((node, index) => (
                  <div
                    key={node.id}
                    className="rounded-xl border border-border-subtle bg-surface-elevated p-4"
                  >
                    <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-12">
                      <div className="md:col-span-2">
                        <label className="mb-1.5 block text-xs text-text-tertiary">所属线路</label>
                        <Select
                          value={node.trackId}
                          onChange={(e) => updateNode(index, { trackId: e.target.value })}
                          size="md"
                          className="bg-surface"
                          options={draft.tracks.map((track) => ({
                            value: track.id,
                            label: track.name,
                          }))}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="mb-1.5 block text-xs text-text-tertiary">标签</label>
                        <Input
                          type="text"
                          value={node.label}
                          onChange={(e) => updateNode(index, { label: e.target.value })}
                          className="w-full rounded-lg border border-border-subtle bg-surface px-3 py-2 text-sm text-text-secondary focus:border-primary focus:outline-none"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="mb-1.5 block text-xs text-text-tertiary">
                          位置（0-100）
                        </label>
                        <Input
                          type="number"
                          min={0}
                          max={100}
                          value={node.position}
                          onChange={(e) => updateNode(index, { position: Number(e.target.value) })}
                          className="w-full rounded-lg border border-border-subtle bg-surface px-3 py-2 text-sm text-text-secondary focus:border-primary focus:outline-none"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="mb-1.5 block text-xs text-text-tertiary">时间</label>
                        <Input
                          type="text"
                          value={node.time}
                          onChange={(e) => updateNode(index, { time: e.target.value })}
                          placeholder="如 2025.09"
                          className="w-full rounded-lg border border-border-subtle bg-surface px-3 py-2 text-sm text-text-secondary focus:border-primary focus:outline-none"
                        />
                      </div>
                      <div className="md:col-span-3">
                        <label className="mb-1.5 block text-xs text-text-tertiary">详细说明</label>
                        <Input
                          type="text"
                          value={node.detail ?? ''}
                          onChange={(e) => updateNode(index, { detail: e.target.value })}
                          className="w-full rounded-lg border border-border-subtle bg-surface px-3 py-2 text-sm text-text-secondary focus:border-primary focus:outline-none"
                        />
                      </div>
                      <div className="flex md:col-span-1 md:justify-end">
                        <Button
                          variant="ghost"
                          size="xs"
                          onClick={() => removeNode(index)}
                          className="hover:bg-error/10 hover:text-error text-text-tertiary"
                          title="删除"
                        >
                          <Icon name="Trash2" size="sm" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                <Button
                  variant="ghost"
                  size="md"
                  onClick={addNode}
                  className="hover:border-primary/40 hover:bg-primary/5 hover:text-primary w-full border border-dashed border-border-default py-3 text-text-tertiary"
                >
                  <Icon name="Plus" size="sm" />
                  添加节点
                </Button>
              </div>
            </ConfigSection>
          )}

          {/* Key Achievements Tab */}
          {activeTab === 'keyAchievements' && (
            <ConfigSection
              title="阶段目标矩阵"
              subtitle="按线路配置每个关键时间点的成果目标、说明和里程碑"
            >
              <div className="space-y-6">
                {draft.tracks.map((track) => {
                  const achievements = getAchievements(track.id);
                  return (
                    <div
                      key={track.id}
                      className="rounded-xl border border-border-subtle bg-surface-elevated p-5"
                    >
                      <div className="mb-4 flex items-center gap-2">
                        <div
                          className="size-3 rounded-full"
                          style={{ backgroundColor: track.color }}
                        />
                        <h3 className="font-bold text-text-secondary">{track.name}</h3>
                        <span className="text-xs text-text-muted">
                          ({achievements.length} 个目标)
                        </span>
                      </div>

                      <div className="space-y-3">
                        {achievements.map((achievement, index) => (
                          <div
                            key={`${achievement.time}-${index}`}
                            className="rounded-xl border border-border-subtle bg-surface p-4"
                          >
                            <div className="mb-3 grid grid-cols-1 items-start gap-4 md:grid-cols-12">
                              <div className="md:col-span-2">
                                <label className="mb-1.5 block text-xs text-text-tertiary">
                                  时间点
                                </label>
                                <Input
                                  type="text"
                                  value={achievement.time}
                                  onChange={(e) =>
                                    updateAchievement(track.id, index, { time: e.target.value })
                                  }
                                  placeholder="如 一上期末"
                                  className="w-full rounded-lg border border-border-subtle bg-surface-highlight px-3 py-2 text-sm text-text-secondary focus:border-primary focus:outline-none"
                                />
                              </div>
                              <div className="md:col-span-3">
                                <label className="mb-1.5 block text-xs text-text-tertiary">
                                  成果关键词
                                </label>
                                <Input
                                  type="text"
                                  value={achievement.keyword}
                                  onChange={(e) =>
                                    updateAchievement(track.id, index, { keyword: e.target.value })
                                  }
                                  className="w-full rounded-lg border border-border-subtle bg-surface-highlight px-3 py-2 text-sm text-text-secondary focus:border-primary focus:outline-none"
                                />
                              </div>
                              <div className="md:col-span-6">
                                <label className="mb-1.5 block text-xs text-text-tertiary">
                                  详细说明
                                </label>
                                <Input
                                  type="text"
                                  value={achievement.detail ?? ''}
                                  onChange={(e) =>
                                    updateAchievement(track.id, index, { detail: e.target.value })
                                  }
                                  className="w-full rounded-lg border border-border-subtle bg-surface-highlight px-3 py-2 text-sm text-text-secondary focus:border-primary focus:outline-none"
                                />
                              </div>
                              <div className="flex md:col-span-1 md:justify-end">
                                <Button
                                  variant="ghost"
                                  size="xs"
                                  onClick={() => removeAchievement(track.id, index)}
                                  className="hover:bg-error/10 hover:text-error text-text-tertiary"
                                  title="删除"
                                >
                                  <Icon name="Trash2" size="sm" />
                                </Button>
                              </div>
                            </div>

                            <div>
                              <div className="mb-2 flex items-center gap-2">
                                <span className="text-xs text-text-tertiary">里程碑</span>
                                <Button
                                  variant="link"
                                  size="xs"
                                  onClick={() => addMilestone(track.id, index)}
                                  className="hover:text-primary/80"
                                >
                                  <Icon name="Plus" size="xs" />
                                  添加
                                </Button>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {(achievement.milestones ?? []).map((milestone, mi) => (
                                  <div
                                    key={mi}
                                    className="bg-secondary/10 border-secondary/20 flex items-center gap-1 rounded-lg border px-2 py-1"
                                  >
                                    <Input
                                      type="text"
                                      value={milestone}
                                      onChange={(e) =>
                                        updateMilestone(track.id, index, mi, e.target.value)
                                      }
                                      className="w-24 bg-transparent text-xs text-secondary focus:outline-none"
                                    />
                                    <Button
                                      variant="ghost"
                                      size="xs"
                                      onClick={() => removeMilestone(track.id, index, mi)}
                                      className="text-secondary/70 hover:text-secondary"
                                    >
                                      <Icon name="X" size="xs" />
                                    </Button>
                                  </div>
                                ))}
                                {(achievement.milestones ?? []).length === 0 && (
                                  <span className="text-xs text-text-muted">暂无里程碑</span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <Button
                        variant="ghost"
                        size="md"
                        onClick={() => addAchievement(track.id)}
                        className="hover:border-primary/40 hover:bg-primary/5 hover:text-primary mt-3 w-full border border-dashed border-border-default py-2.5 text-text-tertiary"
                      >
                        <Icon name="Plus" size="sm" />
                        添加 {track.name} 目标
                      </Button>
                    </div>
                  );
                })}
              </div>
            </ConfigSection>
          )}

          {/* Exam Timeline Tab */}
          {activeTab === 'examTimeline' && (
            <ConfigSection title="赛事时间轴" subtitle="配置荣誉赛事与关键提醒">
              <div className="space-y-3">
                {draft.examTimeline.map((exam, index) => (
                  <div
                    key={exam.id}
                    className="rounded-xl border border-border-subtle bg-surface-elevated p-4"
                  >
                    <div className="mb-3 grid grid-cols-1 items-start gap-4 md:grid-cols-12">
                      <div className="md:col-span-2">
                        <label className="mb-1.5 block text-xs text-text-tertiary">赛事名称</label>
                        <Input
                          type="text"
                          value={exam.name}
                          onChange={(e) => updateExamEvent(index, { name: e.target.value })}
                          className="w-full rounded-lg border border-border-subtle bg-surface px-3 py-2 text-sm text-text-secondary focus:border-primary focus:outline-none"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="mb-1.5 block text-xs text-text-tertiary">目标</label>
                        <Input
                          type="text"
                          value={exam.target ?? ''}
                          onChange={(e) => updateExamEvent(index, { target: e.target.value })}
                          className="w-full rounded-lg border border-border-subtle bg-surface px-3 py-2 text-sm text-text-secondary focus:border-primary focus:outline-none"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="mb-1.5 block text-xs text-text-tertiary">日期</label>
                        <Input
                          type="text"
                          value={exam.date ?? ''}
                          onChange={(e) => updateExamEvent(index, { date: e.target.value })}
                          placeholder="如 2027.04"
                          className="w-full rounded-lg border border-border-subtle bg-surface px-3 py-2 text-sm text-text-secondary focus:border-primary focus:outline-none"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="mb-1.5 block text-xs text-text-tertiary">月份/学期</label>
                        <Input
                          type="text"
                          value={exam.month ?? ''}
                          onChange={(e) => updateExamEvent(index, { month: e.target.value })}
                          placeholder="如 三年级春季"
                          className="w-full rounded-lg border border-border-subtle bg-surface px-3 py-2 text-sm text-text-secondary focus:border-primary focus:outline-none"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="mb-1.5 block text-xs text-text-tertiary">
                          报名/准备时间
                        </label>
                        <Input
                          type="text"
                          value={exam.registerBefore ?? ''}
                          onChange={(e) =>
                            updateExamEvent(index, { registerBefore: e.target.value })
                          }
                          className="w-full rounded-lg border border-border-subtle bg-surface px-3 py-2 text-sm text-text-secondary focus:border-primary focus:outline-none"
                        />
                      </div>
                      <div className="flex md:col-span-1 md:justify-end">
                        <Button
                          variant="ghost"
                          size="xs"
                          onClick={() => removeExamEvent(index)}
                          className="hover:bg-error/10 hover:text-error text-text-tertiary"
                          title="删除"
                        >
                          <Icon name="Trash2" size="sm" />
                        </Button>
                      </div>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs text-text-tertiary">备注提醒</label>
                      <Textarea
                        value={exam.notes ?? ''}
                        onChange={(e) => updateExamEvent(index, { notes: e.target.value })}
                        rows={2}
                        resize="none"
                        className="border-border-subtle bg-surface px-3 py-2 text-text-secondary"
                      />
                    </div>
                  </div>
                ))}
                <Button
                  variant="ghost"
                  size="md"
                  onClick={addExamEvent}
                  className="hover:border-primary/40 hover:bg-primary/5 hover:text-primary w-full border border-dashed border-border-default py-3 text-text-tertiary"
                >
                  <Icon name="Plus" size="sm" />
                  添加赛事节点
                </Button>
              </div>
            </ConfigSection>
          )}
        </motion.div>
      )}
    </div>
  );
}

function ConfigSection({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border-subtle bg-surface-elevated p-6">
      <div className="mb-5">
        <h2 className="text-lg font-bold text-text-secondary">{title}</h2>
        <p className="mt-0.5 text-xs text-text-tertiary">{subtitle}</p>
      </div>
      {children}
    </div>
  );
}
