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
  Clock,
  ChevronRight,
  Plus,
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
  type TimelineItem,
} from '@/lib/dashboard';
import ChildAvatar from '@/components/dashboard/ChildAvatar';
import ChildEmptyState from '@/components/dashboard/ChildEmptyState';
import ChildModal from '@/components/dashboard/ChildModal';
import CommandCard from '@/components/ui/CommandCard';
import DataBadge from '@/components/ui/DataBadge';
import EmptyState from '@/components/ui/EmptyState';

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
    <div className="flex items-center gap-1 rounded-xl bg-surface-elevated border border-border-subtle p-1">
      <button
        onClick={() => onChange('command')}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
          mode === 'command'
            ? 'bg-primary/[0.10] text-primary'
            : 'text-text-tertiary hover:text-text-secondary'
        }`}
      >
        <User className="w-3.5 h-3.5" />
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
        <LayoutGrid className="w-3.5 h-3.5" />
        全家总览
      </button>
    </div>
  );
}

function IdentityCard({ child }: { child: Child }) {
  const router = useRouter();
  const routeSummary = getRouteSummary(child);

  return (
    <CommandCard active corner className="p-5 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-6">
        <ChildAvatar child={child} size="2xl" shape="rounded" />

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
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
            <span className="truncate">{routeSummary.name}</span>
            {child.targetSchool && (
              <>
                <span className="text-border-strong hidden sm:inline">·</span>
                <span className="text-primary truncate">目标 {child.targetSchool}</span>
              </>
            )}
          </div>

          <p className="mt-2 text-sm text-text-tertiary leading-relaxed line-clamp-2">
            {routeSummary.description}
          </p>
        </div>

        <div className="flex items-center gap-3 sm:text-right shrink-0">
          <div>
            <p className="text-2xs text-text-muted mb-0.5 uppercase tracking-wider">路线匹配度</p>
            <p className="text-3xl font-bold font-display tabular-nums text-text-primary">
              {routeSummary.probability}
              <span className="text-lg text-text-tertiary ml-0.5">%</span>
            </p>
          </div>
        </div>
      </div>

      <div className="mt-5 pt-5 border-t border-border-subtle flex flex-wrap gap-2">
        <button
          onClick={() => router.push('/dashboard/plan')}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-surface-elevated text-xs font-medium text-text-secondary hover:text-text-primary hover:bg-surface-highlight transition-all"
        >
          <Route className="w-3.5 h-3.5" />
          路线方案
        </button>
        <button
          onClick={() => router.push('/dashboard/weekly')}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-surface-elevated text-xs font-medium text-text-secondary hover:text-text-primary hover:bg-surface-highlight transition-all"
        >
          <CalendarDays className="w-3.5 h-3.5" />
          周计划
        </button>
        <button
          onClick={() => router.push('/dashboard/ai')}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-surface-elevated text-xs font-medium text-text-secondary hover:text-text-primary hover:bg-surface-highlight transition-all"
        >
          <Sparkles className="w-3.5 h-3.5" />
          AI 诊断
        </button>
      </div>
    </CommandCard>
  );
}

function TimelineNode({ item, isLast }: { item: TimelineItem; isLast: boolean }) {
  const statusConfig = {
    past: {
      icon: CheckCircle2,
      dotClass: 'bg-text-muted',
      textClass: 'text-text-tertiary',
      lineClass: 'bg-border-default',
    },
    current: {
      icon: MapPin,
      dotClass: 'bg-primary',
      textClass: 'text-text-primary',
      lineClass: 'bg-primary/25',
    },
    future: {
      icon: Circle,
      dotClass: 'bg-surface-elevated border border-border-strong',
      textClass: 'text-text-secondary',
      lineClass: 'bg-border-default',
    },
  };

  const config = statusConfig[item.status];
  const Icon = config.icon;

  return (
    <div className="relative flex gap-4">
      {!isLast && (
        <div
          className={`absolute left-[11px] top-7 w-px h-[calc(100%-14px)] ${config.lineClass}`}
        />
      )}

      <div
        className={`relative z-10 w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${config.dotClass}`}
      >
        <Icon className={`w-3 h-3 ${item.status === 'current' ? 'text-white' : item.status === 'past' ? 'text-surface' : 'text-text-tertiary'}`} />
      </div>

      <div className="flex-1 pb-6 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <span className={`text-2xs font-medium px-2 py-0.5 rounded-md bg-surface-elevated ${config.textClass}`}>
            {item.time}
          </span>
          {item.status === 'current' && (
            <span className="text-2xs font-medium text-primary">当前节点</span>
          )}
        </div>
        <h3 className={`text-sm font-semibold ${config.textClass}`}>{item.title}</h3>
        <p className="text-sm text-text-tertiary mt-0.5 leading-relaxed">{item.description}</p>
        {item.fallback && (
          <p className="text-xs text-warning mt-2 bg-warning/[0.06] rounded-lg px-3 py-2">
            {item.fallback}
          </p>
        )}
      </div>
    </div>
  );
}

function TimelineSection({ child }: { child: Child }) {
  const timeline = getStrategicTimeline(child);

  if (timeline.length === 0) {
    return (
      <CommandCard className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-4 h-4 text-primary" />
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
    <CommandCard className="p-5">
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="w-4 h-4 text-primary" />
        <h2 className="text-base font-bold font-display">升学时间轴</h2>
        <span className="ml-auto text-xs text-text-tertiary">
          {timeline.filter((t) => t.status === 'past').length} 个已过 /{' '}
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

function UpcomingMilestonesCard({ child }: { child: Child }) {
  const milestones = getUpcomingMilestones(child, 3);

  return (
    <CommandCard className="p-5 h-full">
      <div className="flex items-center gap-2 mb-4">
        <AlertCircle className="w-4 h-4 text-warning" />
        <h2 className="text-base font-bold font-display">关键节点预警</h2>
      </div>

      {milestones.length === 0 ? (
        <div className="text-center py-8 text-sm text-text-tertiary">
          暂无即将到来的关键节点
        </div>
      ) : (
        <div className="space-y-2">
          {milestones.map((milestone, index) => (
            <div
              key={milestone.id}
              className="p-3 rounded-xl bg-surface-elevated hover:bg-surface-highlight transition-colors"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-2xs font-medium px-1.5 py-0.5 rounded bg-warning/[0.10] text-warning">
                  #{index + 1}
                </span>
                <span className="text-xs text-text-tertiary">{milestone.time}</span>
              </div>
              <h3 className="text-sm font-semibold text-text-secondary">{milestone.title}</h3>
              <p className="text-xs text-text-tertiary mt-0.5 line-clamp-2 leading-relaxed">
                {milestone.description}
              </p>
            </div>
          ))}
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
    <CommandCard className="p-5 h-full">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-4 h-4 text-primary" />
        <h2 className="text-base font-bold font-display">AI 战略建议</h2>
      </div>

      <p className="text-sm text-text-secondary leading-relaxed">{advice}</p>

      {completionRate !== null && (
        <div className="mt-4 pt-4 border-t border-border-subtle">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-text-tertiary">本周执行节奏</span>
            <span className="text-text-secondary font-medium tabular-nums">{completionRate}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-surface-elevated overflow-hidden">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>
      )}
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
    <CommandCard hover onClick={onSelect} className="p-5 h-full">
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
        <div className="flex items-center justify-between py-2 px-3 rounded-xl bg-surface-elevated">
          <span className="text-xs text-text-tertiary">当前路线</span>
          <span className="text-sm font-medium text-text-secondary truncate max-w-[60%]">
            {routeSummary.name}
          </span>
        </div>

        {upcoming[0] && (
          <div className="flex items-start gap-2 py-2 px-3 rounded-xl bg-warning/[0.06]">
            <Clock className="w-4 h-4 text-warning shrink-0 mt-0.5" />
            <div className="min-w-0">
              <p className="text-xs text-warning font-medium">下一个节点：{upcoming[0].time}</p>
              <p className="text-sm text-text-secondary truncate">{upcoming[0].title}</p>
            </div>
          </div>
        )}

        {completionRate !== null && (
          <div className="flex items-center justify-between py-2 px-3 rounded-xl bg-surface-elevated">
            <span className="text-xs text-text-tertiary">本周完成率</span>
            <span className="text-sm font-bold text-text-primary tabular-nums">
              {completionRate}%
            </span>
          </div>
        )}
      </div>

      <div className="py-2 px-3 rounded-xl bg-surface-elevated mb-4">
        <p className="text-xs text-primary font-medium mb-1">AI 战略提示</p>
        <p className="text-xs text-text-tertiary line-clamp-2 leading-relaxed">{advice}</p>
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
          className="flex-1 py-2 rounded-lg bg-surface-elevated text-text-secondary text-xs font-semibold hover:text-text-primary hover:bg-surface-highlight transition-all"
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
          <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
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
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
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
            className="rounded-2xl border border-dashed border-border-default bg-surface/[0.5] p-5 flex flex-col items-center justify-center gap-2 text-text-tertiary hover:text-text-secondary hover:bg-surface-light hover:border-border-strong transition-all text-sm min-h-[200px]"
          >
            <div className="w-12 h-12 rounded-xl bg-surface-light border border-border-default flex items-center justify-center">
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
            <IdentityCard child={currentChild} />
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="lg:col-span-2"
            >
              <TimelineSection child={currentChild} />
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial={shouldReduceMotion ? false : 'hidden'}
              animate="visible"
              className="space-y-4"
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
