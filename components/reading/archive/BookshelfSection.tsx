'use client';

import { useMemo, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { motion, useReducedMotion } from 'framer-motion';
import { Icon } from '@/components/ui/icon';
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

interface ReadingBook {
  id: string;
  bookId: string | null;
  title: string;
  author: string | null;
  isbn: string | null;
  coverImageUrl: string | null;
  status: string;
  source: string;
  rating: number | null;
  notes: string | null;
  readCount: number;
  totalMinutes: number;
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

function useBooks(childId: string, status: string, keyword: string) {
  return useQuery<{ books: ReadingBook[] }>({
    queryKey: ['reading-books', childId, status, keyword],
    queryFn: () => {
      const qs = new URLSearchParams({ childId });
      if (status && status !== 'all') qs.set('status', status);
      if (keyword) qs.set('keyword', keyword);
      return apiGet(`/api/reading/books?${qs.toString()}`);
    },
  });
}

export default function BookshelfSection({ childId }: { childId: string }) {
  const shouldReduceMotion = useReducedMotion();
  const queryClient = useQueryClient();
  const [status, setStatus] = useState('all');
  const [keyword, setKeyword] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState<ReadingBook | null>(null);

  const { data, isLoading, error } = useBooks(childId, status, keyword);

  const stats = useMemo(() => {
    const all = data?.books ?? [];
    return {
      total: all.length,
      read: all.filter((b) => b.status === 'read').length,
      minutes: all.reduce((s, b) => s + b.totalMinutes, 0),
    };
  }, [data]);

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['reading-books'] });
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
          { label: '已读', value: stats.read, icon: 'CheckCircle' as const },
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
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
          <SearchInput
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onClear={() => setKeyword('')}
            placeholder="搜索书名、作者、ISBN..."
            className="flex-1"
          />
          <Select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            size="md"
            className="w-auto min-w-[110px]"
            options={[
              { value: 'all', label: '全部状态' },
              { value: 'unread', label: '未读' },
              { value: 'reading', label: '在读' },
              { value: 'read', label: '已读' },
            ]}
          />
        </div>
        <Button size="md" leftIcon="Plus" onClick={() => setShowAdd(true)}>
          添加书籍
        </Button>
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
          title="书房还是空的"
          description="添加书籍，或在「批量导入」中导入小花生等平台的藏书数据"
          action={{ label: '添加第一本书', onClick: () => setShowAdd(true) }}
        />
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {(data?.books ?? []).map((book, index) => (
            <motion.div
              key={book.id}
              initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: Math.min(index * 0.03, 0.5) }}
              className="group rounded-xl border border-border-default bg-surface p-4 transition-colors hover:border-border-strong"
            >
              <div className="mb-2 flex items-start justify-between gap-2">
                <span
                  className={cn(
                    'rounded-full border px-2 py-0.5 text-2xs',
                    STATUS_COLORS[book.status] ?? STATUS_COLORS.unread
                  )}
                >
                  {STATUS_LABELS[book.status] ?? book.status}
                </span>
                <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    type="button"
                    onClick={() => setEditing(book)}
                    className="flex size-7 items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-surface-elevated hover:text-text-secondary"
                    aria-label="编辑"
                  >
                    <Icon name="Pencil" size="xs" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeBook(book)}
                    className="flex size-7 items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-surface-elevated hover:text-danger"
                    aria-label="删除"
                  >
                    <Icon name="Trash2" size="xs" />
                  </button>
                </div>
              </div>

              <h3 className="mb-1 line-clamp-2 font-display text-base font-bold text-text-primary">
                {book.title}
              </h3>
              <p className="mb-3 text-sm text-text-tertiary">
                {book.author || (book.isbn ? `ISBN ${book.isbn}` : '未知作者')}
              </p>

              <div className="flex items-center justify-between border-t border-border-subtle pt-3">
                <div className="flex items-center gap-3 text-2xs text-text-muted">
                  <span className="flex items-center gap-1">
                    <Icon name="BookOpen" size="xs" />
                    {book.readCount} 次
                  </span>
                  <span className="flex items-center gap-1">
                    <Icon name="Clock" size="xs" />
                    {book.totalMinutes} 分钟
                  </span>
                </div>
                {book.rating ? (
                  <span className="text-xs text-warning">{'★'.repeat(book.rating)}</span>
                ) : null}
              </div>

              <Button
                variant="ghost"
                size="sm"
                className="mt-3 w-full"
                onClick={() => toggleStatus(book)}
              >
                <Icon
                  name={book.status === 'read' ? 'RotateCcw' : 'Check'}
                  size="sm"
                  className={book.status === 'read' ? 'text-text-muted' : 'text-success'}
                />
                {book.status === 'read' ? '改为在读' : '标记已读'}
              </Button>
            </motion.div>
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
  const [rating, setRating] = useState(book?.rating ? String(book.rating) : '');
  const [notes, setNotes] = useState(book?.notes ?? '');
  const [saving, setSaving] = useState(false);

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
