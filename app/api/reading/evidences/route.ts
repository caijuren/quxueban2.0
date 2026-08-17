import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@/lib/generated/prisma';
import { canManageChild, canViewChild } from '@/lib/family';
import { EVIDENCE_TYPE_META, type EvidenceType } from '@/lib/readingEvidence';

async function authenticate() {
  const session = await getServerSession(authOptions);
  return session?.user?.id ?? null;
}

async function verifyChildAccess(childId: string, userId: string, manage = false) {
  const child = await prisma.child.findUnique({ where: { id: childId } });
  if (!child) return false;
  return manage ? canManageChild(userId, child) : canViewChild(userId, child);
}

export async function GET(req: Request) {
  const userId = await authenticate();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const childId = searchParams.get('childId');
  const status = searchParams.get('status');

  if (!childId) {
    return NextResponse.json({ error: 'childId is required' }, { status: 400 });
  }

  const accessible = await verifyChildAccess(childId, userId);
  if (!accessible) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  try {
    const evidences = await prisma.readingEvidence.findMany({
      where: { childId, ...(status && status !== 'all' ? { status } : {}) },
      orderBy: [{ status: 'asc' }, { occurredAt: 'desc' }],
    });
    return NextResponse.json({ evidences });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const userId = await authenticate();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const childId = String(body.childId ?? '');
  const originalText = String(body.originalText ?? '').trim();
  const type = String(body.type ?? '');
  if (!childId || !originalText || !type) {
    return NextResponse.json({ error: 'childId、originalText、type 必填' }, { status: 400 });
  }
  if (!(type in EVIDENCE_TYPE_META)) {
    return NextResponse.json({ error: '无效的证据类型' }, { status: 400 });
  }
  const status = String(body.status ?? 'pending');
  if (!['pending', 'confirmed', 'rejected'].includes(status)) {
    return NextResponse.json({ error: '无效的状态' }, { status: 400 });
  }

  const manageable = await verifyChildAccess(childId, userId, true);
  if (!manageable) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  try {
    const indicatorIds = Array.isArray(body.indicatorIds)
      ? (body.indicatorIds as string[])
      : [];
    const data =
      body.summary || typeof body.confidence === 'number'
        ? {
            ...(body.summary ? { summary: String(body.summary) } : {}),
            ...(typeof body.confidence === 'number' ? { confidence: body.confidence } : {}),
          }
        : null;

    const evidence = await prisma.readingEvidence.create({
      data: {
        childId,
        type: type as EvidenceType,
        status,
        originalText,
        data: data as Prisma.InputJsonValue | undefined,
        indicatorIds: indicatorIds.length > 0 ? indicatorIds : Prisma.JsonNull,
        sourceType: body.sourceType ? String(body.sourceType) : 'manual',
        occurredAt: body.occurredAt ? new Date(String(body.occurredAt)) : new Date(),
      },
    });
    return NextResponse.json({ evidence }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
