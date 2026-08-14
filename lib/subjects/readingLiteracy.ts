// 中国青少年阅读素养框架（JY/T 0663—2026）· 阅读能力指标数据
// 来源：教育部 2026-04-15 发布的行业标准《中国青少年阅读素养框架》
// 用途：作为语文"现代文精读线"的评估刻度，挂载在"阅读理解"能力标签下
// 说明：本文件仅覆盖框架的"阅读能力"维度（理解性/评鉴性/创造性），
//       不覆盖阅读知识（校内基础线）与阅读价值（泛读线），也不覆盖
//       古文、诗词、输出表达等非阅读能力维度。

export type ReadingAbilityId =
  | 'recognition' // 认读能力
  | 'comprehension' // 理解能力
  | 'appreciation' // 鉴赏能力
  | 'evaluation' // 评价能力
  | 'application' // 应用能力
  | 'innovation'; // 创新能力

export type ReadingAbilityGroup = 'comprehension' | 'critical' | 'creative';

export type ReadingPhase = '奠基' | '拓展' | '深化' | '融通';

export interface ReadingLadder {
  ladder: number; // 1-12
  phase: ReadingPhase;
  description: string;
}

export interface ReadingAbility {
  id: ReadingAbilityId;
  name: string;
  group: ReadingAbilityGroup;
  groupName: string;
  description: string;
  ladders: ReadingLadder[];
}

export interface ReadingPhaseInfo {
  phase: ReadingPhase;
  ladders: [number, number];
  stage: string;
}

export interface ReadingTarget {
  ladder: number;
  dailyMinutes: number;
  annualChars: number; // 万字
}

export interface ReadingDimensionScore {
  id: ReadingAbilityId;
  score: number;
  comment?: string;
}

export interface ReadingLiteracyAssessment {
  ladder: number;
  dimensions: ReadingDimensionScore[];
}

// 四阶十二梯：阶段划分（框架 4.2）
export const READING_PHASES: ReadingPhaseInfo[] = [
  { phase: '奠基', ladders: [1, 2], stage: '小学低学段（含幼小衔接）' },
  { phase: '拓展', ladders: [3, 6], stage: '小学中高学段至初中学段' },
  { phase: '深化', ladders: [7, 9], stage: '高中学段' },
  { phase: '融通', ladders: [10, 12], stage: '大学阶段' },
];

export function getPhaseByLadder(ladder: number): ReadingPhase {
  const info = READING_PHASES.find((p) => ladder >= p.ladders[0] && ladder <= p.ladders[1]);
  return info ? info.phase : '拓展';
}

// 量化阅读目标（框架表 20 阅读习惯指标）
export const READING_TARGETS: ReadingTarget[] = [
  { ladder: 1, dailyMinutes: 0, annualChars: 0 },
  { ladder: 2, dailyMinutes: 15, annualChars: 3 },
  { ladder: 3, dailyMinutes: 30, annualChars: 20 },
  { ladder: 4, dailyMinutes: 40, annualChars: 50 },
  { ladder: 5, dailyMinutes: 50, annualChars: 90 },
  { ladder: 6, dailyMinutes: 60, annualChars: 100 },
  { ladder: 7, dailyMinutes: 70, annualChars: 150 },
  { ladder: 8, dailyMinutes: 80, annualChars: 180 },
  { ladder: 9, dailyMinutes: 90, annualChars: 200 },
  { ladder: 10, dailyMinutes: 100, annualChars: 0 },
  { ladder: 11, dailyMinutes: 110, annualChars: 0 },
  { ladder: 12, dailyMinutes: 120, annualChars: 0 },
];

export function getReadingTarget(ladder: number): ReadingTarget | undefined {
  return READING_TARGETS.find((t) => t.ladder === ladder);
}

// 年级 → 梯级：按框架"四阶十二梯"的阶段划分推断
// 奠基 1-2 梯（小学低段）→ 拓展 3-6 梯（小学中高-初中）→ 深化 7-9 梯（高中）→ 融通 10-12 梯（大学）
export function getReadingLadderByGrade(grade: number): number {
  if (grade <= 0) return 1;
  if (grade <= 2) return grade; // 1-2 梯：小学低段
  if (grade <= 6) return grade; // 3-6 梯：小学中高段
  if (grade <= 9) return 6; // 初中：6 梯
  if (grade <= 12) return 7 + Math.min(2, grade - 9); // 高中：7-9 梯
  return 10; // 大学：10 梯起
}

export function getReadingTargetByGrade(grade: number): ReadingTarget | undefined {
  return getReadingTarget(getReadingLadderByGrade(grade));
}

// 6 个阅读能力维度 × 12 梯级（框架表 10-15）
export const READING_ABILITIES: ReadingAbility[] = [
  {
    id: 'recognition',
    name: '认读能力',
    group: 'comprehension',
    groupName: '理解性阅读能力',
    description: '识别汉字、读准字音、理解词义的能力',
    ladders: [
      { ladder: 1, phase: '奠基', description: '在他人帮助下阅读浅显读物，初步了解字音与字形的对应关系' },
      { ladder: 2, phase: '奠基', description: '借助汉语拼音，正确、连贯地朗读浅显读物，尝试运用偏旁部首等信息认读汉字' },
      { ladder: 3, phase: '拓展', description: '正确、连贯地朗读简单文本，主动运用拼音、偏旁部首等解决认读障碍' },
      { ladder: 4, phase: '拓展', description: '正确、连贯、流畅地默读常见文本，主动运用字典、词典等工具帮助认读汉字及理解字义' },
      { ladder: 5, phase: '拓展', description: '正确、连贯、流畅地阅读具有一定长度和难度的常见文本，比较自觉地辨认多音字、生僻字' },
      { ladder: 6, phase: '拓展', description: '正确、连贯、流畅地阅读较长、较难的文本，自觉辨认多音字、生僻字' },
      { ladder: 7, phase: '深化', description: '正确、连贯、流畅地阅读不同类型的复杂文本，自觉处理专业术语带来的挑战' },
      { ladder: 8, phase: '深化', description: '正确、连贯、流畅地阅读多类型、较长的复杂文本，自觉处理复杂句式带来的挑战' },
      { ladder: 9, phase: '深化', description: '正确、连贯、流畅地阅读多类型、较长、较难的复杂文本，自觉处理抽象概念带来的挑战' },
      { ladder: 10, phase: '融通', description: '高效、流畅地阅读多领域的经典文本，认读具有高度自主性' },
      { ladder: 11, phase: '融通', description: '高效、流畅地阅读多领域的经典文本，认读具有高度自主性' },
      { ladder: 12, phase: '融通', description: '高效、流畅地阅读多领域的经典文本，认读具有高度自主性' },
    ],
  },
  {
    id: 'comprehension',
    name: '理解能力',
    group: 'comprehension',
    groupName: '理解性阅读能力',
    description: '在阅读中获取信息、解释信息、建构意义的能力',
    ladders: [
      { ladder: 1, phase: '奠基', description: '识别浅显读物的基本信息，在具体情境中明白字词、句子所表达的基本含义' },
      { ladder: 2, phase: '奠基', description: '初步理解浅显读物的词句含义，借助关键词句进行简单推测，了解读物大意' },
      { ladder: 3, phase: '拓展', description: '获取文本多元信息，结合关键词句理解内容，根据图表进行推断，初步理解非连续性文本的主要内容' },
      { ladder: 4, phase: '拓展', description: '获取文本中部分隐含信息，联系生活经验理解作者意图，梳理内容梗概、行文思路、结构布局，把握文本的主要观点与内容' },
      { ladder: 5, phase: '拓展', description: '获取文本的隐含信息，理解较为复杂的指代关系，基本把握文本的主题、结构与逻辑，对文本的内容、情感产生体验与感悟，基本理解非连续性文本的信息' },
      { ladder: 6, phase: '拓展', description: '整合文本的多种信息，把握文本的主题、结构与逻辑，对文本的内容、情感产生深刻体验与感悟，理解非连续性文本的关键信息' },
      { ladder: 7, phase: '深化', description: '深入理解文本的结构与逻辑，开展主题阅读，初步形成关于人与自我、人与社会、人与自然之间关系的基本认知' },
      { ladder: 8, phase: '深化', description: '理解文本中隐含的思想与观点，开展思辨阅读，形成关于人与自我、人与社会、人与自然之间关系的辩证思考' },
      { ladder: 9, phase: '深化', description: '理解文本中的主要信息与重要观点，开展深度阅读，增进对人与自我、人与社会、人与自然之间关系的深层认知' },
      { ladder: 10, phase: '融通', description: '基本理解不同领域经典文本的核心观点与主要内容，整合跨媒介、多模态信息，初步形成正确的世界观、人生观、价值观' },
      { ladder: 11, phase: '融通', description: '理解不同领域经典文本的核心观点与主要内容，有效整合跨媒介、多模态信息，形成正确的世界观、人生观、价值观' },
      { ladder: 12, phase: '融通', description: '深入理解不同领域经典文本的核心观点与主要内容，深度整合跨媒介、多模态信息，内化为正确的世界观、人生观、价值观' },
    ],
  },
  {
    id: 'appreciation',
    name: '鉴赏能力',
    group: 'critical',
    groupName: '评鉴性阅读能力',
    description: '对文本的语言艺术、思想内容、逻辑结构等方面进行审美评鉴的能力',
    ladders: [
      { ladder: 1, phase: '奠基', description: '初步感知儿歌、童谣的声韵美和节律美' },
      { ladder: 2, phase: '奠基', description: '初步感知浅显读物中优美的词句和生动的情节，找到喜欢的画面，获得初步的审美体验' },
      { ladder: 3, phase: '拓展', description: '感知简单文本的语言美，结合上下文找到喜欢的词句，想象或联想画面，获得基本的审美体验' },
      { ladder: 4, phase: '拓展', description: '感知常见文本的内容美，辨识词语的基本感情色彩，体会关键词句、图表等的表达效果，感知文本的语言美，获得审美体验' },
      { ladder: 5, phase: '拓展', description: '品味重要词句在语境中的作用，辨别词语的感情色彩，体会常见表达方式的效果，获得较为丰富的审美体验' },
      { ladder: 6, phase: '拓展', description: '品味重要词句在语境中的意义，体会关键句的感情色彩和表达方式的效果，获得丰富的审美体验' },
      { ladder: 7, phase: '深化', description: '鉴赏不同类型复杂文本的语言表达技巧，基本把握表达方式与艺术特色，赏析文本的意境美' },
      { ladder: 8, phase: '深化', description: '深入鉴赏不同类型复杂文本的语言表达技巧，把握表达方式的效果和艺术特色，赏析文本的哲理美' },
      { ladder: 9, phase: '深化', description: '全面鉴赏不同类型复杂文本的主题内涵、结构方式与艺术特色，理解表达方式的效果，赏析文本的意蕴美' },
      { ladder: 10, phase: '融通', description: '初步品鉴不同领域经典文本的艺术性、思想性和逻辑性，形成明确的审美取向' },
      { ladder: 11, phase: '融通', description: '深入品鉴不同领域经典文本的艺术性、思想性和逻辑性，形成稳定的审美品位' },
      { ladder: 12, phase: '融通', description: '个性化品鉴不同领域经典文本的艺术性、思想性和逻辑性，形成独特的审美风格' },
    ],
  },
  {
    id: 'evaluation',
    name: '评价能力',
    group: 'critical',
    groupName: '评鉴性阅读能力',
    description: '对文本的思想性、科学性、逻辑性等进行判断、评议的能力',
    ladders: [
      { ladder: 1, phase: '奠基', description: '对浅显读物中的情节、人物、图画等有自己的想法，并尝试说出简单理由' },
      { ladder: 2, phase: '奠基', description: '对浅显读物中的人物、事件有自己的看法，并能说出简要理由' },
      { ladder: 3, phase: '拓展', description: '表达自己对简单文本中人物、事件的想法，结合词句或图表说明简要理由' },
      { ladder: 4, phase: '拓展', description: '初步评价文本中的主要人物、事件和环境，并简要阐述理由' },
      { ladder: 5, phase: '拓展', description: '评价文本语言的准确性、结构的清晰性和内容的可靠性，并阐述理由' },
      { ladder: 6, phase: '拓展', description: '评价文本的语言、结构、主题思想及价值取向，并结合相关信息阐述理由' },
      { ladder: 7, phase: '深化', description: '对文本的主要观点、逻辑结构及价值取向做出比较客观、理性的评价' },
      { ladder: 8, phase: '深化', description: '对文本的主要观点、逻辑结构及价值取向做出客观、理性的评价' },
      { ladder: 9, phase: '深化', description: '对文本的主要观点、逻辑结构及价值取向做出全面、客观、理性的评价' },
      { ladder: 10, phase: '融通', description: '对不同领域经典文本做出比较客观的评价，分析其科学性与创造性，指出其历史影响与社会意义' },
      { ladder: 11, phase: '融通', description: '对不同领域经典文本做出客观的评价，全面分析其科学性与创造性，梳理其历史影响与社会意义' },
      { ladder: 12, phase: '融通', description: '对不同领域经典文本做出客观、深入的评价，全面、系统地分析其科学性与创造性，阐述其历史影响与社会意义' },
    ],
  },
  {
    id: 'application',
    name: '应用能力',
    group: 'creative',
    groupName: '创造性阅读能力',
    description: '将文本中的知识、观点、方法用于解决具体问题的能力',
    ladders: [
      { ladder: 1, phase: '奠基', description: '尝试用绘画、表演等形式表达与浅显读物相关的内容' },
      { ladder: 2, phase: '奠基', description: '模仿浅显读物的句式进行口头或书面表达，发现阅读所得信息与生活的联系' },
      { ladder: 3, phase: '拓展', description: '尝试运用阅读所得丰富自己的语言表达，将所得信息直接应用于日常生活' },
      { ladder: 4, phase: '拓展', description: '运用阅读所得丰富自己的语言表达，初步解决学习和生活中的常见问题' },
      { ladder: 5, phase: '拓展', description: '运用阅读所得提升语言表达能力与思维水平，解决学习和生活中的问题' },
      { ladder: 6, phase: '拓展', description: '综合运用阅读所得提升语言表达能力与思维水平，解决较为复杂的问题' },
      { ladder: 7, phase: '深化', description: '灵活运用阅读所获得的知识、方法或思想，用于文体写作并解决复杂问题' },
      { ladder: 8, phase: '深化', description: '统筹运用阅读所得的复杂信息与思想资源，用于创意写作并解决复杂的跨学科问题' },
      { ladder: 9, phase: '深化', description: '将阅读所得信息进行分析与重组，用于综合写作并解决复杂的跨学科综合问题' },
      { ladder: 10, phase: '融通', description: '将阅读所得与专业学习相结合，基本实现理论认知与实践探索的融合' },
      { ladder: 11, phase: '融通', description: '将经典阅读所得与专业研究相结合，进而实现理论对实践的有效指导' },
      { ladder: 12, phase: '融通', description: '将系统阅读所得与前沿研究相结合，进而实现理论与实践的深度融合' },
    ],
  },
  {
    id: 'innovation',
    name: '创新能力',
    group: 'creative',
    groupName: '创造性阅读能力',
    description: '对阅读所得进行重组、改造、拓展，形成新思路、新方法的能力',
    ladders: [
      { ladder: 1, phase: '奠基', description: '阅读浅显读物，联想到相关的故事、图画等，尝试表达自己的想法' },
      { ladder: 2, phase: '奠基', description: '续编或改编故事的结尾，进行简单的仿写或创作，就读物内容提出疑问' },
      { ladder: 3, phase: '拓展', description: '尝试借鉴文本的主题或结构进行创作，从不同角度提出问题' },
      { ladder: 4, phase: '拓展', description: '根据文本形成自己的新见解或新解释，提出具有探究价值的问题' },
      { ladder: 5, phase: '拓展', description: '对文本产生独特的感悟，开展创意活动，提出有一定新意的问题并积极探究' },
      { ladder: 6, phase: '拓展', description: '对文本形成个性化的认识，主动进行创意活动，提出新颖的问题并积极探究' },
      { ladder: 7, phase: '深化', description: '对文本进行初步的理性思辨，提出较有深度的问题，形成解决问题的新思路或新想法' },
      { ladder: 8, phase: '深化', description: '对文本进行理性质疑，提出思辨性较强的问题，形成解决问题的新方法或新视角' },
      { ladder: 9, phase: '深化', description: '对文本进行深刻的理性思辨，提出具有实践价值的新方案或新设计' },
      { ladder: 10, phase: '融通', description: '基于专业学习，将所得知识进行重组，形成具有一定创新性的新方案或新设计' },
      { ladder: 11, phase: '融通', description: '基于专业研究，将阅读所得进行融合、转化，形成具有创新性的研究方案或设计构想' },
      { ladder: 12, phase: '融通', description: '基于前沿研究，将阅读所得进行创造性转化和创新性发展，形成具有理论价值或应用价值的学术思路或实践模型' },
    ],
  },
];

export function getReadingAbility(id: ReadingAbilityId): ReadingAbility | undefined {
  return READING_ABILITIES.find((a) => a.id === id);
}

export function getLadderDescription(abilityId: ReadingAbilityId, ladder: number): string {
  const ability = getReadingAbility(abilityId);
  const item = ability?.ladders.find((l) => l.ladder === ladder);
  return item?.description ?? '';
}

// 与语文六条线的映射关系（仅作参考，不参与计算）
// 认读/理解/鉴赏/评价 → 现代文精读线（intensiveReading）
// 应用/创新 → 输出表达线（output，部分）
// 阅读知识（语音/汉字/词汇/语句/语篇）→ 校内基础线（school）
// 阅读价值（兴趣/态度/习惯/反思）→ 现代文泛读线（extensiveReading）
export const READING_ABILITY_TRACK_MAP: Record<ReadingAbilityId, string[]> = {
  recognition: ['intensiveReading', 'school'],
  comprehension: ['intensiveReading'],
  appreciation: ['intensiveReading'],
  evaluation: ['intensiveReading'],
  application: ['output'],
  innovation: ['output'],
};
