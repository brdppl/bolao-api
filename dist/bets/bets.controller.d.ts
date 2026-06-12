import { BetsService } from './bets.service';
declare class PlaceBetDto {
    homeScore: number;
    awayScore: number;
}
export declare class BetsController {
    private betsService;
    constructor(betsService: BetsService);
    placeBet(user: any, matchId: string, dto: PlaceBetDto): Promise<import("mongoose").Document<unknown, {}, import("./bet.schema").BetDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./bet.schema").Bet & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    getMyBets(user: any): Promise<(import("./bet.schema").Bet & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    getParticipants(): Promise<Record<string, {
        _id: string;
        name: string;
        homeScore: number;
        awayScore: number;
        points: number;
        processed: boolean;
        resultType: string | null;
    }[]>>;
    getBetsForMatch(matchId: string): Promise<(import("./bet.schema").Bet & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
}
export {};
