import type { AiConfigData } from './aiConfig';
import { aiFetch } from './ai/fetchWithResilience';
import type { ReadingAbilityId } from './subjects/readingLiteracy';

export type EvidenceType =
  | 'character_assessment'
  | 'independent_reading'
  | 'vocabulary_understanding'
  | 'discourse_structure'
  | 'reading_expression';

export type EvidenceStatus = 'pending' | 'confirmed' | 'rejected';

export interface EvidenceTypeMeta {
  label: string;
  description: string;
}

export const EVIDENCE_TYPE_META: Record<EvidenceType, EvidenceTypeMeta> = {
  character_assessment: {
    label: '人物评价',
    description: '对书中人物、事件有自己的看法并能说出理由',
  },
  independent_reading: {
    label: '自主阅读',
    description: '独立完成阅读，主动选书、持续阅读',
  },
  vocabulary_understanding: {
    label: '词汇理解',
    description: '理解词句含义，能解释词语、联系上下文',
  },
  discourse_structure: {
    label: '篇章结构',
    description: '梳理内容梗概、行文思路、结构布局',
  },
  reading_expression: {
    label: '阅读表达',
    description: '复述故事、表达观点、进行创作或应用',
  },
};

export interface EvidenceParseResult {
  type: EvidenceType;
  indicatorIds: ReadingAbilityId[];
  summary: string;
  confidence: number; // 0-100
}

export interface ReadingEvidenceItem {
  id: string;
  type: EvidenceType;
  status: EvidenceStatus;
  occurredAt: string;
  originalText: string;
  data: { summary?: string; confidence?: number } | null;
  indicatorIds: ReadingAbilityId[] | null;
  sourceType: string;
  createdAt: string;
}

const EVIDENCE_TYPES = Object.keys(EVIDENCE_TYPE_META) as EvidenceType[];

const PARSE_SYSTEM_PROMPT = `你是「趣学伴」阅读能力证据解析助手。家长会输入一段对孩子阅读行为的观察记录，你需要把它解析成结构化的能力证据。

可用的证据类型（type）：
${EVIDENCE_TYPES.map((t) => `- ${t}：${EVIDENCE_TYPE_META[t].label}（${EVIDENCE_TYPE_META[t].description}）`).join('\n')}

可用的阅读能力维度（indicatorIds）：
- recognition：认读能力（识别汉字、读准字音、理解词义）
- comprehension：理解能力（获取信息、解释信息、建构意义）
- appreciation：鉴赏能力（语言艺术、思想内容、逻辑结构的审美评鉴）
- evaluation：评价能力（思想性、科学性、逻辑性的判断评议）
- application：应用能力（将阅读所得用于解决具体问题）
- innovation：创新能力（重组、改造、拓展，形成新思路）

输出要求：
1. 必须返回合法 JSON，不要 markdown 代码块
2. type 必须从上述证据类型中选择一个最匹配的
3. indicatorIds 选择 1-3 个最相关的阅读能力维度
4. summary 用一句话（不超过 40 字）概括这条证据证明了什么
5. confidence 为 0-100 整数，表示你对解析结果的把握程度
6. 如果输入内容与阅读能力无关（如纯日常闲聊），返回 { "type": null, "indicatorIds": [], "summary": "", "confidence": 0 }

输出 JSON 结构：
{
  "type": "character_assessment",
  "indicatorIds": ["evaluation", "comprehension"],
  "summary": "能复述完整情节并分析人物性格，体现评价与理解能力",
  "confidence": 85
}`;

export async function parseEvidenceWithAI(
  text: string,
  config: AiConfigData
): Promise<EvidenceParseResult | null> {
  if (!config.apiKey) {
    throw new Error('AI API Key 未配置');
  }
  if (!config.isEnabled) {
    throw new Error('AI 解析功能已禁用');
  }

  const response = await aiFetch(config.apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      model: config.model,
      messages: [
        { role: 'system', content: PARSE_SYSTEM_PROMPT },
        { role: 'user', content: text },
      ],
      temperature: 0.3,
      response_format: { type: 'json_object' },
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`AI API 错误: ${response.status} ${body}`);
  }

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const content = data.choices?.[0]?.message?.content;
  if (!content) return null;

  const parsed = JSON.parse(content) as {
    type?: EvidenceType | null;
    indicatorIds?: ReadingAbilityId[];
    summary?: string;
    confidence?: number;
  };

  if (!parsed.type || !EVIDENCE_TYPES.includes(parsed.type)) return null;

  return {
    type: parsed.type,
    indicatorIds: (parsed.indicatorIds ?? []).filter((id) =>
      ['recognition', 'comprehension', 'appreciation', 'evaluation', 'application', 'innovation'].includes(id)
    ),
    summary: parsed.summary ?? '',
    confidence: Math.max(0, Math.min(100, parsed.confidence ?? 0)),
  };
}
