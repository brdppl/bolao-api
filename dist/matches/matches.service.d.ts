import { Model } from 'mongoose';
import { MatchDocument, MatchPhase } from './match.schema';
import { FootballApiService } from '../football-api/football-api.service';
export declare class MatchesService {
    private matchModel;
    private footballApi;
    private readonly logger;
    constructor(matchModel: Model<MatchDocument>, footballApi: FootballApiService);
    findAll(): Promise<MatchDocument[]>;
    findById(id: string): Promise<MatchDocument | null>;
    findUpcoming(limit?: number): Promise<MatchDocument[]>;
    findByPhase(phase: MatchPhase): Promise<MatchDocument[]>;
    findFinishedUnprocessed(): Promise<MatchDocument[]>;
    markProcessed(id: string): Promise<void>;
    syncFixtures(): Promise<void>;
    private mapStatus;
}
