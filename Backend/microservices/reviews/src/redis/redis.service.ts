import { Injectable, OnModuleDestroy } from '@nestjs/common';
import IORedis, { Redis } from 'ioredis';

@Injectable()
export class RedisService {
    private client: Redis;

    constructor() {
        this.client = new IORedis({ host: process.env.REDIS_HOST, port: 6379});
    }
}
