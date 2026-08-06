'use client';

import { useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  Sprout,
  CheckCircle2,
  Trophy,
  ScrollText,
  Award,
  Star,
  TrendingUp,
  Image as ImageIcon,
  Mic,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { useChildren } from '@/components/dashboard/ChildrenContext';
import ChildAvatar from '@/components/dashboard/ChildAvatar';
import ChildEmptyState from '@/components/dashboard/ChildEmptyState';
import CommandCard from '@/components/ui/CommandCard';
import EmptyState from '@/components/ui/EmptyState';
import { gradeLabel } from '@/lib/children';
import { useGrowthTimeline, useGrowthEvidence, GrowthTimelineItem } from '@/lib/hooks/useGrowth';
import {
  getPlanStats,
  getCurrentWeekId,
  formatWeekLabel,
  getWeekRange,
  getISOWeek,
} from '@/lib/weeklyTasks';

const typeMeta: Record<
  GrowthTimelineItem['type'],
  { icon: typeof CheckCircle2; label: string; color: string }
> = {
  task: { icon: CheckCircle2, label: '任务打卡', color: 'text-success' },
  milestone: { icon: Trophy, label: '里程碑', color: 'text-secondary' },
  parentLog: { icon: ScrollText, label: '家长记录', color: 'text-ai' },
  badge: { icon: Award, label: '徽章', color: 'text-warning' },
  pointLog: { icon: Star, label: '积分', color: 'text-primary' },
};

function shiftWeekId(weekId: string, delta: number): string {
  const { start } = getWeekRange(weekId);
  const next = new Date(start);
  next.setDate(start.getDate() + delta * 7);
  return getISOWeek(next).weekId;
}

function formatDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('zh-CN', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function GrowthPage() {
  const shouldReduceMotion = useReducedMotion();
  const { children, currentChild, currentChildId, setCurrentChildId, weeklyPlans } = useChildren();

  const childId = currentChild?.id;
  const { data: timelineData, isLoading: timelineLoading, error: timelineError } =
    useGrowthTimeline(childId);
  const { data: evidenceData, isLoading: evidenceLoading, error: evidenceError } =
    useGrowthEvidence(childId);

  const weeklyRates = useMemo(() => {
    if (!childId) return [];
    const currentWeekId = getCurrentWeekId();
    const weeks = Array.from({ length: 4 }, (_, i) => shiftWeekId(currentWeekId, -i));
    return weeks.map((weekId) => {
      const plan = weeklyPlans.find((p) => p.childId === childId && p.weekId === weekId);
      const rate = plan ? getPlanStats(plan).completionRate : 0;
      return { weekId, label: formatWeekLabel(weekId), rate };
    });
  }, [childId, weeklyPlans]);

  if (!currentChild) {
    return (
      <div className="space-y-8">
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Sprout className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold font-display">成长档案</h1>
            </div>
          </div>
        </motion.div>
        <ChildEmptyState description="添加孩子后，即可查看成长时间线与证据库" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col lg:flex-row lg:items-center justify-between gap-4"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <Sprout className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold font-display">成长档案</h1>
            <p className="text-sm text-text-tertiary mt-0.5">
              {currentChild.name} · {gradeLabel(currentChild.grade, currentChild.educationSystem)}
            </p>
          </div>
        </div>

        {/* Child selector */}
        <div className="flex flex-wrap items-center gap-2">
          {children.map((child) => {
            const active = child.id === currentChildId;
            return (
              <button
                key={child.id}
                onClick={() => setCurrentChildId(child.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-sm transition-all ${
                  active
                    ? 'bg-primary/[0.08] border-primary/30 text-primary'
                    : 'bg-surface-elevated border-border-subtle text-text-secondary hover:bg-surface-hover hover:text-text-primary'
                }`}
              >
                <ChildAvatar child={child} size="sm" shape="rounded" />
                <span className="font-medium">{child.name}</span>
              </button>
            );
          })}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Timeline */}
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="lg:col-span-2"
        >
          <CommandCard className="p-5 h-full">
            <div className="flex items-center gap-2 mb-5">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-bold text-text-secondary">成长时间线</h2>
            </div>

            {timelineLoading && (
              <div className="flex h-[40vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            )}

            {timelineError && (
              <div className="rounded-xl border border-error/20 bg-error/10 p-4 text-error text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                {timelineError instanceof Error ? timelineError.message : '加载失败'}
              </div>
            )}

            {!timelineLoading && !timelineError && (
              <div className="space-y-4">
                {(timelineData?.items.length ?? 0) === 0 ? (
                  <EmptyState
                    icon={Sprout}
                    title="暂无时间线记录"
                    description="完成任务、获得徽章或记录家长日志后会自动汇总"
                  />
                ) : (
                  timelineData!.items.map((item, index) => (
                    <TimelineRow key={`${item.type}-${item.id}-${index}`} item={item} index={index} />
                  ))
                )}
              </div>
            )}
          </CommandCard>
        </motion.div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Weekly completion mini-chart */}
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <CommandCard className="p-5">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-ai" />
                <h2 className="text-base font-bold text-text-secondary">近四周完成率</h2>
              </div>

              {weeklyRates.length === 0 ? (
                <EmptyState
                  icon={TrendingUp}
                  title="暂无周计划"
                  description="发布周计划后会显示完成趋势"
                />
              ) : (
                <div className="flex items-end justify-between gap-3 h-40">
                  {weeklyRates.map((week) => (
                    <div key={week.weekId} className="flex-1 flex flex-col items-center gap-2">
                      <div className="relative w-full h-28 bg-surface rounded-xl overflow-hidden">
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${week.rate}%` }}
                          transition={{ duration: 0.6, delay: 0.3 }}
                          className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-primary to-primary/70 rounded-xl"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-xs font-bold text-text-primary drop-shadow">
                            {week.rate}%
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] text-text-muted text-center leading-tight">
                        {week.label.replace(' · ', '\n')}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CommandCard>
          </motion.div>

          {/* Evidence gallery */}
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <CommandCard className="p-5">
              <div className="flex items-center gap-2 mb-4">
                <ImageIcon className="w-5 h-5 text-secondary" />
                <h2 className="text-base font-bold text-text-secondary">证据库</h2>
              </div>

              {evidenceLoading && (
                <div className="flex h-32 items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              )}

              {evidenceError && (
                <div className="rounded-xl border border-error/20 bg-error/10 p-4 text-error text-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  {evidenceError instanceof Error ? evidenceError.message : '加载失败'}
                </div>
              )}

              {!evidenceLoading && !evidenceError && (
                <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
                  {(evidenceData?.items.length ?? 0) === 0 ? (
                    <EmptyState
                      icon={Mic}
                      title="暂无照片/音频"
                      description="在任务打卡中上传照片或音频后会出现在这里"
                    />
                  ) : (
                    evidenceData!.items.map((item) => (
                      <div
                        key={item.id}
                        className="rounded-xl bg-surface-elevated border border-border-subtle p-3 space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-text-secondary truncate pr-2">
                            {item.taskTitle}
                          </p>
                          <span className="text-[10px] text-text-muted shrink-0">
                            {formatDate(item.date)}
                          </span>
                        </div>

                        {item.imageUrls.length > 0 && (
                          <div className="grid grid-cols-2 gap-2">
                            {item.imageUrls.map((url, idx) => (
                              <a
                                key={idx}
                                href={url}
                                target="_blank"
                                rel="noreferrer"
                                className="aspect-square rounded-lg overflow-hidden border border-border-subtle bg-surface"
                              >
                                <img
                                  src={url}
                                  alt={`证据 ${idx + 1}`}
                                  className="w-full h-full object-cover hover:scale-105 transition-transform"
                                />
                              </a>
                            ))}
                          </div>
                        )}

                        {item.audioUrls.length > 0 && (
                          <div className="space-y-2">
                            {item.audioUrls.map((url, idx) => (
                              <audio
                                key={idx}
                                controls
                                src={url}
                                className="w-full h-8"
                              />
                            ))}
                            {item.audioTranscript && (
                              <p className="text-xs text-text-tertiary bg-surface p-2 rounded-lg border border-border-subtle">
                                {item.audioTranscript}
                              </p>
                            )}
                          </div>
                        )}

                        {item.note && (
                          <p className="text-xs text-text-tertiary line-clamp-2">{item.note}</p>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}
            </CommandCard>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function TimelineRow({ item, index }: { item: GrowthTimelineItem; index: number }) {
  const meta = typeMeta[item.type];
  const Icon = meta.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.03 }}
      className="flex gap-3"
    >
      <div className="flex flex-col items-center gap-1 pt-1">
        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center border border-border-subtle bg-surface-elevated ${meta.color}`}
        >
          <Icon className="w-4 h-4" />
        </div>
        <div className="w-px flex-1 bg-border-subtle min-h-[16px]" />
      </div>

      <div className="flex-1 pb-4">
        <div className="rounded-xl bg-surface-elevated border border-border-subtle p-3">
          <div className="flex items-start justify-between gap-3 mb-1">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-text-secondary truncate">{item.title}</p>
              <p className="text-[10px] text-text-muted mt-0.5">
                {meta.label}
                {' · '}
                {formatDate(item.date)}
              </p>
            </div>
          </div>

          {item.type === 'task' && (
            <div className="flex flex-wrap gap-2 mt-2">
              {item.subject && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-surface border border-border-subtle text-text-tertiary">
                  {item.subject === 'chinese' ? '语文' : item.subject === 'math' ? '数学' : '英语'}
                </span>
              )}
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-surface border border-border-subtle text-text-tertiary">
                状态：{item.status}
              </span>
              {item.note && (
                <p className="w-full text-xs text-text-tertiary line-clamp-2">{item.note}</p>
              )}
            </div>
          )}

          {item.type === 'milestone' && item.description && (
            <p className="text-xs text-text-tertiary mt-2 line-clamp-2">{item.description}</p>
          )}

          {item.type === 'parentLog' && (
            <div className="mt-2 space-y-2">
              <p className="text-xs text-text-tertiary line-clamp-3">{item.content}</p>
              {item.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] px-2 py-0.5 rounded-full bg-ai/10 text-ai border border-ai/20"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              {item.imageUrls.length > 0 && (
                <div className="flex gap-2">
                  {item.imageUrls.slice(0, 3).map((url, idx) => (
                    <a
                      key={idx}
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                      className="w-12 h-12 rounded-lg overflow-hidden border border-border-subtle bg-surface"
                    >
                      <img
                        src={url}
                        alt=""
                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                      />
                    </a>
                  ))}
                  {item.imageUrls.length > 3 && (
                    <span className="w-12 h-12 rounded-lg bg-surface flex items-center justify-center text-[10px] text-text-muted">
                      +{item.imageUrls.length - 3}
                    </span>
                  )}
                </div>
              )}
            </div>
          )}

          {item.type === 'badge' && (
            <div className="flex items-center gap-2 mt-2">
              {item.color && (
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
              )}
              <span className="text-xs text-text-tertiary">
                {item.description || `获得 Lv.${item.level} 徽章`}
              </span>
            </div>
          )}

          {item.type === 'pointLog' && (
            <p className="text-xs text-text-tertiary mt-2">
              {item.points > 0 ? '+' : ''}
              {item.points} 积分 · 累计 {item.total}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
