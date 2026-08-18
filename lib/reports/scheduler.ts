import cron from 'node-cron';
import { prisma } from '@/lib/prisma';
import { redis } from '@/lib/redis';
import { generateReport, generateReportCore } from './service';

const LOCK_TTL_SECONDS = 300;

async function acquireSchedulerLock(jobName: string): Promise<boolean> {
  if (!redis) {
    // When Redis is unavailable, always run (single-instance assumption)
    return true;
  }
  const key = `scheduler:growth-report:${jobName}`;
  const result = await redis.set(key, '1', 'EX', LOCK_TTL_SECONDS, 'NX');
  return result === 'OK';
}

async function generateForAllChildren(type: 'WEEKLY' | 'MONTHLY') {
  const jobName = type === 'WEEKLY' ? 'weekly' : 'monthly';
  const lockAcquired = await acquireSchedulerLock(jobName);
  if (!lockAcquired) {
    console.log(`[growthReportScheduler] ${jobName} job already running in another instance`);
    return;
  }

  console.log(`[growthReportScheduler] starting ${jobName} report generation`);

  const children = await prisma.child.findMany({
    select: { id: true },
  });

  for (const child of children) {
    try {
      const { id } = await generateReport({ childId: child.id, type });
      // Do not await to avoid blocking; fire-and-forget with resilience
      generateReportCore(id).catch((err) => {
        console.error(`[growthReportScheduler] failed for child ${child.id}:`, err);
      });
      // Small delay to avoid AI API rate limits
      await new Promise((resolve) => setTimeout(resolve, 500));
    } catch (err) {
      console.error(`[growthReportScheduler] error creating ${jobName} report for ${child.id}:`, err);
    }
  }

  console.log(`[growthReportScheduler] ${jobName} report generation queued for ${children.length} children`);
}

export function startGrowthReportScheduler(): void {
  if (process.env.DISABLE_GROWTH_REPORT_SCHEDULER === 'true') {
    console.log('[growthReportScheduler] disabled by env');
    return;
  }

  // Weekly: every Sunday at 21:00
  cron.schedule('0 21 * * 0', () => {
    generateForAllChildren('WEEKLY').catch((err) => {
      console.error('[growthReportScheduler] weekly job error:', err);
    });
  });

  // Monthly: last day of every month at 21:00
  cron.schedule('0 21 28-31 * *', () => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);
    if (tomorrow.getDate() === 1) {
      generateForAllChildren('MONTHLY').catch((err) => {
        console.error('[growthReportScheduler] monthly job error:', err);
      });
    }
  });

  console.log('[growthReportScheduler] started');
}
