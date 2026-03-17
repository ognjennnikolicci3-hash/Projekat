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
exports.DogadjajiController = void 0;
const common_1 = require("@nestjs/common");
const dogadjaji_service_1 = require("./dogadjaji.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const join_dogadjaj_dto_1 = require("../korisnik/dto/join-dogadjaj.dto");
const create_dogadjaj_dto_1 = require("../korisnik/dto/create-dogadjaj.dto");
let DogadjajiController = class DogadjajiController {
    constructor(dogadjajiService) {
        this.dogadjajiService = dogadjajiService;
    }
    async getDogadjajiBySport(sportId) {
        let listaDogadjaja = await this.dogadjajiService.findBySportId(sportId);
        for (let dogadjaj of listaDogadjaja) {
            const ocene = dogadjaj.ocene || [];
            const suma = ocene.reduce((acc, o) => acc + (o?.ocena ?? 0), 0);
            dogadjaj.prosecnaOcena = ocene.length ? suma / ocene.length : null;
        }
        return listaDogadjaja;
    }
    async pridruziSeDogadjaju(dto, req) {
        return this.dogadjajiService.pridruziSe(dto.dogadjajId, dto.sportId, req.user.korisnikId);
    }
    async kreirajDogadjaj(dto, req) {
        const korisnik = req.user;
        if (!korisnik?.korisnikId)
            throw new common_1.UnauthorizedException();
        return await this.dogadjajiService.kreirajDogadjaj({
            ...dto,
            organizatorId: korisnik.korisnikId,
        });
    }
    async getCalendarEvents(sportId, korisnikId) {
        const sId = sportId ? Number(sportId) : undefined;
        const kId = korisnikId ? Number(korisnikId) : undefined;
        return await this.dogadjajiService.findForCalendar(sId, kId);
    }
    async getDogadjajById(id) {
        const d = await this.dogadjajiService.findById(id);
        if (!d)
            throw new common_1.NotFoundException('Događaj ne postoji');
        return d;
    }
    async getMyEvents(req) {
        const korisnik = req.user;
        if (!korisnik?.korisnikId)
            throw new common_1.UnauthorizedException();
        return await this.dogadjajiService.findMyEvents(korisnik.korisnikId);
    }
    async otkaziDogadjaj(dogadjajId, req) {
        const korisnik = req.user;
        if (!korisnik?.korisnikId)
            throw new common_1.UnauthorizedException();
        return this.dogadjajiService.otkaziDogadjaj(dogadjajId, korisnik.korisnikId);
    }
    async odustaniOdDogadjaja(dogadjajId, req) {
        const korisnik = req.user;
        if (!korisnik?.korisnikId)
            throw new common_1.UnauthorizedException();
        return this.dogadjajiService.odustaniOdDogadjaja(dogadjajId, korisnik.korisnikId);
    }
};
exports.DogadjajiController = DogadjajiController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('sportId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], DogadjajiController.prototype, "getDogadjajiBySport", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('pridruzi-se'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [join_dogadjaj_dto_1.JoinDogadjajDto, Object]),
    __metadata("design:returntype", Promise)
], DogadjajiController.prototype, "pridruziSeDogadjaju", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('kreiraj'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_dogadjaj_dto_1.CreateDogadjajDto, Object]),
    __metadata("design:returntype", Promise)
], DogadjajiController.prototype, "kreirajDogadjaj", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('calendar'),
    __param(0, (0, common_1.Query)('sportId')),
    __param(1, (0, common_1.Query)('korisnikId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], DogadjajiController.prototype, "getCalendarEvents", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('view/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], DogadjajiController.prototype, "getDogadjajById", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('moji'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DogadjajiController.prototype, "getMyEvents", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('otkazi'),
    __param(0, (0, common_1.Body)('dogadjajId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], DogadjajiController.prototype, "otkaziDogadjaj", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('odustani'),
    __param(0, (0, common_1.Body)('dogadjajId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], DogadjajiController.prototype, "odustaniOdDogadjaja", null);
exports.DogadjajiController = DogadjajiController = __decorate([
    (0, common_1.Controller)('dogadjaji'),
    __metadata("design:paramtypes", [dogadjaji_service_1.DogadjajiService])
], DogadjajiController);
//# sourceMappingURL=dogadjaji.controller.js.map