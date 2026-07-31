'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, MapPin, Target } from 'lucide-react';
import Link from 'next/link';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

const mapVariants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] },
  },
};

const routes = [
  { id: 'sg', name: '三公冲刺', color: '#ff2d6a', y: 80, active: true },
  { id: 'dual', name: '双轨维持', color: '#8b5cf6', y: 140, active: false },
  { id: 'public', name: '公办直升', color: '#06b6d4', y: 200, active: false },
];

const checkpoints = [
  { x: 120, label: '一升二', status: 'current' },
  { x: 260, label: '二年级', status: 'upcoming' },
  { x: 400, label: '三年级', status: 'upcoming' },
  { x: 540, label: '四年级', status: 'upcoming' },
  { x: 680, label: '五年级', status: 'upcoming' },
  { x: 820, label: '小升初', status: 'event' },
];

const stats = [
  { value: '3+', label: '升学阶段' },
  { value: '12+', label: '关键路线' },
  { value: '60+', label: '重要节点' },
];

export default function HeroV2() {
  const shouldReduceMotion = useReducedMotion();
  const motionProps = shouldReduceMotion
    ? { animate: { opacity: 1, y: 0, x: 0, scale: 1 } }
    : {};

  return (
    <section
      className="relative min-h-[85vh] flex items-center overflow-hidden pt-14"
      aria-label="首页首屏"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-[0.18]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,45,106,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,45,106,0.04) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
        <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <motion.div
            variants={shouldReduceMotion ? undefined : containerVariants}
            initial={shouldReduceMotion ? false : 'hidden'}
            animate="visible"
            className="pt-8 lg:pt-0"
          >
            <motion.div
              variants={shouldReduceMotion ? undefined : itemVariants}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-white/10 bg-white/[0.03] mb-6"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-[11px] font-medium tracking-wide text-slate-400 uppercase">
                上海家长专属的升学执行系统
              </span>
            </motion.div>

            <motion.h1
              variants={shouldReduceMotion ? undefined : itemVariants}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold font-display leading-[1.05] tracking-tight mb-5"
            >
              <span className="text-white">趣学伴</span>
              <span className="block text-xl sm:text-2xl lg:text-3xl font-medium text-slate-500 mt-3 leading-snug">
                一张图，看清孩子
                <br />
                从小学到高考的每一步
              </span>
            </motion.h1>

            <motion.p
              variants={shouldReduceMotion ? undefined : itemVariants}
              className="text-sm sm:text-base text-slate-400 max-w-md mb-8 leading-relaxed"
            >
              三公、摇号、对口、自招、名额分配到校……所有路线、关键节点、执行进度，全部心中有数。
            </motion.p>

            <motion.div variants={shouldReduceMotion ? undefined : itemVariants}>
              <Link
                href="/login"
                className="group inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-white font-semibold text-sm hover:shadow-[0_0_40px_rgba(255,45,106,0.35)] transition-all duration-300 focus-ring"
              >
                免费绘制升学地图
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>

            <motion.div
              variants={shouldReduceMotion ? undefined : itemVariants}
              className="mt-10 flex items-center gap-8 sm:gap-10"
            >
              {stats.map((stat) => (
                <div key={stat.label}>
                  <div className="text-xl sm:text-2xl font-bold font-display text-white tabular-nums">
                    {stat.value}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            variants={shouldReduceMotion ? undefined : mapVariants}
            initial={shouldReduceMotion ? false : 'hidden'}
            animate="visible"
            className="relative hidden lg:block"
          >
            <div className="relative rounded-2xl border border-white/10 bg-white/[0.02] p-5 corner-accent overflow-hidden backdrop-blur-sm">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <Target className="w-3.5 h-3.5 text-primary" aria-hidden="true" />
                  <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                    升学规划图 · 2025-2030
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-40" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                  </span>
                  <span className="text-[11px] font-mono text-primary">LIVE</span>
                </div>
              </div>

              <svg viewBox="0 0 900 300" className="w-full h-auto" aria-label="升学路线示意图">
                <defs>
                  <pattern id="heroGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path
                      d="M 40 0 L 0 0 0 40"
                      fill="none"
                      stroke="rgba(255,255,255,0.03)"
                      strokeWidth="1"
                    />
                  </pattern>
                  <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#ff2d6a" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#ff5c8a" stopOpacity="0.3" />
                  </linearGradient>
                </defs>
                <rect width="900" height="300" fill="url(#heroGrid)" />

                <line
                  x1="60"
                  y1="260"
                  x2="860"
                  y2="260"
                  stroke="rgba(255,255,255,0.08)"
                  strokeWidth="1"
                />
                {checkpoints.map((cp) => (
                  <g key={cp.label}>
                    <line
                      x1={cp.x}
                      y1="255"
                      x2={cp.x}
                      y2="265"
                      stroke="rgba(255,255,255,0.15)"
                      strokeWidth="1"
                    />
                    <text
                      x={cp.x}
                      y="285"
                      textAnchor="middle"
                      fill="#6b6b7b"
                      fontSize="11"
                      fontFamily="var(--font-mono)"
                    >
                      {cp.label}
                    </text>
                  </g>
                ))}

                {routes.map((route) => (
                  <g key={route.id}>
                    <motion.path
                      d={`M 80 ${route.y} Q 250 ${route.y - 16}, 450 ${route.y} T 820 ${route.y}`}
                      fill="none"
                      stroke={route.active ? 'url(#routeGradient)' : route.color}
                      strokeWidth={route.active ? 2.5 : 1.5}
                      strokeOpacity={route.active ? 1 : 0.2}
                      strokeDasharray={route.active ? undefined : '5 5'}
                      initial={shouldReduceMotion ? { pathLength: 1 } : { pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1.5, delay: 0.6, ease: 'easeInOut' }}
                    />
                    <text
                      x="45"
                      y={route.y + 4}
                      textAnchor="end"
                      fill={route.active ? route.color : 'rgba(255,255,255,0.35)'}
                      fontSize="11"
                      fontFamily="var(--font-body)"
                    >
                      {route.name}
                    </text>
                  </g>
                ))}

                {checkpoints.map((cp, index) => (
                  <motion.g
                    key={cp.label}
                    initial={shouldReduceMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1 + index * 0.1, duration: 0.35 }}
                  >
                    {cp.status === 'current' && (
                      <circle
                        cx={cp.x}
                        cy={80}
                        r="10"
                        fill="none"
                        stroke="#ff2d6a"
                        strokeWidth="1"
                        opacity="0.35"
                      >
                        <animate
                          attributeName="r"
                          from="10"
                          to="20"
                          dur="2s"
                          repeatCount="indefinite"
                        />
                        <animate
                          attributeName="opacity"
                          from="0.35"
                          to="0"
                          dur="2s"
                          repeatCount="indefinite"
                        />
                      </circle>
                    )}
                    <circle
                      cx={cp.x}
                      cy={80}
                      r={cp.status === 'current' ? 5 : 3.5}
                      fill={cp.status === 'current' ? '#ff2d6a' : '#1a1a28'}
                      stroke={cp.status === 'current' ? '#ff2d6a' : 'rgba(255,255,255,0.25)'}
                      strokeWidth="2"
                    />
                  </motion.g>
                ))}

                <motion.g
                  initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.8, duration: 0.4 }}
                >
                  <rect
                    x="92"
                    y="42"
                    width="110"
                    height="26"
                    rx="4"
                    fill="rgba(255,45,106,0.08)"
                    stroke="rgba(255,45,106,0.25)"
                  />
                  <MapPin x="108" y="53" className="w-3 h-3 text-primary" />
                  <text
                    x="155"
                    y="59"
                    textAnchor="middle"
                    fill="#ff8aa8"
                    fontSize="11"
                    fontFamily="var(--font-mono)"
                  >
                    当前位置
                  </text>
                </motion.g>
              </svg>

              <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-4">
                  <span className="text-slate-500">
                    主路线: <span className="text-primary">三公冲刺型</span>
                  </span>
                  <span className="text-slate-500 hidden sm:inline">
                    下一节点: <span className="text-white">二年级末 · 基础检查</span>
                  </span>
                </div>
                <span className="font-mono text-slate-600">423 DAYS REMAINING</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        aria-hidden="true"
      >
        <span className="text-[10px] text-slate-600 uppercase tracking-widest">Scroll</span>
        <motion.div
          animate={shouldReduceMotion ? { y: 0 } : { y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="w-5 h-8 rounded-full border border-white/10 flex items-start justify-center p-1.5"
        >
          <div className="w-1 h-1.5 rounded-full bg-primary" />
        </motion.div>
      </motion.div>
    </section>
  );
}
