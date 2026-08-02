'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Target, Flag } from 'lucide-react';
import {
  SubjectPlanConfig,
  SubjectPlanTrack,
  SubjectPlanYearlyTarget,
} from '@/lib/subjects/subjectPlan';
import Modal from '@/components/ui/Modal';

interface ChineseYearlyMatrixProps {
  config: SubjectPlanConfig;
  currentGrade?: number;
}

const GRADE_ORDER = ['一年级', '二年级', '三年级', '四年级', '五年级'];

export default function ChineseYearlyMatrix({ config, currentGrade }: ChineseYearlyMatrixProps) {
  const [selectedCell, setSelectedCell] = useState<{
    track: SubjectPlanTrack;
    target: SubjectPlanYearlyTarget;
  } | null>(null);

  const grades = useMemo(() => {
    const allGrades = new Set<string>();
    Object.values(config.yearlyTargets).forEach((targets) => {
      targets.forEach((t) => allGrades.add(t.grade));
    });
    return GRADE_ORDER.filter((g) => allGrades.has(g));
  }, [config.yearlyTargets]);

  const currentGradeLabel = currentGrade ? `${['零', '一', '二', '三', '四', '五', '六'][currentGrade]}年级` : null;

  const getTarget = (trackId: string, grade: string): SubjectPlanYearlyTarget | undefined => {
    return config.yearlyTargets[trackId]?.find((t) => t.grade === grade);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="rounded-2xl glass p-6 border border-border-subtle"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
            <Target className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-display">阶段目标矩阵</h2>
            <p className="text-sm text-text-tertiary">按年级查看每条线的关键目标，点击单元格查看详细任务</p>
          </div>
        </div>

        {/* Desktop matrix */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="text-left text-xs text-text-tertiary font-medium p-3 w-24">年级</th>
                {config.tracks.map((track) => (
                  <th key={track.id} className="p-3 text-left min-w-[140px]">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: track.color }} />
                      <span className="text-xs text-text-secondary font-medium">{track.name}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {grades.map((grade) => {
                const isCurrent = currentGradeLabel === grade;
                return (
                  <tr
                    key={grade}
                    className={`border-t border-border-subtle ${isCurrent ? 'bg-white/[0.03]' : ''}`}
                  >
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-text-secondary">{grade}</span>
                        {isCurrent && (
                          <span className="text-2xs px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                            当前
                          </span>
                        )}
                      </div>
                    </td>
                    {config.tracks.map((track) => {
                      const target = getTarget(track.id, grade);
                      return (
                        <td key={`${grade}-${track.id}`} className="p-2">
                          {target ? (
                            <button
                              onClick={() => setSelectedCell({ track, target })}
                              className="w-full text-left rounded-lg bg-surface-elevated border border-border-subtle p-3 hover:border-border-default hover:bg-surface-highlight transition-all group"
                            >
                              <p className="text-sm font-medium text-text-secondary group-hover:text-text-primary transition-colors">
                                {target.keyword}
                              </p>
                              {target.milestones && target.milestones.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {target.milestones.map((m) => (
                                    <span
                                      key={m}
                                      className="text-2xs px-1.5 py-0.5 rounded bg-secondary/10 text-secondary border border-secondary/20"
                                    >
                                      {m}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </button>
                          ) : (
                            <div className="w-full rounded-lg border border-dashed border-border-subtle p-3 text-center text-xs text-text-muted">
                              —
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile grade cards */}
        <div className="md:hidden space-y-4">
          {grades.map((grade) => {
            const isCurrent = currentGradeLabel === grade;
            return (
              <div
                key={grade}
                className={`rounded-xl border ${isCurrent ? 'border-primary/30 bg-primary/5' : 'border-border-subtle bg-surface-elevated'} p-4`}
              >
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="font-bold text-text-secondary">{grade}</h3>
                  {isCurrent && (
                    <span className="text-2xs px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                      当前
                    </span>
                  )}
                </div>
                <div className="space-y-2">
                  {config.tracks.map((track) => {
                    const target = getTarget(track.id, grade);
                    return (
                      <button
                        key={track.id}
                        onClick={() => target && setSelectedCell({ track, target })}
                        disabled={!target}
                        className="w-full flex items-center justify-between rounded-lg border border-border-subtle p-3 disabled:opacity-40 disabled:cursor-not-allowed hover:border-border-default transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: track.color }} />
                          <span className="text-xs text-text-tertiary">{track.name}</span>
                        </div>
                        <span className="text-sm font-medium text-text-secondary">
                          {target?.keyword || '—'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Detail modal */}
      {selectedCell && (
        <Modal
          isOpen={!!selectedCell}
          onClose={() => setSelectedCell(null)}
          title={selectedCell.target.keyword}
          subtitle={`${selectedCell.target.grade} · ${selectedCell.track.name}`}
          icon={Flag}
          iconClassName="bg-gradient-to-br from-violet-500 to-fuchsia-500"
          size="md"
          colorScheme="violet"
        >
          <div className="space-y-4">
            {selectedCell.target.period && (
              <div>
                <p className="text-xs text-text-tertiary mb-1">时间范围</p>
                <p className="text-sm text-text-secondary">{selectedCell.target.period}</p>
              </div>
            )}
            <div>
              <p className="text-xs text-text-tertiary mb-1">详细任务</p>
              <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-wrap">
                {selectedCell.target.detail || '暂无详细说明'}
              </p>
            </div>
            {selectedCell.target.milestones && selectedCell.target.milestones.length > 0 && (
              <div>
                <p className="text-xs text-text-tertiary mb-2">关键里程碑</p>
                <div className="flex flex-wrap gap-2">
                  {selectedCell.target.milestones.map((m) => (
                    <span
                      key={m}
                      className="text-xs px-2.5 py-1 rounded-lg bg-secondary/10 text-secondary border border-secondary/20"
                    >
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}
    </>
  );
}
