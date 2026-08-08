'use client';

import PageHeader from '@/components/layout/page-header';
import Alert from '@/components/ui/alert';
import AiConfigSection from '@/components/settings/AiConfigSection';

export default function AdminAiConfigPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="AI 配置" description="管理 AI 检视功能调用的模型、API Key 与启用状态" />

      <Alert type="warning" title="管理员权限">
        此处的配置将用于全站 AI 检视功能。API Key 会加密存储在数据库中，前台仅显示脱敏后的后 4 位。
      </Alert>

      <AiConfigSection />
    </div>
  );
}
