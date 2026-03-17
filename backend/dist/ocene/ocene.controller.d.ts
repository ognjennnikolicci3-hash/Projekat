import { OceneService } from './ocene.service';
import { CreateOcenaDto } from 'src/korisnik/dto/create-ocena.dto';
import { Request } from 'express';
export declare class OceneController {
    private readonly oceneService;
    constructor(oceneService: OceneService);
    dodajOcenu(dto: CreateOcenaDto, req: Request): Promise<import("./ocene.entity").Ocene>;
}
