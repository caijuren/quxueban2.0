import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { canViewChild } from '@/lib/family';
import { getEnabledAiConfig } from '@/lib/aiConfig';
import { parseEvidenceWithAI } from '@/lib/readingEvidence';

async function authenticate() {
  const session = await getServerSession(authOptions);
  return session?.user?.id ?? null;
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
  const text = String(body.text ?? '').trim();
  if (!childId || !text) {
    return NextResponse.json({ error: 'childId 和 text 必填' }, { status: 400 });
  }
  if (text.length < 4) {
    return NextResponse.json({ error: '请至少输入 4 个字的观察记录' }, { status: 400 });
  }

  const child = await prisma.child.findUnique({ where: { id: childId } });
  if (!child || !(await canViewChild(userId, child))) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  try {
    const config = await getEnabledAiConfig();
    if (!config) {
      return NextResponse.json(
        { error: 'AI 未配置或未启用，请先在「AI 设置」中配置' },
        { status: 400 }
      );
    }
    const result = await parseEvidenceWithAI(text, config);
    if (!result) {
      return NextResponse.json(
        { error: '未能从这段记录中识别出阅读能力证据，请补充更具体的阅读行为描述' },
        { status: 422 }
      );
    }
    return NextResponse.json({ result });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
