import { Body, Controller, Delete, Get, Headers, Param, Post, Put } from '@nestjs/common';
import { ReviewsService } from './reviews.service.js';
import { Review } from './reviews.entity.js';

type CreateReviewDto = {
  appointment_id: number;
  rating: number;
  comment: string;
};

@Controller('reviews')
export class ReviewsController {
  constructor( private reviewsService: ReviewsService) {}

 @Get()
  async findAll(): Promise<Review[]> {
    return await this.reviewsService.findAll();
  }

  @Post()
  create(
    @Body() body: CreateReviewDto,
    @Headers('authorization') authorization?: string,
  ) {
    return this.reviewsService.create(
      body.appointment_id,
      body.rating,
      body.comment,
      authorization,
    );
  }

   @Get('/:id')
  async findOne(@Param('id') id: number): Promise<Review | null> {
    return await this.reviewsService.findOne(id);
  }

  @Put('/:id')
  updateReview(@Param('id') id: number, @Body() attrs: Partial<Review>) {
      return this.reviewsService.update(id, attrs);
  }

  @Delete('/:id')
  remove(@Param('id') id: number): void {
    this.reviewsService.remove(id);
  }
}