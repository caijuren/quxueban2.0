'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { X, Plus, Target, School, GraduationCap, Home, Globe, Layers, Scale } from 'lucide-react';
import type { RoutePlan } from '@/lib/plans';

interface NewPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (plan: RoutePlan) => void;
}

const targetPresets = [
  { icon: School, color: 'from-primary to-primary-glow', shadow: 'hover:shadow-[0_0_30px_rgba(244,63,94,0.35)]' },
  { icon: GraduationCap, color: 'from-secondary to-purple-400', shadow: 'hover:shadow-[0_0_30px_rgba(139,92,246,0.35)]' },
  { icon: Home, color: 'from-accent to-cyan-400', shadow: 'hover:shadow-[0_0_30px_rgba(6,182,212,0.35)]' },
  { icon: Globe, color: 'from-secondary to-secondary-glow', shadow: 'hover:shadow-[0_0_30px_rgba(139,92,246,0.35)]' },
  { icon: Layers, color: 'from-indigo-500 to-purple-500', shadow: 'hover:shadow-[0_0_30px_rgba(99,102,241,0.35)]' },
  { icon: Scale, color: 'from-accent to-accent-glow', shadow: 'hover:shadow-[0_0_30px_rgba(6,182,212,0.35)]' },
];

export default function NewPlanModal({ isOpen, onClose, onCreate }: NewPlanModalProps) {
  const [name, setName] = useState('');
  const [type, setType] = useState<'primary' | 'backup'>('backup');
  const [description, setDescription] = useState('');
  const [requirements, setRequirements] = useState('');
  const [probability, setProbability] = useState(50);
  const [milestonesText, setMilestonesText] = useState('');
  const [targetsText, setTargetsText] = useState('');

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const parsedMilestones = milestonesText
      .split(/\n/)
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [time = '', task = ''] = line.split(/[|｜]/);
        return { time: time.trim(), task: task.trim() };
      })
      .filter((m) => m.task);

    const parsedTargets = targetsText
      .split(/\n/)
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [namePart = '', tagPart = '目标选项'] = line.split(/[|｜]/);
        return { name: namePart.trim(), tag: tagPart.trim() };
      })
      .filter((t) => t.name);

    const milestones = parsedMilestones.length
      ? parsedMilestones
      : [{ time: '待定', task: '请通过「管理节点」补充该路线里程碑' }];

    const targets = parsedTargets.length
      ? parsedTargets.map((t, i) => {
          const preset = targetPresets[i % targetPresets.length];
          return {
            slug: `custom-${Date.now()}-${i}`,
            name: t.name,
            tag: t.tag,
            icon: preset.icon,
            color: preset.color,
            shadow: preset.shadow,
          };
        })
      : [
          {
            slug: `custom-${Date.now()}-default`,
            name: '自定义目标',
            tag: '请完善',
            icon: School,
            color: 'from-slate-500 to-slate-400' as const,
            shadow: 'hover:shadow-[0_0_30px_rgba(148,163,184,0.25)]' as const,
          },
        ];

    const newPlan: RoutePlan = {
      id: `custom-${Date.now()}`,
      name: name.trim(),
      type,
      status: type === 'primary' ? 'active' : 'standby',
      description: description.trim() || '自定义路线方案',
      probability,
      requirements: requirements
        .split(/[，,\n]/)
        .map((r) => r.trim())
        .filter(Boolean),
      milestones,
      targets,
    };

    onCreate(newPlan);
    setName('');
    setDescription('');
    setRequirements('');
    setProbability(50);
    setType('backup');
    setMilestonesText('');
    setTargetsText('');
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
          className="relative w-full max-w-lg max-h-[85vh] rounded-3xl flex flex-col overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(15,23,42,0.98) 0%, rgba(30,41,59,0.98) 100%)',
            border: '1px solid rgba(244,63,94,0.3)',
            boxShadow: '0 0 80px rgba(244,63,94,0.25), 0 0 120px rgba(139,92,246,0.15), inset 0 1px 0 rgba(255,255,255,0.1)',
          }}
        >
          <div className="relative z-10 p-6 pb-4 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Plus className="w-5 h-5 text-text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-bold font-display">新建方案</h3>
                <p className="text-xs text-slate-600">添加一条自定义升学路线</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-black/5 flex items-center justify-center text-slate-600 hover:text-text-primary hover:bg-black/10 transition-all"
              aria-label="关闭"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="relative z-10 flex-1 overflow-y-auto p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-600 mb-1">方案名称</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="例如：三公冲刺二期"
                  className="w-full px-4 py-2.5 rounded-xl bg-black/5 border border-white/10 text-sm text-slate-800 placeholder-slate-500 focus:outline-none focus:border-primary transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-slate-600 mb-1">方案类型</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setType('primary')}
                    className={`flex-1 px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                      type === 'primary'
                        ? 'bg-primary/10 border-primary/40 text-primary'
                        : 'bg-black/5 border-white/10 text-slate-600 hover:bg-black/10'
                    }`}
                  >
                    主路线
                  </button>
                  <button
                    type="button"
                    onClick={() => setType('backup')}
                    className={`flex-1 px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                      type === 'backup'
                        ? 'bg-secondary/10 border-secondary/40 text-secondary'
                        : 'bg-black/5 border-white/10 text-slate-600 hover:bg-black/10'
                    }`}
                  >
                    备选路线
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm text-slate-600 mb-1">方案说明</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="简要说明该路线的目标与策略"
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/5 border border-white/10 text-sm text-slate-800 placeholder-slate-500 focus:outline-none focus:border-primary transition-all resize-none"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-600 mb-1">关键要求（用逗号或换行分隔）</label>
                <textarea
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                  placeholder="例如：AMC8 20分+, 小托福 850+"
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/5 border border-white/10 text-sm text-slate-800 placeholder-slate-500 focus:outline-none focus:border-primary transition-all resize-none"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-600 mb-1">
                  关键里程碑（每行一个，格式：时间 | 任务）
                </label>
                <textarea
                  value={milestonesText}
                  onChange={(e) => setMilestonesText(e.target.value)}
                  placeholder={"例如：五年级上 | AMC8 二次冲刺\n五年级下 4 月 | 三公报名 + 面谈评估"}
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/5 border border-white/10 text-sm text-slate-800 placeholder-slate-500 focus:outline-none focus:border-primary transition-all resize-none"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-600 mb-1">
                  目标选项（每行一个，格式：名称 | 标签）
                </label>
                <textarea
                  value={targetsText}
                  onChange={(e) => setTargetsText(e.target.value)}
                  placeholder={"例如：南翔中学 | 对口公办\n华曜嘉定 | 民办强校"}
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/5 border border-white/10 text-sm text-slate-800 placeholder-slate-500 focus:outline-none focus:border-primary transition-all resize-none"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-600 mb-1">路线匹配度：{probability}%</label>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={probability}
                  onChange={(e) => setProbability(Number(e.target.value))}
                  className="w-full h-2 rounded-full bg-black/10 appearance-none cursor-pointer accent-primary"
                />
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-black/5 text-slate-600 text-sm hover:bg-black/10 transition-all"
              >
                取消
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-primary to-secondary text-text-primary text-sm font-medium hover:shadow-[0_0_20px_rgba(244,63,94,0.4)] transition-all"
              >
                创建方案
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}
