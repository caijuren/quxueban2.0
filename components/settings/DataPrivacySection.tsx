'use client';

import { useState } from 'react';
import { Download, Trash2, FileJson, Loader2, AlertTriangle } from 'lucide-react';
import { useExportUserData, useDeleteAccount } from '@/lib/hooks/useUser';
import SettingsSection from './SettingsSection';

export default function DataPrivacySection() {
  const exportData = useExportUserData();
  const deleteAccount = useDeleteAccount();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');

  const handleExport = async () => {
    try {
      const data = await exportData.mutateAsync();
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `quxueban-export-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert(err instanceof Error ? err.message : '导出失败');
    }
  };

  const handleDelete = async () => {
    if (!deletePassword) return;
    try {
      await deleteAccount.mutateAsync({ password: deletePassword });
      window.location.href = '/';
    } catch (err) {
      alert(err instanceof Error ? err.message : '注销失败');
    }
  };

  return (
    <div className="space-y-4">
      <SettingsSection title="数据导出" description="下载你的所有学习数据备份">
        <div className="flex flex-col justify-between gap-4 rounded-xl border border-border-subtle bg-surface-elevated p-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-accent/10">
              <FileJson className="size-5 text-accent" />
            </div>
            <div>
              <p className="text-sm font-medium text-text-secondary">导出全部数据</p>
              <p className="text-xs text-text-muted">包含孩子、计划、周计划和通知记录</p>
            </div>
          </div>
          <button
            onClick={handleExport}
            disabled={exportData.isPending}
            className="inline-flex items-center gap-1.5 rounded-lg bg-surface-elevated px-4 py-2 text-sm text-text-secondary transition-colors hover:bg-surface-highlight disabled:opacity-70"
          >
            {exportData.isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Download className="size-4" />
            )}
            导出 JSON
          </button>
        </div>
      </SettingsSection>

      <SettingsSection title="危险操作" description="以下操作不可逆，请谨慎">
        <div className="bg-error/5 border-error/10 flex flex-col justify-between gap-4 rounded-xl border p-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <div className="bg-error/10 flex size-10 items-center justify-center rounded-xl">
              <Trash2 className="size-5 text-error" />
            </div>
            <div>
              <p className="text-sm font-medium text-text-secondary">注销账号</p>
              <p className="text-xs text-text-muted">删除后所有孩子、计划、任务数据将无法恢复</p>
            </div>
          </div>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="bg-error/10 hover:bg-error/20 inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium text-error transition-colors"
          >
            <Trash2 className="size-4" />
            注销账号
          </button>
        </div>
      </SettingsSection>

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
            onClick={() => !deleteAccount.isPending && setShowDeleteConfirm(false)}
          />
          <div className="relative w-full max-w-md rounded-2xl border border-border-default bg-bg-secondary p-6 shadow-2xl">
            <div className="mb-4 flex items-center gap-3">
              <div className="bg-error/10 flex size-10 items-center justify-center rounded-full">
                <AlertTriangle className="size-5 text-error" />
              </div>
              <div>
                <h4 className="text-base font-bold text-text-secondary">确认注销账号？</h4>
                <p className="text-xs text-text-muted">此操作不可恢复</p>
              </div>
            </div>
            <p className="mb-4 text-sm text-text-tertiary">
              请输入当前密码以确认注销账号，注销后所有数据将被清除。
            </p>
            <input
              type="password"
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
              placeholder="当前密码"
              className="mb-4 w-full rounded-xl border border-border-default bg-surface-elevated px-4 py-2.5 text-sm text-text-secondary transition-all placeholder:text-text-tertiary focus:border-error focus:outline-none"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleteAccount.isPending}
                className="rounded-lg bg-surface-elevated px-4 py-2 text-sm text-text-tertiary transition-colors hover:bg-surface-highlight disabled:opacity-50"
              >
                取消
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteAccount.isPending || !deletePassword}
                className="hover:bg-error/90 inline-flex items-center gap-2 rounded-lg bg-error px-4 py-2 text-sm font-medium text-text-primary transition-colors disabled:opacity-70"
              >
                {deleteAccount.isPending && <Loader2 className="size-4 animate-spin" />}
                确认注销
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
