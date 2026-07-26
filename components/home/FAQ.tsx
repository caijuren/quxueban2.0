'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

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
    <section className="py-24 px-4 sm:px-6 lg:px-8 border-t border-white/5">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-16"
        >
          <span className="text-xs font-mono text-primary uppercase tracking-widest mb-4 block">
            FAQ
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold font-display leading-tight">
            常见问题
          </h2>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="border border-white/5 rounded-xl overflow-hidden hover:border-white/10 transition-colors duration-300"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <span className="font-medium text-slate-200 pr-4">{faq.question}</span>
                  <span className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-300 ${isOpen ? 'bg-primary text-white' : 'bg-surface text-slate-400'}`}>
                    {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="px-5 pb-5 text-sm text-slate-400 leading-relaxed border-t border-white/5 pt-4">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
