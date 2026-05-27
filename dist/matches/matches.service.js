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
var MatchesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatchesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const schedule_1 = require("@nestjs/schedule");
const match_schema_1 = require("./match.schema");
const football_api_service_1 = require("../football-api/football-api.service");
const PHASE_MAP = {
    'Group Stage': match_schema_1.MatchPhase.GROUP,
    '1st Round': match_schema_1.MatchPhase.GROUP,
    'Round of 16': match_schema_1.MatchPhase.ROUND_OF_16,
    'Quarter-finals': match_schema_1.MatchPhase.QUARTER_FINAL,
    'Semi-finals': match_schema_1.MatchPhase.SEMI_FINAL,
    '3rd Place Final': match_schema_1.MatchPhase.THIRD_PLACE,
    Final: match_schema_1.MatchPhase.FINAL,
};
let MatchesService = MatchesService_1 = class MatchesService {
    matchModel;
    footballApi;
    logger = new common_1.Logger(MatchesService_1.name);
    constructor(matchModel, footballApi) {
        this.matchModel = matchModel;
        this.footballApi = footballApi;
    }
    async findAll() {
        return this.matchModel.find().sort({ kickoff: 1 }).lean();
    }
    async findById(id) {
        return this.matchModel.findById(id);
    }
    async findUpcoming(limit = 5) {
        return this.matchModel
            .find({ status: match_schema_1.MatchStatus.SCHEDULED, kickoff: { $gte: new Date() } })
            .sort({ kickoff: 1 })
            .limit(limit)
            .lean();
    }
    async findByPhase(phase) {
        return this.matchModel.find({ phase }).sort({ kickoff: 1 }).lean();
    }
    async findFinishedUnprocessed() {
        return this.matchModel.find({ status: match_schema_1.MatchStatus.FINISHED, resultsProcessed: false }).lean();
    }
    async markProcessed(id) {
        await this.matchModel.findByIdAndUpdate(id, { resultsProcessed: true });
    }
    async syncFixtures() {
        this.logger.log('Syncing fixtures from API...');
        const fixtures = await this.footballApi.getFixtures();
        for (const f of fixtures) {
            const fixture = f.fixture;
            const teams = f.teams;
            const goals = f.goals;
            const league = f.league;
            const status = this.mapStatus(fixture.status.short);
            const phase = PHASE_MAP[league.round] ?? match_schema_1.MatchPhase.GROUP;
            await this.matchModel.findOneAndUpdate({ apiMatchId: fixture.id }, {
                apiMatchId: fixture.id,
                homeTeam: teams.home.name,
                awayTeam: teams.away.name,
                homeTeamFlag: teams.home.logo,
                awayTeamFlag: teams.away.logo,
                kickoff: new Date(fixture.date),
                status,
                phase,
                group: league.round,
                homeScore: goals.home,
                awayScore: goals.away,
            }, { upsert: true, new: true });
        }
        this.logger.log(`Synced ${fixtures.length} fixtures`);
    }
    mapStatus(short) {
        const live = ['1H', '2H', 'HT', 'ET', 'P', 'LIVE'];
        const finished = ['FT', 'AET', 'PEN'];
        if (live.includes(short))
            return match_schema_1.MatchStatus.LIVE;
        if (finished.includes(short))
            return match_schema_1.MatchStatus.FINISHED;
        return match_schema_1.MatchStatus.SCHEDULED;
    }
};
exports.MatchesService = MatchesService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_HOUR),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MatchesService.prototype, "syncFixtures", null);
exports.MatchesService = MatchesService = MatchesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(match_schema_1.Match.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        football_api_service_1.FootballApiService])
], MatchesService);
//# sourceMappingURL=matches.service.js.map