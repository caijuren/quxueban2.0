'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function FinalCTA() {
  return (
    <section className="py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto text-center relative z-10"
      >
        <h2 className="text-4xl sm:text-6xl lg:text-7xl font-black font-display leading-tight mb-8">
          现在就为孩子绘制
          <br />
          <span className="text-slate-500">第一张升学作战图</span>
        </h2>

        <p className="text-lg text-slate-400 max-w-xl mx-auto mb-12">
          不需要复杂设置，5 分钟建立孩子档案，立刻看到当前阶段的关键任务和路线建议。
        </p>

        <Link href="/login">
          <button className="group inline-flex items-center gap-3 px-10 py-5 rounded-full bg-primary text-white font-semibold text-lg hover:shadow-[0_0_60px_rgba(255,45,106,0.4)] transition-all duration-300">
            免费开始规划
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </Link>
      </motion.div>
    </section>
  );
}
