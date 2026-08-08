'use client';

import { useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Award, Calendar, Clock, AlertCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { apiGet } from '@/lib/apiClient';
import EmptyState from '@/components/ui/EmptyState';

interface ExamEvent {
  id: string;
  name: string;
  subject: string;
  targetGrades: string;
  date: string;
  registrationDeadline?: string;
  description: string;
  tags: string[];
  daysUntil: number;
}

interface ExamCalendarResponse {
  events: ExamEvent[];
}

function useExamCalendar() {
  return useQuery<ExamCalendarResponse>({
    queryKey: ['exam-calendar'],
    queryFn: () => apiGet<ExamCalendarResponse>('/api/toolbox/exam-calendar'),
  });
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getMonth() + 1}月${d.getDate()}日`;
}

function getDaysLabel(days: number) {
  if (days < 0) return `已结束 ${Math.abs(days)} 天`;
  if (days === 0) return '今天';
  if (days <= 30) return `还有 ${days} 天`;
  return `${Math.floor(days / 30)} 个月后`;
}

export default function ExamCalendarPage() {
  const shouldReduceMotion = useReducedMotion();
  const { data, isLoading, error } = useExamCalendar();

  const upcoming = useMemo(() => (data?.events || []).filter((e) => e.daysUntil >= 0), [data]);
  const past = useMemo(() => (data?.events || []).filter((e) => e.daysUntil < 0), [data]);

  return (
    <div className="min-h-[calc(100vh-8rem)] space-y-6">
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="bg-warning/10 border-warning/20 flex size-10 items-center justify-center rounded-xl border">
            <Award className="size-5 text-warning" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-text-primary sm:text-3xl">
              标化考试日历
            </h1>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
        className="relative overflow-hidden rounded-2xl border border-border-default bg-surface-elevated p-5 sm:p-6"
      >
        <div className="bg-warning/5 pointer-events-none absolute right-0 top-0 size-64 -translate-y-1/2 translate-x-1/3 rounded-full blur-3xl" />
        <div className="relative flex items-start gap-3">
          <AlertCircle className="mt-0.5 size-5 shrink-0 text-warning" />
          <div>
            <p className="text-sm text-text-secondary">
              以下考试时间为参考日期，具体报名与考试安排请以官方通知为准。
            </p>
          </div>
        </div>
      </motion.div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="border-primary/30 size-10 animate-spin rounded-full border-2 border-t-primary" />
        </div>
      ) : error ? (
        <EmptyState
          icon={Award}
          title="加载失败"
          description={error instanceof Error ? error.message : '无法加载考试日历'}
        />
      ) : (
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="space-y-6"
        >
          <section>
            <h2 className="mb-4 flex items-center gap-2 font-display text-base font-bold text-text-secondary">
              <Clock className="size-4 text-primary" />
              即将开始
            </h2>
            {upcoming.length === 0 ? (
              <EmptyState
                icon={Calendar}
                title="暂无 upcoming 考试"
                description="所有考试已结束或暂未发布"
              />
            ) : (
              <div className="space-y-4">
                {upcoming.map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={shouldReduceMotion ? false : { opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.5) }}
                    className="rounded-2xl border border-border-default bg-surface p-5 transition-colors hover:border-border-strong"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                      <div className="flex min-w-[80px] flex-col items-center justify-center rounded-xl border border-border-subtle bg-surface-elevated px-4 py-3">
                        <span className="text-2xs uppercase text-text-muted">
                          {new Date(event.date).getFullYear()}
                        </span>
                        <span className="font-display text-xl font-bold text-text-primary">
                          {formatDate(event.date)}
                        </span>
                        <span
                          className={`mt-1 text-2xs ${event.daysUntil <= 30 ? 'text-primary' : 'text-text-muted'}`}
                        >
                          {getDaysLabel(event.daysUntil)}
                        </span>
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                          <h3 className="font-display text-lg font-bold text-text-primary">
                            {event.name}
                          </h3>
                          {event.tags.map((tag) => (
                            <span
                              key={tag}
                              className="rounded-md border border-border-subtle bg-surface-elevated px-1.5 py-0.5 text-2xs text-text-muted"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <p className="mb-3 text-sm text-text-secondary">{event.description}</p>
                        <div className="flex flex-wrap gap-4 text-xs text-text-tertiary">
                          <span className="flex items-center gap-1">
                            <span className="size-1.5 rounded-full bg-secondary" />
                            {event.subject}
                          </span>
                          <span className="flex items-center gap-1">
                            <span className="size-1.5 rounded-full bg-accent" />
                            适合：{event.targetGrades}
                          </span>
                          {event.registrationDeadline && (
                            <span className="flex items-center gap-1">
                              <span className="size-1.5 rounded-full bg-warning" />
                              报名截止：{formatDate(event.registrationDeadline)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </section>

          {past.length > 0 && (
            <section>
              <h2 className="mb-4 flex items-center gap-2 font-display text-base font-bold text-text-secondary">
                <Calendar className="size-4 text-text-muted" />
                已结束
              </h2>
              <div className="space-y-3 opacity-60">
                {past.map((event) => (
                  <div
                    key={event.id}
                    className="flex flex-col gap-3 rounded-2xl border border-border-default bg-surface p-4 sm:flex-row sm:items-center"
                  >
                    <span className="min-w-[80px] text-sm text-text-tertiary">
                      {formatDate(event.date)}
                    </span>
                    <span className="font-display text-base font-bold text-text-secondary">
                      {event.name}
                    </span>
                    <span className="text-xs text-text-muted">
                      {event.subject} · {event.targetGrades}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </motion.div>
      )}
    </div>
  );
}
