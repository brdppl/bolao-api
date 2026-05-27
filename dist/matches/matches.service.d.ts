import { Model } from 'mongoose';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { MatchDocument, MatchPhase } from './match.schema';
import { FootballApiService } from '../football-api/football-api.service';
export declare const MATCH_FINISHED_EVENT = "match.finished";
export declare class MatchesService {
    private matchModel;
    private footballApi;
    private eventEmitter;
    private readonly logger;
    private readonly COPA_START;
    private readonly COPA_END;
    constructor(matchModel: Model<MatchDocument>, footballApi: FootballApiService, eventEmitter: EventEmitter2);
    findAll(): Promise<MatchDocument[]>;
    findById(id: string): Promise<MatchDocument | null>;
    findUpcoming(limit?: number): Promise<MatchDocument[]>;
    findByPhase(phase: MatchPhase): Promise<MatchDocument[]>;
    findFinishedUnprocessed(): Promise<MatchDocument[]>;
    markProcessed(id: string): Promise<void>;
    countMatches(): Promise<number>;
    getStats(): Promise<{
        total: number;
        finished: number;
        live: number;
        scheduled: number;
        processed: number;
    }>;
    seedMatches(): Promise<{
        created: number;
        skipped: boolean;
    }>;
    private isDuringCopa;
    cronSync(): Promise<void>;
    cronSyncOffSeason(): Promise<void>;
    syncFixtures(): Promise<{
        synced: number;
        finished: number;
    }>;
    updateScore(matchId: string, homeScore: number, awayScore: number, finished?: boolean): Promise<MatchDocument>;
    private mapStatus;
}
