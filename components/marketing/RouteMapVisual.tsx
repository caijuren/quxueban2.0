'use client';

import { motion } from 'framer-motion';

const routes = [
  { id: 'sg', name: '三公冲刺', color: '#ff2d6a', y: 70, active: true },
  { id: 'dual', name: '双轨维持', color: '#8b5cf6', y: 130, active: false },
  { id: 'public', name: '公办直升', color: '#06b6d4', y: 190, active: false },
  { id: 'international', name: '国际路线', color: '#22c55e', y: 250, active: false },
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
    <div className="rounded-2xl border border-white/10 bg-surface/30 p-6 corner-accent">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-xs font-mono text-slate-400">ROUTE MATRIX // 多路线并行评估</span>
        </div>
        <span className="text-xs font-mono text-primary">ACTIVE</span>
      </div>

      <svg viewBox="0 0 950 320" className="w-full h-auto">
        <defs>
          <pattern id="routeGrid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="950" height="320" fill="url(#routeGrid)" />

        {/* Stage lines */}
        {stages.map((stage) => (
          <g key={stage.label}>
            <line x1={stage.x} y1="40" x2={stage.x} y2="280" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
            <text x={stage.x} y="305" textAnchor="middle" fill="#6b6b7b" fontSize="11" fontFamily="var(--font-mono)">
              {stage.label}
            </text>
          </g>
        ))}

        {/* Routes */}
        {routes.map((route) => (
          <g key={route.id}>
            <motion.path
              d={`M 60 ${route.y} Q 250 ${route.y - (route.active ? 30 : 10)}, 450 ${route.y} T 890 ${route.y}`}
              fill="none"
              stroke={route.color}
              strokeWidth={route.active ? 3 : 1.5}
              strokeOpacity={route.active ? 0.9 : 0.25}
              strokeDasharray={route.active ? undefined : '4 4'}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, delay: 0.3, ease: 'easeInOut' }}
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

        {/* Nodes */}
        {stages.slice(0, 4).map((stage, index) => (
          <motion.g
            key={stage.label}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1 + index * 0.2, duration: 0.4 }}
          >
            <circle cx={stage.x} cy={70} r="5" fill="#ff2d6a" />
          </motion.g>
        ))}
      </svg>

      <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between text-xs">
        <div className="flex items-center gap-6">
          <span className="text-slate-500">
            主路线: <span className="text-primary">三公冲刺型</span>
          </span>
          <span className="text-slate-500">
            备选: <span className="text-secondary">双轨维持</span> · <span className="text-accent">公办直升</span>
          </span>
        </div>
        <span className="font-mono text-slate-600">4 ROUTES LOADED</span>
      </div>
    </div>
  );
}
