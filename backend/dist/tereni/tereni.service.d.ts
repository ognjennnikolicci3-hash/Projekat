import { Tereni } from './tereni.entity';
import { Repository } from 'typeorm';
export declare class TereniService {
    private readonly terenRepo;
    constructor(terenRepo: Repository<Tereni>);
    findAll(): Promise<Tereni[]>;
    findById(id: number): Promise<Tereni | null>;
}
