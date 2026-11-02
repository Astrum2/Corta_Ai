import { Body, Controller, Delete, Get, Headers, Param, Post, Put } from '@nestjs/common';
import { NotificationsService } from './notifications.service.js';
import { Notification } from './notifications.entity.js';

type CreateNotificationDto = {
  appointment_id: number;
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
  create(
    @Body() body: CreateNotificationDto,
    @Headers('authorization') authorization?: string,
  ): Promise<Notification> {
    return this.notificationsService.create(
      body.appointment_id,
      body.type,
      body.title,
      body.message,
      body.status,
      authorization,
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
