import { Injectable, OnModuleDestroy } from '@nestjs/common';
import IORedis, { Redis } from 'ioredis';

@Injectable()
export class RedisService {
    private readonly client: Redis;

    constructor() {
        this.client = new IORedis({
            host: process.env.REDIS_HOST || 'localhost',
            port: Number(process.env.REDIS_PORT || 6379),
        });

        this.client.on('error', (error) => {
            console.error('[Redis Publisher] Erro de conexão:', error);
        });
    }

    async publishReviewCreated(review: {
        id: number;
        appointment_id: number;
        user_id: number;
    }): Promise<void> {
        const event = {
            event: 'review.created' as const,
            reviewId: review.id,
            appointmentId: review.appointment_id,
            userId: review.user_id,
        };

        const subscriberCount = await this.client.publish(
            'reviews.events',
            JSON.stringify(event),
        );
        console.log(
            `[Redis Publisher] Evento publicado no canal reviews.events (${subscriberCount} assinante(s)):`,
            event,
        );
    }

    async onModuleDestroy(): Promise<void> {
        await this.client.quit();
    }
}
