import { Child, gradeLabel, gradeToStage } from './children';
import { getRouteById, getRoutesByStage, sgKeyResults, type RoutePlan } from './plans';
import { type PlanStats } from './weeklyTasks';

export interface TimelineItem {
  id: string;
  time: string;
  title: string;
  description: string;
  status: 'past' | 'current' | 'future';
  fallback?: string;
  objectives: string[];
}

export type RiskLevel = 'high' | 'medium' | 'low';

export interface UpcomingMilestone {
  id: string;
  time: string;
  title: string;
  description: string;
  fallback?: string;
  risk: RiskLevel;
  riskReason: string;
  suggestedAction: string;
}

export interface RouteMatchSnapshot {
  probability: number;
  change: number;
  remaining: number;
}

export interface StrategicAdvice {
  currentJudgment: string;
  focusAreas: string[];
  next90DaysGoals: string[];
}

function getChildRoute(child: Child): RoutePlan | undefined {
  if (child.routeId) {
    return getRouteById(child.routeId);
  }
  const routes = getRoutesByStage(gradeToStage(child.grade, child.educationSystem));
  return routes[0];
}

function extractGradeFromTime(time: string): number | null {
  // Match grade numbers in strings like "三年级寒假", "四年级下", "五年级上 12 月"
  const match = time.match(/([一二三四五六七八九十]+)(?:年级|上|下|\s|$)/);
  if (!match) return null;

  const cnNumbers: Record<string, number> = {
    一: 1,
    二: 2,
    三: 3,
    四: 4,
    五: 5,
    六: 6,
    七: 7,
    八: 8,
    九: 9,
    十: 10,
    十一: 11,
    十二: 12,
  };

  // Try multi-character first (e.g., "十一")
  for (let len = Math.min(3, match[1].length); len >= 1; len--) {
    const prefix = match[1].slice(0, len);
    if (cnNumbers[prefix] !== undefined) {
      return cnNumbers[prefix];
    }
  }

  return null;
}

function inferTimelineStatus(
  milestoneGrade: number | null,
  childGrade: number
): TimelineItem['status'] {
  if (milestoneGrade === null) return 'future';
  if (milestoneGrade < childGrade) return 'past';
  if (milestoneGrade === childGrade) return 'current';
  return 'future';
}

function inferObjectives(stage: string, title: string, description: string): string[] {
  const text = `${title} ${description}`;

  if (stage === '小升初') {
    if (text.includes('基础')) return ['知识体系完整', '优势学科保持', '学习习惯优化'];
    if (text.includes('证书') || text.includes('竞赛'))
      return ['竞赛奖项积累', '英语证书达标', '综合素质提升'];
    if (text.includes('简历') || text.includes('面谈'))
      return ['简历素材整理', '面谈模拟训练', '目标学校锁定'];
    return ['目标学校锁定', '简历素材整理', '面谈模拟训练'];
  }

  if (stage === '中考') {
    if (text.includes('基础') || text.includes('知识体系'))
      return ['知识体系完整', '优势学科保持', '学习习惯优化'];
    if (text.includes('分层') || text.includes('竞赛'))
      return ['理科能力提升', '竞赛初步突破', '综合能力增强'];
    if (text.includes('一模') || text.includes('志愿'))
      return ['精准定位', '志愿策略优化', '心理调节'];
    if (text.includes('二模') || text.includes('中考')) return ['冲刺提分', '稳定发挥', '录取最优'];
    return ['知识体系完整', '优势学科保持', '学习习惯优化'];
  }

  return ['知识体系完整', '优势学科保持', '学习习惯优化'];
}

function inferRiskLevel(
  item: TimelineItem,
  child: Child,
  weeklyStats?: PlanStats | null
): { risk: RiskLevel; reason: string; action: string } {
  // High risk: current node without enough weekly completion
  if (item.status === 'current') {
    if (weeklyStats && weeklyStats.total > 0 && weeklyStats.completionRate < 50) {
      return {
        risk: 'high',
        reason: '近期执行偏弱，可能影响关键节点进度',
        action: '优先完成本周核心任务，建立稳定节奏',
      };
    }
    return {
      risk: 'high',
      reason: '若基础不牢，将影响后续理科和竞赛发展',
      action: '暑假完成六上六下数学体系 + 英语衔接',
    };
  }

  // Medium risk: next node within 1 grade
  const milestoneGrade = extractGradeFromTime(item.time);
  const gradeGap = milestoneGrade !== null ? milestoneGrade - child.grade : 2;
  if (gradeGap <= 1) {
    return {
      risk: 'medium',
      reason: '若分层突破不足，影响高中竞争力',
      action: '重点突破物理/化学竞赛基础',
    };
  }

  return {
    risk: 'low',
    reason: '时间尚充裕，按计划推进即可',
    action: '保持当前节奏，提前积累',
  };
}

export function getStrategicTimeline(child: Child): TimelineItem[] {
  const stage = gradeToStage(child.grade, child.educationSystem);
  const route = getChildRoute(child);

  if (stage === '小升初') {
    return sgKeyResults.map((node, index) => {
      const milestoneGrade = extractGradeFromTime(node.time);
      const status = inferTimelineStatus(milestoneGrade, child.grade);
      return {
        id: `sg-${index}`,
        time: node.time,
        title: node.title,
        description: node.result,
        status,
        fallback: node.fallbackSignal,
        objectives: inferObjectives(stage, node.title, node.result),
      };
    });
  }

  if (stage === '中考' && route) {
    return route.milestones.map((milestone, index) => {
      const milestoneGrade = extractGradeFromTime(milestone.time);
      const status = inferTimelineStatus(milestoneGrade, child.grade);
      return {
        id: `zk-${index}`,
        time: milestone.time,
        title: milestone.task.split('，')[0] || milestone.task,
        description: milestone.task,
        status,
        objectives: inferObjectives(
          stage,
          milestone.task.split('，')[0] || milestone.task,
          milestone.task
        ),
      };
    });
  }

  // 高考 or no route: derive a generic timeline from the route milestones if available
  if (route) {
    return route.milestones.map((milestone, index) => ({
      id: `gk-${index}`,
      time: milestone.time,
      title: milestone.task.split('，')[0] || milestone.task,
      description: milestone.task,
      status: 'future' as const,
      objectives: inferObjectives(
        stage,
        milestone.task.split('，')[0] || milestone.task,
        milestone.task
      ),
    }));
  }

  return [];
}

export function getUpcomingMilestones(
  child: Child,
  limit: number = 3,
  weeklyStats?: PlanStats | null
): UpcomingMilestone[] {
  const timeline = getStrategicTimeline(child);
  return timeline
    .filter((item) => item.status === 'current' || item.status === 'future')
    .slice(0, limit)
    .map((item) => {
      const riskInfo = inferRiskLevel(item, child, weeklyStats);
      return {
        id: item.id,
        time: item.time,
        title: item.title,
        description: item.description,
        fallback: item.fallback,
        risk: riskInfo.risk,
        riskReason: riskInfo.reason,
        suggestedAction: riskInfo.action,
      };
    });
}

export function getCurrentMilestone(child: Child): TimelineItem | undefined {
  const timeline = getStrategicTimeline(child);
  return timeline.find((item) => item.status === 'current');
}

export function getRouteMatchSnapshot(
  child: Child,
  completionRate?: number | null
): RouteMatchSnapshot {
  const route = getChildRoute(child);
  const timeline = getStrategicTimeline(child);

  // 基于实际数据计算路线匹配度，不再是静态的 route.probability
  let score = route ? 25 : 10;

  // 周计划完成率贡献（最高 30 分）
  if (completionRate !== null && completionRate !== undefined) {
    score += Math.round((completionRate / 100) * 30);
  } else {
    score += 15;
  }

  // 里程碑进度贡献（最高 25 分）
  const totalMilestones = timeline.length || 1;
  const pastMilestones = timeline.filter((t) => t.status === 'past').length;
  score += Math.round((pastMilestones / totalMilestones) * 25);

  // 目标学校已设定
  if (child.targetSchool) score += 10;

  // 存在当前阶段里程碑
  if (timeline.some((t) => t.status === 'current')) score += 5;

  // 主路线额外加权
  if (route?.type === 'primary') score += 5;

  const probability = Math.min(100, Math.max(0, score));

  // 变化幅度基于完成率给出方向性提示
  let change: number;
  if (completionRate !== null && completionRate !== undefined) {
    if (completionRate >= 80) change = 5;
    else if (completionRate >= 60) change = 2;
    else if (completionRate >= 40) change = -1;
    else change = -3;
  } else {
    const hash = child.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    change = (hash % 11) - 3;
  }

  const remaining = Math.max(0, 100 - probability);
  return { probability, change, remaining };
}

export function generateStrategicAdvice(
  child: Child,
  weeklyStats?: PlanStats | null
): StrategicAdvice {
  const route = getChildRoute(child);
  const stage = gradeToStage(child.grade, child.educationSystem);
  const current = getCurrentMilestone(child);
  const upcoming = getUpcomingMilestones(child, 2, weeklyStats);

  // Current judgment
  let currentJudgment = `${child.name} 目前${gradeLabel(child.grade, child.educationSystem)}，处于${stage}阶段。`;
  if (route) {
    currentJudgment += `当前路线为「${route.name}」，基础稳定，学习态度良好，数学优势明显，具备冲击更高目标的潜力。`;
  }

  // Focus areas
  const focusAreas: string[] = [];
  if (upcoming[0]?.risk === 'high') {
    focusAreas.push(`当前节点「${upcoming[0].title}」风险较高：${upcoming[0].riskReason}`);
  }
  focusAreas.push('英语阅读与写作保持优势');
  focusAreas.push('理科竞赛提前布局');
  if (route?.type === 'backup') {
    focusAreas.push('备选路线需同步关注主路线准备节奏');
  }

  // Next 90 days goals
  const next90DaysGoals: string[] = [];
  if (stage === '中考') {
    next90DaysGoals.push('完成六下数学体系构建');
    next90DaysGoals.push('英语词汇量突破 3500+');
    next90DaysGoals.push('物理竞赛基础入门');
  } else if (stage === '小升初') {
    next90DaysGoals.push('完成本学期核心知识点巩固');
    next90DaysGoals.push('优势学科保持校内前列');
    next90DaysGoals.push('整理目标学校招生时间线');
  } else {
    next90DaysGoals.push('完成本学期核心知识点巩固');
    next90DaysGoals.push('优势学科保持校内前列');
    next90DaysGoals.push('关注综合评价招生动态');
  }

  return {
    currentJudgment,
    focusAreas,
    next90DaysGoals,
  };
}

export interface RouteSummary {
  name: string;
  type: 'primary' | 'backup';
  description: string;
  probability: number;
  targetSchools: string[];
  direction: string;
  directionDetail: string;
}

export function getRouteSummary(child: Child): RouteSummary {
  const route = getChildRoute(child);
  const stage = gradeToStage(child.grade, child.educationSystem);

  if (route) {
    const targetSchools = route.targets.map((t) => t.name);
    const direction = inferRouteDirection(route.id, stage);
    return {
      name: route.name,
      type: route.type,
      description: route.description,
      probability: route.probability,
      targetSchools,
      direction: direction.label,
      directionDetail: direction.detail,
    };
  }

  const defaults: Record<
    string,
    { name: string; description: string; direction: string; directionDetail: string }
  > = {
    小升初: {
      name: '三公 / 民办摇号 / 公办对口',
      description: '上海市小升初三条主要通道，可根据准备情况动态切换。',
      direction: '三公 → 民办 → 公办',
      directionDetail: '根据准备情况动态切换，稳中求进',
    },
    中考: {
      name: '市重点 / 区重点 / 特色高中',
      description: '上海中考多批次录取通道，包括自招、名额分配、平行志愿。',
      direction: '重点高中 → 稳中求进',
      directionDetail: '通过名额分配和平行志愿稳中求进',
    },
    高考: {
      name: '高考综评 / 强基计划',
      description: '多元升学路径，需提前规划学科特长与综合素质评价。',
      direction: '综评 → 强基计划',
      directionDetail: '提前布局学科特长与综合素质评价',
    },
  };

  return {
    name: defaults[stage]?.name || '升学路线',
    type: 'primary',
    description: defaults[stage]?.description || '',
    probability: 50,
    targetSchools: [],
    direction: defaults[stage]?.direction || '多元升学',
    directionDetail: defaults[stage]?.directionDetail || '',
  };
}

function inferRouteDirection(routeId: string, stage: string): { label: string; detail: string } {
  if (stage === '中考') {
    if (routeId === 'sizhong')
      return { label: '重点高中 → 四校冲刺', detail: '通过自招和名额分配冲击顶尖高中' };
    if (routeId === 'shizhong')
      return { label: '重点高中 → 四校分校', detail: '通过名额分配和平行志愿稳中求进' };
    if (routeId === 'quzhong')
      return { label: '区重点 → 特色高中', detail: '以区重点或特色高中为保底，确保本科升学路径' };
  }
  if (stage === '小升初') {
    if (routeId === 'sg')
      return { label: '三公 → 提前批', detail: '冲刺上海实验、上外附中、浦外附中' };
    if (routeId === 'yaohao')
      return { label: '民办摇号 → 公办备选', detail: '摇号为主，公办对口保底' };
    if (routeId === 'gongban')
      return { label: '公办对口 → 稳妥升学', detail: '按学区入学，夯实基础' };
  }
  return { label: '多元升学', detail: '根据孩子情况动态调整' };
}
