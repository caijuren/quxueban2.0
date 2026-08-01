'use client';

import { useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  Download,
  Share2,
  X,
  Target,
} from 'lucide-react';
import { WeeklyPlan, TaskCategory } from '@/lib/storage.types';
import { getPlanStats, formatWeekLabel } from '@/lib/weeklyTasks';
import { TASK_CATEGORY_LABELS } from '@/lib/taskTemplates';
import { getCategoryColorClass } from '@/lib/taskAlignment';

interface WeeklyReportExportProps {
  plan: WeeklyPlan;
  childName: string;
  onClose: () => void;
}

export default function WeeklyReportExport({
  plan,
  childName,
  onClose,
}: WeeklyReportExportProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [exporting, setExporting] = useState(false);
  const [exportedUrl, setExportedUrl] = useState<string | null>(null);
  const shouldReduceMotion = useReducedMotion();

  const stats = getPlanStats(plan);
  const activeCategories = Object.entries(stats.byCategory)
    .filter(([, s]) => s.total > 0)
    .sort((a, b) => b[1].total - a[1].total);

  const handleExport = async () => {
    if (!cardRef.current) return;
    const html2canvas = (await import('html2canvas')).default;
    setExporting(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        backgroundColor: '#0a0a0f',
        useCORS: true,
      });
      const dataUrl = canvas.toDataURL('image/png');
      setExportedUrl(dataUrl);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setExporting(false);
    }
  };

  const handleDownload = () => {
    if (!exportedUrl) return;
    const link = document.createElement('a');
    link.href = exportedUrl;
    link.download = `${childName}_周报_${plan.weekId}.png`;
    link.click();
  };

  return (
    <motion.div
      initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 lg:left-64 z-[110] flex items-center sm:justify-center sm:p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={shouldReduceMotion ? false : { scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={shouldReduceMotion ? { opacity: 0 } : { scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full h-full sm:h-auto sm:max-w-md sm:max-h-[90vh] overflow-y-auto rounded-none sm:rounded-3xl glass sm:border border-white/10 p-5 sm:p-6 modal-scroll"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold font-display">导出周报</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/5 text-slate-400"
            aria-label="关闭"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Preview card */}
        <div
          ref={cardRef}
          className="rounded-2xl bg-gradient-to-br from-[#1a1a2e] to-[#0f0f1a] p-5 border border-white/[0.08]"
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider">
                {formatWeekLabel(plan.weekId)}
              </p>
              <h3 className="text-xl font-bold font-display text-white">
                {childName} 的每周战报
              </h3>
            </div>
            <div className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-sm"
              style={{
                background: `conic-gradient(#ff2d6a ${stats.completionRate * 3.6}deg, rgba(255,255,255,0.08) 0deg)`,
              }}
            >
              {stats.completionRate}%
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mb-5">
            <div className="rounded-xl bg-white/[0.05] p-3 text-center">
              <p className="text-lg font-bold text-white">{stats.total}</p>
              <p className="text-[10px] text-slate-400">总任务</p>
            </div>
            <div className="rounded-xl bg-success/10 p-3 text-center">
              <p className="text-lg font-bold text-success">{stats.done}</p>
              <p className="text-[10px] text-slate-400">已完成</p>
            </div>
            <div className="rounded-xl bg-white/[0.05] p-3 text-center">
              <p className="text-lg font-bold text-white">{stats.estimatedMinutes}</p>
              <p className="text-[10px] text-slate-400">总分钟</p>
            </div>
          </div>

          <div className="space-y-2 mb-5">
            {activeCategories.slice(0, 5).map(([category, s]) => (
              <div key={category} className="flex items-center gap-3">
                <div
                  className={`w-6 h-6 rounded-md flex items-center justify-center ${getCategoryColorClass(
                    category as TaskCategory
                  )}`}
                >
                  <span className="text-[10px] font-bold">
                    {TASK_CATEGORY_LABELS[category as TaskCategory].slice(0, 1)}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-300">
                      {TASK_CATEGORY_LABELS[category as TaskCategory]}
                    </span>
                    <span className="text-slate-500">
                      {s.done}/{s.total}
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/[0.08] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{
                        width: `${s.total === 0 ? 0 : (s.done / s.total) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 text-[10px] text-slate-500">
            <Target className="w-3 h-3" />
            趣学伴 · 升学规划中心
          </div>
        </div>

        <div className="mt-5 space-y-2">
          {!exportedUrl ? (
            <button
              onClick={handleExport}
              disabled={exporting}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-primary to-primary-glow text-white font-semibold hover:shadow-[0_0_30px_rgba(255,45,106,0.3)] transition-all disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {exporting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  生成中...
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4" />
                  生成分享卡片
                </>
              )}
            </button>
          ) : (
            <button
              onClick={handleDownload}
              className="w-full py-3 rounded-xl bg-success/10 border border-success/20 text-success font-semibold hover:bg-success/15 transition-all flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              下载图片
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
