'use client';

import { motion } from 'framer-motion';
import { Calendar, CheckCircle2, Clock, BookOpen, Feather, ScrollText, Pencil } from 'lucide-react';
import { getChinesePlanByGrade, type WeeklyTask } from '@/lib/subjects/chinese';

const dayNames = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

function getSkillIcon(focus: string) {
  if (focus.includes('古诗') || focus.includes('古文') || focus.includes('经典')) return ScrollText;
  if (focus.includes('阅读') || focus.includes('读书')) return BookOpen;
  if (focus.includes('写作') || focus.includes('作文') || focus.includes('写话') || focus.includes('写作')) return Feather;
  if (focus.includes('写字') || focus.includes('汉字') || focus.includes('练字')) return Pencil;
  if (focus.includes('面谈') || focus.includes('表达') || focus.includes('话题')) return ScrollText;
  return BookOpen;
}

export default function ChineseTodayTasks({ grade }: { grade: number }) {
  const plan = getChinesePlanByGrade(grade);
  const today = new Date().getDay();
  const todayName = dayNames[today];
  const todayTask = plan.weeklyTemplate.find((t) => t.day === todayName);

  if (!todayTask) return null;

  const SkillIcon = getSkillIcon(todayTask.focus);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-2xl p-6 border border-primary/20 relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, rgba(244,63,94,0.08) 0%, rgba(20,184,166,0.08) 100%)',
        boxShadow: '0 0 30px rgba(244,63,94,0.1), inset 0 0 20px rgba(244,63,94,0.05)',
      }}
    >
      {/* Animated border */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(244,63,94,0.3), rgba(20,184,166,0.3), transparent)',
          backgroundSize: '200% 100%',
        }}
        animate={{ backgroundPosition: ['200% 0', '-200% 0'] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
      />
      <div className="absolute inset-[1px] rounded-2xl bg-surface/80 pointer-events-none" />

      <div className="relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: 'rgba(244,63,94,0.15)', boxShadow: '0 0 20px rgba(244,63,94,0.3)' }}
            >
              <Calendar className="w-6 h-6 text-warning" style={{ filter: 'drop-shadow(0 0 8px rgba(244,63,94,0.8))' }} />
            </div>
            <div>
              <h2 className="text-xl font-bold font-display">今天语文任务</h2>
              <p className="text-sm text-text-tertiary">{todayName} · {plan.grade}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-elevated border border-border-default">
            <Clock className="w-4 h-4 text-text-tertiary" />
            <span className="text-sm text-text-secondary">{todayTask.duration}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Main task */}
          <div className="lg:col-span-2 rounded-xl bg-surface-elevated border border-border-default p-5">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-surface-elevated border border-border-default flex items-center justify-center shrink-0">
                <SkillIcon className="w-6 h-6 text-text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-lg font-bold text-text-secondary mb-2">{todayTask.focus}</p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {todayTask.materials.map((material) => (
                    <span
                      key={material}
                      className="px-2 py-1 rounded-md bg-surface-elevated border border-border-default text-xs text-text-secondary"
                    >
                      {material}
                    </span>
                  ))}
                </div>
                <p className="text-sm text-text-muted">
                  建议分 1-2 个时段完成，不要一次做太久。完成后在下方勾选。
                </p>
              </div>
            </div>
          </div>

          {/* Quick checklist */}
          <div className="rounded-xl bg-surface-elevated border border-border-default p-5">
            <p className="text-sm font-medium text-text-secondary mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-success" />
              完成检查
            </p>
            <div className="space-y-2">
              {[
                '完成今日主任务',
                '字词/诗句掌握 80%+',
                '遇到不会的标记错题',
              ].map((item, index) => (
                <label
                  key={index}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-surface-elevated cursor-pointer transition-colors"
                >
                  <input type="checkbox" className="w-4 h-4 rounded border-border-default bg-transparent text-primary focus:ring-primary/50" />
                  <span className="text-sm text-text-tertiary">{item}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
