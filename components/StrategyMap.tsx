'use client';

import { motion } from 'framer-motion';
import { School, GraduationCap, Trophy } from 'lucide-react';

interface RouteOption {
  name: string;
  status: 'active' | 'backup' | 'optional';
}

interface Stage {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  timeRange: string;
  routes: RouteOption[];
}

const stages: Stage[] = [
  {
    id: 'primary',
    title: '小升初',
    subtitle: '一升二 · 路线选择窗口期',
    icon: School,
    timeRange: '现在 - 五年级',
    routes: [
      { name: '三公冲刺', status: 'active' },
      { name: '私立摇号', status: 'backup' },
      { name: '公办对口/直升', status: 'backup' },
    ],
  },
  {
    id: 'middle',
    title: '中考',
    subtitle: '初中三年 · 关键分水岭',
    icon: GraduationCap,
    timeRange: '六年级 - 初三',
    routes: [
      { name: '名额分配到区', status: 'optional' },
      { name: '名额分配到校', status: 'optional' },
      { name: '自主招生', status: 'optional' },
      { name: '统一招生', status: 'optional' },
    ],
  },
  {
    id: 'high',
    title: '高考',
    subtitle: '高中三年 · 冲刺目标大学',
    icon: Trophy,
    timeRange: '高一 - 高三',
    routes: [
      { name: '强基计划', status: 'optional' },
      { name: '综合评价', status: 'optional' },
      { name: '统一高考', status: 'optional' },
    ],
  },
];

const statusConfig = {
  active: { label: '主路线', className: 'text-primary bg-primary/10 border-primary/20' },
  backup: { label: '备选', className: 'text-warning bg-warning/10 border-warning/20' },
  optional: { label: '待解锁', className: 'text-slate-400 bg-surface border-white/5' },
};

export default function StrategyMap() {
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
            Full Journey
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold font-display leading-tight mb-6">
            覆盖上海升学
            <br />
            <span className="text-slate-500">全阶段路线</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl">
            从小学入学到高考，每个关键节点的路线选择都帮你梳理清楚。
          </p>
        </motion.div>

        <div className="space-y-6">
          {stages.map((stage, index) => (
            <motion.div
              key={stage.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="group rounded-2xl border border-white/5 bg-surface/30 p-6 sm:p-8 hover:border-primary/20 transition-colors duration-300"
            >
              <div className="flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-12">
                {/* Stage header */}
                <div className="flex items-center gap-4 lg:w-72 shrink-0">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <stage.icon className="w-7 h-7 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold font-display">{stage.title}</h3>
                    <p className="text-sm text-slate-500 mt-1">{stage.subtitle}</p>
                    <span className="inline-block mt-2 text-xs font-mono text-slate-600">{stage.timeRange}</span>
                  </div>
                </div>

                {/* Routes */}
                <div className="flex flex-wrap gap-3 flex-1">
                  {stage.routes.map((route) => {
                    const config = statusConfig[route.status];
                    return (
                      <div
                        key={route.name}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium ${config.className}`}
                      >
                        <span>{route.name}</span>
                        <span className="text-xs opacity-70">{config.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
