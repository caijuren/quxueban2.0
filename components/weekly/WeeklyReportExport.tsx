'use client';

import { useRef, useState, useMemo } from 'react';
import { Download, Share2, Calendar, Clock, Printer, CheckCircle2, Target } from 'lucide-react';
import {
  WeeklyPlan,
  TaskCategory,
  DayOfWeek,
  WeeklyTaskItem,
} from '@/lib/storage.types';
import {
  getPlanStats,
  formatWeekLabel,
  dayOrder,
  getWeekRange,
  getCategoryDefaultTimeSlot,
  getTimeSlotLabel,
  timeSlotOrder,
} from '@/lib/weeklyTasks';
import { TASK_CATEGORY_LABELS } from '@/lib/taskTemplates';
import { categoryIcons as taskCategoryIcons } from '@/lib/taskIcons';
import Modal from '@/components/ui/Modal';

interface WeeklyReportExportProps {
  plan: WeeklyPlan;
  childName: string;
  onClose: () => void;
}

const A4_WIDTH = 794;
const A4_HEIGHT = 1123;

const CATEGORY_COLORS: Record<TaskCategory, { soft: string; solid: string }> = {
  school: { soft: 'bg-warning/15 text-warning', solid: 'bg-warning' },
  reading: { soft: 'bg-accent/15 text-accent', solid: 'bg-accent' },
  sport: { soft: 'bg-success/15 text-success', solid: 'bg-success' },
  interest: { soft: 'bg-primary/15 text-primary', solid: 'bg-primary' },
  ability: { soft: 'bg-secondary/15 text-secondary', solid: 'bg-secondary' },
  other: { soft: 'bg-slate-200 text-slate-600', solid: 'bg-slate-500' },
};

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
        grouped[cat][day].sort((a, b) => {
          const slotA = timeSlotOrder.indexOf(a.timeSlot || getCategoryDefaultTimeSlot(a.category));
          const slotB = timeSlotOrder.indexOf(b.timeSlot || getCategoryDefaultTimeSlot(b.category));
          if (slotA !== slotB) return slotA - slotB;
          return a.focus.localeCompare(b.focus);
        });
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
        backgroundColor: '#ffffff',
        useCORS: true,
        logging: false,
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

  const handlePrint = () => {
    if (!cardRef.current) return;
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>${childName} 的周计划</title>
          <style>
            @page { size: A4 portrait; margin: 0; }
            body { margin: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            img { display: block; width: 100%; max-width: 794px; margin: 0 auto; }
          </style>
        </head>
        <body>
          <img src="${exportedUrl || ''}" alt="周计划" />
          <script>
            window.onload = function() { setTimeout(function() { window.print(); window.close(); }, 200); };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const estimatedHours = Math.round((stats.estimatedMinutes / 60) * 10) / 10;

  return (
    <Modal
      isOpen
      onClose={onClose}
      title="导出周计划"
      subtitle="生成 A4 尺寸打卡表，可下载图片或直接打印"
      icon={Share2}
      iconClassName="bg-secondary"
      size="md"
    >
      <div className="overflow-x-auto rounded-2xl border border-border-subtle bg-surface-elevated p-1">
        <div
          ref={cardRef}
          style={{ width: A4_WIDTH, minHeight: A4_HEIGHT }}
          className="bg-white text-neutral-800 p-8 flex flex-col"
        >
          {/* Header */}
          <div className="flex items-start justify-between border-b-2 border-neutral-900 pb-5 mb-5">
            <div>
              <div className="flex items-center gap-2 text-xs text-neutral-500 mb-2">
                <Calendar className="w-4 h-4" />
                <span>{formatWeekLabel(plan.weekId)}</span>
                <span className="text-neutral-300">|</span>
                <span>第 {plan.weekId.split('-W')[1]} 周</span>
              </div>
              <h1 className="text-3xl font-bold text-neutral-900 tracking-tight">
                {childName} 的周计划打卡表
              </h1>
              <p className="text-sm text-neutral-500 mt-1">每日完成后在方框内打勾，坚持就是胜利</p>
            </div>
            <div className="text-right">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center mb-2 ml-auto">
                <Target className="w-5 h-5 text-text-primary" />
              </div>
              <p className="text-xs font-semibold text-neutral-700">趣学伴</p>
              <p className="text-xs text-neutral-400">周计划 · 可打印</p>
            </div>
          </div>

          {/* Summary */}
          <div className="grid grid-cols-4 gap-3 mb-6">
            <div className="rounded-lg bg-neutral-50 border border-neutral-200 p-3 text-center">
              <p className="text-xs text-neutral-500 mb-1">本周任务</p>
              <p className="text-2xl font-bold text-neutral-900">{stats.total}</p>
            </div>
            <div className="rounded-lg bg-neutral-50 border border-neutral-200 p-3 text-center">
              <p className="text-xs text-neutral-500 mb-1">已完成</p>
              <p className="text-2xl font-bold text-success">{stats.done}</p>
            </div>
            <div className="rounded-lg bg-neutral-50 border border-neutral-200 p-3 text-center">
              <p className="text-xs text-neutral-500 mb-1 flex items-center justify-center gap-1">
                <Clock className="w-4 h-4" /> 总时长
              </p>
              <p className="text-2xl font-bold text-neutral-900">{estimatedHours}h</p>
            </div>
            <div className="rounded-lg bg-neutral-50 border border-neutral-200 p-3 text-center">
              <p className="text-xs text-neutral-500 mb-1">完成率</p>
              <p className="text-2xl font-bold text-primary">{stats.completionRate}%</p>
            </div>
          </div>

          {/* Matrix */}
          <div className="flex-1">
            <div
              className="grid gap-2"
              style={{ gridTemplateColumns: `100px repeat(7, 1fr)` }}
            >
              <div className="flex items-end pb-2">
                <span className="text-xs font-semibold text-neutral-500">分类</span>
              </div>
              {dayOrder.map((day, i) => (
                <div key={day} className="text-center pb-2 border-b-2 border-neutral-200">
                  <p className="text-sm font-bold text-neutral-800">{day}</p>
                  <p className="text-xs text-neutral-400 tabular-nums">{dayDates[i]}</p>
                </div>
              ))}

              {activeCategories.map((category) => {
                const CategoryIcon = taskCategoryIcons[category];
                const categoryColor = CATEGORY_COLORS[category];
                return (
                  <div key={category} className="contents">
                    <div className="flex items-center gap-2 py-3 border-b border-neutral-100">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center ${categoryColor.soft}`}
                      >
                        <CategoryIcon className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-semibold text-neutral-700">
                        {TASK_CATEGORY_LABELS[category]}
                      </span>
                    </div>
                    {dayOrder.map((day) => {
                      const cellTasks = tasksByCategoryDay[category][day];
                      return (
                        <div
                          key={`${category}-${day}`}
                          className="min-h-[108px] rounded-lg border border-neutral-200 p-2 bg-white"
                        >
                          {cellTasks.length === 0 ? (
                            <div className="w-full h-full min-h-[80px] flex items-center justify-center">
                              <span className="text-neutral-300 text-xl">+</span>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              {cellTasks.map((task) => {
                                const slotLabel = getTimeSlotLabel(
                                  task.timeSlot || getCategoryDefaultTimeSlot(task.category)
                                );
                                const done = task.status === 'done';
                                return (
                                  <div
                                    key={task.id}
                                    className="flex items-start gap-1.5 text-[10px] leading-tight"
                                  >
                                    <div
                                      className={`w-3.5 h-3.5 rounded border shrink-0 mt-0.5 flex items-center justify-center ${
                                        done
                                          ? 'bg-success border-success'
                                          : 'border-neutral-400'
                                      }`}
                                    >
                                      {done && <CheckCircle2 className="w-3 h-3 text-text-primary" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p
                                        className={`font-medium truncate ${
                                          done ? 'text-neutral-400 line-through' : 'text-neutral-700'
                                        }`}
                                      >
                                        {task.focus}
                                      </p>
                                      <div className="flex flex-wrap items-center gap-1 mt-0.5">
                                        <span
                                          className={`text-[9px] px-1 rounded text-text-primary ${categoryColor.solid}`}
                                        >
                                          {slotLabel}
                                        </span>
                                        <span className="text-[9px] text-neutral-400 tabular-nums">
                                          {task.duration}
                                        </span>
                                      </div>
                                      {task.materials.length > 0 && (
                                        <p className="text-[9px] text-neutral-400 truncate mt-0.5">
                                          {task.materials.slice(0, 2).join(' · ')}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer notes */}
          <div className="mt-6 pt-5 border-t-2 border-neutral-200">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-semibold text-neutral-700 mb-2">本周备注 / 家长签名</p>
                <div className="h-20 rounded-lg border border-neutral-200 bg-neutral-50" />
              </div>
              <div>
                <p className="text-xs font-semibold text-neutral-700 mb-2">下周调整 / 老师寄语</p>
                <div className="h-20 rounded-lg border border-neutral-200 bg-neutral-50" />
              </div>
            </div>
            <p className="text-[10px] text-neutral-400 text-center mt-4">
              趣学伴 · 让成长清晰可见 · {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-5 space-y-2">
        {!exportedUrl ? (
          <button
            onClick={handleExport}
            disabled={exporting}
            className="w-full py-3 rounded-lg bg-primary text-text-primary font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {exporting ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                生成中...
              </>
            ) : (
              <>
                <Share2 className="w-5 h-5" />
                生成 A4 打卡表
              </>
            )}
          </button>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleDownload}
              className="py-3 rounded-lg bg-success/10 border border-success/20 text-success font-medium hover:bg-success/20 transition-colors flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" />
              下载图片
            </button>
            <button
              onClick={handlePrint}
              className="py-3 rounded-lg bg-surface-elevated border border-border-default text-text-secondary font-medium hover:bg-surface-highlight transition-colors flex items-center justify-center gap-2"
            >
              <Printer className="w-5 h-5" />
              打印
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
}
