'use client';

import ConsolePageShell from '@/components/console/core/ConsolePageShell';
import ChildrenSection from '@/components/settings/ChildrenSection';
import CapabilitySection from '@/components/settings/CapabilitySection';

export default function ChildrenPage() {
  return (
    <ConsolePageShell title="我的孩子" description="管理孩子的档案与能力模型">
      <div className="space-y-4">
        <ChildrenSection />
        <CapabilitySection />
      </div>
    </ConsolePageShell>
  );
}
