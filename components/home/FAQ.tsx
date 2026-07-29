'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';
import MotionSection from '@/components/ui/MotionSection';

const faqs = [
  {
    question: '趣学伴适合几年级的孩子使用？',
    answer: '目前主要覆盖小学到初中阶段，重点服务小升初和中考规划。无论你是一年级刚开始规划，还是五年级面临三公/摇号冲刺，都可以使用。',
  },
  {
    question: '数据会保存在哪里？安全吗？',
    answer: '当前版本数据保存在浏览器本地（localStorage），无需上传服务器，换设备时可以通过导出/导入迁移。后续会推出云端同步功能。',
  },
  {
    question: '现在使用是免费的吗？',
    answer: '当前是原型验证阶段，所有功能免费开放给种子家庭使用。后续商业化时会提前通知，并保留核心功能的免费体验。',
  },
  {
    question: 'AI 检视需要输入很多信息吗？',
    answer: '不需要。你只需要输入孩子当前年级、目标学校类型和几项关键能力进度，AI 就会基于上海升学政策给出诊断建议。',
  },
  {
    question: '可以同时管理多个孩子吗？',
    answer: '可以。系统支持为每个孩子建立独立档案，路线、计划、里程碑、进度完全隔离，方便二胎家庭分别管理。',
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-14 px-4 sm:px-6 lg:px-8 border-t border-border-default/50">
      <div className="max-w-3xl mx-auto">
        <MotionSection direction="up" duration={0.6} className="mb-12">
          <div className="flex items-center gap-2 mb-3">
            <span className="indicator-dot" />
            <span className="text-micro font-mono text-primary uppercase tracking-widest">
              FAQ
            </span>
          </div>
          <h2 className="text-h2 font-display">常见问题</h2>
        </MotionSection>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <MotionSection
                key={index}
                direction="up"
                delay={index * 0.05}
                duration={0.4}
              >
                <div className="hud-panel hud-panel-hover overflow-hidden">
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="w-full flex items-center justify-between p-4 text-left focus-ring"
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${index}`}
                  >
                    <span className="text-body font-medium text-text-secondary pr-4">{faq.question}</span>
                    <span
                      className={`shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition-colors duration-200 ${
                        isOpen ? 'bg-primary text-white' : 'bg-white/[0.05] text-text-tertiary'
                      }`}
                      aria-hidden="true"
                    >
                      {isOpen ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={`faq-answer-${index}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="px-4 pb-4 text-small text-text-tertiary leading-relaxed border-t border-white/[0.06] pt-3">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </MotionSection>
            );
          })}
        </div>
      </div>
    </section>
  );
}
