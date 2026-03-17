import { TereniService } from './tereni.service';
export declare class TereniController {
    private readonly terenService;
    constructor(terenService: TereniService);
    getAllTereni(): Promise<import("./tereni.entity").Tereni[]>;
}
