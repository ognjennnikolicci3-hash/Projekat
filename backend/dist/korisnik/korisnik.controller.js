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
exports.KorisnikController = void 0;
const common_1 = require("@nestjs/common");
const korisnik_service_1 = require("./korisnik.service");
const create_korisnik_dto_1 = require("./dto/create-korisnik.dto");
const login_korisnik_dto_1 = require("./dto/login-korisnik.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const change_password_dto_1 = require("./dto/change-password.dto");
const update_profil_dto_1 = require("./dto/update-profil.dto");
let KorisnikController = class KorisnikController {
    constructor(korisnikService) {
        this.korisnikService = korisnikService;
    }
    async registruj(dto) {
        const korisnik = await this.korisnikService.registrujKorisnika(dto);
        return {
            poruka: 'Uspešno registrovan korisnik.',
            korisnikId: korisnik.korisnikId,
        };
    }
    async login(dto) {
        return this.korisnikService.prijavaKorisnika(dto.email, dto.lozinka);
    }
    async getKorisniciByDogadjajAndSport(dogadjajId, sportId) {
        return await this.korisnikService.findByDogadjajAndSport(dogadjajId, sportId);
    }
    async getKorisnikDogadjaji(korisnikId) {
        return this.korisnikService.findDogadjajiByUser(korisnikId);
    }
    async getKorisnik(korisnikId) {
        return this.korisnikService.findOne(korisnikId);
    }
    async searchUsers(q, sportId) {
        if (!q || q.trim().length === 0) {
            throw new common_1.BadRequestException('Query param "q" je obavezan i ne sme biti prazan.');
        }
        const results = await this.korisnikService.searchUsersByName(q, sportId);
        return results;
    }
    async me(req) {
        const korisnikId = req.user?.korisnikId;
        if (!korisnikId)
            return null;
        return this.korisnikService.findOne(korisnikId);
    }
    async updateMe(req, dto) {
        const korisnikId = req.user?.korisnikId;
        if (!korisnikId)
            throw new common_1.UnauthorizedException('Niste ulogovani.');
        const updated = await this.korisnikService.updateProfile(korisnikId, dto);
        return updated;
    }
    async changePassword(req, dto) {
        const korisnikId = req.user?.korisnikId;
        if (!korisnikId)
            throw new common_1.UnauthorizedException('Niste ulogovani.');
        return this.korisnikService.changePassword(korisnikId, dto);
    }
};
exports.KorisnikController = KorisnikController;
__decorate([
    (0, common_1.Post)('registracija'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true })),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_korisnik_dto_1.CreateKorisnikDto]),
    __metadata("design:returntype", Promise)
], KorisnikController.prototype, "registruj", null);
__decorate([
    (0, common_1.Post)('login'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true })),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_korisnik_dto_1.LoginKorisnikDto]),
    __metadata("design:returntype", Promise)
], KorisnikController.prototype, "login", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('dogadjajId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('sportId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], KorisnikController.prototype, "getKorisniciByDogadjajAndSport", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)(':korisnikId/dogadjaji'),
    __param(0, (0, common_1.Param)('korisnikId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], KorisnikController.prototype, "getKorisnikDogadjaji", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)(':korisnikId'),
    __param(0, (0, common_1.Param)('korisnikId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], KorisnikController.prototype, "getKorisnik", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('search'),
    __param(0, (0, common_1.Query)('q')),
    __param(1, (0, common_1.Query)('sportId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], KorisnikController.prototype, "searchUsers", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('me'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], KorisnikController.prototype, "me", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Put)('me'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_profil_dto_1.UpdateProfilDto]),
    __metadata("design:returntype", Promise)
], KorisnikController.prototype, "updateMe", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Put)('me/password'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, change_password_dto_1.ChangePasswordDto]),
    __metadata("design:returntype", Promise)
], KorisnikController.prototype, "changePassword", null);
exports.KorisnikController = KorisnikController = __decorate([
    (0, common_1.Controller)('korisnici'),
    __metadata("design:paramtypes", [korisnik_service_1.KorisnikService])
], KorisnikController);
//# sourceMappingURL=korisnik.controller.js.map