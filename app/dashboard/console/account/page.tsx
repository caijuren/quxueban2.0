'use client';

import { Icon } from '@/components/ui/icon';
import ConsolePageShell from '@/components/console/core/ConsolePageShell';
import { useConsoleSettings } from '@/components/console/core/useConsoleSettings';
import AccountSection from '@/components/settings/AccountSection';

export default function AccountPage() {
  const { user, isLoading, error, handleUpdate } = useConsoleSettings();

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Icon name="Loader2" size="xl" animate="spin" className="text-primary" />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="border-error/20 bg-error/10 rounded-2xl border p-6 text-error">
        {error instanceof Error ? error.message : '加载失败'}
      </div>
    );
  }

  return (
    <ConsolePageShell title="我的账户" description="管理个人资料、密码与账号安全">
      <AccountSection user={user} onUpdate={handleUpdate} />
    </ConsolePageShell>
  );
}
