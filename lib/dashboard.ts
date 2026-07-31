import { Child, gradeLabel, gradeToStage } from './children';
import {
  getRouteById,
  getRoutesByStage,
  sgKeyResults,
  type RoutePlan,
} from './plans';
import { type PlanStats } from './weeklyTasks';

export interface TimelineItem {
  id: string;
  time: string;
  title: string;
  description: string;
  status: 'past' | 'current' | 'future';
  fallback?: string;
}

export interface UpcomingMilestone {
  id: string;
  time: string;
  title: string;
  description: string;
  fallback?: string;
}

function getChildRoute(child: Child): RoutePlan | undefined {
  if (child.routeId) {
    return getRouteById(child.routeId);
  }
  const routes = getRoutesByStage(gradeToStage(child.grade));
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

function inferTimelineStatus(milestoneGrade: number | null, childGrade: number): TimelineItem['status'] {
  if (milestoneGrade === null) return 'future';
  if (milestoneGrade < childGrade) return 'past';
  if (milestoneGrade === childGrade) return 'current';
  return 'future';
}

export function getStrategicTimeline(child: Child): TimelineItem[] {
  const stage = gradeToStage(child.grade);
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
    }));
  }

  return [];
}

export function getUpcomingMilestones(child: Child, limit: number = 3): UpcomingMilestone[] {
  const timeline = getStrategicTimeline(child);
  return timeline
    .filter((item) => item.status === 'current' || item.status === 'future')
    .slice(0, limit)
    .map((item) => ({
      id: item.id,
      time: item.time,
      title: item.title,
      description: item.description,
      fallback: item.fallback,
    }));
}

export function getCurrentMilestone(child: Child): TimelineItem | undefined {
  const timeline = getStrategicTimeline(child);
  return timeline.find((item) => item.status === 'current');
}

export function generateStrategicAdvice(
  child: Child,
  weeklyStats?: PlanStats | null
): string {
  const route = getChildRoute(child);
  const stage = gradeToStage(child.grade);
  const upcoming = getUpcomingMilestones(child, 2);
  const current = getCurrentMilestone(child);

  const parts: string[] = [];

  // Opening
  parts.push(`${child.name} 目前${gradeLabel(child.grade)}，处于${stage}阶段。`);

  // Route
  if (route) {
    parts.push(`当前路线为「${route.name}」。`);
    if (route.type === 'backup') {
      parts.push('这是备选路线，建议同时关注主路线的准备节奏。');
    }
  } else {
    parts.push('还没有绑定具体升学路线，建议先到「路线方案」页面选择。');
  }

  // Current milestone
  if (current) {
    parts.push(`当前节点：${current.time} · ${current.title}，目标是 ${current.description}。`);
  }

  // Upcoming milestone
  if (upcoming[0] && upcoming[0].id !== current?.id) {
    parts.push(`下一个关键节点是${upcoming[0].time}的${upcoming[0].title}。`);
  }

  // Weekly execution context
  if (weeklyStats && weeklyStats.total > 0) {
    parts.push(`本周任务完成率 ${weeklyStats.completionRate}%。`);
    if (weeklyStats.completionRate >= 80) {
      parts.push('执行节奏不错，可以把多出来的精力放在长期能力建设上。');
    } else if (weeklyStats.completionRate >= 50) {
      parts.push('节奏尚可，建议优先保证主科任务的稳定性。');
    } else {
      parts.push('近期执行偏弱，建议减少任务量、先建立稳定节奏，再推进长期目标。');
    }
  }

  return parts.join('');
}

export function getRouteSummary(child: Child): {
  name: string;
  type: 'primary' | 'backup';
  description: string;
  probability: number;
} {
  const route = getChildRoute(child);
  if (route) {
    return {
      name: route.name,
      type: route.type,
      description: route.description,
      probability: route.probability,
    };
  }

  const stage = gradeToStage(child.grade);
  const defaults: Record<string, { name: string; description: string }> = {
    小升初: {
      name: '三公 / 民办摇号 / 公办对口',
      description: '上海市小升初三条主要通道，可根据准备情况动态切换。',
    },
    中考: {
      name: '市重点 / 区重点 / 特色高中',
      description: '上海中考多批次录取通道，包括自招、名额分配、平行志愿。',
    },
    高考: {
      name: '高考综评 / 强基计划',
      description: '多元升学路径，需提前规划学科特长与综合素质评价。',
    },
  };

  return {
    name: defaults[stage]?.name || '升学路线',
    type: 'primary',
    description: defaults[stage]?.description || '',
    probability: 50,
  };
}
