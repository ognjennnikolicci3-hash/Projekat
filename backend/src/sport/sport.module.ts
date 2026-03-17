// src/sport/sport.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sportovi } from './sport.entity';
import { SportoviService } from './sportovi.service';
import { SportoviController } from './sportovi.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Sportovi])],
  exports:[SportoviService],
  controllers: [SportoviController],
  providers: [SportoviService],
})
export class SportModule {}
