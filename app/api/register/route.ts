import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { userRegisterSchema, validateBody } from '@/lib/validation';
import { authRateLimit, getClientIp } from '@/lib/rateLimit';
import { getValidInvite } from '@/lib/invite';

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const limit = await authRateLimit(ip);
  if (!limit.allowed) {
    return NextResponse.json({ error: '请求过于频繁，请稍后再试' }, { status: 429 });
  }

  const validation = await validateBody(req, userRegisterSchema);
  if (!validation.success) {
    return validation.response;
  }

  const body = validation.data;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { username: body.username },
    });

    if (existingUser) {
      return NextResponse.json({ error: '用户名已被注册' }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(body.password, 10);

    const inviteToken = body.inviteToken ?? null;
    const invite = inviteToken ? await getValidInvite(inviteToken) : null;

    const user = await prisma.$transaction(async (tx) => {
      const created = await tx.user.create({
        data: {
          username: body.username,
          passwordHash,
          name: body.name ?? null,
          role: 'PARENT',
          email: invite?.email ?? null,
          phone: invite?.phone ?? null,
        },
      });

      if (invite) {
        const claimed = await tx.familyInvite.updateMany({
          where: {
            id: invite.id,
            usedAt: null,
            expiresAt: { gte: new Date() },
          },
          data: { usedAt: new Date(), usedByUserId: created.id },
        });
        if (claimed.count !== 1) {
          throw new Error('INVITE_ALREADY_USED');
        }

        await tx.familyMember.create({
          data: {
            familyId: invite.familyId,
            userId: created.id,
            role: invite.role,
            status: 'ACTIVE',
            joinedAt: new Date(),
          },
        });
      }

      return created;
    });

    return NextResponse.json(
      { message: '注册成功', familyId: invite?.familyId ?? null },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof Error && error.message === 'INVITE_ALREADY_USED') {
      return NextResponse.json({ error: '邀请链接已失效或已被使用' }, { status: 409 });
    }
    console.error('Registration error:', error);
    return NextResponse.json({ error: '注册失败，请稍后重试' }, { status: 500 });
  }
}
