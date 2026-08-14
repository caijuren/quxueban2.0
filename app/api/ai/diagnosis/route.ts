import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getEnabledAiConfig } from '@/lib/aiConfig';
import {
  generateDiagnosis,
  getFallbackDiagnosis,
  computeReadingStats,
} from '@/lib/aiDiagnosis';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: '未登录' }, { status: 401 });
    }

    const body = (await req.json()) as { childId?: string };
    const { childId } = body;

    if (!childId) {
      return NextResponse.json({ error: '缺少 childId' }, { status: 400 });
    }

    const child = await prisma.child.findFirst({
      where: { id: childId, userId: session.user.id },
      include: { plans: true },
    });

    if (!child) {
      return NextResponse.json({ error: '未找到孩子档案' }, { status: 404 });
    }

    // 近 4 周周计划，用于统计真实阅读打卡数据
    const recentPlans = await prisma.weeklyPlan.findMany({
      where: { childId: child.id },
      orderBy: { weekId: 'desc' },
      take: 4,
      select: { tasks: true },
    });

    const readingStats = computeReadingStats(recentPlans);

    const input = {
      child: {
        id: child.id,
        name: child.name,
        grade: child.grade,
        educationSystem: child.educationSystem as 'six-three' | 'five-four',
        targetSchool: child.targetSchool,
        currentSchool: child.currentSchool,
        notes: child.notes,
        routeId: child.routeId,
        avatarColor: child.avatarColor,
        avatarUrl: child.avatarUrl,
        birthday: child.birthday?.toISOString() ?? null,
        userId: child.userId,
        createdAt: child.createdAt.toISOString(),
        updatedAt: child.updatedAt.toISOString(),
      },
      plans: child.plans.map((p) => ({
        id: p.id,
        name: p.name,
        type: p.type,
        status: p.status,
        stage: p.stage,
        description: p.description,
        requirements: p.requirements as unknown,
        milestones: p.milestones as unknown,
        targets: p.targets as unknown,
        probability: p.probability,
      })),
      currentDate: new Date().toISOString().split('T')[0],
      readingStats,
    };

    try {
      const config = await getEnabledAiConfig();
      if (!config) {
        throw new Error('AI 检视未配置或已禁用，请先到系统设置中配置 DeepSeek API Key');
      }

      const result = await generateDiagnosis(input, config);
      return NextResponse.json(result);
    } catch (aiError) {
      console.error('AI diagnosis failed:', aiError);
      const fallback = getFallbackDiagnosis(input);
      return NextResponse.json({
        ...fallback,
        _fallback: true,
        _error: aiError instanceof Error ? aiError.message : 'AI 调用失败',
      });
    }
  } catch (error) {
    console.error('AI diagnosis route error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '生成诊断失败' },
      { status: 500 }
    );
  }
}
