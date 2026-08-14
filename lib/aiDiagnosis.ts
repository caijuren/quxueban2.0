import { Child, gradeToStage } from './children';
import {
  RoutePlan,
  getRouteById,
  getRoutesByStage,
  sgKeyResults,
  sgSubjectPaths,
  middleSchoolPlans,
} from './plans';
import type { AiConfigData } from './aiConfig';
import {
  READING_ABILITIES,
  READING_PHASES,
  READING_TARGETS,
  type ReadingLiteracyAssessment,
} from './subjects/readingLiteracy';

export interface DiagnosisInput {
  child: Child;
  plans: Array<{
    id: string;
    name: string;
    type: string;
    status: string;
    stage: string;
    description?: string | null;
    requirements?: unknown;
    milestones?: unknown;
    targets?: unknown;
    probability?: number;
  }>;
  currentDate: string;
}

export interface SubjectHealth {
  subject: string;
  score: number;
  status: string;
  comment: string;
}

export interface RiskItem {
  title: string;
  level: 'high' | 'medium' | 'low';
  description: string;
}

export interface SuggestionItem {
  title: string;
  description: string;
  priority: 'must' | 'should' | 'optional';
}

export interface MonthlyFocusItem {
  title: string;
  description: string;
}

export interface DiagnosisResult {
  overallScore: number;
  summary: string;
  routeMatch: {
    score: number;
    level: string;
    reason: string;
  };
  subjectHealth: SubjectHealth[];
  risks: RiskItem[];
  suggestions: SuggestionItem[];
  monthlyFocus: MonthlyFocusItem[];
  readingLiteracy?: ReadingLiteracyAssessment;
}

export async function generateDiagnosis(
  input: DiagnosisInput,
  config: AiConfigData
): Promise<DiagnosisResult> {
  if (!config.apiKey) {
    throw new Error('AI API Key 未配置');
  }

  if (!config.isEnabled) {
    throw new Error('AI 检视功能已禁用');
  }

  const prompt = buildPrompt(input);

  const response = await fetch(config.apiUrl, {
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
      temperature: 0.6,
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

  return JSON.parse(content) as DiagnosisResult;
}

const SYSTEM_PROMPT = `你是「趣学伴」AI 升学规划专家，熟悉上海小升初（三公、民办摇号、公办对口）和中考升学路径。

你的任务是根据孩子的基础信息、选择的升学路线、当前时间，生成一份结构化诊断报告。报告要具体到家长能直接行动，避免空泛建议。

输出要求：
1. 必须返回合法的 JSON 对象，不要任何 markdown 代码块标记
2. 所有评分 0-100 之间的整数
3. 文字简洁、 actionable，每段不超过 60 字
4. 风险等级只使用 high/medium/low
5. 建议优先级只使用 must/should/optional
6. 如果缺少某些数据，基于年龄和路线标准给出"按标准节奏应该做到什么"的判断

输出 JSON 结构：
{
  "overallScore": 78,
  "summary": "一句话总体判断",
  "routeMatch": { "score": 75, "level": "中等", "reason": "..." },
  "subjectHealth": [
    { "subject": "英语", "score": 85, "status": "良好", "comment": "..." }
  ],
  "risks": [
    { "title": "...", "level": "high", "description": "..." }
  ],
  "suggestions": [
    { "title": "...", "description": "...", "priority": "must" }
  ],
  "monthlyFocus": [
    { "title": "...", "description": "..." }
  ],
  "readingLiteracy": {
    "ladder": 3,
    "dimensions": [
      { "id": "recognition", "score": 75, "comment": "..." },
      { "id": "comprehension", "score": 68, "comment": "..." },
      { "id": "appreciation", "score": 60, "comment": "..." },
      { "id": "evaluation", "score": 55, "comment": "..." },
      { "id": "application", "score": 62, "comment": "..." },
      { "id": "innovation", "score": 58, "comment": "..." }
    ]
  }
}

readingLiteracy 字段说明（仅当孩子处于小升初/中考阶段时输出，高考阶段可省略）：
- ladder：阅读素养当前所处梯级（1-12，小学阶段通常 1-6）
- dimensions：6 个阅读能力维度的评分（0-100），id 必须严格使用
  recognition/comprehension/appreciation/evaluation/application/innovation 之一
- 每个维度 comment 用一句话说明当前水平与下一梯级的差距`;

function buildPrompt(input: DiagnosisInput): string {
  const { child, plans, currentDate } = input;
  const stage = gradeToStage(child.grade);
  const activePlan = plans.find((p) => p.status === 'active') || plans[0];
  const routeFromLib = child.routeId ? getRouteById(child.routeId) : undefined;

  const routeContext = activePlan
    ? formatPlanContext(activePlan)
    : routeFromLib
      ? formatRoutePlanContext(routeFromLib)
      : formatStageRoutesContext(stage);

  const subjectContext = stage === '小升初' ? formatPrimarySubjects() : formatMiddleSubjects();
  const readingContext = formatReadingLiteracyContext(stage);

  return `当前日期：${currentDate}

孩子信息：
- 姓名：${child.name}
- 年级：${child.grade}年级
- 升学阶段：${stage}
- 目标学校：${child.targetSchool || '未设置'}
- 当前学校：${child.currentSchool || '未设置'}
- 已选路线：${child.routeId || '未选择'}
- 家长备注：${child.notes || '无'}

已选/推荐路线信息：
${routeContext}

学科标准节奏：
${subjectContext}

阅读素养评估框架（用于生成 readingLiteracy 字段）：
${readingContext}

请基于以上信息生成诊断报告。注意：
1. 如果孩子还没有具体成绩/证书数据，请根据年级判断"按标准节奏应该完成什么"，并指出差距
2. 给出的建议要具体到本周或本月可以启动的行动
3. 不要编造孩子没有的证书或成绩
4. readingLiteracy 的评分要结合孩子的年级和路线节奏合理推断，并给出与下一梯级的差距说明`;
}

function formatReadingLiteracyContext(stage: '小升初' | '中考' | '高考'): string {
  if (stage === '高考') {
    return '该阶段不强制输出 readingLiteracy 字段。';
  }

  const phases = READING_PHASES.map(
    (p) => `${p.phase}（${p.ladders[0]}-${p.ladders[1]} 梯，${p.stage}）`
  ).join('；');

  const dimensions = READING_ABILITIES.map(
    (a) =>
      `- ${a.name}（${a.groupName}）：${a.ladders
        .filter((l) => l.ladder <= 6)
        .map((l) => `${l.ladder}梯：${l.description}`)
        .join('；')}`
  ).join('\n');

  const targets = READING_TARGETS.filter((t) => t.dailyMinutes > 0)
    .map((t) => `${t.ladder}梯：日均约 ${t.dailyMinutes} 分钟${t.annualChars > 0 ? `，年均 ≥ ${t.annualChars} 万字` : ''}`)
    .join('；');

  return `四阶十二梯：${phases}

6 个阅读能力维度（1-6 梯行为描述）：
${dimensions}

量化阅读目标（表 20）：
${targets}`;
}

function formatPlanContext(plan: DiagnosisInput['plans'][0]): string {
  const reqs = Array.isArray(plan.requirements) ? plan.requirements.join('、') : '无';
  const milestones = Array.isArray(plan.milestones)
    ? plan.milestones
        .map((m: { time?: string; task?: string }) => `- ${m.time || ''}: ${m.task || ''}`)
        .join('\n')
    : '无';

  return `- 路线名称：${plan.name}\n- 类型：${plan.type}\n- 成功概率参考：${plan.probability ?? 50}%\n- 要求：${reqs}\n- 关键节点：\n${milestones}`;
}

function formatRoutePlanContext(route: RoutePlan): string {
  return `- 路线名称：${route.name}\n- 类型：${route.type}\n- 成功概率参考：${route.probability}%\n- 要求：${route.requirements.join('、')}\n- 关键节点：\n${route.milestones.map((m) => `- ${m.time}: ${m.task}`).join('\n')}`;
}

function formatStageRoutesContext(stage: '小升初' | '中考' | '高考'): string {
  const routes = getRoutesByStage(stage);
  if (routes.length === 0) return '该阶段暂无路线数据';

  return routes
    .map(
      (r) =>
        `- ${r.name}（${r.type === 'primary' ? '主路线' : '备选'}，概率参考 ${r.probability}%）：${r.requirements.join('、')}`
    )
    .join('\n');
}

function formatPrimarySubjects(): string {
  const keyResults = sgKeyResults
    .map(
      (k) =>
        `- ${k.time}: ${k.title} → ${k.result}${k.fallbackSignal ? `（${k.fallbackSignal}）` : ''}`
    )
    .join('\n');

  const subjects = sgSubjectPaths
    .map((s) => `- ${s.name}：${s.phases.map((p) => `${p.time} ${p.milestone}`).join('；')}`)
    .join('\n');

  return `关键结果节点：\n${keyResults}\n\n学科路径：\n${subjects}`;
}

function formatMiddleSubjects(): string {
  return middleSchoolPlans
    .map(
      (p) =>
        `- ${p.name}（概率 ${p.probability}%）：${p.requirements.join('、')}；关键节点：${p.milestones.map((m) => `${m.time} ${m.task}`).join('，')}`
    )
    .join('\n');
}

export function getFallbackDiagnosis(input: DiagnosisInput): DiagnosisResult {
  const { child } = input;
  const stage = gradeToStage(child.grade);

  return {
    overallScore: 60,
    summary: `AI 诊断服务暂时不可用，这是基于${child.name}年级和${stage}阶段的默认建议。`,
    routeMatch: {
      score: 60,
      level: '待评估',
      reason: '缺少 DeepSeek API 配置或调用失败，无法计算精确匹配度。',
    },
    subjectHealth: [
      {
        subject: '英语',
        score: 60,
        status: '待评估',
        comment: '请录入英语证书或测试成绩后重新生成。',
      },
      { subject: '数学', score: 60, status: '待评估', comment: '请录入奥数/竞赛经历后重新生成。' },
      {
        subject: '语文',
        score: 60,
        status: '待评估',
        comment: '请录入语文积累和获奖情况后重新生成。',
      },
    ],
    risks: [
      {
        title: '数据尚未录入',
        level: 'medium',
        description: '当前缺少具体学习数据，AI 无法给出精确判断。',
      },
    ],
    suggestions: [
      {
        title: '完善孩子档案',
        description: '在设置中补充目标学校、当前学校和备注信息。',
        priority: 'must',
      },
      {
        title: '录入学习成绩/证书',
        description: '添加 KET/PET/小托福/AMC8 等成绩，诊断会更准确。',
        priority: 'should',
      },
    ],
    monthlyFocus: [
      {
        title: '确认升学目标',
        description: '和孩子一起确定 1-2 个主攻路线和 1 个保底路线。',
      },
    ],
    readingLiteracy: {
      ladder: 3,
      dimensions: [
        { id: 'recognition', score: 60, comment: '待评估：请补充识字量与朗读表现。' },
        { id: 'comprehension', score: 60, comment: '待评估：请补充阅读理解答题情况。' },
        { id: 'appreciation', score: 60, comment: '待评估：请补充阅读感受与审美表现。' },
        { id: 'evaluation', score: 60, comment: '待评估：请补充对文本的判断与评价。' },
        { id: 'application', score: 60, comment: '待评估：请补充阅读所得的应用情况。' },
        { id: 'innovation', score: 60, comment: '待评估：请补充创意表达与提问情况。' },
      ],
    },
  };
}
