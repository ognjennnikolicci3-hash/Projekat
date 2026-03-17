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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sportovi = void 0;
require("reflect-metadata");
const dogadjaj_entity_1 = require("../dogadjaj/dogadjaj.entity");
const typeorm_1 = require("typeorm");
let Sportovi = class Sportovi {
};
exports.Sportovi = Sportovi;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: "SportId", type: "int" }),
    __metadata("design:type", Number)
], Sportovi.prototype, "sportId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "Naziv", type: "varchar" }),
    __metadata("design:type", String)
], Sportovi.prototype, "naziv", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => dogadjaj_entity_1.Dogadjaji, d => d.sport),
    __metadata("design:type", Array)
], Sportovi.prototype, "dogadjaji", void 0);
exports.Sportovi = Sportovi = __decorate([
    (0, typeorm_1.Entity)("sportovi")
], Sportovi);
//# sourceMappingURL=sport.entity.js.map