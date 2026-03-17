import { Repository } from 'typeorm';
import { Korisnik } from './korisnik.entity';
import { CreateKorisnikDto } from './dto/create-korisnik.dto';
import { JwtService } from '@nestjs/jwt';
import { Dogadjaji } from 'src/dogadjaj/dogadjaj.entity';
import { Ocene } from 'src/ocene/ocene.entity';
import { Ucesnicidogadjaja } from 'src/ucesnicidogadjaja/ucesnicidogadjaja.entity';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateProfilDto } from './dto/update-profil.dto';
export declare class KorisnikService {
    private readonly korisnikRepo;
    private readonly dogadjajiRepo;
    private readonly oceneRepo;
    private readonly ucesniciRepo;
    private readonly korisniciRepo;
    private readonly jwtService;
    constructor(korisnikRepo: Repository<Korisnik>, dogadjajiRepo: Repository<Dogadjaji>, oceneRepo: Repository<Ocene>, ucesniciRepo: Repository<Ucesnicidogadjaja>, korisniciRepo: Repository<Korisnik>, jwtService: JwtService);
    registrujKorisnika(dto: CreateKorisnikDto): Promise<Korisnik>;
    prijavaKorisnika(email: string, lozinka: string): Promise<{
        poruka: string;
        token: string;
        korisnik: any;
    }>;
    findByDogadjajAndSport(dogadjajId: number, sportId: number): Promise<Korisnik[]>;
    findDogadjajiByUser(korisnikId: number): Promise<any[]>;
    findOne(korisnikId: number): Promise<Korisnik>;
    searchUsersByName(q: string, sportId?: number): Promise<any[]>;
    updateProfile(korisnikId: number, dto: UpdateProfilDto): Promise<any>;
    changePassword(korisnikId: number, dto: ChangePasswordDto): Promise<{
        poruka: string;
    }>;
}
