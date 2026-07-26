'use client';

import { motion } from 'framer-motion';
import {
  Target,
  Calendar,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Clock,
  Sparkles,
  School,
  ChevronRight,
  Users,
  Plus,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useChildren } from '@/components/dashboard/ChildrenContext';
import { gradeLabel, gradeToStage, getInitials } from '@/lib/children';
import EmptyState from '@/components/ui/EmptyState';

const stats = [
  {
    title: '当前方案',
    value: '三公冲刺',
    subtext: '备选：私立摇号',
    icon: Target,
    color: 'from-primary to-primary-glow',
    glow: 'rgba(244, 63, 94, 0.3)',
  },
  {
    title: '本周任务',
    value: '5/8',
    subtext: '3 个待完成',
    icon: Calendar,
    color: 'from-secondary to-secondary-glow',
    glow: 'rgba(139, 92, 246, 0.3)',
  },
  {
    title: '总体进度',
    value: '32%',
    subtext: '略高于同龄平均',
    icon: TrendingUp,
    color: 'from-accent to-accent-glow',
    glow: 'rgba(6, 182, 212, 0.3)',
  },
  {
    title: '目标学校',
    value: '3 所',
    subtext: '1 冲刺 · 2 备选',
    icon: School,
    color: 'from-warning to-primary-glow',
    glow: 'rgba(245, 158, 11, 0.3)',
  },
];

const recentTasks = [
  { name: '试听奥数机构 A', status: 'completed', date: '今天' },
  { name: '完成 PET 词汇 Unit 5', status: 'in_progress', date: '明天截止' },
  { name: '整理三公历年招生简章', status: 'pending', date: '本周内' },
  { name: '记录孩子期末成绩', status: 'pending', date: '3 天内' },
];

const aiInsights = [
  {
    type: 'success',
    title: '英语进度正常',
    content: 'PET 备考节奏良好，建议继续保持每周 3 次单词打卡',
  },
  {
    type: 'warning',
    title: '奥数需要启动',
    content: '三公路线通常三年级开始系统奥数，建议本月确定机构',
  },
  {
    type: 'info',
    title: '时间节点提醒',
    content: '距离三公报名还有约 30 个月，可开始关注面谈准备',
  },
];

const statusConfig: Record<string, { label: string; icon: typeof CheckCircle2; color: string; bg: string }> = {
  completed: { label: '已完成', icon: CheckCircle2, color: 'text-success', bg: 'bg-success/10' },
  in_progress: { label: '进行中', icon: Clock, color: 'text-warning', bg: 'bg-warning/10' },
  pending: { label: '待开始', icon: AlertCircle, color: 'text-slate-400', bg: 'bg-slate-500/10' },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function DashboardPage() {
  const router = useRouter();
  const { children, currentChild, setCurrentChildId } = useChildren();

  const handleViewChild = (id: string) => {
    setCurrentChildId(id);
    router.push('/dashboard/plan');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold font-display mb-2">家庭仪表盘</h1>
        <p className="text-slate-400">
          {children.length > 0
            ? `管理 ${children.length} 个孩子，当前选中：${currentChild?.name || '无'}`
            : '欢迎回来，先添加孩子开始使用'}
        </p>
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
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
        >
          {children.map((child) => {
            const isActive = currentChild?.id === child.id;
            return (
              <motion.div
                key={child.id}
                variants={itemVariants}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className={`rounded-2xl glass p-4 relative overflow-hidden group cursor-pointer border ${
                  isActive ? 'border-primary/40' : 'border-white/5'
                }`}
                onClick={() => handleViewChild(child.id)}
              >
                {isActive && (
                  <div
                    className="absolute inset-0 opacity-30 transition-opacity duration-500"
                    style={{
                      background: `radial-gradient(circle at 100% 0%, rgba(244,63,94,0.25), transparent 70%)`,
                    }}
                  />
                )}
                <div className="relative z-10 flex items-center gap-4">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold shrink-0"
                    style={{
                      background: `linear-gradient(135deg, ${child.avatarColor}, ${child.avatarColor}88)`,
                      boxShadow: `0 0 20px ${child.avatarColor}40`,
                    }}
                  >
                    {getInitials(child.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-bold font-display truncate ${isActive ? 'text-primary' : 'text-slate-200'}`}>
                      {child.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {gradeLabel(child.grade)} · {gradeToStage(child.grade)}
                    </p>
                  </div>
                  <ChevronRight className={`w-4 h-4 shrink-0 ${isActive ? 'text-primary' : 'text-slate-500'}`} />
                </div>
              </motion.div>
            );
          })}

          <motion.button
            variants={itemVariants}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="rounded-2xl glass p-4 border border-dashed border-white/10 flex items-center justify-center gap-2 text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-all"
            onClick={() => router.push('/dashboard/plan')}
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm font-medium">添加孩子</span>
          </motion.button>
        </motion.div>
      )}

      {/* Current child detail */}
      {currentChild && (
        <>
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
              style={{ background: `linear-gradient(135deg, ${currentChild.avatarColor}, ${currentChild.avatarColor}88)` }}
            >
              {getInitials(currentChild.name)}
            </div>
            <div>
              <h2 className="text-xl font-bold font-display">{currentChild.name} 的近况</h2>
              <p className="text-sm text-slate-500">
                {gradeLabel(currentChild.grade)} · {gradeToStage(currentChild.grade)}阶段
              </p>
            </div>
          </div>

          {/* Stats */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {stats.map((stat) => (
              <motion.div
                key={stat.title}
                variants={itemVariants}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="rounded-2xl glass p-6 relative overflow-hidden group cursor-pointer"
              >
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: `radial-gradient(circle at 100% 0%, ${stat.glow}, transparent 70%)`,
                  }}
                />
                <div className="relative z-10 flex items-start justify-between">
                  <div>
                    <p className="text-sm text-slate-400 mb-1">{stat.title}</p>
                    <p className="text-2xl font-bold font-display text-slate-100">{stat.value}</p>
                    <p className="text-xs text-slate-500 mt-1">{stat.subtext}</p>
                  </div>
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}
                    style={{ boxShadow: `0 0 20px ${stat.glow}` }}
                  >
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent tasks */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="lg:col-span-2 rounded-2xl glass p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold font-display">近期任务</h2>
                <button
                  onClick={() => router.push('/dashboard/milestones')}
                  className="flex items-center gap-1 text-sm text-primary hover:text-primary-glow transition-colors"
                >
                  查看全部 <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3">
                {recentTasks.map((task, index) => {
                  const config = statusConfig[task.status];
                  return (
                    <motion.div
                      key={task.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all cursor-pointer group"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-lg ${config.bg} flex items-center justify-center`}>
                          <config.icon className={`w-5 h-5 ${config.color}`} />
                        </div>
                        <div>
                          <p className="font-medium text-slate-200 group-hover:text-white transition-colors">{task.name}</p>
                          <p className="text-sm text-slate-500">{task.date}</p>
                        </div>
                      </div>
                      <span className={`text-sm font-medium ${config.color}`}>{config.label}</span>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* AI Insights */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="rounded-2xl glass p-6 border border-secondary/20"
              style={{ boxShadow: '0 0 40px rgba(139, 92, 246, 0.1)' }}
            >
              <div className="flex items-center gap-2 mb-6">
                <Sparkles className="w-5 h-5 text-secondary" />
                <h2 className="text-xl font-bold font-display">AI 检视</h2>
              </div>

              <div className="space-y-4">
                {aiInsights.map((insight, index) => (
                  <motion.div
                    key={insight.title}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className={`p-4 rounded-xl border ${
                      insight.type === 'success'
                        ? 'bg-success/5 border-success/20'
                        : insight.type === 'warning'
                        ? 'bg-warning/5 border-warning/20'
                        : 'bg-accent/5 border-accent/20'
                    }`}
                  >
                    <p
                      className={`text-sm font-semibold mb-1 ${
                        insight.type === 'success'
                          ? 'text-success'
                          : insight.type === 'warning'
                          ? 'text-warning'
                          : 'text-accent'
                      }`}
                    >
                      {insight.title}
                    </p>
                    <p className="text-sm text-slate-400 leading-relaxed">{insight.content}</p>
                  </motion.div>
                ))}
              </div>

              <button
                onClick={() => router.push('/dashboard/ai')}
                className="w-full mt-6 py-3 rounded-xl bg-gradient-to-r from-secondary to-secondary-glow text-white font-semibold hover:shadow-[0_0_30px_rgba(139,92,246,0.4)] transition-all duration-300"
              >
                生成完整报告
              </button>
            </motion.div>
          </div>
        </>
      )}
    </div>
  );
}
