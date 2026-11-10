import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RedisService } from "./redis.service.js";
import { Notification } from "../notifications/notifications.entity.js";

@Module({
  imports: [TypeOrmModule.forFeature([Notification])],
  providers: [RedisService],
})
export class RedisModule {}
