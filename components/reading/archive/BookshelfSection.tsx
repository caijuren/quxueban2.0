'use client';

import { useMemo, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { motion, useReducedMotion } from 'framer-motion';
import { Icon, type IconName } from '@/components/ui/icon';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import Textarea from '@/components/ui/textarea';
import Select from '@/components/ui/select';
import Modal from '@/components/ui/Modal';
import SearchInput from '@/components/ui/search-input';
import EmptyState from '@/components/ui/EmptyState';
import { apiGet, apiPost, apiPatch, apiDelete } from '@/lib/apiClient';
import { toast } from '@/lib/toast';
import { cn } from '@/lib/utils';
import { READING_ABILITIES } from '@/lib/subjects/readingLiteracy';

interface ReadingBook {
  id: string;
  bookId: string | null;
  title: string;
  author: string | null;
  isbn: string | null;
  coverImageUrl: string | null;
  publisher: string | null;
  description: string | null;
  totalPages: number | null;
  wordCount: number | null;
  textType: string | null;
  readingDifficulty: string | null;
  readingLadderStart: number | null;
  readingLadderEnd: number | null;
  literacyTags: string[] | null;
  status: string;
  source: string;
  rating: number | null;
  notes: string | null;
  readCount: number;
  totalMinutes: number;
  totalPagesRead: number;
  lastReadAt: string | null;
  _count: { records: number };
}

const STATUS_LABELS: Record<string, string> = {
  unread: '未读',
  reading: '在读',
  read: '已读',
};

const STATUS_COLORS: Record<string, string> = {
  unread: 'bg-surface-elevated text-text-muted border-border-subtle',
  reading: 'bg-secondary/10 text-secondary border-secondary/20',
  read: 'bg-success/10 text-success border-success/20',
};

const TEXT_TYPE_LABELS: Record<string, string> = {
  picture_book: '绘本',
  story: '故事',
  poetry: '诗歌',
  nonfiction: '科普',
  traditional_culture: '传统文化',
  other: '其他',
};

const DIFFICULTY_LABELS: Record<string, string> = {
  easy: '简单',
  medium: '适中',
  challenge: '挑战',
};

const TEXT_TYPE_OPTIONS = Object.entries(TEXT_TYPE_LABELS).map(([value, label]) => ({
  value,
  label,
}));
const DIFFICULTY_OPTIONS = Object.entries(DIFFICULTY_LABELS).map(([value, label]) => ({
  value,
  label,
}));
const LITERACY_OPTIONS = READING_ABILITIES.map((a) => ({ value: a.id, label: a.name }));
const SORT_OPTIONS = [
  { value: 'recent', label: '最近更新' },
  { value: 'progress', label: '阅读进度' },
  { value: 'minutes', label: '阅读时长' },
  { value: 'rating', label: '评分最高' },
  { value: 'title', label: '书名排序' },
];

const STATUS_TABS: Array<{ value: string; label: string }> = [
  { value: 'all', label: '全部' },
  { value: 'reading', label: '在读' },
  { value: 'read', label: '已读' },
];

function useBooks(
  childId: string,
  filters: { status: string; keyword: string; textType: string; readingDifficulty: string; literacyTag: string; sort: string }
) {
  return useQuery<{ books: ReadingBook[] }>({
    queryKey: ['reading-books', childId, filters],
    queryFn: () => {
      const qs = new URLSearchParams({ childId });
      if (filters.status && filters.status !== 'all') qs.set('status', filters.status);
      if (filters.keyword) qs.set('keyword', filters.keyword);
      if (filters.textType && filters.textType !== 'all') qs.set('textType', filters.textType);
      if (filters.readingDifficulty && filters.readingDifficulty !== 'all') {
        qs.set('readingDifficulty', filters.readingDifficulty);
      }
      if (filters.literacyTag && filters.literacyTag !== 'all') {
        qs.set('literacyTag', filters.literacyTag);
      }
      if (filters.sort && filters.sort !== 'recent') qs.set('sort', filters.sort);
      return apiGet(`/api/reading/books?${qs.toString()}`);
    },
  });
}

export default function BookshelfSection({ childId }: { childId: string }) {
  const shouldReduceMotion = useReducedMotion();
  const queryClient = useQueryClient();
  const [status, setStatus] = useState('all');
  const [keyword, setKeyword] = useState('');
  const [textType, setTextType] = useState('all');
  const [readingDifficulty, setReadingDifficulty] = useState('all');
  const [literacyTag, setLiteracyTag] = useState('all');
  const [sort, setSort] = useState('recent');
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState<ReadingBook | null>(null);

  const filters = useMemo(
    () => ({ status, keyword, textType, readingDifficulty, literacyTag, sort }),
    [status, keyword, textType, readingDifficulty, literacyTag, sort]
  );

  const { data, isLoading, error } = useBooks(childId, filters);

  const stats = useMemo(() => {
    const all = data?.books ?? [];
    return {
      total: all.length,
      read: all.filter((b) => b.status === 'read').length,
      minutes: all.reduce((s, b) => s + b.totalMinutes, 0),
    };
  }, [data]);

  const activeFilters = useMemo(() => {
    const chips: Array<{ key: string; label: string; clear: () => void }> = [];
    if (keyword) chips.push({ key: 'keyword', label: `搜索：${keyword}`, clear: () => setKeyword('') });
    if (textType !== 'all') chips.push({ key: 'textType', label: TEXT_TYPE_LABELS[textType] ?? textType, clear: () => setTextType('all') });
    if (readingDifficulty !== 'all') chips.push({ key: 'difficulty', label: DIFFICULTY_LABELS[readingDifficulty] ?? readingDifficulty, clear: () => setReadingDifficulty('all') });
    if (literacyTag !== 'all') chips.push({ key: 'literacyTag', label: READING_ABILITIES.find((a) => a.id === literacyTag)?.name ?? literacyTag, clear: () => setLiteracyTag('all') });
    return chips;
  }, [keyword, textType, readingDifficulty, literacyTag]);

  const clearAll = () => {
    setKeyword('');
    setTextType('all');
    setReadingDifficulty('all');
    setLiteracyTag('all');
  };

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['reading-books'] });
    queryClient.invalidateQueries({ queryKey: ['reading-overview'] });
  };

  const toggleStatus = async (book: ReadingBook) => {
    const next = book.status === 'read' ? 'reading' : 'read';
    try {
      await apiPatch(`/api/reading/books/${book.id}`, { status: next });
      toast.success(next === 'read' ? '已标记为已读' : '已改为在读');
      invalidate();
    } catch (e) {
      toast.error('操作失败', e instanceof Error ? e.message : undefined);
    }
  };

  const removeBook = async (book: ReadingBook) => {
    if (!window.confirm(`确定删除《${book.title}》吗？其阅读记录会一并删除。`)) return;
    try {
      await apiDelete(`/api/reading/books/${book.id}`);
      toast.success('已删除');
      invalidate();
    } catch (e) {
      toast.error('删除失败', e instanceof Error ? e.message : undefined);
    }
  };

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: '藏书', value: stats.total, icon: 'Library' as const },
          { label: '已读', value: stats.read, icon: 'CircleCheck' as const },
          { label: '累计时长', value: `${stats.minutes} 分钟`, icon: 'Clock' as const },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-xl border border-border-subtle bg-surface-elevated p-4"
          >
            <div className="mb-1 flex items-center gap-1.5 text-2xs text-text-muted">
              <Icon name={s.icon} size="xs" className="text-primary" />
              {s.label}
            </div>
            <p className="font-display text-lg font-bold text-text-primary">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="space-y-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
            <SearchInput
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onClear={() => setKeyword('')}
              placeholder="搜索书名、作者、ISBN..."
              className="flex-1"
            />
            <div className="flex items-center gap-1 rounded-lg border border-border-default bg-surface p-1">
              {STATUS_TABS.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setStatus(t.value)}
                  className={cn(
                    'rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
                    status === t.value
                      ? 'bg-primary/10 text-primary'
                      : 'text-text-muted hover:text-text-secondary'
                  )}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
          <Button size="md" leftIcon="Plus" onClick={() => setShowAdd(true)}>
            添加书籍
          </Button>
        </div>

        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <Select
              value={textType}
              onChange={(e) => setTextType(e.target.value)}
              size="sm"
              className="w-auto min-w-[110px]"
              options={[{ value: 'all', label: '全部类型' }, ...TEXT_TYPE_OPTIONS]}
            />
            <Select
              value={readingDifficulty}
              onChange={(e) => setReadingDifficulty(e.target.value)}
              size="sm"
              className="w-auto min-w-[110px]"
              options={[{ value: 'all', label: '全部难度' }, ...DIFFICULTY_OPTIONS]}
            />
            <Select
              value={literacyTag}
              onChange={(e) => setLiteracyTag(e.target.value)}
              size="sm"
              className="w-auto min-w-[120px]"
              options={[{ value: 'all', label: '全部素养' }, ...LITERACY_OPTIONS]}
            />
            <Select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              size="sm"
              className="w-auto min-w-[110px]"
              options={SORT_OPTIONS}
            />
          </div>
          {activeFilters.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5">
              {activeFilters.map((chip) => (
                <button
                  key={chip.key}
                  type="button"
                  onClick={chip.clear}
                  className="flex items-center gap-1 rounded-full border border-primary/20 bg-primary/10 px-2.5 py-0.5 text-2xs text-primary transition-colors hover:bg-primary/20"
                >
                  {chip.label}
                  <Icon name="X" size="xs" />
                </button>
              ))}
              <button
                type="button"
                onClick={clearAll}
                className="text-2xs text-text-muted underline-offset-2 hover:text-text-secondary hover:underline"
              >
                清除全部
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Book grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="border-primary/30 size-10 animate-spin rounded-full border-2 border-t-primary" />
        </div>
      ) : error ? (
        <EmptyState
          icon="Library"
          title="加载失败"
          description={error instanceof Error ? error.message : '无法加载书房'}
        />
      ) : (data?.books ?? []).length === 0 ? (
        <EmptyState
          icon="Library"
          title={activeFilters.length > 0 ? '没有符合条件的书籍' : '书房还是空的'}
          description={
            activeFilters.length > 0
              ? '尝试调整筛选条件'
              : '添加书籍，或在「批量导入」中导入小花生等平台的藏书数据'
          }
          action={
            activeFilters.length > 0
              ? { label: '清除筛选', onClick: clearAll }
              : { label: '添加第一本书', onClick: () => setShowAdd(true) }
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {(data?.books ?? []).map((book, index) => (
            <BookCard
              key={book.id}
              book={book}
              index={index}
              shouldReduceMotion={shouldReduceMotion}
              onEdit={() => setEditing(book)}
              onDelete={() => removeBook(book)}
              onToggleStatus={() => toggleStatus(book)}
            />
          ))}
        </div>
      )}

      {/* Add modal */}
      <BookFormModal
        isOpen={showAdd}
        onClose={() => setShowAdd(false)}
        childId={childId}
        onSaved={() => {
          setShowAdd(false);
          invalidate();
        }}
      />

      {/* Edit modal */}
      {editing && (
        <BookFormModal
          isOpen
          onClose={() => setEditing(null)}
          childId={childId}
          book={editing}
          onSaved={() => {
            setEditing(null);
            invalidate();
          }}
        />
      )}
    </div>
  );
}

function BookCard({
  book,
  index,
  shouldReduceMotion,
  onEdit,
  onDelete,
  onToggleStatus,
}: {
  book: ReadingBook;
  index: number;
  shouldReduceMotion: boolean | null;
  onEdit: () => void;
  onDelete: () => void;
  onToggleStatus: () => void;
}) {
  const progress =
    book.totalPages && book.totalPages > 0
      ? Math.min(100, Math.round((book.totalPagesRead / book.totalPages) * 100))
      : book.status === 'read'
        ? 100
        : 0;

  const tags: Array<{ label: string; className: string }> = [];
  if (book.textType && TEXT_TYPE_LABELS[book.textType]) {
    tags.push({ label: TEXT_TYPE_LABELS[book.textType], className: 'bg-accent/10 text-accent' });
  }
  if (book.readingDifficulty && DIFFICULTY_LABELS[book.readingDifficulty]) {
    tags.push({
      label: DIFFICULTY_LABELS[book.readingDifficulty],
      className: 'bg-warning/10 text-warning',
    });
  }
  const literacyNames = (book.literacyTags ?? [])
    .map((id) => READING_ABILITIES.find((a) => a.id === id)?.name)
    .filter((n): n is string => Boolean(n));
  literacyNames.slice(0, 2).forEach((name) => {
    tags.push({ label: name, className: 'bg-success/10 text-success' });
  });

  const missing: string[] = [];
  if (!book.totalPages && book.status !== 'unread') missing.push('总页数');
  if ((book.literacyTags ?? []).length === 0) missing.push('素养标签');

  return (
    <motion.div
      initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.03, 0.5) }}
      className="group rounded-xl border border-border-default bg-surface p-3 transition-colors hover:border-border-strong"
    >
      <div className="flex gap-3">
        {/* Cover */}
        <div className="relative h-32 w-24 shrink-0 overflow-hidden rounded-lg border border-border-subtle bg-surface-elevated">
          {book.coverImageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={book.coverImageUrl}
              alt={book.title}
              className="size-full object-cover"
            />
          ) : (
            <div className="flex size-full flex-col items-center justify-center gap-1.5 text-text-tertiary">
              <Icon name="BookOpen" size="lg" />
              <span className="px-1 text-center text-2xs leading-tight">{book.title}</span>
            </div>
          )}
          <span
            className={cn(
              'absolute left-1.5 top-1.5 rounded-full border px-1.5 py-0.5 text-2xs backdrop-blur-sm',
              STATUS_COLORS[book.status] ?? STATUS_COLORS.unread
            )}
          >
            {STATUS_LABELS[book.status] ?? book.status}
          </span>
        </div>

        {/* Content */}
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-start justify-between gap-1">
            <h3 className="line-clamp-2 font-display text-sm font-bold leading-snug text-text-primary">
              {book.title}
            </h3>
            <div className="flex shrink-0 items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
              <button
                type="button"
                onClick={onEdit}
                className="flex size-6 items-center justify-center rounded-md text-text-muted transition-colors hover:bg-surface-elevated hover:text-text-secondary"
                aria-label="编辑"
              >
                <Icon name="Pencil" size="xs" />
              </button>
              <button
                type="button"
                onClick={onDelete}
                className="flex size-6 items-center justify-center rounded-md text-text-muted transition-colors hover:bg-surface-elevated hover:text-danger"
                aria-label="删除"
              >
                <Icon name="Trash2" size="xs" />
              </button>
            </div>
          </div>
          <p className="mt-0.5 truncate text-xs text-text-tertiary">
            {book.author || (book.isbn ? `ISBN ${book.isbn}` : '未知作者')}
          </p>

          {tags.length > 0 && (
            <div className="mt-1.5 flex flex-wrap gap-1">
              {tags.map((t) => (
                <span
                  key={t.label}
                  className={cn('rounded-full px-1.5 py-0.5 text-2xs font-medium', t.className)}
                >
                  {t.label}
                </span>
              ))}
              {book.literacyTags && book.literacyTags.length > 2 && (
                <span className="rounded-full bg-surface-highlight px-1.5 py-0.5 text-2xs text-text-muted">
                  +{book.literacyTags.length - 2}
                </span>
              )}
            </div>
          )}

          <div className="mt-auto pt-2">
            {book.status !== 'unread' && (
              <div className="mb-1.5 flex items-center gap-2">
                <div className="h-1 flex-1 overflow-hidden rounded-full bg-surface-highlight">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span className="text-2xs tabular-nums text-text-muted">
                  {book.totalPagesRead}/{book.totalPages ?? '?'} 页
                </span>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 text-2xs text-text-muted">
                <span className="flex items-center gap-1">
                  <Icon name="BookOpen" size="xs" />
                  {book.readCount} 次
                </span>
                <span className="flex items-center gap-1">
                  <Icon name="Clock" size="xs" />
                  {book.totalMinutes} 分
                </span>
                {book.rating ? (
                  <span className="text-xs text-warning">{'★'.repeat(book.rating)}</span>
                ) : null}
              </div>
            </div>

            {missing.length > 0 && (
              <p className="mt-1.5 text-2xs text-text-muted">
                待补：{missing.join('、')}
              </p>
            )}

            <Button
              variant="ghost"
              size="sm"
              className="mt-2 w-full"
              onClick={onToggleStatus}
            >
              <Icon
                name={book.status === 'read' ? 'RotateCcw' : 'Check'}
                size="sm"
                className={book.status === 'read' ? 'text-text-muted' : 'text-success'}
              />
              {book.status === 'read' ? '改为在读' : '标记已读'}
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function BookFormModal({
  isOpen,
  onClose,
  childId,
  book,
  onSaved,
}: {
  isOpen: boolean;
  onClose: () => void;
  childId: string;
  book?: ReadingBook | null;
  onSaved: () => void;
}) {
  const [title, setTitle] = useState(book?.title ?? '');
  const [author, setAuthor] = useState(book?.author ?? '');
  const [isbn, setIsbn] = useState(book?.isbn ?? '');
  const [status, setStatus] = useState(book?.status ?? 'unread');
  const [textType, setTextType] = useState(book?.textType ?? '');
  const [readingDifficulty, setReadingDifficulty] = useState(book?.readingDifficulty ?? '');
  const [totalPages, setTotalPages] = useState(book?.totalPages ? String(book.totalPages) : '');
  const [literacyTags, setLiteracyTags] = useState<string[]>(book?.literacyTags ?? []);
  const [rating, setRating] = useState(book?.rating ? String(book.rating) : '');
  const [notes, setNotes] = useState(book?.notes ?? '');
  const [saving, setSaving] = useState(false);

  const toggleTag = (id: string) => {
    setLiteracyTags((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const submit = async () => {
    if (!title.trim()) {
      toast.warning('请输入书名');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        title: title.trim(),
        author: author.trim() || null,
        isbn: isbn.trim() || null,
        status,
        textType: textType || null,
        readingDifficulty: readingDifficulty || null,
        totalPages: totalPages ? Number(totalPages) : null,
        literacyTags: literacyTags.length > 0 ? literacyTags : null,
        rating: rating ? Number(rating) : null,
        notes: notes.trim() || null,
      };
      if (book) {
        await apiPatch(`/api/reading/books/${book.id}`, payload);
        toast.success('已保存');
      } else {
        await apiPost('/api/reading/books', { childId, ...payload });
        toast.success('已添加');
      }
      onSaved();
    } catch (e) {
      toast.error('保存失败', e instanceof Error ? e.message : undefined);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={book ? '编辑书籍' : '添加书籍'}
      subtitle={book ? `《${book.title}》` : '录入书房藏书'}
      icon="Library"
      colorScheme="accent"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            取消
          </Button>
          <Button onClick={submit} isLoading={saving} leftIcon={book ? 'Save' : 'Plus'}>
            {book ? '保存' : '添加'}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-text-secondary">书名 *</label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="输入书名" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-text-secondary">作者</label>
            <Input value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="作者" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-text-secondary">ISBN</label>
            <Input value={isbn} onChange={(e) => setIsbn(e.target.value)} placeholder="ISBN" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-text-secondary">状态</label>
            <Select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              options={[
                { value: 'unread', label: '未读' },
                { value: 'reading', label: '在读' },
                { value: 'read', label: '已读' },
              ]}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-text-secondary">总页数</label>
            <Input
              type="number"
              min={0}
              value={totalPages}
              onChange={(e) => setTotalPages(e.target.value)}
              placeholder="如 264"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-text-secondary">文本类型</label>
            <Select
              value={textType}
              onChange={(e) => setTextType(e.target.value)}
              placeholder="选择类型"
              options={TEXT_TYPE_OPTIONS}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-text-secondary">阅读难度</label>
            <Select
              value={readingDifficulty}
              onChange={(e) => setReadingDifficulty(e.target.value)}
              placeholder="选择难度"
              options={DIFFICULTY_OPTIONS}
            />
          </div>
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-text-secondary">素养标签</label>
          <div className="flex flex-wrap gap-1.5">
            {READING_ABILITIES.map((a) => (
              <button
                key={a.id}
                type="button"
                onClick={() => toggleTag(a.id)}
                className={cn(
                  'rounded-full border px-2.5 py-1 text-2xs font-medium transition-colors',
                  literacyTags.includes(a.id)
                    ? 'border-primary/30 bg-primary/10 text-primary'
                    : 'border-border-default bg-surface-hover text-text-muted hover:text-text-secondary'
                )}
              >
                {a.name}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-text-secondary">评分</label>
            <Select
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              placeholder="不评分"
              options={[1, 2, 3, 4, 5].map((n) => ({ value: String(n), label: `${'★'.repeat(n)}` }))}
            />
          </div>
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-text-secondary">备注</label>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="阅读心得、适合年龄等"
            rows={3}
          />
        </div>
      </div>
    </Modal>
  );
}
