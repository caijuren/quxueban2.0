import {
  TaskAlignment,
  TaskCategory,
  TaskTemplate,
  TaskType,
  TaskFrequency,
  TaskWeeklySchedule,
  DayOfWeek,
  AssessmentCriterion,
} from './storage.types';
import { ROUTE_STAGE_MAP } from './plans';

export interface SystemTaskCapabilityLink {
  capabilityName: string;
  weight: number;
  expectedProgress: number;
}

export type SystemTaskTemplate = Omit<
  TaskTemplate,
  | 'id'
  | 'userId'
  | 'createdAt'
  | 'updatedAt'
  | 'archivedAt'
  | 'useCount'
  | 'lastUsedAt'
  | 'taskType'
  | 'frequency'
  | 'weeklySchedule'
  | 'customScheduleDays'
  | 'assessmentCriteria'
  | 'capabilityLinks'
> & {
  id: string;
  taskType?: TaskType;
  frequency?: TaskFrequency;
  weeklySchedule?: TaskWeeklySchedule;
  customScheduleDays?: DayOfWeek[];
  assessmentCriteria?: AssessmentCriterion[];
  capabilityLinks?: SystemTaskCapabilityLink[];
};

export const TASK_CATEGORY_LABELS: Record<TaskCategory, string> = {
  school: '校内任务',
  reading: '阅读任务',
  sport: '体育健康',
  interest: '课外课程',
  ability: '能力训练',
  other: '其他',
};

export const TASK_CATEGORY_ICONS: Record<TaskCategory, string> = {
  school: '🎒',
  reading: '📚',
  sport: '🏃',
  interest: '🎨',
  ability: '⚡',
  other: '📝',
};

export const TASK_CATEGORY_COLORS: Record<TaskCategory, string> = {
  school: 'text-emerald-400 bg-emerald-400/10',
  reading: 'text-violet-400 bg-violet-400/10',
  sport: 'text-orange-400 bg-orange-400/10',
  interest: 'text-pink-400 bg-pink-400/10',
  ability: 'text-indigo-400 bg-indigo-400/10',
  other: 'text-slate-400 bg-slate-400/10',
};

export const TASK_ALIGNMENT_LABELS: Record<TaskAlignment, string> = {
  ahead: '提前准备',
  ontrack: '当前阶段',
  behind: '需要补差',
  optional: '可选拓展',
  unrelated: '不相关',
};

// 系统任务模板：只保留路线里程碑级别的核心任务，按「路线 → 关键节点 → 具体动作」组织
export const SYSTEM_TASK_TEMPLATES: SystemTaskTemplate[] = [
  // ===== 三公路线：三公/民办摇号 =====
  {
    id: 'tpl-sg-amc8-pastpaper',
    title: 'AMC8 真题限时模拟',
    category: 'ability',
    duration: '60分钟',
    materials: ['AMC8 真题', '计时器', '错题本'],
    description: '完整完成 1 套 AMC8 真题，记录正确率和超时题，目标 20+ 分',
    routeTags: ['sg'],
    milestoneTag: 'AMC8',
    source: 'system',
    isActive: true,
    difficulty: 'hard',
    taskType: 'milestone',
    frequency: 'weekly',
    tags: ['真题', '限时'],
    assessmentCriteria: [
      { metric: '正确题数', target: '>= 20', selfReport: false },
      { metric: '完成时间', target: '<= 40 分钟', selfReport: true },
    ],
    capabilityLinks: [
      { capabilityName: '奥数思维', weight: 1.5, expectedProgress: 2 },
      { capabilityName: '逻辑思维', weight: 1, expectedProgress: 1 },
    ],
  },
  {
    id: 'tpl-sg-thinking-5',
    title: '奥数思维每日 5 题',
    category: 'ability',
    duration: '30分钟',
    materials: ['奥数题库', '草稿纸'],
    description: '每天完成 5 道典型奥数思维题，重点培养数论、组合、几何直觉',
    routeTags: ['sg'],
    milestoneTag: 'AMC8',
    source: 'system',
    isActive: true,
    difficulty: 'medium',
    taskType: 'daily',
    frequency: 'daily',
    tags: ['思维'],
    assessmentCriteria: [{ metric: '正确率', target: '>= 70%', selfReport: false }],
    capabilityLinks: [
      { capabilityName: '奥数思维', weight: 1.5, expectedProgress: 1 },
      { capabilityName: '逻辑思维', weight: 0.8, expectedProgress: 0.5 },
    ],
  },
  {
    id: 'tpl-sg-toefl-junior',
    title: '小托福 TOEFL Junior 单科练习',
    category: 'ability',
    duration: '45分钟',
    materials: ['小托福真题/模拟题', '耳机'],
    description: '听力/语法/阅读三科轮训，目标小托福 850+',
    routeTags: ['sanchu_gongban', 'sanchu_guoji'],
    milestoneTag: 'TOEFL Junior',
    source: 'system',
    isActive: true,
    difficulty: 'hard',
    taskType: 'milestone',
    frequency: 'weekly',
    tags: ['真题', '出国'],
    assessmentCriteria: [{ metric: '单科正确率', target: '>= 80%', selfReport: false }],
    capabilityLinks: [
      { capabilityName: '阅读', weight: 1, expectedProgress: 1 },
      { capabilityName: '听力', weight: 1, expectedProgress: 1 },
      { capabilityName: '词汇语法', weight: 0.8, expectedProgress: 1 },
    ],
  },
  {
    id: 'tpl-sg-pet-reading',
    title: 'PET 阅读理解精练',
    category: 'ability',
    duration: '30分钟',
    materials: ['PET 真题', '词汇本'],
    description: '完成 1-2 篇 PET 难度阅读，精读长难句并积累核心词',
    routeTags: ['sg'],
    milestoneTag: 'PET',
    source: 'system',
    isActive: true,
    difficulty: 'medium',
    taskType: 'daily',
    frequency: 'daily',
    tags: ['阅读'],
    assessmentCriteria: [{ metric: '正确率', target: '>= 75%', selfReport: false }],
    capabilityLinks: [
      { capabilityName: '阅读', weight: 1.5, expectedProgress: 1 },
      { capabilityName: '词汇语法', weight: 0.8, expectedProgress: 0.5 },
    ],
  },
  {
    id: 'tpl-sg-chinese-reading',
    title: '三公语文阅读理解',
    category: 'ability',
    duration: '30分钟',
    materials: ['三公/民办校阅读真题', '错题本'],
    description: '完成 1 篇三公/民办校风格的阅读理解，训练信息提取和主旨概括',
    routeTags: ['sg'],
    source: 'system',
    isActive: true,
    difficulty: 'medium',
    taskType: 'daily',
    frequency: 'daily',
    tags: ['阅读'],
    assessmentCriteria: [{ metric: '正确率', target: '>= 75%', selfReport: false }],
    capabilityLinks: [
      { capabilityName: '阅读理解', weight: 1.5, expectedProgress: 1 },
      { capabilityName: '语文基础', weight: 0.5, expectedProgress: 0.3 },
    ],
  },
  {
    id: 'tpl-sg-gushi-recite',
    title: '古诗文背诵积累',
    category: 'ability',
    duration: '20分钟',
    materials: ['古诗文读本', '背诵打卡表'],
    description: '背诵 1-2 首古诗或古文段落，理解大意和常见意象',
    routeTags: ['sg'],
    milestoneTag: '古诗文大会',
    source: 'system',
    isActive: true,
    difficulty: 'medium',
    taskType: 'daily',
    frequency: 'daily',
    tags: ['积累'],
    assessmentCriteria: [{ metric: '熟练背诵', target: '能完整默写', selfReport: true }],
    capabilityLinks: [{ capabilityName: '古诗文', weight: 1.5, expectedProgress: 1 }],
  },
  {
    id: 'tpl-sg-interview-prep',
    title: '表达能力与面谈准备',
    category: 'other',
    duration: '30分钟',
    materials: ['自我介绍稿', '时事素材'],
    description: '练习 1 分钟自我介绍，模拟常见面谈问答',
    routeTags: ['sg'],
    source: 'system',
    isActive: true,
    difficulty: 'medium',
    taskType: 'sprint',
    frequency: 'weekly',
    tags: ['面谈'],
    assessmentCriteria: [{ metric: '表达流畅度', target: '能自然说完', selfReport: true }],
    capabilityLinks: [
      { capabilityName: '表达能力', weight: 1.5, expectedProgress: 1 },
      { capabilityName: '抗压能力', weight: 0.5, expectedProgress: 0.3 },
    ],
  },

  // ===== 中考路线 =====
  {
    id: 'tpl-zk-math-basic',
    title: '中考数学基础专题过关',
    category: 'ability',
    duration: '40分钟',
    materials: ['中考分类汇编', '错题本'],
    description: '按代数/几何/函数专题完成基础题，确保概念清晰、计算准确',
    routeTags: ['sizhong', 'shizhong', 'quzhong'],
    source: 'system',
    isActive: true,
    difficulty: 'medium',
    taskType: 'daily',
    frequency: 'daily',
    tags: ['基础'],
    assessmentCriteria: [{ metric: '正确率', target: '>= 85%', selfReport: false }],
    capabilityLinks: [
      { capabilityName: '计算能力', weight: 1, expectedProgress: 0.8 },
      { capabilityName: '逻辑思维', weight: 0.8, expectedProgress: 0.5 },
    ],
  },
  {
    id: 'tpl-zk-math-zhongya',
    title: '中考数学压轴题训练',
    category: 'ability',
    duration: '45分钟',
    materials: ['压轴题专项', '草稿纸'],
    description: '完成 1-2 道中考压轴题，总结解题模型和易错点',
    routeTags: ['sizhong', 'shizhong', 'quzhong'],
    source: 'system',
    isActive: true,
    difficulty: 'hard',
    taskType: 'sprint',
    frequency: 'weekly',
    tags: ['冲刺'],
    assessmentCriteria: [{ metric: '完整做对', target: '>= 1 道', selfReport: false }],
    capabilityLinks: [
      { capabilityName: '逻辑思维', weight: 1.2, expectedProgress: 1 },
      { capabilityName: '空间想象', weight: 0.6, expectedProgress: 0.5 },
    ],
  },
  {
    id: 'tpl-zk-chinese-wenyan',
    title: '中考文言文实词虚词积累',
    category: 'ability',
    duration: '25分钟',
    materials: ['中考文言文手册', '词汇卡片'],
    description: '每天记忆 5-8 个文言实词/虚词，结合例句理解用法',
    routeTags: ['sizhong', 'shizhong', 'quzhong'],
    source: 'system',
    isActive: true,
    difficulty: 'medium',
    taskType: 'daily',
    frequency: 'daily',
    tags: ['积累'],
    assessmentCriteria: [{ metric: '识记量', target: '>= 5 个', selfReport: true }],
    capabilityLinks: [
      { capabilityName: '古诗文', weight: 1.2, expectedProgress: 0.8 },
      { capabilityName: '语文基础', weight: 1, expectedProgress: 0.8 },
    ],
  },
  {
    id: 'tpl-zk-english-vocab',
    title: '中考考纲词汇背诵',
    category: 'ability',
    duration: '20分钟',
    materials: ['考纲词汇书', '单词卡片'],
    description: '按考纲词表背诵并复习核心词汇，重点标记一词多义和搭配',
    routeTags: ['sizhong', 'shizhong', 'quzhong'],
    source: 'system',
    isActive: true,
    difficulty: 'medium',
    taskType: 'daily',
    frequency: 'daily',
    tags: ['词汇'],
    assessmentCriteria: [{ metric: '新词量', target: '>= 10 个', selfReport: true }],
    capabilityLinks: [{ capabilityName: '词汇语法', weight: 1.5, expectedProgress: 1 }],
  },
  {
    id: 'tpl-zk-sport-exam',
    title: '中考体育选项专项训练',
    category: 'sport',
    duration: '45分钟',
    materials: ['运动器材'],
    description: '针对已选中考体育项目进行技术动作和体能训练',
    routeTags: ['sizhong', 'shizhong', 'quzhong'],
    source: 'system',
    isActive: true,
    difficulty: 'medium',
    taskType: 'daily',
    frequency: 'daily',
    tags: ['体育'],
    assessmentCriteria: [{ metric: '完成度', target: '按训练计划完成', selfReport: true }],
    capabilityLinks: [{ capabilityName: '专注力', weight: 0.6, expectedProgress: 0.3 }],
  },

  // ===== 公办对口/摇号缓冲 =====
  {
    id: 'tpl-gongban-preview',
    title: '校内知识预习',
    category: 'school',
    duration: '30分钟',
    materials: ['课本', '练习册'],
    description: '提前预习下周校内重点课程，标记疑难点',
    routeTags: ['gongban', 'yaohao'],
    source: 'system',
    isActive: true,
    difficulty: 'easy',
    taskType: 'daily',
    frequency: 'daily',
    tags: ['校内'],
    assessmentCriteria: [{ metric: '预习完成', target: '完成并标记疑问', selfReport: true }],
    capabilityLinks: [
      { capabilityName: '自主学习', weight: 1, expectedProgress: 0.5 },
      { capabilityName: '时间管理', weight: 0.5, expectedProgress: 0.3 },
    ],
  },

  // ===== 通用素养（不绑定特定路线） =====
  {
    id: 'tpl-general-reading',
    title: '每日课外阅读',
    category: 'reading',
    duration: '30分钟',
    materials: ['课外书', '阅读记录本'],
    description: '阅读课外书籍，做好摘抄和简短感想',
    routeTags: [],
    source: 'system',
    isActive: true,
    difficulty: 'easy',
    taskType: 'daily',
    frequency: 'daily',
    tags: ['日常'],
    assessmentCriteria: [{ metric: '阅读时长', target: '>= 30 分钟', selfReport: true }],
    capabilityLinks: [
      { capabilityName: '阅读理解', weight: 0.8, expectedProgress: 0.3 },
      { capabilityName: '专注力', weight: 0.5, expectedProgress: 0.2 },
    ],
  },
  {
    id: 'tpl-general-sport',
    title: '每日运动',
    category: 'sport',
    duration: '30分钟',
    materials: ['运动鞋', '跳绳/球类'],
    description: '进行有氧运动或体能训练，保证每天活动量',
    routeTags: [],
    source: 'system',
    isActive: true,
    difficulty: 'easy',
    taskType: 'daily',
    frequency: 'daily',
    tags: ['日常'],
    assessmentCriteria: [{ metric: '运动时长', target: '>= 30 分钟', selfReport: true }],
    capabilityLinks: [{ capabilityName: '专注力', weight: 0.4, expectedProgress: 0.2 }],
  },
];

export function getSystemTaskTemplateById(id: string): SystemTaskTemplate | undefined {
  return SYSTEM_TASK_TEMPLATES.find((t) => t.id === id);
}

export function getSystemTaskTemplatesByRoute(routeId?: string): SystemTaskTemplate[] {
  if (!routeId) return SYSTEM_TASK_TEMPLATES.filter((t) => t.routeTags.length === 0);
  return SYSTEM_TASK_TEMPLATES.filter(
    (t) => t.routeTags.length === 0 || t.routeTags.includes(routeId)
  );
}

export function getTemplateStage(
  template: Pick<SystemTaskTemplate, 'routeTags'>
): '小升初' | '中考' | '高考' | 'general' {
  if (!template.routeTags || template.routeTags.length === 0) return 'general';
  const stages = new Set(
    template.routeTags.map((tag) => ROUTE_STAGE_MAP[tag]).filter(Boolean)
  );
  if (stages.size === 1) return stages.values().next().value as '小升初' | '中考';
  if (stages.size > 1) return 'general';
  return 'general';
}
