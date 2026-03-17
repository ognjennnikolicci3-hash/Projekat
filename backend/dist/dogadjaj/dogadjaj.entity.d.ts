import { Korisnik } from "src/korisnik/korisnik.entity";
import { Ocene } from "src/ocene/ocene.entity";
import { Sportovi } from "src/sport/sport.entity";
import { Tereni } from "src/tereni/tereni.entity";
export declare class Dogadjaji {
    dogadjajId: number;
    sportId: number;
    terenId: number;
    organizatorId: number;
    datumVreme: Date;
    maxIgraca: number;
    opis: string;
    kreirano: Date;
    sport: Sportovi;
    teren: Tereni;
    organizator: Korisnik;
    ocene: Ocene[];
    korisnici: Korisnik[];
}
