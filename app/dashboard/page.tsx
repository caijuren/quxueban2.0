'use client';

import { motion, useReducedMotion } from 'framer-motion';
import {
  Target,
  Calendar,
  TrendingUp,
  School,
  ChevronRight,
  Users,
  Plus,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useChildren } from '@/components/dashboard/ChildrenContext';
import { gradeLabel, gradeToStage, getInitials } from '@/lib/children';
import {
  getCurrentWeekId,
  getPlanStats,
  generateAiReview,
  getTodayName,
} from '@/lib/weeklyTasks';
import EmptyState from '@/components/ui/EmptyState';
import CommandCard from '@/components/ui/CommandCard';
import MetricRing from '@/components/ui/MetricRing';
import DataBadge from '@/components/ui/DataBadge';
import TimelineNode from '@/components/ui/TimelineNode';

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

export default function DashboardPage() {
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();
  const { children, currentChild, setCurrentChildId, getWeeklyPlan } = useChildren();

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
    router.push('/dashboard/plan');
  };

  const getStageRoute = (stage: string) => {
    switch (stage) {
      case '小升初':
        return { name: '三公 / 民办摇号', schools: '3 所目标校' };
      case '中考':
        return { name: '市重点 / 名额分配', schools: '4 所目标校' };
      default:
        return { name: '高考综评 / 强基', schools: '2 所目标校' };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <h1 className="text-2xl sm:text-3xl font-bold font-display mb-1">作战指挥中心</h1>
        <p className="text-sm text-slate-500">
          {children.length > 0
            ? `监控 ${children.length} 名学员 · 当前：${currentChild?.name || '未选择'}`
            : '请先添加学员档案'}
        </p>
      </motion.div>

      {/* Children overview */}
      {children.length === 0 ? (
        <EmptyState
          icon={Users}
          title="还没有学员档案"
          description="添加学员后，这里会显示每个学员的升学阶段概览，方便快速切换"
        />
      ) : (
        <motion.div
          variants={containerVariants}
          initial={shouldReduceMotion ? false : 'hidden'}
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3"
        >
          {children.map((child) => {
            const isActive = currentChild?.id === child.id;
            const stage = gradeToStage(child.grade);
            return (
              <motion.div key={child.id} variants={itemVariants}>
                <CommandCard
                  active={isActive}
                  hover
                  onClick={() => handleViewChild(child.id)}
                  className="p-4"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
                      style={{
                        background: `linear-gradient(135deg, ${child.avatarColor}, ${child.avatarColor}88)`,
                      }}
                    >
                      {getInitials(child.name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`font-semibold text-sm truncate ${isActive ? 'text-primary' : 'text-slate-200'}`}>
                        {child.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        {gradeLabel(child.grade)} · {stage}
                      </p>
                    </div>
                    <ChevronRight className={`w-4 h-4 shrink-0 ${isActive ? 'text-primary' : 'text-slate-600'}`} />
                  </div>
                </CommandCard>
              </motion.div>
            );
          })}

          <motion.button
            variants={itemVariants}
            onClick={() => router.push('/dashboard/plan')}
            className="rounded-xl border border-dashed border-white/[0.08] bg-white/[0.02] p-4 flex items-center justify-center gap-2 text-slate-500 hover:text-slate-300 hover:bg-white/[0.04] hover:border-white/[0.12] transition-all text-sm"
          >
            <Plus className="w-4 h-4" />
            <span className="font-medium">添加学员</span>
          </motion.button>
        </motion.div>
      )}

      {/* Current child detail */}
      {currentChild && (
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
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shrink-0"
                    style={{
                      background: `linear-gradient(135deg, ${currentChild.avatarColor}, ${currentChild.avatarColor}88)`,
                    }}
                  >
                    {getInitials(currentChild.name)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h2 className="text-lg font-bold font-display">{currentChild.name}</h2>
                      <DataBadge variant="primary" size="sm">
                        {gradeToStage(currentChild.grade)}
                      </DataBadge>
                    </div>
                    <p className="text-sm text-slate-500">
                      {gradeLabel(currentChild.grade)} · {getStageRoute(gradeToStage(currentChild.grade)).name}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-xs text-slate-500 mb-1">本周完成率</p>
                    <p className="text-xl font-bold font-display tabular-nums text-white">
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
                value: getStageRoute(gradeToStage(currentChild.grade)).name,
                subtext: getStageRoute(gradeToStage(currentChild.grade)).schools,
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
                value: getStageRoute(gradeToStage(currentChild.grade)).schools.split(' ')[0],
                subtext: '点击路线方案查看',
                icon: School,
                color: 'text-warning',
                bg: 'bg-warning/10',
              },
            ].map((stat) => (
              <motion.div key={stat.title} variants={itemVariants}>
                <CommandCard hover className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <p className="text-xs text-slate-500">{stat.title}</p>
                    <div className={`w-8 h-8 rounded-lg ${stat.bg} flex items-center justify-center`}>
                      <stat.icon className={`w-4 h-4 ${stat.color}`} />
                    </div>
                  </div>
                  <p className="text-lg font-bold font-display text-slate-100 truncate">{stat.value}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">{stat.subtext}</p>
                </CommandCard>
              </motion.div>
            ))}
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Today's tasks timeline */}
            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:col-span-2"
            >
              <CommandCard className="p-5 h-full">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-primary" />
                    <h2 className="text-base font-bold font-display">今日任务 · {todayName}</h2>
                  </div>
                  <button
                    onClick={() => router.push('/dashboard/weekly')}
                    className="flex items-center gap-1 text-xs text-primary hover:text-primary-glow transition-colors"
                  >
                    周视图 <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                {recentTasks.length === 0 ? (
                  <div className="text-center py-8 text-sm text-slate-500">
                    今日暂无任务，去周任务页面生成计划
                  </div>
                ) : (
                  <div className="space-y-1">
                    {recentTasks.map((task, index) => (
                      <TimelineNode
                        key={task.id}
                        title={task.focus}
                        subtitle={`${task.duration} · ${task.materials.join('、') || '无指定材料'}`}
                        status={task.status === 'done' ? 'completed' : 'current'}
                        isLast={index === recentTasks.length - 1}
                      />
                    ))}
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

                <p className="text-sm text-slate-400 leading-relaxed mb-5">
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
