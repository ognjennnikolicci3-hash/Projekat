import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ocene } from './ocene.entity';
import { OceneService } from './ocene.service';
import { OceneController } from './ocene.controller';
import { Korisnik } from 'src/korisnik/korisnik.entity';
import { Ucesnicidogadjaja } from 'src/ucesnicidogadjaja/ucesnicidogadjaja.entity';
import { Dogadjaji } from 'src/dogadjaj/dogadjaj.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Ocene, Korisnik, Ucesnicidogadjaja, Dogadjaji])],
  providers: [OceneService],
  controllers: [OceneController],
})
export class OceneModule {}
