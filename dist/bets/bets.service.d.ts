import { Model } from 'mongoose';
import { Bet, BetDocument } from './bet.schema';
import { MatchesService } from '../matches/matches.service';
import { UsersService } from '../users/users.service';
export declare class BetsService {
    private betModel;
    private matchesService;
    private usersService;
    constructor(betModel: Model<BetDocument>, matchesService: MatchesService, usersService: UsersService);
    placeBet(userId: string, matchId: string, homeScore: number, awayScore: number): Promise<import("mongoose").Document<unknown, {}, BetDocument, {}, import("mongoose").DefaultSchemaOptions> & Bet & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    getUserBets(userId: string): Promise<(Bet & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    getBetsForMatch(matchId: string): Promise<(Bet & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    getParticipants(): Promise<Record<string, {
        _id: string;
        name: string;
    }[]>>;
    processMatchResults(matchId: string): Promise<void>;
    private calculatePoints;
}
