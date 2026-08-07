'use client';

import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  LayoutGrid,
  User,
  Target,
  Sparkles,
  MapPin,
  AlertCircle,
  CalendarDays,
  Route,
  TrendingUp,
  CheckCircle2,
  Circle,
  Flame,
  ChevronRight,
  Plus,
  HelpCircle,
  School,
  Flag,
  Compass,
  TrendingUpIcon,
  ListChecks,
  Calendar,
  Lightbulb,
} from 'lucide-react';
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
import ChildModal from '@/components/dashboard/ChildModal';
import CommandCard from '@/components/ui/CommandCard';
import DataBadge from '@/components/ui/DataBadge';
import EmptyState from '@/components/ui/EmptyState';
import GaugeChart from '@/components/ui/GaugeChart';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },
};

type ViewMode = 'command' | 'overview';

function getCompletionRate(child: Child, getWeeklyPlan: ReturnType<typeof useChildren>['getWeeklyPlan']) {
  const plan = getWeeklyPlan(getCurrentWeekId(), child.id);
  if (!plan) return null;
  return getPlanStats(plan).completionRate;
}

function ViewToggle({
  mode,
  onChange,
}: {
  mode: ViewMode;
  onChange: (mode: ViewMode) => void;
}) {
  return (
    <div className="flex items-center gap-1 rounded-[14px] bg-surface border border-border-default p-1">
      <button
        onClick={() => onChange('command')}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
          mode === 'command'
            ? 'bg-primary/[0.10] text-primary'
            : 'text-text-tertiary hover:text-text-secondary'
        }`}
      >
        <User className="w-4 h-4" />
        当前孩子
      </button>
      <button
        onClick={() => onChange('overview')}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
          mode === 'overview'
            ? 'bg-primary/[0.10] text-primary'
            : 'text-text-tertiary hover:text-text-secondary'
        }`}
      >
        <LayoutGrid className="w-4 h-4" />
        全家总览
      </button>
    </div>
  );
}

function IdentityCard({
  child,
  completionRate,
}: {
  child: Child;
  completionRate: number | null;
}) {
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
      icon: School,
      label: '目标学校',
      value: primaryTarget,
      sub: backupTargets || routeSummary.name,
    },
    {
      icon: Flag,
      label: '当前阶段',
      value: '基础能力构建期',
      sub: '夯实基础，稳步提升',
    },
    {
      icon: Compass,
      label: '路线方向',
      value: routeSummary.direction,
      sub: routeSummary.directionDetail,
    },
  ];

  return (
    <CommandCard active className="p-5 sm:p-6">
      <div className="flex flex-col xl:flex-row xl:items-stretch gap-6">
        {/* Left column: header + metrics + footer */}
        <div className="flex-1 min-w-0 flex flex-col">
          {/* Header row */}
          <div className="flex items-start gap-4 mb-5">
            <ChildAvatar child={child} size="2xl" shape="rounded" />
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <h2 className="text-xl sm:text-2xl font-bold font-display text-text-primary">
                  {child.name}
                </h2>
                <DataBadge variant="primary" size="sm">
                  {gradeToStage(child.grade, child.educationSystem)}
                </DataBadge>
                <DataBadge variant={routeSummary.type === 'primary' ? 'default' : 'secondary'} size="sm">
                  {routeSummary.type === 'primary' ? '主路线' : '备选路线'}
                </DataBadge>
              </div>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-text-secondary">
                <span>{gradeLabel(child.grade, child.educationSystem)}</span>
                <span className="text-border-strong">·</span>
                <span className="truncate">嘉定区重点冲刺</span>
                {child.targetSchool && (
                  <>
                    <span className="text-border-strong hidden sm:inline">·</span>
                    <span className="text-primary truncate">目标 {child.targetSchool}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Metrics row */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3 min-h-[112px]">
            {metrics.map((metric) => (
              <div
                key={metric.label}
                className="rounded-[14px] bg-surface border border-border-default p-4 h-full flex flex-col"
              >
                <div className="flex items-center gap-1.5 mb-2">
                  <metric.icon className="w-3.5 h-3.5 text-text-muted" />
                  <span className="text-2xs text-text-muted">{metric.label}</span>
                </div>
                <p className="text-base font-semibold text-text-primary truncate mb-0.5">
                  {metric.value}
                </p>
                <p className="text-xs text-text-tertiary truncate mt-auto">{metric.sub}</p>
              </div>
            ))}
          </div>

          {/* Footer buttons */}
          <div className="mt-5 pt-5 border-t border-border-default flex flex-wrap gap-2">
            <button
              onClick={() => router.push('/dashboard/plan')}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-surface text-xs font-medium text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-all"
            >
              <Route className="w-4 h-4" />
              路线方案
            </button>
            <button
              onClick={() => router.push('/dashboard/weekly')}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-surface text-xs font-medium text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-all"
            >
              <CalendarDays className="w-4 h-4" />
              周计划
            </button>
            <button
              onClick={() => router.push('/dashboard/ai')}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-surface text-xs font-medium text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-all"
            >
              <Sparkles className="w-4 h-4" />
              AI 诊断
            </button>
          </div>
        </div>

        {/* Right column: match gauge */}
        <div className="shrink-0 flex flex-col items-center justify-center min-w-[160px] xl:border-l xl:border-border-default xl:pl-8 pt-6 xl:pt-0 border-t xl:border-t-0 border-border-default">
          <div className="flex items-center gap-1.5 mb-4">
            <span className="text-xs text-text-tertiary">路线匹配度</span>
            <HelpCircle className="w-3.5 h-3.5 text-text-muted" />
          </div>
          <GaugeChart value={matchSnapshot.probability} size={132} strokeWidth={11} />
          <div className="flex items-center gap-1.5 mt-4 text-xs">
            <TrendingUpIcon className="w-4 h-4 text-primary" />
            <span className="text-primary font-medium">
              较上次提升 {matchSnapshot.change > 0 ? '+' : ''}
              {matchSnapshot.change}%
            </span>
          </div>
          <p className="text-xs text-text-tertiary mt-2 leading-relaxed">
            距离目标还有 {matchSnapshot.remaining}% 提升空间
          </p>
        </div>
      </div>
    </CommandCard>
  );
}

function TimelineNode({ item, isLast }: { item: TimelineItem; isLast: boolean }) {
  const statusConfig = {
    past: {
      icon: CheckCircle2,
      dotClass: 'bg-surface border border-success/40',
      iconClass: 'text-success',
      lineClass: 'bg-border-default',
      badgeClass: 'bg-surface text-success border border-success/20',
      titleClass: 'text-text-secondary',
      objectiveIconClass: 'text-success/70',
    },
    current: {
      icon: Flame,
      dotClass: 'bg-primary/15 border border-primary/40 shadow-[0_0_16px_var(--shadow-primary)]',
      iconClass: 'text-primary',
      lineClass: 'bg-border-default',
      badgeClass: 'bg-primary/10 text-primary border border-primary/20',
      titleClass: 'text-text-primary',
      objectiveIconClass: 'text-primary/70',
    },
    future: {
      icon: Circle,
      dotClass: 'bg-surface border border-border-default',
      iconClass: 'text-text-muted',
      lineClass: 'bg-border-default',
      badgeClass: 'bg-surface text-text-tertiary border border-border-default',
      titleClass: 'text-text-secondary',
      objectiveIconClass: 'text-text-muted',
    },
  };

  const config = statusConfig[item.status];
  const Icon = config.icon;

  return (
    <div className="relative flex gap-4">
      {!isLast && (
        <div
          className={`absolute left-[13px] top-8 w-px h-[calc(100%-16px)] ${config.lineClass}`}
        />
      )}

      <div className="flex flex-col items-center shrink-0 pt-1">
        <div
          className={`relative z-10 w-7 h-7 rounded-full flex items-center justify-center ${config.dotClass}`}
        >
          <Icon className={`w-4 h-4 ${config.iconClass}`} />
        </div>
      </div>

      <div className="flex-1 pb-6 min-w-0">
        <div className="flex flex-col md:flex-row md:gap-6">
          {/* Left: timeline header + description */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className={`text-2xs font-medium px-2 py-0.5 rounded-lg ${config.badgeClass}`}>
                {item.time}
              </span>
              {item.status === 'current' && (
                <span className="text-2xs font-medium text-primary">当前重点</span>
              )}
            </div>
            <h3 className={`text-sm font-semibold ${config.titleClass}`}>{item.title}</h3>
            <p className="text-xs text-text-tertiary mt-0.5 leading-relaxed">{item.description}</p>
          </div>

          {/* Right: capability objectives */}
          <div className="mt-3 md:mt-0 md:w-40 shrink-0">
            <p className="text-xs text-text-muted mb-2">能力目标</p>
            <div className="space-y-1.5">
              {item.objectives.map((objective, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-text-secondary">
                  <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 ${config.objectiveIconClass}`} />
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
      <CommandCard className="p-6 h-full">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-primary" />
          <h2 className="text-base font-bold font-display">升学时间轴</h2>
        </div>
        <EmptyState
          icon={CalendarDays}
          title="暂无时间轴数据"
          description="当前阶段还没有配置详细的升学里程碑"
        />
      </CommandCard>
    );
  }

  return (
    <CommandCard className="p-5 sm:p-6 h-full">
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="w-5 h-5 text-primary" />
        <h2 className="text-base font-bold font-display">升学时间轴</h2>
        <span className="ml-auto text-xs text-text-tertiary">
          {timeline.filter((t) => t.status === 'past').length} 个已过 / {' '}
          {timeline.filter((t) => t.status === 'future').length} 个待完成
        </span>
      </div>

      <div className="pl-1">
        {timeline.map((item, index) => (
          <TimelineNode
            key={item.id}
            item={item}
            isLast={index === timeline.length - 1}
          />
        ))}
      </div>
    </CommandCard>
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
    <CommandCard className="p-5 sm:p-6 h-full">
      <div className="flex items-center gap-2 mb-4">
        <AlertCircle className="w-5 h-5 text-warning" />
        <h2 className="text-base font-bold font-display">关键节点预警</h2>
      </div>

      {milestones.length === 0 ? (
        <div className="text-center py-8 text-sm text-text-tertiary">
          暂无即将到来的关键节点
        </div>
      ) : (
        <div className="space-y-3">
          {milestones.map((milestone, index) => {
            const risk = riskConfig[milestone.risk];
            return (
              <div
                key={milestone.id}
                className="p-3.5 rounded-[14px] bg-surface border border-border-default"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xs font-medium px-1.5 py-0.5 rounded bg-surface-hover text-text-tertiary">
                      #{index + 1}
                    </span>
                    <span className="text-xs text-text-tertiary">{milestone.time}</span>
                  </div>
                  <span className={`text-2xs font-medium px-2 py-0.5 rounded-lg ${risk.badgeClass}`}>
                    {risk.label}
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-text-secondary mb-1">{milestone.title}</h3>
                <p className="text-xs text-text-tertiary leading-relaxed mb-2">
                  {milestone.riskReason}
                </p>
                <div className="flex items-start gap-1.5 text-xs">
                  <AlertCircle className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${risk.iconClass}`} />
                  <span className="text-text-secondary">{milestone.suggestedAction}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </CommandCard>
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
      ? ({ completionRate, total: 1, done: 0, skipped: 0, pending: 0 } as ReturnType<typeof getPlanStats>)
      : null
  );

  return (
    <CommandCard className="p-5 sm:p-6 h-full">
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-secondary" />
          <h2 className="text-base font-bold font-display">AI 战略建议</h2>
        </div>
        <span className="text-2xs text-text-muted">基于当前数据分析</span>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Lightbulb className="w-4 h-4 text-secondary" />
            <h3 className="text-xs font-semibold text-text-secondary">当前判断</h3>
          </div>
          <p className="text-xs text-text-tertiary leading-relaxed pl-6">{advice.currentJudgment}</p>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Target className="w-4 h-4 text-secondary" />
            <h3 className="text-xs font-semibold text-text-secondary">重点关注</h3>
          </div>
          <ol className="space-y-1 pl-6">
            {advice.focusAreas.map((area, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs text-text-tertiary">
                <span className="text-secondary font-medium shrink-0">{idx + 1}</span>
                <span>{area}</span>
              </li>
            ))}
          </ol>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Calendar className="w-4 h-4 text-secondary" />
            <h3 className="text-xs font-semibold text-text-secondary">未来 90 天目标</h3>
          </div>
          <ul className="space-y-1 pl-6">
            {advice.next90DaysGoals.map((goal, idx) => (
              <li key={idx} className="flex items-center gap-2 text-xs text-text-tertiary">
                <CheckCircle2 className="w-3.5 h-3.5 text-secondary/70 shrink-0" />
                <span>{goal}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </CommandCard>
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
    <CommandCard hover onClick={onSelect} className="p-6 h-full">
      <div className="flex items-start gap-4 mb-4">
        <ChildAvatar child={child} size="xl" shape="rounded" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-bold font-display text-text-primary truncate">
              {child.name}
            </h3>
            <DataBadge variant="primary" size="sm">
              {gradeToStage(child.grade, child.educationSystem)}
            </DataBadge>
          </div>
          <p className="text-sm text-text-tertiary truncate">
            {gradeLabel(child.grade, child.educationSystem)}
            {child.targetSchool ? ` · 目标 ${child.targetSchool}` : ''}
          </p>
        </div>
        <ChevronRight className="w-5 h-5 text-text-muted shrink-0" />
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-surface">
          <span className="text-xs text-text-tertiary">当前路线</span>
          <span className="text-sm font-medium text-text-secondary truncate max-w-[60%]">
            {routeSummary.name}
          </span>
        </div>

        {upcoming[0] && (
          <div className="flex items-start gap-2 py-2 px-3 rounded-lg bg-warning/[0.06]">
            <AlertCircle className="w-4 h-4 text-warning shrink-0 mt-0.5" />
            <div className="min-w-0">
              <p className="text-xs text-warning font-medium">下一个节点：{upcoming[0].time}</p>
              <p className="text-sm text-text-secondary truncate">{upcoming[0].title}</p>
            </div>
          </div>
        )}

        {completionRate !== null && (
          <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-surface">
            <span className="text-xs text-text-tertiary">本周完成率</span>
            <span className="text-sm font-bold text-text-primary tabular-nums">
              {completionRate}%
            </span>
          </div>
        )}
      </div>

      <div className="py-2 px-3 rounded-[14px] bg-surface border border-border-ai mb-4">
        <p className="text-xs text-secondary font-medium mb-1">AI 战略提示</p>
        <p className="text-xs text-text-tertiary line-clamp-2 leading-relaxed">{advice.currentJudgment}</p>
      </div>

      <div className="flex gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            router.push('/dashboard/plan');
          }}
          className="flex-1 py-2 rounded-lg bg-primary/[0.10] text-primary text-xs font-semibold hover:bg-primary/[0.15] transition-all"
        >
          路线
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            router.push('/dashboard/weekly');
          }}
          className="flex-1 py-2 rounded-lg bg-surface text-text-secondary text-xs font-semibold hover:text-text-primary hover:bg-surface-hover transition-all"
        >
          周计划
        </button>
      </div>
    </CommandCard>
  );
}

export default function DashboardPage() {
  const shouldReduceMotion = useReducedMotion();
  const {
    children,
    currentChild,
    setCurrentChildId,
    getWeeklyPlan,
  } = useChildren();
  const [viewMode, setViewMode] = useState<ViewMode>('command');
  const [childModalOpen, setChildModalOpen] = useState(false);

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
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-[14px] bg-primary/10 border border-primary/20 flex items-center justify-center">
            <LayoutGrid className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold font-display">升学规划中心</h1>
          </div>
        </div>

        {canOverview && (
          <div className="flex items-center gap-2">
            <ViewToggle mode={viewMode} onChange={setViewMode} />
          </div>
        )}
      </motion.div>

      {/* Overview mode */}
      {viewMode === 'overview' && (
        <motion.div
          variants={containerVariants}
          initial={shouldReduceMotion ? false : 'hidden'}
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {children.map((child) => (
            <motion.div key={child.id} variants={itemVariants}>
              <OverviewChildCard
                child={child}
                onSelect={() => handleSelectChild(child.id)}
                getWeeklyPlan={getWeeklyPlan}
              />
            </motion.div>
          ))}

          <motion.button
            variants={itemVariants}
            onClick={() => setChildModalOpen(true)}
            className="rounded-[20px] border border-dashed border-border-default bg-surface/[0.5] p-6 flex flex-col items-center justify-center gap-2 text-text-tertiary hover:text-text-secondary hover:bg-surface-hover hover:border-border-strong transition-all text-sm min-h-[200px]"
          >
            <div className="w-12 h-12 rounded-[20px] bg-surface-hover border border-border-default flex items-center justify-center">
              <Plus className="w-5 h-5" />
            </div>
            <span className="font-medium">添加孩子</span>
          </motion.button>
        </motion.div>
      )}

      {/* Command mode */}
      {viewMode === 'command' && currentChild && (
        <>
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <IdentityCard child={currentChild} completionRate={completionRate} />
          </motion.div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="xl:col-span-2"
            >
              <TimelineSection child={currentChild} />
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial={shouldReduceMotion ? false : 'hidden'}
              animate="visible"
              className="space-y-6"
            >
              <motion.div variants={itemVariants}>
                <UpcomingMilestonesCard child={currentChild} />
              </motion.div>
              <motion.div variants={itemVariants}>
                <AIStrategyCard
                  child={currentChild}
                  completionRate={completionRate}
                />
              </motion.div>
            </motion.div>
          </div>
        </>
      )}

      <ChildModal isOpen={childModalOpen} onClose={() => setChildModalOpen(false)} />
    </div>
  );
}
