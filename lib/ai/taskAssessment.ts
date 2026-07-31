import { Child } from '../children';
import {
  TaskCategory,
  TaskType,
  TaskFrequency,
  WeeklyTaskItem,
  TaskTemplate,
  Capability,
} from '../storage.types';
import { parseDurationMinutes } from '../weeklyTasks';

export interface AssessmentTaskInput {
  title: string;
  category: TaskCategory;
  difficulty?: 'easy' | 'medium' | 'hard' | null;
  duration: string;
  taskType?: TaskType;
  frequency?: TaskFrequency;
  routeTags?: string[];
  milestoneTag?: string | null;
  capabilityLinks?: { capabilityName?: string; weight?: number }[];
}

export interface AssessmentContext {
  existingTasks?: WeeklyTaskItem[];
  existingTemplates?: TaskTemplate[];
  capabilities?: Capability[];
  selectedDay?: string;
}

export type AssessmentVerdict = 'good' | 'caution' | 'risk';

export interface RationalityDimension {
  id: string;
  name: string;
  score: number;
  label: AssessmentVerdict;
  reason: string;
}

export interface TaskRationalityAssessment {
  overallScore: number;
  verdict: AssessmentVerdict;
  summary: string;
  dimensions: RationalityDimension[];
  suggestions: string[];
}

const ROUTE_PRIORITY_CAPS: Record<string, string[]> = {
  sanchu_gongban: ['奥数思维', '逻辑思维', '阅读', '听力', '词汇语法', '古诗文', '表达能力'],
  sanchu_minban: ['奥数思维', '逻辑思维', '阅读', '听力', '词汇语法', '古诗文', '表达能力'],
  sanchu_guoji: ['奥数思维', '逻辑思维', '阅读', '听力', '词汇语法', '古诗文', '表达能力'],
  zhongkao_putong: ['计算能力', '逻辑思维', '语文基础', '词汇语法', '应试技巧', '古诗文'],
  zhongkao_tese: ['计算能力', '逻辑思维', '语文基础', '词汇语法', '应试技巧', '古诗文'],
  gaokao_zongping: ['逻辑思维', '阅读理解', '写作表达', '应试技巧', '信息收集'],
  gaokao_qiangji: ['逻辑思维', '空间想象', '阅读理解', '写作表达', '应试技巧'],
  gongban_duikou: ['自主学习', '时间管理', '专注力'],
};

const MILESTONE_URGENCY: Record<string, Record<string, { warning: string }>> = {
  AMC8: {
    sanchu: { warning: 'AMC8 建议尽早启动，持续冲刺 20+' },
  },
  'TOEFL Junior': {
    sanchu: { warning: '小托福建议提前首考，冲刺 850+' },
  },
  PET: {
    sanchu: { warning: 'PET 建议持续积累，冲刺卓越' },
  },
  KET: {
    sanchu: { warning: 'KET 建议尽早完成' },
  },
  古诗文大会: {
    sanchu: { warning: '古诗文大会建议持续积累' },
  },
};

function clamp(num: number, min: number, max: number) {
  return Math.max(min, Math.min(max, num));
}

function avgDailyMinutes(task: AssessmentTaskInput): number {
  const minutes = parseDurationMinutes(task.duration);
  const freq = task.frequency ?? 'once';
  switch (freq) {
    case 'daily':
      return minutes;
    case 'weekly':
      return minutes / 7;
    case 'custom':
      return minutes / 7;
    case 'once':
    default:
      return minutes / 7;
  }
}

function textSimilarity(a: string, b: string): number {
  const sa = a.toLowerCase().replace(/\s+/g, '');
  const sb = b.toLowerCase().replace(/\s+/g, '');
  if (!sa || !sb) return 0;
  if (sa === sb) return 1;
  if (sa.includes(sb) || sb.includes(sa)) return 0.8;
  const arrA = sa.split('');
  const setB = new Set(sb.split(''));
  const intersection = arrA.filter((x) => setB.has(x));
  const uniqueIntersection = new Set(intersection);
  return uniqueIntersection.size / Math.max(new Set(arrA).size, setB.size);
}

function assessRouteFit(child: Child, task: AssessmentTaskInput): RationalityDimension {
  const tags = task.routeTags ?? [];
  if (tags.length === 0) {
    return {
      id: 'routeFit',
      name: '路线匹配度',
      score: 70,
      label: 'good',
      reason: '通用任务，不绑定特定路线，可作为日常补充。',
    };
  }
  if (child.routeId && tags.includes(child.routeId)) {
    return {
      id: 'routeFit',
      name: '路线匹配度',
      score: 95,
      label: 'good',
      reason: '任务与孩子当前主攻路线高度匹配。',
    };
  }
  return {
    id: 'routeFit',
    name: '路线匹配度',
    score: 25,
    label: 'risk',
    reason: `任务面向「${tags.join(' / ')}」路线，与孩子当前路线不符，可能分散精力。`,
  };
}

function assessCapabilityRelevance(child: Child, task: AssessmentTaskInput): RationalityDimension {
  const links = task.capabilityLinks ?? [];
  const priorityCaps = child.routeId ? ROUTE_PRIORITY_CAPS[child.routeId] ?? [] : [];
  if (links.length === 0) {
    const baseScore = priorityCaps.length > 0 ? 45 : 65;
    return {
      id: 'capabilityRelevance',
      name: '能力关联度',
      score: baseScore,
      label: baseScore >= 60 ? 'good' : 'caution',
      reason: '未关联具体能力，建议补充能力标签以便长线追踪。',
    };
  }
  const names = links.map((l) => l.capabilityName ?? '').filter(Boolean);
  const hits = names.filter((n) => priorityCaps.includes(n)).length;
  if (priorityCaps.length === 0) {
    return {
      id: 'capabilityRelevance',
      name: '能力关联度',
      score: 80,
      label: 'good',
      reason: `已关联 ${names.join('、')} 能力，可作为通用素养积累。`,
    };
  }
  if (hits > 0) {
    return {
      id: 'capabilityRelevance',
      name: '能力关联度',
      score: 90,
      label: 'good',
      reason: `关联了路线核心能力（${priorityCaps.filter((p) => names.includes(p)).join('、')}）。`,
    };
  }
  return {
    id: 'capabilityRelevance',
    name: '能力关联度',
    score: 55,
    label: 'caution',
    reason: `已关联能力与当前路线核心能力不完全匹配，核心能力建议关注：${priorityCaps.slice(0, 3).join('、')}。`,
  };
}

function assessLoadRationality(
  _child: Child,
  task: AssessmentTaskInput,
  context: AssessmentContext
): RationalityDimension {
  const dayLimit = 120;
  const existing = context.existingTasks ?? [];

  let currentDayMinutes = 0;
  if (context.selectedDay) {
    currentDayMinutes = existing
      .filter((t) => t.day === context.selectedDay)
      .reduce((sum, t) => sum + parseDurationMinutes(t.duration), 0);
  } else {
    const total = existing.reduce((sum, t) => sum + parseDurationMinutes(t.duration), 0);
    currentDayMinutes = total / 7;
  }

  const added = parseDurationMinutes(task.duration);
  const projected = currentDayMinutes + added;
  const ratio = projected / dayLimit;
  const score = clamp(Math.round(100 - (ratio - 0.6) * 100), 20, 100);

  if (ratio <= 0.7) {
    return {
      id: 'loadRationality',
      name: '负荷合理性',
      score,
      label: 'good',
      reason: `预计每日约 ${Math.round(projected)} 分钟，负荷轻松。`,
    };
  }
  if (ratio <= 1) {
    return {
      id: 'loadRationality',
      name: '负荷合理性',
      score,
      label: 'good',
      reason: `预计每日约 ${Math.round(projected)} 分钟，在合理范围内。`,
    };
  }
  if (ratio <= 1.3) {
    return {
      id: 'loadRationality',
      name: '负荷合理性',
      score,
      label: 'caution',
      reason: `预计每日约 ${Math.round(projected)} 分钟，接近建议上限 ${dayLimit} 分钟。`,
    };
  }
  return {
    id: 'loadRationality',
    name: '负荷合理性',
    score,
    label: 'risk',
    reason: `预计每日约 ${Math.round(projected)} 分钟，明显超过建议上限 ${dayLimit} 分钟，容易引发疲劳。`,
  };
}

function assessDifficultyRationality(child: Child, task: AssessmentTaskInput): RationalityDimension {
  const difficulty = task.difficulty ?? 'medium';
  const isSanchu = child.routeId?.startsWith('sanchu_');
  const isZhongkao = child.routeId?.startsWith('zhongkao_');

  if (difficulty === 'easy') {
    return {
      id: 'difficultyRationality',
      name: '难度合理性',
      score: 85,
      label: 'good',
      reason: '基础难度适合巩固，风险低。',
    };
  }

  if (difficulty === 'hard') {
    if (isSanchu && task.category === 'ability') {
      return {
        id: 'difficultyRationality',
        name: '难度合理性',
        score: 90,
        label: 'good',
        reason: '高难度任务与三公路线冲刺要求相符。',
      };
    }
    if (isZhongkao && task.category === 'ability') {
      return {
        id: 'difficultyRationality',
        name: '难度合理性',
        score: 88,
        label: 'good',
        reason: '中考路线需要能力拓展训练。',
      };
    }
    return {
      id: 'difficultyRationality',
      name: '难度合理性',
      score: 65,
      label: 'caution',
      reason: '高难度任务需确认孩子当前基础是否跟得上。',
    };
  }

  return {
    id: 'difficultyRationality',
    name: '难度合理性',
    score: 85,
    label: 'good',
    reason: '提高难度与大多数阶段匹配，较为稳妥。',
  };
}

function assessRedundancy(
  task: AssessmentTaskInput,
  context: AssessmentContext
): RationalityDimension {
  const existing = context.existingTasks ?? [];
  const templates = context.existingTemplates ?? [];
  const taskTitle = task.title;

  const matches = [
    ...existing.map((t) => t.focus),
    ...templates.map((t) => t.title),
  ].filter((text) => textSimilarity(taskTitle, text) >= 0.7);

  if (matches.length === 0) {
    return {
      id: 'redundancy',
      name: '冗余检测',
      score: 95,
      label: 'good',
      reason: '未检测到重复或高度相似的任务。',
    };
  }
  if (matches.length === 1) {
    return {
      id: 'redundancy',
      name: '冗余检测',
      score: 55,
      label: 'caution',
      reason: `与已有任务「${matches[0]}」高度相似，建议确认是否重复安排。`,
    };
  }
  return {
    id: 'redundancy',
    name: '冗余检测',
    score: 25,
    label: 'risk',
    reason: `检测到 ${matches.length} 项相似任务，可能存在冗余。`,
  };
}

function assessMilestoneProgress(
  child: Child,
  task: AssessmentTaskInput,
  context: AssessmentContext
): RationalityDimension {
  const taskType = task.taskType ?? 'daily';
  if (taskType !== 'milestone') {
    return {
      id: 'milestoneProgress',
      name: '里程碑进度',
      score: 80,
      label: 'good',
      reason: '非里程碑任务，暂不做长线节点判断。',
    };
  }

  const milestone = task.milestoneTag || task.title;
  const existingMilestones = (context.existingTasks ?? []).filter(
    (t) => t.source === 'library' || t.alignment === 'ontrack'
  );
  const sameMilestoneCount = existingMilestones.filter(
    (t) => t.focus && textSimilarity(t.focus, milestone) >= 0.6
  ).length;

  if (sameMilestoneCount > 0) {
    return {
      id: 'milestoneProgress',
      name: '里程碑进度',
      score: 60,
      label: 'caution',
      reason: '已存在同类里程碑任务，建议优先完成现有任务再新增。',
    };
  }

  const routeKey = child.routeId?.startsWith('sanchu_') ? 'sanchu' : child.routeId?.startsWith('zhongkao_') ? 'zhongkao' : null;
  if (!routeKey) {
    return {
      id: 'milestoneProgress',
      name: '里程碑进度',
      score: 75,
      label: 'good',
      reason: '新的里程碑任务，建议与长期目标对齐。',
    };
  }

  const info = Object.entries(MILESTONE_URGENCY).find(([key]) =>
    milestone.toLowerCase().includes(key.toLowerCase())
  )?.[1]?.[routeKey];

  if (info) {
    return {
      id: 'milestoneProgress',
      name: '里程碑进度',
      score: 80,
      label: 'good',
      reason: info.warning,
    };
  }

  return {
    id: 'milestoneProgress',
    name: '里程碑进度',
    score: 78,
    label: 'good',
    reason: '里程碑任务有助于锚定长线目标。',
  };
}

const DIMENSION_WEIGHTS: Record<string, number> = {
  routeFit: 0.25,
  capabilityRelevance: 0.2,
  loadRationality: 0.25,
  difficultyRationality: 0.1,
  redundancy: 0.1,
  milestoneProgress: 0.1,
};

export function assessTaskRationality(
  child: Child,
  task: AssessmentTaskInput,
  context: AssessmentContext = {}
): TaskRationalityAssessment {
  const dimensions = [
    assessRouteFit(child, task),
    assessCapabilityRelevance(child, task),
    assessLoadRationality(child, task, context),
    assessDifficultyRationality(child, task),
    assessRedundancy(task, context),
    assessMilestoneProgress(child, task, context),
  ];

  const overallScore = Math.round(
    dimensions.reduce((sum, d) => sum + d.score * DIMENSION_WEIGHTS[d.id], 0)
  );

  let verdict: AssessmentVerdict = 'good';
  if (overallScore < 60) verdict = 'risk';
  else if (overallScore < 80) verdict = 'caution';

  const suggestions: string[] = [];
  dimensions.forEach((d) => {
    if (d.label === 'risk') {
      if (d.id === 'routeFit') suggestions.push('确认是否切换孩子的主攻路线，或选择更匹配的任务。');
      if (d.id === 'loadRationality') suggestions.push('减少单日任务量、拆分段落或降低频次。');
      if (d.id === 'difficultyRationality') suggestions.push('降低难度，先补齐前置基础。');
      if (d.id === 'redundancy') suggestions.push('合并相似任务，避免重复投入。');
    }
    if (d.label === 'caution') {
      if (d.id === 'capabilityRelevance') suggestions.push('补充与路线核心能力相关的标签。');
      if (d.id === 'milestoneProgress') suggestions.push('核实现有里程碑任务进度，避免同时推进多个同类节点。');
    }
  });

  if (suggestions.length === 0 && overallScore >= 90) {
    suggestions.push('任务与当前路线、阶段和负荷均匹配，可直接加入计划。');
  }

  const summary =
    verdict === 'good'
      ? `综合评估 ${overallScore} 分，任务与孩子的路线和阶段匹配度较好。`
      : verdict === 'caution'
      ? `综合评估 ${overallScore} 分，任务基本可行，但建议留意提示项。`
      : `综合评估 ${overallScore} 分，任务可能存在明显偏差，建议调整后再加入。`;

  return {
    overallScore,
    verdict,
    summary,
    dimensions,
    suggestions,
  };
}

export function batchAssessTaskRationality(
  child: Child,
  tasks: AssessmentTaskInput[],
  context: AssessmentContext = {}
): TaskRationalityAssessment[] {
  return tasks.map((task) => assessTaskRationality(child, task, context));
}
