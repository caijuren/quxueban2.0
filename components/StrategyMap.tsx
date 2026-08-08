'use client';

import { Icon, type IconName } from '@/components/ui/icon';
import CommandCard from '@/components/ui/CommandCard';
import DataBadge from '@/components/ui/DataBadge';
import MotionSection from '@/components/ui/MotionSection';

interface RouteOption {
  name: string;
  status: 'active' | 'backup' | 'optional';
}

interface Stage {
  id: string;
  title: string;
  subtitle: string;
  icon: IconName;
  timeRange: string;
  routes: RouteOption[];
}

const stages: Stage[] = [
  {
    id: 'primary',
    title: '小升初',
    subtitle: '一升二 · 路线选择窗口期',
    icon: 'School',
    timeRange: '现在 - 五年级',
    routes: [
      { name: '三公冲刺', status: 'active' },
      { name: '私立摇号', status: 'backup' },
      { name: '公办对口/直升', status: 'backup' },
    ],
  },
  {
    id: 'middle',
    title: '中考',
    subtitle: '初中三年 · 关键分水岭',
    icon: 'GraduationCap',
    timeRange: '六年级 - 初三',
    routes: [
      { name: '名额分配到区', status: 'optional' },
      { name: '名额分配到校', status: 'optional' },
      { name: '自主招生', status: 'optional' },
      { name: '统一招生', status: 'optional' },
    ],
  },
  {
    id: 'high',
    title: '高考',
    subtitle: '高中三年 · 冲刺目标大学',
    icon: 'Trophy',
    timeRange: '高一 - 高三',
    routes: [
      { name: '强基计划', status: 'optional' },
      { name: '综合评价', status: 'optional' },
      { name: '统一高考', status: 'optional' },
    ],
  },
];

const statusConfig = {
  active: { label: '主路线', variant: 'primary' as const },
  backup: { label: '备选', variant: 'warning' as const },
  optional: { label: '待解锁', variant: 'default' as const },
};

export default function StrategyMap() {
  return (
    <section className="px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <MotionSection direction="up" duration={0.6} className="mb-12">
          <span className="mb-3 block font-mono text-[11px] uppercase tracking-widest text-primary">
            Full Journey
          </span>
          <h2 className="mb-4 font-display text-3xl font-bold leading-tight sm:text-4xl">
            覆盖上海升学
            <br />
            <span className="text-text-muted">全阶段路线</span>
          </h2>
          <p className="max-w-xl text-base text-text-secondary">
            从小学入学到高考，每个关键节点的路线选择都帮你梳理清楚。
          </p>
        </MotionSection>

        <div className="space-y-4">
          {stages.map((stage, index) => (
            <MotionSection key={stage.id} direction="up" delay={index * 0.1} duration={0.5}>
              <CommandCard className="group p-5 sm:p-6" active={stage.id === 'primary'}>
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:gap-10">
                  <div className="flex shrink-0 items-center gap-4 lg:w-64">
                    <div className="bg-primary/10 flex size-11 shrink-0 items-center justify-center rounded-xl">
                      <Icon
                        name={stage.icon}
                        size="md"
                        className="text-primary"
                        aria-hidden="true"
                      />
                    </div>
                    <div>
                      <h3 className="font-display text-lg font-bold">{stage.title}</h3>
                      <p className="mt-0.5 text-xs text-text-muted">{stage.subtitle}</p>
                      <span className="mt-1.5 inline-block font-mono text-[10px] text-text-muted">
                        {stage.timeRange}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-1 flex-wrap gap-2">
                    {stage.routes.map((route) => {
                      const config = statusConfig[route.status];
                      return (
                        <DataBadge key={route.name} variant={config.variant} size="sm">
                          <span>{route.name}</span>
                          <span className="opacity-70">{config.label}</span>
                        </DataBadge>
                      );
                    })}
                  </div>

                  <div className="hidden items-center text-text-muted transition-colors group-hover:text-primary lg:flex">
                    <Icon name="ChevronRight" size="sm" aria-hidden="true" />
                  </div>
                </div>
              </CommandCard>
            </MotionSection>
          ))}
        </div>
      </div>
    </section>
  );
}
