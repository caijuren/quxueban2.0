import { LRUCache } from 'lru-cache';

interface RateLimitState {
  count: number;
  resetAt: number;
}

const createRateLimiter = (options: { maxRequests: number; windowMs: number }) => {
  const cache = new LRUCache<string, RateLimitState>({
    ttl: options.windowMs,
    ttlAutopurge: true,
    updateAgeOnGet: false,
    updateAgeOnHas: false,
  });

  return function check(key: string): {
    allowed: boolean;
    limit: number;
    remaining: number;
    resetAt: number;
  } {
    const now = Date.now();
    const resetAt = now + options.windowMs;
    const state = cache.get(key);

    if (!state || now > state.resetAt) {
      cache.set(key, { count: 1, resetAt });
      return {
        allowed: true,
        limit: options.maxRequests,
        remaining: options.maxRequests - 1,
        resetAt,
      };
    }

    state.count += 1;
    const remaining = Math.max(0, options.maxRequests - state.count);

    return {
      allowed: state.count <= options.maxRequests,
      limit: options.maxRequests,
      remaining,
      resetAt: state.resetAt,
    };
  };
};

export const authRateLimit = createRateLimiter({
  maxRequests: 10,
  windowMs: 15 * 60 * 1000, // 15 分钟
});

export const bindRateLimit = createRateLimiter({
  maxRequests: 8,
  windowMs: 15 * 60 * 1000,
});

export function getClientIp(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return req.headers.get('x-real-ip') ?? 'unknown';
}
