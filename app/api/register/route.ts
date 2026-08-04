import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { userRegisterSchema, validateBody } from '@/lib/validation';
import { authRateLimit, getClientIp } from '@/lib/rateLimit';

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const limit = authRateLimit(ip);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: '请求过于频繁，请稍后再试' },
      { status: 429 }
    );
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
      return NextResponse.json(
        { error: '用户名已被注册' },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(body.password, 10);

    const user = await prisma.user.create({
      data: {
        username: body.username,
        passwordHash,
        name: body.name ?? null,
        role: 'PARENT',
      },
    });

    return NextResponse.json({ message: '注册成功' }, { status: 201 });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: '注册失败，请稍后重试' },
      { status: 500 }
    );
  }
}
