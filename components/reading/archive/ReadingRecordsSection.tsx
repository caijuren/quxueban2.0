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
import EmptyState from '@/components/ui/EmptyState';
import { apiGet, apiPost, apiPatch, apiDelete } from '@/lib/apiClient';
import { toast } from '@/lib/toast';
import { cn } from '@/lib/utils';

interface ReadingBook {
  id: string;
  title: string;
  author: string | null;
}

interface ReadingRecord {
  id: string;
  readingBookId: string;
  readDate: string;
  durationMinutes: number;
  pages: number | null;
  note: string | null;
  readingBook: ReadingBook;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
    d.getDate()
  ).padStart(2, '0')}`;
}

export default function ReadingRecordsSection({ childId }: { childId: string }) {
  const shouldReduceMotion = useReducedMotion();
  const queryClient = useQueryClient();
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState<ReadingRecord | null>(null);

  const { data, isLoading, error } = useQuery<{ records: ReadingRecord[] }>({
    queryKey: ['reading-records', childId],
    queryFn: () => apiGet(`/api/reading/records?childId=${childId}`),
  });

  const { data: booksData } = useQuery<{ books: ReadingBook[] }>({
    queryKey: ['reading-books', childId, 'all', ''],
    queryFn: () => apiGet(`/api/reading/books?childId=${childId}`),
  });

  const stats = useMemo(() => {
    const records = data?.records ?? [];
    return {
      count: records.length,
      minutes: records.reduce((s, r) => s + r.durationMinutes, 0),
      days: new Set(records.map((r) => formatDate(r.readDate))).size,
    };
  }, [data]);

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['reading-records'] });
    queryClient.invalidateQueries({ queryKey: ['reading-books'] });
  };

  const removeRecord = async (record: ReadingRecord) => {
    if (!window.confirm('确定删除这条阅读记录吗？')) return;
    try {
      await apiDelete(`/api/reading/records/${record.id}`);
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
          { label: '阅读次数', value: stats.count, icon: 'BookOpen' as const },
          { label: '累计时长', value: `${stats.minutes} 分钟`, icon: 'Clock' as const },
          { label: '阅读天数', value: `${stats.days} 天`, icon: 'Calendar' as const },
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

      <div className="flex items-center justify-between">
        <p className="text-sm text-text-muted">
          记录每次阅读的书目、时长与心得，数据会同步到成长报告的阅读素养评估
        </p>
        <Button
          size="md"
          leftIcon="Plus"
          onClick={() => setShowAdd(true)}
          disabled={(booksData?.books ?? []).length === 0}
        >
          添加记录
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="border-primary/30 size-10 animate-spin rounded-full border-2 border-t-primary" />
        </div>
      ) : error ? (
        <EmptyState
          icon="BookOpen"
          title="加载失败"
          description={error instanceof Error ? error.message : '无法加载阅读记录'}
        />
      ) : (data?.records ?? []).length === 0 ? (
        <EmptyState
          icon="BookOpen"
          title="还没有阅读记录"
          description="先在「书房」添加书籍，再记录阅读；或通过「批量导入」导入历史数据"
          action={
            (booksData?.books ?? []).length > 0
              ? { label: '添加第一条记录', onClick: () => setShowAdd(true) }
              : undefined
          }
        />
      ) : (
        <div className="space-y-2">
          {(data?.records ?? []).map((record, index) => (
            <motion.div
              key={record.id}
              initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: Math.min(index * 0.02, 0.4) }}
              className="group flex items-center gap-4 rounded-xl border border-border-subtle bg-surface p-4 transition-colors hover:border-border-strong"
            >
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Icon name="BookOpen" size="sm" className="text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-display text-sm font-bold text-text-primary">
                  {record.readingBook.title}
                </p>
                <p className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-2xs text-text-muted">
                  <span className="flex items-center gap-1">
                    <Icon name="Calendar" size="xs" />
                    {formatDate(record.readDate)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Icon name="Clock" size="xs" />
                    {record.durationMinutes} 分钟
                  </span>
                  {record.pages ? (
                    <span className="flex items-center gap-1">
                      <Icon name="FileText" size="xs" />
                      {record.pages} 页
                    </span>
                  ) : null}
                </p>
                {record.note ? (
                  <p className="mt-1 line-clamp-1 text-xs text-text-tertiary">{record.note}</p>
                ) : null}
              </div>
              <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                <button
                  type="button"
                  onClick={() => setEditing(record)}
                  className="flex size-7 items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-surface-elevated hover:text-text-secondary"
                  aria-label="编辑"
                >
                  <Icon name="Pencil" size="xs" />
                </button>
                <button
                  type="button"
                  onClick={() => removeRecord(record)}
                  className="flex size-7 items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-surface-elevated hover:text-danger"
                  aria-label="删除"
                >
                  <Icon name="Trash2" size="xs" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <RecordFormModal
        isOpen={showAdd}
        onClose={() => setShowAdd(false)}
        childId={childId}
        books={booksData?.books ?? []}
        onSaved={() => {
          setShowAdd(false);
          invalidate();
        }}
      />

      {editing && (
        <RecordFormModal
          isOpen
          onClose={() => setEditing(null)}
          childId={childId}
          books={booksData?.books ?? []}
          record={editing}
          onSaved={() => {
            setEditing(null);
            invalidate();
          }}
        />
      )}
    </div>
  );
}

function RecordFormModal({
  isOpen,
  onClose,
  childId,
  books,
  record,
  onSaved,
}: {
  isOpen: boolean;
  onClose: () => void;
  childId: string;
  books: ReadingBook[];
  record?: ReadingRecord | null;
  onSaved: () => void;
}) {
  const [bookId, setBookId] = useState(record?.readingBookId ?? books[0]?.id ?? '');
  const [date, setDate] = useState(record ? formatDate(record.readDate) : new Date().toISOString().split('T')[0]);
  const [duration, setDuration] = useState(record ? String(record.durationMinutes) : '30');
  const [pages, setPages] = useState(record?.pages ? String(record.pages) : '');
  const [note, setNote] = useState(record?.note ?? '');
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    if (!bookId) {
      toast.warning('请选择书籍');
      return;
    }
    if (!date) {
      toast.warning('请选择阅读日期');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        readingBookId: bookId,
        readDate: date,
        durationMinutes: Number(duration) || 0,
        pages: pages ? Number(pages) : null,
        note: note.trim() || null,
      };
      if (record) {
        await apiPatch(`/api/reading/records/${record.id}`, payload);
        toast.success('已保存');
      } else {
        await apiPost(`/api/reading/books/${bookId}/records`, payload);
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
      title={record ? '编辑阅读记录' : '添加阅读记录'}
      subtitle={record ? `《${record.readingBook.title}》` : '记录一次阅读'}
      icon="BookOpen"
      colorScheme="accent"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            取消
          </Button>
          <Button onClick={submit} isLoading={saving} leftIcon={record ? 'Save' : 'Plus'}>
            {record ? '保存' : '添加'}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-text-secondary">书籍 *</label>
          <Select
            value={bookId}
            onChange={(e) => setBookId(e.target.value)}
            disabled={!!record}
            options={books.map((b) => ({ value: b.id, label: b.title }))}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-text-secondary">阅读日期 *</label>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-text-secondary">时长（分钟）</label>
            <Input
              type="number"
              min={0}
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="30"
            />
          </div>
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-text-secondary">阅读页数</label>
          <Input
            type="number"
            min={0}
            value={pages}
            onChange={(e) => setPages(e.target.value)}
            placeholder="可选"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-text-secondary">心得 / 备注</label>
          <Textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="读了什么、感受如何..."
            rows={3}
          />
        </div>
      </div>
    </Modal>
  );
}
