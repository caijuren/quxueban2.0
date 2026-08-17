import Redis from 'ioredis';

const globalForRedis = global as unknown as {
  redis?: Redis | null;
};

function createRedis(): Redis | null {
  const url = process.env.REDIS_URL;
  if (!url) {
    return null;
  }

  const client = new Redis(url, {
    // 限流是热路径，连接失败时快速失败并回退内存，不要无限重连阻塞请求
    maxRetriesPerRequest: 1,
    enableOfflineQueue: false,
    lazyConnect: false,
    retryStrategy(times) {
      // 最多退避到 3s，持续尝试后台重连，但单次请求不阻塞
      return Math.min(times * 200, 3000);
    },
  });

  client.on('error', (err) => {
    // 避免未捕获异常导致进程崩溃；限流会自动回退内存实现
    console.error('[redis] connection error:', err.message);
  });

  return client;
}

export const redis: Redis | null =
  globalForRedis.redis !== undefined ? globalForRedis.redis : createRedis();

if (process.env.NODE_ENV !== 'production') {
  globalForRedis.redis = redis;
}

export function isRedisEnabled(): boolean {
  return redis !== null;
}
