import {
  Target,
  Shield,
  School,
  Globe,
  Scale,
  GraduationCap,
  Layers,
  Home,
  Clock,
  CheckCircle2,
  Calculator,
  BookOpen,
  Languages,
  Award,
  Lightbulb,
  Palette,
  FileText,
} from 'lucide-react';

export interface RoutePlan {
  id: string;
  name: string;
  type: 'primary' | 'backup';
  status: 'active' | 'standby' | 'completed';
  description: string;
  probability: number;
  requirements: string[];
  milestones: { time: string; task: string }[];
  targets: {
    slug: string;
    name: string;
    tag: string;
    icon: typeof Target;
    color: string;
    shadow: string;
  }[];
}

export interface KeyResultNode {
  time: string;
  title: string;
  result: string;
  status: 'completed' | 'in-progress' | 'pending' | 'at-risk';
  fallbackSignal?: string;
}

export interface SubjectPathPhase {
  time: string;
  title: string;
  content: string;
  milestone: string;
}

export interface SubjectPath {
  id: string;
  name: string;
  icon: typeof Target;
  color: string;
  startTime: string;
  phases: SubjectPathPhase[];
}

export interface RouteMatrixCell {
  grade: string;
  category: string;
  target: string;
  timing: string;
  fallback: string;
  repeatable?: boolean;
  priority?: 'must' | 'should' | 'optional';
}

export interface RouteMatrixRow {
  id: string;
  category: string;
  icon: typeof Target;
  color: string;
  cells: RouteMatrixCell[];
}

export const sgMatrixGrades = ['二年级', '三年级', '四年级', '五年级上', '五年级下'] as const;

export const sgRouteMatrix: RouteMatrixRow[] = [
  {
    id: 'english',
    category: '英语证书',
    icon: Languages,
    color: 'from-secondary to-violet-400',
    cells: [
      {
        grade: '二年级',
        category: '英语证书',
        target: 'KET 卓越 140+',
        timing: '二年级暑假',
        fallback: '未达 140 可再考或调整后续节奏',
        priority: 'must',
      },
      {
        grade: '三年级',
        category: '英语证书',
        target: 'PET 优秀/卓越 160+',
        timing: '三年级寒假/暑假',
        fallback: '未达 160 可再考或调整节奏',
        priority: 'must',
      },
      {
        grade: '四年级',
        category: '英语证书',
        target: '小托福首考 800+',
        timing: '四年级寒假/暑假',
        fallback: '未达 800 则四年级暑假密集补差',
        priority: 'must',
      },
      {
        grade: '五年级上',
        category: '英语证书',
        target: '小托福 850+',
        timing: '五年级上 12 月前',
        fallback: '低于 850 可再考 1 次',
        repeatable: true,
        priority: 'must',
      },
      {
        grade: '五年级下',
        category: '英语证书',
        target: '维持成绩，整理面谈素材',
        timing: '五年级下',
        fallback: '—',
        priority: 'should',
      },
    ],
  },
  {
    id: 'math',
    category: '数学竞赛',
    icon: Calculator,
    color: 'from-primary to-rose-400',
    cells: [
      {
        grade: '二年级',
        category: '数学竞赛',
        target: '袋鼠 L1 银奖+',
        timing: '二年级春季',
        fallback: '铜奖则三年级继续冲银奖',
        priority: 'should',
      },
      {
        grade: '三年级',
        category: '数学竞赛',
        target: '袋鼠 L2 银奖+',
        timing: '三年级春季',
        fallback: '铜奖则四年级加强 AMC 体系',
        priority: 'should',
      },
      {
        grade: '四年级',
        category: '数学竞赛',
        target: '澳洲 AMC B 银奖+',
        timing: '四年级秋季',
        fallback: '铜奖则五年级上 AMC8 需更密集冲刺',
        priority: 'should',
      },
      {
        grade: '五年级上',
        category: '数学竞赛',
        target: 'AMC8 20+（首考目标 15+）',
        timing: '五年级上 1 月',
        fallback: '首考 15+，未达 20 可再考一次',
        repeatable: true,
        priority: 'must',
      },
      {
        grade: '五年级下',
        category: '数学竞赛',
        target: '维持，整理面谈素材',
        timing: '五年级下',
        fallback: '—',
        priority: 'should',
      },
    ],
  },
  {
    id: 'chinese',
    category: '语文竞赛',
    icon: BookOpen,
    color: 'from-accent to-cyan-400',
    cells: [
      {
        grade: '二年级',
        category: '语文竞赛',
        target: '诗词背诵积累，小学必背 75 首启动',
        timing: '二年级全年',
        fallback: '未启动则三年级需加速背诵',
        priority: 'should',
      },
      {
        grade: '三年级',
        category: '语文竞赛',
        target: '汉字小达人',
        timing: '三年级秋季',
        fallback: '未获奖则四年级继续古诗文大会',
        priority: 'should',
      },
      {
        grade: '四年级',
        category: '语文竞赛',
        target: '古诗文大会参赛并争取获奖',
        timing: '四年级秋季',
        fallback: '未获奖则五年级上继续冲奖',
        repeatable: true,
        priority: 'should',
      },
      {
        grade: '五年级上',
        category: '语文竞赛',
        target: '古诗文大会冲奖 + 韬奋杯/长三角作文大赛',
        timing: '五年级上',
        fallback: '古诗文大会可再参加一次，作文比赛二选一',
        repeatable: true,
        priority: 'must',
      },
      {
        grade: '五年级下',
        category: '语文竞赛',
        target: '整理所有语文证书，归入简历',
        timing: '五年级下',
        fallback: '—',
        priority: 'should',
      },
    ],
  },
  {
    id: 'honor',
    category: '综合荣誉',
    icon: Award,
    color: 'from-warning to-amber-400',
    cells: [
      {
        grade: '二年级',
        category: '综合荣誉',
        target: '校内成绩前 10%',
        timing: '每学期',
        fallback: '低于前 15% 需分析薄弱科并补差',
        priority: 'should',
      },
      {
        grade: '三年级',
        category: '综合荣誉',
        target: '校级三好 / 优秀少先队员',
        timing: '三年级学年评优',
        fallback: '未获评则四年级争取并连任',
        priority: 'should',
      },
      {
        grade: '四年级',
        category: '综合荣誉',
        target: '区级以上荣誉 / 班干部',
        timing: '四年级学年',
        fallback: '未获区级则五年级上必须拿下',
        priority: 'should',
      },
      {
        grade: '五年级上',
        category: '综合荣誉',
        target: '区级以上荣誉 / 大队委 + 材料汇总',
        timing: '五年级上寒假前',
        fallback: '至少保持校级荣誉',
        priority: 'must',
      },
      {
        grade: '五年级下',
        category: '综合荣誉',
        target: '网申 + 面谈',
        timing: '五年级下 4-5 月',
        fallback: '未录取立即切换摇号/对口',
        priority: 'must',
      },
    ],
  },
  {
    id: 'science',
    category: '科创',
    icon: Lightbulb,
    color: 'from-emerald-500 to-teal-400',
    cells: [
      {
        grade: '二年级',
        category: '科创',
        target: '兴趣启蒙，接触机器人/编程',
        timing: '二年级',
        fallback: '未接触则三年级再评估是否启动',
        priority: 'optional',
      },
      {
        grade: '三年级',
        category: '科创',
        target: '科创活动体验',
        timing: '三年级',
        fallback: '体验后决定是否深入 1 个方向',
        priority: 'optional',
      },
      {
        grade: '四年级',
        category: '科创',
        target: '青少年科技创新大赛准备',
        timing: '四年级',
        fallback: '准备不足则五年级上改参赛人工智能挑战赛',
        priority: 'optional',
      },
      {
        grade: '五年级上',
        category: '科创',
        target: '青少年科技创新大赛 / 人工智能挑战赛获奖',
        timing: '五年级上',
        fallback: '未获奖则科创不作为简历重点',
        priority: 'optional',
      },
      {
        grade: '五年级下',
        category: '科创',
        target: '成果整理，归入简历',
        timing: '五年级下',
        fallback: '无科创成果则依赖语数英硬通货',
        priority: 'optional',
      },
    ],
  },
  {
    id: 'art',
    category: '艺术（绘画）',
    icon: Palette,
    color: 'from-fuchsia-500 to-pink-400',
    cells: [
      {
        grade: '二年级',
        category: '艺术（绘画）',
        target: '兴趣培养',
        timing: '二年级',
        fallback: '无兴趣则三年级放弃艺术路线',
        priority: 'optional',
      },
      {
        grade: '三年级',
        category: '艺术（绘画）',
        target: '绘画考级 / 白名单赛事体验',
        timing: '三年级',
        fallback: '未获奖则四年级继续参赛冲奖',
        priority: 'optional',
      },
      {
        grade: '四年级',
        category: '艺术（绘画）',
        target: '教育部白名单绘画赛事参赛并争取获奖',
        timing: '四年级',
        fallback: '未获奖则五年级上最后冲刺',
        priority: 'optional',
      },
      {
        grade: '五年级上',
        category: '艺术（绘画）',
        target: '绘画赛事冲奖 + 成果整理',
        timing: '五年级上',
        fallback: '无奖项则艺术不作为简历重点',
        priority: 'optional',
      },
      {
        grade: '五年级下',
        category: '艺术（绘画）',
        target: '简历素材',
        timing: '五年级下',
        fallback: '无艺术成果则依赖语数英硬通货',
        priority: 'optional',
      },
    ],
  },
  {
    id: 'application',
    category: '申请流程',
    icon: FileText,
    color: 'from-slate-500 to-slate-400',
    cells: [
      {
        grade: '二年级',
        category: '申请流程',
        target: '—',
        timing: '二年级',
        fallback: '—',
        priority: 'optional',
      },
      {
        grade: '三年级',
        category: '申请流程',
        target: '—',
        timing: '三年级',
        fallback: '—',
        priority: 'optional',
      },
      {
        grade: '四年级',
        category: '申请流程',
        target: '—',
        timing: '四年级',
        fallback: '—',
        priority: 'optional',
      },
      {
        grade: '五年级上',
        category: '申请流程',
        target: '整理三公简历材料',
        timing: '五年级上',
        fallback: '材料不齐则寒假补全',
        priority: 'must',
      },
      {
        grade: '五年级下',
        category: '申请流程',
        target: '4 月网申 / 5 月面谈 / 录取确认',
        timing: '五年级下',
        fallback: '未录取则切换摇号或对口',
        priority: 'must',
      },
    ],
  },
];

export const sgKeyResults: KeyResultNode[] = [
  {
    time: '三年级下',
    title: '英语基础证书',
    result: 'KET 通过（120+）',
    status: 'pending',
    fallbackSignal: '未通过则三公节奏偏慢，需加大投入或评估切换',
  },
  {
    time: '四年级下',
    title: '数学首次试水',
    result: 'AMC8 首考 15+',
    status: 'pending',
    fallbackSignal: '低于 15 分说明竞赛思维未建立，需考虑切换摇号/对口',
  },
  {
    time: '四年级下',
    title: '英语进阶证书',
    result: 'PET 通过 或 小托福 800+',
    status: 'pending',
    fallbackSignal: '未达标则五年级英语压力大，需调整目标',
  },
  {
    time: '五年级上 12 月',
    title: '数学硬通货',
    result: 'AMC8 20+（全球前 5%）',
    status: 'pending',
    fallbackSignal: '未达 20 分则三公概率显著降低',
  },
  {
    time: '五年级上 12 月',
    title: '英语硬通货',
    result: '小托福 850+ 或 PET 优秀',
    status: 'pending',
    fallbackSignal: '未达 850 则英语竞争力不足',
  },
  {
    time: '五年级下 4 月',
    title: '三公网申',
    result: '完成三所学校网上报名',
    status: 'pending',
  },
  {
    time: '五年级下 5 月底',
    title: '录取确认 / 熔断点',
    result: '拿到三公录取通知',
    status: 'pending',
    fallbackSignal: '未录取则立即切换私立摇号或公办对口',
  },
];

export const sgSubjectPaths: SubjectPath[] = [
  {
    id: 'math',
    name: '数学',
    icon: Calculator,
    color: 'from-primary to-rose-400',
    startTime: '二年级下',
    phases: [
      {
        time: '二年级下~三年级上',
        title: '思维启蒙',
        content: '袋鼠数学 + 新加坡数学，建立数感与逻辑推理',
        milestone: '袋鼠 L1-2 银奖以上',
      },
      {
        time: '三年级下~四年级上',
        title: '竞赛过渡',
        content: 'Pre-AMC8 + 澳洲 AMC，接触数论、组合、几何',
        milestone: '澳洲 AMC B 银奖',
      },
      {
        time: '四年级下',
        title: 'AMC8 试水',
        content: '系统刷 AMC8 真题，熟悉题型与时间管理',
        milestone: 'AMC8 首考 15+',
      },
      {
        time: '五年级上',
        title: 'AMC8 冲刺',
        content: '专项突破压轴题，模拟训练速度与准确率',
        milestone: 'AMC8 20+（全球前 5%）',
      },
    ],
  },
  {
    id: 'english',
    name: '英语',
    icon: Languages,
    color: 'from-secondary to-violet-400',
    startTime: '二年级上',
    phases: [
      {
        time: '二年级上~三年级上',
        title: '启蒙积累',
        content: 'Raz / Oxford Reading Tree 分级阅读 + 听力输入',
        milestone: '蓝思值 300+',
      },
      {
        time: '三年级下~四年级上',
        title: 'KET 体系',
        content: 'Power Up / Think Starter 系统学习语法与写作',
        milestone: 'KET 通过（120+）',
      },
      {
        time: '四年级下',
        title: 'PET / 小托福过渡',
        content: 'Complete PET 或 小托福官方指南，学术英语阅读听力',
        milestone: 'PET 通过 或 小托福 800+',
      },
      {
        time: '五年级上',
        title: '小托福冲刺',
        content: '小托福 TPO + 学术词汇 + 听力阅读专项',
        milestone: '小托福 850+',
      },
    ],
  },
  {
    id: 'chinese',
    name: '语文',
    icon: BookOpen,
    color: 'from-accent to-cyan-400',
    startTime: '二年级上',
    phases: [
      {
        time: '二年级上~三年级上',
        title: '古诗文启蒙',
        content: '每周 1-2 首古诗词，培养语感和积累',
        milestone: '背诵小学必背古诗词 75 首',
      },
      {
        time: '三年级下~四年级上',
        title: '阅读拓展',
        content: '名著青少版、科普历史类读物，每天 30 分钟',
        milestone: '年阅读量 50+ 本',
      },
      {
        time: '四年级下',
        title: '写作表达',
        content: '每周 1 篇练笔，训练条理、观点与书面表达',
        milestone: '能独立完成 300 字以上命题作文',
      },
      {
        time: '五年级上',
        title: '面试素养',
        content: '时事讨论、即兴演讲、辩论，训练口头表达',
        milestone: '面试模拟表现流畅自信',
      },
    ],
  },
  {
    id: 'honor',
    name: '荣誉 / 综合',
    icon: Award,
    color: 'from-warning to-amber-400',
    startTime: '二年级上',
    phases: [
      {
        time: '二年级~三年级',
        title: '校内基础',
        content: '保持校内成绩前列，担任班干部，积极参与校活动',
        milestone: '校级三好 / 优秀少先队员',
      },
      {
        time: '四年级',
        title: '竞赛与荣誉',
        content: '汉字小达人、古诗文大赛、科创活动等',
        milestone: '1-2 项区级及以上荣誉或奖项',
      },
      {
        time: '五年级上',
        title: '材料整理',
        content: '汇总证书、成长手册、获奖记录、综合素质材料',
        milestone: '完整三公申请简历',
      },
      {
        time: '五年级下',
        title: '申请与面谈',
        content: '网申投递、面谈模拟、突出数理英语优势',
        milestone: '拿到三公面单并通过面谈',
      },
    ],
  },
];

export const plans: RoutePlan[] = [
  {
    id: 'sg',
    name: '三公冲刺',
    type: 'primary',
    status: 'active',
    description:
      '上海市实验学校、上外附中、浦外三所公办特色学校，全市自主招生（零志愿），保持面谈录取，未录取不影响公办对口',
    probability: 35,
    requirements: ['AMC8 成绩 20 分+', '小托福 850+ / PET 优秀', '系统奥数学习', '面谈表现突出'],
    milestones: [
      { time: '三年级', task: '系统奥数启动 + 小托福/PET 备考' },
      { time: '四年级', task: 'AMC8 首次参赛 + 语文竞赛' },
      { time: '五年级上', task: 'AMC8 二次冲刺 + 综合定位' },
      { time: '五年级下 4 月', task: '三公报名 + 面谈评估' },
    ],
    targets: [
      {
        slug: 'shishi',
        name: '上实',
        tag: '十年一贯·理科',
        icon: School,
        color: 'from-primary to-primary-glow',
        shadow: 'hover:shadow-[0_0_30px_rgba(244,63,94,0.35)]',
      },
      {
        slug: 'shangwai',
        name: '上外附中',
        tag: '七年一贯·英语',
        icon: Globe,
        color: 'from-secondary to-secondary-glow',
        shadow: 'hover:shadow-[0_0_30px_rgba(139,92,246,0.35)]',
      },
      {
        slug: 'puwai',
        name: '浦外',
        tag: '七年一贯·外语',
        icon: Scale,
        color: 'from-accent to-accent-glow',
        shadow: 'hover:shadow-[0_0_30px_rgba(6,182,212,0.35)]',
      },
    ],
  },
  {
    id: 'yaohao',
    name: '私立摇号',
    type: 'backup',
    status: 'standby',
    description:
      '三公未录取时启动，嘉定区本区民办初中摇号（华曜嘉定、华盛怀少、桃李园），本区招生为主，跨区摇号概率极低，需提前准备走读/住宿志愿策略',
    probability: 40,
    requirements: ['嘉定区户籍/居住证', '志愿填报策略', '走读/住宿选择', '备选公办方案'],
    milestones: [
      { time: '五年级上', task: '调研本区民办初中，确定摇号志愿' },
      { time: '五年级下 4 月', task: '民办初中网上报名' },
      { time: '五年级下 5 月', task: '电脑随机录取，查询结果' },
      { time: '六年级', task: '入学准备 + 分班考' },
    ],
    targets: [
      {
        slug: 'huayao-jiading',
        name: '华曜嘉定',
        tag: '原华二·四校强校',
        icon: GraduationCap,
        color: 'from-secondary to-purple-400',
        shadow: 'hover:shadow-[0_0_30px_rgba(139,92,246,0.35)]',
      },
      {
        slug: 'huaishao',
        name: '华盛怀少',
        tag: '南翔一贯制·稳进',
        icon: Layers,
        color: 'from-indigo-500 to-purple-500',
        shadow: 'hover:shadow-[0_0_30px_rgba(99,102,241,0.35)]',
      },
      {
        slug: 'taoliyuan',
        name: '桃李园',
        tag: '嘉定第二·稳定强校',
        icon: School,
        color: 'from-violet-500 to-fuchsia-500',
        shadow: 'hover:shadow-[0_0_30px_rgba(168,85,247,0.35)]',
      },
    ],
  },
  {
    id: 'gongban',
    name: '公办对口/直升',
    type: 'backup',
    status: 'standby',
    description:
      '保底路线，对口南翔中学（嘉定区南翔镇公办初中，2024/2025 年六年级计划 7 个班），同时保留一贯制直升或优质公办特色班作为备选',
    probability: 92,
    requirements: ['南翔镇对口户籍/房产', '人户一致优先', '一贯制直升资格', '户籍/房产材料齐全'],
    milestones: [
      { time: '五年级', task: '确认南翔中学对口资格或一贯制直升资格' },
      { time: '五年级下 4月', task: '完成义务教育入学信息登记' },
      { time: '五年级下 5-6月', task: '南翔中学材料验证与录取确认' },
      { time: '六年级暑假', task: '小升初衔接与特色班准备' },
    ],
    targets: [
      {
        slug: 'nanxiang-zhongxue',
        name: '南翔中学',
        tag: '对口公办',
        icon: Home,
        color: 'from-accent to-cyan-400',
        shadow: 'hover:shadow-[0_0_30px_rgba(6,182,212,0.35)]',
      },
      {
        slug: 'yiguanzhi',
        name: '一贯制直升',
        tag: '稳定升学',
        icon: Layers,
        color: 'from-teal-500 to-emerald-500',
        shadow: 'hover:shadow-[0_0_30px_rgba(20,184,166,0.35)]',
      },
      {
        slug: 'gongbanzhong',
        name: '优质公办',
        tag: '特色班',
        icon: School,
        color: 'from-sky-500 to-blue-500',
        shadow: 'hover:shadow-[0_0_30px_rgba(14,165,233,0.35)]',
      },
    ],
  },
];

export const middleSchoolPlans: RoutePlan[] = [
  {
    id: 'sizhong',
    name: '四校八大自招冲刺',
    type: 'primary',
    status: 'active',
    description:
      '以上海中学、华师大二附中、复旦附中、交大附中四校及八大金刚为目标，通过自主招生、名额分配到区/到校、统一招生多批次冲击全市顶尖高中',
    probability: 18,
    requirements: ['校内成绩稳定前 3%', '数学/英语拔尖', '理科竞赛或科创特长', '自招/综评面试能力'],
    milestones: [
      { time: '六年级-七年级', task: '打牢初中基础，启动竞赛与科创' },
      { time: '八年级', task: '锁定自招门票，参加学科竞赛' },
      { time: '初三上', task: '校园开放日与自主招生报名' },
      { time: '初三下', task: '名额分配综评 + 中考冲刺' },
    ],
    targets: [
      {
        slug: 'shangzhong',
        name: '上海中学',
        tag: '四校之首',
        icon: GraduationCap,
        color: 'from-primary to-primary-glow',
        shadow: 'hover:shadow-[0_0_30px_rgba(244,63,94,0.35)]',
      },
      {
        slug: 'huaer',
        name: '华师大二附中',
        tag: '理科竞赛强校',
        icon: School,
        color: 'from-secondary to-secondary-glow',
        shadow: 'hover:shadow-[0_0_30px_rgba(139,92,246,0.35)]',
      },
      {
        slug: 'fufu',
        name: '复旦附中',
        tag: '人文理科均衡',
        icon: Layers,
        color: 'from-accent to-accent-glow',
        shadow: 'hover:shadow-[0_0_30px_rgba(6,182,212,0.35)]',
      },
    ],
  },
  {
    id: 'shizhong',
    name: '嘉定区市重点冲刺',
    type: 'backup',
    status: 'standby',
    description:
      '以交大附中嘉定分校、嘉定一中、上师大附属嘉定高中等市实验性示范性高中为目标，通过名额分配和平行志愿稳中求进',
    probability: 55,
    requirements: ['校内成绩前 15-20%', '数学英语优势明显', '综合素质评价优秀', '志愿填报策略'],
    milestones: [
      { time: '六年级-七年级', task: '建立初中知识体系，保持优势学科' },
      { time: '八年级', task: '理科分层突破，英语/语文持续领先' },
      { time: '初三上', task: '一模定位与名额分配志愿设计' },
      { time: '初三下', task: '二模冲刺 + 中考稳定发挥' },
    ],
    targets: [
      {
        slug: 'jiaofu-jiading',
        name: '交大附中嘉定分校',
        tag: '四校分校·市重点',
        icon: GraduationCap,
        color: 'from-secondary to-purple-400',
        shadow: 'hover:shadow-[0_0_30px_rgba(139,92,246,0.35)]',
      },
      {
        slug: 'jiading-yizhong',
        name: '嘉定一中',
        tag: '区属市重点',
        icon: School,
        color: 'from-violet-500 to-fuchsia-500',
        shadow: 'hover:shadow-[0_0_30px_rgba(168,85,247,0.35)]',
      },
      {
        slug: 'shida-jiading',
        name: '上师大附属嘉定高中',
        tag: '新增市重点',
        icon: Layers,
        color: 'from-indigo-500 to-purple-500',
        shadow: 'hover:shadow-[0_0_30px_rgba(99,102,241,0.35)]',
      },
    ],
  },
  {
    id: 'quzhong',
    name: '区重点/特色高中',
    type: 'backup',
    status: 'standby',
    description:
      '以嘉一实验高级中学、嘉定二中、安亭高级中学等区重点或市特色高中为保底，确保本科升学路径稳定',
    probability: 85,
    requirements: ['校内成绩稳定中游以上', '至少 1-2 门学科有优势', '中考志愿填报合理', '特色项目匹配'],
    milestones: [
      { time: '六年级-七年级', task: '补齐基础，培养优势学科' },
      { time: '八年级', task: '巩固优势，关注特色招生通道' },
      { time: '初三上', task: '一模定位，锁定目标分数区间' },
      { time: '初三下', task: '中考稳定发挥，合理填报' },
    ],
    targets: [
      {
        slug: 'jiading-shiyan',
        name: '嘉一实验高级中学',
        tag: '区实验性示范',
        icon: GraduationCap,
        color: 'from-teal-500 to-emerald-500',
        shadow: 'hover:shadow-[0_0_30px_rgba(20,184,166,0.35)]',
      },
      {
        slug: 'jiading-erzhong',
        name: '嘉定二中',
        tag: '市特色高中',
        icon: School,
        color: 'from-sky-500 to-blue-500',
        shadow: 'hover:shadow-[0_0_30px_rgba(14,165,233,0.35)]',
      },
      {
        slug: 'anting-gaozhong',
        name: '安亭高级中学',
        tag: '区重点',
        icon: Home,
        color: 'from-rose-500 to-pink-500',
        shadow: 'hover:shadow-[0_0_30px_rgba(244,63,94,0.35)]',
      },
    ],
  },
];

export const typeConfig = {
  primary: { label: '主路线', color: 'text-primary', bg: 'bg-primary/10', border: 'border-primary/30' },
  backup: { label: '备选路线', color: 'text-secondary', bg: 'bg-secondary/10', border: 'border-secondary/30' },
};

export const statusConfig = {
  active: { label: '执行中', icon: Target, color: 'text-success' },
  standby: { label: '待命', icon: Clock, color: 'text-slate-400' },
  completed: { label: '已完成', icon: CheckCircle2, color: 'text-success' },
};
