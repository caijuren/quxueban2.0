'use client';

import { useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  AlertTriangle,
  Info,
  CheckCircle2,
  ArrowRight,
  Calendar,
  TrendingDown,
  Clock,
  Target,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useChildren } from '@/components/dashboard/ChildrenContext';
import { generateAlerts, Alert, AlertLevel, AlertType } from '@/lib/alerts';
import EmptyState from '@/components/ui/EmptyState';
import CommandCard from '@/components/ui/CommandCard';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
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

const levelMeta: Record<
  AlertLevel,
  { icon: typeof AlertTriangle; color: string; bg: string; label: string }
> = {
  urgent: {
    icon: AlertTriangle,
    color: 'text-error',
    bg: 'bg-error/10',
    label: '紧急',
  },
  warning: {
    icon: AlertTriangle,
    color: 'text-warning',
    bg: 'bg-warning/10',
    label: '提醒',
  },
  info: {
    icon: Info,
    color: 'text-secondary',
    bg: 'bg-secondary/10',
    label: '提示',
  },
};

const typeMeta: Record<AlertType, { icon: typeof Calendar; label: string }> = {
  today_pending: { icon: Clock, label: '今日任务' },
  missed_yesterday: { icon: Calendar, label: '昨日遗漏' },
  category_gap: { icon: Target, label: '节奏断层' },
  low_completion: { icon: TrendingDown, label: '完成偏低' },
  milestone_deadline: { icon: Target, label: '节点临近' },
};

function AlertCard({ alert }: { alert: Alert }) {
  const router = useRouter();
  const meta = levelMeta[alert.level];
  const type = typeMeta[alert.type];
  const Icon = meta.icon;
  const TypeIcon = type.icon;

  return (
    <motion.div variants={itemVariants}>
      <CommandCard className="p-4 overflow-hidden">
        <div className="flex items-start gap-3">
          <div
            className={`w-10 h-10 rounded-xl ${meta.bg} flex items-center justify-center shrink-0`}
          >
            <Icon className={`w-5 h-5 ${meta.color}`} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${meta.bg} ${meta.color}`}
              >
                {meta.label}
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/5 text-slate-400 flex items-center gap-1">
                <TypeIcon className="w-3 h-3" />
                {type.label}
              </span>
            </div>
            <h3 className="text-sm font-bold text-slate-200 mb-1">
              {alert.title}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              {alert.content}
            </p>
            {alert.action && (
              <button
                onClick={() => router.push(alert.action!.href)}
                className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:text-primary-glow transition-colors"
              >
                {alert.action.label}
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </CommandCard>
    </motion.div>
  );
}

export default function AlertsPage() {
  const shouldReduceMotion = useReducedMotion();
  const router = useRouter();
  const { children, weeklyPlans } = useChildren();

  const alerts = useMemo(
    () => generateAlerts({ children, weeklyPlans }),
    [children, weeklyPlans]
  );

  const urgentCount = alerts.filter((a) => a.level === 'urgent').length;
  const warningCount = alerts.filter((a) => a.level === 'warning').length;

  return (
    <div className="space-y-6">
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display mb-1">作战室</h1>
          <p className="text-sm text-slate-500">
            {alerts.length > 0
              ? `共 ${alerts.length} 条提醒，其中 ${urgentCount} 条需立即处理`
              : '当前没有需要处理的事项，节奏良好'}
          </p>
        </div>
        {alerts.length > 0 && (
          <div className="flex items-center gap-2">
            {urgentCount > 0 && (
              <span className="px-3 py-1.5 rounded-lg bg-error/10 text-error text-xs font-medium">
                {urgentCount} 紧急
              </span>
            )}
            {warningCount > 0 && (
              <span className="px-3 py-1.5 rounded-lg bg-warning/10 text-warning text-xs font-medium">
                {warningCount} 提醒
              </span>
            )}
          </div>
        )}
      </motion.div>

      {alerts.length === 0 ? (
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <EmptyState
            icon={CheckCircle2}
            title="一切正常"
            description="今日任务已完成，本周节奏稳定，继续保持。"
            action={{
              label: '查看周任务',
              onClick: () => router.push('/dashboard/weekly'),
            }}
          />
        </motion.div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial={shouldReduceMotion ? false : 'hidden'}
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-2 gap-3"
        >
          {alerts.map((alert) => (
            <AlertCard key={alert.id} alert={alert} />
          ))}
        </motion.div>
      )}
    </div>
  );
}
