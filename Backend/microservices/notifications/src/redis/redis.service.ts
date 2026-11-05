import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import IORedis, { Redis } from "ioredis";

type AppointmentCreatedEvent = {
  event: "appointment.created";
  appointmentId: number;
  userId: number;
  barberId: number;
  serviceId: number;
  date: string;
  time: string;
};

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly subscriber: Redis;

  constructor() {
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
    console.log("[Redis Subscriber] Assinatura ativa: appointments.events");

    this.subscriber.on("message", (channel, rawMessage) => {
      void this.handleMessage(channel, rawMessage);
    });
  }

  private async handleMessage(channel: string, rawMessage: string): Promise<void> {
    try {
      const event = JSON.parse(rawMessage) as AppointmentCreatedEvent;
      console.log(`[Redis Subscriber] Evento recebido no canal ${channel}:`, event);

      if (event.event === "appointment.created") {
        console.log(
          `[Redis Subscriber] Evento processado para appointmentId=${event.appointmentId}`,
        );
      }
    } catch (error) {
      console.error("[Redis Subscriber] Mensagem inválida:", error);
    }
  }

  async onModuleDestroy(): Promise<void> {
    await this.subscriber.quit();
  }
}
