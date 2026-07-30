'use client';

import { motion } from 'framer-motion';
import { Brain, Sparkles, ChevronRight, Zap } from 'lucide-react';
import Link from 'next/link';

interface AIDiagnosisCardProps {
  subject: 'english' | 'math' | 'chinese';
  childName?: string;
}

const subjectLabels: Record<string, string> = {
  english: '英语',
  math: '数学',
  chinese: '语文',
};

const insights: Record<string, string[]> = {
  english: ['RAZ 当前级别与目标差距', 'KET/PET/小托福备考节奏', '口语/书写弱项提升建议'],
  math: ['奥数进度与 AMC8 目标匹配度', '计算速度与准确率分析', '竞赛时间规划建议'],
  chinese: ['古诗文积累进度评估', '输出能力训练重点', '竞赛荣誉规划建议'],
};

export default function AIDiagnosisCard({ subject, childName = '孩子' }: AIDiagnosisCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="rounded-2xl relative overflow-hidden border border-white/5"
      style={{
        background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(59, 130, 246, 0.08) 100%)',
      }}
    >
      {/* Background glow */}
      <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-secondary/20 blur-3xl" />
      <div className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-secondary to-violet-400 flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div className="px-2 py-0.5 rounded-md bg-secondary/10 text-secondary text-xs border border-secondary/20 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                AI 智能诊断
              </div>
            </div>
            <h2 className="text-xl font-bold font-display mb-2">
              {subjectLabels[subject]}学科 AI 诊断
            </h2>
            <p className="text-sm text-slate-400 mb-4">
              基于 {childName} 的当前进度、打卡记录和弱项，AI 将给出个性化的学习调整建议。
            </p>

            <div className="flex flex-wrap gap-2 mb-5">
              {insights[subject].map((item) => (
                <span
                  key={item}
                  className="px-3 py-1.5 rounded-lg bg-white/[0.05] border border-white/5 text-xs text-slate-300 flex items-center gap-1.5"
                >
                  <Zap className="w-3 h-3 text-warning" />
                  {item}
                </span>
              ))}
            </div>

            <Link
              href="/dashboard/ai"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-secondary to-violet-500 text-white text-sm font-medium hover:opacity-90 transition-opacity"
            >
              开始 AI 诊断
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
