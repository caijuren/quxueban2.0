'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@/components/ui/icon';
import ConsolePageShell from '@/components/console/core/ConsolePageShell';
import EmptyState from '@/components/ui/EmptyState';
import {
  useNotificationList,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
  useDeleteNotification,
} from '@/lib/hooks/useNotifications';
import Button from '@/components/ui/button';
import { getNotificationTypeLabel, getNotificationTypeColor } from '@/lib/notifications';

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
            <Icon name="Bell" size="sm" className="text-primary" />
            <span>未读通知：{data?.unreadCount ?? 0}</span>
          </div>
          {(data?.unreadCount ?? 0) > 0 && (
            <Button
              variant="primary"
              onClick={() => markAllRead.mutate()}
              disabled={markAllRead.isPending}
              className="bg-primary/10 hover:bg-primary/20 flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-primary transition-all disabled:opacity-60"
            >
              {markAllRead.isPending ? (
                <Icon name="Loader2" size="xs" animate="spin" />
              ) : (
                <Icon name="CheckCheck" size="xs" />
              )}
              全部已读
            </Button>
          )}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Icon name="Loader2" size="xl" animate="spin" className="text-primary" />
          </div>
        ) : error ? (
          <div className="border-error/20 bg-error/10 rounded-2xl border p-6 text-sm text-error">
            {error instanceof Error ? error.message : '加载失败'}
          </div>
        ) : notifications.length === 0 ? (
          <EmptyState
            icon="Bell"
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
                    ? 'border-border-default bg-surface opacity-70'
                    : 'border-border-default bg-surface-elevated'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`shrink-0 rounded-md border px-2 py-0.5 text-[10px] font-medium ${getNotificationTypeColor(
                      notification.type
                    )}`}
                  >
                    {getNotificationTypeLabel(notification.type)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-text-primary">{notification.title}</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-text-secondary">
                      {notification.content}
                    </p>
                    <p className="mt-1.5 text-2xs text-text-muted">
                      {new Date(notification.createdAt).toLocaleString('zh-CN')}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    {!notification.readAt && (
                      <Button
                        variant="secondary"
                        onClick={() => handleMarkRead(notification.id)}
                        disabled={markRead.isPending}
                        className="hover:bg-primary/10 flex size-8 items-center justify-center rounded-lg bg-surface-hover text-text-secondary transition-colors hover:text-primary disabled:opacity-50"
                        title="标记为已读"
                      >
                        <Icon name="Check" size="sm" />
                      </Button>
                    )}
                    <Button
                      variant="secondary"
                      onClick={() => handleDelete(notification.id)}
                      disabled={deleteNotification.isPending}
                      className="hover:bg-error/10 flex size-8 items-center justify-center rounded-lg bg-surface-hover text-text-secondary transition-colors hover:text-error disabled:opacity-50"
                      title="删除"
                    >
                      <Icon name="Trash2" size="sm" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-2">
            <Button
              variant="secondary"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="rounded-lg bg-surface-hover px-3 py-1.5 text-xs text-text-secondary hover:bg-surface-highlight disabled:opacity-50"
            >
              上一页
            </Button>
            <span className="text-xs text-text-muted">
              {page} / {totalPages}
            </span>
            <Button
              variant="secondary"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="rounded-lg bg-surface-hover px-3 py-1.5 text-xs text-text-secondary hover:bg-surface-highlight disabled:opacity-50"
            >
              下一页
            </Button>
          </div>
        )}
      </div>
    </ConsolePageShell>
  );
}
