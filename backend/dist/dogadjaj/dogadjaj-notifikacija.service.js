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
var DogadjajNotifikacijaService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DogadjajNotifikacijaService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const dogadjaj_entity_1 = require("./dogadjaj.entity");
const korisnik_entity_1 = require("../korisnik/korisnik.entity");
const ucesnicidogadjaja_entity_1 = require("../ucesnicidogadjaja/ucesnicidogadjaja.entity");
const nodemailer = require("nodemailer");
let DogadjajNotifikacijaService = DogadjajNotifikacijaService_1 = class DogadjajNotifikacijaService {
    constructor(dogadjajiRepo, korisnikRepo, ucesniciRepo) {
        this.dogadjajiRepo = dogadjajiRepo;
        this.korisnikRepo = korisnikRepo;
        this.ucesniciRepo = ucesniciRepo;
        this.logger = new common_1.Logger(DogadjajNotifikacijaService_1.name);
    }
    async posaljiObavestenja() {
        this.logger.log('Pokrećem proveru događaja za sutra...');
        const sutra = new Date();
        sutra.setDate(sutra.getDate() + 1);
        sutra.setHours(0, 0, 0, 0);
        const krajSutra = new Date(sutra);
        krajSutra.setHours(23, 59, 59, 999);
        const dogadjajiSutra = await this.dogadjajiRepo.find({
            where: { datumVreme: (0, typeorm_2.Between)(sutra, krajSutra) },
        });
        if (dogadjajiSutra.length === 0) {
            this.logger.log('Nema događaja za sutra.');
            return;
        }
        for (const dogadjaj of dogadjajiSutra) {
            const ucesnici = await this.ucesniciRepo.find({
                where: { dogadjajId: dogadjaj.dogadjajId },
            });
            if (ucesnici.length === 0)
                continue;
            const korisnici = await this.korisnikRepo.find({
                where: { korisnikId: (0, typeorm_2.In)(ucesnici.map(u => u.korisnikId)) },
            });
            for (const korisnik of korisnici) {
                await this.posaljiEmail(korisnik.email, 'Podsetnik: Događaj sutra', `Zdravo ${korisnik.ime},\n\nPodsećamo te da sutra imaš događaj "${dogadjaj.opis}" zakazan za ${dogadjaj.datumVreme}.\n\nVidimo se!`);
            }
        }
        this.logger.log('Obaveštenja poslata.');
    }
    async posaljiEmail(to, subject, text) {
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
};
exports.DogadjajNotifikacijaService = DogadjajNotifikacijaService;
__decorate([
    (0, schedule_1.Cron)('42 13 * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DogadjajNotifikacijaService.prototype, "posaljiObavestenja", null);
exports.DogadjajNotifikacijaService = DogadjajNotifikacijaService = DogadjajNotifikacijaService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(dogadjaj_entity_1.Dogadjaji)),
    __param(1, (0, typeorm_1.InjectRepository)(korisnik_entity_1.Korisnik)),
    __param(2, (0, typeorm_1.InjectRepository)(ucesnicidogadjaja_entity_1.Ucesnicidogadjaja)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], DogadjajNotifikacijaService);
//# sourceMappingURL=dogadjaj-notifikacija.service.js.map