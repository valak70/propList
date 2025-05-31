import { Request, Response, NextFunction } from 'express';
import redis from '../utils/redis'; // your redis client

export const cache = (prefix: string, ttlSeconds = 21600) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const key = `${prefix}:${req.originalUrl}`;
    const cached = await redis.get(key);

    if (cached) {
        // console.log(`📦 CACHE HIT for key: ${key}`);
      const parsed = JSON.parse(cached);
        res.status(200).json(parsed);
        return;
    }
    // console.log(`🔍 CACHE MISS for key: ${key}`);
    const originalJson = res.json.bind(res);
    res.json = (body: any) => {
      redis.setEx(key, ttlSeconds, JSON.stringify(body));
      return originalJson(body);
    };

    next();
  };
