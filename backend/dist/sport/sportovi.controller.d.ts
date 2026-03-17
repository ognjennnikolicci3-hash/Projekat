import { SportoviService } from './sportovi.service';
export declare class SportoviController {
    private readonly sportoviService;
    constructor(sportoviService: SportoviService);
    getAllSportovi(): Promise<import("./sport.entity").Sportovi[]>;
}
