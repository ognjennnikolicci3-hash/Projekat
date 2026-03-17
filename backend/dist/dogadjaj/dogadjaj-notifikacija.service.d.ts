import { Repository } from 'typeorm';
import { Dogadjaji } from 'src/dogadjaj/dogadjaj.entity';
import { Korisnik } from 'src/korisnik/korisnik.entity';
import { Ucesnicidogadjaja } from 'src/ucesnicidogadjaja/ucesnicidogadjaja.entity';
export declare class DogadjajNotifikacijaService {
    private dogadjajiRepo;
    private korisnikRepo;
    private ucesniciRepo;
    private readonly logger;
    constructor(dogadjajiRepo: Repository<Dogadjaji>, korisnikRepo: Repository<Korisnik>, ucesniciRepo: Repository<Ucesnicidogadjaja>);
    posaljiObavestenja(): Promise<void>;
    private posaljiEmail;
}
