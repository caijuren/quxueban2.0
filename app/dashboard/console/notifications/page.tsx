'use client';

import { Icon } from '@/components/ui/icon';
import { UserWithSettings } from '@/lib/settings';
import ConsolePageShell from '@/components/console/core/ConsolePageShell';
import { useConsoleSettings } from '@/components/console/core/useConsoleSettings';
import NotificationSection from '@/components/settings/NotificationSection';

export default function NotificationsPage() {
  const { user, isLoading, error, handleUpdate } = useConsoleSettings();

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Icon name="Loader2" size="xl" animate="spin" className="text-primary" />
      </div>
    );
  }

  if (error || !user?.settings) {
    return (
      <div className="border-error/20 bg-error/10 rounded-2xl border p-6 text-error">
        {error instanceof Error ? error.message : '加载失败'}
      </div>
    );
  }

  const handleSettingsUpdate = async (settingUpdates: Partial<UserWithSettings['settings']>) => {
    return handleUpdate(settingUpdates as Partial<UserWithSettings>);
  };

  return (
    <ConsolePageShell title="消息通知" description="管理提醒方式、勿扰时段与通知偏好">
      <NotificationSection settings={user.settings} onUpdate={handleSettingsUpdate} />
    </ConsolePageShell>
  );
}
