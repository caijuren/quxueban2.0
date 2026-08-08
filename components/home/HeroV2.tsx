'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Icon } from '@/components/ui/icon';
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
  { id: 'sg', name: '三公冲刺', color: 'primary', y: 80, active: true },
  { id: 'dual', name: '双轨维持', color: 'secondary', y: 140, active: false },
  { id: 'public', name: '公办直升', color: 'accent', y: 200, active: false },
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

const routeColorClass = (color: string, active: boolean) => {
  const opacity = active ? '' : '/20';
  switch (color) {
    case 'primary':
      return `text-primary${opacity}`;
    case 'secondary':
      return `text-secondary${opacity}`;
    case 'accent':
      return `text-accent${opacity}`;
    default:
      return `text-text-muted${opacity}`;
  }
};

export default function HeroV2() {
  const shouldReduceMotion = useReducedMotion();
  const motionProps = shouldReduceMotion ? { animate: { opacity: 1, y: 0, x: 0, scale: 1 } } : {};

  return (
    <section
      className="relative flex min-h-[85vh] items-center overflow-hidden pt-14"
      aria-label="首页首屏"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="bg-primary/5 absolute right-0 top-1/4 h-[500px] w-[500px] rounded-full blur-[120px]" />
        <div className="bg-secondary/5 absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <motion.div
            variants={shouldReduceMotion ? undefined : containerVariants}
            initial={shouldReduceMotion ? false : 'hidden'}
            animate="visible"
            className="pt-8 lg:pt-0"
          >
            <motion.div
              variants={shouldReduceMotion ? undefined : itemVariants}
              className="mb-6 inline-flex items-center gap-2 rounded-lg border border-border-subtle bg-surface px-3 py-1.5"
            >
              <span className="size-1.5 animate-pulse rounded-full bg-primary" />
              <span className="text-[11px] font-medium uppercase tracking-wide text-text-tertiary">
                上海家长专属的升学执行系统
              </span>
            </motion.div>

            <motion.h1
              variants={shouldReduceMotion ? undefined : itemVariants}
              className="mb-5 font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl"
            >
              <span className="text-text-primary">趣学伴</span>
              <span className="mt-3 block text-xl font-medium leading-snug text-text-muted sm:text-2xl lg:text-3xl">
                一张图，看清孩子
                <br />
                从小学到高考的每一步
              </span>
            </motion.h1>

            <motion.p
              variants={shouldReduceMotion ? undefined : itemVariants}
              className="mb-8 max-w-md text-sm leading-relaxed text-text-tertiary sm:text-base"
            >
              三公、摇号、对口、自招、名额分配到校……所有路线、关键节点、执行进度，全部心中有数。
            </motion.p>

            <motion.div variants={shouldReduceMotion ? undefined : itemVariants}>
              <Link
                href="/login"
                className="hover:bg-primary/90 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-text-primary transition-colors"
              >
                免费绘制升学地图
                <Icon name="ArrowRight" size="sm" />
              </Link>
            </motion.div>

            <motion.div
              variants={shouldReduceMotion ? undefined : itemVariants}
              className="mt-10 flex items-center gap-8 sm:gap-10"
            >
              {stats.map((stat) => (
                <div key={stat.label}>
                  <div className="font-display text-xl font-bold tabular-nums text-text-primary sm:text-2xl">
                    {stat.value}
                  </div>
                  <div className="mt-0.5 text-[11px] text-text-muted">{stat.label}</div>
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
            <div className="relative overflow-hidden rounded-2xl border border-border-subtle bg-surface-elevated p-5">
              <div className="mb-5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon name="Target" size="sm" className="text-primary" aria-hidden="true" />
                  <span className="font-mono text-[11px] uppercase tracking-wider text-text-tertiary">
                    升学规划图 · 2025-2030
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="relative flex size-2">
                    <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-40" />
                    <span className="relative inline-flex size-2 rounded-full bg-primary" />
                  </span>
                  <span className="font-mono text-[11px] text-primary">LIVE</span>
                </div>
              </div>

              <svg viewBox="0 0 900 300" className="h-auto w-full" aria-label="升学路线示意图">
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
                <rect width="900" height="300" fill="url(#heroGrid)" />

                <line
                  x1="60"
                  y1="260"
                  x2="860"
                  y2="260"
                  stroke="currentColor"
                  strokeWidth="1"
                  className="text-text-muted/10"
                />
                {checkpoints.map((cp) => (
                  <g key={cp.label}>
                    <line
                      x1={cp.x}
                      y1="255"
                      x2={cp.x}
                      y2="265"
                      stroke="currentColor"
                      strokeWidth="1"
                      className="text-text-muted/20"
                    />
                    <text
                      x={cp.x}
                      y="285"
                      textAnchor="middle"
                      fill="currentColor"
                      className="text-text-muted"
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
                      stroke="currentColor"
                      strokeWidth={route.active ? 2.5 : 1.5}
                      strokeOpacity={route.active ? 1 : 1}
                      strokeDasharray={route.active ? undefined : '5 5'}
                      className={routeColorClass(route.color, route.active)}
                      initial={shouldReduceMotion ? { pathLength: 1 } : { pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1.5, delay: 0.6, ease: 'easeInOut' }}
                    />
                    <text
                      x="45"
                      y={route.y + 4}
                      textAnchor="end"
                      fill="currentColor"
                      className={
                        route.active ? routeColorClass(route.color, true) : 'text-text-muted'
                      }
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
                    initial={
                      shouldReduceMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }
                    }
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1 + index * 0.1, duration: 0.35 }}
                  >
                    {cp.status === 'current' && (
                      <circle
                        cx={cp.x}
                        cy={80}
                        r="10"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1"
                        opacity="0.35"
                        className="text-primary"
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
                      fill="currentColor"
                      stroke="currentColor"
                      strokeWidth="2"
                      className={
                        cp.status === 'current'
                          ? 'text-primary'
                          : 'stroke-text-muted/25 fill-surface'
                      }
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
                    fill="currentColor"
                    stroke="currentColor"
                    className="fill-primary/[0.08] stroke-primary/25"
                  />
                  <text
                    x="155"
                    y="59"
                    textAnchor="middle"
                    fill="currentColor"
                    className="text-primary-glow"
                    fontSize="11"
                    fontFamily="var(--font-mono)"
                  >
                    当前位置
                  </text>
                </motion.g>
              </svg>

              <div className="mt-4 flex items-center justify-between border-t border-border-subtle pt-4 text-[11px]">
                <div className="flex items-center gap-4">
                  <span className="text-text-muted">
                    主路线: <span className="text-primary">三公冲刺型</span>
                  </span>
                  <span className="hidden text-text-muted sm:inline">
                    下一节点: <span className="text-text-primary">二年级末 · 基础检查</span>
                  </span>
                </div>
                <span className="font-mono text-text-muted">423 DAYS REMAINING</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2"
        aria-hidden="true"
      >
        <span className="text-[10px] uppercase tracking-widest text-text-muted">Scroll</span>
        <motion.div
          animate={shouldReduceMotion ? { y: 0 } : { y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="flex h-8 w-5 items-start justify-center rounded-full border border-border-subtle p-1.5"
        >
          <div className="h-1.5 w-1 rounded-full bg-primary" />
        </motion.div>
      </motion.div>
    </section>
  );
}
