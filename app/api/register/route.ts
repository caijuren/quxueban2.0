import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { seedSystemTaskTemplatesForUser } from '@/lib/seedTaskTemplates';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, password, name } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: '用户名和密码不能为空' },
        { status: 400 }
      );
    }

    if (username.length < 3 || username.length > 20) {
      return NextResponse.json(
        { error: '用户名长度需在 3-20 个字符之间' },
        { status: 400 }
      );
    }

    if (password.length < 6 || password.length > 50) {
      return NextResponse.json(
        { error: '密码长度需在 6-50 个字符之间' },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: '用户名已被注册' },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username,
        passwordHash,
        name: name || null,
        role: 'PARENT',
      },
    });

    await seedSystemTaskTemplatesForUser(prisma, user.id);

    return NextResponse.json(
      { message: '注册成功' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: '注册失败，请稍后重试' },
      { status: 500 }
    );
  }
}
