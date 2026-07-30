'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { School, MapPin, Trophy, Plus, Search, User, X } from 'lucide-react';
import { Suspense, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import EmptyState from '@/components/ui/EmptyState';
import { useChildren } from '@/components/dashboard/ChildrenContext';
import { gradeLabel, gradeToStage } from '@/lib/children';
import { schoolsData } from './[school]/SchoolDetail';

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
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold font-display mb-2">
            {currentChild ? `${currentChild.name}的目标学校库` : '目标学校库'}
          </h1>
          <p className="text-slate-400">
            {currentChild
              ? `当前阶段：${gradeToStage(currentChild.grade)}（${gradeLabel(currentChild.grade)}） · 管理冲刺、备选、保底目标`
              : '管理冲刺、备选、保底目标学校及录取概率'}
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-semibold hover:shadow-[0_0_30px_rgba(244,63,94,0.5)] transition-all duration-300"
        >
          <Plus className="w-4 h-4" />
          添加学校
        </button>
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
        <EmptyState
          icon={User}
          title="还没有孩子档案"
          description="请先在右上角添加孩子，系统会根据年级展示对应阶段的目标学校"
        />
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

      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-sm rounded-xl command-panel corner-accent p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="absolute top-4 right-4 w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 hover:bg-white/10 hover:text-slate-200 transition-colors focus-ring"
                aria-label="关闭"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="text-center mb-5">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3 border border-primary/20">
                  <Plus className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-bold font-display mb-1">添加目标学校</h3>
                <p className="text-xs text-slate-500">学校库由平台维护，暂不支持自定义添加。如需补充学校，请联系管理员。</p>
              </div>

              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="w-full py-2 rounded-lg bg-white/5 text-sm text-slate-300 hover:bg-white/10 transition-colors focus-ring"
              >
                知道了
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
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
