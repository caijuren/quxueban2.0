'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

type ChartType = 'line' | 'bar';

export interface TrendChartProps {
  data: Array<Record<string, string | number>>;
  xKey: string;
  lines?: Array<{
    key: string;
    color?: string;
    name?: string;
  }>;
  bars?: Array<{
    key: string;
    color?: string;
    name?: string;
  }>;
  type?: ChartType;
  height?: number;
  showGrid?: boolean;
  className?: string;
}

const defaultColors = ['var(--color-primary)', 'var(--color-secondary)', 'var(--success)', 'var(--warning)'];

function CustomTooltip({ active, payload, label }: Record<string, unknown>) {
  if (!active || !Array.isArray(payload) || payload.length === 0) return null;

  return (
    <div className="glass rounded-lg px-3 py-2 text-sm shadow-lg">
      <p className="mb-1 text-xs text-text-tertiary">{String(label)}</p>
      {payload.map((entry: Record<string, unknown>, i: number) => (
        <p key={i} className="tabular-nums text-text-primary" style={{ color: String(entry.color) }}>
          {String(entry.name ?? entry.dataKey)}: {String(entry.value)}
        </p>
      ))}
    </div>
  );
}

export default function TrendChart({
  data,
  xKey,
  lines,
  bars,
  type = 'line',
  height = 240,
  showGrid = true,
  className,
}: TrendChartProps) {
  return (
    <div className={cn('w-full', className)} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        {type === 'line' ? (
          <LineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
            {showGrid && (
              <CartesianGrid
                stroke="var(--border-subtle)"
                strokeWidth={1}
                vertical={false}
              />
            )}
            <XAxis
              dataKey={xKey}
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'var(--text-tertiary)', fontSize: 12 }}
              dy={8}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'var(--text-tertiary)', fontSize: 12 }}
              width={40}
            />
            <Tooltip content={<CustomTooltip />} />
            {lines?.map((line, i) => (
              <Line
                key={line.key}
                type="monotone"
                dataKey={line.key}
                name={line.name ?? line.key}
                stroke={line.color ?? defaultColors[i % defaultColors.length]}
                strokeWidth={2}
                dot={{ r: 3, fill: line.color ?? defaultColors[i % defaultColors.length] }}
                activeDot={{ r: 5 }}
              />
            ))}
          </LineChart>
        ) : (
          <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
            {showGrid && (
              <CartesianGrid
                stroke="var(--border-subtle)"
                strokeWidth={1}
                vertical={false}
              />
            )}
            <XAxis
              dataKey={xKey}
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'var(--text-tertiary)', fontSize: 12 }}
              dy={8}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'var(--text-tertiary)', fontSize: 12 }}
              width={40}
            />
            <Tooltip content={<CustomTooltip />} />
            {bars?.map((bar, i) => (
              <Bar
                key={bar.key}
                dataKey={bar.key}
                name={bar.name ?? bar.key}
                fill={bar.color ?? defaultColors[i % defaultColors.length]}
                radius={[4, 4, 0, 0]}
                barSize={24}
              />
            ))}
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}