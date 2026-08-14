import assert from 'node:assert/strict';
import test from 'node:test';
import { computeReadingStats } from '../lib/aiDiagnosis';

test('reading stats are undefined when there are no reading tasks', () => {
  const plans = [{ tasks: [{ category: 'MATH', status: 'done' }] }];
  assert.equal(computeReadingStats(plans), undefined);
});

test('reading stats are undefined when no completion records exist', () => {
  const plans = [{ tasks: [{ category: 'READING', status: 'pending' }] }];
  assert.equal(computeReadingStats(plans), undefined);
});

test('reading stats aggregate minutes and days across plans', () => {
  const plans = [
    {
      tasks: [
        {
          category: 'READING',
          completionRecords: [
            { date: '2026-08-11', status: 'done', actualDurationMinutes: 30 },
            { date: '2026-08-12', status: 'done', actualDurationMinutes: 45 },
          ],
        },
      ],
    },
    {
      tasks: [
        {
          category: 'READING',
          completionRecords: [
            { date: '2026-08-13', status: 'partially_done', actualDurationMinutes: 15 },
            { date: '2026-08-14', status: 'pending', actualDurationMinutes: 0 },
          ],
        },
      ],
    },
  ];

  const stats = computeReadingStats(plans);
  assert.ok(stats);
  assert.equal(stats.totalDays, 4);
  assert.equal(stats.doneDays, 3);
  assert.equal(stats.completionRate, 75);
  assert.equal(stats.recentWeeksAvgDailyMinutes, 23);
});

test('reading stats ignore non-reading categories', () => {
  const plans = [
    {
      tasks: [
        { category: 'MATH', completionRecords: [{ date: '2026-08-11', status: 'done', actualDurationMinutes: 60 }] },
        { category: 'READING', completionRecords: [{ date: '2026-08-11', status: 'done', actualDurationMinutes: 20 }] },
      ],
    },
  ];

  const stats = computeReadingStats(plans);
  assert.ok(stats);
  assert.equal(stats.totalDays, 1);
  assert.equal(stats.recentWeeksAvgDailyMinutes, 20);
});
