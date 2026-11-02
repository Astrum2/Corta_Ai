import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './notifications.entity';
import { HttpClient } from '@nestjs/http-client';

type AppointmentResponse = {
    id: number;
    user_id: number;
};

@Injectable()
export class NotificationsService {
    constructor(
        @InjectRepository(Notification) private notificationRepository: Repository<Notification>,
        private httpClient: HttpClient,
    ) { }

    findAll(): Promise<Notification[]> {
        return this.notificationRepository.find();
    }

    async create(
        appointment_id: number,
        type: string,
        title: string,
        message: string,
        status: string,
        authorization?: string,
    ): Promise<Notification> {
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


        const notification = this.notificationRepository.create({
            appointment_id: appointment.id,
            user_id: appointment.user_id,
            type,
            title,
            message,
            status,
        });

        return this.notificationRepository.save(notification);
    }

    findOne(id: number): Promise<Notification | null> {
        return this.notificationRepository.findOneBy({ id });
    }

    async remove(id: number): Promise<void> {
        await this.notificationRepository.delete(id);
    }

    async update(id: number, attrs: Partial<Notification>) {
        let notification = await this.findOne(id);
        Object.assign(notification!, attrs);
        notification = await this.notificationRepository.save(notification!);

        return notification;
    }
}