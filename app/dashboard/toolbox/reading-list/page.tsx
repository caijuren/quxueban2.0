'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { BookOpen, Search, X, Check, Library } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { apiGet } from '@/lib/apiClient';
import { useChildren } from '@/components/dashboard/ChildrenContext';
import EmptyState from '@/components/ui/EmptyState';
import type { Book } from '@/lib/types';

interface ReadingListBook extends Book {
  lexile: string;
}

interface ReadingListResponse {
  books: ReadingListBook[];
  total: number;
  grades: string[];
  subjects: string[];
}

const GRADE_LABELS = ['一年级', '二年级', '三年级', '四年级', '五年级'];

function getDefaultGrade(childGrade: number, availableGrades: string[]): string {
  if (childGrade < 1) return '';
  const month = new Date().getMonth() + 1;
  const semester = month >= 2 && month <= 7 ? '下' : '上';
  const yearIndex = Math.min(childGrade - 1, 4);
  const candidate = `${GRADE_LABELS[yearIndex]}${semester}`;
  if (availableGrades.includes(candidate)) return candidate;
  const other = `${GRADE_LABELS[yearIndex]}${semester === '上' ? '下' : '上'}`;
  if (availableGrades.includes(other)) return other;
  return '';
}

function buildQueryString(params: Record<string, string>) {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) qs.set(key, value);
  });
  return qs.toString();
}

function useReadingList(grade: string, subject: string, keyword: string) {
  return useQuery<ReadingListResponse>({
    queryKey: ['reading-list', grade, subject, keyword],
    queryFn: () =>
      apiGet<ReadingListResponse>(
        `/api/toolbox/reading-list?${buildQueryString({ grade, subject, keyword })}`
      ),
  });
}

export default function ReadingListPage() {
  const shouldReduceMotion = useReducedMotion();
  const { currentChild } = useChildren();

  const [grade, setGrade] = useState('');
  const [subject, setSubject] = useState('');
  const [keyword, setKeyword] = useState('');
  const [readIds, setReadIds] = useState<Set<string>>(new Set());

  const { data, isLoading, error } = useReadingList(grade, subject, keyword);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('reading_list_read_ids');
      if (saved) {
        setReadIds(new Set(JSON.parse(saved)));
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    if (!data || grade) return;
    if (!currentChild) return;
    const defaultGrade = getDefaultGrade(currentChild.grade, data.grades);
    if (defaultGrade) setGrade(defaultGrade);
  }, [data, currentChild, grade]);

  const toggleRead = (id: string) => {
    const next = new Set(readIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setReadIds(next);
    try {
      localStorage.setItem('reading_list_read_ids', JSON.stringify(Array.from(next)));
    } catch {
      // ignore
    }
  };

  const filteredBooks = useMemo(() => {
    return data?.books || [];
  }, [data]);

  const clearFilters = () => {
    setGrade('');
    setSubject('');
    setKeyword('');
  };

  const hasActiveFilters = grade || subject || keyword;

  return (
    <div className="space-y-6 min-h-[calc(100vh-8rem)]">
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-secondary/10 border border-secondary/20 flex items-center justify-center">
            <Library className="w-5 h-5 text-secondary" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold font-display text-text-primary">
              阅读书单
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {data && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface border border-border-default text-xs text-text-tertiary">
              <BookOpen className="w-3.5 h-3.5 text-secondary" />
              <span>
                共 <span className="text-text-secondary font-medium">{data.total}</span> 本
              </span>
            </div>
          )}
        </div>
      </motion.div>

      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
        className="rounded-2xl border border-border-default bg-surface-elevated p-4 sm:p-5 space-y-4"
      >
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="搜索书名、作者..."
              className="w-full h-10 pl-9 pr-9 rounded-xl bg-surface border border-border-default text-sm text-text-secondary placeholder:text-text-muted focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
            />
            {keyword && (
              <button
                onClick={() => setKeyword('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary"
                aria-label="清空搜索"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center justify-center gap-1.5 h-10 px-4 rounded-xl border border-border-default text-sm text-text-tertiary hover:text-text-secondary hover:border-border-strong hover:bg-surface transition-all shrink-0"
            >
              清除筛选
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <select
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            className="h-10 px-3 rounded-xl bg-surface border border-border-default text-sm text-text-secondary focus:outline-none focus:border-primary/50"
          >
            <option value="">全部年级</option>
            {(data?.grades || []).map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>

          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="h-10 px-3 rounded-xl bg-surface border border-border-default text-sm text-text-secondary focus:outline-none focus:border-primary/50"
          >
            <option value="">全部学科</option>
            {(data?.subjects || []).map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </motion.div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-10 h-10 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      ) : error ? (
        <EmptyState
          icon={BookOpen}
          title="加载失败"
          description={error instanceof Error ? error.message : '无法加载书单'}
        />
      ) : filteredBooks.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="没有找到相关书籍"
          description="尝试调整筛选条件或搜索关键词"
          action={{
            label: '清除筛选',
            onClick: clearFilters,
          }}
        />
      ) : (
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
        >
          {filteredBooks.map((book, index) => {
            const isRead = readIds.has(book.id);
            return (
              <motion.div
                key={book.id}
                initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: Math.min(index * 0.03, 0.5) }}
                className={`rounded-2xl border ${isRead ? 'border-success/20' : 'border-border-default'} bg-surface p-5 hover:border-border-strong transition-colors group`}
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-2xs px-2 py-1 rounded-full bg-secondary/10 text-secondary border border-secondary/20">
                    {book.grade}
                  </span>
                  <button
                    onClick={() => toggleRead(book.id)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                      isRead
                        ? 'bg-success/15 text-success'
                        : 'bg-surface-elevated text-text-muted hover:text-text-secondary'
                    }`}
                    aria-label={isRead ? '标记为未读' : '标记为已读'}
                  >
                    <Check className={`w-4 h-4 ${isRead ? 'opacity-100' : 'opacity-50'}`} />
                  </button>
                </div>

                <h3 className="text-base font-bold font-display mb-1.5 text-text-primary line-clamp-2">
                  {book.title}
                </h3>
                <p className="text-sm text-text-tertiary mb-3">
                  {book.author || book.publisher.name}
                </p>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  <span className="text-2xs px-1.5 py-0.5 rounded-md bg-surface-elevated text-text-muted border border-border-subtle">
                    {book.subject}
                  </span>
                  <span className="text-2xs px-1.5 py-0.5 rounded-md bg-surface-elevated text-text-muted border border-border-subtle">
                    {book.contentType.name}
                  </span>
                  {book.isNewTextbook === '是' && (
                    <span className="text-2xs px-1.5 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20">
                      新教材
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-border-subtle">
                  <div>
                    <p className="text-2xs text-text-muted">蓝思参考</p>
                    <p className="text-sm font-semibold text-text-secondary">{book.lexile}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xs text-text-muted">难度</p>
                    <p className="text-sm font-semibold text-text-secondary">{'★'.repeat(book.difficulty)}</p>
                  </div>
                </div>

                {isRead && (
                  <div className="mt-3 text-xs text-success flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    已读
                  </div>
                )}
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}
