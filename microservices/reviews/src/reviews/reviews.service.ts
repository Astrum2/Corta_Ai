import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './reviews.entity';
import { RedisService } from '../redis/redis.service.js';

@Injectable()
export class ReviewsService {
    constructor(
        @InjectRepository(Review) private reviewRepository: Repository<Review>,
        private redisService: RedisService,
    ) { }

    findAll(): Promise<Review[]> {
        return this.reviewRepository.find();
    }

    async create(
        user_id: number,
        user_name: string,
        rating: number,
        comment: string,
    ): Promise<Review> {
        const review = this.reviewRepository.create({
            user_id,
            user_name,
            rating,
            comment,
        })
        const savedReview = await this.reviewRepository.save(review);
        await this.redisService.publishReviewCreated(savedReview);

        return savedReview;
    }

    findOne(id: number): Promise<Review | null> {
        return this.reviewRepository.findOneBy({ id });
    }

    async remove(id: number): Promise<void> {
        const review = await this.findOne(id);
        await this.reviewRepository.delete(id);

        if (review) {
            await this.redisService.publishReviewDeleted(review);
        }
    }

    async update(id: number, attrs: Partial<Review>) {
        let review = await this.findOne(id);
        Object.assign(review!, attrs);
        review = await this.reviewRepository.save(review!);
        await this.redisService.publishReviewUpdated(review);

        return review;
    }
}