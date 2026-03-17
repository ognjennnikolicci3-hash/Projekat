import { Dogadjaji } from "src/dogadjaj/dogadjaj.entity";
export declare class Korisnik {
    korisnikId: number;
    ime: string;
    prezime: string;
    email: string;
    lozinka: string;
    grad: string;
    datumrodjenja: Date;
    kreirano: Date;
    dogadjaji: Dogadjaji[];
    organizovaniDogadjaji: Dogadjaji[];
}
