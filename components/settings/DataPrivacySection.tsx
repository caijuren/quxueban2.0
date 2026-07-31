'use client';

import { useState } from 'react';
import { Download, Trash2, FileJson, Loader2, AlertTriangle } from 'lucide-react';
import SettingsSection from './SettingsSection';

export default function DataPrivacySection() {
  const [exporting, setExporting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleting, setDeleting] = useState(false);

  const handleExport = async () => {
    setExporting(true);
    try {
      const res = await fetch('/api/user/export');
      if (!res.ok) throw new Error('导出失败');
      const data = await res.json();
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
    } finally {
      setExporting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletePassword) return;
    setDeleting(true);
    try {
      const res = await fetch('/api/user/account', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: deletePassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || '注销失败');
      window.location.href = '/';
    } catch (err) {
      setDeleting(false);
      alert(err instanceof Error ? err.message : '注销失败');
    }
  };

  return (
    <div className="space-y-4">
      <SettingsSection title="数据导出" description="下载你的所有学习数据备份">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
              <FileJson className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-200">导出全部数据</p>
              <p className="text-xs text-slate-500">包含孩子、计划、周计划和通知记录</p>
            </div>
          </div>
          <button
            onClick={handleExport}
            disabled={exporting}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white/5 text-slate-300 text-sm hover:bg-white/10 transition-colors disabled:opacity-70"
          >
            {exporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            导出 JSON
          </button>
        </div>
      </SettingsSection>

      <SettingsSection title="危险操作" description="以下操作不可逆，请谨慎">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-danger/5 border border-danger/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-danger/10 flex items-center justify-center">
              <Trash2 className="w-5 h-5 text-danger" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-200">注销账号</p>
              <p className="text-xs text-slate-500">删除后所有孩子、计划、任务数据将无法恢复</p>
            </div>
          </div>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-danger/10 text-danger text-sm font-medium hover:bg-danger/20 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            注销账号
          </button>
        </div>
      </SettingsSection>

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
            onClick={() => !deleting && setShowDeleteConfirm(false)}
          />
          <div className="relative w-full max-w-md rounded-2xl bg-[#0f172a] border border-white/10 p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-danger/10 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-danger" />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-200">确认注销账号？</h4>
                <p className="text-xs text-slate-500">此操作不可恢复</p>
              </div>
            </div>
            <p className="text-sm text-slate-400 mb-4">
              请输入当前密码以确认注销账号，注销后所有数据将被清除。
            </p>
            <input
              type="password"
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
              placeholder="当前密码"
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-danger transition-all mb-4"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleting}
                className="px-4 py-2 rounded-lg bg-white/5 text-slate-400 text-sm hover:bg-white/10 transition-colors disabled:opacity-50"
              >
                取消
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting || !deletePassword}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-danger text-white text-sm font-medium hover:bg-danger/90 transition-colors disabled:opacity-70"
              >
                {deleting && <Loader2 className="w-4 h-4 animate-spin" />}
                确认注销
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
