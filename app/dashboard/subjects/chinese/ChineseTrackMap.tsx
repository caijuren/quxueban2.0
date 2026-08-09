'use client';

import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { SubjectPlanConfig, SubjectPlanNode, SubjectPlanTrack } from '@/lib/subjects/subjectPlan';

interface ChineseTrackMapProps {
  config: SubjectPlanConfig;
  currentGrade?: number;
}

const VIEWBOX = {
  width: 1100,
  startX: 120,
  endX: 1000,
  topPadding: 80,
  trackSpacing: 72,
  bottomPadding: 120,
};

function positionToX(position: number) {
  return VIEWBOX.startX + (position / 100) * (VIEWBOX.endX - VIEWBOX.startX);
}

function getCurrentTimeLabel(grade?: number): string | null {
  if (!grade || grade < 1) return null;
  if (grade >= 5) return '三公';

  const month = new Date().getMonth() + 1;
  // 9-1 月：上学期；2-6 月：下学期；7-8 月：暑假，按刚结束的下学期算
  const semester = month >= 9 || month <= 1 ? '上' : '下';
  const gradeNames = ['零', '一', '二', '三', '四', '五'];
  return `${gradeNames[grade]}${semester}`;
}

function getCurrentPosition(grade?: number, timeAxis?: { label: string; position: number }[]) {
  if (!timeAxis || timeAxis.length === 0) return VIEWBOX.startX;

  const label = getCurrentTimeLabel(grade);
  if (!label) return VIEWBOX.startX;

  const match = timeAxis.find((t) => t.label.includes(label));
  if (match) return positionToX(match.position);

  // 兜底：按年级粗略估算
  if (!grade || grade < 1) return VIEWBOX.startX;
  if (grade >= 5) return positionToX(100);
  return positionToX(10 + (grade - 1) * 20);
}

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function hexToRgba(hex: string, alpha: number) {
  const clean = hex.replace('#', '');
  const bigint = parseInt(
    clean.length === 3
      ? clean
          .split('')
          .map((c) => c + c)
          .join('')
      : clean,
    16
  );
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export default function ChineseTrackMap({ config, currentGrade }: ChineseTrackMapProps) {
  const [mounted, setMounted] = useState(false);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: VIEWBOX.width / 2, y: 0 });
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });

  useEffect(() => {
    setMounted(true);
  }, []);

  const viewBoxHeight = useMemo(() => {
    return (
      VIEWBOX.topPadding + (config.tracks.length - 1) * VIEWBOX.trackSpacing + VIEWBOX.bottomPadding
    );
  }, [config.tracks.length]);

  const particles = useMemo(() => {
    return Array.from({ length: 40 }, (_, i) => ({
      id: i,
      x: seededRandom(i * 17) * VIEWBOX.width,
      y: seededRandom(i * 31) * viewBoxHeight,
      size: seededRandom(i * 47) * 2 + 0.5,
      duration: seededRandom(i * 59) * 3 + 2,
      delay: seededRandom(i * 71) * 2,
    }));
  }, [viewBoxHeight]);

  const trackMeta = useMemo(() => {
    return config.tracks.reduce(
      (acc, track, index) => {
        acc[track.id] = {
          ...track,
          y: VIEWBOX.topPadding + index * VIEWBOX.trackSpacing,
          glowColor: hexToRgba(track.color, 0.5),
        };
        return acc;
      },
      {} as Record<string, SubjectPlanTrack & { y: number; glowColor: string }>
    );
  }, [config.tracks]);

  const nodesByTrack = useMemo(() => {
    return config.nodes.reduce(
      (acc, node) => {
        if (!acc[node.trackId]) acc[node.trackId] = [];
        acc[node.trackId].push(node);
        return acc;
      },
      {} as Record<string, SubjectPlanNode[]>
    );
  }, [config.nodes]);

  const currentX = useMemo(
    () => getCurrentPosition(currentGrade, config.timeAxis),
    [currentGrade, config.timeAxis]
  );

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

  const hoveredData = hoveredNode ? config.nodes.find((n) => n.id === hoveredNode) : null;
  const hoveredTrack = hoveredData ? trackMeta[hoveredData.trackId] : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="relative overflow-hidden rounded-3xl border border-border-subtle bg-surface-elevated p-6"
      style={{
        perspective: '1200px',
        transform: `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`,
        transformStyle: 'preserve-3d',
        transition: 'transform 0.15s ease-out',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="mb-4 flex flex-col gap-4">
        <div>
          <h2 className="font-display text-xl font-bold">语文六线规划地图</h2>
        </div>
        {/* Bottom legend */}
        <div className="flex flex-wrap gap-3">
          {config.tracks.map((track) => {
            const meta = trackMeta[track.id];
            return (
              <div
                key={track.id}
                className="flex items-center gap-1.5 rounded-lg border border-border-subtle bg-surface-elevated px-2.5 py-1.5"
              >
                <div
                  className="size-3 rounded-full"
                  style={{
                    backgroundColor: track.color,
                    boxShadow: `0 0 10px ${meta?.glowColor}`,
                  }}
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
          viewBox={`0 0 ${VIEWBOX.width} ${viewBoxHeight}`}
          className="h-auto w-full min-w-[900px]"
          preserveAspectRatio="xMidYMid meet"
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * VIEWBOX.width;
            const y = ((e.clientY - rect.top) / rect.height) * viewBoxHeight;
            setMousePos({ x, y });
          }}
        >
          <defs>
            {config.tracks.map((track) => {
              const meta = trackMeta[track.id];
              return (
                <marker
                  key={`arrow-${track.id}`}
                  id={`arrow-${track.id}`}
                  markerWidth="10"
                  markerHeight="10"
                  refX="9"
                  refY="3"
                  orient="auto"
                  markerUnits="strokeWidth"
                >
                  <path d="M0,0 L0,6 L9,3 z" fill={track.color} opacity="0.8" />
                </marker>
              );
            })}

            <linearGradient id="currentPulse" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0" />
              <stop offset="50%" stopColor="var(--color-primary)" stopOpacity="0.6" />
              <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Background grid lines */}
          {config.timeAxis.map((t) => {
            const x = positionToX(t.position);
            return (
              <line
                key={t.position}
                x1={x}
                y1={40}
                x2={x}
                y2={viewBoxHeight - 80}
                stroke="rgba(255,255,255,0.06)"
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
                  <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.12" />
                  <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="ambientGlow2" cx="70%" cy="70%" r="45%">
                  <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.1" />
                  <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="cursorGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="var(--text-primary)" stopOpacity="0.08" />
                  <stop offset="50%" stopColor="var(--color-primary)" stopOpacity="0.04" />
                  <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
                </radialGradient>
              </defs>
              <ellipse cx={250} cy={VIEWBOX.topPadding} rx={220} ry={160} fill="url(#ambientGlow1)">
                <animate
                  attributeName="cx"
                  values="250;300;250"
                  dur="8s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="cy"
                  values={`${VIEWBOX.topPadding};${VIEWBOX.topPadding + 30};${VIEWBOX.topPadding}`}
                  dur="8s"
                  repeatCount="indefinite"
                />
              </ellipse>
              <ellipse cx={800} cy={viewBoxHeight / 2} rx={200} ry={140} fill="url(#ambientGlow2)">
                <animate
                  attributeName="cx"
                  values="800;750;800"
                  dur="10s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="cy"
                  values={`${viewBoxHeight / 2};${viewBoxHeight / 2 - 30};${viewBoxHeight / 2}`}
                  dur="10s"
                  repeatCount="indefinite"
                />
              </ellipse>
              <motion.g
                initial={{
                  x: mousePos?.x ?? VIEWBOX.width / 2,
                  y: mousePos?.y ?? viewBoxHeight / 2,
                }}
                animate={{
                  x: mousePos?.x ?? VIEWBOX.width / 2,
                  y: mousePos?.y ?? viewBoxHeight / 2,
                }}
                transition={{ type: 'spring', stiffness: 150, damping: 30 }}
                style={{ pointerEvents: 'none' }}
              >
                <ellipse cx={0} cy={0} rx={160} ry={100} fill="url(#cursorGlow)" />
              </motion.g>
              {particles.map((p) => (
                <motion.circle
                  key={p.id}
                  cx={p.x ?? 0}
                  cy={p.y ?? 0}
                  r={p.size ?? 1}
                  fill="white"
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
            y1={50}
            x2={VIEWBOX.endX + 20}
            y2={50}
            stroke="rgba(255,255,255,0.15)"
            strokeWidth="2"
            strokeLinecap="round"
          />
          {config.timeAxis.map((t) => {
            const x = positionToX(t.position);
            return (
              <g key={t.position}>
                <line
                  x1={x}
                  y1={46}
                  x2={x}
                  y2={54}
                  stroke="rgba(255,255,255,0.3)"
                  strokeWidth="2"
                />
                <text
                  x={x}
                  y={34}
                  fill="rgba(148,163,184,0.8)"
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
          {config.tracks.map((track, trackIndex) => {
            const meta = trackMeta[track.id];
            const nodes = (nodesByTrack[track.id] || []).sort((a, b) => a.position - b.position);
            const y = meta.y;

            return (
              <g key={track.id}>
                {/* Track line */}
                <motion.line
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, delay: 0.3 + trackIndex * 0.1 }}
                  x1={VIEWBOX.startX}
                  y1={y}
                  x2={VIEWBOX.endX}
                  y2={y}
                  stroke={track.color}
                  strokeWidth={3}
                  strokeLinecap="round"
                  markerEnd={`url(#arrow-${track.id})`}
                  style={{
                    filter: `drop-shadow(0 0 12px ${meta.glowColor})`,
                    opacity: 0.75,
                  }}
                />

                {/* Flowing light */}
                <motion.line
                  x1={VIEWBOX.startX}
                  y1={y}
                  x2={VIEWBOX.endX}
                  y2={y}
                  stroke="white"
                  strokeWidth={1.5}
                  strokeLinecap="round"
                  strokeDasharray="60 250"
                  initial={{ strokeDashoffset: 310 }}
                  animate={{ strokeDashoffset: 0 }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
                  style={{
                    filter: `drop-shadow(0 0 8px ${track.color})`,
                    opacity: 0.5,
                  }}
                />

                {/* Track label */}
                <text
                  x={VIEWBOX.startX - 15}
                  y={y + 4}
                  fill={track.color}
                  fontSize="11"
                  fontWeight="600"
                  textAnchor="end"
                  style={{ filter: `drop-shadow(0 0 6px ${meta.glowColor})` }}
                >
                  {track.name}
                </text>

                {/* Nodes */}
                {nodes.map((node, index) => {
                  const x = positionToX(node.position);
                  const isHovered = hoveredNode === node.id;

                  return (
                    <g
                      key={node.id}
                      transform={`translate(${x}, ${y})`}
                      onMouseEnter={() => setHoveredNode(node.id)}
                      onMouseLeave={() => setHoveredNode(null)}
                      style={{ cursor: 'pointer' }}
                    >
                      {/* Node circle */}
                      <motion.circle
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.5 + index * 0.08 }}
                        r={10}
                        fill="var(--bg-primary)"
                        stroke={track.color}
                        strokeWidth={2}
                        style={{
                          filter: `drop-shadow(0 0 6px ${meta.glowColor})`,
                        }}
                      />

                      <circle r={4} fill={track.color} opacity="0.8" />

                      {/* Node label */}
                      <text
                        y={22}
                        fill="rgba(148,163,184,0.9)"
                        fontSize="10"
                        fontWeight="500"
                        textAnchor="middle"
                        style={{
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
            x1={currentX}
            y1={60}
            x2={currentX}
            y2={viewBoxHeight - 90}
            stroke="var(--color-primary)"
            strokeWidth="2"
            strokeDasharray="6 4"
            opacity="0.5"
          />
          <rect
            x={currentX - 30}
            y={44}
            width="60"
            height="20"
            rx="10"
            fill="color-mix(in srgb, var(--color-primary) 15%, transparent)"
            stroke="color-mix(in srgb, var(--color-primary) 40%, transparent)"
          />
          <text
            x={currentX}
            y={58}
            fill="var(--color-primary)"
            fontSize="10"
            fontWeight="600"
            textAnchor="middle"
          >
            当前位置
          </text>
        </svg>
      </div>

      {/* Hover tooltip */}
      {hoveredData && hoveredTrack && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-surface/95 absolute right-6 top-36 z-20 w-56 rounded-xl border border-border-default p-4 shadow-2xl"
        >
          <div className="mb-2 flex items-center gap-2">
            <div
              className="size-3 rounded-full"
              style={{
                backgroundColor: hoveredTrack.color,
                boxShadow: `0 0 10px ${hoveredTrack.glowColor}`,
              }}
            />
            <p className="text-xs text-text-muted">{hoveredData.time}</p>
          </div>
          <p className="mb-1 text-sm font-bold text-text-secondary">{hoveredData.label}</p>
          <p className="text-xs text-text-tertiary">{hoveredData.detail}</p>
        </motion.div>
      )}
    </motion.div>
  );
}
