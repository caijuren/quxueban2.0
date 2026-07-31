'use client';

import { motion } from 'framer-motion';
import { Sparkles, RefreshCw, AlertTriangle, CheckCircle2, Lightbulb, Calendar } from 'lucide-react';
import { useChildren } from '@/components/dashboard/ChildrenContext';
import { gradeLabel } from '@/lib/children';
import ChildEmptyState from '@/components/dashboard/ChildEmptyState';

const reportSections = [
  {
    title: '进度诊断',
    icon: CheckCircle2,
    color: 'text-success',
    items: [
      '英语能力当前 55%，高于同龄平均 10%，节奏良好',
      '语文素养 45%，与同龄平均基本持平',
      '奥数思维 20%，明显低于三公路线要求，需重点关注',
    ],
  },
  {
    title: '风险预警',
    icon: AlertTriangle,
    color: 'text-warning',
    items: [
      '三年级奥数启动时间窗口正在缩小',
      '竞赛经历目前空白，建议四年级前参加 1-2 项赛事',
      '三公路线竞争加剧，单一主路线风险较高',
    ],
  },
  {
    title: '调整建议',
    icon: Lightbulb,
    color: 'text-secondary',
    items: [
      '本月内完成 2-3 家奥数机构试听，确定学习形式',
      '保持英语优势，暑假完成 OD1 Unit 7-12，RAZ 爬坡至 Level F+',
      '同步维护私立摇号作为保底，不要全部押注三公',
    ],
  },
  {
    title: '下月重点',
    icon: Calendar,
    color: 'text-accent',
    items: [
      '确定奥数机构和上课时间',
      '完成 OD1 Unit 7-12 + RAZ 每日阅读（quiz 正确率 80%+）',
      '整理三公学校招生政策和历年面谈题',
    ],
  },
];

export default function AIPage() {
  const { currentChild } = useChildren();

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold font-display mb-2">
            {currentChild ? `${currentChild.name}的 AI 诊断` : 'AI 诊断'}
          </h1>
          <p className="text-slate-400">
            {currentChild
              ? `当前阶段：${gradeLabel(currentChild.grade, currentChild.educationSystem)} · 基于当前进度和目标生成诊断建议`
              : '基于当前进度和目标，智能生成诊断与调整建议'}
          </p>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-secondary to-secondary-glow text-white font-semibold hover:shadow-[0_0_30px_rgba(139,92,246,0.4)] transition-all duration-300">
          <RefreshCw className="w-4 h-4" />
          重新生成
        </button>
      </motion.div>

      {!currentChild && (
        <ChildEmptyState description="添加孩子后，系统会根据年级生成对应的 AI 诊断建议" />
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="rounded-2xl glass p-6 border border-secondary/20"
        style={{ boxShadow: '0 0 60px rgba(139, 92, 246, 0.1)' }}
      >
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-secondary to-secondary-glow flex items-center justify-center shrink-0">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-display mb-2">AI 综合评估</h2>
            <p className="text-slate-300 leading-relaxed">
              当前处于一升二阶段，三公冲刺方案匹配度 <span className="text-primary font-semibold">78%</span>。
              英语基础是优势，但奥数尚未启动是最大短板。建议本月内确定奥数学习形式，
              同时保持私立摇号作为备选路线，降低单一目标风险。
            </p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reportSections.map((section, index) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
            className="rounded-2xl glass p-6"
          >
            <div className="flex items-center gap-3 mb-5">
              <section.icon className={`w-6 h-6 ${section.color}`} />
              <h2 className="text-lg font-bold font-display">{section.title}</h2>
            </div>
            <ul className="space-y-3">
              {section.items.map((item, itemIndex) => (
                <li key={itemIndex} className="flex items-start gap-3 text-sm text-slate-300 leading-relaxed">
                  <span className={`w-1.5 h-1.5 rounded-full ${section.color.replace('text-', 'bg-')} mt-2 shrink-0`} />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
