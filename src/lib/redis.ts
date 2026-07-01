/**
 * Redis 客户端 - 内存回退版
 * 生产环境安装 ioredis 后自动切换
 */

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

// In-memory store fallback
const store = new Map<string, { value: string; expiry?: number }>();

type RedisLike = {
  get(key: string): Promise<string | null>;
  set(key: string, value: string, ...args: (string | number)[]): Promise<string>;
  del(key: string): Promise<number>;
  lpush(key: string, ...values: string[]): Promise<number>;
  rpop(key: string): Promise<string | null>;
  expire(key: string, seconds: number): Promise<number>;
  incr(key: string): Promise<number>;
};

let client: RedisLike | null = null;

async function getClient(): Promise<RedisLike> {
  if (client) return client;

  try {
    const Redis = Function('return require("ioredis")')();
    const c = new Redis(REDIS_URL, { maxRetriesPerRequest: 3, lazyConnect: false }) as RedisLike;
    client = c;
    return c;
  } catch {
    client = createMemoryClient();
    return client;
  }
}

function createMemoryClient(): RedisLike {
  return {
    async get(key) {
      const item = store.get(key);
      if (!item) return null;
      if (item.expiry && item.expiry < Date.now()) { store.delete(key); return null; }
      return item.value;
    },
    async set(key, value, ...args) {
      let ttl = 0;
      if (args[0] === 'EX') ttl = Number(args[1]) || 0;
      store.set(key, { value, expiry: ttl ? Date.now() + ttl * 1000 : undefined });
      return 'OK';
    },
    async del(key) { store.delete(key); return 1; },
    async lpush(_key, ..._vals) { return _vals.length; },
    async rpop(_key) { return null; },
    async expire(key, seconds) { return 1; },
    async incr(key) { return 1; },
  };
}

export const cache = {
  async get<T>(key: string): Promise<T | null> {
    const c = await getClient();
    const data = await c.get(key);
    return data ? JSON.parse(data) : null;
  },
  async set(key: string, value: unknown, ttlSec = 300) {
    const c = await getClient();
    await c.set(key, JSON.stringify(value), 'EX', ttlSec);
  },
  async del(key: string) {
    const c = await getClient();
    await c.del(key);
  },
};
