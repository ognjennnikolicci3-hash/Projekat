// src/sport/sportovi.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Sportovi } from './sport.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SportoviService {
  constructor(
    @InjectRepository(Sportovi)
    private readonly sportoviRepository: Repository<Sportovi>,
  ) {}
// Vraća sve sportove iz baze
  async findAll(): Promise<Sportovi[]> {
    return await this.sportoviRepository.find();
  }
}
