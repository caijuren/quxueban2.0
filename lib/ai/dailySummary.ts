import type { Child } from '@/lib/children';
import { getEnabledAiConfig } from '@/lib/aiConfig';
import { aiFetch } from '@/lib/ai/fetchWithResilience';

export interface DailyTaskSnapshot {
  focus: string;
  categoryLabel: string;
  statusLabel: string;
  progress: number;
  actualDurationMinutes: number;
  duration: string;
  qualityLabel?: string;
  note?: string;
}

export interface DailySummaryInput {
  child: Child;
  date: string;
  dayName: string;
  tasks: DailyTaskSnapshot[];
  doneCount: number;
  partialCount: number;
  pendingCount: number;
  skippedCount: number;
  totalActualMinutes: number;
}

export interface DailySummaryResult {
  summary: string;
  source: 'llm' | 'rule';
}

interface LLMMessage {
  role: 'system' | 'user';
  content: string;
}

function buildPrompt(input: DailySummaryInput): string {
  const statusText =
    `已完成 ${input.doneCount} 项，部分完成 ${input.partialCount} 项，` +
    `未完成/进行中 ${input.pendingCount} 项，跳过/改期 ${input.skippedCount} 项。` +
    `实际总投入约 ${input.totalActualMinutes} 分钟。`;

  const taskLines = input.tasks
    .map((t, i) => {
      const parts = [
        `${i + 1}. ${t.categoryLabel} · ${t.focus}`,
        `状态：${t.statusLabel}${t.progress > 0 ? `（${t.progress}%）` : ''}`,
        t.actualDurationMinutes > 0
          ? `实际耗时：${t.actualDurationMinutes} 分钟`
          : `预计时长：${t.duration}`,
        t.qualityLabel ? `质量：${t.qualityLabel}` : '',
        t.note ? `家长备注：${t.note}` : '',
      ].filter(Boolean);
      return parts.join('，');
    })
    .join('\n');

  return [
    `请根据以下孩子的学习日报，写一段 120 字以内的「AI 总结」。`,
    `总结要求：`,
    `- 用第一人称「我」的视角，像一位家庭教育顾问；`,
    `- 先一句话概括今日完成情况和主要亮点；`,
    `- 然后挑 1-2 个最值得关注的点展开（可以是突出表现、明显短板或需要家长介入的地方）；`,
    `- 最后给一句具体、可执行的改进建议；`,
    `- 不要罗列每一项任务的备注，只提炼重点；`,
    `- 语气积极、有温度，像跟家长聊天，不要空话套话。`,
    ``,
    `孩子：${input.child.name}`,
    `日期：${input.date} ${input.dayName}`,
    `路线：${input.child.routeId || '未设置'}`,
    `目标学校：${input.child.targetSchool || '未设置'}`,
    ``,
    statusText,
    ``,
    '任务明细（供提炼参考）：',
    taskLines || '无任务',
  ].join('\n');
}

function buildRuleSummary(input: DailySummaryInput): string {
  const { doneCount, partialCount, pendingCount, skippedCount, totalActualMinutes, tasks } = input;
  const total = tasks.length || 1;
  const completeRate = Math.round(((doneCount + partialCount * 0.5) / total) * 100);

  let opening = '';
  if (completeRate >= 90) {
    opening = `今天完成得相当漂亮，${doneCount} 项任务全部落地，整体节奏很稳。`;
  } else if (completeRate >= 70) {
    opening = `今天整体推进不错，${doneCount} 项任务已经完成，剩下的可以视情况补一补。`;
  } else if (completeRate >= 40) {
    opening = `今天完成了大概六七成，${doneCount} 项任务已经落地，但还有 ${pendingCount} 项没动起来。`;
  } else {
    opening = `今天完成度不太理想，只完成了 ${doneCount} 项，建议跟孩子聊聊看是哪里卡住了。`;
  }

  const suggestions: string[] = [];
  if (pendingCount > 0) {
    const pendingTasks = tasks.filter((t) => t.statusLabel.includes('未'));
    const names = pendingTasks.slice(0, 2).map((t) => `「${t.focus}」`);
    suggestions.push(`晚上如果还有精力，可以优先把${names.join('、')}启动起来。`);
  }
  if (partialCount > 0) {
    suggestions.push(`部分完成的任务建议明天先收尾，不要一直拖着。`);
  }
  if (totalActualMinutes > 180) {
    suggestions.push(
      `今天已经学了快 ${Math.round(totalActualMinutes / 60)} 个小时，注意让孩子早点休息。`
    );
  } else if (totalActualMinutes < 30 && total > 0) {
    suggestions.push(`今天实际投入偏少，明天可以试试固定一个「学习启动时间」。`);
  }

  const notableNotes = tasks
    .filter((t) => t.note && t.note.length > 0)
    .filter((t) => {
      const note = t.note!.toLowerCase();
      return (
        note.includes('不会') ||
        note.includes('不懂') ||
        note.includes('错') ||
        note.includes('掌握') ||
        note.includes('很棒') ||
        note.includes('感兴趣') ||
        note.includes('不耐烦') ||
        note.includes('难')
      );
    })
    .slice(0, 2)
    .map((t) => {
      if (t.statusLabel.includes('已完成')) {
        return `${t.focus}完成得不错，家长记录：${t.note}`;
      }
      if (t.statusLabel.includes('部分')) {
        return `${t.focus}只推进了一部分，家长记录：${t.note}`;
      }
      return `${t.focus}还没开始，家长记录：${t.note}`;
    });

  const parts = [opening];
  if (notableNotes.length > 0) {
    parts.push(notableNotes.join('；') + '。');
  }
  parts.push(suggestions[0] || '保持当前节奏，稳步前进。');

  return parts.filter(Boolean).join('');
}

async function callLLM(messages: LLMMessage[]): Promise<string | null> {
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
        max_tokens: 300,
      }),
    });

    if (!res.ok) {
      console.error(
        '[dailySummary] LLM request failed:',
        res.status,
        await res.text().catch(() => '')
      );
      return null;
    }

    const data = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const content = data.choices?.[0]?.message?.content?.trim();
    return content || null;
  } catch (err) {
    console.error('[dailySummary] LLM error:', err);
    return null;
  }
}

export async function generateDailySummary(input: DailySummaryInput): Promise<DailySummaryResult> {
  const messages: LLMMessage[] = [
    {
      role: 'system',
      content:
        '你是一位熟悉上海升学规划的家庭教育顾问，擅长用简洁、有温度的语言总结孩子每日学习情况，并给出 actionable 建议。',
    },
    { role: 'user', content: buildPrompt(input) },
  ];

  const llmResult = await callLLM(messages);
  if (llmResult) {
    return { summary: llmResult, source: 'llm' };
  }

  return { summary: buildRuleSummary(input), source: 'rule' };
}
