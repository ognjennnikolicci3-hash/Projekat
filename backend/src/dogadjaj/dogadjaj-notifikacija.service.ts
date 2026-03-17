import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, In } from 'typeorm';
import { Dogadjaji } from 'src/dogadjaj/dogadjaj.entity';
import { Korisnik } from 'src/korisnik/korisnik.entity';
import { Ucesnicidogadjaja } from 'src/ucesnicidogadjaja/ucesnicidogadjaja.entity';
import * as nodemailer from 'nodemailer';

@Injectable()
export class DogadjajNotifikacijaService {
  private readonly logger = new Logger(DogadjajNotifikacijaService.name);

  constructor(
    @InjectRepository(Dogadjaji)
    private dogadjajiRepo: Repository<Dogadjaji>,
    @InjectRepository(Korisnik)
    private korisnikRepo: Repository<Korisnik>,
    @InjectRepository(Ucesnicidogadjaja)
    private ucesniciRepo: Repository<Ucesnicidogadjaja>,
  ) {}

  // Proverava događaje koji su sutra i šalje učesnicima e-mail podsetnik.
  @Cron('42 13 * * *')
  async posaljiObavestenja() {
    this.logger.log('Pokrećem proveru događaja za sutra...');

    const sutra = new Date();
    sutra.setDate(sutra.getDate() + 1);
    sutra.setHours(0, 0, 0, 0);

    const krajSutra = new Date(sutra);
    krajSutra.setHours(23, 59, 59, 999);

    const dogadjajiSutra = await this.dogadjajiRepo.find({
      where: { datumVreme: Between(sutra, krajSutra) },
    });

    if (dogadjajiSutra.length === 0) {
      this.logger.log('Nema događaja za sutra.');
      return;
    }

    for (const dogadjaj of dogadjajiSutra) {
      const ucesnici = await this.ucesniciRepo.find({
        where: { dogadjajId: dogadjaj.dogadjajId },
      });

      if (ucesnici.length === 0) continue;

      const korisnici = await this.korisnikRepo.find({
        where: { korisnikId: In(ucesnici.map(u => u.korisnikId)) },
      });

      for (const korisnik of korisnici) {
        await this.posaljiEmail(
          korisnik.email,
          'Podsetnik: Događaj sutra',
          `Zdravo ${korisnik.ime},\n\nPodsećamo te da sutra imaš događaj "${dogadjaj.opis}" zakazan za ${dogadjaj.datumVreme}.\n\nVidimo se!`
        );
      }
    }

    this.logger.log('Obaveštenja poslata.');
  }
// Šalje e-mail poruku pomoću Nodemailer servisa.
  private async posaljiEmail(to: string, subject: string, text: string) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"TandemZnanje" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
    });
  }
}