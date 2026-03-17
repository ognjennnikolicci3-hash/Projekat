import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ocene } from './ocene.entity';
import { CreateOcenaDto } from 'src/korisnik/dto/create-ocena.dto';
import { Ucesnicidogadjaja } from 'src/ucesnicidogadjaja/ucesnicidogadjaja.entity';
import { Dogadjaji } from 'src/dogadjaj/dogadjaj.entity';


@Injectable()
export class OceneService {
  constructor(
    @InjectRepository(Ocene)
    private readonly oceneRepository: Repository<Ocene>,
    @InjectRepository(Ucesnicidogadjaja)
    private readonly ucesniciRepo: Repository<Ucesnicidogadjaja>,

    @InjectRepository(Dogadjaji)
    private readonly dogadjajiRepo: Repository<Dogadjaji>,
  ) { }

 // Dodaje ocenu za događaj, proverava validnost i pravo korisnika
  async dodajOcenu(dto: CreateOcenaDto, korisnikId: number) {
    if (!dto || typeof dto.dogadjajId !== 'number' || typeof dto.ocena !== 'number') {
      throw new BadRequestException('Neispravan zahtev za ocenu.');
    }
 // Provera da li je ocena između 1 i 5
    if (dto.ocena < 1 || dto.ocena > 5) {
      throw new BadRequestException('Ocena mora biti između 1 i 5.');
    }
// Provera da li događaj postoji
    const dog = await this.dogadjajiRepo.findOne({ where: { dogadjajId: dto.dogadjajId } });
    if (!dog) {
      throw new NotFoundException('Događaj ne postoji.');
    }
// Provera da li događaj već nije završen
    const sada = new Date();
    const datum = new Date(String(dog.datumVreme));
    if (isNaN(datum.getTime())) {
      throw new BadRequestException('Neispravan datum događaja.');
    }
    if (datum > sada) {
      throw new BadRequestException('Još uvek ne možete oceniti događaj koji nije završen.');
    }
// Provera prava korisnika: samo organizator ili učesnici mogu ocenjivati
    const jeOrganizator = dog.organizatorId === korisnikId;
    const jeUcesnik = await this.ucesniciRepo.exists({ where: { dogadjajId: dto.dogadjajId, korisnikId } });

    if (!jeOrganizator && !jeUcesnik) {
      throw new UnauthorizedException('Samo učesnici/organizator mogu oceniti ovaj događaj.');
    }
 // Provera da li je korisnik već ocenio događaj
    const postoji = await this.oceneRepository.exists({
      where: {
        ocenjivacId: korisnikId,
        dogadjajId: dto.dogadjajId,
      },
    });

    if (postoji) {
      throw new BadRequestException('Već ste ocenili ovaj događaj.');
    }
// Kreiranje nove ocene
    const novaOcena = this.oceneRepository.create({
      dogadjajId: dto.dogadjajId,
      ocenjivacId: korisnikId,
      ocena: dto.ocena,
      komentar: dto.komentar ?? null,
      kreirano: new Date(),
    });
// Čuvanje u bazi i vraćanje rezultata
    return await this.oceneRepository.save(novaOcena);
  }
}
