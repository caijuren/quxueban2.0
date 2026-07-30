'use client';

import { motion } from 'framer-motion';
import { Target } from 'lucide-react';

const routes = [
  { id: 'sg', name: '三公冲刺', color: '#ff2d6a', y: 60, active: true },
  { id: 'dual', name: '双轨维持', color: '#8b5cf6', y: 110, active: false },
  { id: 'public', name: '公办直升', color: '#a78bfa', y: 160, active: false },
  { id: 'international', name: '国际路线', color: '#94a3b8', y: 210, active: false },
];

const stages = [
  { x: 100, label: '一升二' },
  { x: 250, label: '二年级' },
  { x: 400, label: '三年级' },
  { x: 550, label: '四年级' },
  { x: 700, label: '五年级' },
  { x: 850, label: '小升初' },
];

export default function RouteMapVisual() {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/[0.02] p-5 corner-accent backdrop-blur-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Target className="w-3.5 h-3.5 text-primary" aria-hidden="true" />
          <span className="text-xs font-mono text-text-tertiary uppercase tracking-wider">
            路线矩阵 · 多路线并行评估
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-40" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
          </span>
          <span className="text-xs font-mono text-primary">ACTIVE</span>
        </div>
      </div>

      <svg viewBox="0 0 950 270" className="w-full h-auto" aria-label="多路线评估示意图">
        <defs>
          <pattern id="routeGrid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
          </pattern>
          <linearGradient id="routeActiveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ff2d6a" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#ff5c8a" stopOpacity="0.3" />
          </linearGradient>
        </defs>
        <rect width="950" height="270" fill="url(#routeGrid)" />

        {stages.map((stage) => (
          <g key={stage.label}>
            <line x1={stage.x} y1="30" x2={stage.x} y2="240" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
            <text x={stage.x} y="262" textAnchor="middle" fill="#6b6b7b" fontSize="11" fontFamily="var(--font-mono)">
              {stage.label}
            </text>
          </g>
        ))}

        {routes.map((route) => (
          <g key={route.id}>
            <motion.path
              d={`M 60 ${route.y} Q 250 ${route.y - (route.active ? 24 : 10)}, 450 ${route.y} T 890 ${route.y}`}
              fill="none"
              stroke={route.active ? 'url(#routeActiveGradient)' : route.color}
              strokeWidth={route.active ? 2.5 : 1.5}
              strokeOpacity={route.active ? 1 : 0.2}
              strokeDasharray={route.active ? undefined : '5 5'}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, delay: 0.3, ease: 'easeInOut' }}
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

        {stages.slice(0, 4).map((stage, index) => (
          <motion.g
            key={stage.label}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1 + index * 0.15, duration: 0.35 }}
          >
            <circle cx={stage.x} cy={60} r="4" fill="#ff2d6a" />
          </motion.g>
        ))}
      </svg>

      <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between text-xs">
        <div className="flex items-center gap-4">
          <span className="text-text-muted">
            主路线: <span className="text-primary">三公冲刺型</span>
          </span>
          <span className="text-text-muted hidden sm:inline">
            备选: <span className="text-secondary">双轨维持</span> · <span className="text-accent">公办直升</span>
          </span>
        </div>
        <span className="font-mono text-text-muted">4 ROUTES LOADED</span>
      </div>
    </div>
  );
}
