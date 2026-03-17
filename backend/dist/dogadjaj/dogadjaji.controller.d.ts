import { DogadjajiService } from './dogadjaji.service';
import { JoinDogadjajDto } from 'src/korisnik/dto/join-dogadjaj.dto';
import { Request } from 'express';
import { CreateDogadjajDto } from 'src/korisnik/dto/create-dogadjaj.dto';
export declare class DogadjajiController {
    private readonly dogadjajiService;
    constructor(dogadjajiService: DogadjajiService);
    getDogadjajiBySport(sportId: number): Promise<import("./dogadjaj.entity").Dogadjaji[]>;
    pridruziSeDogadjaju(dto: JoinDogadjajDto, req: Request): Promise<{
        poruka: string;
    }>;
    kreirajDogadjaj(dto: CreateDogadjajDto, req: Request): Promise<import("./dogadjaj.entity").Dogadjaji>;
    getCalendarEvents(sportId?: string, korisnikId?: string): Promise<{
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
    getDogadjajById(id: number): Promise<{
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
    getMyEvents(req: Request): Promise<{
        organizovani: any[];
        pridruzeni: any[];
    }>;
    otkaziDogadjaj(dogadjajId: number, req: Request): Promise<{
        poruka: string;
    }>;
    odustaniOdDogadjaja(dogadjajId: number, req: Request): Promise<{
        poruka: string;
    }>;
}
