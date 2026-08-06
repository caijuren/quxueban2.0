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
    <div className="space-y-6 min-h-[calc(100vh-8rem)]">
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-warning/10 border border-warning/20 flex items-center justify-center">
            <Award className="w-5 h-5 text-warning" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold font-display text-text-primary">
              标化考试日历
            </h1>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
        className="rounded-2xl border border-border-default bg-surface-elevated p-5 sm:p-6 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-warning/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="relative flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-text-secondary">
              以下考试时间为参考日期，具体报名与考试安排请以官方通知为准。
            </p>
          </div>
        </div>
      </motion.div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-10 h-10 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
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
            <h2 className="text-base font-bold font-display text-text-secondary mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" />
              即将开始
            </h2>
            {upcoming.length === 0 ? (
              <EmptyState icon={Calendar} title="暂无 upcoming 考试" description="所有考试已结束或暂未发布" />
            ) : (
              <div className="space-y-4">
                {upcoming.map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={shouldReduceMotion ? false : { opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.5) }}
                    className="rounded-2xl border border-border-default bg-surface p-5 hover:border-border-strong transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                      <div className="flex flex-col items-center justify-center min-w-[80px] px-4 py-3 rounded-xl bg-surface-elevated border border-border-subtle">
                        <span className="text-2xs text-text-muted uppercase">{new Date(event.date).getFullYear()}</span>
                        <span className="text-xl font-bold font-display text-text-primary">{formatDate(event.date)}</span>
                        <span className={`text-2xs mt-1 ${event.daysUntil <= 30 ? 'text-primary' : 'text-text-muted'}`}>
                          {getDaysLabel(event.daysUntil)}
                        </span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <h3 className="text-lg font-bold font-display text-text-primary">{event.name}</h3>
                          {event.tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-2xs px-1.5 py-0.5 rounded-md bg-surface-elevated text-text-muted border border-border-subtle"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <p className="text-sm text-text-secondary mb-3">{event.description}</p>
                        <div className="flex flex-wrap gap-4 text-xs text-text-tertiary">
                          <span className="flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                            {event.subject}
                          </span>
                          <span className="flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                            适合：{event.targetGrades}
                          </span>
                          {event.registrationDeadline && (
                            <span className="flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-warning" />
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
              <h2 className="text-base font-bold font-display text-text-secondary mb-4 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-text-muted" />
                已结束
              </h2>
              <div className="space-y-3 opacity-60">
                {past.map((event) => (
                  <div
                    key={event.id}
                    className="rounded-2xl border border-border-default bg-surface p-4 flex flex-col sm:flex-row sm:items-center gap-3"
                  >
                    <span className="text-sm text-text-tertiary min-w-[80px]">{formatDate(event.date)}</span>
                    <span className="text-base font-bold font-display text-text-secondary">{event.name}</span>
                    <span className="text-xs text-text-muted">{event.subject} · {event.targetGrades}</span>
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
