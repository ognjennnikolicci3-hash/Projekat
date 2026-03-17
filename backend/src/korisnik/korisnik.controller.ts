import { BadRequestException, Body, Controller, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Put, Query, Req, UnauthorizedException, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { KorisnikService } from './korisnik.service';
import { CreateKorisnikDto } from './dto/create-korisnik.dto';
import { LoginKorisnikDto } from './dto/login-korisnik.dto';

import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateProfilDto } from './dto/update-profil.dto';

@Controller('korisnici')
export class KorisnikController 
{
  constructor(private readonly korisnikService: KorisnikService) {}

  @Post('registracija')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async registruj(@Body() dto: CreateKorisnikDto) {
    const korisnik = await this.korisnikService.registrujKorisnika(dto);
    return {
      poruka: 'Uspešno registrovan korisnik.',
      korisnikId: korisnik.korisnikId,
    };
  }

  @Post('login')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async login(@Body() dto: LoginKorisnikDto) 
  {
    return this.korisnikService.prijavaKorisnika(dto.email, dto.lozinka);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getKorisniciByDogadjajAndSport(
    @Query('dogadjajId',ParseIntPipe) dogadjajId: number,
    @Query('sportId',ParseIntPipe) sportId: number,
  ) {
    return await this.korisnikService.findByDogadjajAndSport(dogadjajId, sportId);
  }
  @UseGuards(JwtAuthGuard)

  @Get(':korisnikId/dogadjaji')
  async getKorisnikDogadjaji(
    @Param('korisnikId', ParseIntPipe) korisnikId: number
  ) {
    return this.korisnikService.findDogadjajiByUser(korisnikId);
  }

 
  @UseGuards(JwtAuthGuard)
@Get(':korisnikId')
async getKorisnik(@Param('korisnikId') korisnikId: number) {
  return this.korisnikService.findOne(korisnikId);
}

   @UseGuards(JwtAuthGuard)
  @Get('search')
  async searchUsers(
    @Query('q') q?: string,
    @Query('sportId', ParseIntPipe) sportId?: number,
  ) {
    if (!q || q.trim().length === 0) {
      // po potrebi možeš vratiti [] umesto greške
      throw new BadRequestException('Query param "q" je obavezan i ne sme biti prazan.');
    }
    const results = await this.korisnikService.searchUsersByName(q, sportId);
    return results;
  }
   @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@Req() req: any) {
    const korisnikId = req.user?.korisnikId;
    if (!korisnikId) return null;
    return this.korisnikService.findOne(korisnikId);
  }
 @UseGuards(JwtAuthGuard)
  @Put('me')
  async updateMe(@Req() req: any, @Body() dto: UpdateProfilDto) {
    const korisnikId = req.user?.korisnikId;
    if (!korisnikId) throw new UnauthorizedException('Niste ulogovani.');
    const updated = await this.korisnikService.updateProfile(korisnikId, dto);
    // vrati korisnika bez lozinke
    return updated;
  }
  // Omogućava trenutno ulogovanom korisniku da promeni svoju lozinku.
 @UseGuards(JwtAuthGuard)
  @Put('me/password')
  async changePassword(@Req() req: any, @Body() dto: ChangePasswordDto) {
    const korisnikId = req.user?.korisnikId;
    if (!korisnikId) throw new UnauthorizedException('Niste ulogovani.');
    return this.korisnikService.changePassword(korisnikId, dto);
  }
}