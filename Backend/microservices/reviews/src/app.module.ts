import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { DataSource } from 'typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';


@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: process.env.DB_USER,
      password:  process.env.DB_PASS,
      database: 'reviews',
      synchronize: true,
    }),
  ],
})

export class AppModule {
   constructor(private dataSource: DataSource) {}
}
