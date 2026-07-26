'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

const mapVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] },
  },
};

const routes = [
  { id: 'sg', name: '三公冲刺', color: '#ff2d6a', y: 90, active: true },
  { id: 'dual', name: '双轨维持', color: '#8b5cf6', y: 160, active: false },
  { id: 'public', name: '公办直升', color: '#06b6d4', y: 230, active: false },
];

const checkpoints = [
  { x: 120, y: 90, label: '一升二', status: 'current' },
  { x: 260, y: 90, label: '二年级', status: 'upcoming' },
  { x: 400, y: 90, label: '三年级', status: 'upcoming' },
  { x: 540, y: 90, label: '四年级', status: 'upcoming' },
  { x: 680, y: 90, label: '五年级', status: 'upcoming' },
  { x: 820, y: 90, label: '小升初', status: 'event' },
];

export default function HeroV2() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-16">
      {/* Tactical grid overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,45,106,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,45,106,0.03) 1px, transparent 1px)',
            backgroundSize: '80px 80px',
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Left: Text content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="pt-8 lg:pt-0"
          >
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-white/10 bg-surface/50 mb-8"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-xs font-medium tracking-wide text-slate-400 uppercase">
                上海家长专属的升学执行系统
              </span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-6xl sm:text-7xl lg:text-8xl xl:text-9xl font-black font-display leading-[0.9] tracking-tight mb-6"
            >
              <span className="block text-white">趣学伴</span>
              <span className="block text-3xl sm:text-4xl lg:text-5xl font-medium text-slate-500 mt-4 leading-tight">
                一张图，看清孩子
                <br />
                从小学到高考的每一步
              </span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-base sm:text-lg text-slate-400 max-w-lg mb-10 leading-relaxed"
            >
              三公、摇号、对口、自招、名额分配到校……所有路线、关键节点、执行进度，全部心中有数。
            </motion.p>

            <motion.div variants={itemVariants}>
              <Link href="/login">
                <button className="group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-primary text-white font-semibold text-lg hover:shadow-[0_0_50px_rgba(255,45,106,0.4)] transition-all duration-300">
                  免费绘制升学地图
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
            </motion.div>

            {/* Quick stats */}
            <motion.div
              variants={itemVariants}
              className="mt-16 flex items-center gap-8 sm:gap-12"
            >
              {[
                { value: '3+', label: '升学阶段' },
                { value: '12+', label: '关键路线' },
                { value: '60+', label: '重要节点' },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-2xl sm:text-3xl font-bold font-display text-white">
                    {stat.value}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right: Tactical roadmap map */}
          <motion.div
            variants={mapVariants}
            initial="hidden"
            animate="visible"
            className="relative hidden lg:block"
          >
            <div className="relative rounded-2xl border border-white/10 bg-surface/30 p-6 corner-accent overflow-hidden">
              {/* Map header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span className="text-xs font-mono text-slate-400">ROADMAP // 2025-2030</span>
                </div>
                <span className="text-xs font-mono text-primary">LIVE</span>
              </div>

              {/* SVG Map */}
              <svg viewBox="0 0 900 320" className="w-full h-auto">
                {/* Grid */}
                <defs>
                  <pattern id="heroGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path
                      d="M 40 0 L 0 0 0 40"
                      fill="none"
                      stroke="rgba(255,255,255,0.03)"
                      strokeWidth="1"
                    />
                  </pattern>
                </defs>
                <rect width="900" height="320" fill="url(#heroGrid)" />

                {/* Time axis */}
                <line x1="60" y1="280" x2="860" y2="280" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                {checkpoints.map((cp, index) => (
                  <g key={cp.label}>
                    <line
                      x1={cp.x}
                      y1="275"
                      x2={cp.x}
                      y2="285"
                      stroke="rgba(255,255,255,0.2)"
                      strokeWidth="1"
                    />
                    <text
                      x={cp.x}
                      y="305"
                      textAnchor="middle"
                      fill="#6b6b7b"
                      fontSize="11"
                      fontFamily="var(--font-mono)"
                    >
                      {cp.label}
                    </text>
                  </g>
                ))}

                {/* Routes */}
                {routes.map((route) => (
                  <g key={route.id}>
                    <motion.path
                      d={`M 80 ${route.y} Q 250 ${route.y - 20}, 450 ${route.y} T 820 ${route.y}`}
                      fill="none"
                      stroke={route.color}
                      strokeWidth={route.active ? 3 : 1.5}
                      strokeOpacity={route.active ? 0.8 : 0.25}
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1.5, delay: 0.8, ease: 'easeInOut' }}
                    />
                    <text
                      x="40"
                      y={route.y + 4}
                      textAnchor="end"
                      fill={route.active ? route.color : 'rgba(255,255,255,0.4)'}
                      fontSize="11"
                      fontFamily="var(--font-body)"
                    >
                      {route.name}
                    </text>
                  </g>
                ))}

                {/* Checkpoints */}
                {checkpoints.map((cp, index) => (
                  <motion.g
                    key={cp.label}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.2 + index * 0.15, duration: 0.4 }}
                  >
                    {cp.status === 'current' && (
                      <circle
                        cx={cp.x}
                        cy={90}
                        r="12"
                        fill="none"
                        stroke="#ff2d6a"
                        strokeWidth="1"
                        opacity="0.4"
                      >
                        <animate
                          attributeName="r"
                          from="12"
                          to="24"
                          dur="2s"
                          repeatCount="indefinite"
                        />
                        <animate
                          attributeName="opacity"
                          from="0.4"
                          to="0"
                          dur="2s"
                          repeatCount="indefinite"
                        />
                      </circle>
                    )}
                    <circle
                      cx={cp.x}
                      cy={90}
                      r={cp.status === 'current' ? 6 : 4}
                      fill={cp.status === 'current' ? '#ff2d6a' : '#1a1a28'}
                      stroke={cp.status === 'current' ? '#ff2d6a' : 'rgba(255,255,255,0.3)'}
                      strokeWidth="2"
                    />
                  </motion.g>
                ))}

                {/* Current position label */}
                <motion.g
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2, duration: 0.5 }}
                >
                  <rect x="85" y="45" width="120" height="28" rx="4" fill="rgba(255,45,106,0.1)" stroke="rgba(255,45,106,0.3)" />
                  <text x="145" y="64" textAnchor="middle" fill="#ff2d6a" fontSize="11" fontFamily="var(--font-mono)">
                    当前位置
                  </text>
                </motion.g>
              </svg>

              {/* Bottom status bar */}
              <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-4">
                  <span className="text-slate-500">
                    主路线: <span className="text-primary">三公冲刺型</span>
                  </span>
                  <span className="text-slate-500">
                    下一节点: <span className="text-white">二年级末 · 基础检查</span>
                  </span>
                </div>
                <span className="font-mono text-slate-600">423 DAYS REMAINING</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-xs text-slate-600 uppercase tracking-widest">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="w-5 h-8 rounded-full border border-white/10 flex items-start justify-center p-1.5"
        >
          <div className="w-1 h-2 rounded-full bg-primary" />
        </motion.div>
      </motion.div>
    </section>
  );
}
