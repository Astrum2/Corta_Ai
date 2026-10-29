import { Injectable, OnModuleDestroy } from '@nestjs/common';
import IORedis, { Redis } from 'ioredis';

@Injectable()
export class RedisService {
    private client: Redis;

    constructor() {
        this.client = new IORedis({ host: 'localhost', port: 6379});
    }
}
