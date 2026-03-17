import { Module,UnprocessableEntityException } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Korisnik } from './korisnik.entity';
import { KorisnikService } from './korisnik.service';
import { KorisnikController } from './korisnik.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Dogadjaji } from 'src/dogadjaj/dogadjaj.entity';
import { Ocene } from 'src/ocene/ocene.entity';
import { Ucesnicidogadjaja } from 'src/ucesnicidogadjaja/ucesnicidogadjaja.entity';


@Module({
  imports: [
    TypeOrmModule.forFeature([Korisnik, Dogadjaji, Ocene, Ucesnicidogadjaja]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
    })],

  exports: [KorisnikService],
  providers: [KorisnikService],
  controllers: [KorisnikController],
})
export class KorisnikModule { }
