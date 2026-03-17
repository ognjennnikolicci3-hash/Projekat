import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dogadjaji } from './dogadjaj.entity';
import { DogadjajiService } from './dogadjaji.service';
import { DogadjajiController } from './dogadjaji.controller';
import { Ucesnicidogadjaja } from 'src/ucesnicidogadjaja/ucesnicidogadjaja.entity';
import { Korisnik } from 'src/korisnik/korisnik.entity';
import { Ocene } from 'src/ocene/ocene.entity';
import { DogadjajNotifikacijaService } from './dogadjaj-notifikacija.service';

@Module({
  imports: [TypeOrmModule.forFeature([Dogadjaji, Ucesnicidogadjaja, Korisnik, Ocene])],
  controllers: [DogadjajiController],
  providers: [DogadjajiService,DogadjajNotifikacijaService],
  exports: [DogadjajiService],
})
export class DogadjajiModule {}