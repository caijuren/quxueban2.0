import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { canViewChild } from '@/lib/family';
import type { ReportType } from '@/lib/generated/prisma';

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const childId = searchParams.get('childId');
  const type = searchParams.get('type') as ReportType | null;
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10));
  const limit = Math.max(1, Math.min(50, parseInt(searchParams.get('limit') ?? '10', 10)));

  if (!childId) {
    return NextResponse.json({ error: 'childId is required' }, { status: 400 });
  }

  const child = await prisma.child.findUnique({ where: { id: childId } });
  if (!child || !(await canViewChild(session.user.id, child))) {
    return NextResponse.json({ error: 'Not found or no permission' }, { status: 404 });
  }

  const where = {
    childId,
    ...(type ? { type } : {}),
  };

  const [reports, total] = await Promise.all([
    prisma.growthReport.findMany({
      where,
      orderBy: { periodStart: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        type: true,
        periodStart: true,
        periodEnd: true,
        title: true,
        summary: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    }),
    prisma.growthReport.count({ where }),
  ]);

  return NextResponse.json({
    reports: reports.map((r) => ({
      ...r,
      periodStart: r.periodStart.toISOString(),
      periodEnd: r.periodEnd.toISOString(),
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt.toISOString(),
    })),
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  });
}
