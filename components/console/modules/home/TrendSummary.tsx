'use client';

import { BookOpen, Calculator, Languages } from 'lucide-react';
import Section from '@/components/console/core/Section';
import InsightRow from '@/components/console/core/InsightRow';

export default function TrendSummary() {
  return (
    <Section title="成长趋势" description="近 30 天能力变化">
      <div className="p-2 space-y-1">
        <InsightRow
          icon={BookOpen}
          label="阅读能力"
          value="82 分"
          trend="+12%"
          trendDirection="up"
          description="本月提升明显"
        />
        <InsightRow
          icon={Calculator}
          label="数学思维"
          value="76 分"
          trend="+8%"
          trendDirection="up"
          description="保持稳定进步"
        />
        <InsightRow
          icon={Languages}
          label="英语能力"
          value="90 分"
          trend="持平"
          trendDirection="flat"
          description="处于高位平台期"
        />
      </div>
    </Section>
  );
}
