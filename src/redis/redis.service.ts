import { Inject, Injectable } from "@nestjs/common";
import Redis from "ioredis";

@Injectable()
export class RedisService {
  constructor(@Inject("REDIS_CLIENT") private readonly redis: Redis) {}

  async set<T>(key: string, value: T, ttl = 3600): Promise<void> {
    const serializedValue = JSON.stringify(value);
    await this.redis.set(key, serializedValue, "EX", ttl);
  }

  async get<T>(key: string): Promise<T | null> {
    const value = await this.redis.get(key);
    return value ? JSON.parse(value) : null;
  }

  async delete(key: string): Promise<void> {
    await this.redis.del(key);
  }

  /**
   * Add member to sorted set with score
   */
  async zAdd(key: string, score: number, member: string): Promise<void> {
    await this.redis.zadd(key, score, member);
  }

  /**
   * Remove members from sorted set by score range
   */
  async zRemRangeByScore(
    key: string,
    min: number,
    max: number
  ): Promise<number> {
    return await this.redis.zremrangebyscore(key, min, max);
  }

  /**
   * Get cardinality (number of members) of sorted set
   */
  async zCard(key: string): Promise<number> {
    return await this.redis.zcard(key);
  }

  /**
   * Set expiration time for key
   */
  async expire(key: string, seconds: number): Promise<void> {
    await this.redis.expire(key, seconds);
  }
}
