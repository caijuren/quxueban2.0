'use client';

import { Loader2 } from 'lucide-react';
import { UserWithSettings } from '@/lib/settings';
import ConsolePageShell from '@/components/console/core/ConsolePageShell';
import { useConsoleSettings } from '@/components/console/core/useConsoleSettings';
import AppearanceSection from '@/components/settings/AppearanceSection';

export default function AppearancePage() {
  const { user, isLoading, error, handleUpdate } = useConsoleSettings();

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !user?.settings) {
    return (
      <div className="rounded-2xl border border-error/20 bg-error/10 p-6 text-error">
        {error instanceof Error ? error.message : '加载失败'}
      </div>
    );
  }

  const handleSettingsUpdate = async (
    settingUpdates: Partial<UserWithSettings['settings']>
  ) => {
    return handleUpdate(settingUpdates as Partial<UserWithSettings>);
  };

  return (
    <ConsolePageShell title="外观与体验" description="调整主题、字号、默认首页与交互偏好">
      <AppearanceSection settings={user.settings} onUpdate={handleSettingsUpdate} />
    </ConsolePageShell>
  );
}
