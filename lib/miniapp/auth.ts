import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const rawSecret = process.env.MINIAPP_JWT_SECRET || process.env.NEXTAUTH_SECRET;

if (!rawSecret) {
  throw new Error('MINIAPP_JWT_SECRET or NEXTAUTH_SECRET must be set');
}

const SECRET: string = rawSecret;

export interface MiniAppTokenPayload {
  userId: string;
  role: 'parent' | 'child';
}

export interface MiniAppParent {
  type: 'parent';
  userId: string;
  user: {
    id: string;
    username: string;
    name: string | null;
    avatarUrl: string | null;
    role: string;
  };
}

export interface MiniAppChild {
  type: 'child';
  childId: string;
  child: {
    id: string;
    name: string;
    grade: number;
    avatarColor: string;
    avatarUrl: string | null;
    userId: string;
  };
}

export type MiniAppActor = MiniAppParent | MiniAppChild;

export function signMiniAppToken(payload: MiniAppTokenPayload): string {
  return jwt.sign(payload, SECRET, { expiresIn: '7d' });
}

export function verifyMiniAppToken(token: string): MiniAppTokenPayload {
  return jwt.verify(token, SECRET) as unknown as MiniAppTokenPayload;
}

export async function authenticateMiniAppRequest(
  req: NextRequest
): Promise<MiniAppTokenPayload | null> {
  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;

  const token = authHeader.slice(7);
  try {
    const payload = verifyMiniAppToken(token);
    return payload;
  } catch {
    return null;
  }
}

export async function getMiniAppUser(req: NextRequest): Promise<MiniAppActor | null> {
  const auth = await authenticateMiniAppRequest(req);
  if (!auth) return null;

  if (auth.role === 'child') {
    const child = await prisma.child.findUnique({
      where: { id: auth.userId },
      select: {
        id: true,
        name: true,
        grade: true,
        avatarColor: true,
        avatarUrl: true,
        userId: true,
      },
    });

    if (!child) return null;

    return {
      type: 'child',
      childId: child.id,
      child,
    };
  }

  const user = await prisma.user.findUnique({
    where: { id: auth.userId },
    select: { id: true, username: true, name: true, avatarUrl: true, role: true },
  });

  if (!user) return null;

  return {
    type: 'parent',
    userId: user.id,
    user,
  };
}

export function unauthorizedResponse() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
