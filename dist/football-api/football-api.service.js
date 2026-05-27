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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var FootballApiService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FootballApiService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const axios_1 = __importDefault(require("axios"));
const WORLD_CUP_2026_ID = 1;
let FootballApiService = FootballApiService_1 = class FootballApiService {
    configService;
    logger = new common_1.Logger(FootballApiService_1.name);
    constructor(configService) {
        this.configService = configService;
    }
    get headers() {
        return {
            'x-apisports-key': this.configService.get('FOOTBALL_API_KEY'),
            'x-apisports-host': this.configService.get('FOOTBALL_API_HOST'),
        };
    }
    async getFixtures(season = 2026) {
        try {
            const { data } = await axios_1.default.get('https://v3.football.api-sports.io/fixtures', {
                headers: this.headers,
                params: { league: WORLD_CUP_2026_ID, season },
            });
            return data.response ?? [];
        }
        catch (err) {
            this.logger.error('Failed to fetch fixtures', err.message);
            return [];
        }
    }
    async getFixtureById(fixtureId) {
        try {
            const { data } = await axios_1.default.get('https://v3.football.api-sports.io/fixtures', {
                headers: this.headers,
                params: { id: fixtureId },
            });
            return data.response?.[0] ?? null;
        }
        catch (err) {
            this.logger.error(`Failed to fetch fixture ${fixtureId}`, err.message);
            return null;
        }
    }
    async getLiveFixtures() {
        try {
            const { data } = await axios_1.default.get('https://v3.football.api-sports.io/fixtures', {
                headers: this.headers,
                params: { league: WORLD_CUP_2026_ID, live: 'all' },
            });
            return data.response ?? [];
        }
        catch (err) {
            this.logger.error('Failed to fetch live fixtures', err.message);
            return [];
        }
    }
};
exports.FootballApiService = FootballApiService;
exports.FootballApiService = FootballApiService = FootballApiService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], FootballApiService);
//# sourceMappingURL=football-api.service.js.map