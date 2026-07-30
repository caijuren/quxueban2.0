'use client';

import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { mathTracks, mathTrackNodes, mathTimeAxisLabels } from '@/lib/subjects/math';

const VIEWBOX = { width: 1100, height: 420, startX: 80, endX: 1000 };

const trackConfig = {
  school: {
    label: '校内数学',
    color: '#3b82f6',
    glowColor: 'rgba(59, 130, 246, 0.5)',
    y: 120,
  },
  olympiad: {
    label: '奥数体系',
    color: '#8b5cf6',
    glowColor: 'rgba(139, 92, 246, 0.5)',
    y: 220,
  },
  exam: {
    label: '竞赛证书',
    color: '#f59e0b',
    glowColor: 'rgba(245, 158, 11, 0.5)',
    y: 320,
  },
};

function positionToX(position: number) {
  return VIEWBOX.startX + (position / 100) * (VIEWBOX.endX - VIEWBOX.startX);
}

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function createParticles() {
  return Array.from({ length: 40 }, (_, i) => ({
    id: i,
    x: seededRandom(i * 17) * VIEWBOX.width,
    y: seededRandom(i * 31) * VIEWBOX.height,
    size: seededRandom(i * 47) * 2 + 0.5,
    duration: seededRandom(i * 59) * 3 + 2,
    delay: seededRandom(i * 71) * 2,
  }));
}

export default function MathTrackMap() {
  const [mounted, setMounted] = useState(false);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: VIEWBOX.width / 2, y: VIEWBOX.height / 2 });
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });

  useEffect(() => {
    setMounted(true);
  }, []);

  const particles = useMemo(() => createParticles(), []);

  const getNodesByTrack = (track: 'school' | 'olympiad' | 'exam') =>
    mathTrackNodes.filter((n) => n.track === track).sort((a, b) => a.position - b.position);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ rotateX: y * -1.5, rotateY: x * 1.5 });
  };

  const handleMouseLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0 });
    setHoveredNode(null);
  };

  const hoveredData = hoveredNode ? mathTrackNodes.find((n) => n.id === hoveredNode) : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="rounded-3xl glass p-6 border border-border-subtle relative overflow-hidden"
      style={{
        perspective: '1200px',
        transform: `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`,
        transformStyle: 'preserve-3d',
        transition: 'transform 0.15s ease-out',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <div>
          <h2 className="text-xl font-bold font-display">数学三条线作战地图</h2>
          <p className="text-sm text-text-secondary mt-1">从现在到三公，三条主线并行推进</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {mathTracks.map((track) => {
            const cfg = trackConfig[track.id as keyof typeof trackConfig];
            return (
              <div
                key={track.id}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-surface-light border border-border-subtle"
              >
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: cfg.color, boxShadow: `0 0 10px ${cfg.glowColor}` }}
                />
                <span className="text-xs text-text-secondary">{track.name}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* SVG Chart */}
      <div className="relative w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${VIEWBOX.width} ${VIEWBOX.height}`}
          className="w-full min-w-[900px] h-auto"
          preserveAspectRatio="xMidYMid meet"
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * VIEWBOX.width;
            const y = ((e.clientY - rect.top) / rect.height) * VIEWBOX.height;
            setMousePos({ x, y });
          }}
        >
          <defs>
            {(['school', 'olympiad', 'exam'] as const).map((trackId) => {
              const cfg = trackConfig[trackId];
              return (
                <marker
                  key={`arrow-${trackId}`}
                  id={`arrow-${trackId}`}
                  markerWidth="10"
                  markerHeight="10"
                  refX="9"
                  refY="3"
                  orient="auto"
                  markerUnits="strokeWidth"
                >
                  <path d="M0,0 L0,6 L9,3 z" fill={cfg.color} opacity="0.8" />
                </marker>
              );
            })}

            <linearGradient id="currentPulse" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f43f5e" stopOpacity="0" />
              <stop offset="50%" stopColor="#f43f5e" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#f43f5e" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Background grid lines */}
          {mathTimeAxisLabels.map((t) => {
            const x = positionToX(t.position);
            return (
              <line
                key={t.position}
                x1={x}
                y1={50}
                x2={x}
                y2={360}
                stroke="rgba(15, 23, 42, 0.06)"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
            );
          })}

          {/* Ambient glow + particles */}
          {mounted && (
            <>
              <defs>
                <radialGradient id="ambientGlow1" cx="30%" cy="30%" r="50%">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.12" />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="ambientGlow2" cx="70%" cy="70%" r="45%">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.1" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="cursorGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.08" />
                  <stop offset="50%" stopColor="#f43f5e" stopOpacity="0.04" />
                  <stop offset="100%" stopColor="#f43f5e" stopOpacity="0" />
                </radialGradient>
              </defs>
              <ellipse
                cx={250}
                cy={140}
                rx={220}
                ry={160}
                fill="url(#ambientGlow1)"
              >
                <animate
                  attributeName="cx"
                  values="250;300;250"
                  dur="8s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="cy"
                  values="140;170;140"
                  dur="8s"
                  repeatCount="indefinite"
                />
              </ellipse>
              <ellipse
                cx={800}
                cy={280}
                rx={200}
                ry={140}
                fill="url(#ambientGlow2)"
              >
                <animate
                  attributeName="cx"
                  values="800;750;800"
                  dur="10s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="cy"
                  values="280;250;280"
                  dur="10s"
                  repeatCount="indefinite"
                />
              </ellipse>
              <motion.g
                initial={{
                  x: mousePos?.x ?? VIEWBOX.width / 2,
                  y: mousePos?.y ?? VIEWBOX.height / 2,
                }}
                animate={{
                  x: mousePos?.x ?? VIEWBOX.width / 2,
                  y: mousePos?.y ?? VIEWBOX.height / 2,
                }}
                transition={{ type: 'spring', stiffness: 150, damping: 30 }}
                style={{ pointerEvents: 'none' }}
              >
                <ellipse
                  cx={0}
                  cy={0}
                  rx={160}
                  ry={100}
                  fill="url(#cursorGlow)"
                />
              </motion.g>
              {particles.map((p) => (
                <motion.circle
                  key={p.id}
                  cx={p.x ?? 0}
                  cy={p.y ?? 0}
                  r={p.size ?? 1}
                  fill="rgba(15, 23, 42, 0.35)"
                  initial={{ opacity: 0.1, cy: p.y ?? 0 }}
                  animate={{
                    opacity: [0.1, 0.5, 0.1],
                    cy: [p.y ?? 0, (p.y ?? 0) - 10, p.y ?? 0],
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

          {/* Time axis */}
          <line
            x1={VIEWBOX.startX}
            y1={40}
            x2={VIEWBOX.endX + 20}
            y2={40}
            stroke="rgba(15, 23, 42, 0.15)"
            strokeWidth="2"
            strokeLinecap="round"
          />
          {mathTimeAxisLabels.map((t) => {
            const x = positionToX(t.position);
            return (
              <g key={t.position}>
                <line x1={x} y1={36} x2={x} y2={44} stroke="rgba(15, 23, 42, 0.3)" strokeWidth="2" />
                <text
                  x={x}
                  y={28}
                  fill="#64748b"
                  fontSize="11"
                  fontWeight="500"
                  textAnchor="middle"
                >
                  {t.label}
                </text>
              </g>
            );
          })}

          {/* Tracks */}
          {(['school', 'olympiad', 'exam'] as const).map((trackId) => {
            const cfg = trackConfig[trackId];
            const nodes = getNodesByTrack(trackId);
            const y = cfg.y;

            return (
              <g key={trackId}>
                {/* Track line */}
                <motion.line
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, delay: 0.3 }}
                  x1={VIEWBOX.startX}
                  y1={y}
                  x2={VIEWBOX.endX}
                  y2={y}
                  stroke={cfg.color}
                  strokeWidth={3}
                  strokeLinecap="round"
                  markerEnd={`url(#arrow-${trackId})`}
                  style={{
                    filter: `drop-shadow(0 0 12px ${cfg.glowColor})`,
                    opacity: 0.75,
                  }}
                />

                {/* Flowing light */}
                <motion.line
                  x1={VIEWBOX.startX}
                  y1={y}
                  x2={VIEWBOX.endX}
                  y2={y}
                  stroke="rgba(15, 23, 42, 0.4)"
                  strokeWidth={1.5}
                  strokeLinecap="round"
                  strokeDasharray="60 250"
                  initial={{ strokeDashoffset: 310 }}
                  animate={{ strokeDashoffset: 0 }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
                  style={{
                    filter: `drop-shadow(0 0 8px ${cfg.color})`,
                    opacity: 0.5,
                  }}
                />

                {/* Track label */}
                <text
                  x={VIEWBOX.startX - 15}
                  y={y + 4}
                  fill={cfg.color}
                  fontSize="12"
                  fontWeight="600"
                  textAnchor="end"
                  style={{ filter: `drop-shadow(0 0 6px ${cfg.glowColor})` }}
                >
                  {cfg.label}
                </text>

                {/* Nodes */}
                {nodes.map((node, index) => {
                  const x = positionToX(node.position);
                  const isCurrent = node.isCurrent;
                  const isHovered = hoveredNode === node.id;

                  return (
                    <g
                      key={node.id}
                      transform={`translate(${x}, ${y})`}
                      onMouseEnter={() => setHoveredNode(node.id)}
                      onMouseLeave={() => setHoveredNode(null)}
                      style={{ cursor: 'pointer' }}
                    >
                      {/* Outer glow */}
                      {isCurrent && (
                        <motion.circle
                          r={18}
                          fill="none"
                          stroke="url(#currentPulse)"
                          strokeWidth="2"
                          animate={{ r: [14, 22, 14], opacity: [0.6, 0, 0.6] }}
                          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                        />
                      )}

                      {/* Node circle */}
                      <motion.circle
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.5 + index * 0.08 }}
                        r={isCurrent ? 14 : 10}
                        fill={isCurrent ? cfg.color : '#ffffff'}
                        stroke={cfg.color}
                        strokeWidth={isCurrent ? 3 : 2}
                        style={{
                          filter: isCurrent
                            ? `drop-shadow(0 0 14px ${cfg.glowColor})`
                            : `drop-shadow(0 0 6px ${cfg.glowColor})`,
                        }}
                      />

                      {/* Inner dot for non-current nodes */}
                      {!isCurrent && (
                        <circle r={4} fill={cfg.color} opacity={0.8} />
                      )}

                      {/* Node label */}
                      <text
                        y={isCurrent ? -22 : 22}
                        fill={isCurrent ? '#0f172a' : '#64748b'}
                        fontSize={isCurrent ? '12' : '10'}
                        fontWeight={isCurrent ? '700' : '500'}
                        textAnchor="middle"
                        style={{
                          filter: isCurrent ? `drop-shadow(0 0 8px ${cfg.glowColor})` : 'none',
                          pointerEvents: 'none',
                        }}
                      >
                        {node.label.length > 6 ? node.label.slice(0, 5) + '…' : node.label}
                      </text>
                    </g>
                  );
                })}
              </g>
            );
          })}

          {/* Current time indicator */}
          <line
            x1={VIEWBOX.startX}
            y1={50}
            x2={VIEWBOX.startX}
            y2={360}
            stroke="#f43f5e"
            strokeWidth="2"
            strokeDasharray="6 4"
            opacity="0.5"
          />
          <rect
            x={VIEWBOX.startX - 30}
            y={40}
            width="60"
            height="20"
            rx="10"
            fill="rgba(244,63,94,0.15)"
            stroke="rgba(244,63,94,0.4)"
          />
          <text x={VIEWBOX.startX} y={54} fill="#f43f5e" fontSize="10" fontWeight="600" textAnchor="middle">
            当前位置
          </text>
        </svg>
      </div>

      {/* Hover tooltip */}
      {hoveredData && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-24 right-6 w-56 p-4 rounded-xl bg-surface border border-border-subtle shadow-dropdown z-20"
        >
          <div className="flex items-center gap-2 mb-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{
                backgroundColor: trackConfig[hoveredData.track].color,
                boxShadow: `0 0 10px ${trackConfig[hoveredData.track].glowColor}`,
              }}
            />
            <p className="text-xs text-text-secondary">{hoveredData.time}</p>
          </div>
          <p className="text-sm font-bold text-text-primary mb-1">{hoveredData.label}</p>
          <p className="text-xs text-text-secondary">{hoveredData.detail}</p>
        </motion.div>
      )}

      {/* Bottom summary */}
      <div className="mt-6 pt-6 border-t border-border-subtle grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl bg-blue-500/5 border border-blue-500/10 p-3">
          <p className="text-xs text-blue-400 mb-1">校内线</p>
          <p className="text-sm text-text-secondary">二年级 → 五年级校内 · 初中衔接</p>
        </div>
        <div className="rounded-xl bg-violet-500/5 border border-violet-500/10 p-3">
          <p className="text-xs text-violet-400 mb-1">奥数线</p>
          <p className="text-sm text-text-secondary">启蒙 → 系统 → 模块深入 → AMC8 专题</p>
        </div>
        <div className="rounded-xl bg-amber-500/5 border border-amber-500/10 p-3">
          <p className="text-xs text-amber-400 mb-1">竞赛线</p>
          <p className="text-sm text-text-secondary">袋鼠 → 澳洲 AMC → AMC8 20+</p>
        </div>
      </div>
    </motion.div>
  );
}
