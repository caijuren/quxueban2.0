'use client';

import { useMemo, useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Plus, Trash2, Pencil, CalendarDays, BookOpen, Lock, Target, GraduationCap, type LucideIcon } from 'lucide-react';
import {
  type WeeklyGoal,
  type WeeklyGoalChecklistItem,
  type WeeklyTaskItem,
  type TaskCategory,
} from '@/lib/storage.types';


interface TaskRow {
  id: string;
  goalId: string;
  itemId: string;
  subjectId: string;
  category: TaskCategory;
  moduleName: string;
  taskName: string;
  targetText: string;
  done: boolean;
}

interface WeeklyTaskListProps {
  goals: WeeklyGoal[];
  tasks: WeeklyTaskItem[];
  weekLabel: string;
  onChange: (goals: WeeklyGoal[]) => void;
}

const MOCK_GOALS: WeeklyGoal[] = [
  {
    id: 'mock-chinese-reading',
    title: '自主阅读',
    category: 'reading',
    checklist: [
      { id: 'm1', title: '爱闯祸的竹蜻蜓', text: '爱闯祸的竹蜻蜓', done: false },
      { id: 'm2', title: '宝葫芦的秘密', text: '宝葫芦的秘密', done: false },
      { id: 'm3', title: '彼得兔经典故事全集', text: '彼得兔经典故事全集', done: false },
      { id: 'm4', title: '彼得兔奇遇记', text: '彼得兔奇遇记', done: false },
      { id: 'm5', title: '乌鸦办葬礼', text: '乌鸦办葬礼', done: false },
    ],
  },
  {
    id: 'mock-math-school',
    title: '二上数学',
    category: 'school',
    checklist: [
      { id: 'm6', title: '7月26日 3.2、4、8 的乘法', text: '7月26日 3.2、4、8 的乘法', done: false },
      { id: 'm7', title: '7月27日 4.讲讲结算算（2）', text: '7月27日 4.讲讲结算算（2）', done: false },
      { id: 'm8', title: '7月28日 5.7 的乘法', text: '7月28日 5.7 的乘法', done: false },
      { id: 'm9', title: '7月29日 6.3、6、9 的乘法', text: '7月29日 6.3、6、9 的乘法', done: false },
      { id: 'm10', title: '7月30日 整理和复习本周乘法知识', text: '7月30日 整理和复习本周乘法知识', done: false },
    ],
  },
  {
    id: 'mock-english-reading',
    title: '阅读任务',
    category: 'reading',
    checklist: [
      { id: 'm11', title: 'ABC Reading Lesson 12-13', text: 'ABC Reading Lesson 12-13', done: false },
    ],
  },
  {
    id: 'mock-english-practice',
    title: '阅读任练',
    category: 'reading',
    checklist: [
      { id: 'm12', title: 'Oxford Discover 1 Unit 4', text: 'Oxford Discover 1 Unit 4', done: false },
    ],
  },
  {
    id: 'mock-ability-training',
    title: '能力训练',
    category: 'ability',
    checklist: [
      { id: 'm13', title: '古诗文背诵积累（每日一首）', text: '古诗文背诵积累（每日一首）', done: false },
      { id: 'm14', title: '口语表达练习（主题：我的夏天）', text: '口语表达练习（主题：我的夏天）', done: false },
      { id: 'm15', title: '英文动画片（30分钟，原版）', text: '英文动画片（30分钟，原版）', done: false },
    ],
  },
  {
    id: 'mock-other-supplement',
    title: '课外补充',
    category: 'other',
    checklist: [
      { id: 'm16', title: '科学探索：植物生长观察记录', text: '科学探索：植物生长观察记录', done: false },
      { id: 'm17', title: '艺术创作：夏日主题绘画', text: '艺术创作：夏日主题绘画', done: false },
      { id: 'm18', title: '体育锻炼：跳绳（15分钟）', text: '体育锻炼：跳绳（15分钟）', done: false },
      { id: 'm19', title: '家务劳动：整理书桌与书柜', text: '家务劳动：整理书桌与书柜', done: false },
    ],
  },
];

const MOCK_TASKS: WeeklyTaskItem[] = [
  {
    id: 'mock-task-en-1',
    category: 'reading',
    subjectId: 'english',
    source: 'manual',
    day: '周一',
    focus: 'ABC Reading Lesson 12-13',
    duration: '20分钟',
    materials: [],
    status: 'pending',
    goalId: 'mock-english-reading',
  },
  {
    id: 'mock-task-en-2',
    category: 'reading',
    subjectId: 'english',
    source: 'manual',
    day: '周二',
    focus: 'Oxford Discover 1 Unit 4',
    duration: '20分钟',
    materials: [],
    status: 'pending',
    goalId: 'mock-english-practice',
  },
];

const SUBJECT_ORDER = ['chinese', 'math', 'english', 'ability', 'other'];

const CATEGORY_TO_SUBJECT: Record<TaskCategory, string> = {
  reading: 'chinese',
  school: 'math',
  sport: 'other',
  interest: 'other',
  ability: 'ability',
  other: 'other',
};

const MODULE_ICONS: Record<TaskCategory, LucideIcon> = {
  reading: BookOpen,
  school: Lock,
  sport: GraduationCap,
  interest: GraduationCap,
  ability: Target,
  other: GraduationCap,
};

function getSubjectIdForGoal(goal: WeeklyGoal, tasks: WeeklyTaskItem[]): string {
  const linked = tasks.filter((t) => t.goalId === goal.id);
  const counts: Record<string, number> = {};
  linked.forEach((t) => {
    if (t.subjectId) {
      counts[t.subjectId] = (counts[t.subjectId] || 0) + 1;
    }
  });
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  if (sorted.length > 0) return sorted[0][0];
  return CATEGORY_TO_SUBJECT[goal.category] || 'other';
}

const SUBJECT_META: Record<
  string,
  {
    name: string;
    shortName: string;
    color: string;
    icon: React.FC<{ className?: string }>;
    gradient: string;
    glow: string;
  }
> = {
  chinese: {
    name: '语文',
    shortName: '语',
    color: 'text-white',
    icon: ChineseIcon,
    gradient: 'linear-gradient(135deg, rgba(244,63,122,0.55) 0%, rgba(244,63,122,0.18) 100%)',
    glow: 'rgba(244,63,122,0.32)',
  },
  math: {
    name: '数学',
    shortName: '数',
    color: 'text-white',
    icon: MathIcon,
    gradient: 'linear-gradient(135deg, rgba(59,130,246,0.55) 0%, rgba(59,130,246,0.18) 100%)',
    glow: 'rgba(59,130,246,0.32)',
  },
  english: {
    name: '英语',
    shortName: '英',
    color: 'text-white',
    icon: EnglishIcon,
    gradient: 'linear-gradient(135deg, rgba(139,92,246,0.55) 0%, rgba(139,92,246,0.18) 100%)',
    glow: 'rgba(139,92,246,0.32)',
  },
  ability: {
    name: '能力训练',
    shortName: '能',
    color: 'text-white',
    icon: AbilityIcon,
    gradient: 'linear-gradient(135deg, rgba(34,211,238,0.55) 0%, rgba(34,211,238,0.18) 100%)',
    glow: 'rgba(34,211,238,0.32)',
  },
  other: {
    name: '其他',
    shortName: '其',
    color: 'text-white',
    icon: OtherIcon,
    gradient: 'linear-gradient(135deg, rgba(245,158,11,0.55) 0%, rgba(245,158,11,0.18) 100%)',
    glow: 'rgba(245,158,11,0.32)',
  },
};

function ChineseIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <text x="6" y="17" fontSize="13" fontWeight="600" fill="currentColor" stroke="none">
        Aa
      </text>
    </svg>
  );
}

function MathIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function EnglishIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  );
}

function AbilityIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

function OtherIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect x="4" y="4" width="6" height="6" rx="1.5" />
      <rect x="14" y="4" width="6" height="6" rx="1.5" />
      <rect x="4" y="14" width="6" height="6" rx="1.5" />
      <rect x="14" y="14" width="6" height="6" rx="1.5" />
    </svg>
  );
}

function generateId(prefix = 'id') {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export default function WeeklyTaskList({
  goals,
  tasks,
  weekLabel,
  onChange,
}: WeeklyTaskListProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draftGoals, setDraftGoals] = useState<WeeklyGoal[]>(goals);

  const isMock = goals.length === 0;
  const baseGoals = isMock ? MOCK_GOALS : goals;
  const baseTasks = isMock ? MOCK_TASKS : tasks;

  useEffect(() => {
    if (!isEditing) {
      setDraftGoals(baseGoals);
    }
  }, [baseGoals, isEditing]);

  const commit = useCallback(
    (next: WeeklyGoal[]) => {
      setDraftGoals(next);
      onChange(next);
    },
    [onChange]
  );

  const rows = useMemo<TaskRow[]>(() => {
    const result: TaskRow[] = [];
    draftGoals.forEach((goal) => {
      const subjectId = getSubjectIdForGoal(goal, baseTasks);
      const checklist = goal.checklist || [];
      if (checklist.length === 0) {
        result.push({
          id: `${goal.id}-empty`,
          goalId: goal.id,
          itemId: '',
          subjectId,
          category: goal.category,
          moduleName: goal.title,
          taskName: goal.quantityTarget ? `完成 ${goal.quantityTarget}${goal.quantityUnit || '项'}` : '暂无明细',
          targetText: goal.quantityTarget ? `完成 ${goal.quantityTarget}${goal.quantityUnit || '项'}` : '',
          done: false,
        });
        return;
      }
      checklist.forEach((item) => {
        result.push({
          id: `${goal.id}-${item.id}`,
          goalId: goal.id,
          itemId: item.id,
          subjectId,
          category: goal.category,
          moduleName: goal.title,
          taskName: item.title || item.text || '未命名任务',
          targetText: item.title ? item.text || '' : '',
          done: item.done,
        });
      });
    });

    return result.sort((a, b) => {
      const subjectDiff =
        (SUBJECT_ORDER.indexOf(a.subjectId) ?? 9) - (SUBJECT_ORDER.indexOf(b.subjectId) ?? 9);
      if (subjectDiff !== 0) return subjectDiff;
      if (a.moduleName !== b.moduleName) return a.moduleName.localeCompare(b.moduleName);
      return a.taskName.localeCompare(b.taskName);
    });
  }, [draftGoals, baseTasks]);

  const grouped = useMemo(() => {
    const map = new Map<string, TaskRow[]>();
    rows.forEach((row) => {
      if (!map.has(row.subjectId)) map.set(row.subjectId, []);
      map.get(row.subjectId)!.push(row);
    });
    return Array.from(map.entries()).sort(
      (a, b) => (SUBJECT_ORDER.indexOf(a[0]) ?? 9) - (SUBJECT_ORDER.indexOf(b[0]) ?? 9)
    );
  }, [rows]);

  const toggleItem = (goalId: string, itemId: string) => {
    const next = draftGoals.map((g) => {
      if (g.id !== goalId) return g;
      return {
        ...g,
        checklist: (g.checklist || []).map((item) =>
          item.id === itemId ? { ...item, done: !item.done } : item
        ),
      };
    });
    commit(next);
  };

  const updateItem = (goalId: string, itemId: string, patch: Partial<WeeklyGoalChecklistItem>) => {
    const next = draftGoals.map((g) => {
      if (g.id !== goalId) return g;
      return {
        ...g,
        checklist: (g.checklist || []).map((item) =>
          item.id === itemId ? { ...item, ...patch } : item
        ),
      };
    });
    commit(next);
  };

  const deleteItem = (goalId: string, itemId: string) => {
    const next = draftGoals.map((g) => {
      if (g.id !== goalId) return g;
      return {
        ...g,
        checklist: (g.checklist || []).filter((item) => item.id !== itemId),
      };
    });
    commit(next);
  };

  const addItem = (goalId: string) => {
    const next = draftGoals.map((g) => {
      if (g.id !== goalId) return g;
      const newItem: WeeklyGoalChecklistItem = {
        id: generateId('check'),
        title: '新任务',
        text: '',
        done: false,
      };
      return { ...g, checklist: [...(g.checklist || []), newItem] };
    });
    commit(next);
  };

  const updateGoalTitle = (goalId: string, title: string) => {
    const next = draftGoals.map((g) => (g.id === goalId ? { ...g, title } : g));
    commit(next);
  };

  const deleteGoal = (goalId: string) => {
    const next = draftGoals.filter((g) => g.id !== goalId);
    commit(next);
  };

  const addGoal = (subjectId: string) => {
    const category: TaskCategory =
      subjectId === 'chinese'
        ? 'reading'
        : subjectId === 'math'
        ? 'school'
        : subjectId === 'english'
        ? 'reading'
        : subjectId === 'ability'
        ? 'ability'
        : 'other';

    const newGoal: WeeklyGoal = {
      id: generateId('goal'),
      title: '新模块',
      category,
      checklist: [
        { id: generateId('check'), title: '新任务', text: '', done: false },
      ],
    };
    const next = [...draftGoals, newGoal];
    commit(next);
  };


  if (draftGoals.length === 0 && !isEditing) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-[20px] bg-background border border-border-subtle shadow-[0_8px_32px_rgba(0,0,0,0.4)] px-5 py-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-8 h-8 rounded-[10px] bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
              <CalendarDays className="w-4 h-4 text-primary" />
            </div>
            <div className="min-w-0">
              <h3 className="text-base font-bold text-text-primary">本周任务清单</h3>
              <p className="text-xs text-text-tertiary/80 mt-0.5">明确每周要完成的具体任务，按计划稳步推进</p>
            </div>
          </div>
          <button
            onClick={() => addGoal('chinese')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/90 text-white text-xs font-medium hover:bg-primary transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            添加任务
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-[20px] bg-background border border-border-subtle shadow-[0_8px_32px_rgba(0,0,0,0.4)] overflow-hidden"
    >
      {/* Header */}
      <div className="group flex items-center justify-between px-5 py-4 border-b border-border-subtle">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-8 h-8 rounded-[10px] bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
            <CalendarDays className="w-4 h-4 text-primary" />
          </div>
          <div className="min-w-0">
            <h3 className="text-base font-bold text-text-primary">本周任务清单</h3>
            <p className="text-xs text-text-tertiary/80 mt-0.5">
              明确每周要完成的具体任务，按计划稳步推进
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-text-muted/80">
            <CalendarDays className="w-3.5 h-3.5 text-text-muted/60" />
            <span>本周：{weekLabel}</span>
          </div>
          <button
            onClick={() => setIsEditing((v) => !v)}
            className={`inline-flex items-center justify-center w-8 h-8 rounded-lg transition-colors ${
              isEditing
                ? 'text-success hover:bg-success/10'
                : 'text-text-muted/60 hover:text-text-muted opacity-100 sm:opacity-0 sm:group-hover:opacity-100'
            }`}
            title={isEditing ? '完成' : '编辑'}
          >
            {isEditing ? <Check className="w-4 h-4" /> : <Pencil className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[820px] table-fixed border-collapse">
          <thead>
            <tr className="border-b border-border-subtle">
              <th className="text-left py-7 px-4 text-[13px] font-medium text-text-muted/80 whitespace-nowrap w-[140px]">
                学科
              </th>
              <th className="text-left py-7 px-4 text-[13px] font-medium text-text-muted/80 whitespace-nowrap w-[120px]">
                模块
              </th>
              <th className="text-left py-7 px-4 text-[13px] font-medium text-text-muted/80 whitespace-nowrap w-[28%]">
                本周任务
              </th>
              <th className="text-left py-7 px-4 text-[13px] font-medium text-text-muted/80 whitespace-nowrap w-[36%]">
                检验标准
              </th>
              <th className="text-center py-7 px-4 text-[13px] font-medium text-text-muted/80 whitespace-nowrap w-[72px]">
                状态
              </th>
            </tr>
          </thead>
          <tbody>
            {grouped.map(([subjectId, subjectRows]) => {
              const meta = SUBJECT_META[subjectId] || SUBJECT_META.other;
              const taskCount = subjectRows.filter((r) => r.itemId).length;

              return (
                <SubjectGroup
                  key={subjectId}
                  subjectId={subjectId}
                  meta={meta}
                  rows={subjectRows}
                  taskCount={taskCount}
                  isEditing={isEditing}
                  onToggle={toggleItem}
                  onUpdateItem={updateItem}
                  onDeleteItem={deleteItem}
                  onAddItem={addItem}
                  onUpdateGoalTitle={updateGoalTitle}
                  onDeleteGoal={deleteGoal}
                />
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Edit footer */}
      <AnimatePresence>
        {isEditing && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-border-subtle bg-white/[0.02]"
          >
            <div className="flex flex-wrap items-center gap-3 px-5 py-3">
              <span className="text-xs text-text-muted/70">添加模块到：</span>
              {SUBJECT_ORDER.map((sid) => {
                const meta = SUBJECT_META[sid];
                return (
                  <button
                    key={sid}
                    onClick={() => addGoal(sid)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-surface-hover border border-border-default text-xs text-text-muted hover:text-text-primary hover:bg-surface-hover transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                    {meta.name}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}

interface SubjectGroupProps {
  subjectId: string;
  meta: (typeof SUBJECT_META)[string];
  rows: TaskRow[];
  taskCount: number;
  isEditing: boolean;
  onToggle: (goalId: string, itemId: string) => void;
  onUpdateItem: (goalId: string, itemId: string, patch: Partial<WeeklyGoalChecklistItem>) => void;
  onDeleteItem: (goalId: string, itemId: string) => void;
  onAddItem: (goalId: string) => void;
  onUpdateGoalTitle: (goalId: string, title: string) => void;
  onDeleteGoal: (goalId: string) => void;
}

function SubjectGroup({
  subjectId,
  meta,
  rows,
  taskCount,
  isEditing,
  onToggle,
  onUpdateItem,
  onDeleteItem,
  onAddItem,
  onUpdateGoalTitle,
  onDeleteGoal,
}: SubjectGroupProps) {
  const SubjectIcon = meta.icon;

  return (
    <>
      {rows.map((row, index) => {
        const isFirst = index === 0;
        const isLast = index === rows.length - 1;
        const ModuleIcon = MODULE_ICONS[row.category];
        const rowDivider = isLast ? 'shadow-[inset_0_-1px_0_rgba(255,255,255,0.06)]' : '';

        return (
          <tr key={row.id} className="h-12">
            {/* Subject cell */}
            <td className={`px-4 align-middle w-[140px] h-12 ${rowDivider}`}>
              {isFirst && (
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-[12px] ${meta.color} flex items-center justify-center shrink-0`}
                    style={{
                      background: meta.gradient,
                      boxShadow: `0 0 14px ${meta.glow}, inset 0 1px 0 rgba(255,255,255,0.18), inset 0 -1px 0 rgba(0,0,0,0.2)`,
                      border: `1px solid rgba(255,255,255,0.14)`,
                    }}
                  >
                    <SubjectIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#e2e8f0]">{meta.name}</p>
                    <p className="text-[11px] text-text-muted/70">{taskCount}项任务</p>
                  </div>
                </div>
              )}
            </td>

            {/* Module cell */}
            <td className={`px-4 align-middle w-[120px] h-12 ${rowDivider}`}>
              <div className="flex items-center gap-2">
                <ModuleIcon className="w-[18px] h-[18px] text-[#64748b] shrink-0" strokeWidth={1.5} />
                {isEditing ? (
                  <input
                    type="text"
                    value={row.moduleName}
                    onChange={(e) => onUpdateGoalTitle(row.goalId, e.target.value)}
                    className="w-full text-[13px] rounded-md border border-border-default bg-surface-elevated px-2 py-1 text-[#e2e8f0] focus:outline-none focus:border-primary"
                  />
                ) : (
                  <span className="text-[13px] text-[#a0aec0] whitespace-nowrap overflow-hidden text-ellipsis">{row.moduleName}</span>
                )}
                {isEditing && (
                  <>
                    <button
                      onClick={() => onAddItem(row.goalId)}
                      className="p-1 rounded-md hover:bg-primary/10 text-text-muted hover:text-primary transition-colors"
                      title="添加任务"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => onDeleteGoal(row.goalId)}
                      className="p-1 rounded-md hover:bg-error/10 text-text-muted hover:text-error transition-colors"
                      title="删除模块"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </>
                )}
              </div>
            </td>

            {/* Task cell */}
            <td className={`px-4 align-middle h-12 ${rowDivider}`}>
              {isEditing && !row.itemId ? (
                <span className="text-xs text-text-muted">点击 + 添加任务</span>
              ) : isEditing ? (
                <input
                  type="text"
                  value={row.taskName}
                  onChange={(e) =>
                    onUpdateItem(row.goalId, row.itemId, { title: e.target.value })
                  }
                  className="w-full text-[13px] rounded-md border border-border-default bg-surface-elevated px-2 py-1 text-[#e2e8f0] focus:outline-none focus:border-primary"
                />
              ) : (
                <span
                  className={`text-sm block whitespace-nowrap overflow-hidden text-ellipsis ${
                    row.done ? 'text-text-muted line-through' : 'text-[#e2e8f0]'
                  }`}
                >
                  {row.taskName}
                </span>
              )}
            </td>

            {/* Check standard cell */}
            <td className={`px-4 align-middle h-12 ${rowDivider}`}>
              {isEditing && !row.itemId ? (
                <span className="text-xs text-text-muted">—</span>
              ) : isEditing ? (
                <input
                  type="text"
                  value={row.targetText}
                  onChange={(e) =>
                    onUpdateItem(row.goalId, row.itemId, { text: e.target.value })
                  }
                  placeholder="填写检验标准"
                  className="w-full text-[13px] rounded-md border border-border-default bg-surface-elevated px-2 py-1 text-[#e2e8f0] placeholder:text-text-tertiary focus:outline-none focus:border-primary"
                />
              ) : (
                <span
                  className={`text-sm block whitespace-nowrap overflow-hidden text-ellipsis ${
                    row.done ? 'text-text-muted line-through' : 'text-[#e2e8f0]'
                  }`}
                >
                  {row.targetText || <span className="text-text-muted/50">—</span>}
                </span>
              )}
            </td>

            {/* Status cell */}
            <td className={`px-4 align-middle text-center w-[72px] h-12 ${rowDivider}`}>
              <div className="flex items-center justify-center gap-2">
                {row.itemId && (
                  <button
                    type="button"
                    onClick={() => onToggle(row.goalId, row.itemId)}
                    className="w-4 h-4 rounded-[3px] border border-[#475569]/60 flex items-center justify-center transition-colors hover:border-[#64748b]"
                  >
                    {row.done && <Check className="w-3 h-3 text-[#94a3b8]" strokeWidth={2.5} />}
                  </button>
                )}
                {isEditing && row.itemId && (
                  <button
                    onClick={() => onDeleteItem(row.goalId, row.itemId)}
                    className="p-1 rounded-md hover:bg-error/10 text-text-muted hover:text-error transition-colors"
                    title="删除任务"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </td>
          </tr>
        );
      })}

    </>
  );
}
