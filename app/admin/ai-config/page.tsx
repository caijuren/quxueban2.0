'use client';

import { motion } from 'framer-motion';
import { Sparkles, Shield } from 'lucide-react';
import AiConfigSection from '@/components/settings/AiConfigSection';

export default function AdminAiConfigPage() {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-secondary to-accent">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold font-display">AI 配置</h1>
            <p className="text-sm text-slate-400">
              管理 AI 检视功能调用的模型、API Key 与启用状态
            </p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="rounded-2xl border border-warning/20 bg-warning/5 p-4"
      >
        <div className="flex items-start gap-3">
          <Shield className="h-5 w-5 text-warning shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-text-secondary">管理员权限</p>
            <p className="text-xs text-text-tertiary mt-0.5">
              此处的配置将用于全站 AI 检视功能。API Key 会加密存储在数据库中，前台仅显示脱敏后的后 4 位。
            </p>
          </div>
        </div>
      </motion.div>

      <AiConfigSection />
    </div>
  );
}
