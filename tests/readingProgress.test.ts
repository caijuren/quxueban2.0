import assert from 'node:assert/strict';
import test from 'node:test';
import { computeWeeklyReadingProgress, computeReadingLadderTrend } from '../lib/readingProgress';

function makePlan(weekId: string, readingTasks: Array<{ done?: boolean; minutes?: number }>) {
  return {
    weekId,
    tasks: readingTasks.map((t, i) => ({
      id: `t${i}`,
      category: 'reading' as const,
      source: 'auto' as const,
      day: '周一' as const,
      focus: '每日课外阅读',
      duration: '30分钟',
      materials: [],
      status: t.done ? ('done' as const) : ('pending' as const),
      completionRecords: t.minutes
        ? [
            {
              id: `r${i}`,
              date: '2026-08-11',
              status: t.done ? ('done' as const) : ('pending' as const),
              progress: t.done ? 100 : 0,
              actualDurationMinutes: t.minutes,
              quality: null,
              note: '',
              imageUrls: [],
              audioUrls: [],
              capabilityProgress: [],
              quantityIncrement: 0,
              checklistProgress: [],
              createdAt: '2026-08-11',
              updatedAt: '2026-08-11',
            },
          ]
        : [],
    })),
  };
}

test('weekly progress reaches grade ladder when target met', () => {
  // 三年级 → 基准 3 梯，周目标 30*7=210 分钟
  const plan = makePlan('2026-W33', [
    { done: true, minutes: 60 },
    { done: true, minutes: 60 },
    { done: true, minutes: 60 },
    { done: true, minutes: 60 },
  ]);
  const progress = computeWeeklyReadingProgress(plan, 3);
  assert.equal(progress.minutes, 240);
  assert.equal(progress.completionRate, 100);
  assert.equal(progress.ladder, 3);
});

test('weekly progress downgrades ladder when far below target', () => {
  const plan = makePlan('2026-W33', [{ done: true, minutes: 30 }]);
  const progress = computeWeeklyReadingProgress(plan, 3);
  assert.equal(progress.minutes, 30);
  assert.ok(progress.ladder < 3);
  assert.equal(progress.hasData, true);
});

test('weekly progress has no data when no minutes recorded', () => {
  const plan = makePlan('2026-W33', [{ done: false, minutes: 0 }]);
  const progress = computeWeeklyReadingProgress(plan, 3);
  assert.equal(progress.hasData, false);
  assert.equal(progress.ladder, 3);
});

test('ladder trend spans 8 weeks with missing weeks as no-data', () => {
  const plans = [makePlan('2026-W33', [{ done: true, minutes: 60 }])];
  const trend = computeReadingLadderTrend(plans, 3, '2026-W33', 8);
  assert.equal(trend.length, 8);
  assert.equal(trend[7].hasData, true);
  assert.equal(trend[7].weekId, '2026-W33');
  assert.equal(trend[0].hasData, false);
  assert.equal(trend[0].weekId, '2026-W26');
});
