import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { DataSource } from 'typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewsModule } from './reviews/reviews.module.js';
import { RedisModule } from './redis/redis.module';


@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: 3306,
      username: process.env.DB_USER,
      password:  process.env.DB_PASS,
      database: 'reviews',
      autoLoadEntities: true,
      synchronize: true,
    }),
    RedisModule,
    ReviewsModule,
  ],
})

export class AppModule {
   constructor(private dataSource: DataSource) {}
}
