import { Module } from '@nestjs/common';
import { HttpClientModule } from '@nestjs/http-client';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationsController } from './notifications.controller.js';
import { NotificationsService } from './notifications.service.js';
import { Notification } from './notifications.entity.js';

@Module({
  imports: [
    HttpClientModule.register({
      baseUrl: process.env.OUTER_BACKEND_URL,
      timeout: '5s',
    }), 
    TypeOrmModule.forFeature([Notification])],
    controllers: [NotificationsController],
    providers: [NotificationsService]
})

export class NotificationsModule { }