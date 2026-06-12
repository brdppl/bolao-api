"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var BetsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BetsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const event_emitter_1 = require("@nestjs/event-emitter");
const bet_schema_1 = require("./bet.schema");
const matches_service_1 = require("../matches/matches.service");
const users_service_1 = require("../users/users.service");
const match_schema_1 = require("../matches/match.schema");
let BetsService = BetsService_1 = class BetsService {
    betModel;
    matchesService;
    usersService;
    logger = new common_1.Logger(BetsService_1.name);
    constructor(betModel, matchesService, usersService) {
        this.betModel = betModel;
        this.matchesService = matchesService;
        this.usersService = usersService;
    }
    async placeBet(userId, matchId, homeScore, awayScore) {
        const match = await this.matchesService.findById(matchId);
        if (!match)
            throw new common_1.NotFoundException('Jogo não encontrado');
        if (match.status !== match_schema_1.MatchStatus.SCHEDULED) {
            throw new common_1.ForbiddenException('Palpites encerrados para este jogo');
        }
        if (new Date() >= match.kickoff) {
            throw new common_1.ForbiddenException('O jogo já começou, palpites encerrados');
        }
        const existing = await this.betModel.findOne({ user: userId, match: matchId });
        if (existing) {
            existing.homeScore = homeScore;
            existing.awayScore = awayScore;
            existing.processed = false;
            return existing.save();
        }
        const bet = new this.betModel({ user: userId, match: matchId, homeScore, awayScore });
        await bet.save();
        await this.usersService.incrementBetCount(userId);
        return bet;
    }
    async getUserBets(userId) {
        return this.betModel
            .find({ user: userId })
            .populate('match')
            .sort({ createdAt: -1 })
            .lean();
    }
    async getBetsForMatch(matchId) {
        return this.betModel
            .find({ match: matchId })
            .populate('user', '-password')
            .lean();
    }
    async getParticipants() {
        const bets = await this.betModel
            .find({})
            .populate('user', 'name')
            .select('match user homeScore awayScore points processed resultType')
            .lean();
        const map = {};
        for (const bet of bets) {
            const matchId = bet.match.toString();
            if (!map[matchId])
                map[matchId] = [];
            if (bet.user?._id && bet.user?.name) {
                map[matchId].push({
                    _id: bet.user._id.toString(),
                    name: bet.user.name,
                    homeScore: bet.homeScore,
                    awayScore: bet.awayScore,
                    points: bet.points,
                    processed: bet.processed,
                    resultType: bet.resultType ?? null,
                });
            }
        }
        return map;
    }
    async onMatchFinished(matchId) {
        this.logger.log(`Auto-processing bets for match ${matchId}`);
        await this.processMatchResults(matchId);
    }
    async processMatchResults(matchId) {
        const match = await this.matchesService.findById(matchId);
        if (!match || match.homeScore === null || match.awayScore === null)
            return;
        if (match.resultsProcessed)
            return;
        const bets = await this.betModel.find({ match: matchId, processed: false });
        for (const bet of bets) {
            const { points, resultType } = this.calculatePoints(bet.homeScore, bet.awayScore, match.homeScore, match.awayScore);
            bet.points = points;
            bet.resultType = resultType;
            bet.processed = true;
            await bet.save();
            await this.usersService.updateStats(bet.user.toString(), points, resultType === 'exact', resultType === 'winner');
        }
        await this.matchesService.markProcessed(matchId);
    }
    calculatePoints(betHome, betAway, realHome, realAway) {
        if (betHome === realHome && betAway === realAway) {
            return { points: 3, resultType: 'exact' };
        }
        const betWinner = Math.sign(betHome - betAway);
        const realWinner = Math.sign(realHome - realAway);
        if (betWinner === realWinner) {
            return { points: 1, resultType: 'winner' };
        }
        return { points: 0, resultType: 'miss' };
    }
};
exports.BetsService = BetsService;
__decorate([
    (0, event_emitter_1.OnEvent)(matches_service_1.MATCH_FINISHED_EVENT),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BetsService.prototype, "onMatchFinished", null);
exports.BetsService = BetsService = BetsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(bet_schema_1.Bet.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        matches_service_1.MatchesService,
        users_service_1.UsersService])
], BetsService);
//# sourceMappingURL=bets.service.js.map