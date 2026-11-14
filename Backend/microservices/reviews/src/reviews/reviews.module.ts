import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewsController } from './reviews.controller.js';
import { ReviewsService } from './reviews.service.js';
import { Review } from './reviews.entity.js';
import { RedisModule } from '../redis/redis.module.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([Review]),
    RedisModule],
    controllers: [ReviewsController],
    providers: [ReviewsService]
})

export class ReviewsModule { }