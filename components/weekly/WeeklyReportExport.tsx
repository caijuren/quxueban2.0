'use client';

import { useRef, useState, useMemo, Fragment } from 'react';
import { Download, Share2, Target, CheckCircle2 } from 'lucide-react';
import { WeeklyPlan, TaskCategory, DayOfWeek, WeeklyTaskItem } from '@/lib/storage.types';
import { getPlanStats, formatWeekLabel, dayOrder, getWeekRange } from '@/lib/weeklyTasks';
import { TASK_CATEGORY_LABELS } from '@/lib/taskTemplates';
import { getCategoryColorClass } from '@/lib/taskAlignment';
import { categoryIcons as taskCategoryIcons } from '@/lib/taskIcons';
import Modal from '@/components/ui/Modal';

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

  const stats = getPlanStats(plan);

  const dayDates = useMemo(() => {
    const start = getWeekRange(plan.weekId).start;
    return dayOrder.map((_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return `${d.getMonth() + 1}/${d.getDate()}`;
    });
  }, [plan.weekId]);

  const tasksByCategoryDay = useMemo(() => {
    const grouped: Record<TaskCategory, Record<DayOfWeek, WeeklyTaskItem[]>> = {
      school: { 周一: [], 周二: [], 周三: [], 周四: [], 周五: [], 周六: [], 周日: [] },
      reading: { 周一: [], 周二: [], 周三: [], 周四: [], 周五: [], 周六: [], 周日: [] },
      sport: { 周一: [], 周二: [], 周三: [], 周四: [], 周五: [], 周六: [], 周日: [] },
      interest: { 周一: [], 周二: [], 周三: [], 周四: [], 周五: [], 周六: [], 周日: [] },
      ability: { 周一: [], 周二: [], 周三: [], 周四: [], 周五: [], 周六: [], 周日: [] },
      other: { 周一: [], 周二: [], 周三: [], 周四: [], 周五: [], 周六: [], 周日: [] },
    };
    plan.tasks.forEach((task) => {
      const category = task.category || 'other';
      grouped[category][task.day].push(task);
    });
    dayOrder.forEach((day) => {
      (Object.keys(grouped) as TaskCategory[]).forEach((cat) => {
        grouped[cat][day].sort((a, b) => a.focus.localeCompare(b.focus));
      });
    });
    return grouped;
  }, [plan.tasks]);

  const activeCategories = useMemo(
    () =>
      (Object.keys(tasksByCategoryDay) as TaskCategory[]).filter((cat) =>
        plan.tasks.some((t) => (t.category || 'other') === cat)
      ),
    [tasksByCategoryDay, plan.tasks]
  );

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
    link.download = `${childName}_周计划_${plan.weekId}.png`;
    link.click();
  };

  return (
    <Modal
      isOpen
      onClose={onClose}
      title="导出周计划"
      subtitle={formatWeekLabel(plan.weekId)}
      icon={Share2}
      iconClassName="bg-gradient-to-br from-secondary to-secondary-glow"
      size="md"
    >
      {/* Preview card */}
      <div className="overflow-x-auto rounded-2xl">
        <div
          ref={cardRef}
          className="min-w-[720px] rounded-2xl bg-gradient-to-br from-[#1a1a2e] to-[#0f0f1a] p-5 border border-white/[0.08]"
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider">
                {formatWeekLabel(plan.weekId)}
              </p>
              <h3 className="text-xl font-bold font-display text-white">
                {childName} 的每周计划
              </h3>
            </div>
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-sm"
              style={{
                background: `conic-gradient(#ff2d6a ${stats.completionRate * 3.6}deg, rgba(255,255,255,0.08) 0deg)`,
              }}
            >
              {stats.completionRate}%
            </div>
          </div>

          {/* Matrix */}
          <div className="grid grid-cols-8 gap-2 mb-5">
            <div className="flex items-end pb-2">
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                分类
              </span>
            </div>
            {dayOrder.map((day, i) => (
              <div key={day} className="text-center pb-2">
                <p className="text-xs font-bold text-slate-200">{day}</p>
                <p className="text-[10px] text-slate-500 tabular-nums">{dayDates[i]}</p>
              </div>
            ))}

            {activeCategories.map((category) => {
              const CategoryIcon = taskCategoryIcons[category];
              return (
                <Fragment key={category}>
                  <div
                    key={`${category}-label`}
                    className="flex items-center gap-2 py-2"
                  >
                    <div
                      className={`w-6 h-6 rounded-md flex items-center justify-center ${getCategoryColorClass(
                        category
                      )}`}
                    >
                      <CategoryIcon className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-medium text-slate-300">
                      {TASK_CATEGORY_LABELS[category]}
                    </span>
                  </div>
                  {dayOrder.map((day) => {
                    const cellTasks = tasksByCategoryDay[category][day];
                    return (
                      <div
                        key={`${category}-${day}`}
                        className="min-h-[64px] rounded-xl bg-white/[0.04] border border-white/[0.06] p-2"
                      >
                        {cellTasks.length === 0 ? (
                          <span className="text-[10px] text-slate-600">—</span>
                        ) : (
                          <div className="space-y-1">
                            {cellTasks.slice(0, 3).map((task) => (
                              <div
                                key={task.id}
                                className="flex items-start gap-1 text-[10px] leading-tight"
                              >
                                {task.status === 'done' && (
                                  <CheckCircle2 className="w-3 h-3 text-success shrink-0 mt-0.5" />
                                )}
                                <span
                                  className={`truncate ${
                                    task.status === 'done'
                                      ? 'text-slate-500 line-through'
                                      : 'text-slate-300'
                                  }`}
                                >
                                  {task.focus}
                                </span>
                              </div>
                            ))}
                            {cellTasks.length > 3 && (
                              <span className="text-[10px] text-slate-500">
                                +{cellTasks.length - 3} 项
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </Fragment>
              );
            })}
          </div>

          <div className="flex items-center gap-2 text-[10px] text-slate-500">
            <Target className="w-3 h-3" />
            趣学伴 · 升学规划中心
          </div>
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
                生成周计划卡片
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
    </Modal>
  );
}
