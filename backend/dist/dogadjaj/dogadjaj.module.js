"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DogadjajiModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const dogadjaj_entity_1 = require("./dogadjaj.entity");
const dogadjaji_service_1 = require("./dogadjaji.service");
const dogadjaji_controller_1 = require("./dogadjaji.controller");
const ucesnicidogadjaja_entity_1 = require("../ucesnicidogadjaja/ucesnicidogadjaja.entity");
const korisnik_entity_1 = require("../korisnik/korisnik.entity");
const ocene_entity_1 = require("../ocene/ocene.entity");
const dogadjaj_notifikacija_service_1 = require("./dogadjaj-notifikacija.service");
let DogadjajiModule = class DogadjajiModule {
};
exports.DogadjajiModule = DogadjajiModule;
exports.DogadjajiModule = DogadjajiModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([dogadjaj_entity_1.Dogadjaji, ucesnicidogadjaja_entity_1.Ucesnicidogadjaja, korisnik_entity_1.Korisnik, ocene_entity_1.Ocene])],
        controllers: [dogadjaji_controller_1.DogadjajiController],
        providers: [dogadjaji_service_1.DogadjajiService, dogadjaj_notifikacija_service_1.DogadjajNotifikacijaService],
        exports: [dogadjaji_service_1.DogadjajiService],
    })
], DogadjajiModule);
//# sourceMappingURL=dogadjaj.module.js.map