'use client';

import ConsolePageShell from '@/components/console/core/ConsolePageShell';
import CapabilitySection from '@/components/settings/CapabilitySection';

export default function CapabilitiesPage() {
  return (
    <ConsolePageShell
      title="能力模型"
      description="定义孩子需要培养的能力维度，供 AI 分析成长轨迹"
    >
      <CapabilitySection />
    </ConsolePageShell>
  );
}
