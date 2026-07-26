'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { X, Plus, User, Pencil } from 'lucide-react';
import { useChildren } from '@/components/dashboard/ChildrenContext';
import { Child, AVATAR_COLORS, gradeLabel, gradeToStage } from '@/lib/children';

interface ChildModalProps {
  isOpen: boolean;
  onClose: () => void;
  child?: Child | null;
}

const GRADES = Array.from({ length: 12 }, (_, i) => i + 1);

export default function ChildModal({ isOpen, onClose, child }: ChildModalProps) {
  const { addChild, updateChild } = useChildren();
  const isEdit = Boolean(child);

  const [name, setName] = useState('');
  const [grade, setGrade] = useState(1);
  const [avatarColor, setAvatarColor] = useState(AVATAR_COLORS[0]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      if (child) {
        setName(child.name);
        setGrade(child.grade);
        setAvatarColor(child.avatarColor);
      } else {
        setName('');
        setGrade(1);
        setAvatarColor(AVATAR_COLORS[0]);
      }
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, child]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (child) {
      updateChild(child.id, { name: name.trim(), grade, avatarColor });
    } else {
      addChild({ name: name.trim(), grade, avatarColor });
    }
    onClose();
  };

  if (!isOpen) return null;

  return createPortal(
    <AnimatePresence>
      <motion.div
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
          className="relative w-full max-w-md max-h-[85vh] rounded-3xl flex flex-col overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(15,23,42,0.98) 0%, rgba(30,41,59,0.98) 100%)',
            border: '1px solid rgba(244,63,94,0.3)',
            boxShadow: '0 0 80px rgba(244,63,94,0.25), 0 0 120px rgba(139,92,246,0.15), inset 0 1px 0 rgba(255,255,255,0.1)',
          }}
        >
          <div className="relative z-10 p-6 pb-4 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                {isEdit ? <Pencil className="w-5 h-5 text-white" /> : <Plus className="w-5 h-5 text-white" />}
              </div>
              <div>
                <h3 className="text-lg font-bold font-display">{isEdit ? '编辑孩子' : '添加孩子'}</h3>
                <p className="text-xs text-slate-400">
                  {isEdit ? '修改孩子的名称、年级和头像' : '添加一个新的孩子档案'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all"
              aria-label="关闭"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="relative z-10 flex-1 overflow-y-auto p-6">
            <div className="space-y-6">
              <div className="flex flex-col items-center gap-3">
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-bold"
                  style={{
                    background: `linear-gradient(135deg, ${avatarColor}, ${avatarColor}88)`,
                    boxShadow: `0 0 30px ${avatarColor}40`,
                  }}
                >
                  {name ? name.slice(0, 1).toUpperCase() : <User className="w-8 h-8" />}
                </div>
                <p className="text-sm text-slate-400">
                  {name ? `${name} · ${gradeLabel(grade)} · ${gradeToStage(grade)}` : '预览将在此显示'}
                </p>
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-1">孩子姓名</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="例如：大宝"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-primary transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-2">当前年级</label>
                <div className="grid grid-cols-4 gap-2 max-h-40 overflow-y-auto pr-1">
                  {GRADES.map((g) => {
                    const active = grade === g;
                    return (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setGrade(g)}
                        className={`px-2 py-2 rounded-xl text-xs font-medium border transition-all ${
                          active
                            ? 'bg-primary/10 border-primary/40 text-primary'
                            : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                        }`}
                      >
                        {gradeLabel(g)}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-2">头像颜色</label>
                <div className="flex flex-wrap gap-3">
                  {AVATAR_COLORS.map((color) => {
                    const active = avatarColor === color;
                    return (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setAvatarColor(color)}
                        className={`w-10 h-10 rounded-full transition-all ${active ? 'ring-2 ring-white ring-offset-2 ring-offset-[#0f172a]' : ''}`}
                        style={{
                          background: `linear-gradient(135deg, ${color}, ${color}88)`,
                        }}
                        aria-label={`选择颜色 ${color}`}
                      />
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-white/5 text-slate-400 text-sm hover:bg-white/10 transition-all"
              >
                取消
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-primary to-secondary text-white text-sm font-medium hover:shadow-[0_0_20px_rgba(244,63,94,0.4)] transition-all"
              >
                {isEdit ? '保存修改' : '添加孩子'}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}
