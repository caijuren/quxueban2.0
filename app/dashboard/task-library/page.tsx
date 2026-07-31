'use client';

import { Library } from 'lucide-react';
import TaskLibrarySection from '@/components/settings/TaskLibrarySection';

export default function TaskLibraryPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-secondary/10 border border-secondary/20 flex items-center justify-center">
          <Library className="w-5 h-5 text-secondary" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display">任务库</h1>
          <p className="text-xs text-slate-400">管理和维护任务模板，生成周计划时可直接选用</p>
        </div>
      </div>
      <TaskLibrarySection />
    </div>
  );
}
