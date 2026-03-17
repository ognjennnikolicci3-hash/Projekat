import { Injectable, UnauthorizedException, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Dogadjaji } from './dogadjaj.entity';
import { DataSource, In, Repository } from 'typeorm';
import { Ucesnicidogadjaja } from 'src/ucesnicidogadjaja/ucesnicidogadjaja.entity';
import { Ocene } from 'src/ocene/ocene.entity';
import { Korisnik } from 'src/korisnik/korisnik.entity';

@Injectable()
export class DogadjajiService {
  constructor(
    @InjectRepository(Dogadjaji)
    private readonly dogadjajiRepository: Repository<Dogadjaji>,

    @InjectRepository(Ucesnicidogadjaja)
    private readonly ucesniciRepo: Repository<Ucesnicidogadjaja>,

    @InjectRepository(Ocene)
    private readonly oceneRepo: Repository<Ocene>,

    @InjectRepository(Korisnik)
    private readonly korisnikRepo: Repository<Korisnik>,

    private readonly dataSource: DataSource,
  ) { }
// Vraća sve događaje za dati sport i dodaje prosečnu ocenu i broj učesnika.
  async findBySportId(sportId: number): Promise<Dogadjaji[]> {
  const dogadjaji = await this.dogadjajiRepository.find({
    where: { sport: { sportId } },
    relations: ['ocene', 'sport', 'teren', 'organizator'],
    order: { datumVreme: 'ASC' },
  });

  // broj učesnika
  for (const d of dogadjaji) {
    const brojUcesnika = await this.ucesniciRepo.count({ where: { dogadjajId: d.dogadjajId } });
    (d as any).trenutniBrojUcesnika = brojUcesnika;
  }

  return dogadjaji.map(d => {
    const ocene = (d as any).ocene || [];
    const suma = ocene.reduce((acc, o) => acc + (o?.ocena ?? 0), 0);
    const prosecnaOcena = ocene.length ? suma / ocene.length : null;

    return {
      ...d,
      sportNaziv: d.sport ? d.sport.naziv : null,
      terenNaziv: d.teren ? d.teren.naziv : null,
      organizatorIme: d.organizator ? `${d.organizator.ime} ${d.organizator.prezime}` : null,
      prosecnaOcena,
      trenutniBrojUcesnika: (d as any).trenutniBrojUcesnika,
    };
  });
}

// Pridružuje korisnika događaju uz sve potrebne provere.
  async pridruziSe(dogadjajId: number, sportId: number, korisnikId: number) {
  // Proveri da li događaj postoji
  const dogadjaj = await this.dogadjajiRepository.findOne({ where: { dogadjajId } });
  if (!dogadjaj) {
    throw new NotFoundException('Događaj ne postoji.');
  }

  const sada = new Date();
  const datum = new Date(dogadjaj.datumVreme);
  if (isNaN(datum.getTime())) {
    throw new BadRequestException('Neispravan datum događaja.');
  }

  // Provera 1: događaj je u budućnosti
  if (datum <= sada) {
    throw new BadRequestException('Ne možete se pridružiti događaju koji je već počeo ili završen.');
  }

  // Provera 2: broj učesnika < maxIgraca
  const brojUcesnika = await this.ucesniciRepo.count({ where: { dogadjajId } });
  if (brojUcesnika >= dogadjaj.maxIgraca) {
    throw new BadRequestException('Događaj je već popunjen.');
  }

  // Proveri da li je korisnik već pridružen
  const postoji = await this.ucesniciRepo.findOne({
  where: { dogadjajId, korisnikId }
});
if (postoji) {
  throw new BadRequestException('Već ste pridruženi ovom događaju.');
}

  // Kreiranje i čuvanje učesnika
  const ucesnik = this.ucesniciRepo.create({
    dogadjajId,
    korisnikId,
    sportId,
    pridruzen: new Date()
  });

  await this.ucesniciRepo.save(ucesnik);
  return { poruka: 'Uspešno ste se pridružili događaju.' };
}

// Kreira novi događaj sa validacijom datuma i čuva ga u bazi.
  async kreirajDogadjaj(dto: {
    sportId: number;
    terenId: number;
    datumVreme: string;
    maxIgraca: number;
    opis?: string;
    organizatorId: number;
  }) {
    // validacija: datum ne sme biti u prošlosti
    const datum = new Date(dto.datumVreme);
    if (isNaN(datum.getTime())) {
      throw new BadRequestException('Neispravan format datuma.');
    }

    const sada = new Date();
    if (datum < sada) {
      throw new BadRequestException('Datum i vreme događaja ne mogu biti u prošlosti.');
    }

    const dogadjaj = this.dogadjajiRepository.create({
      sportId: dto.sportId,
      terenId: dto.terenId,
      datumVreme: dto.datumVreme,
      maxIgraca: dto.maxIgraca,
      opis: dto.opis,
      organizatorId: dto.organizatorId,
      kreirano: new Date(),
    });

    return await this.dogadjajiRepository.save(dogadjaj);
  }
 // Vraća događaje za kalendar filtrirane po sportu i/ili korisniku.
  async findForCalendar(sportId?: number, korisnikId?: number) {
    if (korisnikId) {
      const qb = this.dogadjajiRepository
        .createQueryBuilder('d')
        .innerJoin('ucesnicidogadjaja', 'u', 'u.DogadjajId = d.DogadjajId')
        .where('u.korisnikId = :korisnikId', { korisnikId });

      if (sportId) qb.andWhere('d.SportID = :sportId', { sportId });

      const dogadjaji = await qb.getMany();
      return dogadjaji.map(d => ({
        id: d.dogadjajId,
        title: d.opis ?? `Događaj ${d.dogadjajId}`,
        start: d.datumVreme,
        end: undefined,
        description: d.opis,
        organizer: d.organizatorId,
        maxIgraca: d.maxIgraca,
        sportId: d.sportId ?? d.sport?.sportId,
        terenId: d.terenId ?? d.teren?.terenId,
      }));
    } else {
      const where: any = {};
      if (sportId) where.sportId = sportId;

      const dogadjaji = await this.dogadjajiRepository.find({
        where,
        relations: ['sport', 'teren', 'organizator'],
        order: { datumVreme: 'ASC' },
      });

      return dogadjaji.map(d => ({
        id: d.dogadjajId,
        title: d.opis ?? `Događaj ${d.dogadjajId}`,
        start: d.datumVreme,
        end: undefined,
        description: d.opis,
        organizer: d.organizator ? `${(d.organizator as any).ime} ${(d.organizator as any).prezime}` : d.organizatorId,
        maxIgraca: d.maxIgraca,
        sportId: d.sport ? (d.sport as any).sportId : d.sportId,
        terenId: d.teren ? (d.teren as any).terenId : d.terenId,
      }));
    }
  }
 // Vraća detalje događaja po ID-u sa prosečnom ocenom i listom ocena.
  async findById(dogadjajId: number) {
    const d = await this.dogadjajiRepository.findOne({
      where: { dogadjajId },
      relations: ['sport', 'teren', 'organizator', 'ocene'],
    });

    if (!d) return null;

    const ocene = (d as any).ocene || [];
    const suma = ocene.reduce((acc, o) => acc + (o?.ocena ?? 0), 0);
    const prosecnaOcena = ocene.length ? suma / ocene.length : null;

    return {
      id: d.dogadjajId,
      naziv: d.opis ?? (d.sport ? `${d.sport.naziv} događaj` : `Događaj ${d.dogadjajId}`),
      opis: d.opis,
      datumVreme: d.datumVreme,
      maxIgraca: d.maxIgraca,
      organizator: d.organizator ? { id: (d.organizator as any).korisnikId, ime: (d.organizator as any).ime, prezime: (d.organizator as any).prezime } : null,
      sport: d.sport ? { id: (d.sport as any).sportId, naziv: (d.sport as any).naziv } : null,
      teren: d.teren ? { id: (d.teren as any).terenId, naziv: (d.teren as any).naziv } : null,
      prosecnaOcena,
      ocene: ocene.map(o => ({ id: (o as any).ocenaId ?? null, korisnikId: (o as any).ocenjivacId, ocena: (o as any).ocena })),
    };
  }
// Vraća sve događaje koje je korisnik organizovao.
  async findByOrganizator(korisnikId: number): Promise<any[]> {
    const dogadjaji = await this.dogadjajiRepository.find({
      where: { organizatorId: korisnikId },
      relations: ['sport', 'teren', 'organizator', 'ocene'],
      order: { datumVreme: 'ASC' },
    });

    return dogadjaji.map(d => {
      const ocene = (d as any).ocene || [];
      const suma = ocene.reduce((acc, o) => acc + (o?.ocena ?? 0), 0);
      const prosecnaOcena = ocene.length ? suma / ocene.length : null;

      return {
        id: d.dogadjajId,
        title: d.opis ?? (d.sport ? `${d.sport.naziv} događaj` : `Događaj ${d.dogadjajId}`),
        start: d.datumVreme,
        end: undefined,
        description: d.opis,
        organizer: d.organizator ? `${(d.organizator as any).ime} ${(d.organizator as any).prezime}` : null,
        maxIgraca: d.maxIgraca,
        sportId: d.sport ? (d.sport as any).sportId : d.sportId,
        sportNaziv: d.sport ? (d.sport as any).naziv : null,
        terenId: d.teren ? (d.teren as any).terenId : d.terenId,
        terenNaziv: d.teren ? (d.teren as any).naziv : null,
        prosecnaOcena,
      };
    });
  }
// Vraća sve događaje u kojima je korisnik učesnik.
  async findJoinedByUser(korisnikId: number): Promise<any[]> {
    const ucesnici = await this.ucesniciRepo.find({
      where: { korisnikId },
    });

    if (!ucesnici || ucesnici.length === 0) return [];

    const dogadjajIds = Array.from(new Set(ucesnici.map(u => u.dogadjajId)));

    const dogadjaji = await this.dogadjajiRepository.find({
      where: { dogadjajId: In(dogadjajIds) },
      relations: ['sport', 'teren', 'organizator', 'ocene'],
      order: { datumVreme: 'ASC' },
    });

    return dogadjaji.map(d => {
      const ocene = (d as any).ocene || [];
      const suma = ocene.reduce((acc, o) => acc + (o?.ocena ?? 0), 0);
      const prosecnaOcena = ocene.length ? suma / ocene.length : null;

      return {
        id: d.dogadjajId,
        title: d.opis ?? (d.sport ? `${d.sport.naziv} događaj` : `Događaj ${d.dogadjajId}`),
        start: d.datumVreme,
        end: undefined,
        description: d.opis,
        organizer: d.organizator ? `${(d.organizator as any).ime} ${(d.organizator as any).prezime}` : null,
        maxIgraca: d.maxIgraca,
        sportId: d.sport ? (d.sport as any).sportId : d.sportId,
        sportNaziv: d.sport ? (d.sport as any).naziv : null,
        terenId: d.teren ? (d.teren as any).terenId : d.terenId,
        terenNaziv: d.teren ? (d.teren as any).naziv : null,
        prosecnaOcena,
      };
    });
  }
// Vraća sve događaje povezane sa korisnikom (organizovani i pridruženi).
  async findMyEvents(korisnikId: number) {
    const organizovani = await this.findByOrganizator(korisnikId);
    const pridruzeni = await this.findJoinedByUser(korisnikId);
    return { organizovani, pridruzeni };
  }

  // Otkazuje događaj i briše sve povezane učesnike i ocene u transakciji.
  async otkaziDogadjaj(dogadjajId: number, korisnikId: number) {
    const dogadjaj = await this.dogadjajiRepository.findOne({ where: { dogadjajId } });
    if (!dogadjaj) throw new NotFoundException('Događaj ne postoji.');
    if (dogadjaj.organizatorId !== korisnikId) throw new UnauthorizedException('Niste organizator događaja.');

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // brišemo ocene koje referenciraju ovaj dogadjaj
      await queryRunner.manager.delete(Ocene, { dogadjajId });

      // brišemo ucesnike
      await queryRunner.manager.delete(Ucesnicidogadjaja, { dogadjajId });

      // obriši dogadjaj
      await queryRunner.manager.delete(Dogadjaji, { dogadjajId });

      await queryRunner.commitTransaction();
      return { poruka: 'Događaj je otkazan.' };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      console.error('Greška pri otkazivanju dogadjaja:', err);
      throw new InternalServerErrorException('Greška pri otkazivanju događaja.');
    } finally {
      await queryRunner.release();
    }
  }
// Omogućava korisniku da odustane od događaja u kojem je učesnik.
  async odustaniOdDogadjaja(dogadjajId: number, korisnikId: number) {
    const ucesnik = await this.ucesniciRepo.findOne({ where: { dogadjajId, korisnikId } });
    if (!ucesnik) throw new NotFoundException('Niste učesnik ovog događaja.');

    await this.ucesniciRepo.delete({ dogadjajId, korisnikId });
    return { poruka: 'Uspešno ste napustili događaj.' };
  }
}
