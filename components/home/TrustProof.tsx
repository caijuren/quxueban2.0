'use client';

import { motion } from 'framer-motion';

const stats = [
  { value: '10+', label: '升学路线模板' },
  { value: '50+', label: '目标学校库' },
  { value: '100+', label: '种子家庭使用' },
];

const testimonials = [
  {
    content: '以前总觉得三公离我们很远，用了趣学伴后才发现，原来每个年级都有明确的准备节点。',
    author: '嘉定区 · 二年级家长',
  },
  {
    content: '终于不用在群里翻聊天记录找政策了，所有时间点和任务都清清楚楚。',
    author: '浦东新区 · 四年级家长',
  },
];

export default function TrustProof() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-16"
        >
          <span className="text-xs font-mono text-primary uppercase tracking-widest mb-4 block">
            Trust
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold font-display leading-tight mb-6">
            已有家长把焦虑
            <br />
            <span className="text-slate-500">变成行动力</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="border-b border-white/10 pb-8 lg:border-b-0 lg:pb-0"
            >
              <div className="text-5xl sm:text-6xl font-black font-display text-white mb-2">{stat.value}</div>
              <div className="text-sm text-slate-500">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="relative pl-6 border-l-2 border-primary/30"
            >
              <p className="text-lg text-slate-300 leading-relaxed mb-4 font-display">&ldquo;{item.content}&rdquo;</p>
              <p className="text-sm text-slate-500 font-mono">{item.author}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
