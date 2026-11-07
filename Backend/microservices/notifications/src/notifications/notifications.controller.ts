import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service.js';
import { Notification } from './notifications.entity.js';

type CreateNotificationDto = {
  appointment_id: number;
  user_id: number;
  type: string;
  title: string;
  message: string;
  status: string;
};

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  findAll(): Promise<Notification[]> {
    return this.notificationsService.findAll();
  }

  @Post()
  create(@Body() body: CreateNotificationDto): Promise<Notification> {
    const appointmentId = Number(body?.appointment_id);
    const userId = Number(body?.user_id);

    if (
      !Number.isInteger(userId) ||
      userId <= 0 ||
      !Number.isInteger(appointmentId) ||
      appointmentId <= 0
    ) {
      throw new BadRequestException(
        'user_id e appointment_id devem ser números inteiros válidos',
      );
    }

    return this.notificationsService.create(
      appointmentId,
      userId,
      body.type,
      body.title,
      body.message,
      body.status,
    );
  }

  @Get('/:id')
  findOne(@Param('id') id: number): Promise<Notification | null> {
    return this.notificationsService.findOne(id);
  }

  @Put('/:id')
  update(
    @Param('id') id: number,
    @Body() attrs: Partial<Notification>,
  ): Promise<Notification> {
    return this.notificationsService.update(id, attrs);
  }

  @Delete('/:id')
  remove(@Param('id') id: number): Promise<void> {
    return this.notificationsService.remove(id);
  }
}
