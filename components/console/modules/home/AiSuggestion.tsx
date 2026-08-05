'use client';

import { Lightbulb } from 'lucide-react';
import ActionCard from '@/components/console/core/ActionCard';

export default function AiSuggestion() {
  return (
    <div className="space-y-3">
      <ActionCard
        icon={Lightbulb}
        title="AI 今日建议"
        description="建议增加一本文学阅读。原因：近 7 天阅读时间下降 20%，补充文学类内容有助于提升阅读理解能力。"
        actions={[
          { label: '采纳建议', variant: 'primary', onClick: () => {} },
          { label: '稍后处理', variant: 'secondary', onClick: () => {} },
        ]}
      />
    </div>
  );
}
