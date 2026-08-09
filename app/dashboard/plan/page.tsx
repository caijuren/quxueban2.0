'use client';
import { Icon } from '@/components/ui/icon';
import Button from '@/components/ui/button';

import { motion, useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

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
      const firstPrimary =
        activeStage === '中考'
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
      if (stageDropdownRef.current && !stageDropdownRef.current.contains(e.target as Node)) {
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
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 border-primary/20 flex size-10 items-center justify-center rounded-xl border">
            <Icon name="Route" size="md" className="text-primary" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold sm:text-3xl">
              {currentChild ? `${currentChild.name}的路线方案` : '路线方案'}
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div ref={stageDropdownRef} className="relative">
            <Button
              onClick={() => setStageDropdownOpen((prev) => !prev)}
              variant="secondary"
              size="md"
              className="focus-ring flex items-center gap-2 rounded-lg border border-border-default bg-surface-elevated px-3 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-elevated"
              aria-haspopup="listbox"
              aria-expanded={stageDropdownOpen}
            >
              <span className="text-text-muted">阶段</span>
              <span className="font-semibold text-primary">{activeStage}</span>
              <Icon
                name="ChevronDown"
                size="md"
                className={`size-3.5 text-text-tertiary transition-transform duration-200 ${stageDropdownOpen ? 'rotate-180' : ''}`}
              />
            </Button>
            {stageDropdownOpen && (
              <div className="absolute right-0 top-full z-50 mt-2 w-40 overflow-hidden rounded-xl border border-border-default bg-surface-elevated shadow-2xl">
                {stages.map((stage) => {
                  const isActive = activeStage === stage.id;
                  const disabled = stage.status === 'coming';
                  return (
                    <Button
                      key={stage.id}
                      disabled={disabled}
                      onClick={() => {
                        if (disabled) return;
                        setActiveStage(stage.id);
                        setStageDropdownOpen(false);
                      }}
                      variant="ghost"
                      className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm transition-colors ${
                        disabled
                          ? 'cursor-not-allowed text-text-muted'
                          : isActive
                            ? 'bg-primary/[0.08] font-medium text-primary'
                            : 'text-text-secondary hover:bg-surface-elevated'
                      }`}
                    >
                      {stage.label}
                      {disabled && <span className="text-2xs text-text-muted">即将上线</span>}
                    </Button>
                  );
                })}
              </div>
            )}
          </div>
          <Button
            onClick={() => setShowNewPlanModal(true)}
            variant="primary"
            size="md"
            className="focus-ring hover:bg-primary/90 flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-inverse transition-all duration-200"
          >
            <Icon name="Plus" size="sm" />
            新建方案
          </Button>
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
                <Button
                  onClick={() => togglePlan(plan.id)}
                  variant="ghost"
                  className="focus-ring w-full rounded-xl p-4 text-left"
                  aria-expanded={isExpanded}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div
                        className={`size-10 rounded-xl ${type.bg} flex shrink-0 items-center justify-center`}
                        style={{
                          boxShadow:
                            plan.type === 'primary' ? '0 0 15px color-mix(in srgb, var(--color-primary) 12%, transparent)' : 'none',
                        }}
                      >
                        {plan.type === 'primary' ? (
                          <Icon name="Target" size="md" className={`size-5 ${type.color}`} />
                        ) : (
                          <Icon name="Shield" size="md" className={`size-5 ${type.color}`} />
                        )}
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="font-display text-base font-bold">{plan.name}</h2>
                          <span
                            className={`rounded-md px-2 py-0.5 text-2xs font-medium ${type.bg} ${type.color} border ${type.border}`}
                          >
                            {type.label}
                          </span>
                          <span
                            className={`flex items-center gap-1 text-2xs font-medium ${status.color}`}
                          >
                            <Icon name={status.icon} size="xs" className="size-3" />
                            {status.label}
                          </span>
                        </div>
                        <p className="mt-1 line-clamp-1 max-w-xl text-xs text-text-muted">
                          {plan.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-3">
                      <div className="text-right">
                        <p className="mb-0.5 text-2xs text-text-muted">匹配度</p>
                        <p
                          className={`font-display text-base font-bold tabular-nums ${
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
                        <div
                          role="button"
                          tabIndex={0}
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowMatchModal(true);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.stopPropagation();
                              setShowMatchModal(true);
                            }
                          }}
                          className="hover:bg-primary/10 focus-ring flex size-8 cursor-pointer items-center justify-center rounded-lg bg-surface-elevated text-text-tertiary transition-colors hover:text-primary"
                          aria-label="编辑匹配度"
                        >
                          <Icon name="Edit3" size="xs" />
                        </div>
                      )}
                      <div className="text-text-muted">
                        {isExpanded ? (
                          <Icon name="ChevronUp" size="sm" />
                        ) : (
                          <Icon name="ChevronDown" size="sm" />
                        )}
                      </div>
                    </div>
                  </div>
                </Button>

                {/* Expandable content */}
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="border-t border-border-subtle px-4 pb-4 pt-0">
                      <div className="grid grid-cols-1 gap-5 pt-4 lg:grid-cols-2">
                        {/* Requirements */}
                        <div>
                          <h3 className="mb-2.5 flex items-center gap-1.5 text-xs font-semibold text-text-tertiary">
                            <Icon name="AlertTriangle" size="xs" className="text-warning" />
                            关键要求
                          </h3>
                          <div className="flex flex-wrap gap-1.5">
                            {plan.requirements.map((req) => (
                              <span
                                key={req}
                                className="rounded-md border border-border-subtle bg-surface-elevated px-2 py-1 text-xs text-text-secondary"
                              >
                                {req}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Milestones */}
                        <div>
                          <h3 className="mb-2.5 flex items-center gap-1.5 text-xs font-semibold text-text-tertiary">
                            <Icon name="Route" size="xs" className="text-secondary" />
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
                        <h3 className="mb-2.5 flex items-center gap-1.5 text-xs font-semibold text-text-tertiary">
                          {activeStage === '中考' ? (
                            <>
                              <Icon name="GraduationCap" size="xs" className="text-primary" />
                              目标高中
                            </>
                          ) : plan.id === 'sg' ? (
                            <>
                              <Icon name="School" size="xs" className="text-primary" />
                              目标学校
                            </>
                          ) : plan.id === 'yaohao' ? (
                            <>
                              <Icon name="GraduationCap" size="xs" className="text-secondary" />
                              目标民办
                            </>
                          ) : (
                            <>
                              <Icon name="Home" size="xs" className="text-accent" />
                              保底选项
                            </>
                          )}
                        </h3>
                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                          {plan.targets.map((school) => (
                            <Button
                              key={school.slug}
                              onClick={() => router.push(`/dashboard/schools/${school.slug}`)}
                              variant="secondary"
                              className="focus-ring group rounded-xl border border-border-subtle bg-surface-elevated p-3 text-left transition-all hover:border-border-default hover:bg-surface-elevated"
                            >
                              <div className="flex items-center gap-2.5">
                                <div
                                  className={`size-8 rounded-lg bg-gradient-to-br ${school.color} flex shrink-0 items-center justify-center`}
                                >
                                  <Icon
                                    name={school.icon}
                                    size="sm"
                                    className="size-4 text-text-primary"
                                  />
                                </div>
                                <div className="min-w-0">
                                  <h4 className="truncate text-sm font-semibold text-text-secondary transition-colors group-hover:text-text-primary">
                                    {school.name}
                                  </h4>
                                  <p className="text-2xs text-text-muted">{school.tag}</p>
                                </div>
                              </div>
                            </Button>
                          ))}
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="mt-4 flex items-center justify-between border-t border-border-subtle pt-3">
                        <div className="flex items-center gap-1.5 text-xs text-text-muted">
                          <Icon name="Clock" size="xs" />
                          最近更新：2 天前
                        </div>
                        <Button
                          onClick={() => router.push(`/dashboard/plan/${plan.id}`)}
                          variant="link"
                          size="xs"
                          className="group/btn focus-ring flex items-center gap-1 rounded-md px-1.5 py-1 text-xs text-primary transition-colors hover:text-primary-glow"
                        >
                          查看完整方案{' '}
                          <Icon
                            name="ChevronRight"
                            size="xs"
                            className="transition-transform group-hover/btn:translate-x-0.5"
                          />
                        </Button>
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
              description="点击右上角「新建方案」创建第一条升学路线"
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
