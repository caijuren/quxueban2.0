'use client';

import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  Target,
  Calendar,
  TrendingUp,
  School,
  Users,
  Plus,
  Sparkles,
  ArrowRight,
  LayoutGrid,
  User,
  CheckCircle2,
  Circle,
  BookOpen,
  Calculator,
  Languages,
  Backpack,
  Dumbbell,
  Palette,
  GraduationCap,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useChildren } from '@/components/dashboard/ChildrenContext';
import { Child, gradeLabel, gradeToStage, getInitials } from '@/lib/children';
import { getRouteById } from '@/lib/plans';
import {
  getCurrentWeekId,
  getPlanStats,
  generateAiReview,
  getTodayName,
  toggleTaskStatus,
} from '@/lib/weeklyTasks';
import { TASK_CATEGORY_LABELS } from '@/lib/taskTemplates';
import { getCategoryColorClass } from '@/lib/taskAlignment';
import { TaskCategory } from '@/lib/storage.types';
import EmptyState from '@/components/ui/EmptyState';
import CommandCard from '@/components/ui/CommandCard';
import MetricRing from '@/components/ui/MetricRing';
import DataBadge from '@/components/ui/DataBadge';
import ProgressPanel from '@/components/dashboard/ProgressPanel';

const categoryIcons: Record<TaskCategory, typeof BookOpen> = {
  chinese: BookOpen,
  math: Calculator,
  english: Languages,
  school: Backpack,
  reading: BookOpen,
  sport: Dumbbell,
  interest: Palette,
  other: GraduationCap,
};

const allCategories: TaskCategory[] = [
  'chinese',
  'math',
  'english',
  'school',
  'reading',
  'sport',
  'interest',
  'other',
];

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

type ViewMode = 'detail' | 'overview';

function getChildSnapshot(childId: string, getWeeklyPlan: ReturnType<typeof useChildren>['getWeeklyPlan']) {
  const currentWeekPlan = getWeeklyPlan(getCurrentWeekId(), childId);
  const weeklyStats = currentWeekPlan ? getPlanStats(currentWeekPlan) : null;
  const todayName = getTodayName();
  const todayTasks = currentWeekPlan?.tasks.filter((t) => t.day === todayName) ?? [];
  const pendingToday = todayTasks.filter((t) => t.status !== 'done').length;

  return {
    completionRate: weeklyStats?.completionRate ?? 0,
    todayPending: pendingToday,
    todayTotal: todayTasks.length,
    weeklyDone: weeklyStats?.done ?? 0,
    weeklyTotal: weeklyStats?.total ?? 0,
  };
}

function ChildSwitchCard({
  child,
  isActive,
  onClick,
  getWeeklyPlan,
}: {
  child: Child;
  isActive: boolean;
  onClick: () => void;
  getWeeklyPlan: ReturnType<typeof useChildren>['getWeeklyPlan'];
}) {
  const stage = gradeToStage(child.grade);
  const snapshot = getChildSnapshot(child.id, getWeeklyPlan);
  const hasTodayTasks = snapshot.todayTotal > 0;

  return (
    <CommandCard active={isActive} hover onClick={onClick} className="p-4 h-full">
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-text-primary text-sm font-bold shrink-0"
          style={{
            background: `linear-gradient(135deg, ${child.avatarColor}, ${child.avatarColor}88)`,
          }}
        >
          {getInitials(child.name)}
        </div>
        <div className="flex-1 min-w-0">
          <p className={`font-semibold text-sm truncate ${isActive ? 'text-primary' : 'text-slate-800'}`}>
            {child.name}
          </p>
          <p className="text-xs text-slate-600">
            {gradeLabel(child.grade)} · {stage}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1.5 shrink-0">
          <MetricRing rate={snapshot.completionRate} size={32} strokeWidth={4} />
          {hasTodayTasks && (
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                snapshot.todayPending > 0
                  ? 'bg-warning/15 text-warning'
                  : 'bg-success/15 text-success'
              }`}
            >
              今日 {snapshot.todayPending}/{snapshot.todayTotal}
            </span>
          )}
        </div>
      </div>
    </CommandCard>
  );
}

function OverviewChildCard({
  child,
  onView,
  getWeeklyPlan,
}: {
  child: Child;
  onView: () => void;
  getWeeklyPlan: ReturnType<typeof useChildren>['getWeeklyPlan'];
}) {
  const snapshot = getChildSnapshot(child.id, getWeeklyPlan);
  const stage = gradeToStage(child.grade);
  const routeName = child.routeId
    ? getRouteById(child.routeId)?.name ?? child.routeId
    : getStageRoute(stage).name;

  return (
    <CommandCard className="p-5">
      <div className="flex items-start gap-4 mb-5">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-text-primary font-bold text-lg shrink-0"
          style={{
            background: `linear-gradient(135deg, ${child.avatarColor}, ${child.avatarColor}88)`,
          }}
        >
          {getInitials(child.name)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-lg font-bold font-display">{child.name}</h2>
            <DataBadge variant="primary" size="sm">{stage}</DataBadge>
          </div>
          <p className="text-sm text-slate-600 truncate">
            {gradeLabel(child.grade)}
            {child.currentSchool ? ` · ${child.currentSchool}` : ''}
            {routeName ? ` · ${routeName}` : ''}
          </p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-xs text-slate-600 mb-1">本周完成率</p>
          <p className="text-xl font-bold font-display tabular-nums text-text-primary">
            {snapshot.completionRate}%
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="rounded-lg bg-black/[0.03] p-3 text-center">
          <p className="text-lg font-bold font-display text-slate-900">
            {snapshot.weeklyDone}/{snapshot.weeklyTotal}
          </p>
          <p className="text-[10px] text-slate-600 mt-0.5">本周任务</p>
        </div>
        <div className="rounded-lg bg-black/[0.03] p-3 text-center">
          <p className="text-lg font-bold font-display text-slate-900">
            {snapshot.todayPending}
          </p>
          <p className="text-[10px] text-slate-600 mt-0.5">今日待办</p>
        </div>
        <div className="rounded-lg bg-black/[0.03] p-3 text-center">
          <p className="text-lg font-bold font-display text-slate-900 truncate">
            {child.targetSchool || '未设置'}
          </p>
          <p className="text-[10px] text-slate-600 mt-0.5">目标学校</p>
        </div>
      </div>

      <button
        onClick={onView}
        className="w-full py-2 rounded-lg bg-primary/10 border border-primary/20 text-primary text-sm font-semibold hover:bg-primary/15 hover:shadow-glow-primary transition-all duration-200"
      >
        查看 {child.name} 的作战室
      </button>
    </CommandCard>
  );
}

function getStageRoute(stage: string) {
  switch (stage) {
    case '小升初':
      return { name: '三公 / 民办摇号', schools: '3 所目标校' };
    case '中考':
      return { name: '市重点 / 名额分配', schools: '4 所目标校' };
    default:
      return { name: '高考综评 / 强基', schools: '2 所目标校' };
  }
}

export default function DashboardPage() {
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();
  const {
    children,
    currentChild,
    setCurrentChildId,
    getWeeklyPlan,
    updateTaskStatus,
  } = useChildren();
  const [viewMode, setViewMode] = useState<ViewMode>('detail');

  const currentWeekPlan = currentChild
    ? getWeeklyPlan(getCurrentWeekId(), currentChild.id)
    : undefined;
  const weeklyStats = currentWeekPlan ? getPlanStats(currentWeekPlan) : null;
  const aiReview = currentChild && currentWeekPlan
    ? generateAiReview(currentWeekPlan, currentChild.name)
    : null;

  const todayName = getTodayName();
  const todayTasks = currentWeekPlan?.tasks.filter((t) => t.day === todayName) ?? [];
  const pendingTasks = currentWeekPlan?.tasks.filter((t) => t.status !== 'done') ?? [];
  const recentTasks = todayTasks.length > 0 ? todayTasks : pendingTasks.slice(0, 4);

  const completionRate = weeklyStats?.completionRate ?? 0;

  const handleViewChild = (id: string) => {
    setCurrentChildId(id);
    setViewMode('detail');
    router.push('/dashboard/plan');
  };

  const handleSwitchChild = (id: string) => {
    setCurrentChildId(id);
    setViewMode('detail');
  };

  const hasChildren = children.length > 0;
  const canOverview = children.length >= 2;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display mb-1">作战指挥中心</h1>
          <p className="text-sm text-slate-600">
            {hasChildren
              ? `监控 ${children.length} 名孩子 · 当前：${currentChild?.name || '未选择'}`
              : '请先添加孩子档案'}
          </p>
        </div>

        {canOverview && (
          <div className="flex items-center gap-1 rounded-lg bg-black/[0.03] border border-black/[0.08] p-1">
            <button
              onClick={() => setViewMode('detail')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                viewMode === 'detail'
                  ? 'bg-primary/10 text-primary'
                  : 'text-slate-600 hover:text-slate-700'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              单个详情
            </button>
            <button
              onClick={() => setViewMode('overview')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                viewMode === 'overview'
                  ? 'bg-primary/10 text-primary'
                  : 'text-slate-600 hover:text-slate-700'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              总览对比
            </button>
          </div>
        )}
      </motion.div>

      {/* Children overview */}
      {children.length === 0 ? (
        <EmptyState
          icon={Users}
          title="还没有孩子档案"
          description="添加孩子后，这里会显示每个孩子的升学阶段概览，方便快速切换"
        />
      ) : (
        <motion.div
          variants={containerVariants}
          initial={shouldReduceMotion ? false : 'hidden'}
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3"
        >
          {children.map((child) => (
            <motion.div key={child.id} variants={itemVariants}>
              <ChildSwitchCard
                child={child}
                isActive={currentChild?.id === child.id}
                onClick={() => handleSwitchChild(child.id)}
                getWeeklyPlan={getWeeklyPlan}
              />
            </motion.div>
          ))}

          <motion.button
            variants={itemVariants}
            onClick={() => router.push('/dashboard/plan')}
            className="rounded-xl border border-dashed border-black/[0.10] bg-black/[0.02] p-4 flex items-center justify-center gap-2 text-slate-600 hover:text-slate-700 hover:bg-black/[0.04] hover:border-black/[0.14] transition-all text-sm"
          >
            <Plus className="w-4 h-4" />
            <span className="font-medium">添加孩子</span>
          </motion.button>
        </motion.div>
      )}

      {/* Overview mode */}
      {viewMode === 'overview' && hasChildren && (
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-4"
        >
          {children.map((child) => (
            <OverviewChildCard
              key={child.id}
              child={child}
              onView={() => handleViewChild(child.id)}
              getWeeklyPlan={getWeeklyPlan}
            />
          ))}
        </motion.div>
      )}

      {/* Current child detail */}
      {currentChild && viewMode === 'detail' && (
        <>
          {/* Route health */}
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <CommandCard active corner className="p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-text-primary font-bold text-lg shrink-0 overflow-hidden"
                    style={{
                      background: `linear-gradient(135deg, ${currentChild.avatarColor}, ${currentChild.avatarColor}88)`,
                    }}
                  >
                    {currentChild.avatarUrl?.startsWith('data:image') ? (
                      <img
                        src={currentChild.avatarUrl}
                        alt={currentChild.name}
                        className="w-full h-full object-cover"
                      />
                    ) : currentChild.avatarUrl ? (
                      <span className="text-2xl">{currentChild.avatarUrl}</span>
                    ) : (
                      getInitials(currentChild.name)
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h2 className="text-lg font-bold font-display">{currentChild.name}</h2>
                      <DataBadge variant="primary" size="sm">
                        {gradeToStage(currentChild.grade)}
                      </DataBadge>
                    </div>
                    <p className="text-sm text-slate-600">
                      {gradeLabel(currentChild.grade)}
                      {currentChild.currentSchool ? ` · ${currentChild.currentSchool}` : ''}
                      {currentChild.routeId
                        ? ` · ${getRouteById(currentChild.routeId)?.name ?? currentChild.routeId}`
                        : ` · ${getStageRoute(gradeToStage(currentChild.grade)).name}`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-xs text-slate-600 mb-1">本周完成率</p>
                    <p className="text-xl font-bold font-display tabular-nums text-text-primary">
                      {completionRate}%
                    </p>
                  </div>
                  <MetricRing rate={completionRate} size={72} strokeWidth={7} />
                </div>
              </div>
            </CommandCard>
          </motion.div>

          {/* Stats grid */}
          <motion.div
            variants={containerVariants}
            initial={shouldReduceMotion ? false : 'hidden'}
            animate="visible"
            className="grid grid-cols-2 lg:grid-cols-4 gap-3"
          >
            {[
              {
                title: '当前方案',
                value: currentChild.routeId
                  ? getRouteById(currentChild.routeId)?.name ?? '未绑定'
                  : getStageRoute(gradeToStage(currentChild.grade)).name,
                subtext: currentChild.routeId
                  ? (getRouteById(currentChild.routeId)?.type === 'primary' ? '主路线' : '备选路线')
                  : getStageRoute(gradeToStage(currentChild.grade)).schools,
                icon: Target,
                color: 'text-primary',
                bg: 'bg-primary/10',
              },
              {
                title: '本周任务',
                value: weeklyStats ? `${weeklyStats.done}/${weeklyStats.total}` : '—',
                subtext: weeklyStats ? `${weeklyStats.pending} 个待完成` : '未发布计划',
                icon: Calendar,
                color: 'text-secondary',
                bg: 'bg-secondary/10',
              },
              {
                title: '总体进度',
                value: `${completionRate}%`,
                subtext: completionRate >= 60 ? '节奏良好' : '需要加油',
                icon: TrendingUp,
                color: 'text-accent',
                bg: 'bg-accent/10',
              },
              {
                title: '目标学校',
                value: currentChild.targetSchool || '未设置',
                subtext: currentChild.targetSchool ? '已设定升学目标' : '点击编辑孩子设置',
                icon: School,
                color: 'text-warning',
                bg: 'bg-warning/10',
              },
            ].map((stat) => (
              <motion.div key={stat.title} variants={itemVariants}>
                <CommandCard hover className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <p className="text-xs text-slate-600">{stat.title}</p>
                    <div className={`w-8 h-8 rounded-lg ${stat.bg} flex items-center justify-center`}>
                      <stat.icon className={`w-4 h-4 ${stat.color}`} />
                    </div>
                  </div>
                  <p className="text-lg font-bold font-display text-slate-900 truncate">{stat.value}</p>
                  <p className="text-[11px] text-slate-600 mt-0.5">{stat.subtext}</p>
                </CommandCard>
              </motion.div>
            ))}
          </motion.div>

          {/* Progress tracking */}
          <ProgressPanel child={currentChild} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Today's tasks timeline */}
            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:col-span-2"
            >
              <CommandCard className="p-5 h-full">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-primary" />
                    <h2 className="text-base font-bold font-display">今日任务 · {todayName}</h2>
                    {todayTasks.length > 0 && (
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-black/5 text-slate-600">
                        {todayTasks.filter((t) => t.status === 'done').length}/{todayTasks.length} 完成
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => router.push('/dashboard/weekly')}
                    className="flex items-center gap-1 text-xs text-primary hover:text-primary-glow transition-colors"
                  >
                    周视图 <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                {recentTasks.length === 0 ? (
                  <div className="text-center py-8 text-sm text-slate-600">
                    今日暂无任务，去周任务页面生成计划
                  </div>
                ) : (
                  <div className="space-y-4">
                    {allCategories
                      .filter((cat) => recentTasks.some((t) => (t.category || 'other') === cat))
                      .map((category) => {
                        const CategoryIcon = categoryIcons[category];
                        const catTasks = recentTasks.filter((t) => (t.category || 'other') === category);
                        return (
                          <div key={category}>
                            <div className="flex items-center gap-2 mb-2">
                              <div
                                className={`w-6 h-6 rounded-md flex items-center justify-center ${getCategoryColorClass(
                                  category
                                )}`}
                              >
                                <CategoryIcon className="w-3 h-3" />
                              </div>
                              <span className="text-xs font-medium text-slate-700">
                                {TASK_CATEGORY_LABELS[category]}
                              </span>
                            </div>
                            <div className="space-y-2">
                              {catTasks.map((task) => {
                                const isDone = task.status === 'done';
                                return (
                                  <div
                                    key={task.id}
                                    className={`flex items-start gap-3 p-3 rounded-xl border transition-all ${
                                      isDone
                                        ? 'bg-success/5 border-success/10'
                                        : 'bg-black/[0.03] border-black/[0.08] hover:bg-black/[0.05]'
                                    }`}
                                  >
                                    <button
                                      onClick={() =>
                                        currentChild &&
                                        currentWeekPlan?.id &&
                                        updateTaskStatus(
                                          currentChild.id,
                                          getCurrentWeekId(),
                                          task.id,
                                          toggleTaskStatus(task.status)
                                        )
                                      }
                                      className="mt-0.5 text-slate-600 hover:text-primary transition-colors focus-ring rounded-full shrink-0"
                                      aria-label={isDone ? '标记为未完成' : '标记为完成'}
                                    >
                                      {isDone ? (
                                        <CheckCircle2 className="w-5 h-5 text-success" />
                                      ) : (
                                        <Circle className="w-5 h-5" />
                                      )}
                                    </button>
                                    <button
                                      onClick={() => router.push('/dashboard/weekly')}
                                      className="flex-1 text-left min-w-0"
                                    >
                                      <div className="flex items-center justify-between mb-1">
                                        <span
                                          className={`text-sm font-semibold ${
                                            isDone ? 'text-slate-600 line-through' : 'text-slate-800'
                                          }`}
                                        >
                                          {task.focus}
                                        </span>
                                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/[0.05] text-slate-700 shrink-0 ml-2">
                                          {task.duration}
                                        </span>
                                      </div>
                                      <p className="text-[11px] text-slate-600">
                                        {task.materials.join('、') || '无指定材料'}
                                      </p>
                                    </button>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                )}
              </CommandCard>
            </motion.div>

            {/* AI Insights */}
            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <CommandCard className="p-5 h-full border-secondary/10">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-4 h-4 text-secondary" />
                  <h2 className="text-base font-bold font-display">AI 检视</h2>
                </div>

                <p className="text-sm text-slate-600 leading-relaxed mb-5">
                  {aiReview ?? '暂无数据，发布本周计划后将自动生成 AI 诊断。'}
                </p>

                <button
                  onClick={() => router.push('/dashboard/ai')}
                  className="w-full py-2 rounded-lg bg-secondary/10 border border-secondary/20 text-secondary text-sm font-semibold hover:bg-secondary/15 hover:shadow-glow-secondary transition-all duration-200 focus-ring"
                >
                  查看完整报告
                </button>
              </CommandCard>
            </motion.div>
          </div>
        </>
      )}
    </div>
  );
}
