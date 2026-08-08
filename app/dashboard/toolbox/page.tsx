'use client';
import { Icon, type IconName } from '@/components/ui/icon';

import { motion, useReducedMotion } from 'framer-motion';

import Link from 'next/link';
import CommandCard from '@/components/ui/CommandCard';

interface ToolItem {
  id: string;
  name: string;
  description: string;
  href: string;
  icon: IconName;
  tags: string[];
  status: 'active' | 'coming';
  color: 'primary' | 'secondary' | 'accent' | 'warning';
}

interface ToolGroup {
  id: string;
  title: string;
  items: ToolItem[];
}

const toolGroups: ToolGroup[] = [
  {
    id: 'resources',
    title: '学习资源',
    items: [
      {
        id: 'teaching-aids',
        name: '教辅资料',
        description: '按学科、年级、能力分层整理的优质教辅推荐与使用指南',
        href: '/dashboard/toolbox/teaching-aids',
        icon: 'BookOpen',
        tags: ['数学', '英语', '语文'],
        status: 'active',
        color: 'primary',
      },
      {
        id: 'reading-list',
        name: '阅读书单',
        description: '名校推荐、分年级阅读能力提升书单与蓝思值参考',
        href: '/dashboard/toolbox/reading-list',
        icon: 'FileText',
        tags: ['语文', '英语'],
        status: 'active',
        color: 'secondary',
      },
    ],
  },
  {
    id: 'subjects',
    title: '学科规划',
    items: [
      {
        id: 'english-subject',
        name: '英语学科',
        description: '英语能力地图、考试规划、原版阅读与听说写训练路径',
        href: '/dashboard/subjects/english',
        icon: 'Languages',
        tags: ['能力地图', '标化'],
        status: 'active',
        color: 'secondary',
      },
      {
        id: 'math-subject',
        name: '数学学科',
        description: '数学思维培养、竞赛路线、奥数年轮与阶段性诊断',
        href: '/dashboard/subjects/math',
        icon: 'Calculator',
        tags: ['奥数', '竞赛'],
        status: 'active',
        color: 'accent',
      },
      {
        id: 'chinese-subject',
        name: '语文学科',
        description: '语文素养积累、阅读写作、古诗文与考试能力规划',
        href: '/dashboard/subjects/chinese',
        icon: 'GraduationCap',
        tags: ['阅读', '写作'],
        status: 'active',
        color: 'primary',
      },
    ],
  },
  {
    id: 'query',
    title: '信息查询',
    items: [
      {
        id: 'schools',
        name: '学校库',
        description: '三公、民办、市重点、区重点等学校招生信息与录取要求',
        href: '/dashboard/schools',
        icon: 'School',
        tags: ['小升初', '中考'],
        status: 'active',
        color: 'accent',
      },
      {
        id: 'exams',
        name: '标化考试',
        description: 'AMC8、TOEFL Junior、PET 等考试日历与备考路线图',
        href: '/dashboard/toolbox/exam-calendar',
        icon: 'Award',
        tags: ['竞赛', '英语'],
        status: 'active',
        color: 'warning',
      },
    ],
  },
  {
    id: 'planning',
    title: '规划工具',
    items: [
      {
        id: 'plan',
        name: '路线方案',
        description: '三公、公办对口、中考等升学路线的方案管理与关键节点',
        href: '/dashboard/plan',
        icon: 'Route',
        tags: ['小升初', '中考'],
        status: 'active',
        color: 'primary',
      },
      {
        id: 'timeline',
        name: '升学时间线',
        description: '按当前年级自动生成的关键节点、报名截止与备考节奏',
        href: '/dashboard/milestones',
        icon: 'CalendarClock',
        tags: ['全局', '提醒'],
        status: 'active',
        color: 'secondary',
      },
      {
        id: 'quota-calculator',
        name: '名额到校计算器',
        description: '根据学籍、户籍与连续就读年限判断是否具备名额分配资格',
        href: '/dashboard/toolbox/admission-calculator',
        icon: 'Calculator',
        tags: ['中考', '资格'],
        status: 'active',
        color: 'primary',
      },
      {
        id: 'ability-map',
        name: '能力地图',
        description: '可视化对比当前能力与目标学校录取要求之间的差距',
        href: '/dashboard/toolbox/ability-map',
        icon: 'Map',
        tags: ['诊断', '定位'],
        status: 'coming',
        color: 'accent',
      },
    ],
  },
];

const colorConfig = {
  primary: {
    bg: 'bg-primary/[0.08]',
    border: 'border-primary/15',
    text: 'text-primary',
  },
  secondary: {
    bg: 'bg-secondary/[0.08]',
    border: 'border-secondary/15',
    text: 'text-secondary',
  },
  accent: {
    bg: 'bg-accent/[0.08]',
    border: 'border-accent/15',
    text: 'text-accent',
  },
  warning: {
    bg: 'bg-warning/[0.08]',
    border: 'border-warning/15',
    text: 'text-warning',
  },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function ToolboxPage() {
  const shouldReduceMotion = useReducedMotion();

  const activeTools = toolGroups.flatMap((g) => g.items).filter((t) => t.status === 'active');
  const comingTools = toolGroups.flatMap((g) => g.items).filter((t) => t.status === 'coming');

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="bg-secondary/10 border-secondary/20 flex size-10 items-center justify-center rounded-xl border">
            <Icon name="Wrench" size="md" className="text-secondary" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold sm:text-3xl">规划工具</h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 rounded-xl border border-border-default bg-surface px-3 py-1.5 text-xs text-text-tertiary">
            <Icon name="Sparkles" size="xs" className="text-secondary" />
            <span>按升学阶段智能推荐工具</span>
          </div>
        </div>
      </motion.div>

      {/* Quick access */}
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="relative overflow-hidden rounded-2xl border border-border-default bg-surface-elevated p-5 sm:p-6"
      >
        <div className="bg-primary/5 pointer-events-none absolute right-0 top-0 size-64 -translate-y-1/2 translate-x-1/3 rounded-full blur-3xl" />
        <div className="relative">
          <div className="mb-4 flex items-center gap-2">
            <Icon name="Clock" size="sm" className="text-primary" />
            <h2 className="font-display text-base font-bold">常用工具</h2>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {activeTools.slice(0, 5).map((tool) => {
              const colors = colorConfig[tool.color];
              return (
                <Link
                  key={tool.id}
                  href={tool.href}
                  className={`group flex flex-col items-center gap-2 rounded-xl p-4 ${colors.bg} border ${colors.border} transition-all duration-200`}
                >
                  <Icon name={tool.icon} size="md" className={`size-6 ${colors.text}`} />
                  <span className="text-sm font-medium text-text-secondary transition-colors group-hover:text-text-primary">
                    {tool.name}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Tool groups */}
      <motion.div
        variants={containerVariants}
        initial={shouldReduceMotion ? false : 'hidden'}
        animate="visible"
        className="space-y-8"
      >
        {toolGroups.map((group) => (
          <motion.section key={group.id} variants={itemVariants}>
            <div className="mb-4 flex items-center gap-2">
              <div className="h-4 w-1 rounded-full bg-primary" />
              <h2 className="font-display text-base font-bold text-text-secondary">
                {group.title}
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {group.items.map((tool) => {
                const colors = colorConfig[tool.color];
                const isComing = tool.status === 'coming';

                return (
                  <Link
                    key={tool.id}
                    href={isComing ? '#' : tool.href}
                    aria-disabled={isComing}
                    onClick={(e) => {
                      if (isComing) e.preventDefault();
                    }}
                    className="group block"
                  >
                    <CommandCard
                      hover={!isComing}
                      className={`h-full p-5 ${isComing ? 'cursor-not-allowed opacity-60' : ''}`}
                    >
                      <div className="mb-4 flex items-start justify-between">
                        <div
                          className={`size-11 rounded-xl ${colors.bg} border ${colors.border} flex shrink-0 items-center justify-center`}
                        >
                          <Icon name={tool.icon} size="md" className={`size-5 ${colors.text}`} />
                        </div>
                        {isComing ? (
                          <span className="rounded-full border border-border-default bg-surface-elevated px-2 py-1 text-2xs text-text-muted">
                            即将上线
                          </span>
                        ) : (
                          <div className="flex size-7 items-center justify-center rounded-lg border border-border-default bg-surface text-text-muted transition-colors group-hover:border-border-strong group-hover:text-text-primary">
                            <Icon name="ArrowRight" size="xs" />
                          </div>
                        )}
                      </div>

                      <h3 className="mb-1.5 font-display text-base font-bold transition-colors group-hover:text-text-primary">
                        {tool.name}
                      </h3>
                      <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-text-tertiary">
                        {tool.description}
                      </p>

                      <div className="flex flex-wrap gap-1.5">
                        {tool.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-md border border-border-subtle bg-surface-elevated px-1.5 py-0.5 text-2xs text-text-muted"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </CommandCard>
                  </Link>
                );
              })}
            </div>
          </motion.section>
        ))}
      </motion.div>

      {/* Feedback hint */}
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="rounded-xl border border-dashed border-border-default bg-surface-elevated p-4 text-center"
      >
        <p className="text-sm text-text-muted">
          还需要什么工具？在
          <Link
            href="/dashboard/settings"
            className="mx-1 text-primary transition-colors hover:text-primary-glow"
          >
            系统设置
          </Link>
          中告诉我们。
        </p>
      </motion.div>
    </div>
  );
}
