'use client';
import { Icon } from '@/components/ui/icon';
import Button from '@/components/ui/button';
import Select from '@/components/ui/select';
import SearchInput from '@/components/ui/search-input';
import FilterPanel from '@/components/ui/filter-panel';

import { useEffect, useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

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
    <div className="min-h-[calc(100vh-8rem)] space-y-6">
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="bg-secondary/10 border-secondary/20 flex size-10 items-center justify-center rounded-xl border">
            <Icon name="Library" size="md" className="text-secondary" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-text-primary sm:text-3xl">
              阅读书单
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {data && (
            <div className="flex items-center gap-2 rounded-xl border border-border-default bg-surface px-3 py-1.5 text-xs text-text-tertiary">
              <Icon name="BookOpen" size="xs" className="text-secondary" />
              <span>
                共 <span className="font-medium text-text-secondary">{data.total}</span> 本
              </span>
            </div>
          )}
        </div>
      </motion.div>

      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
      >
        <FilterPanel activeCount={[grade, subject, keyword].filter(Boolean).length} onClear={clearFilters}>
          <div className="flex flex-col gap-3 sm:flex-row">
            <SearchInput
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onClear={() => setKeyword('')}
              placeholder="搜索书名、作者..."
              className="flex-1"
            />

            {hasActiveFilters && (
              <Button
                type="button"
                variant="secondary"
                size="md"
                onClick={clearFilters}
                className="hidden sm:inline-flex"
              >
                <Icon name="RotateCcw" size="sm" />
                清除筛选
              </Button>
            )}
          </div>

          <div className="mt-3 grid grid-cols-2 gap-3 sm:max-w-xl">
            <Select
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              placeholder="全部年级"
              size="md"
              className="bg-surface"
              options={(data?.grades || []).map((g) => ({
                value: g,
                label: g,
              }))}
            />

            <Select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="全部学科"
              size="md"
              className="bg-surface"
              options={(data?.subjects || []).map((s) => ({
                value: s,
                label: s,
              }))}
            />
          </div>
        </FilterPanel>
      </motion.div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="border-primary/30 size-10 animate-spin rounded-full border-2 border-t-primary" />
        </div>
      ) : error ? (
        <EmptyState
          icon="BookOpen"
          title="加载失败"
          description={error instanceof Error ? error.message : '无法加载书单'}
        />
      ) : filteredBooks.length === 0 ? (
        <EmptyState
          icon="BookOpen"
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
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {filteredBooks.map((book, index) => {
            const isRead = readIds.has(book.id);
            return (
              <motion.div
                key={book.id}
                initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: Math.min(index * 0.03, 0.5) }}
                className={`rounded-xl border ${isRead ? 'border-success/20' : 'border-border-default'} group bg-surface p-5 transition-colors hover:border-border-strong`}
              >
                <div className="mb-3 flex items-start justify-between">
                  <span className="bg-secondary/10 border-secondary/20 rounded-full border px-2 py-1 text-2xs text-secondary">
                    {book.grade}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleRead(book.id)}
                    className={`rounded-full ${
                      isRead
                        ? 'bg-success/15 text-success'
                        : 'bg-surface-elevated text-text-muted hover:text-text-secondary'
                    }`}
                    aria-label={isRead ? '标记为未读' : '标记为已读'}
                  >
                    <Icon
                      name="Check"
                      size="md"
                      className={`size-4 ${isRead ? 'opacity-100' : 'opacity-50'}`}
                    />
                  </Button>
                </div>

                <h3 className="mb-1.5 line-clamp-2 font-display text-base font-bold text-text-primary">
                  {book.title}
                </h3>
                <p className="mb-3 text-sm text-text-tertiary">
                  {book.author || book.publisher.name}
                </p>

                <div className="mb-4 flex flex-wrap gap-1.5">
                  <span className="rounded-md border border-border-subtle bg-surface-elevated px-1.5 py-0.5 text-2xs text-text-muted">
                    {book.subject}
                  </span>
                  <span className="rounded-md border border-border-subtle bg-surface-elevated px-1.5 py-0.5 text-2xs text-text-muted">
                    {book.contentType.name}
                  </span>
                  {book.isNewTextbook === '是' && (
                    <span className="bg-primary/10 border-primary/20 rounded-md border px-1.5 py-0.5 text-2xs text-primary">
                      新教材
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between border-t border-border-subtle pt-3">
                  <div>
                    <p className="text-2xs text-text-muted">蓝思参考</p>
                    <p className="text-sm font-semibold text-text-secondary">{book.lexile}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xs text-text-muted">难度</p>
                    <p className="text-sm font-semibold text-text-secondary">
                      {'★'.repeat(book.difficulty)}
                    </p>
                  </div>
                </div>

                {isRead && (
                  <div className="mt-3 flex items-center gap-1 text-xs text-success">
                    <Icon name="Check" size="xs" />
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
