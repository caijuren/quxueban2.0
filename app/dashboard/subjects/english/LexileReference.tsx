'use client';

import { motion } from 'framer-motion';
import { BookOpen, BarChart3, Award } from 'lucide-react';
import { lexileReference } from '@/lib/subjects/english';

export default function LexileReference() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.35 }}
      className="rounded-2xl glass p-6 border border-white/5"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-400 flex items-center justify-center">
          <BarChart3 className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold font-display">RAZ / 蓝思 / 证书对应参考</h2>
          <p className="text-sm text-slate-400">各 RAZ 级别对应的蓝思值和证书水平</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left py-3 px-3 text-xs font-medium text-slate-500">RAZ 级别</th>
              <th className="text-left py-3 px-3 text-xs font-medium text-slate-500">蓝思值</th>
              <th className="text-left py-3 px-3 text-xs font-medium text-slate-500">对应证书</th>
              <th className="text-left py-3 px-3 text-xs font-medium text-slate-500">阶段说明</th>
            </tr>
          </thead>
          <tbody>
            {lexileReference.map((row, index) => (
              <motion.tr
                key={row.razLevel}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.05 }}
                className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors"
              >
                <td className="py-3 px-3">
                  <span className="px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-400 text-xs border border-emerald-500/20">
                    {row.razLevel}
                  </span>
                </td>
                <td className="py-3 px-3 text-sm text-slate-300">{row.lexileRange}</td>
                <td className="py-3 px-3 text-sm text-slate-300">{row.equivalent}</td>
                <td className="py-3 px-3 text-sm text-slate-400">{row.description}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 pt-4 border-t border-white/5 flex items-start gap-3">
        <BookOpen className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <p className="text-xs text-slate-500">
          RAZ 到 K/L 后，阅读能力已足够支撑小托福 850+。后续重点是学术听力、语法和考试题型适应。
        </p>
      </div>
    </motion.div>
  );
}
