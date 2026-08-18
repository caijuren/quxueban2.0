import { prisma } from '@/lib/prisma';
import type { ReportType, ReportStatus } from '@/lib/generated/prisma';
import { aggregateReportData } from './aggregation';
import { generateReportContent } from './generation';
import { getWeeklyPeriod, getMonthlyPeriod, formatPeriodLabel, type ReportPeriod } from './date';
import { redis } from '@/lib/redis';

export type ReportTypeInput = 'WEEKLY' | 'MONTHLY';

interface GenerateReportOptions {
  childId: string;
  type: ReportTypeInput;
  periodStart?: Date;
  periodEnd?: Date;
  force?: boolean;
}

const LOCK_TTL_SECONDS = 60;

async function acquireGenerationLock(childId: string, type: ReportTypeInput, periodStart: Date): Promise<boolean> {
  if (!redis) return true;
  const key = `growth-report:lock:${childId}:${type}:${periodStart.toISOString().slice(0, 10)}`;
  const result = await redis.set(key, '1', 'EX', LOCK_TTL_SECONDS, 'NX');
  return result === 'OK';
}

function resolvePeriod(type: ReportTypeInput, periodStart?: Date, periodEnd?: Date): ReportPeriod {
  if (periodStart && periodEnd) {
    return {
      periodStart,
      periodEnd,
      label: formatPeriodLabel(type, periodStart),
    };
  }
  if (type === 'WEEKLY') {
    return getWeeklyPeriod(periodStart ?? new Date());
  }
  return getMonthlyPeriod(periodStart ?? new Date());
}

export async function findOrCreatePendingReport(
  options: GenerateReportOptions
): Promise<{ id: string; status: ReportStatus; existed: boolean }> {
  const { childId, type, force } = options;
  const period = resolvePeriod(type, options.periodStart, options.periodEnd);

  const existing = await prisma.growthReport.findUnique({
    where: {
      childId_type_periodStart: {
        childId,
        type: type as ReportType,
        periodStart: period.periodStart,
      },
    },
  });

  if (existing && !force) {
    return { id: existing.id, status: existing.status, existed: true };
  }

  if (existing && force) {
    await prisma.growthReport.update({
      where: { id: existing.id },
      data: { status: 'GENERATING' },
    });
    return { id: existing.id, status: 'GENERATING', existed: true };
  }

  const created = await prisma.growthReport.create({
    data: {
      childId,
      type: type as ReportType,
      periodStart: period.periodStart,
      periodEnd: period.periodEnd,
      title: `${formatPeriodLabel(type, period.periodStart)}成长简报`,
      summary: '',
    },
  });

  return { id: created.id, status: created.status, existed: false };
}

export async function generateReportCore(reportId: string): Promise<void> {
  const report = await prisma.growthReport.findUnique({
    where: { id: reportId },
    include: { child: { select: { id: true, name: true, grade: true } } },
  });

  if (!report) {
    console.error('[growthReport] report not found:', reportId);
    return;
  }

  try {
    const period: ReportPeriod = {
      periodStart: report.periodStart,
      periodEnd: report.periodEnd,
      label: formatPeriodLabel(report.type as ReportTypeInput, report.periodStart),
    };

    const data = await aggregateReportData(report.childId, period);
    const { content, source, rawResponse } = await generateReportContent(data);

    await prisma.growthReport.update({
      where: { id: reportId },
      data: {
        title: `${period.label}成长简报`,
        summary: content.summary,
        highlights: content.highlights as unknown as never,
        concerns: content.concerns as unknown as never,
        abilityInsights: content.abilityInsights as unknown as never,
        nextWeekPlan: content.nextWeekPlan as unknown as never,
        chartsData: content.chartsData as unknown as never,
        rawAiResponse: rawResponse ? (rawResponse as unknown as never) : undefined,
        status: 'READY',
      },
    });

    console.log(`[growthReport] generated ${reportId} from ${source}`);
  } catch (err) {
    console.error('[growthReport] generation failed:', err);
    await prisma.growthReport.update({
      where: { id: reportId },
      data: { status: 'FAILED' },
    });
  }
}

export async function generateReport(options: GenerateReportOptions): Promise<{ id: string; status: ReportStatus }> {
  const { childId, type } = options;
  const period = resolvePeriod(type, options.periodStart, options.periodEnd);

  const lockAcquired = await acquireGenerationLock(childId, type, period.periodStart);
  if (!lockAcquired) {
    const existing = await prisma.growthReport.findUnique({
      where: {
        childId_type_periodStart: {
          childId,
          type: type as ReportType,
          periodStart: period.periodStart,
        },
      },
    });
    if (existing) {
      return { id: existing.id, status: existing.status };
    }
  }

  const { id, status } = await findOrCreatePendingReport(options);
  return { id, status };
}
