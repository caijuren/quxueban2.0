'use client';

import ConsolePageShell from '@/components/console/core/ConsolePageShell';
import HelpSection from '@/components/settings/HelpSection';

export default function HelpPage() {
  return (
    <ConsolePageShell title="帮助中心" description="常见问题、反馈与产品信息">
      <HelpSection />
    </ConsolePageShell>
  );
}
