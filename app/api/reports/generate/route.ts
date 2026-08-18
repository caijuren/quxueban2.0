import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { canManageChild } from '@/lib/family';
import { generateReport, generateReportCore } from '@/lib/reports/service';
import { z } from 'zod';

const bodySchema = z.object({
  childId: z.string().uuid(),
  type: z.enum(['WEEKLY', 'MONTHLY']),
  periodStart: z.string().datetime().optional(),
  periodEnd: z.string().datetime().optional(),
  force: z.boolean().optional(),
});

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const parsed = bodySchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input', details: parsed.error }, { status: 400 });
  }

  const { childId, type, periodStart, periodEnd, force } = parsed.data;

  const child = await prisma.child.findUnique({ where: { id: childId } });
  if (!child || !(await canManageChild(session.user.id, child))) {
    return NextResponse.json({ error: 'Not found or no permission' }, { status: 404 });
  }

  const { id, status } = await generateReport({
    childId,
    type,
    periodStart: periodStart ? new Date(periodStart) : undefined,
    periodEnd: periodEnd ? new Date(periodEnd) : undefined,
    force,
  });

  // Trigger async generation without awaiting so the HTTP response returns immediately.
  // In the Docker self-hosted runtime the Node.js process stays alive to finish the work.
  generateReportCore(id).catch((err) => {
    console.error('[reports/generate] async generation failed:', err);
  });

  return NextResponse.json({ reportId: id, status });
}
