'use client';

import { useMemo, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Icon } from '@/components/ui/icon';
import Button from '@/components/ui/button';
import GlassCard from '@/components/ui/glass-card';
import { apiPost } from '@/lib/apiClient';
import { toast } from '@/lib/toast';
import { cn } from '@/lib/utils';
import { parseReadingCsv, type ParsedReadingRow } from '@/lib/readingImport';

interface ImportResult {
  imported: number;
  matched: number;
  skipped: number;
  errors: number;
  messages: string[];
}

export default function ImportSection({ childId }: { childId: string }) {
  const shouldReduceMotion = useReducedMotion();
  const fileRef = useRef<HTMLInputElement>(null);
  const [rows, setRows] = useState<ParsedReadingRow[]>([]);
  const [fileName, setFileName] = useState('');
  const [parsing, setParsing] = useState(false);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);

  const validRows = useMemo(() => rows.filter((r) => r.title), [rows]);
  const totalMinutes = useMemo(
    () => rows.reduce((s, r) => s + (r.durationMinutes || 0), 0),
    [rows]
  );

  const handleFile = (file: File) => {
    setParsing(true);
    setResult(null);
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const { rows: parsed, errors } = parseReadingCsv(String(reader.result ?? ''));
        setRows(parsed);
        setParsing(false);
        if (parsed.length === 0) {
          toast.warning('未解析到有效数据', '请确认 CSV 包含"书名"列');
        } else {
          toast.success(`解析成功，共 ${parsed.length} 条`);
        }
        if (errors.length > 0) {
          toast.warning('部分行解析异常', errors.slice(0, 3).join('；'));
        }
      } catch {
        setParsing(false);
        toast.error('解析失败', '请确认文件为 UTF-8 编码的 CSV');
      }
    };
    reader.onerror = () => {
      setParsing(false);
      toast.error('读取文件失败');
    };
    reader.readAsText(file, 'utf-8');
  };

  const doImport = async () => {
    if (validRows.length === 0) return;
    setImporting(true);
    try {
      const res = await apiPost<ImportResult>('/api/reading/import', {
        childId,
        rows: validRows.map((r) => ({
          title: r.title,
          author: r.author || undefined,
          isbn: r.isbn || undefined,
          readDate: r.readDate || undefined,
          durationMinutes: r.durationMinutes || undefined,
          pages: r.pages ?? undefined,
          note: r.note || undefined,
        })),
      });
      setResult(res);
      toast.success(`导入完成：成功 ${res.imported} 条`);
    } catch (e) {
      toast.error('导入失败', e instanceof Error ? e.message : undefined);
    } finally {
      setImporting(false);
    }
  };

  const reset = () => {
    setRows([]);
    setFileName('');
    setResult(null);
    if (fileRef.current) fileRef.current.value = '';
  };

  return (
    <div className="space-y-5">
      <GlassCard className="p-5">
        <div className="mb-4 flex items-center gap-2">
          <Icon name="Upload" size="md" className="text-accent" />
          <h2 className="text-base font-bold text-text-secondary">批量导入阅读数据</h2>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div>
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const f = e.dataTransfer.files?.[0];
                if (f) handleFile(f);
              }}
              className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border-default bg-surface-elevated p-8 text-center transition-colors hover:border-accent/40"
              onClick={() => fileRef.current?.click()}
            >
              <Icon name="FileUp" size="lg" className="mb-3 text-text-muted" />
              <p className="text-sm font-medium text-text-secondary">
                {fileName || '点击或拖拽上传 CSV 文件'}
              </p>
              <p className="mt-1 text-2xs text-text-muted">
                支持小花生导出的图书目录 / 阅读记录，UTF-8 编码
              </p>
              <input
                ref={fileRef}
                type="file"
                accept=".csv,text/csv"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleFile(f);
                }}
              />
            </div>

            <div className="mt-4 rounded-xl border border-border-subtle bg-surface p-4">
              <p className="mb-2 text-xs font-medium text-text-secondary">CSV 列名支持（自动识别）</p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-2xs text-text-muted">
                <span>书名 / 标题（必填）</span>
                <span>作者</span>
                <span>ISBN / 条形码</span>
                <span>阅读日期（YYYY-MM-DD）</span>
                <span>时长（分钟）</span>
                <span>页数</span>
                <span>备注 / 心得</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-text-secondary">解析预览</span>
              {rows.length > 0 && (
                <Button variant="ghost" size="sm" onClick={reset}>
                  <Icon name="RotateCcw" size="sm" />
                  重新选择
                </Button>
              )}
            </div>

            {parsing ? (
              <div className="flex items-center justify-center py-16">
                <div className="border-accent/30 size-8 animate-spin rounded-full border-2 border-t-accent" />
              </div>
            ) : rows.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-xl border border-border-subtle bg-surface py-16 text-center">
                <Icon name="Table" size="md" className="mb-2 text-text-muted" />
                <p className="text-sm text-text-muted">上传 CSV 后在此预览</p>
              </div>
            ) : (
              <div className="max-h-64 overflow-auto rounded-xl border border-border-subtle bg-surface">
                <table className="w-full text-left text-xs">
                  <thead className="sticky top-0 bg-surface-elevated text-text-muted">
                    <tr>
                      <th className="px-3 py-2 font-medium">书名</th>
                      <th className="px-3 py-2 font-medium">作者</th>
                      <th className="px-3 py-2 font-medium">日期</th>
                      <th className="px-3 py-2 font-medium">时长</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.slice(0, 50).map((r, i) => (
                      <tr key={i} className="border-t border-border-subtle">
                        <td className="max-w-[160px] truncate px-3 py-2 text-text-secondary">
                          {r.title}
                        </td>
                        <td className="max-w-[100px] truncate px-3 py-2 text-text-muted">
                          {r.author || '-'}
                        </td>
                        <td className="px-3 py-2 text-text-muted">{r.readDate || '-'}</td>
                        <td className="px-3 py-2 text-text-muted">
                          {r.durationMinutes || '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {rows.length > 50 && (
                  <p className="border-t border-border-subtle px-3 py-2 text-center text-2xs text-text-muted">
                    仅显示前 50 条，共 {rows.length} 条
                  </p>
                )}
              </div>
            )}

            {rows.length > 0 && (
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-xs text-text-muted">
                  共 <span className="font-medium text-text-secondary">{validRows.length}</span> 条有效记录
                  {totalMinutes > 0 && (
                    <>
                      ，累计 <span className="font-medium text-text-secondary">{totalMinutes}</span> 分钟
                    </>
                  )}
                </span>
                <div className="ml-auto">
                  <Button onClick={doImport} isLoading={importing} leftIcon="Download">
                    确认导入
                  </Button>
                </div>
              </div>
            )}

            {result && (
              <div
                className={cn(
                  'rounded-xl border p-4 text-sm',
                  result.errors > 0
                    ? 'border-warning/30 bg-warning/5'
                    : 'border-success/30 bg-success/5'
                )}
              >
                <p className="mb-1 font-medium text-text-secondary">导入结果</p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-text-muted">
                  <span>成功：<span className="font-medium text-success">{result.imported}</span></span>
                  <span>新增书目：<span className="font-medium text-text-secondary">{result.matched}</span></span>
                  <span>跳过：<span className="font-medium text-text-secondary">{result.skipped}</span></span>
                  <span>失败：<span className="font-medium text-warning">{result.errors}</span></span>
                </div>
                {result.messages.length > 0 && (
                  <ul className="mt-2 max-h-24 space-y-0.5 overflow-auto text-2xs text-warning">
                    {result.messages.slice(0, 10).map((m, i) => (
                      <li key={i}>{m}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
