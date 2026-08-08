'use client';

import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import {
  X,
  Plus,
  User,
  Pencil,
  Upload,
  Trash2,
  AlertCircle,
  Calendar,
  School,
  Target,
  FileText,
  Loader2,
  Check,
  Send,
  Lock,
} from 'lucide-react';
import { useChildren } from '@/components/dashboard/ChildrenContext';
import {
  Child,
  EducationSystem,
  AVATAR_COLORS,
  AVATAR_PRESETS,
  gradeLabel,
  gradeToStage,
  educationSystemLabel,
} from '@/lib/children';
import { getRoutesByStage, RoutePlan } from '@/lib/plans';

interface ChildModalProps {
  isOpen: boolean;
  onClose: () => void;
  child?: Child | null;
}

const GRADES = Array.from({ length: 12 }, (_, i) => i + 1);
const MAX_AVATAR_SIZE = 2 * 1024 * 1024;
const UPLOAD_ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const UPLOAD_ALLOWED_EXTS = ['jpg', 'jpeg', 'png', 'webp', 'gif'];

function resolveFileMimeType(file: File): string | null {
  if (UPLOAD_ALLOWED_TYPES.includes(file.type)) {
    return file.type;
  }
  const ext = file.name.split('.').pop()?.toLowerCase();
  if (ext && UPLOAD_ALLOWED_EXTS.includes(ext)) {
    return `image/${ext === 'jpg' ? 'jpeg' : ext}`;
  }
  return null;
}

function findPresetByAvatarUrl(url?: string | null) {
  if (!url) return null;
  return AVATAR_PRESETS.find((p) => p.emoji === url)?.id ?? null;
}

function isImageUrl(url?: string | null) {
  if (!url) return false;
  return (
    url.startsWith('data:image') ||
    url.startsWith('/uploads/avatars/') ||
    url.startsWith('/api/uploads/avatars/') ||
    /^https?:\/\//.test(url)
  );
}

function formatDateForInput(date?: string | null): string {
  if (!date) return '';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  return d.toISOString().split('T')[0];
}

export default function ChildModal({ isOpen, onClose, child }: ChildModalProps) {
  const { addChild, updateChild, removeChild } = useChildren();
  const isEdit = Boolean(child);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const [name, setName] = useState('');
  const [grade, setGrade] = useState(1);
  const [educationSystem, setEducationSystem] = useState<EducationSystem>('six-three');
  const [avatarColor, setAvatarColor] = useState(AVATAR_COLORS[0]);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [targetSchool, setTargetSchool] = useState('');
  const [currentSchool, setCurrentSchool] = useState('');
  const [birthday, setBirthday] = useState('');
  const [notes, setNotes] = useState('');
  const [routeId, setRouteId] = useState<string | null>(null);
  const [dingTalkWebhook, setDingTalkWebhook] = useState('');
  const [dingTalkSecret, setDingTalkSecret] = useState('');
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);

  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [touched, setTouched] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const stage = gradeToStage(grade, educationSystem);
  const availableRoutes = getRoutesByStage(stage);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setError(null);
      setTouched(false);
      setShowDeleteConfirm(false);
      if (child) {
        setName(child.name);
        setGrade(child.grade);
        setEducationSystem(child.educationSystem ?? 'six-three');
        setAvatarColor(child.avatarColor);
        setAvatarUrl(child.avatarUrl ?? null);
        setTargetSchool(child.targetSchool ?? '');
        setCurrentSchool(child.currentSchool ?? '');
        setBirthday(formatDateForInput(child.birthday));
        setNotes(child.notes ?? '');
        setRouteId(child.routeId ?? null);
        setDingTalkWebhook(child.dingTalkWebhook ?? '');
        setDingTalkSecret(child.dingTalkSecret ?? '');
        setSelectedPreset(findPresetByAvatarUrl(child.avatarUrl));
      } else {
        setName('');
        setGrade(1);
        setEducationSystem('six-three');
        setAvatarColor(AVATAR_COLORS[0]);
        setAvatarUrl(null);
        setTargetSchool('');
        setCurrentSchool('');
        setBirthday('');
        setNotes('');
        setRouteId(null);
        setDingTalkWebhook('');
        setDingTalkSecret('');
      }
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, child]);

  // Reset route selection when grade changes to a stage without matching routes
  useEffect(() => {
    const currentStageRoutes = getRoutesByStage(stage);
    if (routeId && !currentStageRoutes.some((r) => r.id === routeId)) {
      setRouteId(null);
    }
  }, [grade, routeId, stage]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_AVATAR_SIZE) {
      setError('头像图片不能超过 2MB');
      return;
    }

    if (!resolveFileMimeType(file)) {
      setError(`仅支持 JPG、PNG、WebP、GIF 格式（当前 ${file.type || '未知类型'}）`);
      return;
    }

    setUploadingAvatar(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const res = await fetch('/api/upload/avatar', {
        method: 'POST',
        body: formData,
        credentials: 'same-origin',
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || '头像上传失败');
      }

      setAvatarUrl(data.avatarUrl);
      setSelectedPreset(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : '头像上传失败，请重试';
      setError(message);
    } finally {
      setUploadingAvatar(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handlePresetSelect = (preset: (typeof AVATAR_PRESETS)[0]) => {
    setSelectedPreset(preset.id);
    setAvatarUrl(preset.emoji);
    setAvatarColor(preset.bg);
  };

  const handleClearAvatar = () => {
    setAvatarUrl(null);
    setSelectedPreset(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const validate = (): boolean => {
    if (!name.trim()) {
      setError('请输入孩子姓名');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!validate()) return;

    setSaving(true);
    setError(null);

    const payload: Omit<Child, 'id'> = {
      name: name.trim(),
      grade,
      educationSystem,
      avatarColor,
      avatarUrl,
      targetSchool: targetSchool.trim() || null,
      currentSchool: currentSchool.trim() || null,
      birthday: birthday || null,
      notes: notes.trim() || null,
      routeId,
      dingTalkWebhook: dingTalkWebhook.trim() || null,
      dingTalkSecret: dingTalkSecret.trim() || null,
    };

    try {
      if (child) {
        await updateChild(child.id, payload);
      } else {
        await addChild(payload);
      }
      onClose();
    } catch (err) {
      const message = err instanceof Error ? err.message : '保存失败，请重试';
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!child) return;
    setSaving(true);
    try {
      await removeChild(child.id);
      setShowDeleteConfirm(false);
      onClose();
    } catch (err) {
      const message = err instanceof Error ? err.message : '删除失败，请重试';
      setError(message);
      setSaving(false);
    }
  };

  const renderAvatarPreview = () => {
    if (avatarUrl && isImageUrl(avatarUrl)) {
      return (
        <Image
          src={avatarUrl}
          alt={name || '头像'}
          fill
          sizes="96px"
          unoptimized
          className="object-cover"
        />
      );
    }
    if (avatarUrl) {
      return <span className="text-3xl">{avatarUrl}</span>;
    }
    if (name) {
      return (
        <span className="text-2xl font-bold text-text-primary">
          {name.slice(0, 1).toUpperCase()}
        </span>
      );
    }
    return <User className="text-text-primary/80 size-8" />;
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="child-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/85 backdrop-blur-md"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-border-subtle bg-surface-elevated"
          >
            <div className="relative z-10 flex items-center justify-between border-b border-border-subtle p-6 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary">
                  {isEdit ? (
                    <Pencil className="size-5 text-text-primary" />
                  ) : (
                    <Plus className="size-5 text-text-primary" />
                  )}
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-text-primary">
                    {isEdit ? '编辑孩子' : '添加孩子'}
                  </h3>
                  <p className="text-xs text-text-tertiary">
                    {isEdit ? '修改档案、头像和升学路线' : '添加一个新的孩子档案'}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                disabled={saving}
                className="flex size-8 items-center justify-center rounded-lg bg-surface-hover text-text-tertiary transition-all hover:bg-surface-highlight hover:text-text-primary disabled:opacity-50"
                aria-label="关闭"
              >
                <X className="size-4" />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="modal-scroll relative z-10 flex-1 overflow-y-auto p-6"
            >
              {error && (
                <div className="bg-error/[0.08] border-error/[0.15] mb-4 flex items-start gap-2 rounded-xl border p-3 text-sm text-error">
                  <AlertCircle className="mt-0.5 size-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-6">
                {/* Avatar */}
                <div className="flex flex-col items-center gap-4">
                  <div
                    className="relative flex size-24 items-center justify-center overflow-hidden rounded-full ring-4 ring-border-default"
                    style={{
                      background: `linear-gradient(135deg, ${avatarColor}, ${avatarColor}88)`,
                      boxShadow: `0 0 30px ${avatarColor}40`,
                    }}
                  >
                    {renderAvatarPreview()}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadingAvatar}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-surface-hover px-3 py-1.5 text-xs text-text-secondary transition-colors hover:bg-surface-highlight disabled:opacity-50"
                    >
                      {uploadingAvatar ? (
                        <Loader2 className="size-3.5 animate-spin" />
                      ) : (
                        <Upload className="size-3.5" />
                      )}
                      {uploadingAvatar ? '上传中...' : '上传头像'}
                    </button>
                    {avatarUrl && (
                      <button
                        type="button"
                        onClick={handleClearAvatar}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-surface-hover px-3 py-1.5 text-xs text-text-tertiary transition-colors hover:bg-surface-highlight"
                      >
                        <X className="size-3.5" />
                        清除
                      </button>
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  <div className="w-full">
                    <p className="mb-2 text-center text-xs text-text-muted">预设头像</p>
                    <div className="flex flex-wrap justify-center gap-2">
                      {AVATAR_PRESETS.map((preset) => {
                        const active = selectedPreset === preset.id;
                        return (
                          <button
                            key={preset.id}
                            type="button"
                            onClick={() => handlePresetSelect(preset)}
                            className={`flex size-10 items-center justify-center rounded-full text-lg transition-all ${
                              active
                                ? 'ring-2 ring-text-primary ring-offset-2 ring-offset-surface-elevated'
                                : 'opacity-70 hover:opacity-100'
                            }`}
                            style={{
                              background: `linear-gradient(135deg, ${preset.bg}, ${preset.bg}88)`,
                            }}
                            aria-label={`选择头像 ${preset.id}`}
                          >
                            {preset.emoji}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="w-full">
                    <p className="mb-2 text-center text-xs text-text-muted">背景颜色</p>
                    <div className="flex flex-wrap justify-center gap-2">
                      {AVATAR_COLORS.map((color) => {
                        const active = avatarColor === color;
                        return (
                          <button
                            key={color}
                            type="button"
                            onClick={() => setAvatarColor(color)}
                            className={`size-8 rounded-full transition-all ${
                              active
                                ? 'ring-2 ring-text-primary ring-offset-2 ring-offset-surface-elevated'
                                : ''
                            }`}
                            style={{
                              background: `linear-gradient(135deg, ${color}, ${color}88)`,
                            }}
                            aria-label={`选择颜色 ${color}`}
                          />
                        );
                      })}
                    </div>
                  </div>

                  <p className="text-sm text-text-tertiary">
                    {name
                      ? `${name} · ${gradeLabel(grade, educationSystem)} · ${stage} · ${educationSystemLabel(educationSystem)}`
                      : '预览将在此显示'}
                  </p>
                </div>

                {/* Basic info */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className="mb-1.5 block text-xs text-text-tertiary">
                      孩子姓名 <span className="text-primary">*</span>
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="例如：大宝"
                      className={`w-full rounded-lg border bg-surface px-4 py-2 text-sm text-text-primary transition-all placeholder:text-text-tertiary focus:border-primary focus:outline-none ${
                        touched && !name.trim() ? 'border-error/50' : 'border-border-default'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs text-text-tertiary">
                      学制 <span className="text-primary">*</span>
                    </label>
                    <select
                      value={educationSystem}
                      onChange={(e) => setEducationSystem(e.target.value as EducationSystem)}
                      className="w-full appearance-none rounded-lg border border-border-default bg-surface px-4 py-2 text-sm text-text-primary transition-all focus:border-primary focus:outline-none"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23757575' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 12px center',
                      }}
                    >
                      <option value="six-three">六三制（小学 6 年）</option>
                      <option value="five-four">五四制（小学 5 年）</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs text-text-tertiary">
                      当前年级 <span className="text-primary">*</span>
                    </label>
                    <select
                      value={grade}
                      onChange={(e) => setGrade(Number(e.target.value))}
                      className="w-full appearance-none rounded-lg border border-border-default bg-surface px-4 py-2 text-sm text-text-primary transition-all focus:border-primary focus:outline-none"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23757575' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 12px center',
                      }}
                    >
                      {GRADES.map((g) => (
                        <option key={g} value={g}>
                          {gradeLabel(g, educationSystem)} · {gradeToStage(g, educationSystem)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs text-text-tertiary">生日</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-muted" />
                      <input
                        type="date"
                        value={birthday}
                        onChange={(e) => setBirthday(e.target.value)}
                        className="w-full rounded-lg border border-border-default bg-surface py-2 pl-9 pr-4 text-sm text-text-primary transition-all focus:border-primary focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Schools */}
                <div className="space-y-4">
                  <div>
                    <label className="mb-1.5 block text-xs text-text-tertiary">当前学校</label>
                    <div className="relative">
                      <School className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-muted" />
                      <input
                        type="text"
                        value={currentSchool}
                        onChange={(e) => setCurrentSchool(e.target.value)}
                        placeholder="例如：南翔小学"
                        className="w-full rounded-lg border border-border-default bg-surface py-2 pl-9 pr-4 text-sm text-text-primary transition-all placeholder:text-text-tertiary focus:border-primary focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs text-text-tertiary">目标学校</label>
                    <div className="relative">
                      <Target className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-muted" />
                      <input
                        type="text"
                        value={targetSchool}
                        onChange={(e) => setTargetSchool(e.target.value)}
                        placeholder="例如：上实 / 交大附中嘉定分校"
                        className="w-full rounded-lg border border-border-default bg-surface py-2 pl-9 pr-4 text-sm text-text-primary transition-all placeholder:text-text-tertiary focus:border-primary focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Route binding */}
                <div>
                  <label className="mb-2 block text-xs text-text-tertiary">绑定升学路线</label>
                  {availableRoutes.length > 0 ? (
                    <div className="grid gap-2">
                      {availableRoutes.map((route) => (
                        <RouteOption
                          key={route.id}
                          route={route}
                          selected={routeId === route.id}
                          onSelect={() => setRouteId(route.id)}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-xl border border-border-subtle bg-surface-hover p-4 text-center text-sm text-text-muted">
                      高中阶段路线即将上线
                    </div>
                  )}
                </div>

                {/* Notes */}
                <div>
                  <label className="mb-1.5 block text-xs text-text-tertiary">备注</label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3 size-4 text-text-muted" />
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="记录孩子的特长、薄弱项或其他关键信息"
                      rows={3}
                      className="w-full resize-none rounded-lg border border-border-default bg-surface py-2 pl-9 pr-4 text-sm text-text-primary transition-all placeholder:text-text-tertiary focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>

                {/* DingTalk */}
                <div className="space-y-4 rounded-2xl border border-border-subtle bg-surface-hover p-4">
                  <div className="mb-1 flex items-center gap-2">
                    <Send className="size-4 text-primary" />
                    <h4 className="text-sm font-semibold text-text-secondary">钉钉日报推送</h4>
                  </div>
                  <p className="-mt-2 text-xs text-text-muted">
                    为这个孩子单独配置钉钉机器人，今日任务完成情况将推送到对应群。
                  </p>

                  <div>
                    <label className="mb-1.5 block text-xs text-text-tertiary">Webhook 地址</label>
                    <div className="relative">
                      <Send className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-muted" />
                      <input
                        type="url"
                        value={dingTalkWebhook}
                        onChange={(e) => setDingTalkWebhook(e.target.value)}
                        placeholder="https://oapi.dingtalk.com/robot/send?access_token=xxx"
                        className="w-full rounded-lg border border-border-default bg-surface py-2 pl-9 pr-4 text-sm text-text-primary transition-all placeholder:text-text-tertiary focus:border-primary focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs text-text-tertiary">
                      加签密钥（可选）
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-muted" />
                      <input
                        type="text"
                        value={dingTalkSecret}
                        onChange={(e) => setDingTalkSecret(e.target.value)}
                        placeholder="SECxxx"
                        className="w-full rounded-lg border border-border-default bg-surface py-2 pl-9 pr-4 text-sm text-text-primary transition-all placeholder:text-text-tertiary focus:border-primary focus:outline-none"
                      />
                    </div>
                  </div>

                  {dingTalkWebhook && (
                    <div className="flex items-center gap-2 text-xs text-success">
                      <Check className="size-3.5" />
                      已启用钉钉推送
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between gap-3 border-t border-border-subtle pt-4">
                {isEdit ? (
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(true)}
                    disabled={saving}
                    className="bg-error/[0.08] hover:bg-error/[0.12] inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm text-error transition-all disabled:opacity-50"
                  >
                    <Trash2 className="size-4" />
                    删除
                  </button>
                ) : (
                  <div />
                )}
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      console.log('[ChildModal] cancel clicked, onClose:', onClose);
                      onClose();
                    }}
                    disabled={saving}
                    className="rounded-lg bg-surface-hover px-4 py-2 text-sm text-text-tertiary transition-all hover:bg-surface-highlight disabled:opacity-50"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    disabled={saving || uploadingAvatar}
                    className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-primary to-secondary px-4 py-2 text-sm font-medium text-text-primary transition-all disabled:opacity-70"
                  >
                    {(saving || uploadingAvatar) && <Loader2 className="size-4 animate-spin" />}
                    {isEdit ? '保存修改' : '添加孩子'}
                  </button>
                </div>
              </div>
            </form>

            {/* Delete confirmation overlay */}
            <AnimatePresence>
              {showDeleteConfirm && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-20 flex items-center justify-center bg-black/80 p-6 backdrop-blur-sm"
                >
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="w-full max-w-sm rounded-2xl border border-border-subtle bg-surface-elevated p-6 shadow-2xl"
                  >
                    <div className="mb-4 flex items-center gap-3">
                      <div className="bg-error/[0.08] flex size-10 items-center justify-center rounded-full">
                        <Trash2 className="size-5 text-error" />
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-text-secondary">确认删除？</h4>
                        <p className="text-xs text-text-muted">
                          删除后，该孩子的所有计划、任务和数据将无法恢复
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => setShowDeleteConfirm(false)}
                        disabled={saving}
                        className="rounded-lg bg-surface-hover px-4 py-2 text-sm text-text-tertiary transition-all hover:bg-surface-highlight disabled:opacity-50"
                      >
                        取消
                      </button>
                      <button
                        type="button"
                        onClick={handleDelete}
                        disabled={saving}
                        className="hover:bg-error/90 inline-flex items-center gap-2 rounded-lg bg-error px-4 py-2 text-sm font-medium text-text-primary transition-all disabled:opacity-70"
                      >
                        {saving && <Loader2 className="size-4 animate-spin" />}
                        确认删除
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}

function RouteOption({
  route,
  selected,
  onSelect,
}: {
  route: RoutePlan;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full rounded-lg border p-3 text-left transition-all ${
        selected
          ? 'bg-primary/10 border-primary/40'
          : 'border-border-subtle bg-surface-hover hover:bg-surface-highlight'
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border ${
            selected ? 'border-primary bg-primary' : 'border-border-default bg-transparent'
          }`}
        >
          {selected && <Check className="size-3 text-text-primary" />}
        </div>
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center gap-2">
            <span
              className={`truncate text-sm font-medium ${
                route.type === 'primary' ? 'text-primary' : 'text-secondary'
              }`}
            >
              {route.name}
            </span>
            <span
              className={`rounded border px-1.5 py-0.5 text-[10px] ${
                route.type === 'primary'
                  ? 'border-primary/30 bg-primary/10 text-primary'
                  : 'border-secondary/30 bg-secondary/10 text-secondary'
              }`}
            >
              {route.type === 'primary' ? '主路线' : '备选'}
            </span>
          </div>
          <p className="line-clamp-2 text-xs text-text-tertiary">{route.description}</p>
        </div>
      </div>
    </button>
  );
}
