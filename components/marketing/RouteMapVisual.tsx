'use client';

import { motion } from 'framer-motion';
import { Icon } from '@/components/ui/icon';

const routes = [
  { id: 'sg', name: '三公冲刺', color: 'primary', y: 60, active: true },
  { id: 'dual', name: '双轨维持', color: 'secondary', y: 110, active: false },
  { id: 'public', name: '公办直升', color: 'accent', y: 160, active: false },
  { id: 'international', name: '国际路线', color: 'success', y: 210, active: false },
];

const stages = [
  { x: 100, label: '一升二' },
  { x: 250, label: '二年级' },
  { x: 400, label: '三年级' },
  { x: 550, label: '四年级' },
  { x: 700, label: '五年级' },
  { x: 850, label: '小升初' },
];

const colorClass = (color: string, active: boolean) => {
  const opacity = active ? '' : '/20';
  switch (color) {
    case 'primary':
      return `text-primary${opacity}`;
    case 'secondary':
      return `text-secondary${opacity}`;
    case 'accent':
      return `text-accent${opacity}`;
    case 'success':
      return `text-success${opacity}`;
    default:
      return `text-text-muted${opacity}`;
  }
};

export default function RouteMapVisual() {
  return (
    <div className="rounded-2xl border border-border-subtle bg-surface-elevated p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon name="Target" size="sm" className="text-primary" aria-hidden="true" />
          <span className="font-mono text-[11px] uppercase tracking-wider text-text-tertiary">
            路线矩阵 · 多路线并行评估
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-40" />
            <span className="relative inline-flex size-2 rounded-full bg-primary" />
          </span>
          <span className="font-mono text-[11px] text-primary">ACTIVE</span>
        </div>
      </div>

      <svg viewBox="0 0 950 270" className="h-auto w-full" aria-label="多路线评估示意图">
        <defs>
          <pattern id="routeGrid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke="color-mix(in srgb, var(--text-primary) 3%, transparent)"
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="950" height="270" fill="url(#routeGrid)" />

        {stages.map((stage) => (
          <g key={stage.label}>
            <line
              x1={stage.x}
              y1="30"
              x2={stage.x}
              y2="240"
              stroke="color-mix(in srgb, var(--text-primary) 5%, transparent)"
              strokeWidth="1"
            />
            <text
              x={stage.x}
              y="262"
              textAnchor="middle"
              fill="currentColor"
              className="text-text-muted"
              fontSize="11"
              fontFamily="var(--font-mono)"
            >
              {stage.label}
            </text>
          </g>
        ))}

        {routes.map((route) => (
          <g key={route.id}>
            <motion.path
              d={`M 60 ${route.y} Q 250 ${route.y - (route.active ? 24 : 10)}, 450 ${route.y} T 890 ${route.y}`}
              fill="none"
              stroke="currentColor"
              strokeWidth={route.active ? 2.5 : 1.5}
              strokeDasharray={route.active ? undefined : '5 5'}
              className={colorClass(route.color, route.active)}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, delay: 0.3, ease: 'easeInOut' }}
            />
            <text
              x="45"
              y={route.y + 4}
              textAnchor="end"
              fill="currentColor"
              className={route.active ? colorClass(route.color, true) : 'text-text-muted'}
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
            <circle cx={stage.x} cy={60} r="4" fill="currentColor" className="text-primary" />
          </motion.g>
        ))}
      </svg>

      <div className="mt-4 flex items-center justify-between border-t border-border-subtle pt-4 text-[11px]">
        <div className="flex items-center gap-4">
          <span className="text-text-muted">
            主路线: <span className="text-primary">三公冲刺型</span>
          </span>
          <span className="hidden text-text-muted sm:inline">
            备选: <span className="text-secondary">双轨维持</span> ·{' '}
            <span className="text-accent">公办直升</span>
          </span>
        </div>
        <span className="font-mono text-text-muted">4 ROUTES LOADED</span>
      </div>
    </div>
  );
}
