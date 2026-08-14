'use client';
import { Icon } from '@/components/ui/icon';

import { motion, useReducedMotion } from 'framer-motion';
import Link from 'next/link';

interface TimelineStep {
  step: string;
  time: string;
  desc: string;
}

interface ChecklistItem {
  grade: string;
  sub: string;
  tasks: string[];
}

interface SchoolData {
  id: string;
  name: string;
  shortName: string;
  title: string;
  oneLiner: string;
  tags: string[];
  location: string;
  nature: string;
  ranking: string;
  fees: string;
  accent: string;
  glow: string;
  gradient: string;
  timeline: TimelineStep[];
  preferences: string[];
  checklist: ChecklistItem[];
  certificates: string[];
  interviewFormat: string[];
}

export const schoolsData: Record<string, SchoolData> = {
  shishi: {
    id: 'shishi',
    name: '上海市实验学校',
    shortName: '上实',
    title: '理科王者',
    oneLiner: '沪上“神仙学校”之一，十年一贯制、理科见长，以创新素养与综合潜能选拔拔尖生源。',
    tags: ['十年一贯制', '理科强校', '面谈录取', '全市招生'],
    location: '浦东新区',
    nature: '公办',
    ranking: '三公第一梯队',
    fees: '公办免学费',
    accent: 'var(--color-primary)',
    glow: 'color-mix(in srgb, var(--color-primary) 35%, transparent)',
    gradient: 'from-primary to-primary-glow',
    timeline: [
      {
        step: '报名',
        time: '五年级下 4月',
        desc: '通过学校官网或指定平台提交报名信息，上传成长档案与获奖证书。',
      },
      {
        step: '网筛',
        time: '5月初',
        desc: '学校根据综合素质、竞赛证书、成长记录进行第一轮筛选。',
      },
      {
        step: '面谈',
        time: '5月中下旬',
        desc: '机考 + 小组活动 + 师生面谈，重点考察逻辑思维与临场反应。',
      },
      {
        step: '录取',
        time: '5月底',
        desc: '公布录取名单，确认入学意向并办理相关手续。',
      },
    ],
    preferences: ['数理逻辑思维', '创新探究能力', '英语基础扎实', '综合素质突出', '表达沟通清晰'],
    checklist: [
      {
        grade: '一升二 / 二年级',
        sub: '习惯与兴趣奠基',
        tasks: [
          '培养阅读与书写习惯',
          '完成百以内计算并提升速度',
          '接触趣味数学思维题',
          '英语启蒙，积累听力词汇',
        ],
      },
      {
        grade: '三年级',
        sub: '奥数与英语系统启动',
        tasks: [
          '系统学习奥数（导引/白皮书）',
          'PET 备考并冲刺优秀',
          '参加 1 项数学思维竞赛',
          '保持校内成绩前列',
        ],
      },
      {
        grade: '四年级',
        sub: '竞赛成果与综合素养',
        tasks: [
          'AMC8 备考并争取前 1%',
          '语文阅读与写作能力提升',
          '获得区级及以上竞赛奖项',
          '整理成长档案与证书',
        ],
      },
      {
        grade: '五年级',
        sub: '报名冲刺与面谈训练',
        tasks: ['三公报名材料准备', '高频面谈题型训练', '模拟机考与时间管理', '调整心态，稳定发挥'],
      },
    ],
    certificates: [
      'AMC8 全球前 1% / 5%',
      '数学大王 / 思维 100 一等奖',
      'PET 优秀 / 卓越',
      '冰心作文 / 中文自修市级奖项',
      '校内三好学生 / 全优记录',
    ],
    interviewFormat: [
      '机考：逻辑思维 + 图形推理 + 短时记忆',
      '小组活动：合作完成任务，观察领导力与协作力',
      '师生面谈：自我介绍 + 随机问答 + 阅读表达',
    ],
  },
  shangwai: {
    id: 'shangwai',
    name: '上海外国语大学附属外国语学校',
    shortName: '上外',
    title: '英语王牌',
    oneLiner:
      '沪上三公之一，七年一贯制外语特色学校，保送优势突出，全市招生、可寄宿，以极强的英语能力、文理均衡的综合素质选拔学生。',
    tags: ['外语特色', '七年一贯制', '保送优势', '全市招生', '可寄宿'],
    location: '虹口区',
    nature: '公办',
    ranking: '三公第一梯队',
    fees: '公办免学费',
    accent: 'var(--color-secondary)',
    glow: 'color-mix(in srgb, var(--color-secondary) 35%, transparent)',
    gradient: 'from-secondary to-secondary-glow',
    timeline: [
      {
        step: '报名',
        time: '五年级下 4月',
        desc: '通过学校官网或指定平台报名，提交成长档案、英语证书与综合素质材料。',
      },
      {
        step: '网筛',
        time: '5月初',
        desc: '审核 PET/FCE、小托福等英语等级，以及竞赛奖项、校内荣誉、语文素养与数学基础。',
      },
      {
        step: '面谈',
        time: '5月中下旬',
        desc: '机考 + 英语面谈 + 综合问答，重点考察英语听说、朗读、即兴表达与临场反应。',
      },
      {
        step: '录取',
        time: '5月底',
        desc: '公布录取名单，确认入学意向并完成相关手续。',
      },
    ],
    preferences: [
      '英语能力极强',
      'PET 优秀 / FCE 通过',
      '小托福 850+',
      '语文素养扎实',
      '数学基础良好',
      '面谈表达流利',
    ],
    checklist: [
      {
        grade: '一升二 / 二年级',
        sub: '语言启蒙与语感培养',
        tasks: [
          '大量听力输入与自然拼读',
          '绘本阅读与简单口头表达',
          '培养专注听讲与作业习惯',
          '数学思维启蒙，保持学习兴趣',
        ],
      },
      {
        grade: '三年级',
        sub: '英语系统提升与文理均衡',
        tasks: [
          '系统备考 PET 并冲刺优秀',
          '开始英语演讲、配音等输出训练',
          '古诗文大会与语文素养积累',
          '保持数学与语文均衡发展',
        ],
      },
      {
        grade: '四年级',
        sub: '英语深度与竞赛成果',
        tasks: [
          '冲刺 FCE 或更高英语等级',
          '小托福刷分 850+',
          '参加英语演讲/辩论类比赛',
          'AMC8 备考，争取奖项',
        ],
      },
      {
        grade: '五年级',
        sub: '报名冲刺与英语面谈',
        tasks: [
          '三公报名材料与证书整理',
          '模拟英语面谈、朗读与即兴问答',
          '强化听力反应与口语流利度',
          '调整心态，稳定发挥',
        ],
      },
    ],
    certificates: [
      'KET / PET / FCE 优秀或卓越',
      '小托福 850+',
      '古诗文大会市级奖项',
      'AMC8 全球前 5% / 1%',
      '希望之星 / 21世纪杯英语演讲奖项',
      '校内三好学生 / 全优记录',
    ],
    interviewFormat: [
      '机考：逻辑思维 + 综合素养 + 短时记忆',
      '英语面谈：朗读、听力、即兴问答与话题表达',
      '综合问答：兴趣特长、学习规划、情境反应',
    ],
  },
  puwai: {
    id: 'puwai',
    name: '上海外国语大学附属浦东外国语学校',
    shortName: '浦外',
    title: '综合均衡',
    oneLiner:
      '沪上三公之一，七年一贯制寄宿制外语特色学校，面向全市招生，注重英语能力、综合素质与学习能力，适合独立性强的学生。',
    tags: ['外语特色', '七年一贯制', '寄宿制', '全市招生', '综合发展'],
    location: '浦东新区',
    nature: '公办',
    ranking: '三公第一梯队',
    fees: '公办免学费',
    accent: 'var(--accent)',
    glow: 'color-mix(in srgb, var(--accent) 35%, transparent)',
    gradient: 'from-accent to-accent-glow',
    timeline: [
      {
        step: '报名',
        time: '五年级下 4月',
        desc: '在线提交报名信息、成长档案、获奖证书与寄宿意愿说明。',
      },
      {
        step: '网筛',
        time: '5月初',
        desc: '综合评估校内成绩、英语证书、理科基础、综合素养与品行记录。',
      },
      {
        step: '面谈',
        time: '5月中下旬',
        desc: '机考 + 面谈，重视英语表达、综合问答与寄宿适应能力的观察。',
      },
      {
        step: '录取',
        time: '5月底',
        desc: '发布录取结果，确认入学意向并完成寄宿生活准备。',
      },
    ],
    preferences: [
      '英语证书过硬',
      '校内成绩优秀',
      '理科基础扎实',
      '综合素养突出',
      '寄宿适应力强',
      '学习自主自律',
    ],
    checklist: [
      {
        grade: '一升二 / 二年级',
        sub: '习惯养成与生活自理',
        tasks: [
          '英语启蒙与阅读输入',
          '计算能力与数学兴趣',
          '培养生活自理与表达能力',
          '坚持体育锻炼，适应集体生活',
        ],
      },
      {
        grade: '三年级',
        sub: '学科基础与竞赛起步',
        tasks: [
          '系统奥数启蒙，夯实理科基础',
          'PET 备考或同级别英语考级',
          '参加语文/数学/英语类竞赛',
          '建立错题本与学习规划',
        ],
      },
      {
        grade: '四年级',
        sub: '综合能力与竞赛成果',
        tasks: [
          'AMC8 / 思维100 获奖',
          '提升英语听说读写综合能力',
          '培养团队合作与沟通能力',
          '整理个人成长档案与证书',
        ],
      },
      {
        grade: '五年级',
        sub: '冲刺与寄宿适应',
        tasks: [
          '准备三公报名材料',
          '机考与面谈综合模拟',
          '培养独立生活与时间管理能力',
          '稳定心态，查漏补缺',
        ],
      },
    ],
    certificates: [
      'PET / FCE 优秀或卓越',
      '小托福 850+',
      '古诗文大会市级奖项',
      'AMC8 / 思维100 奖项',
      '校内三好学生与综合荣誉',
      '艺术/体育/科技类特长证书',
    ],
    interviewFormat: [
      '机考：语数英综合 + 逻辑推理',
      '面谈：英语表达 + 综合问答 + 学习规划',
      '重视临场表达、思维反应与寄宿适应',
    ],
  },
  'huayao-jiading': {
    id: 'huayao-jiading',
    name: '上海民办华曜嘉定初级中学',
    shortName: '华曜嘉定',
    title: '嘉定民办头部',
    oneLiner:
      '原华二嘉定初级中学，嘉定民办第一梯队，理科竞赛与中考成绩突出，是嘉定区冲击四校八大的核心民办校。',
    tags: ['民办', '理科强校', '可寄宿', '中考头部'],
    location: '嘉定区',
    nature: '民办',
    ranking: '嘉定民办第一梯队',
    fees: '约 2.78万/学期（2024年参考）',
    accent: 'var(--color-secondary)',
    glow: 'color-mix(in srgb, var(--color-secondary) 35%, transparent)',
    gradient: 'from-secondary to-purple-400',
    timeline: [
      {
        step: '关注招生简章',
        time: '五年级下 3-4月',
        desc: '留意学校官网和区教育局发布的招生简章，确认走读/住宿计划数。',
      },
      {
        step: '网上报名',
        time: '五年级下 4月',
        desc: '登录上海市义务教育入学报名系统填报志愿，可选择走读或住宿。',
      },
      {
        step: '电脑摇号',
        time: '五年级下 5月',
        desc: '报名人数超过计划数则进行电脑随机录取，关注摇号结果。',
      },
      { step: '录取确认', time: '5月底', desc: '中签后按学校要求完成缴费注册，准备分班考与入学。' },
    ],
    preferences: ['数理思维强', '校内成绩优秀', '竞赛经历丰富', '学习习惯良好', '抗压能力强'],
    checklist: [
      {
        grade: '五年级上',
        sub: '信息调研与定位',
        tasks: [
          '关注华曜嘉定招生简章',
          '评估走读/住宿与通勤',
          '准备户籍/居住证材料',
          '参加学校开放日',
        ],
      },
      {
        grade: '五年级下',
        sub: '报名与摇号',
        tasks: [
          '完成民办初中网上报名',
          '合理填报一至两个志愿',
          '查询摇号结果并确认录取',
          '准备分班考',
        ],
      },
      {
        grade: '六年级暑假',
        sub: '入学衔接',
        tasks: ['预习初一语数英', '参加分班考/摸底测试', '适应民办初中节奏', '建立初中学习目标'],
      },
      {
        grade: '初中三年',
        sub: '持续冲刺',
        tasks: ['保持校内排名前列', '积极参加理科竞赛', '争取四校八大自招机会', '综合素质全面发展'],
      },
    ],
    certificates: [
      'AMC8 奖项',
      '数学大王 / 思维100 奖项',
      '小托福 / PET 证书',
      '校内三好学生',
      '科技/艺术特长证书',
    ],
    interviewFormat: ['摇号录取，无面谈', '部分年份或有分班摸底测试', '入学后注重理科分层教学'],
  },
  huaishao: {
    id: 'huaishao',
    name: '上海市民办华盛怀少学校',
    shortName: '华盛怀少',
    title: '南翔一贯制',
    oneLiner:
      '位于南翔古镇的九年一贯制民办学校，WLSA 资源加持，创新课程丰富，2024 年未超额可直接录取，是南翔家庭稳妥选择。',
    tags: ['民办', '九年一贯制', 'WLSA', '可直升'],
    location: '嘉定区南翔镇',
    nature: '民办',
    ranking: '嘉定区九年一贯制优质民办',
    fees: '约 3.2万/学期，住宿费3950元/学期（2024年参考）',
    accent: 'var(--color-secondary-glow)',
    glow: 'color-mix(in srgb, var(--color-secondary-glow) 35%, transparent)',
    gradient: 'from-indigo-500 to-purple-500',
    timeline: [
      {
        step: '直升确认',
        time: '五年级',
        desc: '九年一贯制学校通常可校内直升，确认直升资格与流程。',
      },
      {
        step: '报名登记',
        time: '五年级下 4月',
        desc: '如选择直升，按学校要求完成校内直升确认或网上报名。',
      },
      { step: '录取注册', time: '五年级下 5-6月', desc: '直升学生一般直接录取，办理相关手续。' },
      { step: '入学准备', time: '六年级', desc: '参加学校入学教育，适应初中学习节奏。' },
    ],
    preferences: [
      '居住南翔附近',
      '倾向稳定升学',
      '英语/创新素养较好',
      '喜欢小班化教学',
      'WLSA 国际资源需求',
    ],
    checklist: [
      {
        grade: '小学段',
        sub: '校内打好基础',
        tasks: ['保持校内成绩稳定', '积极参加学校创新课程', '培养英语综合能力', '发展兴趣特长'],
      },
      {
        grade: '五年级',
        sub: '直升确认',
        tasks: ['确认校内直升政策', '与学校沟通直升意向', '准备报名材料', '了解初中部师资与课程'],
      },
      {
        grade: '六年级',
        sub: '小升初衔接',
        tasks: ['适应初中学习节奏', '参加分班或摸底测试', '制定初中三年规划', '利用 WLSA 资源'],
      },
      {
        grade: '初中段',
        sub: '稳步提升',
        tasks: ['保持年级前列', '参加英语/科创类活动', '中考目标市重点', '综合素质持续发展'],
      },
    ],
    certificates: [
      '小托福 / PET 证书',
      '英语演讲/辩论奖项',
      '科技创新类奖项',
      '校内综合荣誉',
      '艺术/体育特长证书',
    ],
    interviewFormat: ['直升为主，无面谈', '或有校内评估测试', '注重英语与创新素养'],
  },
  taoliyuan: {
    id: 'taoliyuan',
    name: '上海市民办桃李园实验学校',
    shortName: '桃李园',
    title: '嘉定第二强校',
    oneLiner: '嘉定区老牌民办初中，市重点率稳定，本区招生为主，是嘉定家庭摇号的重要目标校之一。',
    tags: ['民办', '本区招生', '市重点率高', '老牌强校'],
    location: '嘉定区',
    nature: '民办',
    ranking: '嘉定民办第二梯队',
    fees: '约 1.925万/学期（2024年参考）',
    accent: 'var(--color-secondary)',
    glow: 'color-mix(in srgb, var(--color-secondary) 35%, transparent)',
    gradient: 'from-violet-500 to-fuchsia-500',
    timeline: [
      {
        step: '关注简章',
        time: '五年级下 3-4月',
        desc: '关注桃李园招生简章，确认本区招生计划与走读安排。',
      },
      { step: '网上报名', time: '五年级下 4月', desc: '仅限嘉定区户籍/居住证学生填报，选择志愿。' },
      { step: '电脑摇号', time: '五年级下 5月', desc: '超额则电脑随机录取，查询摇号结果。' },
      { step: '录取入学', time: '5月底-6月', desc: '中签后完成缴费注册，准备分班考与入学。' },
    ],
    preferences: [
      '嘉定区户籍/居住证',
      '校内成绩优良',
      '综合素质全面',
      '学习习惯稳定',
      '目标市重点高中',
    ],
    checklist: [
      {
        grade: '五年级上',
        sub: '目标确认',
        tasks: ['了解桃李园招生范围', '确认本区入学资格', '参加学校开放日', '准备报名材料'],
      },
      {
        grade: '五年级下',
        sub: '报名摇号',
        tasks: ['完成民办初中网上报名', '关注摇号时间', '中签后及时确认', '准备分班考'],
      },
      {
        grade: '六年级暑假',
        sub: '入学衔接',
        tasks: ['预习初一课程', '参加分班考试', '适应民办节奏', '建立学习目标'],
      },
      {
        grade: '初中三年',
        sub: '中考冲刺',
        tasks: ['保持年级排名', '积极参加学科竞赛', '目标市重点高中', '全面发展综合素质'],
      },
    ],
    certificates: [
      '校内三好学生',
      '学科竞赛奖项',
      '英语等级证书',
      '语文/数学竞赛奖项',
      '综合素质荣誉',
    ],
    interviewFormat: ['摇号录取，无面谈', '或有分班摸底测试', '注重学科基础与学习习惯'],
  },
  duikou: {
    id: 'duikou',
    name: '对口公办初中',
    shortName: '对口公办',
    title: '学区保障',
    oneLiner:
      '按照户籍或居住证对口学区免试入学，是绝大多数家庭的保底路径，录取确定性高，适合平稳过渡。',
    tags: ['公办', '免试入学', '对口学区', '保底路径'],
    location: '按学区划分',
    nature: '公办',
    ranking: '按对口学区',
    fees: '公办免学费',
    accent: 'var(--accent)',
    glow: 'color-mix(in srgb, var(--accent) 35%, transparent)',
    gradient: 'from-accent to-cyan-400',
    timeline: [
      {
        step: '确认对口',
        time: '五年级',
        desc: '根据户籍/房产确认对口公办初中，了解学校办学特色。',
      },
      { step: '信息登记', time: '五年级下 4月', desc: '完成义务教育入学信息登记，核对对口学校。' },
      {
        step: '验证材料',
        time: '五年级下 5月',
        desc: '按学校或教育部门要求提交户籍、房产等验证材料。',
      },
      { step: '录取入学', time: '6-8月', desc: '领取录取通知书，准备小升初衔接。' },
    ],
    preferences: ['户籍/房产在对口范围', '追求稳定入学', '重视通勤便利', '公办教育为主'],
    checklist: [
      {
        grade: '五年级',
        sub: '确认对口',
        tasks: ['查询当年对口范围', '确认户籍/房产符合条件', '了解对口学校特色班', '准备入学材料'],
      },
      {
        grade: '五年级下',
        sub: '办理入学',
        tasks: ['完成入学信息登记', '提交验证材料', '参加学校开放日', '确认录取通知'],
      },
      {
        grade: '六年级暑假',
        sub: '小升初衔接',
        tasks: ['巩固小学知识', '预习初一课程', '培养自主学习习惯', '了解初中老师要求'],
      },
      {
        grade: '初中三年',
        sub: '稳步提升',
        tasks: ['保持校内成绩', '关注特色班选拔', '积极备战中考', '综合素质发展'],
      },
    ],
    certificates: ['校内三好学生', '区级以上学科竞赛', '艺术/体育特长证书', '综合素质评价优秀'],
    interviewFormat: ['免试入学，无面谈', '部分学校有特色班选拔', '按政策顺位录取'],
  },
  'nanxiang-zhongxue': {
    id: 'nanxiang-zhongxue',
    name: '上海市嘉定区南翔中学',
    shortName: '南翔中学',
    title: '南翔对口公办',
    oneLiner:
      '嘉定区南翔镇公办初级中学，对口南翔小学入学，2024/2025 年六年级计划招收 7 个班，是南翔地区家庭最稳妥的保底选择。',
    tags: ['公办', '对口入学', '南翔镇', '保底稳妥'],
    location: '嘉定区南翔镇',
    nature: '公办',
    ranking: '南翔镇对口公办',
    fees: '公办免学费',
    accent: 'var(--accent)',
    glow: 'color-mix(in srgb, var(--accent) 35%, transparent)',
    gradient: 'from-accent to-cyan-400',
    timeline: [
      {
        step: '确认对口',
        time: '五年级',
        desc: '确认户籍/房产在南翔中学对口范围（南翔小学为主），了解学校办学特色。',
      },
      {
        step: '信息登记',
        time: '五年级下 4月',
        desc: '完成义务教育入学信息登记，核对南翔中学为对口学校。',
      },
      {
        step: '验证材料',
        time: '五年级下 5月',
        desc: '按学校或教育部门要求提交户籍、房产等验证材料。',
      },
      { step: '录取入学', time: '6-8月', desc: '领取南翔中学录取通知书，准备小升初衔接。' },
    ],
    preferences: ['南翔小学对口', '人户一致优先', '追求稳定入学', '重视通勤便利', '公办教育为主'],
    checklist: [
      {
        grade: '五年级',
        sub: '确认对口',
        tasks: [
          '查询当年南翔中学对口范围',
          '确认户籍/房产符合条件',
          '了解南翔中学特色班',
          '准备入学材料',
        ],
      },
      {
        grade: '五年级下',
        sub: '办理入学',
        tasks: ['完成入学信息登记', '提交验证材料', '参加学校开放日', '确认录取通知'],
      },
      {
        grade: '六年级暑假',
        sub: '小升初衔接',
        tasks: ['巩固小学知识', '预习初一课程', '培养自主学习习惯', '了解初中老师要求'],
      },
      {
        grade: '初中三年',
        sub: '稳步提升',
        tasks: ['保持校内成绩', '关注特色班选拔', '积极备战中考', '综合素质发展'],
      },
    ],
    certificates: ['校内三好学生', '区级以上学科竞赛', '艺术/体育特长证书', '综合素质评价优秀'],
    interviewFormat: ['免试入学，无面谈', '部分年级有特色班选拔', '按政策顺位录取'],
  },
  yiguanzhi: {
    id: 'yiguanzhi',
    name: '一贯制学校直升',
    shortName: '一贯制直升',
    title: '稳定升学',
    oneLiner:
      '小学和初中一体化的一贯制学校，小升初可校内直升，减少升学不确定性，适合追求稳定连贯教育的家庭。',
    tags: ['公办/民办一贯制', '校内直升', '稳定连贯', '低竞争'],
    location: '按学校所在区域',
    nature: '公办或民办',
    ranking: '一贯制直升',
    fees: '公办免学费 / 民办按学校标准',
    accent: 'var(--accent)',
    glow: 'color-mix(in srgb, var(--accent) 35%, transparent)',
    gradient: 'from-teal-500 to-emerald-500',
    timeline: [
      { step: '直升确认', time: '五年级', desc: '了解本校一贯制直升政策，确认直升意向。' },
      { step: '报名确认', time: '五年级下 4-5月', desc: '按学校要求完成直升确认或网上报名。' },
      { step: '录取注册', time: '五年级下 5-6月', desc: '直升学生一般直接录取，办理相关手续。' },
      { step: '入学衔接', time: '六年级', desc: '继续在原校初中部学习，做好学段过渡。' },
    ],
    preferences: ['已就读一贯制学校', '追求稳定升学', '喜欢熟悉环境', '重视教育连贯性'],
    checklist: [
      {
        grade: '五年级',
        sub: '直升确认',
        tasks: ['了解本校直升政策', '与班主任沟通直升意向', '确认是否需要网上报名', '准备相关材料'],
      },
      {
        grade: '五年级下',
        sub: '办理手续',
        tasks: ['完成直升确认或报名', '关注录取结果', '办理注册手续', '了解初中部课程'],
      },
      {
        grade: '六年级',
        sub: '学段过渡',
        tasks: ['适应初中学习节奏', '制定初中目标', '积极参与初中活动', '建立学习规划'],
      },
      {
        grade: '初中三年',
        sub: '持续进步',
        tasks: ['保持成绩稳定', '备战中考', '发展兴趣特长', '综合素质评价'],
      },
    ],
    certificates: ['校内综合荣誉', '学科竞赛奖项', '艺术/体育特长证书', '社会实践/志愿服务证明'],
    interviewFormat: ['直升无面谈', '部分学校有校内评估', '按直升政策直接录取'],
  },
  gongbanzhong: {
    id: 'gongbanzhong',
    name: '优质公办初中',
    shortName: '优质公办',
    title: '特色班',
    oneLiner:
      '区域内口碑较好的公办初中，通常设有理科、外语或艺术等特色班，是公办路线中的优质选择。',
    tags: ['公办', '特色班', '区域优质', '中考稳健'],
    location: '按对口或统筹安排',
    nature: '公办',
    ranking: '区域优质公办',
    fees: '公办免学费',
    accent: 'var(--accent)',
    glow: 'color-mix(in srgb, var(--accent) 35%, transparent)',
    gradient: 'from-sky-500 to-blue-500',
    timeline: [
      { step: '了解学校', time: '五年级', desc: '关注本区优质公办初中及其特色班信息。' },
      { step: '入学登记', time: '五年级下 4月', desc: '完成义务教育入学信息登记。' },
      {
        step: '材料验证',
        time: '五年级下 5月',
        desc: '提交户籍/房产等材料，等待统筹安排或对口录取。',
      },
      { step: '特色班选拔', time: '六年级开学前后', desc: '部分学校组织特色班分班考或选拔。' },
    ],
    preferences: ['对口或统筹可进', '综合素质良好', '某学科有特长', '追求优质公办资源'],
    checklist: [
      {
        grade: '五年级',
        sub: '目标调研',
        tasks: ['了解本区优质公办及特色班', '确认入学方式', '准备学科特长展示', '关注学校开放日'],
      },
      {
        grade: '五年级下',
        sub: '办理入学',
        tasks: ['完成入学登记', '提交验证材料', '确认录取学校', '了解特色班选拔方式'],
      },
      {
        grade: '六年级暑假',
        sub: '备战特色班',
        tasks: ['预习初一课程', '准备分班/特色班测试', '保持学科优势', '调整心态'],
      },
      {
        grade: '初中三年',
        sub: '中考冲刺',
        tasks: ['争取进入特色班', '保持年级前列', '参加学科竞赛', '目标市重点高中'],
      },
    ],
    certificates: ['校内三好学生', '区级学科竞赛奖项', '特长生认定', '综合素质评价优秀'],
    interviewFormat: ['免试入学', '特色班可能有选拔测试', '注重学科特长与综合素质'],
  },
  shangzhong: {
    id: 'shangzhong',
    name: '上海中学',
    shortName: '上海中学',
    title: '四校之首',
    oneLiner:
      '上海最顶尖高中，四校之首，理科竞赛与高考成绩长期全国领先，自主招生、名额分配到区竞争极为激烈。',
    tags: ['四校', '市重点', '理科竞赛', '全市顶尖'],
    location: '徐汇区',
    nature: '公办',
    ranking: '四校之首 · 全市顶尖',
    fees: '公办，约 2000 元/学期',
    accent: 'var(--color-primary)',
    glow: 'color-mix(in srgb, var(--color-primary) 35%, transparent)',
    gradient: 'from-primary to-primary-glow',
    timeline: [
      {
        step: '校园开放日',
        time: '初三上 3-5月',
        desc: '参加上海中学校园开放日，了解自招与培养方向。',
      },
      { step: '自主招生', time: '初三下 5-6月', desc: '提交自招报名，参加笔试与面试选拔。' },
      { step: '名额分配', time: '初三下 5月', desc: '通过名额分配到区/到校填报志愿，竞争录取。' },
      {
        step: '统一招生',
        time: '初三下 6-7月',
        desc: '中考后按平行志愿投档，分数线通常全市最高。',
      },
    ],
    preferences: ['校内成绩顶尖', '理科竞赛特长', '综合素质突出', '自招/综评能力强'],
    checklist: [
      {
        grade: '六年级-七年级',
        sub: '初中基础与竞赛启蒙',
        tasks: ['保持校内全科前列', '系统学习初中奥数', '英语达到高考水平', '培养自主学习能力'],
      },
      {
        grade: '八年级',
        sub: '竞赛锁定门票',
        tasks: [
          '参加数学/物理/信息学竞赛',
          '争取省级及以上奖项',
          '完成研究性学习课题',
          '关注四校开放日',
        ],
      },
      {
        grade: '初三上',
        sub: '自招准备',
        tasks: [
          '整理竞赛证书与综合素质档案',
          '针对性训练自招笔试',
          '模拟面试与表达训练',
          '一模争取全区前列',
        ],
      },
      {
        grade: '初三下',
        sub: '中考冲刺',
        tasks: ['填报名额分配志愿', '稳定中考发挥', '参加自招测试', '调整心态，查漏补缺'],
      },
    ],
    certificates: [
      '数学/物理/信息学竞赛省一或国奖',
      '校内三好学生/全优记录',
      '科创/研究性学习成果',
      '英语/语文市级以上奖项',
    ],
    interviewFormat: [
      '自招笔试：数学 + 英语 + 综合能力',
      '面试：学科思维 + 兴趣特长 + 学习规划',
      '名额分配综评：综合素质档案 + 现场表现',
    ],
  },
  huaer: {
    id: 'huaer',
    name: '华东师范大学第二附属中学',
    shortName: '华二附中',
    title: '理科竞赛强校',
    oneLiner:
      '沪上四校之一，以理科竞赛、科技创新见长，清北复交升学率高，自主招生与名额分配到区名额有限。',
    tags: ['四校', '市重点', '理科竞赛', '科技创新'],
    location: '浦东新区',
    nature: '公办',
    ranking: '四校 · 理科竞赛强校',
    fees: '公办，约 2000 元/学期',
    accent: 'var(--color-secondary)',
    glow: 'color-mix(in srgb, var(--color-secondary) 35%, transparent)',
    gradient: 'from-secondary to-secondary-glow',
    timeline: [
      {
        step: '开放日/自招',
        time: '初三上 3-5月',
        desc: '关注华二校园开放日，准备自招材料与竞赛证书。',
      },
      { step: '自招选拔', time: '初三下 5-6月', desc: '参加自招笔试与面试，重点考察理科思维。' },
      { step: '名额分配', time: '初三下 5月', desc: '通过名额分配到区/到校争取录取机会。' },
      {
        step: '统一招生',
        time: '初三下 6-7月',
        desc: '中考后按平行志愿投档，分数线常年全市前列。',
      },
    ],
    preferences: ['理科思维极强', '竞赛经历丰富', '科创成果突出', '自主学习能力强'],
    checklist: [
      {
        grade: '六年级-七年级',
        sub: '理科兴趣与基础',
        tasks: ['数学英语保持领先', '接触物理/信息学竞赛', '培养实验探究能力', '参加科创活动'],
      },
      {
        grade: '八年级',
        sub: '竞赛成果',
        tasks: [
          '数学/物理/信息学竞赛拿奖',
          '完成科创项目或论文',
          '保持校内排名前 3%',
          '关注四校自招政策',
        ],
      },
      {
        grade: '初三上',
        sub: '自招冲刺',
        tasks: ['整理竞赛与科创证书', '训练理科综合笔试', '模拟面试与表达', '一模定位'],
      },
      {
        grade: '初三下',
        sub: '中考与录取',
        tasks: ['填报名额分配志愿', '参加自招测试', '中考稳定发挥', '确认录取'],
      },
    ],
    certificates: [
      '数学/物理/信息学竞赛奖项',
      '青少年科创大赛奖项',
      '校内三好/全优记录',
      '英语/语文市级奖项',
    ],
    interviewFormat: [
      '自招笔试：理科综合 + 数学 + 英语',
      '面试：学科思维 + 科创经历 + 团队协作',
      '综评：研究性学习/社会实践档案',
    ],
  },
  fufu: {
    id: 'fufu',
    name: '复旦大学附属中学',
    shortName: '复旦附中',
    title: '人文理科均衡',
    oneLiner:
      '沪上四校之一，人文底蕴深厚，文理均衡，升学去向以复旦、交大及海外名校为主，自主招生重视综合素质。',
    tags: ['四校', '市重点', '文理均衡', '人文见长'],
    location: '杨浦区',
    nature: '公办',
    ranking: '四校 · 人文理科均衡',
    fees: '公办，约 2000 元/学期',
    accent: 'var(--accent)',
    glow: 'color-mix(in srgb, var(--accent) 35%, transparent)',
    gradient: 'from-accent to-accent-glow',
    timeline: [
      { step: '开放日/自招', time: '初三上 3-5月', desc: '参加复旦附中校园开放日，准备自招材料。' },
      {
        step: '自招选拔',
        time: '初三下 5-6月',
        desc: '参加自招笔试与面试，关注人文素养与理科基础。',
      },
      { step: '名额分配', time: '初三下 5月', desc: '通过名额分配到区/到校填报志愿。' },
      { step: '统一招生', time: '初三下 6-7月', desc: '中考后按平行志愿投档，分数线常年高位。' },
    ],
    preferences: ['文理均衡发展', '人文素养突出', '英语/语文能力强', '综合素质优秀'],
    checklist: [
      {
        grade: '六年级-七年级',
        sub: '全科基础',
        tasks: ['保持语数英全科优秀', '大量阅读与写作训练', '英语达到高考水平', '培养思辨能力'],
      },
      {
        grade: '八年级',
        sub: '文理深化',
        tasks: [
          '数学/物理竞赛或培优',
          '语文阅读与作文提升',
          '参加人文/英语类竞赛',
          '社会实践与研究性学习',
        ],
      },
      {
        grade: '初三上',
        sub: '自招准备',
        tasks: ['整理综合素质档案', '训练文理综合笔试', '模拟面试与即兴表达', '一模争取前列'],
      },
      {
        grade: '初三下',
        sub: '中考冲刺',
        tasks: ['填报名额分配志愿', '参加自招与综评', '中考稳定发挥', '确认录取意向'],
      },
    ],
    certificates: [
      '语文/英语市级以上奖项',
      '数学/物理竞赛奖项',
      '研究性学习/社会实践成果',
      '校内三好/全优记录',
    ],
    interviewFormat: [
      '自招笔试：文理综合 + 英语 + 数学',
      '面试：人文素养 + 逻辑思维 + 表达能力',
      '综评：综合素质档案 + 现场问答',
    ],
  },
  'jiaofu-jiading': {
    id: 'jiaofu-jiading',
    name: '上海交通大学附属中学嘉定分校',
    shortName: '交附嘉定',
    title: '嘉定头部市重点',
    oneLiner:
      '四校分校、市实验性示范性高中，嘉定区录取分数线最高，理科与竞赛资源强，面向嘉定区招生为主。',
    tags: ['四校分校', '市重点', '可寄宿', '嘉定头部'],
    location: '嘉定区洪德路',
    nature: '公办',
    ranking: '嘉定区第一梯队 · 四校分校',
    fees: '公办，约 2000 元/学期',
    accent: 'var(--color-secondary)',
    glow: 'color-mix(in srgb, var(--color-secondary) 35%, transparent)',
    gradient: 'from-secondary to-purple-400',
    timeline: [
      {
        step: '开放日/自招',
        time: '初三上 3-5月',
        desc: '参加交附嘉定开放日，了解自招与名额分配计划。',
      },
      { step: '自主招生', time: '初三下 5-6月', desc: '提交自招报名，参加选拔测试。' },
      { step: '名额分配', time: '初三下 5月', desc: '嘉定区名额分配到区/到校志愿填报。' },
      { step: '统一招生', time: '初三下 6-7月', desc: '中考后按平行志愿投档，分数线居嘉定首位。' },
    ],
    preferences: ['嘉定区学生', '理科思维强', '竞赛或科创经历', '目标四校分校'],
    checklist: [
      {
        grade: '六年级-七年级',
        sub: '初中基础',
        tasks: ['夯实数理化基础', '英语保持超前', '培养自主学习能力', '关注竞赛启蒙'],
      },
      {
        grade: '八年级',
        sub: '理科突破',
        tasks: ['数学/物理竞赛参赛', '保持年级前 5%', '完成研究性学习', '了解交附嘉定招生'],
      },
      {
        grade: '初三上',
        sub: '自招与定位',
        tasks: ['整理证书与档案', '训练自招笔试', '一模定位嘉定前列', '参加开放日'],
      },
      {
        grade: '初三下',
        sub: '中考冲刺',
        tasks: ['填报名额分配志愿', '自招测试', '中考稳定发挥', '录取确认'],
      },
    ],
    certificates: ['数学/物理竞赛奖项', '信息学/科创奖项', '校内三好/全优记录', '综合素质评价优秀'],
    interviewFormat: [
      '自招笔试：数学 + 英语 + 理科综合',
      '面试：学科思维 + 竞赛经历 + 学习规划',
      '综评：综合素质档案 + 现场表现',
    ],
  },
  'jiading-yizhong': {
    id: 'jiading-yizhong',
    name: '上海市嘉定区第一中学',
    shortName: '嘉定一中',
    title: '嘉定区属市重点',
    oneLiner:
      '嘉定区老牌区属市重点，文化底蕴深厚，高考成绩稳健，是嘉定学子冲击市重点的核心目标。2024 年平行志愿投档线约 675 分。',
    tags: ['区属市重点', '嘉定老牌', '文化底蕴', '稳步提升'],
    location: '嘉定区',
    nature: '公办',
    ranking: '嘉定区第二梯队 · 区属市重点',
    fees: '公办，约 2000 元/学期',
    accent: 'var(--color-secondary)',
    glow: 'color-mix(in srgb, var(--color-secondary) 35%, transparent)',
    gradient: 'from-violet-500 to-fuchsia-500',
    timeline: [
      {
        step: '开放日',
        time: '初三上 3-5月',
        desc: '参加嘉定一中校园开放日，了解特色班与招生方式。',
      },
      { step: '名额分配', time: '初三下 5月', desc: '通过名额分配到区/到校填报志愿。' },
      {
        step: '统一招生',
        time: '初三下 6-7月',
        desc: '中考后按平行志愿投档，分数线约 670-680 分区间。',
      },
      { step: '录取入学', time: '7-8月', desc: '确认录取，准备高中入学与分班。' },
    ],
    preferences: ['嘉定区学生', '校内成绩优秀', '综合素质良好', '目标市重点'],
    checklist: [
      {
        grade: '六年级-七年级',
        sub: '打牢基础',
        tasks: ['保持校内成绩前列', '数学英语超前学习', '培养阅读习惯', '参加学校活动'],
      },
      {
        grade: '八年级',
        sub: '优势学科',
        tasks: ['理科分层突破', '语文/英语保持优势', '参加学科竞赛', '一模前全面复习'],
      },
      {
        grade: '初三上',
        sub: '定位与志愿',
        tasks: ['一模定位市重点区间', '了解名额分配政策', '整理综合素质档案', '参加开放日'],
      },
      {
        grade: '初三下',
        sub: '冲刺中考',
        tasks: ['合理填报名额分配与平行志愿', '二模查漏补缺', '中考稳定发挥', '确认录取'],
      },
    ],
    certificates: ['校内三好学生', '区级学科竞赛奖项', '英语/语文市级奖项', '综合素质评价优秀'],
    interviewFormat: ['平行志愿录取为主', '名额分配综评：综合素质档案', '部分特色项目可能有测试'],
  },
  'shida-jiading': {
    id: 'shida-jiading',
    name: '上海师范大学附属嘉定高级中学',
    shortName: '上师嘉分',
    title: '嘉定新增市重点',
    oneLiner:
      '嘉定区新增市实验性示范性高中，上师大资源加持，发展潜力大，是嘉定区近年重点打造的市重点新校。',
    tags: ['新增市重点', '上师大资源', '本区招生', '发展潜力'],
    location: '嘉定区',
    nature: '公办',
    ranking: '嘉定区市重点 · 新增校',
    fees: '公办，约 2000 元/学期',
    accent: 'var(--color-secondary-glow)',
    glow: 'color-mix(in srgb, var(--color-secondary-glow) 35%, transparent)',
    gradient: 'from-indigo-500 to-purple-500',
    timeline: [
      {
        step: '开放日',
        time: '初三上 3-5月',
        desc: '参加上师嘉分开放日，了解办学特色与招生计划。',
      },
      { step: '名额分配', time: '初三下 5月', desc: '通过名额分配到区/到校填报志愿。' },
      { step: '统一招生', time: '初三下 6-7月', desc: '中考后按平行志愿投档。' },
      { step: '录取入学', time: '7-8月', desc: '确认录取，准备入学。' },
    ],
    preferences: ['嘉定区学生', '校内成绩优良', '综合素质良好', '看好新校发展潜力'],
    checklist: [
      {
        grade: '六年级-七年级',
        sub: '基础习惯',
        tasks: ['保持校内成绩优良', '培养自主学习', '英语/数学稳步提升', '关注学校动态'],
      },
      {
        grade: '八年级',
        sub: '学科提升',
        tasks: ['理科分层学习', '语文/英语保持优势', '参加学科竞赛或活动', '一模准备'],
      },
      {
        grade: '初三上',
        sub: '目标锁定',
        tasks: ['一模定位', '了解上师嘉分招生', '整理综合素质档案', '参加开放日'],
      },
      {
        grade: '初三下',
        sub: '中考冲刺',
        tasks: ['填报名额分配志愿', '二模冲刺', '中考稳定发挥', '确认录取'],
      },
    ],
    certificates: ['校内三好学生', '区级学科竞赛奖项', '英语/语文奖项', '综合素质评价优秀'],
    interviewFormat: ['平行志愿录取为主', '名额分配综评：综合素质档案', '特色项目可能有面试或测试'],
  },
  'jiading-shiyan': {
    id: 'jiading-shiyan',
    name: '上海市嘉定区嘉一实验高级中学',
    shortName: '嘉一实验',
    title: '嘉定区实验性示范高中',
    oneLiner:
      '嘉定区实验性示范性高中，依托嘉定一中资源，定位中上，是市重点与区重点之间的优质选择。2024 年平行志愿投档线约 670 分。',
    tags: ['区实验性示范', '嘉定一中资源', '稳步发展', '本区招生'],
    location: '嘉定区',
    nature: '公办',
    ranking: '嘉定区第三梯队 · 区实验性示范',
    fees: '公办，约 2000 元/学期',
    accent: 'var(--accent)',
    glow: 'color-mix(in srgb, var(--accent) 35%, transparent)',
    gradient: 'from-teal-500 to-emerald-500',
    timeline: [
      { step: '开放日', time: '初三上 3-5月', desc: '参加嘉一实验开放日，了解特色培养方向。' },
      { step: '名额分配', time: '初三下 5月', desc: '通过名额分配到校填报志愿。' },
      {
        step: '统一招生',
        time: '初三下 6-7月',
        desc: '中考后按平行志愿投档，分数线约 660-670 分。',
      },
      { step: '录取入学', time: '7-8月', desc: '确认录取，准备高中学习。' },
    ],
    preferences: ['嘉定区学生', '校内成绩中上', '有优势学科', '目标本科以上'],
    checklist: [
      {
        grade: '六年级-七年级',
        sub: '打好基础',
        tasks: ['稳定校内成绩', '补齐薄弱学科', '培养优势学科', '养成良好习惯'],
      },
      {
        grade: '八年级',
        sub: '分水岭',
        tasks: ['理科不掉队', '语文/英语持续积累', '参加学科活动', '一模前系统复习'],
      },
      {
        grade: '初三上',
        sub: '目标定位',
        tasks: ['一模定位区重点区间', '了解嘉一实验招生', '整理综合素质档案', '参加开放日'],
      },
      {
        grade: '初三下',
        sub: '冲刺中考',
        tasks: ['合理填报志愿', '二模查漏补缺', '中考稳定发挥', '确认录取'],
      },
    ],
    certificates: ['校内三好学生', '区级学科竞赛奖项', '特长/活动证书', '综合素质评价良好'],
    interviewFormat: ['平行志愿录取为主', '名额分配综评：综合素质档案', '特色班可能有测试'],
  },
  'jiading-erzhong': {
    id: 'jiading-erzhong',
    name: '上海市嘉定区第二中学',
    shortName: '嘉定二中',
    title: '嘉定市特色高中',
    oneLiner:
      '嘉定区市特色普通高中，本科率稳定，海洋/工程特色鲜明，适合中段学生保底。2024 年平行志愿投档线约 657.5 分。',
    tags: ['市特色高中', '本科率高', '海洋工程特色', '本区招生'],
    location: '嘉定区',
    nature: '公办',
    ranking: '嘉定区市特色高中 · 本科率高',
    fees: '公办，约 2000 元/学期',
    accent: 'var(--accent)',
    glow: 'color-mix(in srgb, var(--accent) 35%, transparent)',
    gradient: 'from-sky-500 to-blue-500',
    timeline: [
      { step: '开放日', time: '初三上 3-5月', desc: '参加嘉定二中开放日，了解海洋/工程特色项目。' },
      { step: '名额分配', time: '初三下 5月', desc: '通过名额分配到校填报志愿。' },
      {
        step: '统一招生',
        time: '初三下 6-7月',
        desc: '中考后按平行志愿投档，分数线约 650-660 分。',
      },
      { step: '录取入学', time: '7-8月', desc: '确认录取，准备特色项目学习。' },
    ],
    preferences: ['嘉定区学生', '校内成绩中游以上', '对海洋/工程感兴趣', '目标本科'],
    checklist: [
      {
        grade: '六年级-七年级',
        sub: '基础巩固',
        tasks: ['补齐小学薄弱', '稳定校内成绩', '培养学习兴趣', '关注特色项目'],
      },
      {
        grade: '八年级',
        sub: '学科提升',
        tasks: ['理科不掉队', '语文/英语积累', '参加海洋/工程类活动', '一模准备'],
      },
      {
        grade: '初三上',
        sub: '目标锁定',
        tasks: ['一模定位', '了解特色招生', '整理综合素质档案', '参加开放日'],
      },
      {
        grade: '初三下',
        sub: '冲刺中考',
        tasks: ['合理填报志愿', '二模冲刺', '中考稳定发挥', '确认录取'],
      },
    ],
    certificates: ['校内三好学生', '区级学科/活动奖项', '特色项目相关证书', '综合素质评价良好'],
    interviewFormat: ['平行志愿录取为主', '名额分配综评：综合素质档案', '特色项目可能有面试或测试'],
  },
  'anting-gaozhong': {
    id: 'anting-gaozhong',
    name: '上海市嘉定区安亭高级中学',
    shortName: '安亭高中',
    title: '嘉定区区重点',
    oneLiner:
      '嘉定区安亭镇公办高中，区重点层次，面向嘉定区招生，是安亭及周边家庭的保底选择。2024 年平行志愿投档线约 636 分。',
    tags: ['区重点', '安亭镇', '本区招生', '保底稳妥'],
    location: '嘉定区安亭镇',
    nature: '公办',
    ranking: '嘉定区区重点',
    fees: '公办，约 2000 元/学期',
    accent: 'var(--color-primary)',
    glow: 'color-mix(in srgb, var(--color-primary) 35%, transparent)',
    gradient: 'from-rose-500 to-pink-500',
    timeline: [
      { step: '开放日', time: '初三上 3-5月', desc: '参加安亭高中开放日，了解办学特色。' },
      { step: '名额分配', time: '初三下 5月', desc: '通过名额分配到校填报志愿。' },
      {
        step: '统一招生',
        time: '初三下 6-7月',
        desc: '中考后按平行志愿投档，分数线约 630-640 分。',
      },
      { step: '录取入学', time: '7-8月', desc: '确认录取，准备高中学习。' },
    ],
    preferences: ['嘉定区学生', '校内成绩中游', '追求稳定入学', '目标本科'],
    checklist: [
      {
        grade: '六年级-七年级',
        sub: '基础巩固',
        tasks: ['稳定校内成绩', '补齐薄弱学科', '培养学习习惯', '关注学校动态'],
      },
      {
        grade: '八年级',
        sub: '学科提升',
        tasks: ['理科不掉队', '语文/英语积累', '参加学校活动', '一模准备'],
      },
      {
        grade: '初三上',
        sub: '目标锁定',
        tasks: ['一模定位', '了解安亭高中招生', '整理综合素质档案', '参加开放日'],
      },
      {
        grade: '初三下',
        sub: '冲刺中考',
        tasks: ['合理填报志愿', '二模冲刺', '中考稳定发挥', '确认录取'],
      },
    ],
    certificates: ['校内三好学生', '区级活动奖项', '综合素质评价良好', '特长证书'],
    interviewFormat: ['平行志愿录取为主', '名额分配综评：综合素质档案', '无额外面试'],
  },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

export default function SchoolDetail({ school }: { school: string }) {
  const shouldReduceMotion = useReducedMotion();
  const data = schoolsData[school];

  if (!data) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-6 text-center">
        <div className="mb-2 flex items-center justify-center gap-3">
          <div className="bg-secondary/10 border-secondary/20 flex size-10 items-center justify-center rounded-xl border">
            <Icon name="School" size="md" className="text-secondary" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold sm:text-3xl">未找到学校</h1>
          </div>
        </div>
        <p className="text-text-tertiary">当前链接对应的目标学校不存在。</p>
        <Link
          href="/dashboard/plan"
          className="inline-flex items-center gap-2 rounded-lg bg-surface-hover px-5 py-2.5 text-text-primary transition-all hover:bg-surface-hover"
        >
          <Icon name="ArrowLeft" size="sm" />
          返回路线方案
        </Link>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8 pb-8"
    >
      {/* Back + Hero */}
      <motion.div variants={itemVariants} className="space-y-6">
        <Link
          href="/dashboard/plan"
          className="inline-flex items-center gap-2 text-sm text-text-tertiary transition-colors hover:text-text-primary"
        >
          <Icon name="ArrowLeft" size="sm" />
          返回路线方案
        </Link>

        <div className="relative overflow-hidden rounded-3xl border border-border-subtle bg-surface-elevated p-8">
          <div
            className="pointer-events-none absolute right-0 top-0 size-96 -translate-y-1/2 translate-x-1/3 rounded-full blur-3xl"
            style={{ backgroundColor: data.glow.replace('0.35', '0.12') }}
          />
          <div className="relative z-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <span
                  className={`rounded-full bg-gradient-to-r px-3 py-1 text-xs font-bold ${data.gradient} text-text-primary`}
                >
                  {data.title}
                </span>
                <span className="flex items-center gap-1.5 text-xs text-text-tertiary">
                  <Icon name="MapPin" size="xs" />
                  {data.location}
                </span>
                <span className="flex items-center gap-1.5 text-xs text-text-tertiary">
                  <Icon name="GraduationCap" size="xs" />
                  {data.nature}
                </span>
                <span className="flex items-center gap-1.5 text-xs text-text-tertiary">
                  <Icon name="Trophy" size="xs" />
                  {data.ranking}
                </span>
                <span className="flex items-center gap-1.5 text-xs text-text-tertiary">
                  <Icon name="Banknote" size="xs" />
                  {data.fees}
                </span>
              </div>
              <motion.div
                initial={shouldReduceMotion ? false : { opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-secondary/10 border-secondary/20 flex size-10 items-center justify-center rounded-xl border">
                    <Icon name="School" size="md" className="text-secondary" />
                  </div>
                  <div>
                    <h1 className="font-display text-2xl font-bold sm:text-3xl">{data.name}</h1>
                  </div>
                </div>
              </motion.div>
              <div className="mt-5 flex flex-wrap gap-2">
                {data.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-lg border border-border-subtle bg-surface-hover px-3 py-1 text-sm text-text-secondary"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Timeline */}
      <motion.div variants={itemVariants} className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-surface-hover">
            <Icon name="Calendar" size="md" className="text-primary" />
          </div>
          <h2 className="font-display text-xl font-bold">招生时间轴</h2>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {data.timeline.map((item, index) => (
            <motion.div
              key={item.step}
              variants={itemVariants}
              className="relative rounded-xl border border-border-subtle bg-surface-elevated p-5"
            >
              <div className="mb-3 flex items-center gap-3">
                <div
                  className="flex size-8 items-center justify-center rounded-full text-sm font-bold"
                  style={{
                    backgroundColor: `${data.accent}18`,
                    color: data.accent,
                    boxShadow: `0 0 12px ${data.glow}`,
                  }}
                >
                  {index + 1}
                </div>
                <div>
                  <p className="font-bold">{item.step}</p>
                  <p className="text-xs text-text-tertiary">{item.time}</p>
                </div>
              </div>
              <p className="text-sm leading-relaxed text-text-secondary">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Preferences + Interview */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <motion.div variants={itemVariants} className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-surface-hover">
              <Icon name="Target" size="md" className="text-secondary" />
            </div>
            <h2 className="font-display text-xl font-bold">录取偏好</h2>
          </div>
          <div className="rounded-xl border border-border-subtle bg-surface-elevated p-6">
            <p className="mb-4 text-sm text-text-tertiary">学校最看重的能力与素养</p>
            <div className="flex flex-wrap gap-2">
              {data.preferences.map((pref) => (
                <span
                  key={pref}
                  className="rounded-lg border border-border-subtle px-3 py-1.5 text-sm text-text-primary"
                  style={{
                    backgroundColor: `${data.accent}12`,
                  }}
                >
                  {pref}
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-surface-hover">
              <Icon name="MessageSquare" size="md" className="text-accent" />
            </div>
            <h2 className="font-display text-xl font-bold">面谈形式</h2>
          </div>
          <div className="space-y-4 rounded-xl border border-border-subtle bg-surface-elevated p-6">
            {data.interviewFormat.map((item) => (
              <div key={item} className="flex items-start gap-3">
                {item.includes('机考') ? (
                  <Icon name="Monitor" size="sm" className="mt-1 shrink-0 text-text-tertiary" />
                ) : item.includes('小组') ? (
                  <Icon name="Users" size="sm" className="mt-1 shrink-0 text-text-tertiary" />
                ) : (
                  <Icon name="MessageSquare" size="sm" className="mt-1 shrink-0 text-text-tertiary" />
                )}
                <p className="text-sm leading-relaxed text-text-secondary">{item}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Checklist */}
      <motion.div variants={itemVariants} className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-surface-hover">
            <Icon name="CheckCircle2" size="md" className="text-success" />
          </div>
          <h2 className="font-display text-xl font-bold">准备清单</h2>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {data.checklist.map((group) => (
            <motion.div
              key={group.grade}
              variants={itemVariants}
              className="rounded-xl border border-border-subtle bg-surface-elevated p-6"
            >
              <div className="mb-4 flex items-center gap-3">
                <Icon name="Clock" size="sm" style={{ color: data.accent }} />
                <div>
                  <h3 className="font-bold">{group.grade}</h3>
                  <p className="text-xs text-text-tertiary">{group.sub}</p>
                </div>
              </div>
              <ul className="space-y-3">
                {group.tasks.map((task) => (
                  <li key={task} className="flex items-start gap-3 text-sm text-text-secondary">
                    <span
                      className="mt-2 size-1.5 shrink-0 rounded-full"
                      style={{ backgroundColor: data.accent }}
                    />
                    {task}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Certificates */}
      <motion.div variants={itemVariants} className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-surface-hover">
            <Icon name="Award" size="md" className="text-warning" />
          </div>
          <h2 className="font-display text-xl font-bold">关键证书 / 竞赛</h2>
        </div>
        <div className="rounded-xl border border-border-subtle bg-surface-elevated p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.certificates.map((cert) => (
              <div
                key={cert}
                className="flex items-center gap-3 rounded-xl border border-border-subtle bg-surface-hover p-4"
              >
                <Icon name="Sparkles" size="sm" className="shrink-0 text-warning" />
                <span className="text-sm text-text-primary">{cert}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Bottom CTA */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col items-center justify-between gap-4 rounded-xl border border-border-subtle bg-surface-elevated p-6 sm:flex-row"
      >
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-surface-hover">
            <Icon name="BookOpen" size="md" className="text-text-tertiary" />
          </div>
          <div>
            <p className="font-medium text-text-primary">继续规划升学路线</p>
            <p className="text-xs text-text-muted">返回路线方案页查看全部目标与进度</p>
          </div>
        </div>
        <Link
          href="/dashboard/plan"
          className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-primary to-secondary px-6 py-2.5 font-semibold text-text-primary transition-all duration-300 hover:shadow-[0_0_30px_color-mix(in_srgb,var(--color-primary)_50%,transparent)]"
        >
          <Icon name="FileText" size="sm" />
          返回路线方案页
        </Link>
      </motion.div>
    </motion.div>
  );
}
