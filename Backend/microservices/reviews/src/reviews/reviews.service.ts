import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './reviews.entity';
import { HttpClient } from '@nestjs/http-client';

type AppointmentResponse = {
    id: number;
    user_id: number;
    service_id: number;
    barber_id: number;
    date: string;
    time: string;
    status: string;
    notes: string | null;
};

@Injectable()
export class ReviewsService {
    constructor(
        @InjectRepository(Review) private reviewRepository: Repository<Review>,
        private httpClient: HttpClient,
    ) { }

    findAll(): Promise<Review[]> {
        return this.reviewRepository.find();
    }

    async create(appointment_id: number, rating: number, comment: string, authorization?: string): Promise<Review> {
        if (!authorization) {
            throw new UnauthorizedException('Não autorizado');
        }

        const { data: appointment } = await this.httpClient.get<AppointmentResponse>(
            `/appointments/${appointment_id}`,
            {
                headers: {
                    Authorization: authorization,
                },
            },
        );

        if (!appointment) {
            throw new NotFoundException('Agendamento não encontrado');
        }


        const review = this.reviewRepository.create({
            appointment_id: appointment.id,
            user_id: appointment.user_id,
            service_id: appointment.service_id,
            barber_id: appointment.barber_id,
            rating,
            comment,
        })
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