import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import IORedis, { Redis } from "ioredis";
import { Repository } from "typeorm";
import { Notification } from "../notifications/notifications.entity.js";

type AppointmentCreatedEvent = {
  event: "appointment.created";
  appointmentId: number;
  userId: number;
  barberId: number;
  serviceId: number;
  date: string;
  time: string;
};

type ReviewCreatedEvent = {
  event: "review.created";
  reviewId: number;
  userId: number;
};

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly subscriber: Redis;

  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
  ) {
    this.subscriber = new IORedis({
      host: process.env.REDIS_HOST || "localhost",
      port: Number(process.env.REDIS_PORT || 6379),
    });

    this.subscriber.on("error", (error) => {
      console.error("[Redis Subscriber] Erro de conexão:", error);
    });
  }

  async onModuleInit(): Promise<void> {
    await this.subscriber.subscribe("appointments.events");
    await this.subscriber.subscribe("reviews.events");
    console.log("[Redis Subscriber] Assinatura ativa: appointments.events");
    console.log("[Redis Subscriber] Assinatura ativa: reviews.events");

    this.subscriber.on("message", (channel, rawMessage) => {
      void this.handleMessage(channel, rawMessage).catch((error) => {
        console.error("[Redis Subscriber] Falha ao processar evento:", error);
      });
    });
  }

  private async handleMessage(channel: string, rawMessage: string): Promise<void> {
    let event: AppointmentCreatedEvent | ReviewCreatedEvent;

    try {
      event = JSON.parse(rawMessage) as AppointmentCreatedEvent | ReviewCreatedEvent;
    } catch (error) {
      console.error("[Redis Subscriber] Mensagem inválida:", error);
      return;
    }

    console.log(`[Redis Subscriber] Evento recebido no canal ${channel}:`, event);

    if (event.event === "appointment.created") {
      console.log(
        `[Redis Subscriber] Evento processado para appointmentId=${event.appointmentId}`,
      );
    }

    if (event.event === "review.created") {
      const notification = this.notificationRepository.create({
        user_id: event.userId,
        type: "review.created",
        title: "Review registrada",
        message: "Sua review foi feita com sucesso",
        status: "unread",
      });

      const savedNotification = await this.notificationRepository.save(notification);
      console.log(
        `[Redis Subscriber] Notificação criada para reviewId=${event.reviewId}, notificationId=${savedNotification.id}`,
      );
    }
  }

  async onModuleDestroy(): Promise<void> {
    await this.subscriber.quit();
  }
}
