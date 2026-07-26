'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Target,
  School,
  ChevronRight,
  Zap,
  Trophy,
  Plus,
} from 'lucide-react';

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

interface VolunteerOption {
  id: string;
  name: string;
  type: string;
  color: string;
  probability: number;
  requirements: string[];
}

// TODO: replace with user-specific route configuration from backend
const routes: RoutePath[] = [
  {
    id: 'sg',
    name: '三公冲刺型',
    color: '#f43f5e',
    glowColor: 'rgba(244, 63, 94, 0.4)',
    description: '全市零志愿自主招生，AMC8+小托福+面谈',
    y: 100,
    checkpoints: [
      { id: 'sg-1', name: '探测收官', x: 18, type: 'soft', grade: '一升二暑假', requirement: '数学思维≥40, 英语≥30', status: 'current' },
      { id: 'sg-2', name: '基础检查', x: 30, type: 'soft', grade: '二年级末', requirement: 'RAZ 爬坡 + OD1 完成, 英语≥50', status: 'upcoming' },
      { id: 'sg-3', name: '奥数启动', x: 42, type: 'hard', grade: '三年级初', requirement: '已启动系统奥数学习', status: 'upcoming' },
      { id: 'sg-4', name: 'KET 卓越', x: 52, type: 'soft', grade: '三年级寒假', requirement: 'KET 卓越 140+', status: 'upcoming' },
      { id: 'sg-5', name: 'PET 卓越', x: 62, type: 'soft', grade: '四年级寒假', requirement: 'PET 卓越 160+', status: 'upcoming' },
      { id: 'sg-6', name: '小托福首考', x: 72, type: 'hard', grade: '四年级春季', requirement: '小托福 800+ / AMC8 首考', status: 'upcoming' },
      { id: 'sg-7', name: '综合定位', x: 84, type: 'hard', grade: '五年级初', requirement: '奥数+英语+竞赛全面达标', status: 'upcoming' },
      { id: 'sg-8', name: 'AMC8 冲刺', x: 92, type: 'soft', grade: '五年级上', requirement: 'AMC8 20+ / 小托福 850+', status: 'upcoming' },
      { id: 'sg-9', name: '三公报名', x: 97, type: 'event', grade: '五年级下 4 月', requirement: '4月中旬报名，4月中下旬面谈评估', status: 'upcoming' },
    ],
  },
  {
    id: 'dual',
    name: '双轨维持型',
    color: '#8b5cf6',
    glowColor: 'rgba(139, 92, 246, 0.4)',
    description: '文理兼顾，保留三公和嘉定民办摇号两种可能',
    y: 180,
    checkpoints: [
      { id: 'dual-current', name: '当前位置', x: 18, type: 'current', grade: '一升二暑假', status: 'current' },
      { id: 'dual-1', name: '文理平衡', x: 35, type: 'soft', grade: '二年级末', requirement: '语数英均衡发展', status: 'upcoming' },
      { id: 'dual-2', name: '三公评估', x: 50, type: 'soft', grade: '三年级中', requirement: '数学思维≥70', status: 'upcoming' },
      { id: 'dual-3', name: '方向选择', x: 72, type: 'hard', grade: '四年级末', requirement: '明确冲三公或稳摇号', status: 'upcoming' },
      { id: 'dual-4', name: '最终定位', x: 90, type: 'hard', grade: '五年级初', requirement: '确定第一志愿', status: 'upcoming' },
    ],
  },
  {
    id: 'public',
    name: '公办直升型',
    color: '#06b6d4',
    glowColor: 'rgba(6, 182, 212, 0.4)',
    description: '保底路线，对口公办或一贯制直升',
    y: 260,
    checkpoints: [
      { id: 'pub-1', name: '对口确认', x: 35, type: 'soft', grade: '二年级末', requirement: '确认对口学校范围', status: 'upcoming' },
      { id: 'pub-2', name: '户籍房产', x: 62, type: 'soft', grade: '四年级中', requirement: '满足对口入学条件', status: 'upcoming' },
      { id: 'pub-3', name: '直升确认', x: 90, type: 'hard', grade: '五年级初', requirement: '一贯制直升或对口录取', status: 'upcoming' },
    ],
  },
];

// TODO: replace with user-specific volunteer targets from backend
const volunteers: VolunteerOption[] = [
  {
    id: 'v1',
    name: '三公学校',
    type: '第一志愿（冲）',
    color: '#f43f5e',
    probability: 35,
    requirements: ['AMC8 20分+', '小托福 850+', '竞赛经历', '面谈表现'],
  },
  {
    id: 'v2',
    name: '民办摇号',
    type: '第二志愿（摇）',
    color: '#8b5cf6',
    probability: 40,
    requirements: ['嘉定户籍/居住证', '志愿策略', '走读/住宿选择'],
  },
  {
    id: 'v3',
    name: '公办直升',
    type: '第三志愿（保）',
    color: '#06b6d4',
    probability: 92,
    requirements: ['对口学区', '一贯制直升', '校内成绩'],
  },
];

const checkpointConfig = {
  soft: { icon: Clock, color: '#f59e0b', label: '软检查点' },
  hard: { icon: AlertTriangle, color: '#ef4444', label: '硬熔断点' },
  event: { icon: Trophy, color: '#22c55e', label: '关键事件' },
  current: { icon: Target, color: '#f43f5e', label: '当前位置' },
};

const statusConfig = {
  passed: { color: '#22c55e', bg: 'rgba(34, 197, 94, 0.1)', label: '已达标' },
  upcoming: { color: '#94a3b8', bg: 'rgba(148, 163, 184, 0.1)', label: '待到达' },
  at_risk: { color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)', label: '有风险' },
  current: { color: '#f43f5e', bg: 'rgba(244, 63, 94, 0.1)', label: '当前' },
};

// TODO: derive from current user's grade and target year
const years = [
  { year: '2025', grade: '一年级' },
  { year: '2026', grade: '二年级' },
  { year: '2027', grade: '三年级' },
  { year: '2028', grade: '四年级' },
  { year: '2029', grade: '五年级' },
  { year: '2030', grade: '小升初' },
];

// Deterministic pseudo-random so SSR and CSR produce the same values
function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function createParticles() {
  return Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: seededRandom(i * 17) * 1100,
    y: seededRandom(i * 31) * 460,
    size: seededRandom(i * 47) * 2 + 0.5,
    duration: seededRandom(i * 59) * 3 + 2,
    delay: seededRandom(i * 71) * 2,
  }));
}

export default function PlanRoadmap({
  onShowDiagnosis,
  onManageNodes,
}: {
  onShowDiagnosis?: () => void;
  onManageNodes?: () => void;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const particles = createParticles();

  const [hoveredRoute, setHoveredRoute] = useState<string | null>(null);
  const [hoveredCheckpoint, setHoveredCheckpoint] = useState<string | null>(null);
  const [selectedCheckpoint, setSelectedCheckpoint] = useState<Checkpoint | null>(null);
  const [mousePos, setMousePos] = useState({ x: 550, y: 230 });

  const nextCheckpoint = routes[0].checkpoints.find((c) => c.status === 'current') || routes[0].checkpoints.find((c) => c.status === 'upcoming');

  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });
  const [explosions, setExplosions] = useState<{ id: number; x: number; y: number; color: string }[]>([]);
  // TODO: default should come from user's current primary plan
  const [activeRoute, setActiveRoute] = useState<string>('sg');

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    // 轻微倾斜，保留空间感但不影响文字阅读
    setTilt({ rotateX: y * -1, rotateY: x * 1 });
  };

  const handleMouseLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0 });
  };

  const effectiveRoute = hoveredRoute || activeRoute;

  return (
    <div
      className="space-y-6"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: '1200px' }}
    >
      {/* Top countdown banner - neon style */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(244,63,94,0.08) 0%, rgba(139,92,246,0.08) 100%)',
          border: '1px solid rgba(244,63,94,0.35)',
          boxShadow: '0 0 30px rgba(244,63,94,0.15), inset 0 0 20px rgba(244,63,94,0.05)',
        }}
      >
        {/* Animated border glow */}
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(244,63,94,0.4), rgba(139,92,246,0.4), transparent)',
            backgroundSize: '200% 100%',
          }}
          animate={{ backgroundPosition: ['200% 0', '-200% 0'] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        />
        <div className="absolute inset-[1px] rounded-2xl bg-slate-950/80 pointer-events-none" />

        <div className="relative flex items-start gap-4 z-10">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
            style={{
              background: 'rgba(244,63,94,0.15)',
              boxShadow: '0 0 20px rgba(244,63,94,0.3)',
            }}
          >
            <Zap className="w-6 h-6 text-warning" style={{ filter: 'drop-shadow(0 0 8px rgba(244,63,94,0.8))' }} />
          </div>
          <div>
            <p className="text-sm text-slate-400 mb-1">
              距离下一个熔断点（{nextCheckpoint?.grade} · {nextCheckpoint?.name}）
            </p>
            <p className="text-2xl font-bold font-display">
              还有{' '}
              <motion.span
                className="inline-block text-transparent bg-clip-text font-black"
                style={{
                  backgroundImage: 'linear-gradient(90deg, #f43f5e, #fbbf24, #f43f5e)',
                  backgroundSize: '200% 100%',
                  textShadow: '0 0 30px rgba(244,63,94,0.5)',
                }}
                animate={{ backgroundPosition: ['0% 0', '200% 0'] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              >
                {/* TODO: calculate from next checkpoint date */}
                423 天
              </motion.span>
            </p>
          </div>
        </div>
        <button
          onClick={onShowDiagnosis}
          className="relative z-10 px-5 py-2.5 rounded-xl font-medium transition-all bg-primary/10 text-primary border border-primary/30 hover:bg-primary/20 hover:border-primary/50 hover:shadow-[0_0_30px_rgba(244,63,94,0.3)]"
        >
          查看诊断
        </button>
      </motion.div>

      <div className="grid grid-cols-1 gap-6">
        {/* Unified roadmap canvas */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="rounded-3xl glass p-6 border border-white/5 relative overflow-hidden"
          style={{
            transform: `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`,
            transformStyle: 'preserve-3d',
            transition: 'transform 0.15s ease-out',
          }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold font-display">小学全景看板</h2>
              <p className="text-sm text-slate-400">2025-2030 · 三条路线的熔断点与关键节点</p>
              <div className="mt-2 flex items-center gap-2">
                <span className="text-xs text-slate-500">当前执行路线：</span>
                {(() => {
                  const route = routes.find((r) => r.id === activeRoute);
                  if (!route) return null;
                  return (
                    <span
                      className="px-2 py-0.5 rounded-full text-xs font-bold"
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
            <div className="flex items-center gap-4 text-sm">
              {routes.map((route) => {
                const isActive = activeRoute === route.id;
                return (
                  <button
                    key={route.id}
                    onMouseEnter={() => setHoveredRoute(route.id)}
                    onMouseLeave={() => setHoveredRoute(null)}
                    onClick={() => setActiveRoute(route.id)}
                    className={`flex items-center gap-2 px-2 py-1 rounded-lg transition-colors ${
                      isActive ? 'text-white bg-white/10' : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                    aria-pressed={isActive}
                  >
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: route.color, boxShadow: `0 0 10px ${route.glowColor}` }}
                    />
                    {route.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* SVG Roadmap */}
          <div className="relative w-full overflow-x-auto">
            <svg
              viewBox="0 0 1100 460"
              className="w-full min-w-[1000px] h-auto"
              preserveAspectRatio="xMidYMid meet"
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 1100;
                const y = ((e.clientY - rect.top) / rect.height) * 460;
                setMousePos({ x, y });
              }}
            >
              {/* Definitions */}
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
                const x = 80 + index * 150;
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

              {/* Decorative ambient glow / cursor / particles — only render after client mount to avoid SSR/CSR mismatch */}
              {mounted && (
                <>
                  <defs>
                    <radialGradient id="ambientGlow1" cx="50%" cy="30%" r="50%">
                      <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.12" />
                      <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
                    </radialGradient>
                    <radialGradient id="ambientGlow2" cx="70%" cy="60%" r="40%">
                      <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.1" />
                      <stop offset="100%" stopColor="#f43f5e" stopOpacity="0" />
                    </radialGradient>
                  </defs>
                  <motion.ellipse
                    cx={300}
                    cy={150}
                    rx={250}
                    ry={180}
                    fill="url(#ambientGlow1)"
                    animate={{ cx: [300, 350, 300], cy: [150, 180, 150] }}
                    transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                  />
                  <motion.ellipse
                    cx={700}
                    cy={280}
                    rx={200}
                    ry={150}
                    fill="url(#ambientGlow2)"
                    animate={{ cx: [700, 650, 700], cy: [280, 240, 280] }}
                    transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
                  />

                  <defs>
                    <radialGradient id="cursorGlow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#ffffff" stopOpacity="0.08" />
                      <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.04" />
                      <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
                    </radialGradient>
                  </defs>
                  <motion.ellipse
                    cx={mousePos.x}
                    cy={mousePos.y}
                    rx={180}
                    ry={120}
                    fill="url(#cursorGlow)"
                    transition={{ type: 'spring', stiffness: 150, damping: 30 }}
                    style={{ pointerEvents: 'none' }}
                  />

                  {particles.map((p) => (
                    <motion.circle
                      key={p.id}
                      cx={p.x}
                      cy={p.y}
                      r={p.size}
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
                    markerEnd={`url(#arrow-${route.id})`}
                    style={{
                      filter: `drop-shadow(0 0 ${hoveredRoute === route.id ? 16 : 10}px ${route.glowColor})`,
                      opacity: effectiveRoute && effectiveRoute !== route.id ? 0.25 : 0.75,
                    }}
                  />
                  {/* Flowing light effect on route */}
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

              {/* Route outcome labels */}
              {routes.map((route) => {
                const outcome =
                  route.id === 'sg' ? { label: '冲', prob: 35, name: '三公学校' } : route.id === 'dual' ? { label: '摇', prob: 40, name: '民办摇号' } : { label: '保', prob: 92, name: '公办直升' };
                const isDimmed = effectiveRoute && effectiveRoute !== route.id;
                const isActive = activeRoute === route.id;
                return (
                  <g key={`outcome-${route.id}`}>
                    {/* Connector line */}
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
                        className="h-full flex items-center rounded-full px-1 py-1 pr-3 gap-2 cursor-pointer transition-all"
                        style={{
                          backgroundColor: isActive ? `${route.color}22` : `${route.color}12`,
                          border: `1px solid ${isActive ? route.color : `${route.color}35`}`,
                          boxShadow: isActive
                            ? `0 0 25px ${route.color}40, inset 0 0 10px ${route.color}15`
                            : `0 0 20px ${route.color}15`,
                          opacity: effectiveRoute && effectiveRoute !== route.id ? 0.3 : 1,
                          transform: isActive ? 'scale(1.05)' : 'scale(1)',
                        }}
                      >
                        <span
                          className="px-2 py-0.5 rounded-full text-xs font-bold"
                          style={{
                            backgroundColor: route.color,
                            color: '#0f172a',
                          }}
                        >
                          {outcome.label}
                        </span>
                        <div className="flex flex-col leading-none">
                          <span className="text-[10px] text-slate-400">{outcome.name}</span>
                          <span className="text-xs font-bold" style={{ color: route.color }}>
                            {outcome.prob}%
                          </span>
                        </div>
                        {isActive && (
                          <span
                            className="ml-auto px-1.5 py-0.5 rounded text-[9px] font-bold"
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

              {/* Checkpoints per route */}
              {routes.map((route) =>
                route.checkpoints.map((checkpoint, index) => {
                  const config = checkpointConfig[checkpoint.type];
                  const status = statusConfig[checkpoint.status];
                  const cx = 80 + (checkpoint.x / 100) * 840;
                  const cy = checkpoint.type === 'current' && route.id !== 'dual' ? route.y - 25 : route.y;
                  const isDimmed = effectiveRoute && effectiveRoute !== route.id;

                  return (
                    <g
                      key={checkpoint.id}
                      onClick={() => {
                        setSelectedCheckpoint(checkpoint);
                        const newExplosion = {
                          id: Date.now(),
                          x: cx,
                          y: cy,
                          color: config.color,
                        };
                        setExplosions((prev) => [...prev, newExplosion]);
                        setTimeout(() => {
                          setExplosions((prev) => prev.filter((e) => e.id !== newExplosion.id));
                        }, 800);
                      }}
                      onMouseEnter={() => setHoveredCheckpoint(checkpoint.id)}
                      onMouseLeave={() => setHoveredCheckpoint(null)}
                      style={{ cursor: 'pointer', opacity: isDimmed ? 0.2 : 1 }}
                    >
                      {checkpoint.type === 'current' ? (
                        <>
                          {/* Radar scan arc */}
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
                          {/* Outer pulse rings */}
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
                            initial={{ scale: 0, opacity: 0.6 }}
                            animate={{ scale: 2.2, opacity: 0 }}
                            transition={{ duration: 2, repeat: Infinity, delay: 0.4 }}
                            cx={cx}
                            cy={cy}
                            r={12}
                            fill="none"
                            stroke={config.color}
                            strokeWidth="1.5"
                          />
                          {/* Core dot */}
                          <motion.circle
                            cx={cx}
                            cy={cy}
                            r={10}
                            fill={config.color}
                            whileHover={{ scale: 1.3 }}
                            style={{
                              filter: `drop-shadow(0 0 16px ${config.color})`,
                            }}
                          />
                          {/* Glow ring */}
                          <circle
                            cx={cx}
                            cy={cy}
                            r={16}
                            fill="none"
                            stroke={config.color}
                            strokeWidth="1"
                            opacity="0.3"
                            style={{ filter: `drop-shadow(0 0 8px ${config.color})` }}
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

              {/* Click explosion particles */}
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
                        animate={{
                          cx: tx,
                          cy: ty,
                          opacity: 0,
                          scale: 0,
                        }}
                        transition={{ duration: 0.7, ease: 'easeOut' }}
                        style={{ filter: `drop-shadow(0 0 6px ${exp.color})` }}
                      />
                    );
                  })}
                </g>
              ))}

              {/* Fallback connection lines */}
              <g opacity={hoveredRoute && hoveredRoute !== 'sg' && hoveredRoute !== 'dual' ? 0.2 : 0.45}>
                <defs>
                  <marker id="fallback-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto" markerUnits="strokeWidth">
                    <path d="M0,0 L0,6 L7,3 z" fill="#94a3b8" opacity="0.7" />
                  </marker>
                </defs>
                <motion.path
                  d="M 920 125 Q 960 125 960 155 Q 960 185 920 185"
                  fill="none"
                  stroke="#94a3b8"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                  markerEnd="url(#fallback-arrow)"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1, delay: 1.2 }}
                  style={{ filter: 'drop-shadow(0 0 4px rgba(148,163,184,0.3))' }}
                />
                <motion.path
                  d="M 920 205 Q 960 205 960 235 Q 960 265 920 265"
                  fill="none"
                  stroke="#94a3b8"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                  markerEnd="url(#fallback-arrow)"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1, delay: 1.4 }}
                  style={{ filter: 'drop-shadow(0 0 4px rgba(148,163,184,0.3))' }}
                />
                <text x={975} y={158} fill="#64748b" fontSize="9" textAnchor="middle">
                  未录取
                </text>
                <text x={975} y={238} fill="#64748b" fontSize="9" textAnchor="middle">
                  未摇中
                </text>
              </g>

              {/* Current time indicator line */}
              <line
                x1={231}
                y1={60}
                x2={231}
                y2={410}
                stroke="#f43f5e"
                strokeWidth="1"
                strokeDasharray="6 4"
                opacity="0.5"
                style={{ filter: 'drop-shadow(0 0 10px rgba(244,63,94,0.6))' }}
              />
              <motion.circle
                cx={231}
                cy={410}
                r={5}
                fill="#f43f5e"
                animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.3, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                style={{ filter: 'drop-shadow(0 0 10px rgba(244,63,94,0.8))' }}
              />

              {/* Year labels */}
              {years.map((year, index) => {
                const x = 80 + index * 150;
                const isCurrent = year.year === '2026';
                return (
                  <g key={year.year}>
                    {isCurrent && (
                      <circle cx={x} cy={400} r={24} fill="rgba(244,63,94,0.1)" style={{ filter: 'drop-shadow(0 0 16px rgba(244,63,94,0.4))' }} />
                    )}
                    <text
                      x={x}
                      y={390}
                      fill={isCurrent ? '#f43f5e' : '#94a3b8'}
                      fontSize="12"
                      fontWeight={isCurrent ? '700' : '400'}
                      textAnchor="middle"
                      style={isCurrent ? { filter: 'drop-shadow(0 0 10px rgba(244,63,94,0.6))' } : undefined}
                    >
                      {year.year}
                    </text>
                    <text x={x} y={410} fill={isCurrent ? '#fda4af' : '#64748b'} fontSize="11" textAnchor="middle">
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
              className="mt-6 p-5 rounded-2xl bg-surface border border-white/10"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    {(() => {
                      const config = checkpointConfig[selectedCheckpoint.type];
                      return <config.icon className="w-5 h-5" style={{ color: config.color }} />;
                    })()}
                    <h3 className="text-lg font-bold font-display">{selectedCheckpoint.name}</h3>
                    {(() => {
                      const status = statusConfig[selectedCheckpoint.status];
                      return (
                        <span
                          className="px-2.5 py-0.5 rounded-full text-xs font-medium"
                          style={{ color: status.color, backgroundColor: status.bg }}
                        >
                          {status.label}
                        </span>
                      );
                    })()}
                  </div>
                  <p className="text-sm text-slate-400 mb-2">
                    {selectedCheckpoint.grade}
                    {selectedCheckpoint.requirement && ` · ${selectedCheckpoint.requirement}`}
                  </p>
                  <p className="text-sm text-slate-300">
                    {selectedCheckpoint.type === 'hard'
                      ? '硬熔断点：未达标建议切换主路线到备选方案，系统会提醒家长评估。'
                      : selectedCheckpoint.type === 'soft'
                      ? '软检查点：未达标会发出预警，建议加强准备，暂不需要切换路线。'
                      : selectedCheckpoint.type === 'current'
                      ? '当前所处位置，可在此录入最新进度数据。'
                      : '关键事件节点，需要提前规划和准备相关材料。'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    disabled
                    title="进度录入功能即将上线"
                    className="px-4 py-2 rounded-lg bg-primary/10 text-primary text-sm font-medium opacity-60 cursor-not-allowed"
                  >
                    录入进度（即将上线）
                  </button>
                  <button
                    onClick={() => setSelectedCheckpoint(null)}
                    className="px-4 py-2 rounded-lg text-slate-500 hover:text-white text-sm"
                  >
                    关闭
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Volunteer options */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-3"
      >
        {volunteers.map((volunteer) => (
          <div
            key={volunteer.id}
            className="rounded-xl glass p-4 border border-white/5 hover:border-white/10 transition-all group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span
                  className="px-2 py-0.5 rounded-full text-xs font-bold"
                  style={{ backgroundColor: volunteer.color, color: '#0f172a' }}
                >
                  {volunteer.type.split('（')[1]?.replace('）', '') || volunteer.type}
                </span>
                <h4 className="font-bold font-display text-slate-200">{volunteer.name}</h4>
              </div>
              <span className="text-lg font-bold font-display" style={{ color: volunteer.color }}>
                {volunteer.probability}%
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {volunteer.requirements.map((req) => (
                <span
                  key={req}
                  className="px-2 py-1 rounded-md bg-white/5 text-[11px] text-slate-400 border border-white/5"
                >
                  {req}
                </span>
              ))}
            </div>
          </div>
        ))}
      </motion.div>

      {/* Manage checkpoints hint */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="flex items-center justify-between p-4 rounded-2xl glass border border-white/5"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
            <Plus className="w-5 h-5 text-slate-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-200">自定义熔断点</p>
            <p className="text-xs text-slate-500">系统已内置默认节点，你也可以添加、修改或删除自己的检查点</p>
          </div>
        </div>
        <button
          onClick={onManageNodes}
          className="px-4 py-2 rounded-lg bg-white/5 text-slate-300 text-sm hover:bg-white/10 transition-all"
        >
          管理节点
        </button>
      </motion.div>
    </div>
  );
}
