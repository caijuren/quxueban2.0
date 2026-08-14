'use client';

import { Icon } from '@/components/ui/icon';
import { UserWithSettings } from '@/lib/settings';
import ConsolePageShell from '@/components/console/core/ConsolePageShell';
import { useConsoleSettings } from '@/components/console/core/useConsoleSettings';
import AccountSection from '@/components/settings/AccountSection';
import Alert from '@/components/ui/alert';

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
      <Alert type="error" title="加载失败" description={error instanceof Error ? error.message : '无法加载账户信息'} />
    );
  }

  const handleUpdateWrapper = async (updates: Partial<UserWithSettings>) => {
    return handleUpdate(updates);
  };

  return (
    <ConsolePageShell title="账户与安全" description="管理个人信息、密码和账号安全">
      <AccountSection user={user} onUpdate={handleUpdateWrapper} />
    </ConsolePageShell>
  );
}
