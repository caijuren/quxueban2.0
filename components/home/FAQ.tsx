'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';
import MotionSection from '@/components/ui/MotionSection';

const faqs = [
  {
    question: '趣学伴适合几年级的孩子使用？',
    answer:
      '目前主要覆盖小学到初中阶段，重点服务小升初和中考规划。无论你是一年级刚开始规划，还是五年级面临三公/摇号冲刺，都可以使用。',
  },
  {
    question: '数据会保存在哪里？安全吗？',
    answer:
      '当前版本数据保存在浏览器本地（localStorage），无需上传服务器，换设备时可以通过导出/导入迁移。后续会推出云端同步功能。',
  },
  {
    question: '现在使用是免费的吗？',
    answer:
      '当前是原型验证阶段，所有功能免费开放给种子家庭使用。后续商业化时会提前通知，并保留核心功能的免费体验。',
  },
  {
    question: 'AI 诊断需要输入很多信息吗？',
    answer:
      '不需要。你只需要输入孩子当前年级、目标学校类型和几项关键能力进度，AI 就会基于上海升学政策给出诊断建议。',
  },
  {
    question: '可以同时管理多个孩子吗？',
    answer:
      '可以。系统支持为每个孩子建立独立档案，路线、计划、里程碑、进度完全隔离，方便二胎家庭分别管理。',
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="border-t border-border-subtle px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <MotionSection direction="up" duration={0.6} className="mb-12">
          <span className="mb-3 block font-mono text-[11px] uppercase tracking-widest text-primary">
            FAQ
          </span>
          <h2 className="font-display text-3xl font-bold leading-tight sm:text-4xl">常见问题</h2>
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
                className="overflow-hidden rounded-xl border border-border-subtle bg-surface transition-colors duration-200 hover:border-border-default"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="focus-visible:ring-primary/55 flex w-full items-center justify-between p-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${index}`}
                >
                  <span className="pr-4 text-sm font-medium text-text-primary">{faq.question}</span>
                  <span
                    className={`flex size-7 shrink-0 items-center justify-center rounded-lg transition-colors duration-200 ${
                      isOpen
                        ? 'bg-primary text-text-primary'
                        : 'bg-surface-hover text-text-tertiary'
                    }`}
                    aria-hidden="true"
                  >
                    {isOpen ? <Minus className="size-4" /> : <Plus className="size-4" />}
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
                      <div className="border-t border-border-subtle px-4 pb-4 pt-3 text-xs leading-relaxed text-text-tertiary">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </MotionSection>
            );
          })}
        </div>
      </div>
    </section>
  );
}
