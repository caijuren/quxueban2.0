'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
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
  ChevronUp,
} from 'lucide-react';
import PlanRoadmap from '@/components/dashboard/PlanRoadmap';
import MiddleSchoolMatrix from '@/components/dashboard/MiddleSchoolMatrix';
import {
  plans as defaultPlans,
  middleSchoolPlans,
  typeConfig,
  statusConfig,
  type RoutePlan,
  getRouteById,
} from '@/lib/plans';
import MatchAnalysisModal from './MatchAnalysisModal';
import NewPlanModal from './NewPlanModal';
import ManageNodesModal from './ManageNodesModal';
import EmptyState from '@/components/ui/EmptyState';
import ChildEmptyState from '@/components/dashboard/ChildEmptyState';
import CommandCard from '@/components/ui/CommandCard';
import TimelineNode from '@/components/ui/TimelineNode';
import { useChildren } from '@/components/dashboard/ChildrenContext';
import { gradeToStage } from '@/lib/children';

const stages = [
  { id: '小升初', label: '小升初', status: 'active' },
  { id: '中考', label: '中考', status: 'active' },
  { id: '高考', label: '高考', status: 'coming' },
];

function PlanPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const shouldReduceMotion = useReducedMotion();
  const query = searchParams.get('q')?.toLowerCase() || '';
  const stageFromUrl = searchParams.get('stage');
  const { currentChild } = useChildren();

  // TODO: fetch plan list from backend
  const [planList, setPlanList] = useState<RoutePlan[]>(defaultPlans);
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [showNewPlanModal, setShowNewPlanModal] = useState(false);
  const [showManageNodesModal, setShowManageNodesModal] = useState(false);
  const [activeStage, setActiveStageState] = useState('小升初');
  const [stageDropdownOpen, setStageDropdownOpen] = useState(false);
  const [expandedPlanId, setExpandedPlanId] = useState<string | null>(null);
  const stageDropdownRef = useRef<HTMLDivElement>(null);

  // Sync active stage with URL
  useEffect(() => {
    if (stageFromUrl && stages.some((s) => s.id === stageFromUrl && s.status === 'active')) {
      setActiveStageState(stageFromUrl);
    } else if (currentChild) {
      const childStage = gradeToStage(currentChild.grade, currentChild.educationSystem);
      setActiveStageState(childStage);
      const params = new URLSearchParams(searchParams.toString());
      params.set('stage', childStage);
      router.replace(`/dashboard/plan?${params.toString()}`, { scroll: false });
    }
  }, [currentChild, stageFromUrl, searchParams, router]);

  // Sync expanded plan with child's bound route
  useEffect(() => {
    if (!currentChild?.routeId) {
      const firstPrimary = activeStage === '中考'
        ? middleSchoolPlans.find((p) => p.type === 'primary')
        : defaultPlans.find((p) => p.type === 'primary');
      setExpandedPlanId(firstPrimary?.id ?? null);
      return;
    }
    const source = activeStage === '中考' ? middleSchoolPlans : defaultPlans;
    const bound = source.find((p) => p.id === currentChild.routeId);
    if (bound) {
      setExpandedPlanId(bound.id);
    }
  }, [currentChild, activeStage]);

  const setActiveStage = (stage: string) => {
    setActiveStageState(stage);
    const params = new URLSearchParams(searchParams.toString());
    params.set('stage', stage);
    router.push(`/dashboard/plan?${params.toString()}`, { scroll: false });
  };

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

  const togglePlan = (id: string) => {
    setExpandedPlanId((prev) => (prev === id ? null : id));
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
    <div className="space-y-6">
      {!currentChild && (
        <ChildEmptyState description="添加孩子后，系统会根据年级自动匹配对应阶段的路线方案" />
      )}

      {/* Header */}
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <Route className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold font-display">
              {currentChild ? `${currentChild.name}的路线方案` : '路线方案'}
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div ref={stageDropdownRef} className="relative">
            <button
              onClick={() => setStageDropdownOpen((prev) => !prev)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-surface-elevated border border-border-default text-sm font-medium text-text-secondary hover:bg-surface-elevated transition-colors focus-ring"
              aria-haspopup="listbox"
              aria-expanded={stageDropdownOpen}
            >
              <span className="text-text-muted">阶段</span>
              <span className="text-primary font-semibold">{activeStage}</span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-text-tertiary transition-transform duration-200 ${
                  stageDropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </button>
            {stageDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-40 rounded-xl bg-surface-elevated border border-border-default overflow-hidden z-50 shadow-2xl">
                {stages.map((stage) => {
                  const isActive = activeStage === stage.id;
                  const disabled = stage.status === 'coming';
                  return (
                    <button
                      key={stage.id}
                      disabled={disabled}
                      onClick={() => {
                        if (disabled) return;
                        setActiveStage(stage.id);
                        setStageDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-sm transition-colors flex items-center justify-between ${
                        disabled
                          ? 'text-text-muted cursor-not-allowed'
                          : isActive
                          ? 'bg-primary/[0.08] text-primary font-medium'
                          : 'text-text-secondary hover:bg-surface-elevated'
                      }`}
                    >
                      {stage.label}
                      {disabled && (
                        <span className="text-2xs text-text-muted">即将上线</span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
          <button
            onClick={() => setShowNewPlanModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-all duration-200 focus-ring"
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
      <div className="space-y-3">
        {filteredPlans.map((plan, index) => {
          const type = typeConfig[plan.type];
          const status = statusConfig[plan.status];
          const isExpanded = expandedPlanId === plan.id;
          return (
            <motion.div
              key={plan.id}
              initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.06 }}
            >
              <CommandCard
                active={plan.type === 'primary'}
                corner={plan.type === 'primary'}
                className="overflow-visible"
              >
                {/* Header — always visible */}
                <button
                  onClick={() => togglePlan(plan.id)}
                  className="w-full p-4 text-left focus-ring rounded-xl"
                  aria-expanded={isExpanded}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl ${type.bg} flex items-center justify-center shrink-0`}
                        style={{
                          boxShadow: plan.type === 'primary' ? '0 0 15px rgba(244, 63, 94, 0.12)' : 'none',
                        }}
                      >
                        {plan.type === 'primary' ? (
                          <Target className={`w-5 h-5 ${type.color}`} />
                        ) : (
                          <Shield className={`w-5 h-5 ${type.color}`} />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h2 className="text-base font-bold font-display">{plan.name}</h2>
                          <span
                            className={`px-2 py-0.5 rounded-md text-2xs font-medium ${type.bg} ${type.color} border ${type.border}`}
                          >
                            {type.label}
                          </span>
                          <span className={`flex items-center gap-1 text-2xs font-medium ${status.color}`}>
                            <status.icon className="w-3 h-3" />
                            {status.label}
                          </span>
                        </div>
                        <p className="text-xs text-text-muted mt-1 max-w-xl line-clamp-1">
                          {plan.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <p className="text-2xs text-text-muted mb-0.5">匹配度</p>
                        <p
                          className={`text-base font-bold font-display tabular-nums ${
                            plan.probability >= 80
                              ? 'text-success'
                              : plan.probability >= 60
                              ? 'text-warning'
                              : 'text-text-secondary'
                          }`}
                        >
                          {plan.probability}%
                        </p>
                      </div>
                      {plan.type === 'primary' && activeStage === '小升初' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowMatchModal(true);
                          }}
                          className="w-8 h-8 rounded-lg bg-surface-elevated flex items-center justify-center text-text-tertiary hover:text-primary hover:bg-primary/10 transition-colors focus-ring"
                          aria-label="编辑匹配度"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <div className="text-text-muted">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </div>
                  </div>
                </button>

                {/* Expandable content */}
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 pt-0 border-t border-border-subtle">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 pt-4">
                        {/* Requirements */}
                        <div>
                          <h3 className="text-xs font-semibold text-text-tertiary mb-2.5 flex items-center gap-1.5">
                            <AlertTriangle className="w-3.5 h-3.5 text-warning" />
                            关键要求
                          </h3>
                          <div className="flex flex-wrap gap-1.5">
                            {plan.requirements.map((req) => (
                              <span
                                key={req}
                                className="px-2 py-1 rounded-md bg-surface-elevated text-xs text-text-secondary border border-border-subtle"
                              >
                                {req}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Milestones */}
                        <div>
                          <h3 className="text-xs font-semibold text-text-tertiary mb-2.5 flex items-center gap-1.5">
                            <Route className="w-3.5 h-3.5 text-secondary" />
                            关键里程碑
                          </h3>
                          <div className="space-y-1">
                            {plan.milestones.map((milestone, mIndex) => (
                              <TimelineNode
                                key={milestone.task}
                                title={milestone.task}
                                subtitle={milestone.time}
                                status={mIndex === 0 ? 'current' : 'upcoming'}
                                isLast={mIndex === plan.milestones.length - 1}
                              />
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Targets */}
                      <div className="mt-5">
                        <h3 className="text-xs font-semibold text-text-tertiary mb-2.5 flex items-center gap-1.5">
                          {activeStage === '中考' ? (
                            <>
                              <GraduationCap className="w-3.5 h-3.5 text-primary" />
                              目标高中
                            </>
                          ) : plan.id === 'sg' ? (
                            <>
                              <School className="w-3.5 h-3.5 text-primary" />
                              目标学校
                            </>
                          ) : plan.id === 'yaohao' ? (
                            <>
                              <GraduationCap className="w-3.5 h-3.5 text-secondary" />
                              目标民办
                            </>
                          ) : (
                            <>
                              <Home className="w-3.5 h-3.5 text-accent" />
                              保底选项
                            </>
                          )}
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          {plan.targets.map((school) => (
                            <button
                              key={school.slug}
                              onClick={() => router.push(`/dashboard/schools/${school.slug}`)}
                              className="text-left rounded-xl bg-surface-elevated border border-border-subtle p-3 hover:border-border-default hover:bg-surface-elevated transition-all focus-ring group"
                            >
                              <div className="flex items-center gap-2.5">
                                <div
                                  className={`w-8 h-8 rounded-lg bg-gradient-to-br ${school.color} flex items-center justify-center shrink-0`}
                                >
                                  <school.icon className="w-4 h-4 text-text-primary" />
                                </div>
                                <div className="min-w-0">
                                  <h4 className="text-sm font-semibold text-text-secondary truncate group-hover:text-text-primary transition-colors">
                                    {school.name}
                                  </h4>
                                  <p className="text-2xs text-text-muted">{school.tag}</p>
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="mt-4 pt-3 border-t border-border-subtle flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs text-text-muted">
                          <Clock className="w-3.5 h-3.5" />
                          最近更新：2 天前
                        </div>
                        <button
                          onClick={() => router.push(`/dashboard/plan/${plan.id}`)}
                          className="flex items-center gap-1 text-xs text-primary hover:text-primary-glow transition-colors group/btn focus-ring rounded-md px-1.5 py-1"
                        >
                          查看完整方案{' '}
                          <ChevronRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </CommandCard>
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
                  router.push('/dashboard/plan');
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
    <Suspense fallback={<div className="p-8 text-center text-text-muted">加载中...</div>}>
      <PlanPageContent />
    </Suspense>
  );
}
