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
exports.Korisnik = void 0;
const dogadjaj_entity_1 = require("../dogadjaj/dogadjaj.entity");
const typeorm_1 = require("typeorm");
let Korisnik = class Korisnik {
};
exports.Korisnik = Korisnik;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: "KorisnikId", type: "int" }),
    __metadata("design:type", Number)
], Korisnik.prototype, "korisnikId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "Ime", type: "varchar" }),
    __metadata("design:type", String)
], Korisnik.prototype, "ime", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "Prezime", type: "varchar" }),
    __metadata("design:type", String)
], Korisnik.prototype, "prezime", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "Email", type: "varchar" }),
    __metadata("design:type", String)
], Korisnik.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "Lozinka", type: "varchar" }),
    __metadata("design:type", String)
], Korisnik.prototype, "lozinka", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "Grad", type: "varchar" }),
    __metadata("design:type", String)
], Korisnik.prototype, "grad", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "DatumRodjenja", type: "date" }),
    __metadata("design:type", Date)
], Korisnik.prototype, "datumrodjenja", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "Kreirano", type: "datetime" }),
    __metadata("design:type", Date)
], Korisnik.prototype, "kreirano", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => dogadjaj_entity_1.Dogadjaji, x => x.korisnici),
    (0, typeorm_1.JoinTable)(),
    __metadata("design:type", Array)
], Korisnik.prototype, "dogadjaji", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => dogadjaj_entity_1.Dogadjaji, d => d.organizator),
    __metadata("design:type", Array)
], Korisnik.prototype, "organizovaniDogadjaji", void 0);
exports.Korisnik = Korisnik = __decorate([
    (0, typeorm_1.Entity)({ name: "korisnici" })
], Korisnik);
//# sourceMappingURL=korisnik.entity.js.map