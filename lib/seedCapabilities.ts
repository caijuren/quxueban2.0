import { PrismaClient, Prisma, CapabilityCategory } from './generated/prisma';

const SYSTEM_CAPABILITIES = [
  // 语文
  { name: '阅读理解', category: 'CHINESE', description: '理解文章主旨、细节和作者意图的能力' },
  { name: '写作表达', category: 'CHINESE', description: '书面表达、结构组织和语言运用能力' },
  { name: '古诗文', category: 'CHINESE', description: '古诗词背诵、理解和鉴赏能力' },
  { name: '语文基础', category: 'CHINESE', description: '字词句段、语法修辞等基础知识' },

  // 数学
  { name: '计算能力', category: 'MATH', description: '准确快速进行数学运算的能力' },
  { name: '逻辑思维', category: 'MATH', description: '推理、证明和数学建模能力' },
  { name: '空间想象', category: 'MATH', description: '几何图形、空间关系的想象能力' },
  { name: '应用题', category: 'MATH', description: '将实际问题转化为数学问题并解决' },
  { name: '奥数思维', category: 'MATH', description: '竞赛数学所需的创造性思维和解题策略' },

  // 英语
  { name: '听力', category: 'ENGLISH', description: '听懂英语对话、短文和指令' },
  { name: '口语', category: 'ENGLISH', description: '流利、准确地进行英语表达' },
  { name: '阅读', category: 'ENGLISH', description: '理解英语文章、故事和说明文' },
  { name: '写作', category: 'ENGLISH', description: '用英语进行书面表达和作文' },
  { name: '词汇语法', category: 'ENGLISH', description: '词汇量、语法规则和语言知识' },

  // 通用能力
  { name: '专注力', category: 'GENERAL', description: '长时间集中注意力完成任务' },
  { name: '时间管理', category: 'GENERAL', description: '合理安排学习、休息和娱乐时间' },
  { name: '自主学习', category: 'GENERAL', description: '独立制定计划、寻找资源、解决问题' },
  { name: '抗压能力', category: 'GENERAL', description: '面对考试压力和挫折的调节能力' },
  { name: '表达能力', category: 'GENERAL', description: '清晰、有逻辑地表达观点和想法' },

  // 考试与升学
  { name: '应试技巧', category: 'EXAM', description: '答题策略、时间分配和审题能力' },
  { name: '信息收集', category: 'ADMISSION', description: '收集学校、政策、时间节点等升学信息' },
  { name: '材料准备', category: 'ADMISSION', description: '整理简历、证书、作品集等升学材料' },
];

export async function seedSystemCapabilities(prisma: PrismaClient): Promise<number> {
  const existingCount = await prisma.capability.count({
    where: { isSystem: true },
  });

  if (existingCount > 0) {
    return 0;
  }

  await prisma.capability.createMany({
    data: SYSTEM_CAPABILITIES.map((cap) => ({
      name: cap.name,
      category: cap.category as CapabilityCategory,
      description: cap.description,
      isSystem: true,
      userId: null,
    })) satisfies Prisma.CapabilityCreateManyInput[],
    skipDuplicates: false,
  });

  return SYSTEM_CAPABILITIES.length;
}
