'use client';

import { useState } from 'react';
import { useReducedMotion } from '@/components/motion';
import { SlideUp, StaggerContainer, StaggerItem } from '@/components/motion';
import { Icon } from '@/components/ui/icon';
import { useRouter } from 'next/navigation';
import { useChildren } from '@/components/dashboard/ChildrenContext';
import { Child, gradeLabel, gradeToStage } from '@/lib/children';
import { getPlanStats, getCurrentWeekId } from '@/lib/weeklyTasks';
import {
  getStrategicTimeline,
  getUpcomingMilestones,
  generateStrategicAdvice,
  getRouteSummary,
  getRouteMatchSnapshot,
  type TimelineItem,
  type UpcomingMilestone,
  type RiskLevel,
} from '@/lib/dashboard';
import ChildAvatar from '@/components/dashboard/ChildAvatar';
import ChildEmptyState from '@/components/dashboard/ChildEmptyState';
import DataBadge from '@/components/ui/DataBadge';
import EmptyState from '@/components/ui/EmptyState';
import GaugeChart from '@/components/ui/GaugeChart';
import GlassCard from '@/components/ui/glass-card';
import Button from '@/components/ui/button';

type ViewMode = 'command' | 'overview';

function getCompletionRate(
  child: Child,
  getWeeklyPlan: ReturnType<typeof useChildren>['getWeeklyPlan']
) {
  const plan = getWeeklyPlan(getCurrentWeekId(), child.id);
  if (!plan) return null;
  return getPlanStats(plan).completionRate;
}

function ViewToggle({ mode, onChange }: { mode: ViewMode; onChange: (mode: ViewMode) => void }) {
  return (
    <div className="flex items-center gap-1 rounded-[14px] border border-border-default bg-surface p-1">
      <Button
        onClick={() => onChange('command')}
        variant="ghost"
        size="sm"
        className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
          mode === 'command'
            ? 'bg-primary/[0.10] text-primary'
            : 'text-text-tertiary hover:text-text-secondary'
        }`}
      >
        <Icon name="User" size="sm" />
        当前孩子
      </Button>
      <Button
        onClick={() => onChange('overview')}
        variant="ghost"
        size="sm"
        className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
          mode === 'overview'
            ? 'bg-primary/[0.10] text-primary'
            : 'text-text-tertiary hover:text-text-secondary'
        }`}
      >
        <Icon name="LayoutGrid" size="sm" />
        全家总览
      </Button>
    </div>
  );
}

function IdentityCard({ child, completionRate }: { child: Child; completionRate: number | null }) {
  const router = useRouter();
  const routeSummary = getRouteSummary(child);
  const matchSnapshot = getRouteMatchSnapshot(child, completionRate);

  const primaryTarget = child.targetSchool || routeSummary.targetSchools[0] || '待设定';
  const backupTargets = routeSummary.targetSchools
    .filter((s) => s !== primaryTarget)
    .slice(0, 2)
    .join(' | ');

  const metrics = [
    {
      icon: 'School' as const,
      label: '目标学校',
      value: primaryTarget,
      sub: backupTargets || routeSummary.name,
    },
    {
      icon: 'Flag' as const,
      label: '当前阶段',
      value: '基础能力构建期',
      sub: '夯实基础，稳步提升',
    },
    {
      icon: 'Compass' as const,
      label: '路线方向',
      value: routeSummary.direction,
      sub: routeSummary.directionDetail,
    },
  ];

  return (
    <GlassCard strength="strong" glow="primary" hover className="max-sm:!bg-surface max-sm:!backdrop-blur-none max-sm:!border-border-default p-5 sm:p-6">
      <div className="flex flex-col gap-6 xl:flex-row xl:items-stretch">
        {/* Left column: header + metrics + footer */}
        <div className="flex min-w-0 flex-1 flex-col">
          {/* Header row */}
          <div className="mb-5 flex items-start gap-4">
            <ChildAvatar child={child} size="2xl" shape="rounded" />
            <div className="min-w-0 flex-1">
              <div className="mb-1.5 flex flex-wrap items-center gap-2">
                <h2 className="font-display text-xl font-bold text-text-primary sm:text-2xl">
                  {child.name}
                </h2>
                <DataBadge variant="primary" size="sm">
                  {gradeToStage(child.grade, child.educationSystem)}
                </DataBadge>
                <DataBadge
                  variant={routeSummary.type === 'primary' ? 'default' : 'secondary'}
                  size="sm"
                >
                  {routeSummary.type === 'primary' ? '主路线' : '备选路线'}
                </DataBadge>
              </div>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-text-secondary">
                <span>{gradeLabel(child.grade, child.educationSystem)}</span>
                <span className="text-border-strong">·</span>
                <span className="truncate">嘉定区重点冲刺</span>
                {child.targetSchool && (
                  <>
                    <span className="hidden text-border-strong sm:inline">·</span>
                    <span className="truncate text-primary">目标 {child.targetSchool}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Metrics row */}
          <div className="grid min-h-[112px] flex-1 grid-cols-1 gap-3 sm:grid-cols-3">
            {metrics.map((metric) => (
              <div
                key={metric.label}
                className="flex h-full flex-col rounded-[14px] border border-border-default bg-surface p-4"
              >
                <div className="mb-2 flex items-center gap-1.5">
                  <Icon name={metric.icon} size="xs" className="text-text-muted" />
                  <span className="text-2xs text-text-muted">{metric.label}</span>
                </div>
                <p className="mb-0.5 truncate text-base font-semibold text-text-primary">
                  {metric.value}
                </p>
                <p className="mt-auto truncate text-xs text-text-tertiary">{metric.sub}</p>
              </div>
            ))}
          </div>

          {/* Footer buttons */}
          <div className="mt-5 flex flex-wrap gap-2 border-t border-border-default pt-5">
            <Button
              onClick={() => router.push('/dashboard/plan')}
              variant="secondary"
              size="sm"
              className="inline-flex items-center gap-1.5 rounded-lg bg-surface px-3 py-2 text-xs font-medium text-text-secondary transition-all hover:bg-surface-hover hover:text-text-primary"
            >
              <Icon name="Route" size="sm" />
              路线方案
            </Button>
            <Button
              onClick={() => router.push('/dashboard/weekly')}
              variant="secondary"
              size="sm"
              className="inline-flex items-center gap-1.5 rounded-lg bg-surface px-3 py-2 text-xs font-medium text-text-secondary transition-all hover:bg-surface-hover hover:text-text-primary"
            >
              <Icon name="CalendarDays" size="sm" />
              周计划
            </Button>
            <Button
              onClick={() => router.push('/dashboard/ai')}
              variant="secondary"
              size="sm"
              className="inline-flex items-center gap-1.5 rounded-lg bg-surface px-3 py-2 text-xs font-medium text-text-secondary transition-all hover:bg-surface-hover hover:text-text-primary"
            >
              <Icon name="Sparkles" size="sm" animate="pulse" />
              AI 诊断
            </Button>
          </div>
        </div>

        {/* Right column: match gauge */}
        <div className="flex min-w-[160px] shrink-0 flex-col items-center justify-center border-t border-border-default pt-6 xl:border-l xl:border-t-0 xl:border-border-default xl:pl-8 xl:pt-0">
          <div className="mb-4 flex items-center gap-1.5">
            <span className="text-xs text-text-tertiary">路线匹配度</span>
            <Icon name="CircleHelp" size="xs" className="text-text-muted" />
          </div>
          <GaugeChart value={matchSnapshot.probability} size={132} strokeWidth={11} />
          <div className="mt-4 flex items-center gap-1.5 text-xs">
            <Icon name="TrendingUp" size="sm" className="text-primary" />
            <span className="font-medium text-primary">
              较上次提升 {matchSnapshot.change > 0 ? '+' : ''}
              {matchSnapshot.change}%
            </span>
          </div>
          <p className="mt-2 text-xs leading-relaxed text-text-tertiary">
            距离目标还有 {matchSnapshot.remaining}% 提升空间
          </p>
        </div>
      </div>
    </GlassCard>
  );
}

function TimelineNode({ item, isLast }: { item: TimelineItem; isLast: boolean }) {
  const statusConfig = {
    past: {
      icon: 'CircleCheck' as const,
      dotClass: 'bg-surface border border-success/40',
      iconClass: 'text-success',
      lineClass: 'bg-border-default',
      badgeClass: 'bg-surface text-success border border-success/20',
      titleClass: 'text-text-secondary',
      objectiveIconClass: 'text-success/70',
    },
    current: {
      icon: 'Flame' as const,
      dotClass: 'bg-primary/15 border border-primary/40 shadow-[0_0_16px_var(--shadow-primary)]',
      iconClass: 'text-primary',
      lineClass: 'bg-border-default',
      badgeClass: 'bg-primary/10 text-primary border border-primary/20',
      titleClass: 'text-text-primary',
      objectiveIconClass: 'text-primary/70',
    },
    future: {
      icon: 'Circle' as const,
      dotClass: 'bg-surface border border-border-default',
      iconClass: 'text-text-muted',
      lineClass: 'bg-border-default',
      badgeClass: 'bg-surface text-text-tertiary border border-border-default',
      titleClass: 'text-text-secondary',
      objectiveIconClass: 'text-text-muted',
    },
  };

  const config = statusConfig[item.status];

  return (
    <div className="relative flex gap-4">
      {!isLast && (
        <div
          className={`absolute left-[13px] top-8 h-[calc(100%-16px)] w-px ${config.lineClass}`}
        />
      )}

      <div className="flex shrink-0 flex-col items-center pt-1">
        <div
          className={`relative z-10 flex size-7 items-center justify-center rounded-full ${config.dotClass}`}
        >
          <Icon name={config.icon} size="sm" className={config.iconClass} />
        </div>
      </div>

      <div className="min-w-0 flex-1 pb-6">
        <div className="flex flex-col md:flex-row md:gap-6">
          {/* Left: timeline header + description */}
          <div className="min-w-0 flex-1">
            <div className="mb-1 flex flex-wrap items-center gap-2">
              <span className={`rounded-lg px-2 py-0.5 text-2xs font-medium ${config.badgeClass}`}>
                {item.time}
              </span>
              {item.status === 'current' && (
                <span className="text-2xs font-medium text-primary">当前重点</span>
              )}
            </div>
            <h3 className={`text-sm font-semibold ${config.titleClass}`}>{item.title}</h3>
            <p className="mt-0.5 text-xs leading-relaxed text-text-tertiary">{item.description}</p>
          </div>

          {/* Right: capability objectives */}
          <div className="mt-3 shrink-0 md:mt-0 md:w-40">
            <p className="mb-2 text-xs text-text-muted">能力目标</p>
            <div className="space-y-1.5">
              {item.objectives.map((objective, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-text-secondary">
                  <Icon
                    name="CircleCheck"
                    size="xs"
                    className={`shrink-0 ${config.objectiveIconClass}`}
                  />
                  <span>{objective}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TimelineSection({ child }: { child: Child }) {
  const timeline = getStrategicTimeline(child);

  if (timeline.length === 0) {
    return (
      <GlassCard className="h-full p-6">
        <div className="mb-4 flex items-center gap-2">
          <Icon name="TrendingUp" size="md" className="text-primary" />
          <h2 className="font-display text-base font-bold">升学时间轴</h2>
        </div>
        <EmptyState
          icon="CalendarDays"
          title="暂无时间轴数据"
          description="当前阶段还没有配置详细的升学里程碑"
        />
      </GlassCard>
    );
  }

  return (
    <GlassCard className="h-full p-5 sm:p-6">
      <div className="mb-6 flex items-center gap-2">
        <Icon name="TrendingUp" size="md" className="text-primary" />
        <h2 className="font-display text-base font-bold">升学时间轴</h2>
        <span className="ml-auto text-xs text-text-tertiary">
          {timeline.filter((t) => t.status === 'past').length} 个已过 /{' '}
          {timeline.filter((t) => t.status === 'future').length} 个待完成
        </span>
      </div>

      <div className="pl-1">
        {timeline.map((item, index) => (
          <TimelineNode key={item.id} item={item} isLast={index === timeline.length - 1} />
        ))}
      </div>
    </GlassCard>
  );
}

const riskConfig: Record<RiskLevel, { label: string; badgeClass: string; iconClass: string }> = {
  high: {
    label: '高风险',
    badgeClass: 'bg-error/10 text-error border border-error/20',
    iconClass: 'text-error',
  },
  medium: {
    label: '中风险',
    badgeClass: 'bg-warning/10 text-warning border border-warning/20',
    iconClass: 'text-warning',
  },
  low: {
    label: '低风险',
    badgeClass: 'bg-success/10 text-success border border-success/20',
    iconClass: 'text-success',
  },
};

function UpcomingMilestonesCard({ child }: { child: Child }) {
  const milestones = getUpcomingMilestones(child, 3);

  return (
    <GlassCard className="h-full p-5 sm:p-6">
      <div className="mb-4 flex items-center gap-2">
        <Icon name="CircleAlert" size="md" className="text-warning" />
        <h2 className="font-display text-base font-bold">关键节点预警</h2>
      </div>

      {milestones.length === 0 ? (
        <EmptyState scene="no-data" size="sm" />
      ) : (
        <div className="space-y-3">
          {milestones.map((milestone, index) => {
            const risk = riskConfig[milestone.risk];
            return (
              <div
                key={milestone.id}
                className="rounded-[14px] border border-border-default bg-surface p-3.5"
              >
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-surface-hover px-1.5 py-0.5 text-2xs font-medium text-text-tertiary">
                      #{index + 1}
                    </span>
                    <span className="text-xs text-text-tertiary">{milestone.time}</span>
                  </div>
                  <span
                    className={`rounded-lg px-2 py-0.5 text-2xs font-medium ${risk.badgeClass}`}
                  >
                    {risk.label}
                  </span>
                </div>
                <h3 className="mb-1 text-sm font-semibold text-text-secondary">
                  {milestone.title}
                </h3>
                <p className="mb-2 text-xs leading-relaxed text-text-tertiary">
                  {milestone.riskReason}
                </p>
                <div className="flex items-start gap-1.5 text-xs">
                  <Icon
                    name="CircleAlert"
                    size="xs"
                    className={`mt-0.5 shrink-0 ${risk.iconClass}`}
                  />
                  <span className="text-text-secondary">{milestone.suggestedAction}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </GlassCard>
  );
}

function AIStrategyCard({
  child,
  completionRate,
}: {
  child: Child;
  completionRate: number | null;
}) {
  const advice = generateStrategicAdvice(
    child,
    completionRate !== null
      ? ({ completionRate, total: 1, done: 0, skipped: 0, pending: 0 } as ReturnType<
          typeof getPlanStats
        >)
      : null
  );

  return (
    <GlassCard strength="subtle" className="h-full p-5 sm:p-6">
      <div className="mb-4 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Icon name="Sparkles" size="md" animate="pulse" className="text-secondary" />
          <h2 className="font-display text-base font-bold">AI 战略建议</h2>
        </div>
        <span className="text-2xs text-text-muted">基于当前数据分析</span>
      </div>

      <div className="space-y-4">
        <div>
          <div className="mb-1.5 flex items-center gap-2">
            <Icon name="Lightbulb" size="sm" className="text-secondary" />
            <h3 className="text-xs font-semibold text-text-secondary">当前判断</h3>
          </div>
          <p className="pl-6 text-xs leading-relaxed text-text-tertiary">
            {advice.currentJudgment}
          </p>
        </div>

        <div>
          <div className="mb-1.5 flex items-center gap-2">
            <Icon name="Target" size="sm" className="text-secondary" />
            <h3 className="text-xs font-semibold text-text-secondary">重点关注</h3>
          </div>
          <ol className="space-y-1 pl-6">
            {advice.focusAreas.map((area, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs text-text-tertiary">
                <span className="shrink-0 font-medium text-secondary">{idx + 1}</span>
                <span>{area}</span>
              </li>
            ))}
          </ol>
        </div>

        <div>
          <div className="mb-1.5 flex items-center gap-2">
            <Icon name="Calendar" size="sm" className="text-secondary" />
            <h3 className="text-xs font-semibold text-text-secondary">未来 90 天目标</h3>
          </div>
          <ul className="space-y-1 pl-6">
            {advice.next90DaysGoals.map((goal, idx) => (
              <li key={idx} className="flex items-center gap-2 text-xs text-text-tertiary">
                <Icon name="CircleCheck" size="xs" className="text-secondary/70 shrink-0" />
                <span>{goal}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </GlassCard>
  );
}

function OverviewChildCard({
  child,
  onSelect,
  getWeeklyPlan,
}: {
  child: Child;
  onSelect: () => void;
  getWeeklyPlan: ReturnType<typeof useChildren>['getWeeklyPlan'];
}) {
  const router = useRouter();
  const routeSummary = getRouteSummary(child);
  const upcoming = getUpcomingMilestones(child, 1);
  const completionRate = getCompletionRate(child, getWeeklyPlan);
  const advice = generateStrategicAdvice(child);

  return (
    <GlassCard hover onClick={onSelect} className="h-full p-6">
      <div className="mb-4 flex items-start gap-4">
        <ChildAvatar child={child} size="xl" shape="rounded" />
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center gap-2">
            <h3 className="truncate font-display text-lg font-bold text-text-primary">
              {child.name}
            </h3>
            <DataBadge variant="primary" size="sm">
              {gradeToStage(child.grade, child.educationSystem)}
            </DataBadge>
          </div>
          <p className="truncate text-sm text-text-tertiary">
            {gradeLabel(child.grade, child.educationSystem)}
            {child.targetSchool ? ` · 目标 ${child.targetSchool}` : ''}
          </p>
        </div>
        <Icon name="ChevronRight" size="md" className="shrink-0 text-text-muted" />
      </div>

      <div className="mb-4 space-y-2">
        <div className="flex items-center justify-between rounded-lg bg-surface px-3 py-2">
          <span className="text-xs text-text-tertiary">当前路线</span>
          <span className="max-w-[60%] truncate text-sm font-medium text-text-secondary">
            {routeSummary.name}
          </span>
        </div>

        {upcoming[0] && (
          <div className="bg-warning/[0.06] flex items-start gap-2 rounded-lg px-3 py-2">
            <Icon name="CircleAlert" size="sm" className="mt-0.5 shrink-0 text-warning" />
            <div className="min-w-0">
              <p className="text-xs font-medium text-warning">下一个节点：{upcoming[0].time}</p>
              <p className="truncate text-sm text-text-secondary">{upcoming[0].title}</p>
            </div>
          </div>
        )}

        {completionRate !== null && (
          <div className="flex items-center justify-between rounded-lg bg-surface px-3 py-2">
            <span className="text-xs text-text-tertiary">本周完成率</span>
            <span className="text-sm font-bold tabular-nums text-text-primary">
              {completionRate}%
            </span>
          </div>
        )}
      </div>

      <div className="mb-4 rounded-[14px] border border-border-ai bg-surface px-3 py-2">
        <p className="mb-1 text-xs font-medium text-secondary">AI 战略提示</p>
        <p className="line-clamp-2 text-xs leading-relaxed text-text-tertiary">
          {advice.currentJudgment}
        </p>
      </div>

      <div className="flex gap-2">
        <Button
          onClick={(e) => {
            e.stopPropagation();
            router.push('/dashboard/plan');
          }}
          variant="ghost"
          className="bg-primary/[0.10] hover:bg-primary/[0.15] flex-1 rounded-lg py-2 text-xs font-semibold text-primary transition-all"
        >
          路线
        </Button>
        <Button
          onClick={(e) => {
            e.stopPropagation();
            router.push('/dashboard/weekly');
          }}
          variant="secondary"
          size="sm"
          className="flex-1 rounded-lg bg-surface py-2 text-xs font-semibold text-text-secondary transition-all hover:bg-surface-hover hover:text-text-primary"
        >
          周计划
        </Button>
      </div>
    </GlassCard>
  );
}

export default function DashboardPage() {
  const shouldReduceMotion = useReducedMotion();
  const { children, currentChild, setCurrentChildId, getWeeklyPlan } = useChildren();
  const [viewMode, setViewMode] = useState<ViewMode>('command');

  const canOverview = children.length >= 2;
  const completionRate = currentChild ? getCompletionRate(currentChild, getWeeklyPlan) : null;

  const handleSelectChild = (id: string) => {
    setCurrentChildId(id);
    setViewMode('command');
  };

  if (children.length === 0) {
    return <ChildEmptyState description="添加孩子后，这里会显示每个孩子的升学规划总览" />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <SlideUp
        distance={8}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 border-primary/20 flex size-10 items-center justify-center rounded-[14px] border">
            <Icon name="LayoutGrid" size="md" className="text-primary" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold sm:text-3xl">升学规划中心</h1>
          </div>
        </div>

        {canOverview && (
          <div className="flex items-center gap-2">
            <ViewToggle mode={viewMode} onChange={setViewMode} />
          </div>
        )}
      </SlideUp>

      {/* Overview mode */}
      {viewMode === 'overview' && (
        <StaggerContainer className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {children.map((child) => (
            <StaggerItem key={child.id}>
              <OverviewChildCard
                child={child}
                onSelect={() => handleSelectChild(child.id)}
                getWeeklyPlan={getWeeklyPlan}
              />
            </StaggerItem>
          ))}
        </StaggerContainer>
      )}

      {/* Command mode */}
      {viewMode === 'command' && currentChild && (
        <>
          <SlideUp>
            <IdentityCard child={currentChild} completionRate={completionRate} />
          </SlideUp>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
            <SlideUp delay={0.05} className="xl:col-span-2">
              <TimelineSection child={currentChild} />
            </SlideUp>

            <StaggerContainer delayChildren={0.1} className="space-y-6">
              <StaggerItem>
                <UpcomingMilestonesCard child={currentChild} />
              </StaggerItem>
              <StaggerItem>
                <AIStrategyCard child={currentChild} completionRate={completionRate} />
              </StaggerItem>
            </StaggerContainer>
          </div>
        </>
      )}
    </div>
  );
}
