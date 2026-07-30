'use client';

import { motion } from 'framer-motion';
import { Calendar, CheckCircle2, Clock, BookOpen, Calculator, FunctionSquare, Award, ClipboardList, Gamepad2, Shapes, Sparkles, HelpCircle } from 'lucide-react';
import { getMathPlanByGrade, type WeeklyTask } from '@/lib/subjects/math';

const dayNames = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

function getSkillIcon(focus: string) {
  if (focus.includes('计算')) return Calculator;
  if (focus.includes('奥数') || focus.includes('模块') || focus.includes('AMC8 知识点')) return FunctionSquare;
  if (focus.includes('校内')) return BookOpen;
  if (focus.includes('应用题')) return HelpCircle;
  if (focus.includes('袋鼠') || focus.includes('澳洲 AMC') || focus.includes('AMC8 真题') || focus.includes('AMC8 模拟') || focus.includes('AMC8 首考') || focus.includes('AMC8 二考') || focus.includes('AMC8 最终') || focus.includes('AMC8 全真') || focus.includes('AMC8 高频') || focus.includes('AMC8 专题')) return Award;
  if (focus.includes('错题') || focus.includes('复习')) return ClipboardList;
  if (focus.includes('游戏')) return Gamepad2;
  if (focus.includes('图形')) return Shapes;
  if (focus.includes('趣味')) return Sparkles;
  return Calculator;
}

export default function MathTodayTasks({ grade }: { grade: number }) {
  const plan = getMathPlanByGrade(grade);
  const today = new Date().getDay();
  const todayName = dayNames[today];
  const todayTask = plan.weeklyTemplate.find((t: WeeklyTask) => t.day === todayName);

  if (!todayTask) return null;

  const SkillIcon = getSkillIcon(todayTask.focus);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-2xl p-6 border border-primary/20 relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, rgba(59,130,246,0.08) 0%, rgba(139,92,246,0.08) 100%)',
        boxShadow: '0 0 30px rgba(59,130,246,0.1), inset 0 0 20px rgba(59,130,246,0.05)',
      }}
    >
      {/* Animated border */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(59,130,246,0.3), rgba(139,92,246,0.3), transparent)',
          backgroundSize: '200% 100%',
        }}
        animate={{ backgroundPosition: ['200% 0', '-200% 0'] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
      />
      <div className="absolute inset-[1px] rounded-2xl bg-slate-950/80 pointer-events-none" />

      <div className="relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: 'rgba(59,130,246,0.15)', boxShadow: '0 0 20px rgba(59,130,246,0.3)' }}
            >
              <Calendar className="w-6 h-6 text-blue-400" style={{ filter: 'drop-shadow(0 0 8px rgba(59,130,246,0.8))' }} />
            </div>
            <div>
              <h2 className="text-xl font-bold font-display">今天数学任务</h2>
              <p className="text-sm text-slate-400">{todayName} · {plan.grade}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
            <Clock className="w-4 h-4 text-slate-400" />
            <span className="text-sm text-slate-300">{todayTask.duration}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Main task */}
          <div className="lg:col-span-2 rounded-xl bg-white/5 border border-white/10 p-5">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center shrink-0">
                <SkillIcon className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-lg font-bold text-slate-200 mb-2">{todayTask.focus}</p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {todayTask.materials.map((material: string) => (
                    <span
                      key={material}
                      className="px-2 py-1 rounded-md bg-white/5 border border-white/10 text-xs text-slate-300"
                    >
                      {material}
                    </span>
                  ))}
                </div>
                <p className="text-sm text-slate-500">
                  建议分 1-2 个时段完成，不要一次做太久。完成后在下方勾选。
                </p>
              </div>
            </div>
          </div>

          {/* Quick checklist */}
          <div className="rounded-xl bg-white/5 border border-white/10 p-5">
            <p className="text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-success" />
              完成检查
            </p>
            <div className="space-y-2">
              {[
                '完成今日主任务',
                '练习正确率 80%+',
                '遇到不会的标记错题',
              ].map((item, index) => (
                <label
                  key={index}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer transition-colors"
                >
                  <input type="checkbox" className="w-4 h-4 rounded border-white/20 bg-transparent text-primary focus:ring-primary/50" />
                  <span className="text-sm text-slate-400">{item}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
