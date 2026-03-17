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
exports.Tereni = void 0;
const dogadjaj_entity_1 = require("../dogadjaj/dogadjaj.entity");
const typeorm_1 = require("typeorm");
let Tereni = class Tereni {
};
exports.Tereni = Tereni;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: "TerenId", type: "int" }),
    __metadata("design:type", Number)
], Tereni.prototype, "terenId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "Naziv", type: "varchar" }),
    __metadata("design:type", String)
], Tereni.prototype, "naziv", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "Adresa", type: "varchar" }),
    __metadata("design:type", String)
], Tereni.prototype, "adresa", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "Grad", type: "varchar" }),
    __metadata("design:type", String)
], Tereni.prototype, "grad", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "Kontakt", type: "varchar" }),
    __metadata("design:type", String)
], Tereni.prototype, "kontakt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "Sirina", type: "float" }),
    __metadata("design:type", Number)
], Tereni.prototype, "sirina", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "Duzina", type: "float" }),
    __metadata("design:type", Number)
], Tereni.prototype, "duzina", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => dogadjaj_entity_1.Dogadjaji, d => d.teren),
    __metadata("design:type", Array)
], Tereni.prototype, "dogadjaji", void 0);
exports.Tereni = Tereni = __decorate([
    (0, typeorm_1.Entity)("tereni")
], Tereni);
//# sourceMappingURL=tereni.entity.js.map