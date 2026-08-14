'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@/components/ui/icon';
import Button from '@/components/ui/button';
import DataTable from '@/components/ui/data-table';
import {
  SubjectPlanConfig,
  SubjectPlanTrack,
  SubjectPlanKeyAchievement,
} from '@/lib/subjects/subjectPlan';
import Modal from '@/components/ui/Modal';

interface ChineseYearlyMatrixProps {
  config: SubjectPlanConfig;
  currentGrade?: number;
}

const TIME_ORDER = [
  '一上期中',
  '一上期末',
  '一下期中',
  '一下期末',
  '二上期中',
  '二上期末',
  '二下期中',
  '二下期末',
  '三上期中',
  '三上期末',
  '三下期中',
  '三下期末',
  '四上期中',
  '四上期末',
  '四下期中',
  '四下期末',
  '五上期中',
  '五上期末',
  '五下期中',
  '五下期末',
  '三公前',
  '三公',
];

function timeSortIndex(time: string): number {
  const index = TIME_ORDER.indexOf(time);
  return index === -1 ? 999 : index;
}

function getCurrentTimeLabel(grade?: number): string | null {
  if (!grade || grade < 1) return null;
  if (grade >= 5) return '三公前';

  const month = new Date().getMonth() + 1;
  const semester = month >= 9 || month <= 1 ? '上' : '下';
  const stage = month >= 2 && month <= 6 ? '期末' : '期中';
  const gradeNames = ['零', '一', '二', '三', '四', '五'];
  return `${gradeNames[grade]}${semester}${stage}`;
}

export default function ChineseYearlyMatrix({ config, currentGrade }: ChineseYearlyMatrixProps) {
  const [selectedCell, setSelectedCell] = useState<{
    track: SubjectPlanTrack;
    achievement: SubjectPlanKeyAchievement;
  } | null>(null);

  const times = useMemo(() => {
    const allTimes = new Set<string>();
    Object.values(config.keyAchievements).forEach((items) => {
      items.forEach((item) => allTimes.add(item.time));
    });
    return Array.from(allTimes).sort((a, b) => timeSortIndex(a) - timeSortIndex(b));
  }, [config.keyAchievements]);

  const currentTimeLabel = getCurrentTimeLabel(currentGrade);

  const getAchievement = (trackId: string, time: string): SubjectPlanKeyAchievement | undefined => {
    return config.keyAchievements[trackId]?.find((a) => a.time === time);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="rounded-xl border border-border-subtle bg-surface-elevated p-6"
      >
        <div className="mb-6 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500">
            <Icon name="Target" size="md" className="text-text-primary" />
          </div>
          <div>
            <h2 className="font-display text-xl font-bold">关键时间点成果矩阵</h2>
            <p className="text-sm text-text-tertiary">按线路查看关键节点应取得的成果</p>
          </div>
        </div>

        {/* Desktop matrix */}
        <div className="hidden overflow-x-auto md:block">
          <DataTable<SubjectPlanTrack>
            columns={[
              {
                key: 'track',
                title: '线路',
                width: '7rem',
                render: (track) => (
                  <div className="flex items-center gap-2">
                    <div
                      className="size-2.5 rounded-full"
                      style={{ backgroundColor: track.color }}
                    />
                    <span className="text-sm font-medium text-text-secondary">{track.name}</span>
                  </div>
                ),
              },
              ...times.map((time) => ({
                key: time,
                title: time,
                render: (track: SubjectPlanTrack) => {
                  const achievement = getAchievement(track.id, time);
                  return achievement ? (
                    <Button
                      variant="secondary"
                      size="xs"
                      className="w-full flex-col items-start gap-0 p-3 text-left border-border-subtle bg-surface-elevated hover:border-border-default hover:bg-surface-highlight group"
                      onClick={() => setSelectedCell({ track, achievement })}
                    >
                      <span className="text-sm font-medium text-text-secondary transition-colors group-hover:text-text-primary">
                        {achievement.keyword}
                      </span>
                      {achievement.milestones && achievement.milestones.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {achievement.milestones.map((m) => (
                            <span
                              key={m}
                              className="bg-secondary/10 border-secondary/20 rounded border px-1.5 py-0.5 text-2xs text-secondary"
                            >
                              {m}
                            </span>
                          ))}
                        </div>
                      )}
                    </Button>
                  ) : (
                    <div className="w-full rounded-lg border border-dashed border-border-subtle p-3 text-center text-xs text-text-muted">
                      —
                    </div>
                  );
                },
              })),
            ]}
            data={config.tracks}
            rowKey="id"
            emptyText="暂无数据"
          />
        </div>

        {/* Mobile track cards */}
        <div className="space-y-4 md:hidden">
          {config.tracks.map((track) => (
            <div
              key={track.id}
              className="rounded-xl border border-border-subtle bg-surface-elevated p-4"
            >
              <div className="mb-3 flex items-center gap-2">
                <div className="size-2.5 rounded-full" style={{ backgroundColor: track.color }} />
                <h3 className="font-bold text-text-secondary">{track.name}</h3>
              </div>
              <div className="space-y-2">
                {times.map((time) => {
                  const achievement = getAchievement(track.id, time);
                  const isCurrent = time === currentTimeLabel;
                  return (
                    <Button
                      key={time}
                      variant="secondary"
                      size="xs"
                      className="w-full justify-between p-3 border-border-subtle hover:border-border-default disabled:opacity-40"
                      onClick={() => achievement && setSelectedCell({ track, achievement })}
                      disabled={!achievement}
                      leftIcon={
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-text-tertiary">{time}</span>
                          {isCurrent && (
                            <span className="bg-primary/10 border-primary/20 rounded border px-1.5 py-0.5 text-2xs text-primary">
                              当前
                            </span>
                          )}
                        </div>
                      }
                      rightIcon={
                        <span className="text-sm font-medium text-text-secondary">
                          {achievement?.keyword || '—'}
                        </span>
                      }
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Detail modal */}
      {selectedCell && (
        <Modal
          isOpen={!!selectedCell}
          onClose={() => setSelectedCell(null)}
          title={selectedCell.achievement.keyword}
          subtitle={`${selectedCell.achievement.time} · ${selectedCell.track.name}`}
          icon="Flag"
          iconClassName="bg-gradient-to-br from-violet-500 to-fuchsia-500"
          size="md"
          colorScheme="violet"
        >
          <div className="space-y-4">
            <div>
              <p className="mb-1 text-xs text-text-tertiary">成果说明</p>
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-text-secondary">
                {selectedCell.achievement.detail || '暂无详细说明'}
              </p>
            </div>
            {selectedCell.achievement.milestones &&
              selectedCell.achievement.milestones.length > 0 && (
                <div>
                  <p className="mb-2 text-xs text-text-tertiary">关键里程碑</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedCell.achievement.milestones.map((m) => (
                      <span
                        key={m}
                        className="bg-secondary/10 border-secondary/20 rounded-lg border px-2.5 py-1 text-xs text-secondary"
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
