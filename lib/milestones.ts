export interface MilestoneTemplate {
  title: string;
  description?: string;
  targetGrade: number;
  targetPeriod?: string;
  routeIds?: string[]; // 空表示所有路线
}

// 按年级组织的通用里程碑模板
export const defaultMilestoneTemplates: MilestoneTemplate[] = [
  {
    title: '建立学习习惯，每日阅读 30 分钟',
    description: '培养固定时间学习、每日阅读的好习惯',
    targetGrade: 1,
  },
  {
    title: '完成一年级期末成绩记录',
    description: '记录语数外三科期末成绩，建立成长基线',
    targetGrade: 1,
  },
  {
    title: '确定三年级奥数学习形式',
    description: '评估孩子数学思维特点，确定机构/自学/家庭指导形式',
    targetGrade: 1,
  },
  {
    title: '评估英语启蒙基础，制定 KET 长期计划',
    description: '测试听力、阅读、口语基础，规划英语学习路径',
    targetGrade: 1,
  },
  {
    title: 'RAZ 爬坡（quiz 正确率 80%+）+ OD1 系统学习',
    description: '英语分级阅读稳步进阶，系统学习综合教材',
    targetGrade: 2,
  },
  {
    title: '培养数学逻辑思维',
    description: '通过思维题、桌游、编程启蒙等方式锻炼逻辑',
    targetGrade: 2,
  },
  {
    title: '参加 1-2 项综合素质活动',
    description: '体育、艺术、科创等课外活动体验与筛选',
    targetGrade: 2,
  },
  {
    title: '启动奥数系统学习',
    description: '三年级开始系统奥数训练，建立解题体系',
    targetGrade: 3,
    routeIds: ['sg', 'sizhong', 'shizhong'],
  },
  {
    title: '三年级寒假冲 KET 卓越 140+',
    description: '集中备考 KET，争取卓越成绩',
    targetGrade: 3,
    routeIds: ['sg', 'sizhong', 'shizhong'],
  },
  {
    title: '语文阅读和写作能力强化',
    description: '加强阅读理解答题规范与写作素材积累',
    targetGrade: 3,
  },
  {
    title: 'AMC8 全球前 5%',
    description: '系统备考 AMC8，争取 Distinguished Honor Roll',
    targetGrade: 4,
    routeIds: ['sg', 'sizhong', 'shizhong'],
  },
  {
    title: 'PET 优秀/卓越',
    description: '在 KET 基础上继续冲刺 PET',
    targetGrade: 4,
    routeIds: ['sg', 'sizhong', 'shizhong'],
  },
  {
    title: '古诗文大会/汉字小达人参赛',
    description: '积累古诗文与汉字文化知识，参加权威赛事',
    targetGrade: 4,
    routeIds: ['sg'],
  },
  {
    title: '三公网申材料准备',
    description: '整理竞赛证书、成绩证明、综合素质材料',
    targetGrade: 5,
    routeIds: ['sg'],
  },
  {
    title: '面谈准备与模拟',
    description: '针对三公面谈常见题型进行模拟训练',
    targetGrade: 5,
    routeIds: ['sg'],
  },
];

export function getMilestonesForChild(routeId: string | null | undefined, grade: number): MilestoneTemplate[] {
  return defaultMilestoneTemplates.filter((t) => {
    if (t.targetGrade !== grade) return false;
    if (!t.routeIds || t.routeIds.length === 0) return true;
    if (!routeId) return false;
    return t.routeIds.includes(routeId);
  });
}
