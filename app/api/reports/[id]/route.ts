import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { canViewChild } from '@/lib/family';

type Params = { params: { id: string } };

export async function GET(_req: Request, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const report = await prisma.growthReport.findUnique({
    where: { id: params.id },
    include: { child: { select: { id: true, name: true, grade: true, userId: true, familyId: true } } },
  });

  if (!report || !(await canViewChild(session.user.id, report.child))) {
    return NextResponse.json({ error: 'Not found or no permission' }, { status: 404 });
  }

  return NextResponse.json({
    report: {
      ...report,
      periodStart: report.periodStart.toISOString(),
      periodEnd: report.periodEnd.toISOString(),
      createdAt: report.createdAt.toISOString(),
      updatedAt: report.updatedAt.toISOString(),
      child: undefined,
    },
    child: report.child,
  });
}
