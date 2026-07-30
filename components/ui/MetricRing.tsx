'use client';

import { cn } from '@/lib/utils';

interface MetricRingProps {
  rate: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  sublabel?: string;
  className?: string;
}

export default function MetricRing({
  rate,
  size = 72,
  strokeWidth = 8,
  label,
  sublabel,
  className,
}: MetricRingProps) {
  const safeRate = Math.min(100, Math.max(0, rate));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - safeRate / 100);

  return (
    <div className={cn('relative inline-flex flex-col items-center', className)} style={{ width: size, height: size }}>
      <svg className="w-full h-full -rotate-90" viewBox={`0 0 ${size} ${size}`}>
        <defs>
          <linearGradient id="metricRingGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ff2d6a" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#metricRingGradient)"
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.6s ease-out' }}
        />
      </svg>
      {(label || sublabel) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {label && <span className="text-base font-bold font-display tabular-nums">{label}</span>}
          {sublabel && <span className="text-[10px] text-slate-600">{sublabel}</span>}
        </div>
      )}
    </div>
  );
}
