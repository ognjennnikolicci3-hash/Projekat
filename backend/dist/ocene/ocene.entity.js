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
exports.Ocene = void 0;
const dogadjaj_entity_1 = require("../dogadjaj/dogadjaj.entity");
const typeorm_1 = require("typeorm");
let Ocene = class Ocene {
};
exports.Ocene = Ocene;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: "OcenaId", type: "int" }),
    __metadata("design:type", Number)
], Ocene.prototype, "ocenaId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "OcenjivacId", type: "int" }),
    __metadata("design:type", Number)
], Ocene.prototype, "ocenjivacId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "DogadjajId", type: "int" }),
    __metadata("design:type", Number)
], Ocene.prototype, "dogadjajId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "Ocena", type: "int" }),
    __metadata("design:type", Number)
], Ocene.prototype, "ocena", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "Komentar", type: "varchar" }),
    __metadata("design:type", String)
], Ocene.prototype, "komentar", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "Kreirano", type: "datetime" }),
    __metadata("design:type", Date)
], Ocene.prototype, "kreirano", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => dogadjaj_entity_1.Dogadjaji, x => x.ocene),
    (0, typeorm_1.JoinColumn)({ name: "DogadjajId" }),
    __metadata("design:type", dogadjaj_entity_1.Dogadjaji)
], Ocene.prototype, "dogadjaj", void 0);
exports.Ocene = Ocene = __decorate([
    (0, typeorm_1.Entity)("ocene")
], Ocene);
//# sourceMappingURL=ocene.entity.js.map