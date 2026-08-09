'use client';
import { Icon } from '@/components/ui/icon';
import Button from '@/components/ui/button';

import { useEffect, useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

import { useChildren } from '@/components/dashboard/ChildrenContext';
import { useBooks, useBookFilters } from '@/lib/hooks/useBooks';
import EmptyState from '@/components/ui/EmptyState';
import FilterSelect from './components/FilterSelect';
import BookCard from './components/BookCard';
import BookDetailModal from './components/BookDetailModal';

const GRADE_LABELS = ['一年级', '二年级', '三年级', '四年级', '五年级'];

function getDefaultGrade(childGrade: number, availableGrades: string[]): string {
  if (childGrade < 1) return '';

  const month = new Date().getMonth() + 1;
  const semester = month >= 2 && month <= 7 ? '下' : '上';
  const yearIndex = Math.min(childGrade - 1, 4);
  const candidate = `${GRADE_LABELS[yearIndex]}${semester}`;

  if (availableGrades.includes(candidate)) return candidate;

  // 如果候选学期不存在，尝试另一学期
  const other = `${GRADE_LABELS[yearIndex]}${semester === '上' ? '下' : '上'}`;
  if (availableGrades.includes(other)) return other;

  // 完全匹配不到时返回空（显示全部）
  return '';
}

export default function TeachingAidsPage() {
  const shouldReduceMotion = useReducedMotion();
  const { currentChild } = useChildren();

  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);
  const [keyword, setKeyword] = useState('');
  const [grade, setGrade] = useState('');
  const [subject, setSubject] = useState('');
  const [publisher, setPublisher] = useState('');
  const [contentType, setContentType] = useState('');
  const [isNewTextbook, setIsNewTextbook] = useState('');
  const [difficulty, setDifficulty] = useState('');

  const { data: filtersData } = useBookFilters();
  const {
    data: booksData,
    isLoading,
    error,
  } = useBooks({
    grade,
    subject,
    publisher,
    contentType,
    isNewTextbook,
    difficulty,
    keyword,
  });

  // 默认按当前孩子年级筛选
  useEffect(() => {
    if (!filtersData || grade) return;
    if (!currentChild) return;
    const defaultGrade = getDefaultGrade(currentChild.grade, filtersData.grades);
    if (defaultGrade) setGrade(defaultGrade);
  }, [filtersData, currentChild, grade]);

  const activeFiltersCount = useMemo(
    () =>
      [grade, subject, publisher, contentType, isNewTextbook, difficulty].filter(Boolean).length,
    [grade, subject, publisher, contentType, isNewTextbook, difficulty]
  );

  const hasActiveFilters = activeFiltersCount > 0 || keyword;

  const clearFilters = () => {
    setGrade('');
    setSubject('');
    setPublisher('');
    setContentType('');
    setIsNewTextbook('');
    setDifficulty('');
    setKeyword('');
  };

  const filterOptions = useMemo(() => {
    if (!filtersData) return null;
    return {
      grades: filtersData.grades.map((g) => ({ value: g, label: g })),
      subjects: filtersData.subjects.map((s) => ({ value: s, label: s })),
      publishers: filtersData.publishers.map((p) => ({
        value: p.name,
        label: p.shortName || p.name,
      })),
      contentTypes: filtersData.contentTypes.map((c) => ({ value: c.name, label: c.name })),
      difficulties: filtersData.difficulties.map((d) => ({
        value: String(d),
        label: `${d} 星`,
      })),
      isNewTextbook: filtersData.isNewTextbookOptions.map((o) => ({ value: o, label: o })),
    };
  }, [filtersData]);

  return (
    <div className="min-h-[calc(100vh-8rem)] space-y-6">
      {/* Header */}
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
              教辅资料库
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {booksData && (
            <div className="flex items-center gap-2 rounded-xl border border-border-default bg-surface px-3 py-1.5 text-xs text-text-tertiary">
              <Icon name="BookOpen" size="xs" className="text-secondary" />
              <span>
                共 <span className="font-medium text-text-secondary">{booksData.total}</span> 本
              </span>
            </div>
          )}
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
        className="space-y-4 rounded-2xl border border-border-default bg-surface-elevated p-4 sm:p-5"
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          {/* "Search" */}
          <div className="relative flex-1">
            <Icon
              name="Search"
              size="sm"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
            />
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="搜索书名、ISBN、关键词..."
              className="focus:border-primary/50 focus:ring-primary/20 h-10 w-full rounded-xl border border-border-default bg-surface px-9 text-sm text-text-secondary transition-all placeholder:text-text-muted focus:outline-none focus:ring-1"
            />
            {keyword && (
              <Button
                variant="ghost"
                size="xs"
                onClick={() => setKeyword('')}
                className="absolute right-3 top-1/2 -translate-y-1/2"
                aria-label="清空搜索"
              >
                <Icon name="X" size="sm" />
              </Button>
            )}
          </div>

          {hasActiveFilters && (
            <Button
              variant="secondary"
              size="md"
              onClick={clearFilters}
              className=""
            >
              <Icon name="RotateCcw" size="sm" />
              清除筛选
              {activeFiltersCount > 0 && (
                <span className="bg-primary/10 ml-1 rounded-full px-1.5 py-0.5 text-2xs text-primary">
                  {activeFiltersCount}
                </span>
              )}
            </Button>
          )}
        </div>

        {filterOptions && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            <FilterSelect
              label="年级"
              value={grade}
              options={filterOptions.grades}
              onChange={setGrade}
              placeholder="全部年级"
            />
            <FilterSelect
              label="学科"
              value={subject}
              options={filterOptions.subjects}
              onChange={setSubject}
              placeholder="全部学科"
            />
            <FilterSelect
              label="出版社"
              value={publisher}
              options={filterOptions.publishers}
              onChange={setPublisher}
              placeholder="全部出版社"
            />
            <FilterSelect
              label="内容类型"
              value={contentType}
              options={filterOptions.contentTypes}
              onChange={setContentType}
              placeholder="全部类型"
            />
            <FilterSelect
              label="难度"
              value={difficulty}
              options={filterOptions.difficulties}
              onChange={setDifficulty}
              placeholder="全部难度"
            />
            <FilterSelect
              label="新教材适配"
              value={isNewTextbook}
              options={filterOptions.isNewTextbook}
              onChange={setIsNewTextbook}
              placeholder="全部"
            />
          </div>
        )}
      </motion.div>

      {/* Results */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="border-primary/30 size-10 animate-spin rounded-full border-2 border-t-primary" />
        </div>
      ) : error ? (
        <EmptyState
          icon="BookOpen"
          title="加载失败"
          description={error instanceof Error ? error.message : '无法加载教辅列表'}
        />
      ) : booksData?.books.length === 0 ? (
        <EmptyState
          icon="BookOpen"
          title="没有找到相关教辅"
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
          {booksData?.books.map((book, index) => (
            <motion.div
              key={book.id}
              initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: Math.min(index * 0.03, 0.5) }}
            >
              <BookCard book={book} onClick={() => setSelectedBookId(book.id)} />
            </motion.div>
          ))}
        </motion.div>
      )}

      <BookDetailModal
        bookId={selectedBookId}
        isOpen={!!selectedBookId}
        onClose={() => setSelectedBookId(null)}
      />
    </div>
  );
}
