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
exports.KorisnikService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const korisnik_entity_1 = require("./korisnik.entity");
const bcrypt = require("bcrypt");
const jwt_1 = require("@nestjs/jwt");
const dogadjaj_entity_1 = require("../dogadjaj/dogadjaj.entity");
const ocene_entity_1 = require("../ocene/ocene.entity");
const ucesnicidogadjaja_entity_1 = require("../ucesnicidogadjaja/ucesnicidogadjaja.entity");
let KorisnikService = class KorisnikService {
    constructor(korisnikRepo, dogadjajiRepo, oceneRepo, ucesniciRepo, korisniciRepo, jwtService) {
        this.korisnikRepo = korisnikRepo;
        this.dogadjajiRepo = dogadjajiRepo;
        this.oceneRepo = oceneRepo;
        this.ucesniciRepo = ucesniciRepo;
        this.korisniciRepo = korisniciRepo;
        this.jwtService = jwtService;
    }
    async registrujKorisnika(dto) {
        const postoji = await this.korisnikRepo.findOne({ where: { email: dto.email } });
        if (postoji) {
            throw new common_1.ForbiddenException('email adresa je zauzeta');
        }
        if (dto.datumrodjenja) {
            const datumRodjenja = new Date(dto.datumrodjenja);
            const danas = new Date();
            if (datumRodjenja > danas) {
                throw new common_1.BadRequestException('Datum rođenja ne može biti u budućnosti.');
            }
        }
        const hash = await bcrypt.hash(dto.lozinka, 10);
        const korisnik = this.korisnikRepo.create({
            ...dto,
            lozinka: hash,
            kreirano: new Date(),
        });
        return await this.korisnikRepo.save(korisnik);
    }
    async prijavaKorisnika(email, lozinka) {
        let korisnik = await this.korisnikRepo.findOne({ where: { email } });
        if (!korisnik) {
            throw new common_1.NotFoundException('korisnik ne postoji');
        }
        const validna = await bcrypt.compare(lozinka, korisnik.lozinka);
        if (!validna) {
            throw new common_1.UnauthorizedException('pogresna lozinka');
        }
        const payload = {
            korisnikId: korisnik.korisnikId,
        };
        const token = await this.jwtService.signAsync(payload);
        let korisnik2 = { ...korisnik };
        delete korisnik2.lozinka;
        return {
            poruka: 'Uspesno prijavljen',
            token,
            korisnik: korisnik2,
        };
    }
    async findByDogadjajAndSport(dogadjajId, sportId) {
        const result = await this.korisnikRepo
            .createQueryBuilder('korisnik')
            .innerJoin('ucesnicidogadjaja', 'ucesce', 'ucesce.korisnikId = korisnik.KorisnikId')
            .innerJoin('dogadjaji', 'dogadjaj', 'dogadjaj.DogadjajId = ucesce.dogadjajId')
            .where('dogadjaj.DogadjajId = :dogadjajId', { dogadjajId })
            .andWhere('dogadjaj.SportID = :sportId', { sportId })
            .getMany();
        return result;
    }
    async findDogadjajiByUser(korisnikId) {
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
                sport: d.sport ? { id: d.sport.sportId, naziv: d.sport.naziv } : null,
                teren: d.teren ? { id: d.teren.terenId, naziv: d.teren.naziv } : null,
                organizator: d.organizator ? { id: d.organizator.korisnikId, ime: d.organizator.ime, prezime: d.organizator.prezime } : null,
                prosecnaOcena,
            });
        }
        return result;
    }
    async findOne(korisnikId) {
        return this.korisniciRepo.findOne({
            where: { korisnikId },
            select: ['korisnikId', 'ime', 'prezime', 'email'],
        });
    }
    async searchUsersByName(q, sportId) {
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
    async updateProfile(korisnikId, dto) {
        const korisnik = await this.korisnikRepo.findOne({ where: { korisnikId } });
        if (!korisnik)
            throw new common_1.NotFoundException('Korisnik nije pronađen.');
        if (dto.email && dto.email !== korisnik.email) {
            const postoji = await this.korisnikRepo.findOne({ where: { email: dto.email } });
            if (postoji)
                throw new common_1.BadRequestException('Email je već u upotrebi.');
        }
        if (dto.ime !== undefined)
            korisnik.ime = dto.ime;
        if (dto.prezime !== undefined)
            korisnik.prezime = dto.prezime;
        if (dto.email !== undefined)
            korisnik.email = dto.email;
        if (dto.grad !== undefined)
            korisnik.grad = dto.grad;
        if (dto.datumrodjenja !== undefined) {
            const datumRodjenja = new Date(dto.datumrodjenja);
            const danas = new Date();
            if (datumRodjenja > danas) {
                throw new common_1.BadRequestException('Datum rođenja ne može biti u budućnosti.');
            }
            korisnik.datumrodjenja = datumRodjenja;
        }
        await this.korisnikRepo.save(korisnik);
        const kopija = { ...korisnik };
        delete kopija.lozinka;
        return kopija;
    }
    async changePassword(korisnikId, dto) {
        const korisnik = await this.korisnikRepo.findOne({ where: { korisnikId } });
        if (!korisnik)
            throw new common_1.NotFoundException('Korisnik nije pronađen.');
        const valid = await bcrypt.compare(dto.oldPassword, korisnik.lozinka);
        if (!valid)
            throw new common_1.UnauthorizedException('Stara lozinka nije tačna.');
        const hash = await bcrypt.hash(dto.newPassword, 10);
        korisnik.lozinka = hash;
        await this.korisnikRepo.save(korisnik);
        return { poruka: 'Lozinka uspešno promenjena.' };
    }
};
exports.KorisnikService = KorisnikService;
exports.KorisnikService = KorisnikService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(korisnik_entity_1.Korisnik)),
    __param(1, (0, typeorm_1.InjectRepository)(dogadjaj_entity_1.Dogadjaji)),
    __param(2, (0, typeorm_1.InjectRepository)(ocene_entity_1.Ocene)),
    __param(3, (0, typeorm_1.InjectRepository)(ucesnicidogadjaja_entity_1.Ucesnicidogadjaja)),
    __param(4, (0, typeorm_1.InjectRepository)(korisnik_entity_1.Korisnik)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        jwt_1.JwtService])
], KorisnikService);
//# sourceMappingURL=korisnik.service.js.map