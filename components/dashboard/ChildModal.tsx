'use client';

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
} from 'lucide-react';
import { useChildren } from '@/components/dashboard/ChildrenContext';
import {
  Child,
  AVATAR_COLORS,
  AVATAR_PRESETS,
  gradeLabel,
  gradeToStage,
} from '@/lib/children';
import { getRoutesByStage, RoutePlan } from '@/lib/plans';

interface ChildModalProps {
  isOpen: boolean;
  onClose: () => void;
  child?: Child | null;
}

const GRADES = Array.from({ length: 12 }, (_, i) => i + 1);
const MAX_AVATAR_SIZE = 2 * 1024 * 1024;

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
  const [avatarColor, setAvatarColor] = useState(AVATAR_COLORS[0]);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [targetSchool, setTargetSchool] = useState('');
  const [currentSchool, setCurrentSchool] = useState('');
  const [birthday, setBirthday] = useState('');
  const [notes, setNotes] = useState('');
  const [routeId, setRouteId] = useState<string | null>(null);
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [touched, setTouched] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const stage = gradeToStage(grade);
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
        setAvatarColor(child.avatarColor);
        setAvatarUrl(child.avatarUrl ?? null);
        setTargetSchool(child.targetSchool ?? '');
        setCurrentSchool(child.currentSchool ?? '');
        setBirthday(formatDateForInput(child.birthday));
        setNotes(child.notes ?? '');
        setRouteId(child.routeId ?? null);
      } else {
        setName('');
        setGrade(1);
        setAvatarColor(AVATAR_COLORS[0]);
        setAvatarUrl(null);
        setTargetSchool('');
        setCurrentSchool('');
        setBirthday('');
        setNotes('');
        setRouteId(null);
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_AVATAR_SIZE) {
      setError('头像图片不能超过 2MB');
      return;
    }

    if (!file.type.startsWith('image/')) {
      setError('请上传图片文件');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setAvatarUrl(reader.result as string);
      setSelectedPreset(null);
      setError(null);
    };
    reader.onerror = () => setError('图片读取失败，请重试');
    reader.readAsDataURL(file);
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
      avatarColor,
      avatarUrl,
      targetSchool: targetSchool.trim() || null,
      currentSchool: currentSchool.trim() || null,
      birthday: birthday || null,
      notes: notes.trim() || null,
      routeId,
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
    if (avatarUrl?.startsWith('data:image')) {
      return (
        <img
          src={avatarUrl}
          alt={name || '头像'}
          className="w-full h-full object-cover"
        />
      );
    }
    if (avatarUrl) {
      return <span className="text-3xl">{avatarUrl}</span>;
    }
    if (name) {
      return (
        <span className="text-2xl font-bold text-white">
          {name.slice(0, 1).toUpperCase()}
        </span>
      );
    }
    return <User className="w-8 h-8 text-white/80" />;
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
            className="relative w-full max-w-lg max-h-[90vh] rounded-3xl flex flex-col overflow-hidden"
            style={{
              background:
                'linear-gradient(135deg, rgba(15,23,42,0.98) 0%, rgba(30,41,59,0.98) 100%)',
              border: '1px solid rgba(244,63,94,0.3)',
              boxShadow:
                '0 0 80px rgba(244,63,94,0.25), 0 0 120px rgba(139,92,246,0.15), inset 0 1px 0 rgba(255,255,255,0.1)',
            }}
        >
          <div className="relative z-10 p-6 pb-4 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                {isEdit ? (
                  <Pencil className="w-5 h-5 text-white" />
                ) : (
                  <Plus className="w-5 h-5 text-white" />
                )}
              </div>
              <div>
                <h3 className="text-lg font-bold font-display">
                  {isEdit ? '编辑孩子' : '添加孩子'}
                </h3>
                <p className="text-xs text-slate-400">
                  {isEdit
                    ? '修改档案、头像和升学路线'
                    : '添加一个新的孩子档案'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              disabled={saving}
              className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all disabled:opacity-50"
              aria-label="关闭"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form
            onSubmit={handleSubmit}
            className="relative z-10 flex-1 overflow-y-auto p-6 modal-scroll"
          >
            {error && (
              <div className="mb-4 flex items-start gap-2 rounded-xl bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-200">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-6">
              {/* Avatar */}
              <div className="flex flex-col items-center gap-4">
                <div
                  className="relative w-24 h-24 rounded-full flex items-center justify-center overflow-hidden ring-4 ring-white/5"
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
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 text-slate-300 text-xs hover:bg-white/10 transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    上传头像
                  </button>
                  {avatarUrl && (
                    <button
                      type="button"
                      onClick={handleClearAvatar}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 text-slate-400 text-xs hover:bg-white/10 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
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
                  <p className="text-xs text-slate-500 mb-2 text-center">
                    预设头像
                  </p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {AVATAR_PRESETS.map((preset) => {
                      const active = selectedPreset === preset.id;
                      return (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => handlePresetSelect(preset)}
                          className={`w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all ${
                            active
                              ? 'ring-2 ring-white ring-offset-2 ring-offset-[#0f172a]'
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
                  <p className="text-xs text-slate-500 mb-2 text-center">
                    背景颜色
                  </p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {AVATAR_COLORS.map((color) => {
                      const active = avatarColor === color;
                      return (
                        <button
                          key={color}
                          type="button"
                          onClick={() => setAvatarColor(color)}
                          className={`w-8 h-8 rounded-full transition-all ${
                            active
                              ? 'ring-2 ring-white ring-offset-2 ring-offset-[#0f172a]'
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

                <p className="text-sm text-slate-400">
                  {name
                    ? `${name} · ${gradeLabel(grade)} · ${stage}`
                    : '预览将在此显示'}
                </p>
              </div>

              {/* Basic info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs text-slate-400 mb-1.5">
                    孩子姓名 <span className="text-primary">*</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="例如：大宝"
                    className={`w-full px-4 py-2.5 rounded-xl bg-white/5 border text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-primary transition-all ${
                      touched && !name.trim()
                        ? 'border-red-500/50'
                        : 'border-white/10'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1.5">
                    当前年级 <span className="text-primary">*</span>
                  </label>
                  <select
                    value={grade}
                    onChange={(e) => setGrade(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-slate-200 focus:outline-none focus:border-primary transition-all appearance-none"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 12px center',
                    }}
                  >
                    {GRADES.map((g) => (
                      <option key={g} value={g}>
                        {gradeLabel(g)} · {gradeToStage(g)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1.5">
                    生日
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="date"
                      value={birthday}
                      onChange={(e) => setBirthday(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-slate-200 focus:outline-none focus:border-primary transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Schools */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5">
                    当前学校
                  </label>
                  <div className="relative">
                    <School className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      value={currentSchool}
                      onChange={(e) => setCurrentSchool(e.target.value)}
                      placeholder="例如：南翔小学"
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-primary transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1.5">
                    目标学校
                  </label>
                  <div className="relative">
                    <Target className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      value={targetSchool}
                      onChange={(e) => setTargetSchool(e.target.value)}
                      placeholder="例如：上实 / 交大附中嘉定分校"
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-primary transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Route binding */}
              <div>
                <label className="block text-xs text-slate-400 mb-2">
                  绑定升学路线
                </label>
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
                  <div className="rounded-xl bg-white/5 border border-white/10 p-4 text-sm text-slate-500 text-center">
                    高中阶段路线即将上线
                  </div>
                )}
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs text-slate-400 mb-1.5">
                  备注
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="记录孩子的特长、薄弱项或其他关键信息"
                    rows={3}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-primary transition-all resize-none"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between gap-3">
              {isEdit ? (
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  disabled={saving}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-red-500/10 text-red-400 text-sm hover:bg-red-500/20 transition-all disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4" />
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
                  className="px-4 py-2 rounded-lg bg-white/5 text-slate-400 text-sm hover:bg-white/10 transition-all disabled:opacity-50"
                >
                  取消
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-primary to-secondary text-white text-sm font-medium hover:shadow-[0_0_20px_rgba(244,63,94,0.4)] transition-all disabled:opacity-70"
                >
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
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
                className="absolute inset-0 z-20 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm"
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="w-full max-w-sm rounded-2xl bg-[#0f172a] border border-white/10 p-6 shadow-2xl"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
                      <Trash2 className="w-5 h-5 text-red-400" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-slate-200">
                        确认删除？
                      </h4>
                      <p className="text-xs text-slate-500">
                        删除后，该孩子的所有计划、任务和数据将无法恢复
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setShowDeleteConfirm(false)}
                      disabled={saving}
                      className="px-4 py-2 rounded-lg bg-white/5 text-slate-400 text-sm hover:bg-white/10 transition-all disabled:opacity-50"
                    >
                      取消
                    </button>
                    <button
                      type="button"
                      onClick={handleDelete}
                      disabled={saving}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-all disabled:opacity-70"
                    >
                      {saving && <Loader2 className="w-4 h-4 animate-spin" />}
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
      className={`w-full text-left rounded-xl border p-3 transition-all ${
        selected
          ? 'bg-primary/10 border-primary/40'
          : 'bg-white/5 border-white/10 hover:bg-white/[0.08]'
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
            selected
              ? 'border-primary bg-primary'
              : 'border-white/20 bg-transparent'
          }`}
        >
          {selected && <Check className="w-3 h-3 text-white" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span
              className="text-sm font-medium truncate"
              style={{ color: route.type === 'primary' ? '#f43f5e' : '#8b5cf6' }}
            >
              {route.name}
            </span>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded border ${
                route.type === 'primary'
                  ? 'border-primary/30 text-primary bg-primary/10'
                  : 'border-secondary/30 text-secondary bg-secondary/10'
              }`}
            >
              {route.type === 'primary' ? '主路线' : '备选'}
            </span>
          </div>
          <p className="text-xs text-slate-400 line-clamp-2">
            {route.description}
          </p>
        </div>
      </div>
    </button>
  );
}
