'use client';

import { motion } from 'framer-motion';
import { School, Star, MapPin, Trophy, Plus, Search, User } from 'lucide-react';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import EmptyState from '@/components/ui/EmptyState';
import { useChildren } from '@/components/dashboard/ChildrenContext';
import { gradeLabel, gradeToStage } from '@/lib/children';

const schools = [
  {
    name: '上海市实验学校',
    type: '三公',
    level: '冲刺',
    area: '浦东新区',
    features: ['十年一贯制', '理科强', '面谈录取'],
    probability: 35,
  },
  {
    name: '上海外国语大学附属外国语学校',
    type: '三公',
    level: '冲刺',
    area: '虹口区',
    features: ['外语特色', '保送优势', '全国招生'],
    probability: 30,
  },
  {
    name: '上海外国语大学附属浦东外国语学校',
    type: '三公',
    level: '冲刺',
    area: '浦东新区',
    features: ['外语特色', '寄宿制', '面谈录取'],
    probability: 40,
  },
  {
    name: '民办华育中学',
    type: '民办初中',
    level: '备选',
    area: '徐汇区',
    features: ['上海初中一哥', '自招率高', '摇号'],
    probability: 65,
  },
  {
    name: '民办兰生中学',
    type: '民办初中',
    level: '备选',
    area: '杨浦区',
    features: ['复旦系', '理科竞赛强', '摇号'],
    probability: 60,
  },
];

const levelConfig: Record<string, { color: string; bg: string; border: string }> = {
  冲刺: { color: 'text-primary', bg: 'bg-primary/10', border: 'border-primary/30' },
  备选: { color: 'text-secondary', bg: 'bg-secondary/10', border: 'border-secondary/30' },
  保底: { color: 'text-accent', bg: 'bg-accent/10', border: 'border-accent/30' },
};

function SchoolsPageContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q')?.toLowerCase() || '';
  const { currentChild } = useChildren();

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
        <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-semibold hover:shadow-[0_0_30px_rgba(244,63,94,0.5)] transition-all duration-300">
          <Plus className="w-4 h-4" />
          添加学校
        </button>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredSchools.map((school, index) => {
          const level = levelConfig[school.level];
          return (
            <motion.div
              key={school.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="rounded-2xl glass p-6 hover:bg-surface-light/80 transition-all cursor-pointer group"
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
