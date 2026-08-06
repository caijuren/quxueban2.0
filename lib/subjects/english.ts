import { Languages, BookOpen, Target, Award, Layers, Clock } from 'lucide-react';

export interface EnglishTrack {
  id: string;
  name: string;
  icon: typeof Languages;
  color: string;
  description: string;
}

export interface EnglishPhase {
  time: string;
  grade: string;
  title: string;
  content: string;
  milestone: string;
  razLevel?: string;
  odProgress?: string;
  exam?: string;
}

export interface WeeklyTask {
  day: string;
  focus: string;
  duration: string;
  materials: string[];
}

export interface OD1Unit {
  unit: number;
  bigQuestion: string;
  theme: string;
  weeks: string;
  focus: string;
  checkpoint: string;
}

export interface Checkpoint {
  time: string;
  target: string;
  fallback: string;
}

export interface ResourceItem {
  name: string;
  usage: string;
}

// 英语三条能力线
export const englishTracks: EnglishTrack[] = [
  {
    id: 'raz',
    name: 'RAZ 阅读线',
    icon: BookOpen,
    color: 'from-success to-accent',
    description: '分级阅读建立阅读量和阅读速度',
  },
  {
    id: 'od',
    name: 'OD 体系线',
    icon: Layers,
    color: 'from-secondary to-secondary-glow',
    description: '系统语法、写作和综合输入输出',
  },
  {
    id: 'exam',
    name: '考证线',
    icon: Award,
    color: 'from-warning to-warning/70',
    description: 'KET → PET → 小托福，三公硬通货',
  },
];

// 五年英语阶段规划（基于孩子当前一升二、OD1 Unit 7、RAZ E）
export const englishPhases: EnglishPhase[] = [
  {
    time: '2025.07 - 2026.01',
    grade: '一升二 ~ 二年级上',
    title: 'OD1 收尾 + RAZ 爬坡',
    content: '完成 OD1 Unit 7-18，RAZ 从 E 爬到 G，补齐说写弱项',
    milestone: 'OD1 学完，RAZ G，quiz 正确率 80%+',
    razLevel: 'E → G',
    odProgress: 'OD1 U7 → U18',
  },
  {
    time: '2026.02 - 2026.08',
    grade: '二年级寒假 ~ 二年级下',
    title: 'OD2 系统推进',
    content: 'OD2 全册推进，RAZ 继续爬坡到 I/J，开始 KET 题型熟悉',
    milestone: 'OD2 学完，蓝思 350-400',
    razLevel: 'G → I/J',
    odProgress: 'OD2 U1 → U18',
  },
  {
    time: '2026.09 - 2027.02',
    grade: '三年级上 ~ 三年级寒假',
    title: 'KET 体系 + KET 卓越',
    content: 'OD2 复习 + KET 专项冲刺，寒假考 KET 目标卓越 140+',
    milestone: 'KET 卓越 140+',
    razLevel: 'I/J',
    odProgress: 'OD2 复习',
    exam: 'KET 卓越 140+',
  },
  {
    time: '2027.03 - 2027.08',
    grade: '三年级下 ~ 三年级暑假',
    title: 'OD3 启动 + PET 备考',
    content: '启动 OD3，RAZ 爬到 K/L，暑假开始 PET 专项训练',
    milestone: 'OD3 学到 U9，PET 备考启动',
    razLevel: 'I/J → K/L',
    odProgress: 'OD3 U1 → U9',
  },
  {
    time: '2027.09 - 2028.02',
    grade: '四年级上 ~ 四年级寒假',
    title: 'PET 卓越 + 小托福衔接',
    content: '寒假冲 PET 卓越，春季转小托福题型适应',
    milestone: 'PET 卓越 160+',
    razLevel: 'K/L',
    odProgress: 'OD3 U10 → U18',
    exam: 'PET 卓越 160+',
  },
  {
    time: '2028.03 - 2028.08',
    grade: '四年级春季 ~ 四年级暑假',
    title: '小托福首考 800+',
    content: '春季小托福首考目标 800+，暑假查漏补缺或二考',
    milestone: '小托福 800+',
    razLevel: 'K/L',
    odProgress: 'OD3 收尾',
    exam: '小托福 800+',
  },
  {
    time: '2028.09 - 2028.12',
    grade: '五年级上',
    title: '小托福冲刺 850+',
    content: '密集小托福 TPO + 学术词汇，12 月前目标 850+',
    milestone: '小托福 850+',
    razLevel: 'K/L 维持',
    exam: '小托福 850+',
  },
  {
    time: '2029.01 - 2029.05',
    grade: '五年级下',
    title: '维持 + 面谈素材',
    content: '保持英语优势，整理证书和面谈表达素材',
    milestone: '三公面谈英语表达流利',
    razLevel: 'K/L 维持',
    exam: '维持成绩',
  },
];

// 各年级阶段计划
export interface GradePlan {
  grade: string;
  period: string;
  targets: { label: string; current: string; target: string }[];
  weeklyTemplate: WeeklyTask[];
  weakSkills?: string[];
}

export const gradePlans: Record<number, GradePlan> = {
  1: {
    grade: '一年级',
    period: '2025.09 - 2026.07',
    targets: [
      { label: 'RAZ 启动', current: 'A-C', target: 'E' },
      { label: '自然拼读', current: '学习中', target: '熟练' },
      { label: '听力输入', current: '30 分钟/天', target: '稳定习惯' },
      { label: '口语输出', current: '单词 + 短句', target: '简单对话' },
    ],
    weeklyTemplate: [
      { day: '周一', focus: 'RAZ 新读 + 跟读', duration: '30 分钟', materials: ['ABC Reading', 'bookr'] },
      { day: '周二', focus: '自然拼读 + 单词', duration: '30 分钟', materials: ['phonics app', '单词卡'] },
      { day: '周三', focus: '听力输入', duration: '30 分钟', materials: ['bookr', '动画片'] },
      { day: '周四', focus: 'RAZ 精读 + quiz', duration: '30 分钟', materials: ['ABC Reading'] },
      { day: '周五', focus: '口语对话', duration: '20 分钟', materials: ['口袋领航'] },
      { day: '周六', focus: '综合阅读', duration: '40 分钟', materials: ['绘本', 'RAZ'] },
      { day: '周日', focus: '周复习', duration: '20 分钟', materials: ['单词卡', 'RAZ 复习'] },
    ],
    weakSkills: ['写', '自主阅读'],
  },
  2: {
    grade: '一升二 ~ 二年级上',
    period: '2025.07 - 2026.01',
    targets: [
      { label: 'OD1 完成', current: 'Unit 7/18', target: 'Unit 18/18' },
      { label: 'RAZ 爬坡', current: 'Level E', target: 'Level G' },
      { label: 'quiz 正确率', current: '偏低', target: '稳定 80%+' },
      { label: '蓝思值', current: '约 200+', target: '400+' },
    ],
    weeklyTemplate: [
      { day: '周一', focus: 'OD 新课 + 单词', duration: '40-45 分钟', materials: ['超凡 AI 课 1-2 节', '单词本'] },
      { day: '周二', focus: 'OD 语法 + 练习册', duration: '40-45 分钟', materials: ['超凡 AI 课 3-4 节', '课程练习册'] },
      { day: '周三', focus: 'RAZ 精读 + 复述', duration: '30 分钟', materials: ['ABC Reading', '复述本'] },
      { day: '周四', focus: 'OD 听力/口语', duration: '40-45 分钟', materials: ['超凡 AI 课 5-6 节', '口袋领航'] },
      { day: '周五', focus: 'OD 单元练习 + 错题', duration: '40-45 分钟', materials: ['单元练习册', '错题整理'] },
      { day: '周六', focus: 'RAZ 大量阅读', duration: '30 分钟', materials: ['ABC Reading', 'bookr'] },
      { day: '周日', focus: '周复习 + 口语输出', duration: '30 分钟', materials: ['口袋领航', '单词本复习'] },
    ],
    weakSkills: ['说', '写'],
  },
  3: {
    grade: '三年级',
    period: '2026.09 - 2027.02',
    targets: [
      { label: 'OD2 完成', current: '学习中', target: 'Unit 18/18' },
      { label: 'RAZ 维持', current: 'I/J', target: 'I/J' },
      { label: 'KET 备考', current: '专项中', target: '卓越 140+' },
      { label: '蓝思值', current: '400+', target: '500+' },
    ],
    weeklyTemplate: [
      { day: '周一', focus: 'OD2 复习 + 语法', duration: '40 分钟', materials: ['OD2 练习册', '语法专项'] },
      { day: '周二', focus: 'KET 阅读真题', duration: '40 分钟', materials: ['KET 真题', '阅读技巧'] },
      { day: '周三', focus: 'KET 听力真题', duration: '30 分钟', materials: ['KET 听力', '口袋领航'] },
      { day: '周四', focus: 'KET 写作/口语', duration: '40 分钟', materials: ['KET 写作模板', '口语练习'] },
      { day: '周五', focus: 'RAZ 精读 + 错题', duration: '30 分钟', materials: ['ABC Reading'] },
      { day: '周六', focus: 'KET 模拟测试', duration: '60 分钟', materials: ['KET 真题卷'] },
      { day: '周日', focus: '周复习', duration: '30 分钟', materials: ['错题本', '单词复习'] },
    ],
    weakSkills: ['写作', '听力'],
  },
  4: {
    grade: '四年级',
    period: '2027.09 - 2028.08',
    targets: [
      { label: 'OD3 推进', current: 'U1', target: 'U18' },
      { label: 'PET 卓越', current: '备考中', target: '160+' },
      { label: '小托福首考', current: '题型熟悉', target: '800+' },
      { label: 'RAZ 爬坡', current: 'K/L', target: 'K/L' },
    ],
    weeklyTemplate: [
      { day: '周一', focus: 'OD3 新课 + 学术词汇', duration: '45 分钟', materials: ['超凡 AI 课', '学术词汇'] },
      { day: '周二', focus: 'PET 阅读/写作', duration: '45 分钟', materials: ['PET 真题', '写作训练'] },
      { day: '周三', focus: '小托福听力', duration: '40 分钟', materials: ['小托福听力', '校园场景'] },
      { day: '周四', focus: '小托福语法', duration: '40 分钟', materials: ['小托福语法', '语言形式'] },
      { day: '周五', focus: 'RAZ 精读 + 复述', duration: '30 分钟', materials: ['ABC Reading'] },
      { day: '周六', focus: 'PET/小托福模拟', duration: '60 分钟', materials: ['PET 真题', '小托福 TPO'] },
      { day: '周日', focus: '周复习', duration: '30 分钟', materials: ['错题本', '词汇复习'] },
    ],
    weakSkills: ['学术听力', '语法'],
  },
  5: {
    grade: '五年级',
    period: '2028.09 - 2029.05',
    targets: [
      { label: '小托福冲刺', current: '800+', target: '850+' },
      { label: '英语维持', current: '稳定', target: '不下滑' },
      { label: '面谈准备', current: '素材整理', target: '流利表达' },
      { label: '证书归档', current: '整理中', target: '完整简历' },
    ],
    weeklyTemplate: [
      { day: '周一', focus: '小托福阅读 TPO', duration: '45 分钟', materials: ['小托福 TPO', '阅读技巧'] },
      { day: '周二', focus: '小托福听力 TPO', duration: '45 分钟', materials: ['小托福 TPO', '学术听力'] },
      { day: '周三', focus: '语言形式与含义', duration: '40 分钟', materials: ['小托福语法', '词汇'] },
      { day: '周四', focus: '口语/面谈模拟', duration: '40 分钟', materials: ['口袋领航', '面谈题'] },
      { day: '周五', focus: 'RAZ 维持阅读', duration: '30 分钟', materials: ['ABC Reading'] },
      { day: '周六', focus: '小托福全真模考', duration: '90 分钟', materials: ['小托福 TPO'] },
      { day: '周日', focus: '错题 + 周复习', duration: '30 分钟', materials: ['错题本', '单词本'] },
    ],
    weakSkills: ['考试稳定性', '面谈表达'],
  },
};

// 六年级以上：小升初已完成
export const postExamPlan: GradePlan = {
  grade: '小升初后',
  period: '2029.09 起',
  targets: [
    { label: '英语能力', current: '三公达标', target: '初中衔接' },
    { label: '学习习惯', current: '稳定', target: '初中适应' },
  ],
  weeklyTemplate: [
    { day: '周一', focus: '初中英语预习', duration: '40 分钟', materials: ['初中教材', '听力'] },
    { day: '周二', focus: '阅读维持', duration: '30 分钟', materials: ['RAZ/章节书'] },
    { day: '周三', focus: '口语练习', duration: '20 分钟', materials: ['口袋领航'] },
    { day: '周四', focus: '写作练习', duration: '30 分钟', materials: ['初中写作'] },
    { day: '周五', focus: '综合复习', duration: '30 分钟', materials: ['错题本'] },
    { day: '周六', focus: '拓展阅读', duration: '40 分钟', materials: ['章节书', '原版书'] },
    { day: '周日', focus: '周复习', duration: '20 分钟', materials: ['单词本'] },
  ],
  weakSkills: ['初中语法', '长篇阅读'],
};

export function getEnglishPlanByGrade(grade: number): GradePlan {
  return gradePlans[grade] || postExamPlan;
}

// 说写弱项专项计划（按年级）
export interface SpeakWritePlan {
  grade: number;
  weakSkills: string[];
  dailySpeaking: {
    title: string;
    duration: string;
    steps: string[];
  };
  dailyWriting: {
    title: string;
    duration: string;
    steps: string[];
  };
  weeklyGoal: string;
}

export const speakWritePlans: SpeakWritePlan[] = [
  {
    grade: 1,
    weakSkills: ['写', '自主阅读'],
    dailySpeaking: {
      title: '口语跟读',
      duration: '10 分钟',
      steps: ['bookr 绘本跟读 3 页', '用单词卡做简单问答', '录音回听自己的发音'],
    },
    dailyWriting: {
      title: '书写启蒙',
      duration: '10 分钟',
      steps: ['描红 5 个核心单词', '抄写自己名字和 3 个单词', '用单词造一个简单句'],
    },
    weeklyGoal: '能独立说出 5 个主题单词，手写 10 个单词',
  },
  {
    grade: 2,
    weakSkills: ['说', '写'],
    dailySpeaking: {
      title: 'OD 复述 + AI 对话',
      duration: '15 分钟',
      steps: ['用口袋领航围绕当天 OD 主题对话 5 分钟', '复述当天 RAZ 内容 3-5 句', '录音回听，修正语法错误'],
    },
    dailyWriting: {
      title: 'OD 书写 + 小练笔',
      duration: '15 分钟',
      steps: ['完成 OD 课程练习册中的书写题', '抄写 5 个核心单词并造句', '每周写 1 篇 5-8 句小短文'],
    },
    weeklyGoal: '能流利复述 2 篇课文，写 1 篇完整小短文',
  },
  {
    grade: 3,
    weakSkills: ['写作', '听力'],
    dailySpeaking: {
      title: 'KET 口语模拟',
      duration: '15 分钟',
      steps: ['口袋领航 KET 话题对话', '模拟 KET Part 1 自我介绍', '看图说话 1 分钟'],
    },
    dailyWriting: {
      title: 'KET 写作专项',
      duration: '20 分钟',
      steps: ['KET Part 6 邮件写作 1 篇', 'KET Part 7 看图写话 1 篇', '背诵 5 个写作常用句型'],
    },
    weeklyGoal: 'KET 写作模拟稳定 140+，口语能连续说 1 分钟',
  },
  {
    grade: 4,
    weakSkills: ['学术听力', '语法'],
    dailySpeaking: {
      title: 'PET/小托福口语',
      duration: '15 分钟',
      steps: ['口袋领航学术话题讨论', 'PET 口语 Part 2 图片描述', '小托福口语话题 1 道'],
    },
    dailyWriting: {
      title: 'PET 写作 + 学术语法',
      duration: '20 分钟',
      steps: ['PET 邮件/文章写作 1 篇', '小托福语言形式 20 题', '整理 5 个语法错题'],
    },
    weeklyGoal: 'PET 写作稳定 160+，学术听力能听懂 80%',
  },
  {
    grade: 5,
    weakSkills: ['考试稳定性', '面谈表达'],
    dailySpeaking: {
      title: '面谈模拟 + 口语维持',
      duration: '15 分钟',
      steps: ['模拟三公面谈英语问答', '用英语介绍自己的兴趣爱好', '用英语解释一个数学/科学问题'],
    },
    dailyWriting: {
      title: '小托福写作维持',
      duration: '15 分钟',
      steps: ['小托福 TPO 语法 20 题', '学术写作小段落 1 篇', '整理证书和荣誉英文表达'],
    },
    weeklyGoal: '小托福模考稳定 850+，面谈英语表达流利',
  },
];

export function getSpeakWritePlanByGrade(grade: number): SpeakWritePlan | null {
  return speakWritePlans.find((p) => p.grade === grade) || null;
}

// 证书考试时间轴（按孩子当前一升二推算）
export interface ExamEvent {
  id: string;
  name: string;
  target: string;
  date: string;
  month: string;
  registerBefore: string;
  status: 'upcoming' | 'current' | 'passed';
  notes: string;
}

export const examTimeline: ExamEvent[] = [
  {
    id: 'ket',
    name: 'KET',
    target: '卓越 140+',
    date: '2028.01-02',
    month: '三年级寒假',
    registerBefore: '2027.11 前联系机构代报',
    status: 'upcoming',
    notes: 'KET 一年多次，建议三年级上学期先摸底再确定考期',
  },
  {
    id: 'pet',
    name: 'PET',
    target: '卓越 160+',
    date: '2029.01-02',
    month: '四年级寒假',
    registerBefore: '2028.11 前联系机构代报',
    status: 'upcoming',
    notes: 'PET 卓越后，1-2 个月熟悉小托福题型即可首考',
  },
  {
    id: 'toefl-1',
    name: '小托福首考',
    target: '800+',
    date: '2029.04-05',
    month: '四年级春季',
    registerBefore: '2029.03 前报名',
    status: 'upcoming',
    notes: '利用 PET 卓越的能力峰值，重点适应学术听力和语言形式',
  },
  {
    id: 'toefl-2',
    name: '小托福二考',
    target: '850+',
    date: '2029.10-12',
    month: '五年级上',
    registerBefore: '2029.09 前报名',
    status: 'upcoming',
    notes: '五年级 12 月前必须拿到 850+，为三公鸡尾酒简历做准备',
  },
];

// RAZ / 蓝思 / 证书对应参考
export interface LexileRow {
  razLevel: string;
  lexileRange: string;
  equivalent: string;
  description: string;
}

export const lexileReference: LexileRow[] = [
  { razLevel: 'A-C', lexileRange: 'BR-200L', equivalent: '启蒙', description: '一年级目标，培养听读习惯' },
  { razLevel: 'D-F', lexileRange: '200L-400L', equivalent: '接近 KET', description: '二年级目标，quiz 正确率 80%+' },
  { razLevel: 'G-I', lexileRange: '400L-600L', equivalent: 'KET 通过', description: '三年级 KET 备考期' },
  { razLevel: 'J-L', lexileRange: '600L-800L', equivalent: 'KET 卓越 / PET', description: '四年级 PET/小托福衔接期' },
  { razLevel: 'M+', lexileRange: '800L+', equivalent: 'PET 卓越 / 小托福 800+', description: '五年级冲刺小托福 850+' },
];

// OD1 Unit 7-18 进度表
export const od1Schedule: OD1Unit[] = [
  { unit: 7, bigQuestion: 'How are seasons different?', theme: '四季变化', weeks: '7.7 - 7.13', focus: '词汇 + 阅读导入', checkpoint: '能描述四季特征' },
  { unit: 8, bigQuestion: 'How are seasons different?', theme: '四季变化', weeks: '7.14 - 7.20', focus: '语法 + 写作', checkpoint: '会用 because 表达原因' },
  { unit: 9, bigQuestion: 'How do numbers help us?', theme: '数字/数学', weeks: '7.28 - 8.3', focus: '数字词汇 + 阅读', checkpoint: '能用英语表达简单数学' },
  { unit: 10, bigQuestion: 'How do numbers help us?', theme: '数字/数学', weeks: '8.4 - 8.10', focus: '语法 + 项目', checkpoint: '完成数字主题项目' },
  { unit: 11, bigQuestion: 'What do we need?', theme: '生活需求', weeks: '8.18 - 8.24', focus: '需求相关词汇', checkpoint: '能讨论生活必需品' },
  { unit: 12, bigQuestion: 'What do we need?', theme: '生活需求', weeks: '8.25 - 8.31', focus: '综合输出', checkpoint: '单元练习册 80%+' },
  { unit: 13, bigQuestion: 'Where do we live?', theme: '居住环境', weeks: '9.8 - 9.14', focus: '住所/社区词汇', checkpoint: '能描述自己的家' },
  { unit: 14, bigQuestion: 'Where do we live?', theme: '居住环境', weeks: '9.15 - 9.21', focus: '地点介词 + 写作', checkpoint: '会写 5-8 句住所短文' },
  { unit: 15, bigQuestion: 'How can we make music?', theme: '音乐', weeks: '10.6 - 10.12', focus: '乐器/音乐词汇', checkpoint: '能介绍一种乐器' },
  { unit: 16, bigQuestion: 'How can we make music?', theme: '音乐', weeks: '10.13 - 10.19', focus: '综合项目', checkpoint: '音乐主题展示' },
  { unit: 17, bigQuestion: 'What are living things?', theme: '生物/非生物', weeks: '10.27 - 11.2', focus: '生物词汇 + 分类', checkpoint: '能区分 living/non-living' },
  { unit: 18, bigQuestion: 'What are living things?', theme: '生物/非生物', weeks: '11.3 - 11.9', focus: '综合复习', checkpoint: 'OD1 全册练习 80%+' },
];

// 关键检查点
export const englishCheckpoints: Checkpoint[] = [
  { time: '2025.08 底', target: 'Unit 7-12 完成', fallback: '进度落后则开学后每周多学 1 节 AI 课' },
  { time: '2025.10 中', target: 'Unit 13-16 完成，RAZ 升到 F', fallback: 'RAZ quiz 不够 80% 则降级重读' },
  { time: '2025.12 中', target: 'Unit 17-18 完成，OD1 总复习', fallback: '薄弱单元重新做练习册' },
  { time: '2026.01 底', target: 'OD1 收尾，蓝思 400+', fallback: '蓝思未达标则寒假加 RAZ 阅读量' },
];

// 资源清单
export const englishResources: ResourceItem[] = [
  { name: '超凡 AI 课', usage: 'OD1-3 主线课程，每单元 8 节' },
  { name: 'Oxford Discover 1-3', usage: '教材 + 课程练习册 + 单元练习册' },
  { name: '单词本 + 复述本', usage: '单词听写 + 课文复述' },
  { name: 'ABC Reading（RAZ）', usage: '每天 2-3 本，quiz 正确率 80%+' },
  { name: '口袋领航', usage: '每天 10-15 分钟 AI 口语对话' },
  { name: 'bookr', usage: '碎片时间听力/绘本补充' },
];

// 当前状态（按年级返回）
export interface EnglishStatus {
  gradeLabel: string;
  odUnit: number;
  odTotal: number;
  razLevel: string;
  dailyEnglishTime: string;
  weakSkills: string[];
  nextExam: string;
  nextExamDate: string;
}

export function getEnglishStatusByGrade(grade: number): EnglishStatus {
  const configs: Record<number, EnglishStatus> = {
    1: {
      gradeLabel: '一年级',
      odUnit: 0,
      odTotal: 18,
      razLevel: 'C',
      dailyEnglishTime: '30-60 分钟',
      weakSkills: ['写', '自主阅读'],
      nextExam: 'KET 卓越 140+',
      nextExamDate: '2028.01',
    },
    2: {
      gradeLabel: '一升二',
      odUnit: 7,
      odTotal: 18,
      razLevel: 'E',
      dailyEnglishTime: '1.5-2 小时',
      weakSkills: ['说', '写'],
      nextExam: 'KET 卓越 140+',
      nextExamDate: '2028.01',
    },
    3: {
      gradeLabel: '三年级',
      odUnit: 0,
      odTotal: 18,
      razLevel: 'I/J',
      dailyEnglishTime: '1.5 小时',
      weakSkills: ['写作', '听力'],
      nextExam: 'KET 卓越 140+',
      nextExamDate: '2028.01',
    },
    4: {
      gradeLabel: '四年级',
      odUnit: 1,
      odTotal: 18,
      razLevel: 'K/L',
      dailyEnglishTime: '1.5-2 小时',
      weakSkills: ['学术听力', '语法'],
      nextExam: 'PET 卓越 160+ / 小托福 800+',
      nextExamDate: '2028.02 / 2028.05',
    },
    5: {
      gradeLabel: '五年级',
      odUnit: 18,
      odTotal: 18,
      razLevel: 'K/L',
      dailyEnglishTime: '1.5 小时',
      weakSkills: ['考试稳定性', '面谈表达'],
      nextExam: '小托福 850+',
      nextExamDate: '2028.12',
    },
  };

  return configs[grade] || {
    gradeLabel: '小升初后',
    odUnit: 18,
    odTotal: 18,
    razLevel: 'K/L',
    dailyEnglishTime: '40-60 分钟',
    weakSkills: ['初中语法', '长篇阅读'],
    nextExam: '初中衔接',
    nextExamDate: '2029.09',
  };
}

// 计算进度
export function getEnglishProgress(odUnit: number, odTotal: number) {
  return {
    odProgress: Math.round((odUnit / odTotal) * 100),
    razLevels: ['E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'],
    currentRazIndex: 0,
  };
}

// 图表节点：用于英语三条线规划地图横向时间轴
export interface TrackNode {
  id: string;
  track: 'raz' | 'od' | 'exam';
  position: number; // 0-100 横向百分比位置
  label: string;
  detail: string;
  time: string;
  isCurrent?: boolean;
}

export const trackNodes: TrackNode[] = [
  // RAZ 线
  { id: 'raz-e', track: 'raz', position: 0, label: 'RAZ E', detail: '当前级别，quiz 正确率偏低需强化', time: '2025.07', isCurrent: true },
  { id: 'raz-g', track: 'raz', position: 13, label: 'RAZ G', detail: 'OD1 收尾时达到', time: '2026.01' },
  { id: 'raz-ij-1', track: 'raz', position: 28, label: 'RAZ I/J', detail: 'OD2 学完时达到', time: '2026.08' },
  { id: 'raz-ij-2', track: 'raz', position: 41, label: 'RAZ I/J', detail: 'KET 备考阶段维持', time: '2027.02' },
  { id: 'raz-kl-1', track: 'raz', position: 54, label: 'RAZ K/L', detail: 'PET 备考阶段达到', time: '2027.08' },
  { id: 'raz-kl-2', track: 'raz', position: 67, label: 'RAZ K/L', detail: 'PET/小托福衔接阶段', time: '2028.02' },
  { id: 'raz-kl-3', track: 'raz', position: 80, label: 'RAZ K/L', detail: '小托福首考阶段', time: '2028.08' },
  { id: 'raz-kl-4', track: 'raz', position: 91, label: 'RAZ K/L', detail: '小托福 850+ 维持', time: '2028.12' },

  // OD 线
  { id: 'od1-u7', track: 'od', position: 0, label: 'OD1 U7', detail: '当前进度，四季变化单元', time: '2025.07', isCurrent: true },
  { id: 'od1-u18', track: 'od', position: 13, label: 'OD1 U18', detail: 'OD1 全册学完', time: '2026.01' },
  { id: 'od2-u18', track: 'od', position: 28, label: 'OD2 U18', detail: 'OD2 全册学完，蓝思 350-400', time: '2026.08' },
  { id: 'od2-review', track: 'od', position: 41, label: 'OD2 复习', detail: 'KET 备考阶段复习 OD2', time: '2027.02' },
  { id: 'od3-u9', track: 'od', position: 54, label: 'OD3 U9', detail: 'OD3 前半完成', time: '2027.08' },
  { id: 'od3-u18', track: 'od', position: 67, label: 'OD3 U18', detail: 'OD3 全册学完', time: '2028.02' },
  { id: 'od3-end', track: 'od', position: 80, label: 'OD3 收尾', detail: '小托福题型适应期', time: '2028.08' },
  { id: 'od-maintain', track: 'od', position: 91, label: '维持', detail: '保持英语水平', time: '2028.12' },

  // 考证线
  { id: 'exam-start', track: 'exam', position: 0, label: '起步', detail: 'RAZ/OD 基础阶段', time: '2025.07', isCurrent: true },
  { id: 'exam-base', track: 'exam', position: 13, label: '基础', detail: '继续积累', time: '2026.01' },
  { id: 'exam-ket-prep', track: 'exam', position: 28, label: 'KET 备考', detail: '三年级上学期开始专项', time: '2026.09' },
  { id: 'exam-ket', track: 'exam', position: 41, label: 'KET 卓越', detail: '目标 140+', time: '2027.02' },
  { id: 'exam-pet-prep', track: 'exam', position: 54, label: 'PET 备考', detail: '三年级暑假开始', time: '2027.08' },
  { id: 'exam-pet', track: 'exam', position: 67, label: 'PET 卓越', detail: '目标 160+', time: '2028.02' },
  { id: 'exam-toefl-1', track: 'exam', position: 80, label: '小托福 800+', detail: '四年级春季首考', time: '2028.08' },
  { id: 'exam-toefl-2', track: 'exam', position: 91, label: '小托福 850+', detail: '五年级上 12 月前', time: '2028.12' },
];

export const timeAxisLabels = [
  { position: 0, label: '2025 暑假' },
  { position: 13, label: '2026 寒' },
  { position: 28, label: '2026 暑' },
  { position: 41, label: '2027 寒' },
  { position: 54, label: '2027 暑' },
  { position: 67, label: '2028 寒' },
  { position: 80, label: '2028 暑' },
  { position: 91, label: '2028 冬' },
  { position: 100, label: '三公' },
];
