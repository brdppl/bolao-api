import { ConfigService } from '@nestjs/config';
import { MatchesService } from '../matches/matches.service';
import { BetsService } from '../bets/bets.service';
import { UsersService } from '../users/users.service';
declare class PromoteDto {
    email: string;
    secret: string;
}
declare class UpdateScoreDto {
    homeScore: number;
    awayScore: number;
    finished?: boolean;
}
declare class SetActiveDto {
    active: boolean;
}
declare class SetPaidDto {
    paid: boolean;
}
declare class SetRoleDto {
    role: 'user' | 'admin';
}
export declare class AdminController {
    private matchesService;
    private betsService;
    private usersService;
    private configService;
    constructor(matchesService: MatchesService, betsService: BetsService, usersService: UsersService, configService: ConfigService);
    promote(dto: PromoteDto): Promise<{
        message: string;
        user: {
            name: string;
            email: string;
            role: string;
        };
    }>;
    seedMatches(): Promise<{
        created: number;
        skipped: boolean;
    }>;
    syncFixtures(): Promise<{
        synced: number;
        finished: number;
    }>;
    processResults(matchId: string): Promise<void>;
    updateScore(matchId: string, dto: UpdateScoreDto): Promise<import("../matches/match.schema").MatchDocument>;
    getUnprocessed(): Promise<import("../matches/match.schema").MatchDocument[]>;
    getStats(): Promise<{
        totalUsers: number;
        totalBets: number;
        total: number;
        finished: number;
        live: number;
        scheduled: number;
        processed: number;
    }>;
    getUsers(): Promise<Omit<import("../users/user.schema").UserDocument, "password">[]>;
    setUserActive(userId: string, dto: SetActiveDto): Promise<{
        ok: boolean;
    }>;
    setUserRole(userId: string, dto: SetRoleDto): Promise<{
        ok: boolean;
    }>;
    setUserPaid(userId: string, dto: SetPaidDto): Promise<{
        ok: boolean;
    }>;
}
export {};
