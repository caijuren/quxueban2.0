import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { redis } from '@/lib/redis';

export const dynamic = 'force-dynamic';

type CheckStatus = 'ok' | 'error' | 'disabled';

async function withTimeout<T>(p: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    p,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`timeout after ${ms}ms`)), ms)
    ),
  ]);
}

async function checkDatabase(): Promise<CheckStatus> {
  try {
    await withTimeout(prisma.$queryRaw`SELECT 1`, 2000);
    return 'ok';
  } catch (err) {
    console.error('[health] database check failed:', (err as Error).message);
    return 'error';
  }
}

async function checkRedis(): Promise<CheckStatus> {
  if (!redis) {
    return 'disabled';
  }
  try {
    const pong = await withTimeout(redis.ping(), 2000);
    return pong === 'PONG' ? 'ok' : 'error';
  } catch (err) {
    console.error('[health] redis check failed:', (err as Error).message);
    return 'error';
  }
}

export async function GET() {
  const [database, redisStatus] = await Promise.all([
    checkDatabase(),
    checkRedis(),
  ]);

  // db 必须健康；redis 为可选依赖，disabled/ok 均视为通过
  const healthy = database === 'ok' && redisStatus !== 'error';

  return NextResponse.json(
    {
      status: healthy ? 'ok' : 'error',
      timestamp: new Date().toISOString(),
      checks: {
        database,
        redis: redisStatus,
      },
    },
    { status: healthy ? 200 : 503 }
  );
}
