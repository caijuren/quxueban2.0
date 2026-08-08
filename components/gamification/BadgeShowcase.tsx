'use client';

import { motion } from 'framer-motion';
import { Star, Trophy, Flame, Zap, Medal, LucideIcon, Loader2 } from 'lucide-react';
import { useGamification } from '@/lib/hooks/useGamification';

const ICON_MAP: Record<string, LucideIcon> = {
  Star,
  Trophy,
  Flame,
  Zap,
  Medal,
};

interface BadgeShowcaseProps {
  childId: string | undefined;
}

export default function BadgeShowcase({ childId }: BadgeShowcaseProps) {
  const { data, isLoading } = useGamification(childId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="size-6 animate-spin text-primary" />
      </div>
    );
  }

  const badges = data?.badges ?? [];
  const points = data?.points ?? 0;
  const streaks = data?.streaks ?? { currentStreak: 0, longestStreak: 0 };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-border-default bg-surface-elevated p-3 text-center">
          <p className="mb-1 text-2xs text-text-muted">总积分</p>
          <p className="text-xl font-bold text-primary">{points}</p>
        </div>
        <div className="rounded-xl border border-border-default bg-surface-elevated p-3 text-center">
          <p className="mb-1 text-2xs text-text-muted">当前连续</p>
          <p className="text-xl font-bold text-warning">{streaks.currentStreak} 天</p>
        </div>
        <div className="rounded-xl border border-border-default bg-surface-elevated p-3 text-center">
          <p className="mb-1 text-2xs text-text-muted">最长连续</p>
          <p className="text-xl font-bold text-success">{streaks.longestStreak} 天</p>
        </div>
      </div>

      {badges.length === 0 ? (
        <div className="rounded-xl border border-border-default bg-surface-elevated p-6 text-center">
          <p className="text-sm text-text-secondary">还没有获得徽章</p>
          <p className="mt-1 text-2xs text-text-muted">坚持完成任务即可获得徽章和积分</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {badges.map((badge, index) => {
            const Icon = ICON_MAP[badge.icon ?? ''] ?? Star;
            return (
              <motion.div
                key={badge.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="hover:border-primary/30 rounded-xl border border-border-default bg-surface-elevated p-4 text-center transition-colors"
              >
                <div
                  className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full"
                  style={{
                    background: `color-mix(in srgb, ${badge.color ?? 'var(--warning)'} 20%, transparent)`,
                    color: badge.color ?? 'var(--warning)',
                  }}
                >
                  <Icon className="size-6" />
                </div>
                <p className="truncate text-sm font-semibold text-text-primary">{badge.name}</p>
                <p className="mt-0.5 line-clamp-2 text-[10px] text-text-muted">
                  {badge.description}
                </p>
                {badge.points > 0 && (
                  <p className="mt-1.5 text-[10px] font-medium text-warning">
                    +{badge.points} 积分
                  </p>
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
