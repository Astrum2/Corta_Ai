import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './notifications.entity';

@Injectable()
export class NotificationsService {
    constructor(
        @InjectRepository(Notification) private notificationRepository: Repository<Notification>,
    ) { }

    findAll(): Promise<Notification[]> {
        return this.notificationRepository.find();
    }

    findByUserId(userId: number): Promise<Notification[]> {
        return this.notificationRepository.find({
            where: { user_id: userId },
            order: { scheduled_at: 'DESC' },
        });
    }

    async create(
        appointment_id: number,
        user_id: number,
        type: string,
        title: string,
        message: string,
        status: string,
    ): Promise<Notification> {
        const notification = this.notificationRepository.create({
            appointment_id,
            user_id,
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