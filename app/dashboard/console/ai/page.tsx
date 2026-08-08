'use client';

import { Loader2, Lock } from 'lucide-react';
import ConsolePageShell from '@/components/console/core/ConsolePageShell';
import { useConsoleSettings } from '@/components/console/core/useConsoleSettings';
import AiConfigSection from '@/components/settings/AiConfigSection';

export default function AiConfigPage() {
  const { user, isLoading, error } = useConsoleSettings();

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" />
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

  const isAdmin = user.role === 'ADMIN';

  return (
    <ConsolePageShell title="AI 配置" description="配置 AI 模型、密钥与功能开关">
      {isAdmin ? (
        <AiConfigSection />
      ) : (
        <div className="rounded-2xl border border-border-default bg-surface p-6">
          <div className="flex items-start gap-4">
            <div className="bg-primary/10 flex size-10 shrink-0 items-center justify-center rounded-xl">
              <Lock className="size-5 text-primary" />
            </div>
            <div>
              <h3 className="mb-1 text-base font-bold text-text-primary">请联系管理员</h3>
              <p className="text-sm text-text-muted">
                AI 助手配置仅对管理员开放。如需调整模型、密钥或功能开关，请联系家庭管理员。
              </p>
            </div>
          </div>
        </div>
      )}
    </ConsolePageShell>
  );
}
