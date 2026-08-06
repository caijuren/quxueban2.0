'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Bell,
  Loader2,
  Check,
  Trash2,
  CheckCheck,
} from 'lucide-react';
import ConsolePageShell from '@/components/console/core/ConsolePageShell';
import EmptyState from '@/components/ui/EmptyState';
import {
  useNotificationList,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
  useDeleteNotification,
} from '@/lib/hooks/useNotifications';
import {
  getNotificationTypeLabel,
  getNotificationTypeColor,
} from '@/lib/notifications';

export default function NotificationsPage() {
  const [page, setPage] = useState(1);
  const limit = 10;
  const { data, isLoading, error } = useNotificationList(page, limit);
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();
  const deleteNotification = useDeleteNotification();

  const notifications = data?.notifications ?? [];
  const totalPages = data ? Math.ceil(data.total / limit) : 0;

  const handleMarkRead = (id: string) => {
    markRead.mutate(id);
  };

  const handleDelete = (id: string) => {
    deleteNotification.mutate(id);
  };

  return (
    <ConsolePageShell title="消息通知" description="查看、管理和清理系统通知">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <Bell className="w-4 h-4 text-primary" />
            <span>未读通知：{data?.unreadCount ?? 0}</span>
          </div>
          {(data?.unreadCount ?? 0) > 0 && (
            <button
              onClick={() => markAllRead.mutate()}
              disabled={markAllRead.isPending}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 transition-all disabled:opacity-60"
            >
              {markAllRead.isPending ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <CheckCheck className="w-3.5 h-3.5" />
              )}
              全部已读
            </button>
          )}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-error/20 bg-error/10 p-6 text-error text-sm">
            {error instanceof Error ? error.message : '加载失败'}
          </div>
        ) : notifications.length === 0 ? (
          <EmptyState
            icon={Bell}
            title="暂无通知"
            description="系统消息、任务提醒和预警会出现在这里"
          />
        ) : (
          <div className="space-y-2">
            {notifications.map((notification, index) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                className={`rounded-xl border p-3 transition-colors ${
                  notification.readAt
                    ? 'bg-surface border-border-default opacity-70'
                    : 'bg-surface-elevated border-border-default'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`shrink-0 px-2 py-0.5 rounded-md text-[10px] font-medium border ${getNotificationTypeColor(
                      notification.type
                    )}`}
                  >
                    {getNotificationTypeLabel(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-primary">
                      {notification.title}
                    </p>
                    <p className="text-xs text-text-secondary mt-0.5 leading-relaxed">
                      {notification.content}
                    </p>
                    <p className="text-2xs text-text-muted mt-1.5">
                      {new Date(notification.createdAt).toLocaleString('zh-CN')}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    {!notification.readAt && (
                      <button
                        onClick={() => handleMarkRead(notification.id)}
                        disabled={markRead.isPending}
                        className="w-8 h-8 rounded-lg bg-surface-hover flex items-center justify-center text-text-secondary hover:text-primary hover:bg-primary/10 transition-colors disabled:opacity-50"
                        title="标记为已读"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(notification.id)}
                      disabled={deleteNotification.isPending}
                      className="w-8 h-8 rounded-lg bg-surface-hover flex items-center justify-center text-text-secondary hover:text-error hover:bg-error/10 transition-colors disabled:opacity-50"
                      title="删除"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="px-3 py-1.5 rounded-lg bg-surface-hover text-xs text-text-secondary hover:bg-surface-highlight disabled:opacity-50"
            >
              上一页
            </button>
            <span className="text-xs text-text-muted">
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="px-3 py-1.5 rounded-lg bg-surface-hover text-xs text-text-secondary hover:bg-surface-highlight disabled:opacity-50"
            >
              下一页
            </button>
          </div>
        )}
      </div>
    </ConsolePageShell>
  );
}
