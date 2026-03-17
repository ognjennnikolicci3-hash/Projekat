// src/sport/sportovi.controller.ts
import { Controller, Get, UseGuards } from '@nestjs/common';
import { SportoviService } from './sportovi.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('sportovi')
export class SportoviController {
  constructor(private readonly sportoviService: SportoviService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllSportovi() {
    return await this.sportoviService.findAll();
  }
}
