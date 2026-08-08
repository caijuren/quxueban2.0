// 数学学科路径数据
// 服务于三公冲刺路线的 AMC8 / 竞赛证书体系

export interface Track {
  id: string;
  name: string;
  description: string;
}

export interface TrackNode {
  id: string;
  track: 'school' | 'olympiad' | 'exam';
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

export const mathTracks: Track[] = [
  {
    id: 'school',
    name: '校内数学',
    description: '保证校内成绩，建立计算和基础能力',
  },
  {
    id: 'olympiad',
    name: '奥数体系',
    description: '系统学习奥数七大模块，为 AMC8 打基础',
  },
  {
    id: 'exam',
    name: '竞赛证书',
    description: '袋鼠、澳洲 AMC、AMC8 等三公硬通货',
  },
];

// 从现在到三公的时间轴节点
export const mathTrackNodes: TrackNode[] = [
  // 校内数学
  {
    id: 'm-school-1',
    track: 'school',
    label: '二年级校内',
    position: 0,
    time: '2025.09',
    detail: '校内计算、应用题稳定 95+',
  },
  {
    id: 'm-school-2',
    track: 'school',
    label: '三年级校内',
    position: 25,
    time: '2026.09',
    detail: '四则运算、几何基础扎实',
  },
  {
    id: 'm-school-3',
    track: 'school',
    label: '四年级校内',
    position: 50,
    time: '2027.09',
    detail: '分数小数、简单方程',
  },
  {
    id: 'm-school-4',
    track: 'school',
    label: '五年级校内',
    position: 75,
    time: '2028.09',
    detail: '小升初复习，校内成绩保持前列',
  },
  {
    id: 'm-school-5',
    track: 'school',
    label: '初中衔接',
    position: 100,
    time: '2029.09',
    detail: '初中数学预习',
  },

  // 奥数体系
  {
    id: 'm-olympiad-1',
    track: 'olympiad',
    label: '奥数启蒙',
    position: 0,
    time: '2025.09',
    detail: '计算、图形、逻辑趣味题',
  },
  {
    id: 'm-olympiad-2',
    track: 'olympiad',
    label: '系统奥数',
    position: 25,
    time: '2026.09',
    detail: '七大模块入门：计算、几何、数论、组合',
  },
  {
    id: 'm-olympiad-3',
    track: 'olympiad',
    label: '模块深入',
    position: 50,
    time: '2027.09',
    detail: '数论、组合、几何进阶',
  },
  {
    id: 'm-olympiad-4',
    track: 'olympiad',
    label: 'AMC8 专题',
    position: 75,
    time: '2028.09',
    detail: 'AMC8 高频考点、真题训练',
  },
  {
    id: 'm-olympiad-5',
    track: 'olympiad',
    label: '奥数收尾',
    position: 100,
    time: '2029.05',
    detail: '三公前保持手感',
  },

  // 竞赛证书
  {
    id: 'm-exam-1',
    track: 'exam',
    label: '袋鼠 L1/L2',
    position: 8,
    time: '2026.04',
    detail: '低年级竞赛，培养兴趣和节奏',
  },
  {
    id: 'm-exam-2',
    track: 'exam',
    label: '袋鼠银奖',
    position: 28,
    time: '2027.04',
    detail: '三年级袋鼠 L2 银奖',
  },
  {
    id: 'm-exam-3',
    track: 'exam',
    label: '澳洲 AMC B',
    position: 42,
    time: '2027.09',
    detail: '四年级澳洲 AMC，目标 Distinction',
  },
  {
    id: 'm-exam-4',
    track: 'exam',
    label: 'AMC8 首考',
    position: 58,
    time: '2028.01',
    detail: '四年级寒假首考 AMC8，摸底水平',
  },
  {
    id: 'm-exam-5',
    track: 'exam',
    label: 'AMC8 二考',
    position: 72,
    time: '2028.11',
    detail: '五年级冲 20+',
  },
  {
    id: 'm-exam-6',
    track: 'exam',
    label: 'AMC8 20+',
    position: 85,
    time: '2029.01',
    detail: '三公简历核心硬通货',
  },
];

export const mathTimeAxisLabels = [
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

export const mathGradePlans: Record<number, GradePlan> = {
  1: {
    grade: '一年级',
    period: '2025.09 - 2026.07',
    targets: [
      { label: '计算能力', current: '20 以内加减', target: '100 以内加减' },
      { label: '数学兴趣', current: '培养中', target: '愿意思考' },
      { label: '逻辑推理', current: '图形、规律', target: '简单逻辑题' },
    ],
    weeklyTemplate: [
      { day: '周一', focus: '计算练习', duration: '15 分钟', materials: ['口算题', '计算 app'] },
      { day: '周二', focus: '趣味数学', duration: '20 分钟', materials: ['逻辑绘本', '数学游戏'] },
      { day: '周三', focus: '图形认知', duration: '20 分钟', materials: ['七巧板', '几何教具'] },
      { day: '周四', focus: '应用题启蒙', duration: '15 分钟', materials: ['生活数学'] },
      { day: '周五', focus: '计算练习', duration: '15 分钟', materials: ['口算题'] },
      { day: '周六', focus: '数学游戏', duration: '30 分钟', materials: ['桌游', '拼图'] },
      { day: '周日', focus: '周复习', duration: '15 分钟', materials: ['错题本'] },
    ],
    weakSkills: ['注意力', '读题理解'],
  },
  2: {
    grade: '一升二 ~ 二年级上',
    period: '2025.07 - 2026.01',
    targets: [
      { label: '校内数学', current: '二上已学 25%', target: '完成二上 + 预习二下' },
      { label: '高思奥数', current: '一上完成，一下进行中', target: '一下完成 + 二上启动' },
      { label: '计算能力', current: '100 以内加减', target: '表内乘除 + 混合运算熟练' },
      { label: '竞赛参赛', current: '袋鼠 70-80 分', target: '袋鼠 L1 银奖/铜奖' },
    ],
    weeklyTemplate: [
      {
        day: '周一',
        focus: '学而思学习机校内',
        duration: '30 分钟',
        materials: ['学而思学习机', '二上课程'],
      },
      {
        day: '周二',
        focus: '高思奥数新课',
        duration: '40 分钟',
        materials: ['高思教程一下', '配套练习'],
      },
      {
        day: '周三',
        focus: '计算专项 + 速度',
        duration: '20 分钟',
        materials: ['口算题', '计算练习册'],
      },
      {
        day: '周四',
        focus: '高思错题 + 难题拆解',
        duration: '30 分钟',
        materials: ['错题本', '高思练习'],
      },
      { day: '周五', focus: '应用题训练', duration: '25 分钟', materials: ['应用题专项'] },
      { day: '周六', focus: '袋鼠真题模拟', duration: '40 分钟', materials: ['袋鼠 L1 真题'] },
      {
        day: '周日',
        focus: '周复习 + 粗心复盘',
        duration: '30 分钟',
        materials: ['错题本', '计算复习'],
      },
    ],
    weakSkills: ['难题畏难', '熟练度不足', '粗心'],
  },
  3: {
    grade: '三年级',
    period: '2026.09 - 2027.08',
    targets: [
      { label: '奥数体系', current: '入门', target: '七大模块基础完成' },
      { label: '袋鼠竞赛', current: 'L1 体验', target: 'L2 银奖' },
      { label: '计算能力', current: '混合运算', target: '分数小数基础' },
    ],
    weeklyTemplate: [
      { day: '周一', focus: '奥数新课', duration: '45 分钟', materials: ['奥数教材', '视频课'] },
      { day: '周二', focus: '奥数练习', duration: '45 分钟', materials: ['配套练习册'] },
      { day: '周三', focus: '计算专项', duration: '30 分钟', materials: ['计算练习'] },
      { day: '周四', focus: '奥数错题', duration: '40 分钟', materials: ['错题本'] },
      { day: '周五', focus: '校内巩固', duration: '30 分钟', materials: ['校内作业'] },
      { day: '周六', focus: '袋鼠/澳洲 AMC 模拟', duration: '60 分钟', materials: ['真题卷'] },
      { day: '周日', focus: '周复习', duration: '30 分钟', materials: ['错题本'] },
    ],
    weakSkills: ['数论', '组合计数'],
  },
  4: {
    grade: '四年级',
    period: '2027.09 - 2028.08',
    targets: [
      { label: 'AMC8 首考', current: '备考中', target: '15+ 摸底' },
      { label: '澳洲 AMC', current: '参赛', target: 'Distinction' },
      { label: '奥数体系', current: '基础完成', target: '模块深入' },
    ],
    weeklyTemplate: [
      {
        day: '周一',
        focus: 'AMC8 知识点',
        duration: '45 分钟',
        materials: ['AMC8 教材', '专题训练'],
      },
      { day: '周二', focus: '奥数模块', duration: '45 分钟', materials: ['数论/几何进阶'] },
      { day: '周三', focus: '计算 + 速度', duration: '30 分钟', materials: ['限时计算'] },
      { day: '周四', focus: 'AMC8 真题', duration: '45 分钟', materials: ['AMC8 历年真题'] },
      { day: '周五', focus: '错题整理', duration: '30 分钟', materials: ['错题本'] },
      { day: '周六', focus: 'AMC8 模拟考', duration: '75 分钟', materials: ['AMC8 模拟卷'] },
      { day: '周日', focus: '周复习', duration: '30 分钟', materials: ['错题本'] },
    ],
    weakSkills: ['速度', '难题突破'],
  },
  5: {
    grade: '五年级',
    period: '2028.09 - 2029.05',
    targets: [
      { label: 'AMC8', current: '15+', target: '20+' },
      { label: '奥数收尾', current: '深入中', target: '保持手感' },
      { label: '简历归档', current: '整理中', target: '完整竞赛证书' },
    ],
    weeklyTemplate: [
      { day: '周一', focus: 'AMC8 高频考点', duration: '45 分钟', materials: ['AMC8 专项'] },
      { day: '周二', focus: 'AMC8 真题', duration: '45 分钟', materials: ['历年真题'] },
      { day: '周三', focus: '错题重做', duration: '40 分钟', materials: ['错题本'] },
      { day: '周四', focus: '速度训练', duration: '30 分钟', materials: ['限时训练'] },
      { day: '周五', focus: '校内复习', duration: '30 分钟', materials: ['校内作业'] },
      { day: '周六', focus: 'AMC8 全真模考', duration: '75 分钟', materials: ['AMC8 模拟卷'] },
      { day: '周日', focus: '周复习', duration: '30 分钟', materials: ['错题本'] },
    ],
    weakSkills: ['稳定性', '最后 5 题'],
  },
};

export const postExamMathPlan: GradePlan = {
  grade: '小升初后',
  period: '2029.09 起',
  targets: [{ label: '初中数学', current: '预备', target: '七年级适应' }],
  weeklyTemplate: [
    { day: '周一', focus: '初中预习', duration: '45 分钟', materials: ['初中教材'] },
    { day: '周二', focus: '计算维持', duration: '20 分钟', materials: ['计算练习'] },
    { day: '周三', focus: '几何入门', duration: '30 分钟', materials: ['几何专项'] },
    { day: '周四', focus: '应用题', duration: '30 分钟', materials: ['应用题训练'] },
    { day: '周五', focus: '错题复习', duration: '20 分钟', materials: ['错题本'] },
    { day: '周六', focus: '综合练习', duration: '45 分钟', materials: ['练习卷'] },
    { day: '周日', focus: '周复习', duration: '20 分钟', materials: ['错题本'] },
  ],
  weakSkills: ['初中代数'],
};

export function getMathPlanByGrade(grade: number): GradePlan {
  return mathGradePlans[grade] || postExamMathPlan;
}

export interface MathStatus {
  gradeLabel: string;
  currentTopic: string;
  dailyMathTime: string;
  weakSkills: string[];
  nextExam: string;
  nextExamDate: string;
}

export function getMathStatusByGrade(grade: number): MathStatus {
  const configs: Record<number, MathStatus> = {
    1: {
      gradeLabel: '一年级',
      currentTopic: '计算启蒙',
      dailyMathTime: '20-30 分钟',
      weakSkills: ['注意力', '读题理解'],
      nextExam: '袋鼠 L1',
      nextExamDate: '2027.04',
    },
    2: {
      gradeLabel: '一升二',
      currentTopic: '高思一下 + 校内二上',
      dailyMathTime: '1 小时+',
      weakSkills: ['难题畏难', '熟练度不足', '粗心'],
      nextExam: '袋鼠 L1',
      nextExamDate: '2026.04',
    },
    3: {
      gradeLabel: '三年级',
      currentTopic: '系统奥数 · 七大模块',
      dailyMathTime: '60 分钟',
      weakSkills: ['数论', '组合计数'],
      nextExam: '袋鼠 L2 银奖',
      nextExamDate: '2027.04',
    },
    4: {
      gradeLabel: '四年级',
      currentTopic: 'AMC8 专题',
      dailyMathTime: '60-75 分钟',
      weakSkills: ['速度', '难题突破'],
      nextExam: 'AMC8 首考',
      nextExamDate: '2028.01',
    },
    5: {
      gradeLabel: '五年级',
      currentTopic: 'AMC8 冲刺',
      dailyMathTime: '60-75 分钟',
      weakSkills: ['稳定性', '最后 5 题'],
      nextExam: 'AMC8 20+',
      nextExamDate: '2029.01',
    },
  };

  return (
    configs[grade] || {
      gradeLabel: '小升初后',
      currentTopic: '初中衔接',
      dailyMathTime: '45 分钟',
      weakSkills: ['初中代数'],
      nextExam: '初中适应',
      nextExamDate: '2029.09',
    }
  );
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

export const mathExamTimeline: ExamEvent[] = [
  {
    id: 'kangaroo-l1',
    name: '袋鼠数学 L1',
    target: '体验参赛',
    date: '2026.04',
    month: '二年级春季',
    registerBefore: '2026.03 前报名',
    notes: '一年级/二年级可参加 L1，重在培养竞赛节奏和兴趣',
  },
  {
    id: 'kangaroo-l2',
    name: '袋鼠数学 L2',
    target: '银奖',
    date: '2027.04',
    month: '三年级春季',
    registerBefore: '2027.03 前报名',
    notes: '三年级参加 L2，目标银奖以上，为简历积累竞赛经历',
  },
  {
    id: 'amc-b',
    name: '澳洲 AMC B',
    target: 'Distinction',
    date: '2027.09',
    month: '四年级上',
    registerBefore: '2027.08 前报名',
    notes: '澳洲 AMC 是 AMC8 前很好的过渡竞赛',
  },
  {
    id: 'amc8-first',
    name: 'AMC8 首考',
    target: '15+ 摸底',
    date: '2028.01',
    month: '四年级寒假',
    registerBefore: '2027.11 前报名',
    notes: 'AMC8 一年一次，首考摸底真实水平',
  },
  {
    id: 'amc8-second',
    name: 'AMC8 二考',
    target: '20+',
    date: '2028.11',
    month: '五年级上',
    registerBefore: '2028.10 前报名',
    notes: '五年级上学期是冲 20+ 的关键考期',
  },
  {
    id: 'amc8-final',
    name: 'AMC8 最终考',
    target: '20+',
    date: '2029.01',
    month: '五年级寒假',
    registerBefore: '2028.11 前报名',
    notes: '三公前最后一次 AMC8，必须拿到 20+',
  },
];
