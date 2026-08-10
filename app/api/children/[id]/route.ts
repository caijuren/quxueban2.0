import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { childUpdateSchema, validateBody } from '@/lib/validation';

type Params = { params: { id: string } };

async function authenticate() {
  const session = await getServerSession(authOptions);
  return session?.user?.id ?? null;
}

export async function PATCH(req: Request, { params }: Params) {
  const userId = await authenticate();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const validation = await validateBody(req, childUpdateSchema);
  if (!validation.success) {
    return validation.response;
  }

  try {
    const existing = await prisma.child.findFirst({
      where: { id: params.id, userId },
    });
    if (!existing) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const body = validation.data;
    const data: Record<string, unknown> = {};
    const setIfDefined = (key: string, value: unknown) => {
      if (value !== undefined) data[key] = value;
    };

    setIfDefined('name', body.name);
    setIfDefined('grade', body.grade);
    if (body.educationSystem !== undefined) {
      data.educationSystem = body.educationSystem;
    }
    setIfDefined('avatarColor', body.avatarColor);
    setIfDefined('avatarUrl', body.avatarUrl ?? null);
    setIfDefined('targetSchool', body.targetSchool ?? null);
    setIfDefined('currentSchool', body.currentSchool ?? null);
    setIfDefined('birthday', body.birthday ? new Date(body.birthday) : null);
    setIfDefined('notes', body.notes ?? null);
    setIfDefined('routeId', body.routeId ?? null);
    setIfDefined('dingTalkWebhook', body.dingTalkWebhook ?? null);
    setIfDefined('dingTalkSecret', body.dingTalkSecret ?? null);

    const updated = await prisma.child.update({
      where: { id: params.id },
      data,
    });

    return NextResponse.json(updated);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  const userId = await authenticate();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const existing = await prisma.child.findFirst({
      where: { id: params.id, userId },
    });
    if (!existing) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    await prisma.child.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
