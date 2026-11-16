import IORedis, { Redis } from "ioredis";

const redis: Redis = new IORedis({
    host: process.env.REDIS_HOST || "localhost",
    port: Number(process.env.REDIS_PORT || 6379),
    connectTimeout: 1000,
    maxRetriesPerRequest: 1,
    retryStrategy: () => null,
});

redis.on("error", (error) => {
    console.error("[Redis Cache] Erro de conexão:", error);
});

export default redis;
