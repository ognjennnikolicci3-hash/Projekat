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
exports.Dogadjaji = void 0;
const korisnik_entity_1 = require("../korisnik/korisnik.entity");
const ocene_entity_1 = require("../ocene/ocene.entity");
const sport_entity_1 = require("../sport/sport.entity");
const tereni_entity_1 = require("../tereni/tereni.entity");
const typeorm_1 = require("typeorm");
let Dogadjaji = class Dogadjaji {
};
exports.Dogadjaji = Dogadjaji;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: "DogadjajId", type: "int" }),
    __metadata("design:type", Number)
], Dogadjaji.prototype, "dogadjajId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "SportID", type: "int" }),
    __metadata("design:type", Number)
], Dogadjaji.prototype, "sportId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "TerenId", type: "int" }),
    __metadata("design:type", Number)
], Dogadjaji.prototype, "terenId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "OrganizatorId", type: "int" }),
    __metadata("design:type", Number)
], Dogadjaji.prototype, "organizatorId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "DatumVreme", type: "datetime" }),
    __metadata("design:type", Date)
], Dogadjaji.prototype, "datumVreme", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "MaxIgraca", type: "int" }),
    __metadata("design:type", Number)
], Dogadjaji.prototype, "maxIgraca", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "Opis", type: "varchar" }),
    __metadata("design:type", String)
], Dogadjaji.prototype, "opis", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "Kreirano", type: "datetime" }),
    __metadata("design:type", Date)
], Dogadjaji.prototype, "kreirano", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => sport_entity_1.Sportovi, s => s.dogadjaji, { eager: false }),
    (0, typeorm_1.JoinColumn)({ name: "SportID" }),
    __metadata("design:type", sport_entity_1.Sportovi)
], Dogadjaji.prototype, "sport", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => tereni_entity_1.Tereni, t => t.dogadjaji, { eager: false }),
    (0, typeorm_1.JoinColumn)({ name: "TerenId" }),
    __metadata("design:type", tereni_entity_1.Tereni)
], Dogadjaji.prototype, "teren", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => korisnik_entity_1.Korisnik, k => k.organizovaniDogadjaji, { eager: false }),
    (0, typeorm_1.JoinColumn)({ name: "OrganizatorId" }),
    __metadata("design:type", korisnik_entity_1.Korisnik)
], Dogadjaji.prototype, "organizator", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => ocene_entity_1.Ocene, x => x.dogadjaj),
    __metadata("design:type", Array)
], Dogadjaji.prototype, "ocene", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => korisnik_entity_1.Korisnik, x => x.dogadjaji),
    __metadata("design:type", Array)
], Dogadjaji.prototype, "korisnici", void 0);
exports.Dogadjaji = Dogadjaji = __decorate([
    (0, typeorm_1.Entity)("dogadjaji")
], Dogadjaji);
//# sourceMappingURL=dogadjaj.entity.js.map