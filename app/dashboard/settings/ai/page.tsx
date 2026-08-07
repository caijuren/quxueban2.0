'use client';

import { Loader2 } from 'lucide-react';
import { useUser } from '@/lib/hooks/useUser';
import ConsolePageShell from '@/components/console/core/ConsolePageShell';
import AiConfigSection from '@/components/settings/AiConfigSection';

export default function AiConfigPage() {
  const { isLoading } = useUser();

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <ConsolePageShell title="AI 配置" description="配置 AI 对话、诊断与日报能力调用的模型和 API Key">
      <AiConfigSection />
    </ConsolePageShell>
  );
}
