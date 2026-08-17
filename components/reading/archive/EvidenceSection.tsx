'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, useReducedMotion } from 'framer-motion';
import { Icon, type IconName } from '@/components/ui/icon';
import Card from '@/components/ui/card';
import Button from '@/components/ui/button';
import Textarea from '@/components/ui/textarea';
import Select from '@/components/ui/select';
import Badge from '@/components/ui/badge';
import EmptyState from '@/components/ui/EmptyState';
import Modal from '@/components/ui/Modal';
import ConfirmDialog from '@/components/ui/confirm-dialog';
import { apiGet, apiPost, apiPatch, apiDelete } from '@/lib/apiClient';
import { toast } from '@/lib/toast';
import { cn } from '@/lib/utils';
import {
  EVIDENCE_TYPE_META,
  type EvidenceType,
  type EvidenceStatus,
  type EvidenceParseResult,
  type ReadingEvidenceItem,
} from '@/lib/readingEvidence';
import { getReadingAbility, type ReadingAbilityId } from '@/lib/subjects/readingLiteracy';

type Filter = 'all' | EvidenceStatus;

const FILTERS: Array<{ id: Filter; label: string }> = [
  { id: 'all', label: '全部' },
  { id: 'pending', label: '待确认' },
  { id: 'confirmed', label: '已归档' },
  { id: 'rejected', label: '已拒绝' },
];

const TYPE_META: Record<EvidenceType, { icon: IconName; chip: string }> = {
  character_assessment: { icon: 'Quote', chip: 'bg-secondary/10 text-secondary' },
  independent_reading: { icon: 'BookMarked', chip: 'bg-primary/10 text-primary' },
  vocabulary_understanding: { icon: 'BookOpen', chip: 'bg-info/10 text-info' },
  discourse_structure: { icon: 'Layers', chip: 'bg-accent/10 text-accent' },
  reading_expression: { icon: 'MessageSquareText', chip: 'bg-success/10 text-success' },
};

const DIM_CHIP: Record<ReadingAbilityId, string> = {
  recognition: 'bg-primary/10 text-primary',
  comprehension: 'bg-primary/10 text-primary',
  appreciation: 'bg-secondary/10 text-secondary',
  evaluation: 'bg-secondary/10 text-secondary',
  application: 'bg-accent/10 text-accent',
  innovation: 'bg-accent/10 text-accent',
};

const STATUS_META: Record<EvidenceStatus, { label: string; chip: string }> = {
  pending: { label: '待确认', chip: 'bg-warning/10 text-warning' },
  confirmed: { label: '已归档', chip: 'bg-success/10 text-success' },
  rejected: { label: '已拒绝', chip: 'bg-surface-highlight text-text-muted' },
};

function formatDate(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const sameDay = d.toDateString() === now.toDateString();
  if (sameDay) {
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  }
  return `${d.getMonth() + 1}月${d.getDate()}日`;
}

export default function EvidenceSection({ childId }: { childId: string }) {
  const shouldReduceMotion = useReducedMotion();
  const queryClient = useQueryClient();

  const [filter, setFilter] = useState<Filter>('all');
  const [inputText, setInputText] = useState('');
  const [parseResult, setParseResult] = useState<EvidenceParseResult | null>(null);
  const [parsing, setParsing] = useState(false);
  const [manualOpen, setManualOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ReadingEvidenceItem | null>(null);

  const { data, isLoading } = useQuery<{ evidences: ReadingEvidenceItem[] }>({
    queryKey: ['reading-evidences', childId, filter],
    queryFn: () => apiGet(`/api/reading/evidences?childId=${childId}&status=${filter}`),
  });

  const evidences = data?.evidences ?? [];

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ['reading-evidences', childId] });

  const parseMutation = useMutation({
    mutationFn: async () => {
      setParsing(true);
      try {
        const res = await apiPost<{ result: EvidenceParseResult }>('/api/reading/evidences/parse', {
          childId,
          text: inputText,
        });
        setParseResult(res.result);
      } finally {
        setParsing(false);
      }
    },
    onError: (e) => {
      toast.error('AI 解析失败', e instanceof Error ? e.message : undefined);
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (payload: {
      originalText: string;
      type: EvidenceType;
      indicatorIds: ReadingAbilityId[];
      summary?: string;
      confidence?: number;
      status?: EvidenceStatus;
    }) => {
      const res = await apiPost<{ evidence: ReadingEvidenceItem }>('/api/reading/evidences', {
        childId,
        originalText: payload.originalText,
        type: payload.type,
        indicatorIds: payload.indicatorIds,
        summary: payload.summary,
        confidence: payload.confidence,
        status: payload.status,
      });
      return res.evidence;
    },
    onSuccess: (evidence) => {
      invalidate();
      if (evidence.status === 'confirmed') {
        toast.success('已归档为能力证据');
      } else {
        toast.success('已保存，待确认');
      }
    },
    onError: (e) => {
      toast.error('保存失败', e instanceof Error ? e.message : undefined);
    },
  });

  const statusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: EvidenceStatus }) => {
      const res = await apiPatch<{ evidence: ReadingEvidenceItem }>(
        `/api/reading/evidences/${id}`,
        { status }
      );
      return res.evidence;
    },
    onSuccess: () => {
      invalidate();
      toast.success('状态已更新');
    },
    onError: (e) => {
      toast.error('操作失败', e instanceof Error ? e.message : undefined);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiDelete(`/api/reading/evidences/${id}`);
    },
    onSuccess: () => {
      invalidate();
      toast.success('已删除');
      setDeleteTarget(null);
    },
    onError: (e) => {
      toast.error('删除失败', e instanceof Error ? e.message : undefined);
    },
  });

  const handleConfirmParse = () => {
    if (!parseResult) return;
    saveMutation.mutate({
      originalText: inputText,
      type: parseResult.type,
      indicatorIds: parseResult.indicatorIds,
      summary: parseResult.summary,
      confidence: parseResult.confidence,
      status: 'confirmed',
    });
    setParseResult(null);
    setInputText('');
  };

  const handleHoldParse = () => {
    if (!parseResult) return;
    saveMutation.mutate({
      originalText: inputText,
      type: parseResult.type,
      indicatorIds: parseResult.indicatorIds,
      summary: parseResult.summary,
      confidence: parseResult.confidence,
      status: 'pending',
    });
    setParseResult(null);
    setInputText('');
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        {/* 左栏：AI 录入 */}
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="lg:col-span-3"
        >
          <Card padding="lg" className="h-full">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon name="Sparkles" size="sm" className="text-secondary" />
                <h3 className="font-display text-base font-bold text-text-primary">记录能力证据</h3>
              </div>
              <Button variant="ghost" size="sm" leftIcon={<Icon name="PenLine" size="sm" />} onClick={() => setManualOpen(true)}>
                手动记录
              </Button>
            </div>

            <Textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="描述孩子最近一次阅读中的表现，例如：读完《夏洛的网》后，孩子主动说夏洛很聪明，因为它用蜘蛛网救了小猪威尔伯，还分析了夏洛为什么要这么做……"
              maxLength={500}
              showCount
              resize="vertical"
              className="min-h-[120px]"
            />

            <div className="mt-3 flex items-center justify-between gap-3">
              <p className="text-2xs text-text-muted">
                输入一段观察记录，AI 会自动识别证据类型与对应阅读能力维度
              </p>
              <Button
                size="sm"
                variant="secondary"
                isLoading={parsing}
                disabled={inputText.trim().length < 4 || !!parseResult}
                leftIcon={<Icon name="WandSparkles" size="sm" />}
                onClick={() => parseMutation.mutate()}
              >
                AI 解析
              </Button>
            </div>

            {parseResult && (
              <motion.div
                initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4 rounded-xl border border-secondary/25 bg-secondary/5 p-4"
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-medium text-text-secondary">AI 识别结果</span>
                  <span className="text-2xs text-text-muted">
                    置信度 {parseResult.confidence}%
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary" size="sm">
                    {EVIDENCE_TYPE_META[parseResult.type].label}
                  </Badge>
                  {parseResult.indicatorIds.map((id) => {
                    const ability = getReadingAbility(id);
                    return (
                      <Badge key={id} variant="default" size="sm" className={DIM_CHIP[id]}>
                        {ability?.name ?? id}
                      </Badge>
                    );
                  })}
                </div>

                {parseResult.summary && (
                  <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                    {parseResult.summary}
                  </p>
                )}

                <div className="mt-4 flex items-center justify-end gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setParseResult(null);
                      setInputText('');
                    }}
                  >
                    放弃
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    isLoading={saveMutation.isPending}
                    onClick={handleHoldParse}
                  >
                    待定
                  </Button>
                  <Button
                    size="sm"
                    isLoading={saveMutation.isPending}
                    leftIcon={<Icon name="CircleCheck" size="sm" />}
                    onClick={handleConfirmParse}
                  >
                    确认归档
                  </Button>
                </div>
              </motion.div>
            )}
          </Card>
        </motion.div>

        {/* 右栏：证据列表 */}
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.05 }}
          className="lg:col-span-2"
        >
          <Card padding="lg" className="h-full">
            <div className="mb-4 flex items-center gap-2">
              <Icon name="ListChecks" size="sm" className="text-primary" />
              <h3 className="font-display text-base font-bold text-text-primary">证据列表</h3>
            </div>

            <div className="mb-4 flex items-center gap-1 rounded-lg bg-surface-highlight p-1">
              {FILTERS.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFilter(f.id)}
                  className={cn(
                    'flex-1 rounded-md px-2 py-1.5 text-2xs font-medium transition-colors',
                    filter === f.id
                      ? 'bg-surface-elevated text-text-primary shadow-sm'
                      : 'text-text-muted hover:text-text-secondary'
                  )}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="border-primary/30 size-8 animate-spin rounded-full border-2 border-t-primary" />
              </div>
            ) : evidences.length === 0 ? (
              <div className="py-10 text-center">
                <Icon name="FileSearch" size="lg" className="mx-auto mb-2 text-text-tertiary" />
                <p className="text-sm text-text-muted">
                  {filter === 'all'
                    ? '还没有能力证据，记录第一条吧'
                    : `没有${FILTERS.find((f) => f.id === filter)?.label}的证据`}
                </p>
              </div>
            ) : (
              <div className="max-h-[520px] space-y-2.5 overflow-y-auto pr-1">
                {evidences.map((ev) => {
                  const typeMeta = TYPE_META[ev.type] ?? TYPE_META.character_assessment;
                  const statusMeta = STATUS_META[ev.status];
                  const summary =
                    (ev.data as { summary?: string } | null)?.summary ?? '';
                  const indicatorIds = (ev.indicatorIds ?? []) as ReadingAbilityId[];
                  return (
                    <div
                      key={ev.id}
                      className="rounded-xl border border-border-subtle bg-surface-hover/50 p-3"
                    >
                      <div className="flex items-start gap-2.5">
                        <div
                          className={cn(
                            'flex size-8 shrink-0 items-center justify-center rounded-lg',
                            typeMeta.chip
                          )}
                        >
                          <Icon name={typeMeta.icon} size="sm" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <span className="truncate text-xs font-medium text-text-secondary">
                              {EVIDENCE_TYPE_META[ev.type]?.label ?? ev.type}
                            </span>
                            <span
                              className={cn(
                                'shrink-0 rounded-full px-2 py-0.5 text-2xs',
                                statusMeta.chip
                              )}
                            >
                              {statusMeta.label}
                            </span>
                          </div>
                          <p className="mt-1 line-clamp-2 text-2xs leading-relaxed text-text-muted">
                            {summary || ev.originalText}
                          </p>
                          {indicatorIds.length > 0 && (
                            <div className="mt-1.5 flex flex-wrap gap-1">
                              {indicatorIds.map((id) => (
                                <span
                                  key={id}
                                  className={cn(
                                    'rounded px-1.5 py-0.5 text-2xs',
                                    DIM_CHIP[id]
                                  )}
                                >
                                  {getReadingAbility(id)?.name ?? id}
                                </span>
                              ))}
                            </div>
                          )}
                          <div className="mt-1.5 flex items-center justify-between">
                            <span className="text-2xs tabular-nums text-text-tertiary">
                              {formatDate(ev.occurredAt)}
                            </span>
                            <div className="flex items-center gap-1">
                              {ev.status === 'pending' && (
                                <>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      statusMutation.mutate({ id: ev.id, status: 'confirmed' })
                                    }
                                    className="flex size-6 items-center justify-center rounded-md text-success transition-colors hover:bg-success/10"
                                    title="确认归档"
                                  >
                                    <Icon name="CircleCheck" size="sm" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      statusMutation.mutate({ id: ev.id, status: 'rejected' })
                                    }
                                    className="flex size-6 items-center justify-center rounded-md text-text-muted transition-colors hover:bg-surface-highlight hover:text-text-secondary"
                                    title="拒绝"
                                  >
                                    <Icon name="CircleX" size="sm" />
                                  </button>
                                </>
                              )}
                              <button
                                type="button"
                                onClick={() => setDeleteTarget(ev)}
                                className="flex size-6 items-center justify-center rounded-md text-text-tertiary transition-colors hover:bg-error/10 hover:text-error"
                                title="删除"
                              >
                                <Icon name="Trash2" size="sm" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </motion.div>
      </div>

      {/* 手动记录弹窗 */}
      <ManualEvidenceModal
        childId={childId}
        isOpen={manualOpen}
        onClose={() => setManualOpen(false)}
        onSaved={() => {
          invalidate();
          setManualOpen(false);
        }}
      />

      {/* 删除确认 */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
        title="删除这条证据？"
        description="删除后不可恢复，已归档的证据将不再参与能力定位。"
        confirmText="删除"
        confirmVariant="danger"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}

function ManualEvidenceModal({
  childId,
  isOpen,
  onClose,
  onSaved,
}: {
  childId: string;
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [type, setType] = useState<EvidenceType>('character_assessment');
  const [text, setText] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (text.trim().length < 4) {
      toast.warning('请至少输入 4 个字的观察记录');
      return;
    }
    setSaving(true);
    try {
      await apiPost('/api/reading/evidences', {
        childId,
        originalText: text.trim(),
        type,
        status: 'confirmed',
      });
      toast.success('已归档为能力证据');
      setText('');
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
      title="手动记录证据"
      subtitle="不经过 AI，直接选择类型并记录观察内容"
      icon="PenLine"
      size="md"
      colorScheme="violet"
      footer={
        <div className="flex items-center justify-end gap-3">
          <Button variant="ghost" size="sm" onClick={onClose} disabled={saving}>
            取消
          </Button>
          <Button size="sm" isLoading={saving} onClick={handleSave}>
            保存归档
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-text-secondary">证据类型</label>
          <Select
            value={type}
            onChange={(e) => setType(e.target.value as EvidenceType)}
            options={(Object.keys(EVIDENCE_TYPE_META) as EvidenceType[]).map((t) => ({
              value: t,
              label: `${EVIDENCE_TYPE_META[t].label}（${EVIDENCE_TYPE_META[t].description}）`,
            }))}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-text-secondary">观察记录</label>
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="描述孩子的阅读表现，例如：孩子能完整复述《西游记》三打白骨精的经过，并说出孙悟空和唐僧各自的做法有什么问题……"
            maxLength={500}
            showCount
            className="min-h-[120px]"
          />
        </div>
      </div>
    </Modal>
  );
}
