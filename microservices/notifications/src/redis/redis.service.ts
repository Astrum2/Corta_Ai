import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import IORedis, { Redis } from "ioredis";
import { Repository } from "typeorm";
import { Notification } from "../notifications/notifications.entity.js";

type ReviewCreatedEvent = {
  event: "review.created" | "review.updated" | "review.deleted";
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
    await this.subscriber.subscribe("reviews.events");
    console.log("[Redis Subscriber] Assinatura ativa: reviews.events");

    this.subscriber.on("message", (channel, rawMessage) => {
      void this.handleMessage(channel, rawMessage).catch((error) => {
        console.error("[Redis Subscriber] Falha ao processar evento:", error);
      });
    });
  }

  private async handleMessage(channel: string, rawMessage: string): Promise<void> {
    let event: ReviewCreatedEvent;

    try {
      event = JSON.parse(rawMessage) as ReviewCreatedEvent;
    } catch (error) {
      console.error("[Redis Subscriber] Mensagem inválida:", error);
      return;
    }

    console.log(`[Redis Subscriber] Evento recebido no canal ${channel}:`, event);

    if (event.event === "review.created" || event.event === "review.updated" ||
        event.event === "review.deleted") {
      const notificationDetails = {
        "review.created": {
          title: "Review registrada",
          message: "Sua review foi feita com sucesso",
        },
        "review.updated": {
          title: "Review atualizada",
          message: "Sua review foi atualizada com sucesso",
        },
        "review.deleted": {
          title: "Review excluída",
          message: "Sua review foi excluída com sucesso",
        },
      }[event.event];

      const notification = this.notificationRepository.create({
        user_id: event.userId,
        type: event.event,
        title: notificationDetails.title,
        message: notificationDetails.message,
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
