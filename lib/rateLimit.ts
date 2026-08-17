import { LRUCache } from 'lru-cache';
import { redis } from './redis';

export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetAt: number;
}

interface RateLimitState {
  count: number;
  resetAt: number;
}

// 原子固定窗口计数：INCR 后在首次计数时设置窗口 TTL，返回 [count, pttl]。
// 保证多实例/并发下的计数一致，避免读改写竞态。
const FIXED_WINDOW_LUA = `
local current = redis.call('INCR', KEYS[1])
if current == 1 then
  redis.call('PEXPIRE', KEYS[1], ARGV[1])
end
local pttl = redis.call('PTTL', KEYS[1])
return { current, pttl }
`;

const createRateLimiter = (options: {
  maxRequests: number;
  windowMs: number;
  namespace: string;
}) => {
  const cache = new LRUCache<string, RateLimitState>({
    ttl: options.windowMs,
    ttlAutopurge: true,
    updateAgeOnGet: false,
    updateAgeOnHas: false,
  });

  function checkMemory(key: string): RateLimitResult {
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
  }

  async function checkRedis(key: string): Promise<RateLimitResult> {
    const redisKey = `ratelimit:${options.namespace}:${key}`;
    const [count, pttl] = (await redis!.eval(
      FIXED_WINDOW_LUA,
      1,
      redisKey,
      options.windowMs
    )) as [number, number];

    const ttl = pttl >= 0 ? pttl : options.windowMs;
    const remaining = Math.max(0, options.maxRequests - count);

    return {
      allowed: count <= options.maxRequests,
      limit: options.maxRequests,
      remaining,
      resetAt: Date.now() + ttl,
    };
  }

  return async function check(key: string): Promise<RateLimitResult> {
    if (redis) {
      try {
        return await checkRedis(key);
      } catch (err) {
        // Redis 故障时回退到进程内内存限流，保证限流永不因基础设施故障失效
        console.error('[rateLimit] redis error, falling back to memory:', err);
        return checkMemory(key);
      }
    }
    return checkMemory(key);
  };
};

export const authRateLimit = createRateLimiter({
  maxRequests: 10,
  windowMs: 15 * 60 * 1000, // 15 分钟
  namespace: 'auth',
});

export const bindRateLimit = createRateLimiter({
  maxRequests: 8,
  windowMs: 15 * 60 * 1000,
  namespace: 'bind',
});

export function getClientIp(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return req.headers.get('x-real-ip') ?? 'unknown';
}
