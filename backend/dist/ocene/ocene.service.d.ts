import { Repository } from 'typeorm';
import { Ocene } from './ocene.entity';
import { CreateOcenaDto } from 'src/korisnik/dto/create-ocena.dto';
import { Ucesnicidogadjaja } from 'src/ucesnicidogadjaja/ucesnicidogadjaja.entity';
import { Dogadjaji } from 'src/dogadjaj/dogadjaj.entity';
export declare class OceneService {
    private readonly oceneRepository;
    private readonly ucesniciRepo;
    private readonly dogadjajiRepo;
    constructor(oceneRepository: Repository<Ocene>, ucesniciRepo: Repository<Ucesnicidogadjaja>, dogadjajiRepo: Repository<Dogadjaji>);
    dodajOcenu(dto: CreateOcenaDto, korisnikId: number): Promise<Ocene>;
}
