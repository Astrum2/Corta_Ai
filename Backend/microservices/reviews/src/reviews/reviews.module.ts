import { Module } from '@nestjs/common';
import { HttpClientModule } from '@nestjs/http-client';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewsController } from './reviews.controller.js';
import { ReviewsService } from './reviews.service.js';
import { Review } from './reviews.entity.js';
import { RedisModule } from '../redis/redis.module.js';

@Module({
  imports: [
    HttpClientModule.register({
      baseUrl: process.env.OUTER_BACKEND_URL,
      timeout: '5s',
    }), 
    TypeOrmModule.forFeature([Review]),
    RedisModule],
    controllers: [ReviewsController],
    providers: [ReviewsService]
})

export class ReviewsModule { }