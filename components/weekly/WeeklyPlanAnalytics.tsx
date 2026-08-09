'use client';

import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@/components/ui/icon';
import CommandCard from '@/components/ui/CommandCard';
import { type WeeklyPlan } from '@/lib/storage.types';
import { dayOrder, parseDurationMinutes, getPlanStats } from '@/lib/weeklyTasks';
import { TASK_CATEGORY_LABELS } from '@/lib/taskTemplates';
import { categoryIcons, allCategories } from './weeklyConstants';

interface WeeklyPlanAnalyticsProps {
  plan: WeeklyPlan;
}

type ChartTab = 'heatmap' | 'distribution' | 'plan-vs-actual';

function completionColor(rate: number) {
  // 0% -> transparent/surface, 100% -> primary solid
  return `color-mix(in srgb, var(--color-primary) ${Math.round(rate * 100)}%, transparent)`;
}

// ---------- Heatmap ----------

function WeeklyHeatmap({ tasks }: { tasks: WeeklyPlan['tasks'] }) {
  const data = useMemo(() => {
    const rows = allCategories.map((category) => {
      const cells = dayOrder.map((day) => {
        const list = tasks.filter((t) => t.category === category && t.day === day);
        const total = list.length;
        const done = list.filter((t) => t.status === 'done').length;
        const rate = total === 0 ? -1 : done / total;
        const plannedMinutes = list.reduce((sum, t) => sum + parseDurationMinutes(t.duration), 0);
        const actualMinutes = list
          .filter((t) => t.status === 'done')
          .reduce((sum, t) => {
            const last = t.completionRecords?.[t.completionRecords.length - 1];
            return sum + (last?.actualDurationMinutes ?? parseDurationMinutes(t.duration));
          }, 0);
        return { day, total, done, rate, plannedMinutes, actualMinutes };
      });
      return { category, cells };
    });
    return rows;
  }, [tasks]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-text-secondary">周完成度热力图</p>
        <div className="flex items-center gap-2 text-2xs text-text-muted">
          <span className="flex items-center gap-1">
            <span className="inline-block size-3 rounded bg-surface-elevated border border-border-subtle" />
            无任务
          </span>
          <span className="flex items-center gap-1">
            <span
              className="inline-block size-3 rounded"
              style={{ backgroundColor: 'var(--color-primary)' }}
            />
            已完成
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[560px]">
          <div className="grid" style={{ gridTemplateColumns: '100px repeat(7, 1fr)' }}>
            <div className="text-2xs text-text-muted" />
            {dayOrder.map((day) => (
              <div key={day} className="py-2 text-center text-xs text-text-tertiary">
                {day}
              </div>
            ))}
            {data.map(({ category, cells }) => {
              const icon = categoryIcons[category];
              return (
                <React.Fragment key={category}>
                  <div className="flex items-center gap-2 py-2 text-xs text-text-secondary">
                    <Icon name={icon} size="xs" className="text-text-tertiary" />
                    {TASK_CATEGORY_LABELS[category]}
                  </div>
                  {cells.map((cell, idx) => {
                    const empty = cell.total === 0;
                    const ratePct = empty ? 0 : Math.round(cell.rate * 100);
                    return (
                      <motion.div
                        key={cell.day}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.03 }}
                        className={`m-0.5 flex flex-col items-center justify-center rounded-lg border p-2 ${
                          empty
                            ? 'border-border-subtle bg-surface-elevated'
                            : 'border-border-subtle'
                        }`}
                        style={
                          empty
                            ? undefined
                            : { backgroundColor: completionColor(cell.rate) }
                        }
                        title={`${TASK_CATEGORY_LABELS[category]} · ${cell.day}：${cell.done}/${cell.total} 完成${
                          cell.plannedMinutes > 0
                            ? ` · 计划 ${cell.plannedMinutes} 分钟 · 实际 ${cell.actualMinutes} 分钟`
                            : ''
                        }`}
                      >
                        {!empty && (
                          <>
                            <span
                              className={`text-xs font-bold ${
                                cell.rate > 0.5 ? 'text-text-primary' : 'text-text-secondary'
                              }`}
                            >
                              {ratePct}%
                            </span>
                            <span
                              className={`text-[9px] ${
                                cell.rate > 0.5 ? 'text-text-primary/80' : 'text-text-muted'
                              }`}
                            >
                              {cell.done}/{cell.total}
                            </span>
                          </>
                        )}
                      </motion.div>
                    );
                  })}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------- Distribution: Pie + Radar ----------

function TimeDistributionCharts({ tasks }: { tasks: WeeklyPlan['tasks'] }) {
  const categoryData = useMemo(() => {
    return allCategories
      .map((category) => {
        const minutes = tasks
          .filter((t) => t.category === category)
          .reduce((sum, t) => sum + parseDurationMinutes(t.duration), 0);
        return { category, minutes, label: TASK_CATEGORY_LABELS[category] };
      })
      .filter((d) => d.minutes > 0)
      .sort((a, b) => b.minutes - a.minutes);
  }, [tasks]);

  const subjectData = useMemo(() => {
    const map = new Map<string, { subject: string; minutes: number; count: number }>();
    tasks.forEach((t) => {
      const subject = t.subjectId ?? 'other';
      const prev = map.get(subject) ?? { subject, minutes: 0, count: 0 };
      prev.minutes += parseDurationMinutes(t.duration);
      prev.count += 1;
      map.set(subject, prev);
    });
    return Array.from(map.values()).sort((a, b) => b.minutes - a.minutes);
  }, [tasks]);

  const totalMinutes = useMemo(
    () => categoryData.reduce((sum, d) => sum + d.minutes, 0),
    [categoryData]
  );

  // Pie chart via SVG conic gradient fallback: stroke-dasharray arcs
  const colors = [
    'var(--color-primary)',
    'var(--color-secondary)',
    'var(--color-accent)',
    'var(--color-success)',
    'var(--color-warning)',
    'var(--color-info)',
  ];

  const pieRadius = 64;
  const pieCircumference = 2 * Math.PI * pieRadius;
  let pieOffset = 0;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Pie: time by category */}
      <div className="space-y-3">
        <p className="text-sm font-semibold text-text-secondary">分类时间占比</p>
        {categoryData.length === 0 ? (
          <p className="text-xs text-text-muted">暂无任务数据</p>
        ) : (
          <div className="flex items-center gap-5">
            <div className="relative" style={{ width: pieRadius * 2 + 16, height: pieRadius * 2 + 16 }}>
              <svg className="size-full -rotate-90">
                <circle
                  cx={pieRadius + 8}
                  cy={pieRadius + 8}
                  r={pieRadius}
                  stroke="var(--border-default)"
                  strokeWidth={16}
                  fill="none"
                />
                {categoryData.map((d, i) => {
                  const ratio = d.minutes / totalMinutes;
                  const dash = pieCircumference * ratio;
                  const offset = pieOffset;
                  pieOffset -= dash;
                  return (
                    <circle
                      key={d.category}
                      cx={pieRadius + 8}
                      cy={pieRadius + 8}
                      r={pieRadius}
                      stroke={colors[i % colors.length]}
                      strokeWidth={16}
                      fill="none"
                      strokeDasharray={`${dash} ${pieCircumference - dash}`}
                      strokeDashoffset={offset}
                      strokeLinecap="butt"
                      style={{ transition: 'all 0.5s ease-out' }}
                    />
                  );
                })}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-display text-lg font-bold text-text-primary">
                  {Math.round(totalMinutes / 60)}
                </span>
                <span className="text-[9px] text-text-muted">小时</span>
              </div>
            </div>
            <div className="min-w-0 flex-1 space-y-1.5">
              {categoryData.map((d, i) => (
                <div key={d.category} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span
                      className="inline-block size-2.5 rounded-full"
                      style={{ backgroundColor: colors[i % colors.length] }}
                    />
                    <span className="text-text-secondary">{d.label}</span>
                  </div>
                  <div className="text-text-muted">
                    <span className="font-medium text-text-primary">
                      {Math.round((d.minutes / totalMinutes) * 100)}%
                    </span>
                    <span className="ml-1 text-[10px]">({Math.round(d.minutes)}分)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Radar: subjects */}
      <div className="space-y-3">
        <p className="text-sm font-semibold text-text-secondary">学科覆盖雷达</p>
        {subjectData.length === 0 ? (
          <p className="text-xs text-text-muted">暂无学科数据</p>
        ) : (
          <SubjectRadar data={subjectData} />
        )}
      </div>
    </div>
  );
}

function SubjectRadar({
  data,
}: {
  data: { subject: string; minutes: number; count: number }[];
}) {
  const max = Math.max(...data.map((d) => d.minutes), 1);
  const count = data.length;
  const radius = 72;
  const center = radius + 12;
  const angleFor = (i: number) => (i * 2 * Math.PI) / count - Math.PI / 2;

  const points = data.map((d, i) => {
    const r = (d.minutes / max) * radius;
    const angle = angleFor(i);
    return [center + r * Math.cos(angle), center + r * Math.sin(angle)];
  });

  const polyString = points.map((p) => p.join(',')).join(' ');

  return (
    <div className="flex items-center gap-5">
      <svg width={center * 2} height={center * 2} className="shrink-0">
        {[0.25, 0.5, 0.75, 1].map((level) => (
          <polygon
            key={level}
            points={data
              .map((_, i) => {
                const r = level * radius;
                const angle = angleFor(i);
                return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`;
              })
              .join(' ')}
            fill="none"
            stroke="var(--border-default)"
            strokeWidth={1}
          />
        ))}
        {data.map((_, i) => {
          const angle = angleFor(i);
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={center + radius * Math.cos(angle)}
              y2={center + radius * Math.sin(angle)}
              stroke="var(--border-default)"
              strokeWidth={1}
            />
          );
        })}
        <polygon
          points={polyString}
          fill="color-mix(in srgb, var(--color-secondary) 20%, transparent)"
          stroke="var(--color-secondary)"
          strokeWidth={2}
        />
        {points.map((p, i) => (
          <circle key={i} cx={p[0]} cy={p[1]} r={3} fill="var(--color-secondary)" />
        ))}
      </svg>
      <div className="min-w-0 flex-1 space-y-1">
        {data.map((d) => (
          <div key={d.subject} className="flex items-center justify-between text-xs">
            <span className="text-text-secondary">
              {d.subject === 'other' ? '其他' : d.subject.toUpperCase()}
            </span>
            <span className="text-text-muted">
              {Math.round(d.minutes)}分 · {d.count}项
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------- Plan vs Actual ----------

function PlanVsActualChart({ tasks }: { tasks: WeeklyPlan['tasks'] }) {
  const data = useMemo(() => {
    return dayOrder.map((day) => {
      const list = tasks.filter((t) => t.day === day);
      const planned = list.reduce((sum, t) => sum + parseDurationMinutes(t.duration), 0);
      const actual = list
        .filter((t) => t.status === 'done')
        .reduce((sum, t) => {
          const last = t.completionRecords?.[t.completionRecords.length - 1];
          return sum + (last?.actualDurationMinutes ?? parseDurationMinutes(t.duration));
        }, 0);
      const total = list.length;
      const done = list.filter((t) => t.status === 'done').length;
      return { day, planned, actual, total, done };
    });
  }, [tasks]);

  const max = Math.max(...data.map((d) => Math.max(d.planned, d.actual)), 1);
  const barHeight = 120;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-text-secondary">计划 vs 实际时长</p>
        <div className="flex items-center gap-3 text-2xs text-text-muted">
          <span className="flex items-center gap-1">
            <span
              className="inline-block size-2.5 rounded-full"
              style={{ backgroundColor: 'var(--color-primary)' }}
            />
            计划
          </span>
          <span className="flex items-center gap-1">
            <span
              className="inline-block size-2.5 rounded-full"
              style={{ backgroundColor: 'var(--color-success)' }}
            />
            实际
          </span>
        </div>
      </div>

      <div className="flex items-end gap-2 sm:gap-4">
        {data.map((d) => {
          const plannedH = (d.planned / max) * barHeight;
          const actualH = (d.actual / max) * barHeight;
          const completionRate = d.total === 0 ? 0 : Math.round((d.done / d.total) * 100);
          return (
            <div key={d.day} className="flex flex-1 flex-col items-center gap-1">
              <div
                className="relative flex w-full items-end justify-center gap-0.5 sm:gap-1"
                style={{ height: barHeight }}
              >
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: plannedH }}
                  className="w-2 rounded-t sm:w-3"
                  style={{ backgroundColor: 'var(--color-primary)' }}
                  title={`计划 ${Math.round(d.planned)} 分钟`}
                />
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: actualH }}
                  className="w-2 rounded-t sm:w-3"
                  style={{ backgroundColor: 'var(--color-success)' }}
                  title={`实际 ${Math.round(d.actual)} 分钟`}
                />
              </div>
              <span className="text-[10px] text-text-tertiary">{d.day.replace('周', '')}</span>
              {d.total > 0 && (
                <span
                  className={`text-[9px] ${
                    completionRate === 100
                      ? 'text-success'
                      : completionRate >= 60
                        ? 'text-warning'
                        : 'text-error'
                  }`}
                >
                  {completionRate}%
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ---------- Main ----------

export function WeeklyPlanAnalytics({ plan }: WeeklyPlanAnalyticsProps) {
  const [activeTab, setActiveTab] = useState<ChartTab>('heatmap');
  const stats = useMemo(() => getPlanStats(plan), [plan]);

  return (
    <CommandCard className="p-5">
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-display text-lg font-semibold text-text-primary">周计划数据洞察</p>
          <p className="mt-1 text-xs text-text-tertiary">
            共 {stats.total} 项任务 · 完成率 {stats.completionRate}% · 总时长{' '}
            {Math.round(plan.tasks.reduce((s, t) => s + parseDurationMinutes(t.duration), 0) / 60)}
            小时
          </p>
        </div>
        <div className="flex items-center gap-1 rounded-xl border border-border-subtle bg-surface-elevated p-1">
          {[
            { key: 'heatmap', label: '热力图', icon: 'Grid3x3' as const },
            { key: 'distribution', label: '分布', icon: 'PieChart' as const },
            { key: 'plan-vs-actual', label: '对比', icon: 'BarChart3' as const },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as ChartTab)}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                activeTab === tab.key
                  ? 'bg-primary text-text-primary'
                  : 'text-text-tertiary hover:text-text-secondary'
              }`}
            >
              <Icon name={tab.icon} size="xs" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'heatmap' && <WeeklyHeatmap tasks={plan.tasks} />}
      {activeTab === 'distribution' && <TimeDistributionCharts tasks={plan.tasks} />}
      {activeTab === 'plan-vs-actual' && <PlanVsActualChart tasks={plan.tasks} />}
    </CommandCard>
  );
}
