'use client';

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, useReducedMotion } from 'framer-motion';
import { Icon, type IconName } from '@/components/ui/icon';
import Card from '@/components/ui/card';
import MetricCard from '@/components/ui/metric-card';
import EmptyState from '@/components/ui/EmptyState';
import { apiGet } from '@/lib/apiClient';
import { cn } from '@/lib/utils';
import type { ReadingAbilityId } from '@/lib/subjects/readingLiteracy';

interface OverviewStats {
  readingCount: number;
  readCount: number;
  totalPages: number;
  totalMinutes: number;
}

interface WeekActivityItem {
  date: string;
  label: string;
  minutes: number;
  count: number;
}

interface RecentBook {
  id: string;
  title: string;
  author: string | null;
  coverImageUrl: string | null;
  status: string;
  totalPages: number | null;
  totalPagesRead: number;
  totalMinutes: number;
  lastReadAt: string | null;
}

interface RecentRecord {
  id: string;
  readDate: string;
  durationMinutes: number;
  pages: number | null;
  note: string | null;
  book: { id: string; title: string };
}

interface LadderInfo {
  current: number;
  phase: string;
  gradeLadder: number;
  comparison: 'ahead' | 'match' | 'behind' | 'insufficient';
  dimensions: Array<{ id: ReadingAbilityId; name: string; score: number }>;
  hasEvidence: boolean;
}

interface ReadingOverview {
  stats: OverviewStats;
  weekActivity: WeekActivityItem[];
  recentBooks: RecentBook[];
  recentRecords: RecentRecord[];
  ladder: LadderInfo;
}

const METRIC_ICONS: Array<{ icon: IconName; label: string; key: keyof OverviewStats; suffix?: string; hint: string }> = [
  { icon: 'BookOpen', label: '在读书籍', key: 'readingCount', hint: '继续阅读' },
  { icon: 'CircleCheck', label: '已读书籍', key: 'readCount', hint: '已完成阅读' },
  { icon: 'BookMarked', label: '阅读总页数', key: 'totalPages', hint: '来自阅读记录' },
  { icon: 'Clock', label: '阅读时长', key: 'totalMinutes', suffix: ' 分钟', hint: '累计记录' },
];

const COMPARISON_META: Record<LadderInfo['comparison'], { label: string; className: string }> = {
  ahead: { label: '超前年级基线', className: 'bg-success/10 text-success' },
  match: { label: '符合年级基线', className: 'bg-primary/10 text-primary' },
  behind: { label: '需重点补强', className: 'bg-warning/10 text-warning' },
  insufficient: { label: '证据待补', className: 'bg-surface-highlight text-text-muted' },
};

const DIM_GROUP: Record<ReadingAbilityId, string> = {
  recognition: 'bg-primary',
  comprehension: 'bg-primary',
  appreciation: 'bg-secondary',
  evaluation: 'bg-secondary',
  application: 'bg-accent',
  innovation: 'bg-accent',
};

function heatIntensity(minutes: number, max: number): string {
  if (minutes <= 0) return 'bg-surface-highlight';
  const ratio = minutes / Math.max(max, 1);
  if (ratio <= 0.25) return 'bg-primary/30';
  if (ratio <= 0.5) return 'bg-primary/55';
  if (ratio <= 0.75) return 'bg-primary/80';
  return 'bg-primary';
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getMonth() + 1}月${d.getDate()}日`;
}

function formatMinutes(minutes: number): string {
  if (minutes < 60) return `${minutes} 分钟`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h} 小时 ${m} 分` : `${h} 小时`;
}

export default function ReadingOverviewSection({ childId }: { childId: string }) {
  const shouldReduceMotion = useReducedMotion();

  const { data, isLoading, error } = useQuery<ReadingOverview>({
    queryKey: ['reading-overview', childId],
    queryFn: () => apiGet(`/api/reading/overview?childId=${childId}`),
  });

  const maxMinutes = useMemo(
    () => Math.max(...(data?.weekActivity.map((d) => d.minutes) ?? [0]), 1),
    [data]
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="border-primary/30 size-10 animate-spin rounded-full border-2 border-t-primary" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <EmptyState
        icon="Library"
        title="概览加载失败"
        description={error instanceof Error ? error.message : '无法加载阅读概览'}
      />
    );
  }

  const { stats, weekActivity, recentBooks, recentRecords, ladder } = data;
  const comparison = COMPARISON_META[ladder.comparison];

  return (
    <div className="space-y-4">
      {/* 4 指标卡 */}
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="grid grid-cols-2 gap-3 lg:grid-cols-4"
      >
        {METRIC_ICONS.map((m) => (
          <MetricCard
            key={m.key}
            label={m.label}
            value={stats[m.key]}
            suffix={m.suffix}
            icon={m.icon}
            description={m.hint}
          />
        ))}
      </motion.div>

      {/* 近 7 天习惯 + 当前梯级 */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.05 }}
          className="lg:col-span-3"
        >
          <Card padding="lg" className="h-full">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon name="Flame" size="sm" className="text-primary" />
                <h3 className="font-display text-base font-bold text-text-primary">近 7 天阅读习惯</h3>
              </div>
              <span className="text-2xs text-text-muted">颜色越深，阅读越久</span>
            </div>
            <div className="grid grid-cols-7 gap-2">
              {weekActivity.map((day) => (
                <div key={day.date} className="flex flex-col items-center gap-1.5">
                  <span className="text-2xs text-text-muted">{day.label}</span>
                  <div
                    className={cn(
                      'flex aspect-square w-full items-center justify-center rounded-lg transition-colors duration-micro',
                      heatIntensity(day.minutes, maxMinutes)
                    )}
                    title={`${day.date}：${day.minutes} 分钟 / ${day.count} 次`}
                  >
                    {day.minutes > 0 && (
                      <span className="text-2xs font-medium text-text-inverse">
                        {day.minutes >= 60 ? `${Math.round(day.minutes / 60)}h` : day.minutes}
                      </span>
                    )}
                  </div>
                  <span className="text-2xs tabular-nums text-text-muted">
                    {day.minutes > 0 ? `${day.minutes}分` : '—'}
                  </span>
                </div>
              ))}
            </div>
            {weekActivity.every((d) => d.minutes === 0) && (
              <p className="mt-4 text-center text-sm text-text-muted">
                本周还没有阅读记录，读一本书并打卡吧
              </p>
            )}
          </Card>
        </motion.div>

        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
          className="lg:col-span-2"
        >
          <Card padding="lg" className="h-full">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon name="TrendingUp" size="sm" className="text-secondary" />
                <h3 className="font-display text-base font-bold text-text-primary">当前阅读梯级</h3>
              </div>
              <span className={cn('rounded-full px-2.5 py-0.5 text-2xs font-medium', comparison.className)}>
                {comparison.label}
              </span>
            </div>

            <div className="mb-4 flex items-end gap-2">
              <span className="font-display text-4xl font-bold text-primary">第 {ladder.current} 梯</span>
              <span className="mb-1.5 text-sm text-text-secondary">{ladder.phase}阶段</span>
            </div>

            {ladder.hasEvidence ? (
              <div className="space-y-2.5">
                {ladder.dimensions.map((d) => (
                  <div key={d.id} className="flex items-center gap-2">
                    <span className="w-12 shrink-0 text-2xs text-text-muted">{d.name}</span>
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-highlight">
                      <div
                        className={cn('h-full rounded-full transition-all duration-500', DIM_GROUP[d.id])}
                        style={{ width: `${d.score}%` }}
                      />
                    </div>
                    <span className="w-6 shrink-0 text-right text-2xs tabular-nums text-text-tertiary">
                      {d.score}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-border-default bg-surface-hover/50 px-4 py-5 text-center">
                <Icon name="FileSearch" size="md" className="mx-auto mb-2 text-text-tertiary" />
                <p className="text-sm font-medium text-text-secondary">证据样本待补充</p>
                <p className="mt-1 text-2xs leading-relaxed text-text-muted">
                  添加带梯级标注的书籍并记录阅读，或录入能力证据后，即可生成能力定位
                </p>
              </div>
            )}

            <p className="mt-4 text-2xs text-text-muted">
              年级基线：第 {ladder.gradeLadder} 梯（按当前年级推算）
            </p>
          </Card>
        </motion.div>
      </div>

      {/* 最近在读 + 最近记录 */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.15 }}
        >
          <Card padding="lg" className="h-full">
            <div className="mb-4 flex items-center gap-2">
              <Icon name="BookOpen" size="sm" className="text-primary" />
              <h3 className="font-display text-base font-bold text-text-primary">最近在读</h3>
            </div>
            {recentBooks.length === 0 ? (
              <p className="py-6 text-center text-sm text-text-muted">还没有在读的书籍</p>
            ) : (
              <div className="space-y-3">
                {recentBooks.map((book) => {
                  const progress =
                    book.totalPages && book.totalPages > 0
                      ? Math.min(100, Math.round((book.totalPagesRead / book.totalPages) * 100))
                      : book.status === 'read'
                        ? 100
                        : 0;
                  return (
                    <div
                      key={book.id}
                      className="flex items-center gap-3 rounded-xl border border-border-subtle bg-surface-hover/50 p-3"
                    >
                      <div className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-surface-elevated">
                        {book.coverImageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={book.coverImageUrl}
                            alt={book.title}
                            className="size-full object-cover"
                          />
                        ) : (
                          <Icon name="BookOpen" size="md" className="text-text-tertiary" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="truncate text-sm font-medium text-text-secondary">{book.title}</p>
                          <span
                            className={cn(
                              'shrink-0 rounded-full px-2 py-0.5 text-2xs',
                              book.status === 'read'
                                ? 'bg-success/10 text-success'
                                : 'bg-primary/10 text-primary'
                            )}
                          >
                            {book.status === 'read' ? '已读完' : '在读中'}
                          </span>
                        </div>
                        <div className="mt-1.5 flex items-center gap-2">
                          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-highlight">
                            <div
                              className="h-full rounded-full bg-primary transition-all duration-500"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          <span className="text-2xs tabular-nums text-text-muted">
                            {book.totalPagesRead}/{book.totalPages ?? '?'} 页
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </motion.div>

        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.2 }}
        >
          <Card padding="lg" className="h-full">
            <div className="mb-4 flex items-center gap-2">
              <Icon name="History" size="sm" className="text-secondary" />
              <h3 className="font-display text-base font-bold text-text-primary">最近记录</h3>
            </div>
            {recentRecords.length === 0 ? (
              <p className="py-6 text-center text-sm text-text-muted">还没有阅读记录</p>
            ) : (
              <div className="space-y-2.5">
                {recentRecords.map((record) => (
                  <div
                    key={record.id}
                    className="flex items-center justify-between gap-3 rounded-xl border border-border-subtle bg-surface-hover/50 px-3 py-2.5"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-text-secondary">
                        {record.book.title}
                      </p>
                      <p className="mt-0.5 text-2xs text-text-muted">
                        {formatDate(record.readDate)}
                        {record.pages ? ` · ${record.pages} 页` : ''}
                        {record.note ? ` · ${record.note}` : ''}
                      </p>
                    </div>
                    <span className="shrink-0 text-2xs tabular-nums text-text-tertiary">
                      {record.durationMinutes} 分钟
                    </span>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
