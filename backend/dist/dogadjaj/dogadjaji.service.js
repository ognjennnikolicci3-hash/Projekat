"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DogadjajiService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const dogadjaj_entity_1 = require("./dogadjaj.entity");
const typeorm_2 = require("typeorm");
const ucesnicidogadjaja_entity_1 = require("../ucesnicidogadjaja/ucesnicidogadjaja.entity");
const ocene_entity_1 = require("../ocene/ocene.entity");
const korisnik_entity_1 = require("../korisnik/korisnik.entity");
let DogadjajiService = class DogadjajiService {
    constructor(dogadjajiRepository, ucesniciRepo, oceneRepo, korisnikRepo, dataSource) {
        this.dogadjajiRepository = dogadjajiRepository;
        this.ucesniciRepo = ucesniciRepo;
        this.oceneRepo = oceneRepo;
        this.korisnikRepo = korisnikRepo;
        this.dataSource = dataSource;
    }
    async findBySportId(sportId) {
        const dogadjaji = await this.dogadjajiRepository.find({
            where: { sport: { sportId } },
            relations: ['ocene', 'sport', 'teren', 'organizator'],
            order: { datumVreme: 'ASC' },
        });
        for (const d of dogadjaji) {
            const brojUcesnika = await this.ucesniciRepo.count({ where: { dogadjajId: d.dogadjajId } });
            d.trenutniBrojUcesnika = brojUcesnika;
        }
        return dogadjaji.map(d => {
            const ocene = d.ocene || [];
            const suma = ocene.reduce((acc, o) => acc + (o?.ocena ?? 0), 0);
            const prosecnaOcena = ocene.length ? suma / ocene.length : null;
            return {
                ...d,
                sportNaziv: d.sport ? d.sport.naziv : null,
                terenNaziv: d.teren ? d.teren.naziv : null,
                organizatorIme: d.organizator ? `${d.organizator.ime} ${d.organizator.prezime}` : null,
                prosecnaOcena,
                trenutniBrojUcesnika: d.trenutniBrojUcesnika,
            };
        });
    }
    async pridruziSe(dogadjajId, sportId, korisnikId) {
        const dogadjaj = await this.dogadjajiRepository.findOne({ where: { dogadjajId } });
        if (!dogadjaj) {
            throw new common_1.NotFoundException('Događaj ne postoji.');
        }
        const sada = new Date();
        const datum = new Date(dogadjaj.datumVreme);
        if (isNaN(datum.getTime())) {
            throw new common_1.BadRequestException('Neispravan datum događaja.');
        }
        if (datum <= sada) {
            throw new common_1.BadRequestException('Ne možete se pridružiti događaju koji je već počeo ili završen.');
        }
        const brojUcesnika = await this.ucesniciRepo.count({ where: { dogadjajId } });
        if (brojUcesnika >= dogadjaj.maxIgraca) {
            throw new common_1.BadRequestException('Događaj je već popunjen.');
        }
        const postoji = await this.ucesniciRepo.findOne({
            where: { dogadjajId, korisnikId }
        });
        if (postoji) {
            throw new common_1.BadRequestException('Već ste pridruženi ovom događaju.');
        }
        const ucesnik = this.ucesniciRepo.create({
            dogadjajId,
            korisnikId,
            sportId,
            pridruzen: new Date()
        });
        await this.ucesniciRepo.save(ucesnik);
        return { poruka: 'Uspešno ste se pridružili događaju.' };
    }
    async kreirajDogadjaj(dto) {
        const datum = new Date(dto.datumVreme);
        if (isNaN(datum.getTime())) {
            throw new common_1.BadRequestException('Neispravan format datuma.');
        }
        const sada = new Date();
        if (datum < sada) {
            throw new common_1.BadRequestException('Datum i vreme događaja ne mogu biti u prošlosti.');
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
    async findForCalendar(sportId, korisnikId) {
        if (korisnikId) {
            const qb = this.dogadjajiRepository
                .createQueryBuilder('d')
                .innerJoin('ucesnicidogadjaja', 'u', 'u.DogadjajId = d.DogadjajId')
                .where('u.korisnikId = :korisnikId', { korisnikId });
            if (sportId)
                qb.andWhere('d.SportID = :sportId', { sportId });
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
        }
        else {
            const where = {};
            if (sportId)
                where.sportId = sportId;
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
                organizer: d.organizator ? `${d.organizator.ime} ${d.organizator.prezime}` : d.organizatorId,
                maxIgraca: d.maxIgraca,
                sportId: d.sport ? d.sport.sportId : d.sportId,
                terenId: d.teren ? d.teren.terenId : d.terenId,
            }));
        }
    }
    async findById(dogadjajId) {
        const d = await this.dogadjajiRepository.findOne({
            where: { dogadjajId },
            relations: ['sport', 'teren', 'organizator', 'ocene'],
        });
        if (!d)
            return null;
        const ocene = d.ocene || [];
        const suma = ocene.reduce((acc, o) => acc + (o?.ocena ?? 0), 0);
        const prosecnaOcena = ocene.length ? suma / ocene.length : null;
        return {
            id: d.dogadjajId,
            naziv: d.opis ?? (d.sport ? `${d.sport.naziv} događaj` : `Događaj ${d.dogadjajId}`),
            opis: d.opis,
            datumVreme: d.datumVreme,
            maxIgraca: d.maxIgraca,
            organizator: d.organizator ? { id: d.organizator.korisnikId, ime: d.organizator.ime, prezime: d.organizator.prezime } : null,
            sport: d.sport ? { id: d.sport.sportId, naziv: d.sport.naziv } : null,
            teren: d.teren ? { id: d.teren.terenId, naziv: d.teren.naziv } : null,
            prosecnaOcena,
            ocene: ocene.map(o => ({ id: o.ocenaId ?? null, korisnikId: o.ocenjivacId, ocena: o.ocena })),
        };
    }
    async findByOrganizator(korisnikId) {
        const dogadjaji = await this.dogadjajiRepository.find({
            where: { organizatorId: korisnikId },
            relations: ['sport', 'teren', 'organizator', 'ocene'],
            order: { datumVreme: 'ASC' },
        });
        return dogadjaji.map(d => {
            const ocene = d.ocene || [];
            const suma = ocene.reduce((acc, o) => acc + (o?.ocena ?? 0), 0);
            const prosecnaOcena = ocene.length ? suma / ocene.length : null;
            return {
                id: d.dogadjajId,
                title: d.opis ?? (d.sport ? `${d.sport.naziv} događaj` : `Događaj ${d.dogadjajId}`),
                start: d.datumVreme,
                end: undefined,
                description: d.opis,
                organizer: d.organizator ? `${d.organizator.ime} ${d.organizator.prezime}` : null,
                maxIgraca: d.maxIgraca,
                sportId: d.sport ? d.sport.sportId : d.sportId,
                sportNaziv: d.sport ? d.sport.naziv : null,
                terenId: d.teren ? d.teren.terenId : d.terenId,
                terenNaziv: d.teren ? d.teren.naziv : null,
                prosecnaOcena,
            };
        });
    }
    async findJoinedByUser(korisnikId) {
        const ucesnici = await this.ucesniciRepo.find({
            where: { korisnikId },
        });
        if (!ucesnici || ucesnici.length === 0)
            return [];
        const dogadjajIds = Array.from(new Set(ucesnici.map(u => u.dogadjajId)));
        const dogadjaji = await this.dogadjajiRepository.find({
            where: { dogadjajId: (0, typeorm_2.In)(dogadjajIds) },
            relations: ['sport', 'teren', 'organizator', 'ocene'],
            order: { datumVreme: 'ASC' },
        });
        return dogadjaji.map(d => {
            const ocene = d.ocene || [];
            const suma = ocene.reduce((acc, o) => acc + (o?.ocena ?? 0), 0);
            const prosecnaOcena = ocene.length ? suma / ocene.length : null;
            return {
                id: d.dogadjajId,
                title: d.opis ?? (d.sport ? `${d.sport.naziv} događaj` : `Događaj ${d.dogadjajId}`),
                start: d.datumVreme,
                end: undefined,
                description: d.opis,
                organizer: d.organizator ? `${d.organizator.ime} ${d.organizator.prezime}` : null,
                maxIgraca: d.maxIgraca,
                sportId: d.sport ? d.sport.sportId : d.sportId,
                sportNaziv: d.sport ? d.sport.naziv : null,
                terenId: d.teren ? d.teren.terenId : d.terenId,
                terenNaziv: d.teren ? d.teren.naziv : null,
                prosecnaOcena,
            };
        });
    }
    async findMyEvents(korisnikId) {
        const organizovani = await this.findByOrganizator(korisnikId);
        const pridruzeni = await this.findJoinedByUser(korisnikId);
        return { organizovani, pridruzeni };
    }
    async otkaziDogadjaj(dogadjajId, korisnikId) {
        const dogadjaj = await this.dogadjajiRepository.findOne({ where: { dogadjajId } });
        if (!dogadjaj)
            throw new common_1.NotFoundException('Događaj ne postoji.');
        if (dogadjaj.organizatorId !== korisnikId)
            throw new common_1.UnauthorizedException('Niste organizator događaja.');
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            await queryRunner.manager.delete(ocene_entity_1.Ocene, { dogadjajId });
            await queryRunner.manager.delete(ucesnicidogadjaja_entity_1.Ucesnicidogadjaja, { dogadjajId });
            await queryRunner.manager.delete(dogadjaj_entity_1.Dogadjaji, { dogadjajId });
            await queryRunner.commitTransaction();
            return { poruka: 'Događaj je otkazan.' };
        }
        catch (err) {
            await queryRunner.rollbackTransaction();
            console.error('Greška pri otkazivanju dogadjaja:', err);
            throw new common_1.InternalServerErrorException('Greška pri otkazivanju događaja.');
        }
        finally {
            await queryRunner.release();
        }
    }
    async odustaniOdDogadjaja(dogadjajId, korisnikId) {
        const ucesnik = await this.ucesniciRepo.findOne({ where: { dogadjajId, korisnikId } });
        if (!ucesnik)
            throw new common_1.NotFoundException('Niste učesnik ovog događaja.');
        await this.ucesniciRepo.delete({ dogadjajId, korisnikId });
        return { poruka: 'Uspešno ste napustili događaj.' };
    }
};
exports.DogadjajiService = DogadjajiService;
exports.DogadjajiService = DogadjajiService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(dogadjaj_entity_1.Dogadjaji)),
    __param(1, (0, typeorm_1.InjectRepository)(ucesnicidogadjaja_entity_1.Ucesnicidogadjaja)),
    __param(2, (0, typeorm_1.InjectRepository)(ocene_entity_1.Ocene)),
    __param(3, (0, typeorm_1.InjectRepository)(korisnik_entity_1.Korisnik)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.DataSource])
], DogadjajiService);
//# sourceMappingURL=dogadjaji.service.js.map