'use client';

import { useMemo, useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon, type IconName } from '@/components/ui/icon';
import DataTable, { type DataTableColumn } from '@/components/ui/data-table';
import Button from '@/components/ui/button';
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
      {
        id: 'm6',
        title: '7月26日 3.2、4、8 的乘法',
        text: '7月26日 3.2、4、8 的乘法',
        done: false,
      },
      {
        id: 'm7',
        title: '7月27日 4.讲讲结算算（2）',
        text: '7月27日 4.讲讲结算算（2）',
        done: false,
      },
      { id: 'm8', title: '7月28日 5.7 的乘法', text: '7月28日 5.7 的乘法', done: false },
      {
        id: 'm9',
        title: '7月29日 6.3、6、9 的乘法',
        text: '7月29日 6.3、6、9 的乘法',
        done: false,
      },
      {
        id: 'm10',
        title: '7月30日 整理和复习本周乘法知识',
        text: '7月30日 整理和复习本周乘法知识',
        done: false,
      },
    ],
  },
  {
    id: 'mock-english-reading',
    title: '阅读任务',
    category: 'reading',
    checklist: [
      {
        id: 'm11',
        title: 'ABC Reading Lesson 12-13',
        text: 'ABC Reading Lesson 12-13',
        done: false,
      },
    ],
  },
  {
    id: 'mock-english-practice',
    title: '阅读任练',
    category: 'reading',
    checklist: [
      {
        id: 'm12',
        title: 'Oxford Discover 1 Unit 4',
        text: 'Oxford Discover 1 Unit 4',
        done: false,
      },
    ],
  },
  {
    id: 'mock-ability-training',
    title: '能力训练',
    category: 'ability',
    checklist: [
      {
        id: 'm13',
        title: '古诗文背诵积累（每日一首）',
        text: '古诗文背诵积累（每日一首）',
        done: false,
      },
      {
        id: 'm14',
        title: '口语表达练习（主题：我的夏天）',
        text: '口语表达练习（主题：我的夏天）',
        done: false,
      },
      {
        id: 'm15',
        title: '英文动画片（30分钟，原版）',
        text: '英文动画片（30分钟，原版）',
        done: false,
      },
    ],
  },
  {
    id: 'mock-other-supplement',
    title: '课外补充',
    category: 'other',
    checklist: [
      {
        id: 'm16',
        title: '科学探索：植物生长观察记录',
        text: '科学探索：植物生长观察记录',
        done: false,
      },
      { id: 'm17', title: '艺术创作：夏日主题绘画', text: '艺术创作：夏日主题绘画', done: false },
      {
        id: 'm18',
        title: '体育锻炼：跳绳（15分钟）',
        text: '体育锻炼：跳绳（15分钟）',
        done: false,
      },
      {
        id: 'm19',
        title: '家务劳动：整理书桌与书柜',
        text: '家务劳动：整理书桌与书柜',
        done: false,
      },
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

const MODULE_ICONS: Record<TaskCategory, IconName> = {
  reading: 'BookOpen',
  school: 'Lock',
  sport: 'GraduationCap',
  interest: 'GraduationCap',
  ability: 'Target',
  other: 'GraduationCap',
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
    gradient: 'linear-gradient(135deg, color-mix(in srgb, var(--color-primary) 55%, transparent) 0%, color-mix(in srgb, var(--color-primary) 18%, transparent) 100%)',
    glow: 'color-mix(in srgb, var(--color-primary) 32%, transparent)',
  },
  math: {
    name: '数学',
    shortName: '数',
    color: 'text-white',
    icon: MathIcon,
    gradient: 'linear-gradient(135deg, color-mix(in srgb, var(--info) 55%, transparent) 0%, color-mix(in srgb, var(--info) 18%, transparent) 100%)',
    glow: 'color-mix(in srgb, var(--info) 32%, transparent)',
  },
  english: {
    name: '英语',
    shortName: '英',
    color: 'text-white',
    icon: EnglishIcon,
    gradient: 'linear-gradient(135deg, color-mix(in srgb, var(--color-secondary) 55%, transparent) 0%, color-mix(in srgb, var(--color-secondary) 18%, transparent) 100%)',
    glow: 'color-mix(in srgb, var(--color-secondary) 32%, transparent)',
  },
  ability: {
    name: '能力训练',
    shortName: '能',
    color: 'text-white',
    icon: AbilityIcon,
    gradient: 'linear-gradient(135deg, color-mix(in srgb, var(--accent) 55%, transparent) 0%, color-mix(in srgb, var(--accent) 18%, transparent) 100%)',
    glow: 'color-mix(in srgb, var(--accent) 32%, transparent)',
  },
  other: {
    name: '其他',
    shortName: '其',
    color: 'text-white',
    icon: OtherIcon,
    gradient: 'linear-gradient(135deg, color-mix(in srgb, var(--warning) 55%, transparent) 0%, color-mix(in srgb, var(--warning) 18%, transparent) 100%)',
    glow: 'color-mix(in srgb, var(--warning) 32%, transparent)',
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

export default function WeeklyTaskList({ goals, tasks, weekLabel, onChange }: WeeklyTaskListProps) {
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
          taskName: goal.quantityTarget
            ? `完成 ${goal.quantityTarget}${goal.quantityUnit || '项'}`
            : '暂无明细',
          targetText: goal.quantityTarget
            ? `完成 ${goal.quantityTarget}${goal.quantityUnit || '项'}`
            : '',
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
      checklist: [{ id: generateId('check'), title: '新任务', text: '', done: false }],
    };
    const next = [...draftGoals, newGoal];
    commit(next);
  };

  const tableColumns = useMemo<DataTableColumn<TaskRow>[]>(
    () => [
      {
        key: 'subject',
        title: '学科',
        width: '140px',
        render: (row, index) => {
          const isFirst = index === 0 || rows[index - 1]?.subjectId !== row.subjectId;
          if (!isFirst) return null;
          const subjectId = row.subjectId;
          const meta = SUBJECT_META[subjectId] || SUBJECT_META.other;
          const SubjectIcon = meta.icon;
          const taskCount = rows.filter((r) => r.subjectId === subjectId && r.itemId).length;
          return (
            <div className="flex items-center gap-3">
              <div
                className={`size-10 rounded-[12px] ${meta.color} flex shrink-0 items-center justify-center`}
                style={{
                  background: meta.gradient,
                  boxShadow: `0 0 14px ${meta.glow}, inset 0 1px 0 rgba(255,255,255,0.18), inset 0 -1px 0 rgba(0,0,0,0.2)`,
                  border: '1px solid rgba(255,255,255,0.14)',
                }}
              >
                <SubjectIcon className="size-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-text-primary">{meta.name}</p>
                <p className="text-text-muted/70 text-[11px]">{taskCount}项任务</p>
              </div>
            </div>
          );
        },
      },
      {
        key: 'module',
        title: '模块',
        width: '120px',
        render: (row) => (
          <div className="flex items-center gap-2">
            <Icon
              name={MODULE_ICONS[row.category]}
              size="sm"
              className="h-[18px] w-[18px] shrink-0 text-text-muted"
            />
            {isEditing ? (
              <input
                type="text"
                value={row.moduleName}
                onChange={(e) => updateGoalTitle(row.goalId, e.target.value)}
                className="w-full rounded-md border border-border-default bg-surface-elevated px-2 py-1 text-[13px] text-text-primary focus:border-primary focus:outline-none"
              />
            ) : (
              <span className="truncate text-[13px] text-text-tertiary">{row.moduleName}</span>
            )}
            {isEditing && (
              <>
                <Button
                  variant="ghost"
                  size="xs"
                  onClick={() => addItem(row.goalId)}
                  title="添加任务"
                >
                  <Icon name="Plus" size="xs" />
                </Button>
                <Button
                  variant="ghost"
                  size="xs"
                  onClick={() => deleteGoal(row.goalId)}
                  title="删除模块"
                >
                  <Icon name="Trash2" size="xs" />
                </Button>
              </>
            )}
          </div>
        ),
      },
      {
        key: 'task',
        title: '本周任务',
        render: (row) => {
          if (isEditing && !row.itemId) {
            return <span className="text-xs text-text-muted">点击 + 添加任务</span>;
          }
          if (isEditing) {
            return (
              <input
                type="text"
                value={row.taskName}
                onChange={(e) => updateItem(row.goalId, row.itemId, { title: e.target.value })}
                className="w-full rounded-md border border-border-default bg-surface-elevated px-2 py-1 text-[13px] text-text-primary focus:border-primary focus:outline-none"
              />
            );
          }
          return (
            <span
              className={`block truncate text-sm ${
                row.done ? 'text-text-muted line-through' : 'text-text-primary'
              }`}
            >
              {row.taskName}
            </span>
          );
        },
      },
      {
        key: 'target',
        title: '检验标准',
        render: (row) => {
          if (isEditing && !row.itemId) {
            return <span className="text-xs text-text-muted">—</span>;
          }
          if (isEditing) {
            return (
              <input
                type="text"
                value={row.targetText}
                onChange={(e) => updateItem(row.goalId, row.itemId, { text: e.target.value })}
                placeholder="填写检验标准"
                className="w-full rounded-md border border-border-default bg-surface-elevated px-2 py-1 text-[13px] text-text-primary placeholder:text-text-tertiary focus:border-primary focus:outline-none"
              />
            );
          }
          return (
            <span
              className={`block truncate text-sm ${
                row.done ? 'text-text-muted line-through' : 'text-text-primary'
              }`}
            >
              {row.targetText || <span className="text-text-muted/50">—</span>}
            </span>
          );
        },
      },
      {
        key: 'status',
        title: '状态',
        width: '72px',
        align: 'center',
        render: (row) => (
          <div className="flex items-center justify-center gap-2">
            {row.itemId && (
              <Button
                variant="ghost"
                size="xs"
                onClick={() => toggleItem(row.goalId, row.itemId)}
                className="!min-h-0 !h-4 !w-4 !rounded-[3px] !border !border-text-disabled/60 !p-0"
              >
                {row.done && <Icon name="Check" size="xs" className="text-text-tertiary" />}
              </Button>
            )}
            {isEditing && row.itemId && (
              <Button
                variant="ghost"
                size="xs"
                onClick={() => deleteItem(row.goalId, row.itemId)}
                title="删除任务"
              >
                <Icon name="Trash2" size="xs" />
              </Button>
            )}
          </div>
        ),
      },
    ],
    [rows, isEditing, toggleItem, updateItem, deleteItem, addItem, updateGoalTitle, deleteGoal]
  );

  if (draftGoals.length === 0 && !isEditing) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-[20px] border border-border-subtle bg-background px-5 py-4 shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
      >
        <div className="flex items-center justify-between">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <div className="bg-primary/10 border-primary/20 flex size-8 shrink-0 items-center justify-center rounded-[10px] border">
              <Icon name="CalendarDays" size="sm" className="text-primary" />
            </div>
            <div className="min-w-0">
              <h3 className="text-base font-bold text-text-primary">本周任务清单</h3>
              <p className="text-text-tertiary/80 mt-0.5 text-xs">
                明确每周要完成的具体任务，按计划稳步推进
              </p>
            </div>
          </div>
          <Button variant="primary" size="sm" onClick={() => addGoal('chinese')}>
            <Icon name="Plus" size="xs" />
            添加任务
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="overflow-hidden rounded-[20px] border border-border-subtle bg-background shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
    >
      {/* Header */}
      <div className="group flex items-center justify-between border-b border-border-subtle px-5 py-4">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <div className="bg-primary/10 border-primary/20 flex size-8 shrink-0 items-center justify-center rounded-[10px] border">
            <Icon name="CalendarDays" size="sm" className="text-primary" />
          </div>
          <div className="min-w-0">
            <h3 className="text-base font-bold text-text-primary">本周任务清单</h3>
            <p className="text-text-tertiary/80 mt-0.5 text-xs">
              明确每周要完成的具体任务，按计划稳步推进
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-text-muted/80 hidden items-center gap-2 rounded-lg px-3 py-1.5 text-xs sm:flex">
            <Icon name="CalendarDays" size="xs" className="text-text-muted/60" />
            <span>本周：{weekLabel}</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing((v) => !v)}
            className={isEditing ? 'text-success' : 'text-text-muted/60'}
            title={isEditing ? '完成' : '编辑'}
          >
            {isEditing ? <Icon name="Check" size="sm" /> : <Icon name="Pencil" size="sm" />}
          </Button>
        </div>
      </div>

      {/* Table */}
      <DataTable<TaskRow>
        columns={tableColumns}
        data={rows}
        rowKey="id"
        className="border-0 shadow-none bg-transparent"
      />

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
              <span className="text-text-muted/70 text-xs">添加模块到：</span>
              {SUBJECT_ORDER.map((sid) => {
                const meta = SUBJECT_META[sid];
                return (
                  <Button
                    key={sid}
                    variant="secondary"
                    size="xs"
                    onClick={() => addGoal(sid)}
                  >
                    <Icon name="Plus" size="xs" />
                    {meta.name}
                  </Button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}


