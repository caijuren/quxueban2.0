'use client';

import { useMemo, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Icon, type IconName } from '@/components/ui/icon';
import {
  READING_ABILITIES,
  getPhaseByLadder,
  getReadingTarget,
  type ReadingAbilityId,
  type ReadingLiteracyAssessment,
  type ReadingPhase,
} from '@/lib/subjects/readingLiteracy';
import { cn } from '@/lib/utils';

interface ReadingAbilityRadarProps {
  assessment?: ReadingLiteracyAssessment;
  currentLadder?: number;
  title?: string;
  description?: string;
}

const GROUP_META: Record<
  'comprehension' | 'critical' | 'creative',
  { label: string; color: string; bar: string }
> = {
  comprehension: { label: '理解性阅读', color: 'text-primary', bar: 'bg-primary' },
  critical: { label: '评鉴性阅读', color: 'text-secondary', bar: 'bg-secondary' },
  creative: { label: '创造性阅读', color: 'text-accent', bar: 'bg-accent' },
};

const ABILITY_ICONS: Record<ReadingAbilityId, IconName> = {
  recognition: 'Search',
  comprehension: 'BookOpen',
  appreciation: 'Star',
  evaluation: 'Scale',
  application: 'PenTool',
  innovation: 'Lightbulb',
};

const PHASE_COLORS: Record<ReadingPhase, string> = {
  奠基: 'text-success',
  拓展: 'text-primary',
  深化: 'text-secondary',
  融通: 'text-accent',
};

function scoreColor(score: number): string {
  if (score >= 80) return 'text-success';
  if (score >= 60) return 'text-warning';
  return 'text-error';
}

export default function ReadingAbilityRadar({
  assessment,
  currentLadder,
  title = '阅读素养评估',
  description = '基于《中国青少年阅读素养框架》（JY/T 0663—2026）的 6 个阅读能力维度',
}: ReadingAbilityRadarProps) {
  const shouldReduceMotion = useReducedMotion();
  const [expanded, setExpanded] = useState<ReadingAbilityId | null>(null);

  const ladder = assessment?.ladder ?? currentLadder ?? 3;
  const phase = getPhaseByLadder(ladder);
  const target = getReadingTarget(ladder);

  const dimensionScores = useMemo(() => {
    const map = new Map<ReadingAbilityId, number>();
    assessment?.dimensions.forEach((d) => map.set(d.id, d.score));
    return map;
  }, [assessment]);

  const groups = useMemo(() => {
    const order: Array<'comprehension' | 'critical' | 'creative'> = [
      'comprehension',
      'critical',
      'creative',
    ];
    return order.map((group) => ({
      group,
      meta: GROUP_META[group],
      abilities: READING_ABILITIES.filter((a) => a.group === group),
    }));
  }, []);

  return (
    <div className="rounded-2xl border border-border-subtle bg-surface-elevated p-5 sm:p-6">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
            <Icon name="BookOpen" size="md" className="text-primary" />
          </div>
          <div>
            <h3 className="font-display text-lg font-bold text-text-primary">{title}</h3>
            <p className="mt-0.5 text-xs text-text-tertiary">{description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-lg border border-border-subtle bg-surface-hover px-2.5 py-1 text-xs text-text-muted">
            当前梯级
          </span>
          <span className="font-display text-xl font-bold text-primary">{ladder}</span>
          <span className={cn('rounded-full px-2 py-0.5 text-xs font-medium', PHASE_COLORS[phase])}>
            {phase}阶段
          </span>
        </div>
      </div>

      <div className="space-y-5">
        {groups.map(({ group, meta, abilities }) => (
          <div key={group}>
            <div className="mb-2 flex items-center gap-2">
              <span className={cn('h-1 w-4 rounded-full', meta.bar)} />
              <span className={cn('text-xs font-medium', meta.color)}>{meta.label}</span>
              <span className="text-2xs text-text-muted">
                {abilities.map((a) => a.name).join(' · ')}
              </span>
            </div>
            <div className="space-y-2">
              {abilities.map((ability) => {
                const score = dimensionScores.get(ability.id) ?? 70;
                const isOpen = expanded === ability.id;
                return (
                  <div
                    key={ability.id}
                    className="overflow-hidden rounded-xl border border-border-subtle bg-surface-hover"
                  >
                    <button
                      type="button"
                      onClick={() => setExpanded(isOpen ? null : ability.id)}
                      className="flex w-full items-center gap-3 p-3 text-left transition-colors hover:bg-surface-highlight"
                    >
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-surface-elevated">
                        <Icon name={ABILITY_ICONS[ability.id]} size="sm" className="text-text-secondary" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="mb-1.5 flex items-center justify-between gap-2">
                          <span className="text-sm font-medium text-text-secondary">
                            {ability.name}
                          </span>
                          <span className={cn('font-display text-sm font-bold', scoreColor(score))}>
                            {score}
                          </span>
                        </div>
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-highlight">
                          <div
                            className={cn('h-full rounded-full transition-all duration-500', meta.bar)}
                            style={{ width: `${score}%` }}
                          />
                        </div>
                      </div>
                      <Icon
                        name="ChevronDown"
                        size="sm"
                        className={cn(
                          'shrink-0 text-text-muted transition-transform duration-200',
                          isOpen && 'rotate-180'
                        )}
                      />
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={shouldReduceMotion ? { opacity: 1 } : { height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={shouldReduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="border-t border-border-subtle bg-surface-elevated/60 px-4 py-3"
                        >
                          <div className="space-y-1.5">
                            {ability.ladders
                              .filter((l) => l.ladder <= 6)
                              .map((l) => (
                                <div key={l.ladder} className="flex gap-2">
                                  <span
                                    className={cn(
                                      'mt-0.5 h-4 w-8 shrink-0 rounded text-center text-2xs leading-4',
                                      l.ladder === ladder
                                        ? 'bg-primary/15 font-medium text-primary'
                                        : 'bg-surface-highlight text-text-muted'
                                    )}
                                  >
                                    {l.ladder}梯
                                  </span>
                                  <span className="text-xs leading-5 text-text-tertiary">
                                    {l.description}
                                  </span>
                                </div>
                              ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {target && target.dailyMinutes > 0 && (
        <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 rounded-xl border border-border-subtle bg-surface-hover px-4 py-3">
          <span className="text-xs text-text-muted">官方量化目标（{ladder} 梯）</span>
          <span className="flex items-center gap-1.5 text-sm text-text-secondary">
            <Icon name="Clock" size="sm" className="text-primary" />
            日均约 {target.dailyMinutes} 分钟
          </span>
          {target.annualChars > 0 && (
            <span className="flex items-center gap-1.5 text-sm text-text-secondary">
              <Icon name="BookMarked" size="sm" className="text-primary" />
              年均 ≥ {target.annualChars} 万字
            </span>
          )}
        </div>
      )}

      <p className="mt-4 text-2xs leading-relaxed text-text-muted">
        数据来源：教育部行业标准《中国青少年阅读素养框架》（JY/T 0663—2026）表 10-15、表 20。
        小学阶段展示 1-6 梯，7-12 梯（高中-大学）已收录于 lib/subjects/readingLiteracy.ts。
      </p>
    </div>
  );
}
