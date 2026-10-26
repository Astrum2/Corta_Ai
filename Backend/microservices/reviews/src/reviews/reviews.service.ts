import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './reviews.entity';
import { HttpClient } from '@nestjs/http-client';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review) private reviewRepository: Repository<Review>,
  ) {}

  findAll(): Promise<Review[]> {
    return this.reviewRepository.find();
  }

  create( appointment_id: number, user_id: number, service_id: number, barber_id: number,rating: number, comment: string) {
    
    const review = this.reviewRepository.create({ appointment_id, user_id, service_id, barber_id, rating, comment });
    return this.reviewRepository.save(review);
  }

  findOne(id: number): Promise<Review | null> {
    return this.reviewRepository.findOneBy({ id });
  }

  async remove(id: number): Promise<void> {
    await this.reviewRepository.delete(id);
  }

  async update(id: number, attrs: Partial<Review>) {
    let review = await this.findOne(id);
    Object.assign(review!, attrs);
    review = await this.reviewRepository.save(review!);

    return review;
  }
}