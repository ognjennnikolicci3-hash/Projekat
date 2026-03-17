"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OceneModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const ocene_entity_1 = require("./ocene.entity");
const ocene_service_1 = require("./ocene.service");
const ocene_controller_1 = require("./ocene.controller");
const korisnik_entity_1 = require("../korisnik/korisnik.entity");
const ucesnicidogadjaja_entity_1 = require("../ucesnicidogadjaja/ucesnicidogadjaja.entity");
const dogadjaj_entity_1 = require("../dogadjaj/dogadjaj.entity");
let OceneModule = class OceneModule {
};
exports.OceneModule = OceneModule;
exports.OceneModule = OceneModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([ocene_entity_1.Ocene, korisnik_entity_1.Korisnik, ucesnicidogadjaja_entity_1.Ucesnicidogadjaja, dogadjaj_entity_1.Dogadjaji])],
        providers: [ocene_service_1.OceneService],
        controllers: [ocene_controller_1.OceneController],
    })
], OceneModule);
//# sourceMappingURL=ocene.module.js.map