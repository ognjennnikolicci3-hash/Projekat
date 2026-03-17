import { Dogadjaji } from './dogadjaj.entity';
import { DataSource, Repository } from 'typeorm';
import { Ucesnicidogadjaja } from 'src/ucesnicidogadjaja/ucesnicidogadjaja.entity';
import { Ocene } from 'src/ocene/ocene.entity';
import { Korisnik } from 'src/korisnik/korisnik.entity';
export declare class DogadjajiService {
    private readonly dogadjajiRepository;
    private readonly ucesniciRepo;
    private readonly oceneRepo;
    private readonly korisnikRepo;
    private readonly dataSource;
    constructor(dogadjajiRepository: Repository<Dogadjaji>, ucesniciRepo: Repository<Ucesnicidogadjaja>, oceneRepo: Repository<Ocene>, korisnikRepo: Repository<Korisnik>, dataSource: DataSource);
    findBySportId(sportId: number): Promise<Dogadjaji[]>;
    pridruziSe(dogadjajId: number, sportId: number, korisnikId: number): Promise<{
        poruka: string;
    }>;
    kreirajDogadjaj(dto: {
        sportId: number;
        terenId: number;
        datumVreme: string;
        maxIgraca: number;
        opis?: string;
        organizatorId: number;
    }): Promise<Dogadjaji>;
    findForCalendar(sportId?: number, korisnikId?: number): Promise<{
        id: number;
        title: string;
        start: Date;
        end: any;
        description: string;
        organizer: string | number;
        maxIgraca: number;
        sportId: any;
        terenId: any;
    }[]>;
    findById(dogadjajId: number): Promise<{
        id: number;
        naziv: string;
        opis: string;
        datumVreme: Date;
        maxIgraca: number;
        organizator: {
            id: any;
            ime: any;
            prezime: any;
        };
        sport: {
            id: any;
            naziv: any;
        };
        teren: {
            id: any;
            naziv: any;
        };
        prosecnaOcena: number;
        ocene: any;
    }>;
    findByOrganizator(korisnikId: number): Promise<any[]>;
    findJoinedByUser(korisnikId: number): Promise<any[]>;
    findMyEvents(korisnikId: number): Promise<{
        organizovani: any[];
        pridruzeni: any[];
    }>;
    otkaziDogadjaj(dogadjajId: number, korisnikId: number): Promise<{
        poruka: string;
    }>;
    odustaniOdDogadjaja(dogadjajId: number, korisnikId: number): Promise<{
        poruka: string;
    }>;
}
