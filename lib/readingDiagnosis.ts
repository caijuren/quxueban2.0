// AI 阅读诊断：读取阅读记录 + 能力证据，生成基于《中国青少年阅读素养框架》的诊断报告
import type { AiConfigData } from './aiConfig';
import { aiFetch } from './ai/fetchWithResilience';
import {
  READING_ABILITIES,
  getPhaseByLadder,
  getReadingLadderByGrade,
  getReadingTargetByGrade,
  type ReadingAbilityId,
} from './subjects/readingLiteracy';

export interface ReadingDiagnosisInput {
  childName: string;
  grade: number;
  stats: {
    totalBooks: number;
    readBooks: number;
    readingBooks: number;
    totalMinutes: number;
    totalPages: number;
    recordCount: number;
    recent30DaysMinutes: number;
    recent30DaysDays: number;
    avgDailyMinutes: number;
  };
  records: Array<{
    title: string;
    date: string;
    minutes: number;
    pages: number | null;
    effect: string | null;
    note: string | null;
  }>;
  evidences: Array<{
    type: string;
    summary: string;
    indicatorIds: string[];
  }>;
  bookLiteracyTags: string[];
}

export interface ReadingDimensionScore {
  id: ReadingAbilityId;
  score: number;
  comment: string;
}

export interface ReadingDiagnosisResult {
  overallScore: number;
  summary: string;
  currentLadder: number;
  dimensions: ReadingDimensionScore[];
  strengths: string[];
  weaknesses: string[];
  nextStep: string;
  habits: {
    dailyMinutes: number;
    targetMinutes: number;
    frequency: string;
  };
  suggestions: Array<{
    title: string;
    description: string;
    priority: 'must' | 'should' | 'optional';
  }>;
}

const DIM_IDS = READING_ABILITIES.map((a) => a.id);

export async function generateReadingDiagnosis(
  input: ReadingDiagnosisInput,
  config: AiConfigData
): Promise<ReadingDiagnosisResult> {
  if (!config.apiKey) {
    throw new Error('AI API Key 未配置');
  }
  if (!config.isEnabled) {
    throw new Error('AI 诊断功能已禁用');
  }

  const prompt = buildDiagnosisPrompt(input);

  const response = await aiFetch(config.apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      model: config.model,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: prompt },
      ],
      temperature: 0.5,
      response_format: { type: 'json_object' },
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`AI API 错误: ${response.status} ${text}`);
  }

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const content = data.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error('AI 返回内容为空');
  }

  const parsed = JSON.parse(content) as ReadingDiagnosisResult;
  return normalizeResult(parsed, input);
}

const SYSTEM_PROMPT = `你是「趣学伴」的儿童阅读素养诊断专家，熟悉教育部行业标准《中国青少年阅读素养框架》（JY/T 0663—2026）。

你的任务是根据孩子的年级、阅读记录、能力证据和书籍素养标签，生成一份结构化阅读诊断报告。报告要具体到家长能直接行动，避免空泛建议。

输出要求：
1. 必须返回合法的 JSON 对象，不要任何 markdown 代码块标记
2. 所有评分 0-100 之间的整数
3. 文字简洁、可执行，每段不超过 60 字
4. 建议优先级只使用 must/should/optional
5. 必须基于提供的真实数据（阅读记录、能力证据、书籍标签）评分，不要编造孩子没有的表现
6. 数据不足时，基于年级标准节奏推断，并在 comment 中说明推断依据
7. currentLadder 必须为 1-12 的整数，且优先参考提供的「年级基线梯级」与「已读书籍最高梯级」取合理值
8. dimensions 必须包含且仅包含 6 个维度：recognition/comprehension/appreciation/evaluation/application/innovation

输出 JSON 结构：
{
  "overallScore": 78,
  "summary": "一句话总体判断",
  "currentLadder": 3,
  "dimensions": [
    { "id": "recognition", "score": 75, "comment": "..." },
    { "id": "comprehension", "score": 68, "comment": "..." },
    { "id": "appreciation", "score": 60, "comment": "..." },
    { "id": "evaluation", "score": 55, "comment": "..." },
    { "id": "application", "score": 62, "comment": "..." },
    { "id": "innovation", "score": 58, "comment": "..." }
  ],
  "strengths": ["优势1", "优势2"],
  "weaknesses": ["薄弱1", "薄弱2"],
  "nextStep": "下一梯级的具体行动建议（一段话）",
  "habits": {
    "dailyMinutes": 25,
    "targetMinutes": 30,
    "frequency": "阅读频率评价（如：每周 4 次，节奏较稳定）"
  },
  "suggestions": [
    { "title": "...", "description": "...", "priority": "must" }
  ]
}`;

function buildDiagnosisPrompt(input: ReadingDiagnosisInput): string {
  const { childName, grade, stats, records, evidences, bookLiteracyTags } = input;
  const gradeLadder = getReadingLadderByGrade(grade);
  const target = getReadingTargetByGrade(grade);

  const recordLines =
    records.length > 0
      ? records
          .map(
            (r) =>
              `- ${r.date}《${r.title}》${r.minutes} 分钟${r.pages ? `，${r.pages} 页` : ''}${
                r.effect ? `，效果：${r.effect}` : ''
              }${r.note ? `，备注：${r.note}` : ''}`
          )
          .join('\n')
      : '（暂无阅读记录）';

  const evidenceLines =
    evidences.length > 0
      ? evidences
          .map((e) => `- [${e.type}] ${e.summary}（关联维度：${e.indicatorIds.join('、') || '无'}）`)
          .join('\n')
      : '（暂无能力证据）';

  const tagLines =
    bookLiteracyTags.length > 0
      ? bookLiteracyTags.join('、')
      : '（暂无书籍素养标签）';

  return `当前日期：${new Date().toISOString().slice(0, 10)}

孩子信息：
- 姓名：${childName}
- 年级：${grade}年级
- 年级基线梯级：第 ${gradeLadder} 梯
- 年级量化目标：${target ? `日均约 ${target.dailyMinutes} 分钟${target.annualChars > 0 ? `，年均 ≥ ${target.annualChars} 万字` : ''}` : '暂无'}

阅读统计：
- 藏书 ${stats.totalBooks} 本，已读 ${stats.readBooks} 本，在读 ${stats.readingBooks} 本
- 累计阅读 ${stats.recordCount} 次，共 ${stats.totalMinutes} 分钟，${stats.totalPages} 页
- 近 30 天阅读 ${stats.recent30DaysDays} 天，共 ${stats.recent30DaysMinutes} 分钟
- 近 30 天日均约 ${stats.avgDailyMinutes} 分钟（对比年级目标日均 ${target?.dailyMinutes ?? '—'} 分钟）

书籍素养标签分布：${tagLines}

最近阅读记录（最多 50 条）：
${recordLines}

已确认的能力证据：
${evidenceLines}

请基于以上真实数据生成诊断报告。注意：
1. currentLadder 参考「年级基线梯级」和已读书籍的梯级标注，结合日均时长与目标的差距合理取值
2. 每个维度的 comment 要说明当前水平与下一梯级的差距
3. strengths/weaknesses 各 2-3 条，必须能从数据中找到依据
4. nextStep 给出进入下一梯级的具体行动（选书方向、阅读方法、亲子共读方式等）
5. habits 的 dailyMinutes 用近 30 天日均，targetMinutes 用年级目标值`;
}

function normalizeResult(
  parsed: ReadingDiagnosisResult,
  input: ReadingDiagnosisInput
): ReadingDiagnosisResult {
  const gradeLadder = getReadingLadderByGrade(input.grade);

  const clamp = (n: unknown, fallback: number) => {
    const v = typeof n === 'number' && Number.isFinite(n) ? n : fallback;
    return Math.max(0, Math.min(100, Math.round(v)));
  };

  const dimMap = new Map<ReadingAbilityId, number>();
  if (Array.isArray(parsed.dimensions)) {
    parsed.dimensions.forEach((d) => {
      if (DIM_IDS.includes(d.id)) dimMap.set(d.id, clamp(d.score, 50));
    });
  }
  const dimensions: ReadingDimensionScore[] = READING_ABILITIES.map((a) => ({
    id: a.id,
    score: dimMap.get(a.id) ?? 50,
    comment:
      parsed.dimensions?.find((d) => d.id === a.id)?.comment?.slice(0, 80) ??
      '数据不足，按年级标准节奏推断。',
  }));

  const ladderRaw = parsed.currentLadder;
  const currentLadder =
    typeof ladderRaw === 'number' && Number.isFinite(ladderRaw)
      ? Math.max(1, Math.min(12, Math.round(ladderRaw)))
      : gradeLadder;

  const target = getReadingTargetByGrade(input.grade);

  return {
    overallScore: clamp(parsed.overallScore, 60),
    summary: parsed.summary?.slice(0, 120) || `${input.childName}的阅读素养整体处于${getPhaseByLadder(currentLadder)}阶段。`,
    currentLadder,
    dimensions,
    strengths: Array.isArray(parsed.strengths)
      ? parsed.strengths.map((s) => String(s).slice(0, 60)).slice(0, 3)
      : [],
    weaknesses: Array.isArray(parsed.weaknesses)
      ? parsed.weaknesses.map((s) => String(s).slice(0, 60)).slice(0, 3)
      : [],
    nextStep: parsed.nextStep?.slice(0, 200) || '建议保持稳定的阅读节奏，逐步增加阅读时长与难度。',
    habits: {
      dailyMinutes: input.stats.avgDailyMinutes,
      targetMinutes: target?.dailyMinutes ?? 0,
      frequency:
        parsed.habits?.frequency?.slice(0, 60) ||
        (input.stats.recent30DaysDays > 0
          ? `近 30 天阅读 ${input.stats.recent30DaysDays} 天`
          : '近 30 天暂无阅读记录'),
    },
    suggestions: Array.isArray(parsed.suggestions)
      ? parsed.suggestions
          .filter((s) => ['must', 'should', 'optional'].includes(s.priority))
          .map((s) => ({
            title: String(s.title).slice(0, 40),
            description: String(s.description).slice(0, 80),
            priority: s.priority as 'must' | 'should' | 'optional',
          }))
          .slice(0, 5)
      : [],
  };
}

export function getFallbackReadingDiagnosis(input: ReadingDiagnosisInput): ReadingDiagnosisResult {
  const { childName, grade, stats, evidences, bookLiteracyTags } = input;
  const gradeLadder = getReadingLadderByGrade(grade);
  const target = getReadingTargetByGrade(grade);

  const dimCount = new Map<ReadingAbilityId, number>();
  READING_ABILITIES.forEach((a) => dimCount.set(a.id, 0));
  evidences.forEach((e) => {
    e.indicatorIds.forEach((id) => {
      if (dimCount.has(id as ReadingAbilityId)) {
        dimCount.set(id as ReadingAbilityId, (dimCount.get(id as ReadingAbilityId) ?? 0) + 1);
      }
    });
  });
  bookLiteracyTags.forEach((t) => {
    if (dimCount.has(t as ReadingAbilityId)) {
      dimCount.set(t as ReadingAbilityId, (dimCount.get(t as ReadingAbilityId) ?? 0) + 1);
    }
  });

  const totalEvidence = Array.from(dimCount.values()).reduce((s, v) => s + v, 0);
  const dimensions: ReadingDimensionScore[] = READING_ABILITIES.map((a) => {
    const count = dimCount.get(a.id) ?? 0;
    const score = totalEvidence === 0 ? 50 : Math.min(90, 50 + count * 10);
    return {
      id: a.id,
      score,
      comment:
        totalEvidence === 0
          ? '暂无证据，请录入能力证据或阅读记录后重新生成。'
          : `已有 ${count} 条相关证据${count === 0 ? '，建议补充该维度观察记录' : ''}。`,
    };
  });

  const targetMinutes = target?.dailyMinutes ?? 0;
  const gap = targetMinutes - stats.avgDailyMinutes;
  const habitOk = stats.avgDailyMinutes >= targetMinutes;

  return {
    overallScore: Math.max(40, Math.min(85, 60 + (habitOk ? 10 : -10) + (totalEvidence > 0 ? 5 : 0))),
    summary: `AI 诊断服务暂不可用，这是基于${childName}的阅读记录与证据的本地评估。`,
    currentLadder: gradeLadder,
    dimensions,
    strengths:
      stats.avgDailyMinutes >= targetMinutes
        ? ['阅读时长达到年级目标', '已积累一定阅读记录']
        : totalEvidence > 0
          ? ['已积累能力证据，可支撑能力定位']
          : [],
    weaknesses:
      gap > 0
        ? [`日均阅读 ${stats.avgDailyMinutes} 分钟，低于年级目标 ${targetMinutes} 分钟`]
        : stats.recordCount === 0
          ? ['暂无阅读记录，无法评估阅读习惯']
          : [],
    nextStep: `建议保持每周稳定阅读，日均向 ${targetMinutes} 分钟靠拢；优先补齐薄弱维度（${dimensions
      .filter((d) => d.score < 60)
      .map((d) => READING_ABILITIES.find((a) => a.id === d.id)?.name)
      .filter(Boolean)
      .join('、') || '暂无'}）的观察记录。`,
    habits: {
      dailyMinutes: stats.avgDailyMinutes,
      targetMinutes,
      frequency:
        stats.recent30DaysDays > 0
          ? `近 30 天阅读 ${stats.recent30DaysDays} 天，共 ${stats.recent30DaysMinutes} 分钟`
          : '近 30 天暂无阅读记录',
    },
    suggestions: [
      {
        title: '配置 AI 服务',
        description: '在「AI 设置」中配置并启用 DeepSeek/OpenAI 后，可获得更精准的阅读诊断。',
        priority: 'must',
      },
      {
        title: '补充阅读记录',
        description: '每次阅读后在「阅读记录」中打卡，记录时长、页数与表现。',
        priority: 'should',
      },
      {
        title: '录入能力证据',
        description: '在「能力证据」中记录孩子的阅读表现，帮助 AI 更准确评估 6 个维度。',
        priority: 'should',
      },
    ],
  };
}
