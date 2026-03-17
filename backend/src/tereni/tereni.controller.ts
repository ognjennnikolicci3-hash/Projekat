import { Controller, Get, UseGuards } from '@nestjs/common';
import { TereniService } from './tereni.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('tereni')
export class TereniController {
  constructor(private readonly terenService: TereniService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllTereni() {
    return await this.terenService.findAll();
  }
}