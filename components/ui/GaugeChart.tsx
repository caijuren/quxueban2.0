'use client';

import { cn } from '@/lib/utils';

interface GaugeChartProps {
  value: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  labelClassName?: string;
  suffix?: string;
}

export default function GaugeChart({
  value,
  size = 120,
  strokeWidth = 10,
  className,
  labelClassName,
  suffix = '%',
}: GaugeChartProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  // Gauge arc: 240 degrees (from 150° to -30° / 210° to 330° in SVG coords)
  const arcLength = (240 / 360) * circumference;
  const dashoffset = arcLength - (value / 100) * arcLength;
  const rotation = 150; // start at 150 degrees (bottom-left)

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)} style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-[210deg]"
      >
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255, 255, 255, 0.08)"
          strokeWidth={strokeWidth}
          strokeDasharray={`${arcLength} ${circumference - arcLength}`}
          strokeLinecap="round"
        />
        {/* Progress arc with gradient */}
        <defs>
          <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FB7185" />
            <stop offset="100%" stopColor="#F43F7A" />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#gaugeGradient)"
          strokeWidth={strokeWidth}
          strokeDasharray={`${arcLength} ${circumference - arcLength}`}
          strokeDashoffset={dashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={cn('text-3xl font-bold font-display tabular-nums text-text-primary', labelClassName)}>
          {value}
          <span className="text-lg text-text-tertiary ml-0.5">{suffix}</span>
        </span>
      </div>
    </div>
  );
}
