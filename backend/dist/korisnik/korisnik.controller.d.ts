import { KorisnikService } from './korisnik.service';
import { CreateKorisnikDto } from './dto/create-korisnik.dto';
import { LoginKorisnikDto } from './dto/login-korisnik.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateProfilDto } from './dto/update-profil.dto';
export declare class KorisnikController {
    private readonly korisnikService;
    constructor(korisnikService: KorisnikService);
    registruj(dto: CreateKorisnikDto): Promise<{
        poruka: string;
        korisnikId: number;
    }>;
    login(dto: LoginKorisnikDto): Promise<{
        poruka: string;
        token: string;
        korisnik: any;
    }>;
    getKorisniciByDogadjajAndSport(dogadjajId: number, sportId: number): Promise<import("./korisnik.entity").Korisnik[]>;
    getKorisnikDogadjaji(korisnikId: number): Promise<any[]>;
    getKorisnik(korisnikId: number): Promise<import("./korisnik.entity").Korisnik>;
    searchUsers(q?: string, sportId?: number): Promise<any[]>;
    me(req: any): Promise<import("./korisnik.entity").Korisnik>;
    updateMe(req: any, dto: UpdateProfilDto): Promise<any>;
    changePassword(req: any, dto: ChangePasswordDto): Promise<{
        poruka: string;
    }>;
}
