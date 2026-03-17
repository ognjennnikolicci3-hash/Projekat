import { Sportovi } from './sport.entity';
import { Repository } from 'typeorm';
export declare class SportoviService {
    private readonly sportoviRepository;
    constructor(sportoviRepository: Repository<Sportovi>);
    findAll(): Promise<Sportovi[]>;
}
