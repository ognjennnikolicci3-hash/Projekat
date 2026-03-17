import { Injectable, ForbiddenException, NotFoundException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { Korisnik } from './korisnik.entity';
import { CreateKorisnikDto } from './dto/create-korisnik.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Dogadjaji } from 'src/dogadjaj/dogadjaj.entity';
import { Ocene } from 'src/ocene/ocene.entity';
import { Ucesnicidogadjaja } from 'src/ucesnicidogadjaja/ucesnicidogadjaja.entity';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateProfilDto } from './dto/update-profil.dto';
@Injectable()
export class KorisnikService 
{
  constructor(
    @InjectRepository(Korisnik)
    private readonly korisnikRepo: Repository<Korisnik>,
     @InjectRepository(Dogadjaji)
    private readonly dogadjajiRepo: Repository<Dogadjaji>,
    @InjectRepository(Ocene)
    private readonly oceneRepo: Repository<Ocene>,
    @InjectRepository(Ucesnicidogadjaja)
    private readonly ucesniciRepo: Repository<Ucesnicidogadjaja>,
    @InjectRepository(Korisnik)
    private readonly korisniciRepo: Repository<Korisnik>,
    private readonly jwtService: JwtService,
  ) {}
// Registruje novog korisnika i vraća korisnički objekat.
  async registrujKorisnika(dto: CreateKorisnikDto): Promise<Korisnik> 
  {
    const postoji = await this.korisnikRepo.findOne({ where: { email: dto.email } });
    if (postoji){
      throw new ForbiddenException('email adresa je zauzeta');
    }

    if (dto.datumrodjenja) {
    const datumRodjenja = new Date(dto.datumrodjenja);
    const danas = new Date();
    if (datumRodjenja > danas) {
      throw new BadRequestException('Datum rođenja ne može biti u budućnosti.');
    }
  }

    const hash = await bcrypt.hash(dto.lozinka, 10);

    const korisnik = this.korisnikRepo.create
    ({
      ...dto,
      lozinka: hash,
      kreirano: new Date(),
    });

    return await this.korisnikRepo.save(korisnik);
  }
// Prijavljuje korisnika i vraća JWT token i korisničke podatke bez lozinke.
  async prijavaKorisnika(email: string, lozinka: string) 
  {
    let korisnik = await this.korisnikRepo.findOne({ where: { email } });

    if (!korisnik) {
      throw new NotFoundException('korisnik ne postoji');
    }

    const validna = await bcrypt.compare(lozinka, korisnik.lozinka);
    if (!validna) {
      throw new UnauthorizedException('pogresna lozinka');
    }

    const payload = 
    {
      korisnikId: korisnik.korisnikId,
    };

    const token = await this.jwtService.signAsync(payload);
    
    let korisnik2 = {...korisnik} as any
    delete korisnik2.lozinka;

    return {
      poruka: 'Uspesno prijavljen',
      token,
      korisnik:korisnik2,
    };
  }
     // Vraća listu korisnika po događaju i sportu.
  async findByDogadjajAndSport(dogadjajId: number, sportId: number): Promise<Korisnik[]> 
  {
    const result = await this.korisnikRepo
      .createQueryBuilder('korisnik')
      .innerJoin('ucesnicidogadjaja', 'ucesce', 'ucesce.korisnikId = korisnik.KorisnikId')
      .innerJoin('dogadjaji', 'dogadjaj', 'dogadjaj.DogadjajId = ucesce.dogadjajId')
      .where('dogadjaj.DogadjajId = :dogadjajId', { dogadjajId })
      .andWhere('dogadjaj.SportID = :sportId', { sportId })
      .getMany();

    return result;
  }
 // Vraća događaje na kojima je korisnik učesnik sa detaljima i prosečnom ocenom.
async findDogadjajiByUser(korisnikId: number) {
  const ucesnici = await this.dogadjajiRepo
    .createQueryBuilder('dog')
    .innerJoin('ucesnicidogadjaja', 'u', 'u.dogadjajId = dog.DogadjajId')
    .leftJoinAndSelect('dog.sport', 'sport')
    .leftJoinAndSelect('dog.teren', 'teren')
    .leftJoinAndSelect('dog.organizator', 'organizator')
    .where('u.korisnikId = :korisnikId', { korisnikId })
    .orderBy('dog.datumVreme', 'ASC')
    .getMany();

  
  const result = [];
  for (const d of ucesnici) {
    const brojUcesnika = await this.ucesniciRepo.count({ where: { dogadjajId: d.dogadjajId } });

    const ocene = await this.oceneRepo.find({ where: { dogadjajId: d.dogadjajId } });
    const suma = ocene.reduce((acc, o) => acc + (o?.ocena ?? 0), 0);
    const prosecnaOcena = ocene.length ? suma / ocene.length : null;

    result.push({
      id: d.dogadjajId,
      naziv: d.opis ?? (d.sport ? `${d.sport.naziv} događaj` : `Događaj ${d.dogadjajId}`),
      opis: d.opis,
      datumVreme: d.datumVreme,
      maxIgraca: d.maxIgraca,
      trenutniBrojUcesnika: brojUcesnika,
      sport: d.sport ? { id: (d.sport as any).sportId, naziv: (d.sport as any).naziv } : null,
      teren: d.teren ? { id: (d.teren as any).terenId, naziv: (d.teren as any).naziv } : null,
      organizator: d.organizator ? { id: (d.organizator as any).korisnikId, ime: (d.organizator as any).ime, prezime: (d.organizator as any).prezime } : null,
      prosecnaOcena,
    });
  }

  return result;
}
  // Vraća korisnika po ID-u sa osnovnim podacima.
async findOne(korisnikId: number) {
  return this.korisniciRepo.findOne({
    where: { korisnikId },
    select: ['korisnikId', 'ime', 'prezime', 'email'], 
  });
}
// Pretražuje korisnike po imenu/prezime i opcionalno filtrira po sportu.
  async searchUsersByName(q: string, sportId?: number): Promise<any[]> {
    const qLower = q.toLowerCase();


    const qb = this.korisnikRepo.createQueryBuilder('k');

    
    qb.where('LOWER(k.Ime) LIKE :q OR LOWER(k.Prezime) LIKE :q OR LOWER(CONCAT(k.Ime, \' \', k.Prezime)) LIKE :q', {
      q: `%${qLower}%`,
    });

    if (sportId) {
    
      qb.innerJoin('dogadjaji', 'd', 'd.OrganizatorId = k.KorisnikId AND d.SportID = :sportId', { sportId });
      
      qb.groupBy('k.KorisnikId');
    }

    qb.select(['k.KorisnikId as korisnikId', 'k.Ime as ime', 'k.Prezime as prezime', 'k.Email as email']);

    const rows = await qb.getRawMany();
   
    return rows.map(r => ({
      korisnikId: Number(r.korisnikId),
      ime: r.ime,
      prezime: r.prezime,
      email: r.email,
    }));
  }
  // Ažurira profil korisnika sa validacijom podataka.
  async updateProfile(korisnikId: number, dto: UpdateProfilDto) {
  const korisnik = await this.korisnikRepo.findOne({ where: { korisnikId } });
  if (!korisnik) throw new NotFoundException('Korisnik nije pronađen.');


  if (dto.email && dto.email !== korisnik.email) {
    const postoji = await this.korisnikRepo.findOne({ where: { email: dto.email } });
    if (postoji) throw new BadRequestException('Email je već u upotrebi.');
  }

 
  if (dto.ime !== undefined) korisnik.ime = dto.ime;
  if (dto.prezime !== undefined) korisnik.prezime = dto.prezime;
  if (dto.email !== undefined) korisnik.email = dto.email;
  if (dto.grad !== undefined) korisnik.grad = dto.grad;
  if (dto.datumrodjenja !== undefined) {
  const datumRodjenja = new Date(dto.datumrodjenja);
  const danas = new Date();
  if (datumRodjenja > danas) {
    throw new BadRequestException('Datum rođenja ne može biti u budućnosti.');
  }
  korisnik.datumrodjenja = datumRodjenja;
}

  await this.korisnikRepo.save(korisnik);

  const kopija: any = { ...korisnik };
  delete kopija.lozinka;
  return kopija;
}
//Promena passworda
async changePassword(korisnikId: number, dto: ChangePasswordDto) {
  const korisnik = await this.korisnikRepo.findOne({ where: { korisnikId } });
  if (!korisnik) throw new NotFoundException('Korisnik nije pronađen.');

  const valid = await bcrypt.compare(dto.oldPassword, korisnik.lozinka);
  if (!valid) throw new UnauthorizedException('Stara lozinka nije tačna.');

  const hash = await bcrypt.hash(dto.newPassword, 10);
  korisnik.lozinka = hash;
  await this.korisnikRepo.save(korisnik);

  return { poruka: 'Lozinka uspešno promenjena.' };
}
}