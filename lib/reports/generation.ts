import { z } from 'zod';
import { getEnabledAiConfig } from '@/lib/aiConfig';
import { aiFetch } from '@/lib/ai/fetchWithResilience';
import type { AggregatedReportData } from './aggregation';

const highlightSchema = z.object({
  type: z.string(),
  title: z.string(),
  content: z.string(),
});

const concernSchema = highlightSchema;

const abilityInsightsSchema = z.object({
  strength: z.string(),
  weakness: z.string(),
  suggestion: z.string(),
});

const chartsDataSchema = z.object({
  taskCompletionRate: z.number().min(0).max(100).optional(),
  readingMinutes: z.number().min(0).optional(),
  readingTargetMinutes: z.number().min(0).optional(),
  evidenceCount: z.number().min(0).optional(),
  earnedPoints: z.number().optional(),
});

const reportContentSchema = z.object({
  summary: z.string(),
  highlights: z.array(highlightSchema).max(3),
  concerns: z.array(concernSchema).max(3),
  abilityInsights: abilityInsightsSchema,
  nextWeekPlan: z.array(z.string()).min(3).max(5),
  chartsData: chartsDataSchema,
});

export type ReportContent = z.infer<typeof reportContentSchema>;

interface LLMMessage {
  role: 'system' | 'user';
  content: string;
}

function formatDate(d: Date): string {
  return d.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
}

function buildPrompt(data: AggregatedReportData): string {
  const { child, period, tasks, reading, evidence, points } = data;
  const periodLabel = `${formatDate(period.periodStart)} - ${formatDate(period.periodEnd)}`;

  const categoryLines = tasks.byCategory
    .map((c) => `- ${c.label}：共 ${c.total} 项，完成 ${c.done} 项，完成率 ${c.rate}%`)
    .join('\n');

  const dayLines = tasks.byDay
    .map((d) => `- ${d.day}：${d.total} 项任务，完成 ${d.done} 项`)
    .join('\n');

  const readingTypeLines = reading.byType
    .map((t) => `- ${t.type}：${t.count} 次，共 ${t.minutes} 分钟`)
    .join('\n');

  const evidenceDimensionLines = evidence.byDimension
    .map((d) => `- ${d.dimensionName}：${d.count} 条`)
    .join('\n');

  return [
    `请根据以下家庭教育数据，生成一份「${periodLabel}」的${child.name}成长简报。`,
    '',
    '【孩子信息】',
    `- 姓名：${child.name}`,
    `- 年级：${child.grade}`,
    '',
    '【任务执行情况】',
    `- 总任务数：${tasks.totalTasks}`,
    `- 已完成：${tasks.completedTasks}，部分完成：${tasks.partiallyDoneTasks}，跳过：${tasks.skippedTasks}，待完成：${tasks.pendingTasks}`,
    `- 整体完成率：${tasks.completionRate}%`,
    `- 实际投入时长：${tasks.actualMinutesTotal} 分钟 / 计划 ${tasks.estimatedMinutesTotal} 分钟`,
    '',
    '【分类完成情况】',
    categoryLines || '无任务数据',
    '',
    '【每日完成情况】',
    dayLines || '无任务数据',
    '',
    '【阅读数据】',
    `- 阅读总时长：${reading.totalMinutes} 分钟`,
    `- 阅读次数：${reading.readingCount} 次`,
    `- 阅读书目数：${reading.bookCount} 本`,
    `- 年级量化目标：${reading.targetMinutes} 分钟，达成率 ${reading.targetMetRate}%`,
    '',
    '【阅读类型分布】',
    readingTypeLines || '无阅读记录',
    '',
    '【能力证据】',
    `- 新增证据：${evidence.totalCount} 条`,
    `- 已确认：${evidence.confirmedCount} 条，待确认：${evidence.pendingCount} 条，已拒绝：${evidence.rejectedCount} 条`,
    '',
    '【能力维度分布】',
    evidenceDimensionLines || '无能力证据',
    '',
    '【积分】',
    `- 本周获得：${points.earned} 分，消耗：${points.spent} 分，净变化：${points.net > 0 ? '+' : ''}${points.net} 分`,
    '',
    '输出要求：',
    '1. 必须返回合法 JSON，不要 markdown 代码块。',
    '2. summary：150 字以内，温暖、专业、像家庭教育顾问，概括本周/月总体情况和最值得家长关注的一点。',
    '3. highlights：最多 3 条亮点，每条 50 字以内。',
    '4. concerns：最多 3 条需关注点，每条 50 字以内；如果没有明显问题，可返回空数组。',
    '5. abilityInsights：包含 strength（优势维度）、weakness（薄弱维度）、suggestion（具体提升建议）。',
    '6. nextWeekPlan：3-5 条具体、可执行的行动建议。',
    '7. chartsData：包含 taskCompletionRate（0-100）、readingMinutes、readingTargetMinutes、evidenceCount、earnedPoints。',
    '',
    '输出 JSON 结构：',
    '{',
    '  "summary": "...",',
    '  "highlights": [{ "type": "reading|task|evidence|point", "title": "...", "content": "..." }],',
    '  "concerns": [{ "type": "reading|task|evidence|point", "title": "...", "content": "..." }],',
    '  "abilityInsights": { "strength": "...", "weakness": "...", "suggestion": "..." },',
    '  "nextWeekPlan": ["...", "...", "..."],',
    '  "chartsData": { "taskCompletionRate": 83, "readingMinutes": 320, "readingTargetMinutes": 300, "evidenceCount": 5, "earnedPoints": 120 }',
    '}',
  ].join('\n');
}

function buildFallbackContent(data: AggregatedReportData): ReportContent {
  const { child, period, tasks, reading, evidence, points } = data;
  const periodLabel = `${formatDate(period.periodStart)} - ${formatDate(period.periodEnd)}`;

  const highlights = [];
  if (tasks.completionRate >= 80) {
    highlights.push({
      type: 'task',
      title: '任务完成率高',
      content: `${child.name}本周任务完成率达到 ${tasks.completionRate}%，执行节奏稳定。`,
    });
  }
  if (reading.totalMinutes > 0) {
    highlights.push({
      type: 'reading',
      title: '阅读坚持',
      content: `本周阅读 ${reading.totalMinutes} 分钟，共 ${reading.readingCount} 次，保持得很好。`,
    });
  }
  if (evidence.totalCount > 0) {
    highlights.push({
      type: 'evidence',
      title: '能力证据持续积累',
      content: `本周新增 ${evidence.totalCount} 条能力证据，成长轨迹越来越清晰。`,
    });
  }

  const concerns = [];
  if (tasks.completionRate < 60 && tasks.totalTasks > 0) {
    concerns.push({
      type: 'task',
      title: '任务完成度偏低',
      content: `本周完成率仅 ${tasks.completionRate}%，建议下周减少任务量或固定执行时段。`,
    });
  }
  if (reading.targetMetRate < 60 && reading.targetMinutes > 0) {
    concerns.push({
      type: 'reading',
      title: '阅读时长未达标',
      content: `本周阅读 ${reading.totalMinutes} 分钟，距目标 ${reading.targetMinutes} 分钟还有差距。`,
    });
  }

  const weakness = evidence.byDimension.slice(-1)[0]?.dimensionName ?? '评价与创新';

  return {
    summary:
      `${child.name}在${periodLabel}的学习情况如下：` +
      `任务完成率 ${tasks.completionRate}%，阅读 ${reading.totalMinutes} 分钟，` +
      `新增能力证据 ${evidence.totalCount} 条。` +
      (tasks.completionRate >= 80
        ? '整体节奏良好，建议继续保持并适当增加挑战。'
        : '整体完成度还有提升空间，建议优先补齐缺项。'),
    highlights: highlights.slice(0, 3),
    concerns: concerns.slice(0, 3),
    abilityInsights: {
      strength: evidence.byDimension[0]?.dimensionName ?? '阅读理解',
      weakness,
      suggestion: `针对${weakness}，建议下周增加 1 次相关阅读任务，并记录能力证据。`,
    },
    nextWeekPlan: [
      '复盘本周未完成任务，找出拖延原因并调整时间安排',
      '保持每日阅读节奏，优先完成核心书目',
      '在完成任务时主动记录 1-2 条能力证据',
      '周末用 10 分钟和孩子一起回顾本周亮点',
    ].slice(0, 4),
    chartsData: {
      taskCompletionRate: tasks.completionRate,
      readingMinutes: reading.totalMinutes,
      readingTargetMinutes: reading.targetMinutes,
      evidenceCount: evidence.totalCount,
      earnedPoints: points.earned,
    },
  };
}

async function callLLM(messages: LLMMessage[]): Promise<ReportContent | null> {
  const config = await getEnabledAiConfig();
  if (!config || !config.apiKey) {
    return null;
  }

  try {
    const res = await aiFetch(config.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({
        model: config.model,
        messages,
        temperature: 0.7,
        response_format: { type: 'json_object' },
      }),
    });

    if (!res.ok) {
      console.error('[growthReport] LLM request failed:', res.status, await res.text().catch(() => ''));
      return null;
    }

    const data = (await res.json()) as { choices?: Array<{ message?: { content?: string } }> };
    const content = data.choices?.[0]?.message?.content?.trim();
    if (!content) return null;

    const parsed = JSON.parse(content);
    const validated = reportContentSchema.safeParse(parsed);
    if (!validated.success) {
      console.error('[growthReport] LLM response validation failed:', validated.error);
      return null;
    }

    return validated.data;
  } catch (err) {
    console.error('[growthReport] LLM error:', err);
    return null;
  }
}

export async function generateReportContent(data: AggregatedReportData): Promise<{
  content: ReportContent;
  source: 'llm' | 'rule';
  rawResponse?: unknown;
}> {
  const messages: LLMMessage[] = [
    {
      role: 'system',
      content:
        '你是一位熟悉中国家庭教育的 AI 顾问，擅长把孩子的学习数据转化为家长看得懂、能行动的简报。语气温暖、专业、不夸张，避免空话套话。',
    },
    { role: 'user', content: buildPrompt(data) },
  ];

  const llmResult = await callLLM(messages);
  if (llmResult) {
    return { content: llmResult, source: 'llm' };
  }

  return { content: buildFallbackContent(data), source: 'rule' };
}
