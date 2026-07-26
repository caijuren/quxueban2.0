'use client';

import { motion } from 'framer-motion';
import { useEffect, useRef, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Route,
  Target,
  Shield,
  AlertTriangle,
  Clock,
  ChevronRight,
  ChevronDown,
  Plus,
  Edit3,
  School,
  GraduationCap,
  Home,
} from 'lucide-react';
import Link from 'next/link';
import PlanRoadmap from '@/components/dashboard/PlanRoadmap';
import MiddleSchoolMatrix from '@/components/dashboard/MiddleSchoolMatrix';
import {
  plans as defaultPlans,
  middleSchoolPlans,
  typeConfig,
  statusConfig,
  type RoutePlan,
} from '@/lib/plans';
import MatchAnalysisModal from './MatchAnalysisModal';
import NewPlanModal from './NewPlanModal';
import ManageNodesModal from './ManageNodesModal';
import EmptyState from '@/components/ui/EmptyState';
import { useChildren } from '@/components/dashboard/ChildrenContext';
import { gradeToStage } from '@/lib/children';

function PlanPageContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q')?.toLowerCase() || '';
  const { currentChild } = useChildren();

  // TODO: fetch plan list from backend
  const [planList, setPlanList] = useState<RoutePlan[]>(defaultPlans);
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [showNewPlanModal, setShowNewPlanModal] = useState(false);
  const [showManageNodesModal, setShowManageNodesModal] = useState(false);
  const [activeStage, setActiveStage] = useState('小升初');
  const [stageDropdownOpen, setStageDropdownOpen] = useState(false);
  const stageDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (currentChild) {
      setActiveStage(gradeToStage(currentChild.grade));
    }
  }, [currentChild]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        stageDropdownRef.current &&
        !stageDropdownRef.current.contains(e.target as Node)
      ) {
        setStageDropdownOpen(false);
      }
    };
    if (stageDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [stageDropdownOpen]);

  useEffect(() => {
    if (activeStage === '中考') {
      setPlanList(middleSchoolPlans);
    } else {
      setPlanList(defaultPlans);
    }
  }, [activeStage]);

  const handleCreatePlan = (plan: RoutePlan) => {
    setPlanList((prev) => [...prev, plan]);
    setShowNewPlanModal(false);
  };

  const handleUpdateNodes = (nextPlans: RoutePlan[]) => {
    setPlanList(nextPlans);
  };

  const filteredPlans = planList.filter((plan) => {
    if (!query) return true;
    const searchable = [
      plan.name,
      plan.description,
      ...plan.requirements,
      ...plan.milestones.map((m) => `${m.time} ${m.task}`),
      ...plan.targets.map((t) => `${t.name} ${t.tag}`),
    ]
      .join(' ')
      .toLowerCase();
    return searchable.includes(query);
  });

  return (
    <div className="space-y-8">
      {!currentChild && (
        <EmptyState
          icon={School}
          title="还没有孩子档案"
          description="请先在右上角添加孩子，系统会根据年级自动匹配对应阶段的路线方案"
        />
      )}

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold font-display mb-2">
            {currentChild ? `${currentChild.name}的路线方案` : '路线方案'}
          </h1>
          <p className="text-slate-400">
            {currentChild
              ? `当前阶段：${activeStage} · 根据${currentChild.name}的年级（${currentChild.grade <= 6 ? `小学${currentChild.grade}年级` : `初中${currentChild.grade - 6}年级`}）自动匹配`
              : '管理小升初、中考、高考各阶段的主路线与备选路线'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div ref={stageDropdownRef} className="relative">
            <button
              onClick={() => setStageDropdownOpen((prev) => !prev)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl glass border border-white/10 text-sm font-medium text-slate-200 hover:bg-white/5 transition-all"
            >
              <span className="text-slate-500">阶段</span>
              <span className="gradient-text font-semibold">{activeStage}</span>
              <ChevronDown
                className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${
                  stageDropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </button>
            {stageDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-40 rounded-xl glass border border-white/10 overflow-hidden z-50 shadow-[0_0_30px_rgba(0,0,0,0.3)]">
                {['小升初', '中考'].map((stage) => {
                  const isActive = activeStage === stage;
                  return (
                    <button
                      key={stage}
                      onClick={() => {
                        setActiveStage(stage);
                        setStageDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                        isActive
                          ? 'bg-primary/10 text-primary font-medium'
                          : 'text-slate-300 hover:bg-white/5'
                      }`}
                    >
                      {stage}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
          <button
            onClick={() => setShowNewPlanModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-semibold hover:shadow-[0_0_30px_rgba(244,63,94,0.5)] transition-all duration-300"
          >
            <Plus className="w-4 h-4" />
            新建方案
          </button>
        </div>
      </motion.div>

      {activeStage === '小升初' && (
        <PlanRoadmap
          onShowDiagnosis={() => setShowMatchModal(true)}
          onManageNodes={() => setShowManageNodesModal(true)}
        />
      )}
      {activeStage === '中考' && <MiddleSchoolMatrix />}

      {/* Plan cards */}
      <div className="space-y-6">
        {filteredPlans.map((plan, index) => {
          const type = typeConfig[plan.type];
          const status = statusConfig[plan.status];
          return (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              className={`rounded-2xl glass p-6 border ${
                plan.type === 'primary' ? 'border-primary/30' : 'border-white/5'
              } relative overflow-hidden group min-h-[540px] flex flex-col`}
            >
              {plan.type === 'primary' && (
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              )}

              <div className="relative z-10 flex flex-col h-full">
                {/* Top row */}
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 mb-6">
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-14 h-14 rounded-2xl ${type.bg} flex items-center justify-center shrink-0`}
                      style={{
                        boxShadow:
                          plan.type === 'primary'
                            ? '0 0 30px rgba(244, 63, 94, 0.3)'
                            : 'none',
                      }}
                    >
                      {plan.type === 'primary' ? (
                        <Target className={`w-7 h-7 ${type.color}`} />
                      ) : (
                        <Shield className={`w-7 h-7 ${type.color}`} />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h2 className="text-xl font-bold font-display">{plan.name}</h2>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${type.bg} ${type.color} border ${type.border}`}
                        >
                          {type.label}
                        </span>
                        <span className={`flex items-center gap-1 text-xs font-medium ${status.color}`}>
                          <status.icon className="w-3 h-3" />
                          {status.label}
                        </span>
                      </div>
                      <p className="text-slate-400 text-sm max-w-2xl leading-relaxed">
                        {plan.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-xs text-slate-500 mb-1">路线匹配度</p>
                      <p
                        className={`text-2xl font-bold font-display ${
                          plan.probability >= 80
                            ? 'text-success'
                            : plan.probability >= 60
                            ? 'text-warning'
                            : 'text-slate-300'
                        }`}
                      >
                        {plan.probability}%
                      </p>
                    </div>
                    {plan.type === 'primary' && activeStage === '小升初' && (
                      <button
                        onClick={() => setShowMatchModal(true)}
                        className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 hover:text-primary hover:bg-primary/10 transition-all group"
                        aria-label="编辑匹配度"
                      >
                        <Edit3 className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Requirements & Milestones */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-warning" />
                      关键要求
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {plan.requirements.map((req) => (
                        <span
                          key={req}
                          className="px-3 py-1.5 rounded-lg bg-white/5 text-sm text-slate-300 border border-white/10"
                        >
                          {req}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
                      <Route className="w-4 h-4 text-secondary" />
                      关键里程碑
                    </h3>
                    <div className="space-y-2">
                      {plan.milestones.map((milestone, mIndex) => (
                        <div key={milestone.task} className="flex items-center gap-3 text-sm">
                          <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-xs text-slate-500 font-medium shrink-0">
                            {mIndex + 1}
                          </div>
                          <span className="text-slate-400 w-16 shrink-0">{milestone.time}</span>
                          <span className="text-slate-200">{milestone.task}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
                    {activeStage === '中考' ? (
                      <>
                        <GraduationCap className="w-4 h-4 text-primary" />
                        目标高中
                      </>
                    ) : plan.id === 'sg' ? (
                      <>
                        <School className="w-4 h-4 text-primary" />
                        目标学校
                      </>
                    ) : plan.id === 'yaohao' ? (
                      <>
                        <GraduationCap className="w-4 h-4 text-secondary" />
                        目标民办
                      </>
                    ) : (
                      <>
                        <Home className="w-4 h-4 text-accent" />
                        保底选项
                      </>
                    )}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {plan.targets.map((school, sIndex) => (
                      <Link key={school.slug} href={`/dashboard/schools/${school.slug}`}>
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: 0.3 + sIndex * 0.1 }}
                          whileHover={{ y: -4 }}
                          className={`group rounded-xl glass p-4 border border-white/5 cursor-pointer transition-all duration-300 ${school.shadow}`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-10 h-10 rounded-lg bg-gradient-to-br ${school.color} flex items-center justify-center shrink-0`}
                            >
                              <school.icon className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <h4 className="font-bold font-display group-hover:text-white transition-colors">
                                {school.name} · {school.tag}
                              </h4>
                              <p className="text-xs text-slate-400">查看详情</p>
                            </div>
                          </div>
                        </motion.div>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Action */}
                <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Clock className="w-4 h-4" />
                    {/* TODO: use real updatedAt from backend */}
                    最近更新：2 天前
                  </div>
                  <Link
                    href={`/dashboard/plan/${plan.id}`}
                    className="flex items-center gap-1 text-sm text-primary hover:text-primary-glow transition-colors group/btn"
                  >
                    查看完整方案{' '}
                    <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {filteredPlans.length === 0 && (
        <>
          {planList.length === 0 ? (
            <EmptyState
              title="还没有任何路线方案"
              description='点击右上角「新建方案」创建第一条升学路线'
              action={{ label: '新建方案', onClick: () => setShowNewPlanModal(true) }}
            />
          ) : (
            <EmptyState
              title={`没有找到与 “${query}” 匹配的路线、任务或学校`}
              action={{
                label: '清除搜索',
                onClick: () => {
                  setPlanList(defaultPlans);
                  window.location.href = '/dashboard/plan';
                },
              }}
            />
          )}
        </>
      )}

      <MatchAnalysisModal
        isOpen={showMatchModal}
        onClose={() => setShowMatchModal(false)}
        plan={planList[0]}
      />
      <NewPlanModal
        isOpen={showNewPlanModal}
        onClose={() => setShowNewPlanModal(false)}
        onCreate={handleCreatePlan}
      />
      <ManageNodesModal
        isOpen={showManageNodesModal}
        onClose={() => setShowManageNodesModal(false)}
        plans={planList}
        onUpdate={handleUpdateNodes}
      />
    </div>
  );
}

export default function PlanPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500">加载中...</div>}>
      <PlanPageContent />
    </Suspense>
  );
}
