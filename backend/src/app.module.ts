import "reflect-metadata";
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from "@nestjs/config";
import { KorisnikModule } from './korisnik/korisnik.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { SportModule } from "./sport/sport.module";
import { DogadjajiModule } from "./dogadjaj/dogadjaj.module";
import { Ucesnicidogadjaja } from "./ucesnicidogadjaja/ucesnicidogadjaja.entity";
import { PassportModule } from "@nestjs/passport";
import { JwtStrategy } from "./auth/jwt.strategy";
import { OceneModule } from "./ocene/ocene.module";
import { ScheduleModule } from '@nestjs/schedule';
import { TereniModule } from "./tereni/tereni.module";
@Module({
  imports: [
ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([Ucesnicidogadjaja]),
    JwtModule.register({
      secret: 'tajna',
      signOptions: { expiresIn: '1d' },
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'mysql',
        host: 'localhost',
        port: 3306,
        username: 'root',
        password: 'root',
        database: 'projekat',
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: false,
      })
    }),
    KorisnikModule,
    OceneModule,
    TereniModule,
    PassportModule,
    SportModule,
    DogadjajiModule,
    ConfigModule.forRoot({ isGlobal: true })
  ],
  providers: [AuthGuard,JwtStrategy],
  exports: [JwtModule],

})
export class AppModule { }