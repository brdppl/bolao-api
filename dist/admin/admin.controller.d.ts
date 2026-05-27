import { MatchesService } from '../matches/matches.service';
import { BetsService } from '../bets/bets.service';
export declare class AdminController {
    private matchesService;
    private betsService;
    constructor(matchesService: MatchesService, betsService: BetsService);
    syncFixtures(): Promise<void>;
    processResults(matchId: string): Promise<void>;
    getUnprocessed(): Promise<import("../matches/match.schema").MatchDocument[]>;
}
