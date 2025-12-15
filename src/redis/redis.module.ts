import { Global, Logger, Module } from "@nestjs/common";
import Redis from "ioredis";
import { RedisService } from "./redis.service";

@Global()
@Module({
  providers: [
    {
      provide: "REDIS_CLIENT",
      useFactory: () => {
        const logger = new Logger("RedisModule");

        const redis = new Redis({
          host: process.env.REDIS_HOST,
          port: +process.env.REDIS_PORT,
          retryStrategy: (times) => {
            const delay = Math.min(times * 50, 2000);
            return delay;
          },
        });

        redis.on("connect", () => {
          logger.log("Connected to Redis");
        });

        redis.on("error", (err) => {
          logger.error("Redis error", err);
        });

        redis.on("reconnecting", () => {
          logger.warn("Reconnecting to Redis");
        });

        return redis;
      },
    },
    RedisService,
  ],
  exports: ["REDIS_CLIENT", RedisService],
})
export class RedisModule {}
