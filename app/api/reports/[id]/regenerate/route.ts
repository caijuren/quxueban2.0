import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { canManageChild } from '@/lib/family';
import { generateReportCore } from '@/lib/reports/service';

type Params = { params: { id: string } };

export async function POST(_req: Request, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const report = await prisma.growthReport.findUnique({
    where: { id: params.id },
    include: { child: { select: { id: true, name: true, grade: true, userId: true, familyId: true } } },
  });

  if (!report || !(await canManageChild(session.user.id, report.child))) {
    return NextResponse.json({ error: 'Not found or no permission' }, { status: 404 });
  }

  await prisma.growthReport.update({
    where: { id: params.id },
    data: { status: 'GENERATING' },
  });

  // Trigger async generation without awaiting so the HTTP response returns immediately.
  generateReportCore(params.id).catch((err) => {
    console.error('[reports/regenerate] async generation failed:', err);
  });

  return NextResponse.json({ reportId: params.id, status: 'GENERATING' });
}
