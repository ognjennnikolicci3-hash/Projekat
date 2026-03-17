import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { OceneService } from './ocene.service';
import { CreateOcenaDto } from 'src/korisnik/dto/create-ocena.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Request } from 'express';


@Controller('ocene')
export class OceneController {
  constructor(private readonly oceneService: OceneService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async dodajOcenu(@Body() dto: CreateOcenaDto, @Req() req: Request) {
    const korisnikId = (req.user as any)?.korisnikId;
    return await this.oceneService.dodajOcenu(dto, (req.user as any).korisnikId);
  }
}
