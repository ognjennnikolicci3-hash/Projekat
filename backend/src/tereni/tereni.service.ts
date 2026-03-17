import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tereni } from './tereni.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TereniService {
  constructor(
    @InjectRepository(Tereni)
    private readonly terenRepo: Repository<Tereni>,
  ) {}
// Vraća sve terene iz baze
  async findAll(): Promise<Tereni[]> {
    return await this.terenRepo.find();
  }
 // Vraća teren po ID-u ili null ako ne postoji
  async findById(id: number): Promise<Tereni | null> {
    return await this.terenRepo.findOne({ where: { terenId: id } });
  }
}