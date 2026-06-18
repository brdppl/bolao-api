import { MatchesService } from './matches.service';
import { MatchPhase } from './match.schema';
export declare class MatchesController {
    private matchesService;
    constructor(matchesService: MatchesService);
    findAll(): Promise<import("./match.schema").MatchDocument[]>;
    findLastResult(): Promise<import("./match.schema").MatchDocument | null>;
    findLive(): Promise<import("./match.schema").MatchDocument[]>;
    findUpcoming(): Promise<import("./match.schema").MatchDocument[]>;
    findByPhase(phase: MatchPhase): Promise<import("./match.schema").MatchDocument[]>;
    findOne(id: string): Promise<import("./match.schema").MatchDocument | null>;
}
