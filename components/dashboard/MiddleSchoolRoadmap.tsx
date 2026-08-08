'use client';

import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { Icon, type IconName } from '@/components/ui/icon';

interface Checkpoint {
  id: string;
  name: string;
  x: number;
  type: 'soft' | 'hard' | 'event' | 'current';
  grade: string;
  requirement?: string;
  status: 'passed' | 'upcoming' | 'at_risk' | 'current';
}

interface RoutePath {
  id: string;
  name: string;
  color: string;
  glowColor: string;
  description: string;
  y: number;
  checkpoints: Checkpoint[];
}

const routes: RoutePath[] = [
  {
    id: 'sizhong',
    name: '四校八大自招冲刺',
    color: '#f43f5e',
    glowColor: 'rgba(244, 63, 94, 0.4)',
    description: '以四校八大为目标，自招 + 名额到区 + 统招多通道冲击',
    y: 100,
    checkpoints: [
      { id: 'sg-cur', name: '当前位置', x: 0, type: 'current', grade: '二年级', status: 'current' },
      {
        id: 'sg-1',
        name: '竞赛启蒙',
        x: 14,
        type: 'soft',
        grade: '三年级',
        requirement: '奥数/信息学入门',
        status: 'upcoming',
      },
      {
        id: 'sg-2',
        name: '英语优势',
        x: 29,
        type: 'soft',
        grade: '四年级',
        requirement: '小托福/PET 优秀',
        status: 'upcoming',
      },
      {
        id: 'sg-3',
        name: 'AMC8 冲奖',
        x: 43,
        type: 'hard',
        grade: '五年级',
        requirement: 'AMC8 20+',
        status: 'upcoming',
      },
      {
        id: 'sg-4',
        name: '初中基础',
        x: 57,
        type: 'soft',
        grade: '六年级',
        requirement: '提前学完初一内容',
        status: 'upcoming',
      },
      {
        id: 'sg-5',
        name: '竞赛拿奖',
        x: 71,
        type: 'hard',
        grade: '七年级',
        requirement: '数学/物理竞赛省级奖项',
        status: 'upcoming',
      },
      {
        id: 'sg-6',
        name: '自招门票',
        x: 86,
        type: 'hard',
        grade: '八年级',
        requirement: '锁定自招/综评资格',
        status: 'upcoming',
      },
      {
        id: 'sg-7',
        name: '自招报名',
        x: 94,
        type: 'event',
        grade: '初三上',
        requirement: '开放日 + 自招测试',
        status: 'upcoming',
      },
      {
        id: 'sg-8',
        name: '中考录取',
        x: 100,
        type: 'event',
        grade: '初三下 6 月',
        requirement: '四校/统招录取',
        status: 'upcoming',
      },
    ],
  },
  {
    id: 'shizhong',
    name: '市重点冲刺',
    color: '#8b5cf6',
    glowColor: 'rgba(139, 92, 246, 0.4)',
    description: '嘉定区市重点，名额分配到区/到校 + 统招稳中求进',
    y: 180,
    checkpoints: [
      { id: 'sz-cur', name: '当前位置', x: 0, type: 'current', grade: '二年级', status: 'current' },
      {
        id: 'sz-1',
        name: '文理均衡',
        x: 14,
        type: 'soft',
        grade: '三年级',
        requirement: '语数英无短板',
        status: 'upcoming',
      },
      {
        id: 'sz-2',
        name: '优势学科',
        x: 29,
        type: 'soft',
        grade: '四年级',
        requirement: '数学/英语超前 1 年',
        status: 'upcoming',
      },
      {
        id: 'sz-3',
        name: '小升初定位',
        x: 43,
        type: 'soft',
        grade: '五年级',
        requirement: '确定初中方向',
        status: 'upcoming',
      },
      {
        id: 'sz-4',
        name: '初中习惯',
        x: 57,
        type: 'soft',
        grade: '六年级',
        requirement: '建立初中知识体系',
        status: 'upcoming',
      },
      {
        id: 'sz-5',
        name: '理科分层',
        x: 71,
        type: 'hard',
        grade: '七年级',
        requirement: '数学/物理保持前列',
        status: 'upcoming',
      },
      {
        id: 'sz-6',
        name: '一模前冲刺',
        x: 86,
        type: 'hard',
        grade: '八年级',
        requirement: '全区排名进入市重点区间',
        status: 'upcoming',
      },
      {
        id: 'sz-7',
        name: '一模定位',
        x: 94,
        type: 'event',
        grade: '初三上',
        requirement: '名额分配志愿填报',
        status: 'upcoming',
      },
      {
        id: 'sz-8',
        name: '中考录取',
        x: 100,
        type: 'event',
        grade: '初三下 6 月',
        requirement: '市重点录取',
        status: 'upcoming',
      },
    ],
  },
  {
    id: 'quzhong',
    name: '区重点/特色保底',
    color: '#06b6d4',
    glowColor: 'rgba(6, 182, 212, 0.4)',
    description: '区重点/市特色高中，名额到校 + 统招保底',
    y: 260,
    checkpoints: [
      { id: 'qz-cur', name: '当前位置', x: 0, type: 'current', grade: '二年级', status: 'current' },
      {
        id: 'qz-1',
        name: '习惯养成',
        x: 14,
        type: 'soft',
        grade: '三年级',
        requirement: '自主学习 + 错题整理',
        status: 'upcoming',
      },
      {
        id: 'qz-2',
        name: '基础巩固',
        x: 29,
        type: 'soft',
        grade: '四年级',
        requirement: '补齐薄弱学科',
        status: 'upcoming',
      },
      {
        id: 'qz-3',
        name: '小升初准备',
        x: 43,
        type: 'soft',
        grade: '五年级',
        requirement: '对口/摇号准备',
        status: 'upcoming',
      },
      {
        id: 'qz-4',
        name: '适应初中',
        x: 57,
        type: 'soft',
        grade: '六年级',
        requirement: '适应初中节奏',
        status: 'upcoming',
      },
      {
        id: 'qz-5',
        name: '补齐薄弱',
        x: 71,
        type: 'soft',
        grade: '七年级',
        requirement: '至少 1-2 门优势学科',
        status: 'upcoming',
      },
      {
        id: 'qz-6',
        name: '分水岭巩固',
        x: 86,
        type: 'hard',
        grade: '八年级',
        requirement: '理科不掉队',
        status: 'upcoming',
      },
      {
        id: 'qz-7',
        name: '一模定位',
        x: 94,
        type: 'event',
        grade: '初三上',
        requirement: '锁定区重点区间',
        status: 'upcoming',
      },
      {
        id: 'qz-8',
        name: '中考稳定',
        x: 100,
        type: 'event',
        grade: '初三下 6 月',
        requirement: '区重点/特色录取',
        status: 'upcoming',
      },
    ],
  },
];

const outcomes: Record<string, { label: string; prob: number; name: string }> = {
  sizhong: { label: '冲', prob: 15, name: '四校八大' },
  shizhong: { label: '稳', prob: 55, name: '市重点' },
  quzhong: { label: '保', prob: 85, name: '区重点' },
};

const checkpointConfig = {
  soft: { icon: 'Clock' as IconName, color: '#f59e0b', label: '软检查点' },
  hard: { icon: 'AlertTriangle' as IconName, color: '#ef4444', label: '硬熔断点' },
  event: { icon: 'Trophy' as IconName, color: '#22c55e', label: '关键事件' },
  current: { icon: 'Target' as IconName, color: '#f43f5e', label: '当前位置' },
};

const statusConfig = {
  passed: { color: '#22c55e', bg: 'rgba(34, 197, 94, 0.1)', label: '已达标' },
  upcoming: { color: '#94a3b8', bg: 'rgba(148, 163, 184, 0.1)', label: '待到达' },
  at_risk: { color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)', label: '有风险' },
  current: { color: '#f43f5e', bg: 'rgba(244, 63, 94, 0.1)', label: '当前' },
};

const years = [
  { year: '2026', grade: '二年级' },
  { year: '2027', grade: '三年级' },
  { year: '2028', grade: '四年级' },
  { year: '2029', grade: '五年级' },
  { year: '2030', grade: '六年级' },
  { year: '2031', grade: '七年级' },
  { year: '2032', grade: '八年级' },
  { year: '2033', grade: '中考' },
];

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function createParticles() {
  return Array.from({ length: 24 }, (_, i) => ({
    id: i,
    x: seededRandom(i * 17) * 1100,
    y: seededRandom(i * 31) * 460,
    size: seededRandom(i * 47) * 2 + 0.5,
    duration: seededRandom(i * 59) * 3 + 2,
    delay: seededRandom(i * 71) * 2,
  }));
}

export default function MiddleSchoolRoadmap() {
  const [mounted, setMounted] = useState(false);
  const [hoveredRoute, setHoveredRoute] = useState<string | null>(null);
  const [hoveredCheckpoint, setHoveredCheckpoint] = useState<string | null>(null);
  const [selectedCheckpoint, setSelectedCheckpoint] = useState<Checkpoint | null>(null);
  const [activeRoute, setActiveRoute] = useState<string>('sizhong');
  const [daysLeft, setDaysLeft] = useState<number>(400);
  const [explosions, setExplosions] = useState<
    { id: number; x: number; y: number; color: string }[]
  >([]);

  useEffect(() => {
    setMounted(true);
    const next = new Date('2027-09-01');
    const diff = Math.ceil((next.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    setDaysLeft(diff);
  }, []);

  const particles = useMemo(() => createParticles(), []);
  const effectiveRoute = hoveredRoute || activeRoute;
  const nextCheckpoint =
    routes[0].checkpoints.find((c) => c.status === 'current') ||
    routes[0].checkpoints.find((c) => c.status === 'upcoming');

  return (
    <div className="space-y-6">
      {/* Top countdown banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative flex flex-col justify-between gap-4 overflow-hidden rounded-2xl p-5 sm:flex-row sm:items-center"
        style={{
          background:
            'linear-gradient(135deg, rgba(139,92,246,0.08) 0%, rgba(6,182,212,0.08) 100%)',
          border: '1px solid rgba(139,92,246,0.35)',
          boxShadow: '0 0 30px rgba(139,92,246,0.15), inset 0 0 20px rgba(139,92,246,0.05)',
        }}
      >
        <motion.div
          className="pointer-events-none absolute inset-0 rounded-2xl"
          style={{
            background:
              'linear-gradient(90deg, transparent, rgba(139,92,246,0.4), rgba(6,182,212,0.4), transparent)',
            backgroundSize: '200% 100%',
          }}
          animate={{ backgroundPosition: ['200% 0', '-200% 0'] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        />
        <div className="bg-background/80 pointer-events-none absolute inset-px rounded-2xl" />

        <div className="relative z-10 flex items-start gap-4">
          <div
            className="flex size-12 shrink-0 items-center justify-center rounded-xl"
            style={{
              background: 'var(--color-secondary-dim)',
              boxShadow: '0 0 20px var(--shadow-secondary)',
            }}
          >
            <Icon
              name="Zap"
              size="lg"
              className="text-secondary"
              style={{ filter: 'drop-shadow(0 0 8px var(--shadow-secondary))' }}
            />
          </div>
          <div>
            <p className="mb-1 text-sm text-text-tertiary">
              距离下一个熔断点（{nextCheckpoint?.grade} · {nextCheckpoint?.name}）
            </p>
            <p className="font-display text-2xl font-bold">
              还有{' '}
              <motion.span
                className="inline-block bg-clip-text font-black text-transparent"
                style={{
                  backgroundImage:
                    'linear-gradient(90deg, var(--color-secondary), var(--accent-glow), var(--color-secondary))',
                  backgroundSize: '200% 100%',
                  textShadow: '0 0 30px var(--shadow-secondary)',
                }}
                animate={{ backgroundPosition: ['0% 0', '200% 0'] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              >
                {daysLeft} 天
              </motion.span>
            </p>
          </div>
        </div>
      </motion.div>

      {/* Roadmap canvas */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="relative overflow-hidden rounded-3xl border border-border-subtle bg-surface-elevated p-6"
      >
        <div className="mb-6 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div>
            <h2 className="font-display text-xl font-bold">初中全景看板</h2>
            <p className="text-sm text-text-tertiary">2026-2033 · 三条中考路线的熔断点与关键节点</p>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-xs text-text-muted">当前执行路线：</span>
              {(() => {
                const route = routes.find((r) => r.id === activeRoute);
                if (!route) return null;
                return (
                  <span
                    className="rounded-full px-2 py-0.5 text-xs font-bold"
                    style={{
                      color: route.color,
                      backgroundColor: `${route.color}20`,
                      border: `1px solid ${route.color}40`,
                    }}
                  >
                    {route.name}
                  </span>
                );
              })()}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm">
            {routes.map((route) => {
              const isActive = activeRoute === route.id;
              return (
                <button
                  key={route.id}
                  onMouseEnter={() => setHoveredRoute(route.id)}
                  onMouseLeave={() => setHoveredRoute(null)}
                  onClick={() => setActiveRoute(route.id)}
                  className={`flex items-center gap-2 rounded-lg px-2 py-1 transition-colors ${
                    isActive
                      ? 'bg-surface-hover text-text-primary'
                      : 'text-text-tertiary hover:bg-surface-hover hover:text-text-primary'
                  }`}
                >
                  <span
                    className="size-3 rounded-full"
                    style={{
                      backgroundColor: route.color,
                      boxShadow: `0 0 10px ${route.glowColor}`,
                    }}
                  />
                  {route.name}
                </button>
              );
            })}
          </div>
        </div>

        <div className="relative w-full overflow-x-auto">
          <svg
            viewBox="0 0 1100 460"
            className="h-auto w-full min-w-[1000px]"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              {routes.map((route) => (
                <marker
                  key={`arrow-${route.id}`}
                  id={`arrow-${route.id}`}
                  markerWidth="10"
                  markerHeight="10"
                  refX="9"
                  refY="3"
                  orient="auto"
                  markerUnits="strokeWidth"
                >
                  <path d="M0,0 L0,6 L9,3 z" fill={route.color} opacity="0.8" />
                </marker>
              ))}
            </defs>

            {/* Background grid */}
            {years.map((_, index) => {
              const x = 80 + index * 120;
              return (
                <line
                  key={index}
                  x1={x}
                  y1={60}
                  x2={x}
                  y2={360}
                  stroke="rgba(255,255,255,0.08)"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
              );
            })}

            {/* Ambient glow */}
            {mounted && (
              <>
                <defs>
                  <radialGradient id="msGlow1" cx="50%" cy="30%" r="50%">
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.12" />
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
                  </radialGradient>
                  <radialGradient id="msGlow2" cx="70%" cy="60%" r="40%">
                    <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.1" />
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
                  </radialGradient>
                </defs>
                <ellipse cx={300} cy={150} rx={250} ry={180} fill="url(#msGlow1)">
                  <animate
                    attributeName="cx"
                    values="300;350;300"
                    dur="8s"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="cy"
                    values="150;180;150"
                    dur="8s"
                    repeatCount="indefinite"
                  />
                </ellipse>
                <ellipse cx={700} cy={280} rx={200} ry={150} fill="url(#msGlow2)">
                  <animate
                    attributeName="cx"
                    values="700;650;700"
                    dur="10s"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="cy"
                    values="280;240;280"
                    dur="10s"
                    repeatCount="indefinite"
                  />
                </ellipse>
                {particles.map((p) => (
                  <motion.circle
                    key={p.id}
                    cx={p.x ?? 0}
                    cy={p.y ?? 0}
                    r={p.size ?? 1}
                    fill="white"
                    initial={{ opacity: 0.1 }}
                    animate={{
                      opacity: [0.1, 0.6, 0.1],
                      cy: [p.y, p.y - 10, p.y],
                    }}
                    transition={{
                      duration: p.duration,
                      repeat: Infinity,
                      delay: p.delay,
                      ease: 'easeInOut',
                    }}
                    style={{ pointerEvents: 'none' }}
                  />
                ))}
              </>
            )}

            {/* Route paths */}
            {routes.map((route) => (
              <g key={route.id}>
                <motion.line
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, delay: 0.3 }}
                  x1={80}
                  y1={route.y}
                  x2={920}
                  y2={route.y}
                  stroke={route.color}
                  strokeWidth={hoveredRoute === route.id ? 5 : 3}
                  strokeLinecap="round"
                  markerEnd={`url(#arrow-${route.id}`}
                  style={{
                    filter: `drop-shadow(0 0 ${hoveredRoute === route.id ? 16 : 10}px ${route.glowColor})`,
                    opacity: effectiveRoute && effectiveRoute !== route.id ? 0.25 : 0.75,
                  }}
                />
                <motion.line
                  x1={80}
                  y1={route.y}
                  x2={920}
                  y2={route.y}
                  stroke="white"
                  strokeWidth={hoveredRoute === route.id ? 3 : 1.5}
                  strokeLinecap="round"
                  strokeDasharray="80 300"
                  initial={{ strokeDashoffset: 380 }}
                  animate={{ strokeDashoffset: 0 }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
                  style={{
                    filter: `drop-shadow(0 0 8px ${route.color})`,
                    opacity: effectiveRoute && effectiveRoute !== route.id ? 0.05 : 0.5,
                  }}
                />
                <text
                  x={70}
                  y={route.y + 5}
                  fill={route.color}
                  fontSize="11"
                  fontWeight="600"
                  textAnchor="end"
                  style={{
                    filter: `drop-shadow(0 0 6px ${route.glowColor})`,
                    opacity: effectiveRoute && effectiveRoute !== route.id ? 0.35 : 1,
                  }}
                >
                  {route.name}
                </text>
              </g>
            ))}

            {/* Outcome labels */}
            {routes.map((route) => {
              const outcome = outcomes[route.id];
              const isDimmed = effectiveRoute && effectiveRoute !== route.id;
              const isActive = activeRoute === route.id;
              return (
                <g key={`outcome-${route.id}`}>
                  <line
                    x1={920}
                    y1={route.y}
                    x2={945}
                    y2={route.y}
                    stroke={route.color}
                    strokeWidth="2"
                    strokeDasharray="3 2"
                    opacity={isDimmed ? 0.2 : 0.6}
                  />
                  <foreignObject x={950} y={route.y - 22} width="130" height="44">
                    <div
                      onClick={() => setActiveRoute(route.id)}
                      className="flex h-full cursor-pointer items-center gap-2 rounded-full p-1 pr-3 transition-all"
                      style={{
                        backgroundColor: isActive ? `${route.color}22` : `${route.color}12`,
                        border: `1px solid ${isActive ? route.color : `${route.color}35`}`,
                        boxShadow: isActive
                          ? `0 0 25px ${route.color}40, inset 0 0 10px ${route.color}15`
                          : `0 0 20px ${route.color}15`,
                        opacity: isDimmed ? 0.3 : 1,
                        transform: isActive ? 'scale(1.05)' : 'scale(1)',
                      }}
                    >
                      <span
                        className="rounded-full px-2 py-0.5 text-xs font-bold"
                        style={{ backgroundColor: route.color, color: 'var(--text-inverse)' }}
                      >
                        {outcome.label}
                      </span>
                      <div className="flex flex-col leading-none">
                        <span className="text-[10px] text-text-tertiary">{outcome.name}</span>
                        <span className="text-xs font-bold" style={{ color: route.color }}>
                          {outcome.prob}%
                        </span>
                      </div>
                      {isActive && (
                        <span
                          className="ml-auto rounded px-1.5 py-0.5 text-[9px] font-bold"
                          style={{ color: route.color, backgroundColor: `${route.color}25` }}
                        >
                          主
                        </span>
                      )}
                    </div>
                  </foreignObject>
                </g>
              );
            })}

            {/* Checkpoints */}
            {routes.map((route) =>
              route.checkpoints.map((checkpoint, index) => {
                const config = checkpointConfig[checkpoint.type];
                const status = statusConfig[checkpoint.status];
                const cx = 80 + (checkpoint.x / 100) * 840;
                const cy = checkpoint.type === 'current' ? route.y - 25 : route.y;
                const isDimmed = effectiveRoute && effectiveRoute !== route.id;

                return (
                  <g
                    key={checkpoint.id}
                    onClick={() => {
                      setSelectedCheckpoint(checkpoint);
                      setExplosions((prev) => [
                        ...prev,
                        { id: Date.now(), x: cx, y: cy, color: config.color },
                      ]);
                      setTimeout(() => {
                        setExplosions((prev) => prev.filter((e) => e.id !== Date.now()));
                      }, 800);
                    }}
                    onMouseEnter={() => setHoveredCheckpoint(checkpoint.id)}
                    onMouseLeave={() => setHoveredCheckpoint(null)}
                    style={{ cursor: 'pointer', opacity: isDimmed ? 0.2 : 1 }}
                  >
                    {checkpoint.type === 'current' ? (
                      <>
                        <motion.path
                          d={`M ${cx - 20} ${cy} A 20 20 0 0 1 ${cx + 20} ${cy}`}
                          fill="none"
                          stroke={config.color}
                          strokeWidth="2"
                          strokeLinecap="round"
                          initial={{ pathLength: 0, opacity: 0 }}
                          animate={{ pathLength: 1, opacity: [0, 1, 0] }}
                          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                          style={{ filter: `drop-shadow(0 0 8px ${config.color})` }}
                        />
                        <motion.circle
                          initial={{ scale: 0, opacity: 0.8 }}
                          animate={{ scale: 3, opacity: 0 }}
                          transition={{ duration: 2, repeat: Infinity }}
                          cx={cx}
                          cy={cy}
                          r={12}
                          fill="none"
                          stroke={config.color}
                          strokeWidth="1.5"
                        />
                        <motion.circle
                          cx={cx}
                          cy={cy}
                          r={10}
                          fill={config.color}
                          whileHover={{ scale: 1.3 }}
                          style={{ filter: `drop-shadow(0 0 16px ${config.color})` }}
                        />
                      </>
                    ) : (
                      <>
                        {checkpoint.type === 'hard' && (
                          <motion.circle
                            initial={{ scale: 1, opacity: 0.6 }}
                            animate={{ scale: 1.8, opacity: 0 }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            cx={cx}
                            cy={cy}
                            r={8}
                            fill="none"
                            stroke={config.color}
                            strokeWidth="2"
                          />
                        )}
                        <motion.circle
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.4, delay: 0.8 + index * 0.05 }}
                          cx={cx}
                          cy={cy}
                          r={hoveredCheckpoint === checkpoint.id ? 11 : 8}
                          fill={config.color}
                          whileHover={{ scale: 1.4 }}
                          style={{
                            filter: `drop-shadow(0 0 ${checkpoint.type === 'hard' ? 16 : 12}px ${config.color})`,
                            transition: 'r 0.2s ease',
                          }}
                        />
                      </>
                    )}
                    <text
                      x={cx}
                      y={cy + (checkpoint.type === 'current' ? 28 : 24)}
                      fill={status.color}
                      fontSize={hoveredCheckpoint === checkpoint.id ? '11' : '10'}
                      fontWeight="600"
                      textAnchor="middle"
                      style={{ transition: 'font-size 0.2s ease' }}
                    >
                      {checkpoint.name}
                    </text>
                  </g>
                );
              })
            )}

            {/* Explosion particles */}
            {explosions.map((exp) => (
              <g key={exp.id}>
                {Array.from({ length: 12 }).map((_, i) => {
                  const angle = (i / 12) * Math.PI * 2;
                  const distance = 35;
                  const tx = exp.x + Math.cos(angle) * distance;
                  const ty = exp.y + Math.sin(angle) * distance;
                  return (
                    <motion.circle
                      key={i}
                      cx={exp.x}
                      cy={exp.y}
                      r={3}
                      fill={exp.color}
                      initial={{ opacity: 1, scale: 1 }}
                      animate={{ cx: tx, cy: ty, opacity: 0, scale: 0 }}
                      transition={{ duration: 0.7, ease: 'easeOut' }}
                      style={{ filter: `drop-shadow(0 0 6px ${exp.color})` }}
                    />
                  );
                })}
              </g>
            ))}

            {/* Fallback arrows */}
            <g
              opacity={
                hoveredRoute && hoveredRoute !== 'sizhong' && hoveredRoute !== 'shizhong'
                  ? 0.2
                  : 0.45
              }
            >
              <defs>
                <marker
                  id="ms-fallback-arrow"
                  markerWidth="8"
                  markerHeight="8"
                  refX="6"
                  refY="3"
                  orient="auto"
                  markerUnits="strokeWidth"
                >
                  <path d="M0,0 L0,6 L7,3 z" fill="#94a3b8" opacity="0.7" />
                </marker>
              </defs>
              <motion.path
                d="M 920 125 Q 960 125 960 155 Q 960 185 920 185"
                fill="none"
                stroke="#94a3b8"
                strokeWidth="1.5"
                strokeDasharray="4 4"
                markerEnd="url(#ms-fallback-arrow)"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, delay: 1.2 }}
              />
              <motion.path
                d="M 920 205 Q 960 205 960 235 Q 960 265 920 265"
                fill="none"
                stroke="#94a3b8"
                strokeWidth="1.5"
                strokeDasharray="4 4"
                markerEnd="url(#ms-fallback-arrow)"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, delay: 1.4 }}
              />
              <text x={975} y={158} fill="#64748b" fontSize="9" textAnchor="middle">
                未录取
              </text>
              <text x={975} y={238} fill="#64748b" fontSize="9" textAnchor="middle">
                未录取
              </text>
            </g>

            {/* Current time indicator */}
            <line
              x1={80}
              y1={60}
              x2={80}
              y2={410}
              stroke="#f43f5e"
              strokeWidth="1"
              strokeDasharray="6 4"
              opacity="0.5"
              style={{ filter: 'drop-shadow(0 0 10px rgba(244,63,94,0.6))' }}
            />
            <motion.circle
              cx={80}
              cy={410}
              r={5}
              fill="#f43f5e"
              animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.3, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              style={{ filter: 'drop-shadow(0 0 10px rgba(244,63,94,0.8))' }}
            />

            {/* Year labels */}
            {years.map((year, index) => {
              const x = 80 + index * 120;
              const isCurrent = year.year === '2026';
              return (
                <g key={year.year}>
                  {isCurrent && (
                    <circle
                      cx={x}
                      cy={400}
                      r={24}
                      fill="rgba(244,63,94,0.1)"
                      style={{ filter: 'drop-shadow(0 0 16px rgba(244,63,94,0.4))' }}
                    />
                  )}
                  <text
                    x={x}
                    y={390}
                    fill={isCurrent ? '#f43f5e' : '#94a3b8'}
                    fontSize="12"
                    fontWeight={isCurrent ? '700' : '400'}
                    textAnchor="middle"
                    style={
                      isCurrent
                        ? { filter: 'drop-shadow(0 0 10px rgba(244,63,94,0.6))' }
                        : undefined
                    }
                  >
                    {year.year}
                  </text>
                  <text
                    x={x}
                    y={410}
                    fill={isCurrent ? '#fda4af' : '#64748b'}
                    fontSize="11"
                    textAnchor="middle"
                  >
                    {year.grade}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Checkpoint detail panel */}
        {selectedCheckpoint && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-6 rounded-2xl border border-border-subtle bg-surface p-5"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="mb-2 flex items-center gap-2">
                  {(() => {
                    const config = checkpointConfig[selectedCheckpoint.type];
                    return <Icon name={config.icon} size="md" style={{ color: config.color }} />;
                  })()}
                  <h3 className="font-display text-lg font-bold">{selectedCheckpoint.name}</h3>
                  {(() => {
                    const status = statusConfig[selectedCheckpoint.status];
                    return (
                      <span
                        className="rounded-full px-2.5 py-0.5 text-xs font-medium"
                        style={{ color: status.color, backgroundColor: status.bg }}
                      >
                        {status.label}
                      </span>
                    );
                  })()}
                </div>
                <p className="mb-2 text-sm text-text-tertiary">
                  {selectedCheckpoint.grade}
                  {selectedCheckpoint.requirement && ` · ${selectedCheckpoint.requirement}`}
                </p>
                <p className="text-sm text-text-secondary">
                  {selectedCheckpoint.type === 'hard'
                    ? '硬熔断点：未达标建议切换主路线到备选方案，系统会提醒家长评估。'
                    : selectedCheckpoint.type === 'soft'
                      ? '软检查点：未达标会发出预警，建议加强准备，暂不需要切换路线。'
                      : selectedCheckpoint.type === 'current'
                        ? '当前所处位置，可在此录入最新进度数据。'
                        : '关键事件节点，需要提前规划和准备相关材料。'}
                </p>
              </div>
              <button
                onClick={() => setSelectedCheckpoint(null)}
                className="shrink-0 rounded-lg px-4 py-2 text-sm text-text-muted hover:text-text-primary"
              >
                关闭
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
