"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SportModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const sport_entity_1 = require("./sport.entity");
const sportovi_service_1 = require("./sportovi.service");
const sportovi_controller_1 = require("./sportovi.controller");
let SportModule = class SportModule {
};
exports.SportModule = SportModule;
exports.SportModule = SportModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([sport_entity_1.Sportovi])],
        exports: [sportovi_service_1.SportoviService],
        controllers: [sportovi_controller_1.SportoviController],
        providers: [sportovi_service_1.SportoviService],
    })
], SportModule);
//# sourceMappingURL=sport.module.js.map