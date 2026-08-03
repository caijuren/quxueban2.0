'use client';

import { useState } from 'react';
import { Plus, Target, School, GraduationCap, Home, Globe, Layers, Scale } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import type { RoutePlan } from '@/lib/plans';

interface NewPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (plan: RoutePlan) => void;
}

const targetPresets = [
  { icon: School, color: 'from-primary to-primary-glow', shadow: '' },
  { icon: GraduationCap, color: 'from-secondary to-purple-400', shadow: '' },
  { icon: Home, color: 'from-accent to-cyan-400', shadow: '' },
  { icon: Globe, color: 'from-secondary to-secondary-glow', shadow: '' },
  { icon: Layers, color: 'from-indigo-500 to-purple-500', shadow: '' },
  { icon: Scale, color: 'from-accent to-accent-glow', shadow: '' },
];

export default function NewPlanModal({ isOpen, onClose, onCreate }: NewPlanModalProps) {
  const [name, setName] = useState('');
  const [type, setType] = useState<'primary' | 'backup'>('backup');
  const [description, setDescription] = useState('');
  const [requirements, setRequirements] = useState('');
  const [probability, setProbability] = useState(50);
  const [milestonesText, setMilestonesText] = useState('');
  const [targetsText, setTargetsText] = useState('');

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
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
            shadow: '' as const,
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

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="新建方案"
      subtitle="添加一条自定义升学路线"
      icon={Plus}
      iconClassName="bg-secondary"
      size="md"
      colorScheme="rose"
      zIndex={100}
      footer={
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-surface-elevated text-text-tertiary text-sm hover:bg-surface-highlight transition-all"
          >
            取消
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-4 py-2 rounded-lg bg-primary text-text-primary text-sm font-medium transition-all"
          >
            创建方案
          </button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-text-tertiary mb-1">方案名称</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="例如：三公冲刺二期"
            className="w-full px-4 py-2.5 rounded-xl bg-surface-elevated border border-border-default text-sm text-text-secondary placeholder-slate-500 focus:outline-none focus:border-primary transition-all"
            required
          />
        </div>

        <div>
          <label className="block text-sm text-text-tertiary mb-1">方案类型</label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setType('primary')}
              className={`flex-1 px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                type === 'primary'
                  ? 'bg-primary/10 border-primary/40 text-primary'
                  : 'bg-surface-elevated border-border-default text-text-tertiary hover:bg-surface-highlight'
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
                  : 'bg-surface-elevated border-border-default text-text-tertiary hover:bg-surface-highlight'
              }`}
            >
              备选路线
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm text-text-tertiary mb-1">方案说明</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="简要说明该路线的目标与策略"
            rows={3}
            className="w-full px-4 py-2.5 rounded-xl bg-surface-elevated border border-border-default text-sm text-text-secondary placeholder-slate-500 focus:outline-none focus:border-primary transition-all resize-none"
          />
        </div>

        <div>
          <label className="block text-sm text-text-tertiary mb-1">关键要求（用逗号或换行分隔）</label>
          <textarea
            value={requirements}
            onChange={(e) => setRequirements(e.target.value)}
            placeholder="例如：AMC8 20分+, 小托福 850+"
            rows={3}
            className="w-full px-4 py-2.5 rounded-xl bg-surface-elevated border border-border-default text-sm text-text-secondary placeholder-slate-500 focus:outline-none focus:border-primary transition-all resize-none"
          />
        </div>

        <div>
          <label className="block text-sm text-text-tertiary mb-1">
            关键里程碑（每行一个，格式：时间 | 任务）
          </label>
          <textarea
            value={milestonesText}
            onChange={(e) => setMilestonesText(e.target.value)}
            placeholder={"例如：五年级上 | AMC8 二次冲刺\n五年级下 4 月 | 三公报名 + 面谈评估"}
            rows={3}
            className="w-full px-4 py-2.5 rounded-xl bg-surface-elevated border border-border-default text-sm text-text-secondary placeholder-slate-500 focus:outline-none focus:border-primary transition-all resize-none"
          />
        </div>

        <div>
          <label className="block text-sm text-text-tertiary mb-1">
            目标选项（每行一个，格式：名称 | 标签）
          </label>
          <textarea
            value={targetsText}
            onChange={(e) => setTargetsText(e.target.value)}
            placeholder={"例如：南翔中学 | 对口公办\n华曜嘉定 | 民办强校"}
            rows={3}
            className="w-full px-4 py-2.5 rounded-xl bg-surface-elevated border border-border-default text-sm text-text-secondary placeholder-slate-500 focus:outline-none focus:border-primary transition-all resize-none"
          />
        </div>

        <div>
          <label className="block text-sm text-text-tertiary mb-1">路线匹配度：{probability}%</label>
          <input
            type="range"
            min={0}
            max={100}
            value={probability}
            onChange={(e) => setProbability(Number(e.target.value))}
            className="w-full h-2 rounded-full bg-surface-highlight appearance-none cursor-pointer accent-primary"
          />
        </div>
      </form>
    </Modal>
  );
}
