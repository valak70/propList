// utils/redis.ts

import { createClient } from 'redis';

const redis = createClient({
  url: process.env.REDIS_URL, // Add to Vercel .env
});

redis.on('error', (err) => console.error('Redis error:', err));

redis.connect();

export default redis;


// utils/redis.ts
export async function delPattern(pattern: string) {
  const keys = await redis.keys(pattern);
  if (keys.length > 0) await redis.del(keys);
}
