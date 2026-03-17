import { Body, Controller, Get, HttpCode, HttpStatus, NotFoundException, Param, ParseIntPipe, Post, Query, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { DogadjajiService } from './dogadjaji.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { JoinDogadjajDto } from 'src/korisnik/dto/join-dogadjaj.dto';
import { Request } from 'express';
import { CreateDogadjajDto } from 'src/korisnik/dto/create-dogadjaj.dto';

@Controller('dogadjaji')
export class DogadjajiController {
  constructor(private readonly dogadjajiService: DogadjajiService) { }
// Vraća sve događaje za izabrani sport sa prosečnim ocenama.
  @UseGuards(JwtAuthGuard)
  @Get()
  async getDogadjajiBySport(@Query('sportId', ParseIntPipe) sportId: number) {

    let listaDogadjaja = await this.dogadjajiService.findBySportId(sportId);


    for (let dogadjaj of listaDogadjaja as any[]) {
      const ocene = dogadjaj.ocene || [];
      const suma = ocene.reduce((acc, o) => acc + (o?.ocena ?? 0), 0);
      (dogadjaj as any).prosecnaOcena = ocene.length ? suma / ocene.length : null;
    }

    return listaDogadjaja;
  }
// Omogućava korisniku da se pridruži događaju.
  @UseGuards(JwtAuthGuard)
  @Post('pridruzi-se')
  async pridruziSeDogadjaju(
    @Body() dto: JoinDogadjajDto,
    @Req() req: Request
  ) {
    return this.dogadjajiService.pridruziSe(dto.dogadjajId, dto.sportId, (req.user as any).korisnikId);
  }
// Kreira novi događaj koji organizuje prijavljeni korisnik.
  @UseGuards(JwtAuthGuard)
  @Post('kreiraj')
  @HttpCode(HttpStatus.CREATED)
  async kreirajDogadjaj(
    @Body() dto: CreateDogadjajDto,
    @Req() req: Request
  ) {
    const korisnik = req.user as any;
    if (!korisnik?.korisnikId) throw new UnauthorizedException();
    return await this.dogadjajiService.kreirajDogadjaj({
      ...dto,
      organizatorId: korisnik.korisnikId,
    });
  }

// Vraća događaje za kalendar (filtrirano po sportu i korisniku).
  @UseGuards(JwtAuthGuard)
  @Get('calendar')
  async getCalendarEvents(
    @Query('sportId') sportId?: string,
    @Query('korisnikId') korisnikId?: string,
  ) {
    const sId = sportId ? Number(sportId) : undefined;
    const kId = korisnikId ? Number(korisnikId) : undefined;
    return await this.dogadjajiService.findForCalendar(sId, kId);
  }

 // Vraća detalje o konkretnom događaju po ID-u.
  @UseGuards(JwtAuthGuard)
  @Get('view/:id')
  async getDogadjajById(@Param('id', ParseIntPipe) id: number) {
    const d = await this.dogadjajiService.findById(id);
    if (!d) throw new NotFoundException('Događaj ne postoji');
    return d;
  }
// Vraća sve događaje u kojima je korisnik učesnik ili organizator.
  @UseGuards(JwtAuthGuard)
  @Get('moji')
  async getMyEvents(@Req() req: Request) {
    const korisnik = req.user as any;
    if (!korisnik?.korisnikId) throw new UnauthorizedException();
    return await this.dogadjajiService.findMyEvents(korisnik.korisnikId);
  }
// Omogućava organizatoru da otkaže sopstveni događaj.
  @UseGuards(JwtAuthGuard)
  @Post('otkazi')
  async otkaziDogadjaj(
    @Body('dogadjajId') dogadjajId: number,
    @Req() req: Request
  ) {
    const korisnik = req.user as any;
    if (!korisnik?.korisnikId) throw new UnauthorizedException();
    return this.dogadjajiService.otkaziDogadjaj(dogadjajId, korisnik.korisnikId);
  }
// Omogućava učesniku da odustane od prijavljenog događaja.
  @UseGuards(JwtAuthGuard)
  @Post('odustani')
  async odustaniOdDogadjaja(
    @Body('dogadjajId') dogadjajId: number,
    @Req() req: Request
  ) {
    const korisnik = req.user as any;
    if (!korisnik?.korisnikId) throw new UnauthorizedException();
    return this.dogadjajiService.odustaniOdDogadjaja(dogadjajId, korisnik.korisnikId);
  }
}
