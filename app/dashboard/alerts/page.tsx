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
  Bell,
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
      <CommandCard className="overflow-hidden p-4">
        <div className="flex items-start gap-3">
          <div
            className={`size-10 rounded-lg ${meta.bg} flex shrink-0 items-center justify-center`}
          >
            <Icon className={`size-5 ${meta.color}`} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="mb-1 flex flex-wrap items-center gap-2">
              <span
                className={`rounded-full px-1.5 py-0.5 text-[10px] font-medium ${meta.bg} ${meta.color}`}
              >
                {meta.label}
              </span>
              <span className="flex items-center gap-1 rounded-full bg-surface-hover px-1.5 py-0.5 text-[10px] text-text-tertiary">
                <TypeIcon className="size-3" />
                {type.label}
              </span>
            </div>
            <h3 className="mb-1 text-sm font-bold text-text-secondary">{alert.title}</h3>
            <p className="mb-3 text-xs leading-relaxed text-text-tertiary">{alert.content}</p>
            {alert.action && (
              <button
                onClick={() => router.push(alert.action!.href)}
                className="inline-flex items-center gap-1 text-xs font-medium text-primary transition-colors hover:text-primary-glow"
              >
                {alert.action.label}
                <ArrowRight className="size-3" />
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

  const alerts = useMemo(() => generateAlerts({ children, weeklyPlans }), [children, weeklyPlans]);

  const urgentCount = alerts.filter((a) => a.level === 'urgent').length;
  const warningCount = alerts.filter((a) => a.level === 'warning').length;

  return (
    <div className="space-y-6">
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="bg-error/10 border-error/20 flex size-10 items-center justify-center rounded-lg border">
            <Bell className="size-5 text-error" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold sm:text-3xl">提醒中心</h1>
          </div>
        </div>
        {alerts.length > 0 && (
          <div className="flex items-center gap-2">
            {urgentCount > 0 && (
              <span className="bg-error/10 rounded-lg px-3 py-1.5 text-xs font-medium text-error">
                {urgentCount} 紧急
              </span>
            )}
            {warningCount > 0 && (
              <span className="bg-warning/10 rounded-lg px-3 py-1.5 text-xs font-medium text-warning">
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
              label: '查看周计划',
              onClick: () => router.push('/dashboard/weekly'),
            }}
          />
        </motion.div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial={shouldReduceMotion ? false : 'hidden'}
          animate="visible"
          className="grid grid-cols-1 gap-3 lg:grid-cols-2"
        >
          {alerts.map((alert) => (
            <AlertCard key={alert.id} alert={alert} />
          ))}
        </motion.div>
      )}
    </div>
  );
}
