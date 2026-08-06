'use client';

import Link from 'next/link';
import { Sprout, FileDown, ArrowRight } from 'lucide-react';
import ConsolePageShell from '@/components/console/core/ConsolePageShell';
import SettingsSection from '@/components/settings/SettingsSection';
import DataPrivacySection from '@/components/settings/DataPrivacySection';

export default function DataPage() {
  return (
    <ConsolePageShell title="数据与隐私" description="管理学习数据、成长档案与账号">
      <div className="space-y-4">
        <SettingsSection title="数据资产" description="查看成长档案或导出学习数据">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link
              href="/dashboard/growth"
              className="group flex items-center gap-3 p-4 rounded-xl bg-surface-elevated border border-border-subtle hover:border-primary/30 hover:bg-surface-hover transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Sprout className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-text-secondary">成长档案</p>
                <p className="text-[11px] text-text-muted mt-0.5">时间线、证据库与完成趋势</p>
              </div>
              <ArrowRight className="w-4 h-4 text-text-muted group-hover:text-primary transition-colors" />
            </Link>

            <div className="flex items-center gap-3 p-4 rounded-xl bg-surface-elevated border border-border-subtle opacity-70">
              <div className="w-10 h-10 rounded-xl bg-ai/10 flex items-center justify-center">
                <FileDown className="w-5 h-5 text-ai" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-text-secondary">数据导出</p>
                <p className="text-[11px] text-text-muted mt-0.5">PDF / Excel 等格式导出（即将上线）</p>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-surface text-text-muted border border-border-subtle">
                敬请期待
              </span>
            </div>
          </div>
        </SettingsSection>

        <DataPrivacySection />
      </div>
    </ConsolePageShell>
  );
}
