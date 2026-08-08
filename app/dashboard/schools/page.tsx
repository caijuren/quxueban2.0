'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { School, MapPin, Trophy, Plus, Search } from 'lucide-react';
import { Suspense, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import EmptyState from '@/components/ui/EmptyState';
import ChildEmptyState from '@/components/dashboard/ChildEmptyState';
import { useChildren } from '@/components/dashboard/ChildrenContext';
import { gradeLabel, gradeToStage } from '@/lib/children';
import { schoolsData } from './[school]/SchoolDetail';
import Modal from '@/components/ui/Modal';

const levelConfig: Record<
  string,
  { color: string; bg: string; border: string; probability: number }
> = {
  冲刺: {
    color: 'text-primary',
    bg: 'bg-primary/10',
    border: 'border-primary/30',
    probability: 35,
  },
  备选: {
    color: 'text-secondary',
    bg: 'bg-secondary/10',
    border: 'border-secondary/30',
    probability: 60,
  },
  保底: { color: 'text-accent', bg: 'bg-accent/10', border: 'border-accent/30', probability: 85 },
};

function inferLevel(ranking: string): string {
  const text = ranking.toLowerCase();
  if (text.includes('四校') || text.includes('顶尖') || text.includes('第一梯队')) return '冲刺';
  if (
    text.includes('第二梯队') ||
    text.includes('区属市重点') ||
    text.includes('新增市重点') ||
    text.includes('区实验性示范')
  )
    return '备选';
  return '保底';
}

function SchoolsPageContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q')?.toLowerCase() || '';
  const { currentChild } = useChildren();
  const shouldReduceMotion = useReducedMotion();
  const [showAddModal, setShowAddModal] = useState(false);

  const schools = useMemo(
    () =>
      Object.values(schoolsData).map((s) => {
        const level = inferLevel(s.ranking);
        return {
          id: s.id,
          name: s.name,
          type: s.nature,
          level,
          area: s.location,
          features: s.tags.slice(0, 3),
          probability: levelConfig[level].probability,
        };
      }),
    []
  );

  const filteredSchools = query
    ? schools.filter(
        (s) =>
          s.name.toLowerCase().includes(query) ||
          s.type.toLowerCase().includes(query) ||
          s.area.toLowerCase().includes(query) ||
          s.features.some((f) => f.toLowerCase().includes(query))
      )
    : schools;

  return (
    <div className="space-y-8">
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="bg-secondary/10 border-secondary/20 flex size-10 items-center justify-center rounded-xl border">
            <School className="size-5 text-secondary" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold sm:text-3xl">
              {currentChild ? `${currentChild.name}的目标学校库` : '目标学校库'}
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-inverse transition-colors hover:bg-primary/90"
          >
            <Plus className="size-4" />
            添加学校
          </button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {filteredSchools.map((school, index) => {
          const level = levelConfig[school.level];
          return (
            <motion.div
              key={school.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
            >
              <Link
                href={`/dashboard/schools/${school.id}`}
                className="group block cursor-pointer rounded-2xl border border-border-subtle bg-surface-elevated p-6 transition-all hover:bg-surface-highlight"
              >
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-secondary to-secondary-glow">
                      <School className="size-6 text-text-primary" />
                    </div>
                    <div>
                      <h2 className="font-display text-lg font-bold transition-colors group-hover:text-text-primary">
                        {school.name}
                      </h2>
                      <div className="mt-1 flex items-center gap-2 text-sm text-text-tertiary">
                        <MapPin className="size-3.5" />
                        {school.area}
                        <span className="text-text-muted">·</span>
                        {school.type}
                      </div>
                    </div>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${level.bg} ${level.color} border ${level.border}`}
                  >
                    {school.level}
                  </span>
                </div>

                <div className="mb-4 flex flex-wrap gap-2">
                  {school.features.map((feature) => (
                    <span
                      key={feature}
                      className="rounded-lg border border-border-default bg-surface-hover px-2.5 py-1 text-xs text-text-secondary"
                    >
                      {feature}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between border-t border-border-subtle pt-4">
                  <div className="flex items-center gap-2 text-sm text-text-tertiary">
                    <Trophy className="size-4 text-warning" />
                    录取概率
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-24 overflow-hidden rounded-full bg-surface-hover">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-primary to-secondary"
                        style={{ width: `${school.probability}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-text-secondary">
                      {school.probability}%
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {!currentChild && (
        <ChildEmptyState description="添加孩子后，系统会根据年级展示对应阶段的目标学校" />
      )}

      {filteredSchools.length === 0 && (
        <EmptyState
          icon={Search}
          title={`没有找到与 "${query}" 匹配的学校`}
          description="试试搜索学校名称、类型或区域"
          action={{
            label: '清除搜索',
            onClick: () => {
              window.location.href = '/dashboard/schools';
            },
          }}
        />
      )}

      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="添加学校"
        icon={School}
        iconClassName="bg-secondary"
        colorScheme="violet"
        size="sm"
        zIndex={60}
        footer={
          <button
            type="button"
            onClick={() => setShowAddModal(false)}
            className="focus-ring w-full rounded-lg border border-border-default bg-surface-elevated py-2 text-sm text-text-secondary transition-colors hover:bg-surface-hover"
          >
            知道了
          </button>
        }
      >
        <p className="text-center text-sm text-text-tertiary">
          学校库由平台维护，暂不支持自定义添加。如需补充学校，请联系管理员。
        </p>
      </Modal>
    </div>
  );
}

export default function SchoolsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-text-muted">加载中...</div>}>
      <SchoolsPageContent />
    </Suspense>
  );
}
