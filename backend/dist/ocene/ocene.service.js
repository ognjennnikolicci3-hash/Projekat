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
exports.OceneService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const ocene_entity_1 = require("./ocene.entity");
const ucesnicidogadjaja_entity_1 = require("../ucesnicidogadjaja/ucesnicidogadjaja.entity");
const dogadjaj_entity_1 = require("../dogadjaj/dogadjaj.entity");
let OceneService = class OceneService {
    constructor(oceneRepository, ucesniciRepo, dogadjajiRepo) {
        this.oceneRepository = oceneRepository;
        this.ucesniciRepo = ucesniciRepo;
        this.dogadjajiRepo = dogadjajiRepo;
    }
    async dodajOcenu(dto, korisnikId) {
        if (!dto || typeof dto.dogadjajId !== 'number' || typeof dto.ocena !== 'number') {
            throw new common_1.BadRequestException('Neispravan zahtev za ocenu.');
        }
        if (dto.ocena < 1 || dto.ocena > 5) {
            throw new common_1.BadRequestException('Ocena mora biti između 1 i 5.');
        }
        const dog = await this.dogadjajiRepo.findOne({ where: { dogadjajId: dto.dogadjajId } });
        if (!dog) {
            throw new common_1.NotFoundException('Događaj ne postoji.');
        }
        const sada = new Date();
        const datum = new Date(String(dog.datumVreme));
        if (isNaN(datum.getTime())) {
            throw new common_1.BadRequestException('Neispravan datum događaja.');
        }
        if (datum > sada) {
            throw new common_1.BadRequestException('Još uvek ne možete oceniti događaj koji nije završen.');
        }
        const jeOrganizator = dog.organizatorId === korisnikId;
        const jeUcesnik = await this.ucesniciRepo.exists({ where: { dogadjajId: dto.dogadjajId, korisnikId } });
        if (!jeOrganizator && !jeUcesnik) {
            throw new common_1.UnauthorizedException('Samo učesnici/organizator mogu oceniti ovaj događaj.');
        }
        const postoji = await this.oceneRepository.exists({
            where: {
                ocenjivacId: korisnikId,
                dogadjajId: dto.dogadjajId,
            },
        });
        if (postoji) {
            throw new common_1.BadRequestException('Već ste ocenili ovaj događaj.');
        }
        const novaOcena = this.oceneRepository.create({
            dogadjajId: dto.dogadjajId,
            ocenjivacId: korisnikId,
            ocena: dto.ocena,
            komentar: dto.komentar ?? null,
            kreirano: new Date(),
        });
        return await this.oceneRepository.save(novaOcena);
    }
};
exports.OceneService = OceneService;
exports.OceneService = OceneService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(ocene_entity_1.Ocene)),
    __param(1, (0, typeorm_1.InjectRepository)(ucesnicidogadjaja_entity_1.Ucesnicidogadjaja)),
    __param(2, (0, typeorm_1.InjectRepository)(dogadjaj_entity_1.Dogadjaji)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], OceneService);
//# sourceMappingURL=ocene.service.js.map