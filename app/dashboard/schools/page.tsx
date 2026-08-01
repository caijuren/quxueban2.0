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

const levelConfig: Record<string, { color: string; bg: string; border: string; probability: number }> = {
  冲刺: { color: 'text-primary', bg: 'bg-primary/10', border: 'border-primary/30', probability: 35 },
  备选: { color: 'text-secondary', bg: 'bg-secondary/10', border: 'border-secondary/30', probability: 60 },
  保底: { color: 'text-accent', bg: 'bg-accent/10', border: 'border-accent/30', probability: 85 },
};

function inferLevel(ranking: string): string {
  const text = ranking.toLowerCase();
  if (text.includes('四校') || text.includes('顶尖') || text.includes('第一梯队')) return '冲刺';
  if (text.includes('第二梯队') || text.includes('区属市重点') || text.includes('新增市重点') || text.includes('区实验性示范')) return '备选';
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
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-secondary/10 border border-secondary/20 flex items-center justify-center">
            <School className="w-5 h-5 text-secondary" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold font-display">
              {currentChild ? `${currentChild.name}的目标学校库` : '目标学校库'}
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-semibold hover:shadow-[0_0_30px_rgba(244,63,94,0.5)] transition-all duration-300"
          >
            <Plus className="w-4 h-4" />
            添加学校
          </button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                className="block rounded-2xl glass p-6 hover:bg-surface-light/80 transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-secondary to-secondary-glow flex items-center justify-center shrink-0">
                      <School className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold font-display group-hover:text-white transition-colors">{school.name}</h2>
                      <div className="flex items-center gap-2 mt-1 text-sm text-slate-400">
                        <MapPin className="w-3.5 h-3.5" />
                        {school.area}
                        <span className="text-slate-600">·</span>
                        {school.type}
                      </div>
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${level.bg} ${level.color} border ${level.border}`}>
                    {school.level}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {school.features.map((feature) => (
                    <span key={feature} className="px-2.5 py-1 rounded-lg bg-white/5 text-xs text-slate-300 border border-white/10">
                      {feature}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <Trophy className="w-4 h-4 text-warning" />
                    录取概率
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-primary to-secondary"
                        style={{ width: `${school.probability}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-slate-200">{school.probability}%</span>
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
            className="w-full py-2 rounded-lg bg-white/5 text-sm text-slate-300 hover:bg-white/10 transition-colors focus-ring"
          >
            知道了
          </button>
        }
      >
        <p className="text-sm text-slate-400 text-center">
          学校库由平台维护，暂不支持自定义添加。如需补充学校，请联系管理员。
        </p>
      </Modal>
    </div>
  );
}

export default function SchoolsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500">加载中...</div>}>
      <SchoolsPageContent />
    </Suspense>
  );
}
