'use client';

import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Bell, AlertTriangle, Info, CheckCircle2, Loader2, Eye } from 'lucide-react';
import EmptyState from '@/components/ui/EmptyState';
import CommandCard from '@/components/ui/CommandCard';

interface Notification {
  id: string;
  title: string;
  content: string;
  readAt: string | null;
  createdAt: string;
}

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

function getAlertIcon(title: string) {
  const lower = title.toLowerCase();
  if (lower.includes('预警') || lower.includes('风险') || lower.includes('截止')) {
    return <AlertTriangle className="w-5 h-5 text-warning" />;
  }
  if (lower.includes('公告') || lower.includes('系统')) {
    return <Info className="w-5 h-5 text-secondary" />;
  }
  if (lower.includes('完成') || lower.includes('通过')) {
    return <CheckCircle2 className="w-5 h-5 text-success" />;
  }
  return <Bell className="w-5 h-5 text-primary" />;
}

export default function AlertsPage() {
  const shouldReduceMotion = useReducedMotion();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch('/api/notifications')
      .then((res) => {
        if (!res.ok) throw new Error('加载失败');
        return res.json();
      })
      .then((data) => {
        if (!cancelled) setNotifications(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : '加载失败');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleMarkRead = async (id: string) => {
    const res = await fetch(`/api/notifications/${id}`, { method: 'PATCH' });
    if (!res.ok) return;
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, readAt: new Date().toISOString() } : n))
    );
  };

  const handleMarkAllRead = async () => {
    const res = await fetch('/api/notifications/read-all', { method: 'PATCH' });
    if (!res.ok) return;
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, readAt: n.readAt ?? new Date().toISOString() }))
    );
  };

  const unreadCount = notifications.filter((n) => !n.readAt).length;

  return (
    <div className="space-y-6">
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display mb-1">预警提醒</h1>
          <p className="text-sm text-slate-500">
            {unreadCount > 0
              ? `你有 ${unreadCount} 条未读提醒`
              : '暂无新的提醒'}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/[0.08] text-sm text-slate-300 hover:bg-white/[0.08] transition-colors"
          >
            <Eye className="w-4 h-4" />
            全部已读
          </button>
        )}
      </motion.div>

      {loading ? (
        <div className="flex h-[40vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-error/20 bg-error/10 p-6 text-error">
          {error}
        </div>
      ) : notifications.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="暂无提醒"
          description="系统公告、任务截止预警和里程碑提醒会出现在这里"
        />
      ) : (
        <motion.div
          variants={containerVariants}
          initial={shouldReduceMotion ? false : 'hidden'}
          animate="visible"
          className="space-y-3"
        >
          {notifications.map((notification) => {
            const isUnread = !notification.readAt;
            return (
              <motion.div key={notification.id} variants={itemVariants}>
                <CommandCard
                  className={`p-4 transition-opacity ${isUnread ? '' : 'opacity-60'}`}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/[0.03] flex items-center justify-center shrink-0">
                      {getAlertIcon(notification.title)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 mb-1">
                        <h3 className="text-sm font-semibold text-slate-200">
                          {notification.title}
                        </h3>
                        <span className="text-[10px] text-slate-600 tabular-nums shrink-0">
                          {new Date(notification.createdAt).toLocaleString('zh-CN')}
                        </span>
                      </div>
                      <p className="text-sm text-slate-400 leading-relaxed mb-3">
                        {notification.content}
                      </p>
                      {isUnread && (
                        <button
                          onClick={() => handleMarkRead(notification.id)}
                          className="inline-flex items-center gap-1.5 text-xs text-primary hover:text-primary-glow transition-colors"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          标记已读
                        </button>
                      )}
                    </div>
                    {isUnread && (
                      <span className="mt-1.5 h-2 w-2 rounded-full bg-primary shrink-0" />
                    )}
                  </div>
                </CommandCard>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}
