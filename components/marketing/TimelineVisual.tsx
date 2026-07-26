'use client';

import { motion } from 'framer-motion';

const milestones = [
  { grade: '一升二', event: '路线选择', status: 'current', x: 80 },
  { grade: '二年级', event: '基础检查', status: 'upcoming', x: 220 },
  { grade: '三年级', event: '奥数启动', status: 'upcoming', x: 360 },
  { grade: '四年级', event: '竞赛出分', status: 'upcoming', x: 500 },
  { grade: '五年级', event: '综合定位', status: 'upcoming', x: 640 },
  { grade: '小升初', event: '三公报名', status: 'event', x: 780 },
];

const subTasks = [
  { parent: 2, label: '小托福 850+' },
  { parent: 2, label: 'AMC8 首考' },
  { parent: 3, label: '思维100' },
  { parent: 4, label: '面谈准备' },
];

export default function TimelineVisual() {
  return (
    <div className="rounded-2xl border border-white/10 bg-surface/30 p-6 corner-accent">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-xs font-mono text-slate-400">MILESTONE TIMELINE // 2025-2030</span>
        </div>
        <span className="text-xs font-mono text-primary">TRACKING</span>
      </div>

      <svg viewBox="0 0 900 280" className="w-full h-auto">
        <defs>
          <pattern id="timelineGrid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="900" height="280" fill="url(#timelineGrid)" />

        {/* Main timeline */}
        <motion.line
          x1="80"
          y1="120"
          x2="780"
          y2="120"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, delay: 0.3 }}
        />

        {/* Milestones */}
        {milestones.map((milestone, index) => (
          <motion.g
            key={milestone.grade}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 + index * 0.15, duration: 0.5 }}
          >
            {/* Vertical connector */}
            <line
              x1={milestone.x}
              y1="120"
              x2={milestone.x}
              y2={milestone.status === 'current' ? '60' : '180'}
              stroke={milestone.status === 'current' ? '#ff2d6a' : 'rgba(255,255,255,0.1)'}
              strokeWidth="1"
              strokeDasharray={milestone.status === 'current' ? undefined : '2 2'}
            />

            {/* Node */}
            <circle
              cx={milestone.x}
              cy="120"
              r={milestone.status === 'current' ? 8 : 5}
              fill={milestone.status === 'current' ? '#ff2d6a' : '#1a1a28'}
              stroke={milestone.status === 'current' ? '#ff2d6a' : 'rgba(255,255,255,0.3)'}
              strokeWidth="2"
            />

            {/* Label */}
            <text
              x={milestone.x}
              y={milestone.status === 'current' ? '45' : '205'}
              textAnchor="middle"
              fill={milestone.status === 'current' ? '#ff2d6a' : '#8b8b9a'}
              fontSize="12"
              fontFamily="var(--font-mono)"
              fontWeight={milestone.status === 'current' ? '600' : '400'}
            >
              {milestone.grade}
            </text>
            <text
              x={milestone.x}
              y={milestone.status === 'current' ? '30' : '220'}
              textAnchor="middle"
              fill={milestone.status === 'current' ? '#ffffff' : '#6b6b7b'}
              fontSize="11"
              fontFamily="var(--font-body)"
            >
              {milestone.event}
            </text>

            {/* Current pulse */}
            {milestone.status === 'current' && (
              <circle cx={milestone.x} cy="120" r="16" fill="none" stroke="#ff2d6a" strokeWidth="1" opacity="0.3">
                <animate attributeName="r" from="16" to="28" dur="2s" repeatCount="indefinite" />
                <animate attributeName="opacity" from="0.3" to="0" dur="2s" repeatCount="indefinite" />
              </circle>
            )}
          </motion.g>
        ))}

        {/* Sub-tasks */}
        {subTasks.map((task, index) => {
          const parent = milestones[task.parent];
          return (
            <motion.g
              key={task.label}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.8 + index * 0.1, duration: 0.4 }}
            >
              <rect
                x={parent.x - 55}
                y="245"
                width="110"
                height="24"
                rx="4"
                fill="rgba(255,45,106,0.08)"
                stroke="rgba(255,45,106,0.2)"
              />
              <text
                x={parent.x}
                y="261"
                textAnchor="middle"
                fill="#ff8aa8"
                fontSize="10"
                fontFamily="var(--font-mono)"
              >
                {task.label}
              </text>
            </motion.g>
          );
        })}
      </svg>

      <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between text-xs">
        <div className="flex items-center gap-4">
          <span className="text-slate-500">
            当前: <span className="text-primary">一升二暑假 · 路线选择</span>
          </span>
        </div>
        <span className="font-mono text-slate-600">6 MAJOR MILESTONES</span>
      </div>
    </div>
  );
}
