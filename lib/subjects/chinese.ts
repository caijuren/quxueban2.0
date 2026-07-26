// 语文学科路径数据
// 服务于三公冲刺路线的语文素养、竞赛荣誉、面谈表达

export interface Track {
  id: string;
  name: string;
  description: string;
}

export interface TrackNode {
  id: string;
  track: 'classics' | 'reading' | 'honor';
  label: string;
  position: number;
  time: string;
  detail: string;
  isCurrent?: boolean;
}

export interface WeeklyTask {
  day: string;
  focus: string;
  duration: string;
  materials: string[];
}

export const chineseTracks: Track[] = [
  {
    id: 'classics',
    name: '古诗文积累',
    description: '古诗、古文、文学常识，竞赛和面谈的基础',
  },
  {
    id: 'reading',
    name: '阅读写作',
    description: '阅读理解、写作表达，校内成绩和面谈素材',
  },
  {
    id: 'honor',
    name: '竞赛荣誉',
    description: '汉字小达人、古诗文大会、校内荣誉等简历亮点',
  },
];

export const chineseTrackNodes: TrackNode[] = [
  // 古诗文积累
  { id: 'c-classics-1', track: 'classics', label: '古诗启蒙', position: 0, time: '2025.09', detail: '每周 1-2 首古诗，熟读成诵' },
  { id: 'c-classics-2', track: 'classics', label: '古诗理解', position: 25, time: '2026.09', detail: '理解诗意、作者、背景，尝试赏析' },
  { id: 'c-classics-3', track: 'classics', label: '古文入门', position: 50, time: '2027.09', detail: '小古文 100 篇，积累文言词汇' },
  { id: 'c-classics-4', track: 'classics', label: '古诗文大会', position: 75, time: '2028.09', detail: '参赛并冲刺复赛' },
  { id: 'c-classics-5', track: 'classics', label: '文学素养', position: 100, time: '2029.05', detail: '面谈中能引用古诗文表达观点' },

  // 阅读写作
  { id: 'c-reading-1', track: 'reading', label: '绘本/桥梁书', position: 0, time: '2025.09', detail: '培养阅读兴趣，每天阅读 30 分钟' },
  { id: 'c-reading-2', track: 'reading', label: '儿童文学', position: 25, time: '2026.09', detail: '名著 simplified 版，写读书笔记' },
  { id: 'c-reading-3', track: 'reading', label: '精读训练', position: 50, time: '2027.09', detail: '阅读理解题型训练，答题规范' },
  { id: 'c-reading-4', track: 'reading', label: '写作提升', position: 75, time: '2028.09', detail: '记叙文、议论文框架训练' },
  { id: 'c-reading-5', track: 'reading', label: '面谈表达', position: 100, time: '2029.05', detail: '自我介绍、观点表达、即兴问答' },

  // 竞赛荣誉
  { id: 'c-honor-1', track: 'honor', label: '校内荣誉', position: 10, time: '2026.06', detail: '三好生、全优、优秀班干部等' },
  { id: 'c-honor-2', track: 'honor', label: '汉字小达人', position: 35, time: '2027.04', detail: '三年级参赛，展示汉字储备' },
  { id: 'c-honor-3', track: 'honor', label: '古诗文大会', position: 55, time: '2027.11', detail: '四年级参赛，冲击复赛/决赛' },
  { id: 'c-honor-4', track: 'honor', label: '综合荣誉', position: 78, time: '2028.09', detail: '红领巾、市/区荣誉、社会实践活动' },
  { id: 'c-honor-5', track: 'honor', label: '简历归档', position: 95, time: '2029.04', detail: '整理所有证书和荣誉材料' },
];

export const chineseTimeAxisLabels = [
  { label: '2025 暑假', position: 0 },
  { label: '二上', position: 12 },
  { label: '二下', position: 24 },
  { label: '三上', position: 36 },
  { label: '三下', position: 48 },
  { label: '四上', position: 60 },
  { label: '四下', position: 72 },
  { label: '五上', position: 84 },
  { label: '三公', position: 100 },
];

export interface GradePlan {
  grade: string;
  period: string;
  targets: { label: string; current: string; target: string }[];
  weeklyTemplate: WeeklyTask[];
  weakSkills?: string[];
}

export const chineseGradePlans: Record<number, GradePlan> = {
  1: {
    grade: '一年级',
    period: '2025.09 - 2026.07',
    targets: [
      { label: '古诗积累', current: '0 首', target: '30 首' },
      { label: '阅读习惯', current: '亲子共读', target: '自主阅读 20 分钟' },
      { label: '写字规范', current: '笔画练习', target: '坐姿、握笔、笔顺正确' },
    ],
    weeklyTemplate: [
      { day: '周一', focus: '古诗诵读', duration: '15 分钟', materials: ['古诗卡片', '音频'] },
      { day: '周二', focus: '亲子阅读', duration: '30 分钟', materials: ['绘本', '桥梁书'] },
      { day: '周三', focus: '写字练习', duration: '15 分钟', materials: ['描红本', '练字帖'] },
      { day: '周四', focus: '古诗复习', duration: '10 分钟', materials: ['古诗卡片'] },
      { day: '周五', focus: '看图说话', duration: '15 分钟', materials: ['看图说话练习'] },
      { day: '周六', focus: '阅读时间', duration: '40 分钟', materials: ['绘本馆', '家庭藏书'] },
      { day: '周日', focus: '周复习', duration: '20 分钟', materials: ['古诗', '生字'] },
    ],
    weakSkills: ['识字量', '专注力'],
  },
  2: {
    grade: '一升二 ~ 二年级上',
    period: '2025.07 - 2026.01',
    targets: [
      { label: '识字量', current: '1819 字', target: '2500 字+' },
      { label: '国学积累', current: '三字经全背，千字文半', target: '古诗 75+80 系统背诵' },
      { label: '输出能力', current: '无系统训练', target: '能写 100 字小短文' },
      { label: '阅读维持', current: '130 页章节书无障碍', target: '保持阅读量 + 加读书笔记' },
    ],
    weeklyTemplate: [
      { day: '周一', focus: '古诗 75+80 新学', duration: '20 分钟', materials: ['古诗书', '音频'] },
      { day: '周二', focus: '国学诵读', duration: '20 分钟', materials: ['三字经', '千字文', '声律启蒙', '论语'] },
      { day: '周三', focus: '看图写话/小练笔', duration: '25 分钟', materials: ['看图写话本', '作文本'] },
      { day: '周四', focus: '古诗复习 + 默写', duration: '20 分钟', materials: ['古诗卡片', '默写本'] },
      { day: '周五', focus: '写字练习', duration: '20 分钟', materials: ['默写能手', '练字帖'] },
      { day: '周六', focus: '整本书阅读 + 读书笔记', duration: '40 分钟', materials: ['儿童文学', '西游/封神', '读书笔记本'] },
      { day: '周日', focus: '周复习', duration: '25 分钟', materials: ['古诗', '生字', '本周小练笔'] },
    ],
    weakSkills: ['输出能力', '写作系统训练'],
  },
  3: {
    grade: '三年级',
    period: '2026.09 - 2027.08',
    targets: [
      { label: '古诗积累', current: '60 首', target: '100 首' },
      { label: '阅读理解', current: '基础题', target: '能答完整' },
      { label: '汉字小达人', current: '准备中', target: '参赛' },
      { label: '写作', current: '短文', target: '300 字作文' },
    ],
    weeklyTemplate: [
      { day: '周一', focus: '古诗新学 + 默写', duration: '25 分钟', materials: ['古诗 75+80', '默写本'] },
      { day: '周二', focus: '阅读理解专项', duration: '35 分钟', materials: ['阅读训练', '答题模板'] },
      { day: '周三', focus: '写作训练', duration: '35 分钟', materials: ['作文本', '好词好句'] },
      { day: '周四', focus: '汉字小达人准备', duration: '25 分钟', materials: ['汉字练习', '成语积累'] },
      { day: '周五', focus: '古诗文大会准备', duration: '25 分钟', materials: ['古诗文大会题库'] },
      { day: '周六', focus: '整本书阅读 + 读书笔记', duration: '45 分钟', materials: ['儿童文学', '读书笔记本'] },
      { day: '周日', focus: '周复习', duration: '30 分钟', materials: ['古诗', '错题'] },
    ],
    weakSkills: ['阅读理解答题规范', '作文结构'],
  },
  4: {
    grade: '四年级',
    period: '2027.09 - 2028.08',
    targets: [
      { label: '古诗文', current: '100 首', target: '120 首 + 小古文 50 篇' },
      { label: '古诗文大会', current: '参赛', target: '复赛' },
      { label: '阅读写作', current: '300 字', target: '400 字 + 有观点' },
      { label: '综合荣誉', current: '校内', target: '区/市荣誉' },
    ],
    weeklyTemplate: [
      { day: '周一', focus: '小古文精读', duration: '30 分钟', materials: ['小古文 100 篇', '文言词典'] },
      { day: '周二', focus: '阅读理解提升', duration: '40 分钟', materials: ['阅读训练', '真题'] },
      { day: '周三', focus: '作文训练', duration: '40 分钟', materials: ['作文本', '范文'] },
      { day: '周四', focus: '古诗文大会冲刺', duration: '30 分钟', materials: ['题库', '文学常识'] },
      { day: '周五', focus: '综合素养', duration: '30 分钟', materials: ['社会实践', '新闻阅读'] },
      { day: '周六', focus: '整本书精读', duration: '50 分钟', materials: ['名著 simplified', '读书笔记'] },
      { day: '周日', focus: '周复习', duration: '30 分钟', materials: ['古诗', '小古文'] },
    ],
    weakSkills: ['小古文', '作文立意'],
  },
  5: {
    grade: '五年级',
    period: '2028.09 - 2029.05',
    targets: [
      { label: '古诗文', current: '积累完成', target: '能灵活运用' },
      { label: '面谈表达', current: '练习中', target: '流利自信' },
      { label: '简历材料', current: '零散', target: '完整归档' },
      { label: '写作', current: '400 字', target: '500 字 + 有思想' },
    ],
    weeklyTemplate: [
      { day: '周一', focus: '古诗文复习', duration: '25 分钟', materials: ['古诗', '小古文'] },
      { day: '周二', focus: '面谈话题准备', duration: '35 分钟', materials: ['面谈题库', '自我介绍'] },
      { day: '周三', focus: '议论文/观点写作', duration: '40 分钟', materials: ['作文本', '时事素材'] },
      { day: '周四', focus: '阅读理解保持', duration: '30 分钟', materials: ['阅读训练'] },
      { day: '周五', focus: '简历整理', duration: '25 分钟', materials: ['证书', '荣誉材料'] },
      { day: '周六', focus: '综合阅读', duration: '40 分钟', materials: ['名著', '报刊'] },
      { day: '周日', focus: '周复习', duration: '30 分钟', materials: ['古诗', '面谈素材'] },
    ],
    weakSkills: ['面谈临场', '观点表达'],
  },
};

export const postExamChinesePlan: GradePlan = {
  grade: '小升初后',
  period: '2029.09 起',
  targets: [
    { label: '初中语文', current: '预备', target: '七年级适应' },
  ],
  weeklyTemplate: [
    { day: '周一', focus: '初中古文预习', duration: '30 分钟', materials: ['初中古文'] },
    { day: '周二', focus: '阅读理解', duration: '30 分钟', materials: ['阅读训练'] },
    { day: '周三', focus: '写作练习', duration: '30 分钟', materials: ['作文本'] },
    { day: '周四', focus: '名著阅读', duration: '30 分钟', materials: ['初中必读'] },
    { day: '周五', focus: '基础积累', duration: '20 分钟', materials: ['字词', '成语'] },
    { day: '周六', focus: '综合阅读', duration: '40 分钟', materials: ['名著', '报刊'] },
    { day: '周日', focus: '周复习', duration: '20 分钟', materials: ['错题', '古诗'] },
  ],
  weakSkills: ['初中古文'],
};

export function getChinesePlanByGrade(grade: number): GradePlan {
  return chineseGradePlans[grade] || postExamChinesePlan;
}

export interface ChineseStatus {
  gradeLabel: string;
  currentTopic: string;
  dailyChineseTime: string;
  weakSkills: string[];
  nextEvent: string;
  nextEventDate: string;
}

export function getChineseStatusByGrade(grade: number): ChineseStatus {
  const configs: Record<number, ChineseStatus> = {
    1: {
      gradeLabel: '一年级',
      currentTopic: '古诗启蒙 · 阅读兴趣',
      dailyChineseTime: '30 分钟',
      weakSkills: ['识字量', '专注力'],
      nextEvent: '古诗 30 首',
      nextEventDate: '2026.07',
    },
    2: {
      gradeLabel: '一升二',
      currentTopic: '识字 1819 · 阅读章节书 · 国学三字经',
      dailyChineseTime: '45-60 分钟',
      weakSkills: ['输出能力', '写作系统训练'],
      nextEvent: '古诗 75+80 系统背诵启动',
      nextEventDate: '2025.09',
    },
    3: {
      gradeLabel: '三年级',
      currentTopic: '古诗 100 首 · 汉字小达人',
      dailyChineseTime: '45-60 分钟',
      weakSkills: ['阅读理解答题规范', '作文结构'],
      nextEvent: '汉字小达人',
      nextEventDate: '2027.04',
    },
    4: {
      gradeLabel: '四年级',
      currentTopic: '小古文 · 古诗文大会',
      dailyChineseTime: '45-60 分钟',
      weakSkills: ['小古文', '作文立意'],
      nextEvent: '古诗文大会复赛',
      nextEventDate: '2027.11',
    },
    5: {
      gradeLabel: '五年级',
      currentTopic: '面谈准备 · 简历归档',
      dailyChineseTime: '45-60 分钟',
      weakSkills: ['面谈临场', '观点表达'],
      nextEvent: '三公面谈',
      nextEventDate: '2029.05',
    },
  };

  return configs[grade] || {
    gradeLabel: '小升初后',
    currentTopic: '初中衔接',
    dailyChineseTime: '40 分钟',
    weakSkills: ['初中古文'],
    nextEvent: '初中适应',
    nextEventDate: '2029.09',
  };
}

export interface ExamEvent {
  id: string;
  name: string;
  target: string;
  date: string;
  month: string;
  registerBefore: string;
  notes: string;
}

export const chineseExamTimeline: ExamEvent[] = [
  {
    id: 'hanzi',
    name: '汉字小达人',
    target: '参赛',
    date: '2027.04',
    month: '三年级春季',
    registerBefore: '学校统一报名',
    notes: '考察汉字储备和书写，三年级开始可以参赛',
  },
  {
    id: 'gushihui-1',
    name: '古诗文大会（初赛）',
    target: '通过初赛',
    date: '2027.11',
    month: '四年级上',
    registerBefore: '学校统一报名',
    notes: '四年级开始系统参赛，目标进入复赛',
  },
  {
    id: 'gushihui-2',
    name: '古诗文大会（复赛）',
    target: '冲进复赛',
    date: '2027.12',
    month: '四年级上',
    registerBefore: '初赛晋级',
    notes: '复赛难度明显提升，需要文学常识积累',
  },
  {
    id: 'gushihui-3',
    name: '古诗文大会（决赛）',
    target: '决赛',
    date: '2028.03',
    month: '四年级下',
    registerBefore: '复赛晋级',
    notes: '如果能进决赛，是简历上很好的亮点',
  },
  {
    id: 'resume',
    name: '综合荣誉整理',
    target: '完整简历',
    date: '2029.04',
    month: '五年级下',
    registerBefore: '提前准备',
    notes: '三公鸡尾酒简历需要古诗文、汉字、校内荣誉、社会实践等',
  },
];
