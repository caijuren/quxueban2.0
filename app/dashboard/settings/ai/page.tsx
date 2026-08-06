'use client';

import { Loader2, AlertTriangle } from 'lucide-react';
import { useUser } from '@/lib/hooks/useUser';
import ConsolePageShell from '@/components/console/core/ConsolePageShell';
import AiConfigSection from '@/components/settings/AiConfigSection';

export default function AiConfigPage() {
  const { data: user, isLoading } = useUser();

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (user?.role !== 'ADMIN') {
    return (
      <ConsolePageShell title="AI 配置" description="配置 AI 检视功能调用的模型和 API Key">
        <div className="rounded-2xl border border-warning/20 bg-warning/10 p-6 text-warning flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">需要管理员权限</p>
            <p className="text-sm mt-1 text-text-muted">请联系管理员配置 AI 能力。</p>
          </div>
        </div>
      </ConsolePageShell>
    );
  }

  return (
    <ConsolePageShell title="AI 配置" description="配置 AI 检视功能调用的模型和 API Key">
      <AiConfigSection />
    </ConsolePageShell>
  );
}
