'use client';

import { motion } from 'framer-motion';
import { CalendarCheck } from 'lucide-react';

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
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 corner-accent backdrop-blur-sm">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <CalendarCheck className="w-3.5 h-3.5 text-primary" aria-hidden="true" />
          <span className="text-xs font-mono text-text-tertiary uppercase tracking-wider">
            里程碑时间线 · 2025-2030
          </span>
        </div>
        <span className="text-xs font-mono text-primary">TRACKING</span>
      </div>

      <svg viewBox="0 0 900 250" className="w-full h-auto" aria-label="升学里程碑时间线">
        <defs>
          <pattern id="timelineGrid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
          </pattern>
          <linearGradient id="timelineLineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ff2d6a" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#ff2d6a" stopOpacity="0.1" />
          </linearGradient>
        </defs>
        <rect width="900" height="250" fill="url(#timelineGrid)" />

        <motion.line
          x1="80"
          y1="110"
          x2="780"
          y2="110"
          stroke="url(#timelineLineGradient)"
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, delay: 0.3 }}
        />

        {milestones.map((milestone, index) => (
          <motion.g
            key={milestone.grade}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 + index * 0.1, duration: 0.4 }}
          >
            <line
              x1={milestone.x}
              y1="110"
              x2={milestone.x}
              y2={milestone.status === 'current' ? '55' : '165'}
              stroke={milestone.status === 'current' ? '#ff2d6a' : 'rgba(255,255,255,0.08)'}
              strokeWidth="1"
              strokeDasharray={milestone.status === 'current' ? undefined : '3 3'}
            />

            <circle
              cx={milestone.x}
              cy="110"
              r={milestone.status === 'current' ? 6 : 4}
              fill={milestone.status === 'current' ? '#ff2d6a' : '#1a1a28'}
              stroke={milestone.status === 'current' ? '#ff2d6a' : 'rgba(255,255,255,0.25)'}
              strokeWidth="2"
            />

            <text
              x={milestone.x}
              y={milestone.status === 'current' ? '42' : '185'}
              textAnchor="middle"
              fill={milestone.status === 'current' ? '#ff2d6a' : '#8b8b9a'}
              fontSize="11"
              fontFamily="var(--font-mono)"
              fontWeight={milestone.status === 'current' ? '600' : '400'}
            >
              {milestone.grade}
            </text>
            <text
              x={milestone.x}
              y={milestone.status === 'current' ? '28' : '199'}
              textAnchor="middle"
              fill={milestone.status === 'current' ? '#ffffff' : '#6b6b7b'}
              fontSize="10"
              fontFamily="var(--font-body)"
            >
              {milestone.event}
            </text>

            {milestone.status === 'current' && (
              <circle cx={milestone.x} cy="110" r="12" fill="none" stroke="#ff2d6a" strokeWidth="1" opacity="0.3">
                <animate attributeName="r" from="12" to="22" dur="2s" repeatCount="indefinite" />
                <animate attributeName="opacity" from="0.3" to="0" dur="2s" repeatCount="indefinite" />
              </circle>
            )}
          </motion.g>
        ))}

        {subTasks.map((task, index) => {
          const parent = milestones[task.parent];
          return (
            <motion.g
              key={task.label}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4 + index * 0.1, duration: 0.35 }}
            >
              <rect
                x={parent.x - 50}
                y="220"
                width="100"
                height="22"
                rx="4"
                fill="rgba(255,45,106,0.06)"
                stroke="rgba(255,45,106,0.15)"
              />
              <text
                x={parent.x}
                y="234"
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
        <span className="text-slate-500">
          当前: <span className="text-primary">一升二暑假 · 路线选择</span>
        </span>
        <span className="font-mono text-text-muted">6 MAJOR MILESTONES</span>
      </div>
    </div>
  );
}
