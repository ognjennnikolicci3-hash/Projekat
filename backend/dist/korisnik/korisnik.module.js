"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KorisnikModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const korisnik_entity_1 = require("./korisnik.entity");
const korisnik_service_1 = require("./korisnik.service");
const korisnik_controller_1 = require("./korisnik.controller");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const dogadjaj_entity_1 = require("../dogadjaj/dogadjaj.entity");
const ocene_entity_1 = require("../ocene/ocene.entity");
const ucesnicidogadjaja_entity_1 = require("../ucesnicidogadjaja/ucesnicidogadjaja.entity");
let KorisnikModule = class KorisnikModule {
};
exports.KorisnikModule = KorisnikModule;
exports.KorisnikModule = KorisnikModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([korisnik_entity_1.Korisnik, dogadjaj_entity_1.Dogadjaji, ocene_entity_1.Ocene, ucesnicidogadjaja_entity_1.Ucesnicidogadjaja]),
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: async (configService) => ({
                    secret: configService.get('JWT_SECRET'),
                    signOptions: { expiresIn: '1d' },
                }),
            })
        ],
        exports: [korisnik_service_1.KorisnikService],
        providers: [korisnik_service_1.KorisnikService],
        controllers: [korisnik_controller_1.KorisnikController],
    })
], KorisnikModule);
//# sourceMappingURL=korisnik.module.js.map