import { NextResponse, NextRequest, NextFetchEvent } from 'next/server';
import { withAuth } from 'next-auth/middleware';

const LOGIN_CALLBACK_PATH = '/api/auth/callback/credentials';
const LOGIN_LIMIT = 10;
const LOGIN_WINDOW_MS = 15 * 60 * 1000;

const loginAttempts = new Map<string, { count: number; resetAt: number }>();

// 不需要登录即可访问的公开路由
const PUBLIC_API_PREFIXES = ['/api/auth/', '/api/health', '/api/register'];

function isPublicApiPath(pathname: string): boolean {
  return PUBLIC_API_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return req.headers.get('x-real-ip') ?? req.ip ?? 'unknown';
}

function checkLoginRateLimit(ip: string): { allowed: boolean; resetAt?: number } {
  const now = Date.now();
  const state = loginAttempts.get(ip);

  if (!state || now > state.resetAt) {
    loginAttempts.set(ip, { count: 1, resetAt: now + LOGIN_WINDOW_MS });
    return { allowed: true };
  }

  state.count += 1;
  if (state.count > LOGIN_LIMIT) {
    return { allowed: false, resetAt: state.resetAt };
  }

  return { allowed: true };
}

const authMiddleware = withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const { token } = req.nextauth;

    if (pathname.startsWith('/admin') && token?.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized({ token }) {
        return Boolean(token);
      },
    },
    pages: {
      signIn: '/login',
    },
  }
);

export default function middleware(req: NextRequest, event: NextFetchEvent) {
  const { pathname } = req.nextUrl;

  if (pathname === LOGIN_CALLBACK_PATH) {
    const ip = getClientIp(req);
    const result = checkLoginRateLimit(ip);
    if (!result.allowed) {
      return NextResponse.json(
        { error: '登录尝试过于频繁，请 15 分钟后再试' },
        { status: 429 }
      );
    }
  }

  // 公开 API 直接放行，避免 NextAuth 登录循环或健康检查失败
  if (isPublicApiPath(pathname)) {
    return NextResponse.next();
  }

  return authMiddleware(
    req as unknown as Parameters<typeof authMiddleware>[0],
    event
  );
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*', '/api/:path*'],
};
