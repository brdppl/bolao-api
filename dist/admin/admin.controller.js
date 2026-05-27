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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const class_validator_1 = require("class-validator");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const matches_service_1 = require("../matches/matches.service");
const bets_service_1 = require("../bets/bets.service");
const users_service_1 = require("../users/users.service");
class PromoteDto {
    email;
    secret;
}
__decorate([
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], PromoteDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PromoteDto.prototype, "secret", void 0);
class UpdateScoreDto {
    homeScore;
    awayScore;
    finished;
}
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], UpdateScoreDto.prototype, "homeScore", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], UpdateScoreDto.prototype, "awayScore", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateScoreDto.prototype, "finished", void 0);
class SetActiveDto {
    active;
}
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], SetActiveDto.prototype, "active", void 0);
class SetPaidDto {
    paid;
}
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], SetPaidDto.prototype, "paid", void 0);
class SetRoleDto {
    role;
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsIn)(['user', 'admin']),
    __metadata("design:type", String)
], SetRoleDto.prototype, "role", void 0);
let AdminController = class AdminController {
    matchesService;
    betsService;
    usersService;
    configService;
    constructor(matchesService, betsService, usersService, configService) {
        this.matchesService = matchesService;
        this.betsService = betsService;
        this.usersService = usersService;
        this.configService = configService;
    }
    async promote(dto) {
        const expected = this.configService.get('ADMIN_SECRET');
        if (!expected || dto.secret !== expected) {
            throw new common_1.UnauthorizedException('Chave secreta inválida');
        }
        const user = await this.usersService.promoteToAdmin(dto.email);
        if (!user)
            throw new common_1.NotFoundException('Usuário não encontrado');
        return { message: 'Usuário promovido a admin com sucesso', user };
    }
    seedMatches() {
        return this.matchesService.seedMatches();
    }
    syncFixtures() {
        return this.matchesService.syncFixtures();
    }
    processResults(matchId) {
        return this.betsService.processMatchResults(matchId);
    }
    updateScore(matchId, dto) {
        return this.matchesService.updateScore(matchId, dto.homeScore, dto.awayScore, dto.finished ?? true);
    }
    getUnprocessed() {
        return this.matchesService.findFinishedUnprocessed();
    }
    async getStats() {
        const [matchStats, totalUsers, totalBets] = await Promise.all([
            this.matchesService.getStats(),
            this.usersService.countAll(),
            this.usersService.sumTotalBets(),
        ]);
        return { ...matchStats, totalUsers, totalBets };
    }
    getUsers() {
        return this.usersService.getAllUsers();
    }
    async setUserActive(userId, dto) {
        await this.usersService.setActive(userId, dto.active);
        return { ok: true };
    }
    async setUserRole(userId, dto) {
        await this.usersService.setRole(userId, dto.role);
        return { ok: true };
    }
    async setUserPaid(userId, dto) {
        await this.usersService.setPaid(userId, dto.paid);
        return { ok: true };
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, common_1.Post)('promote'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PromoteDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "promote", null);
__decorate([
    (0, common_1.Post)('seed-matches'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "seedMatches", null);
__decorate([
    (0, common_1.Post)('sync-fixtures'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "syncFixtures", null);
__decorate([
    (0, common_1.Post)('process-results/:matchId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin'),
    __param(0, (0, common_1.Param)('matchId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "processResults", null);
__decorate([
    (0, common_1.Patch)('matches/:matchId/score'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin'),
    __param(0, (0, common_1.Param)('matchId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdateScoreDto]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "updateScore", null);
__decorate([
    (0, common_1.Get)('unprocessed-matches'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getUnprocessed", null);
__decorate([
    (0, common_1.Get)('stats'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)('users'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getUsers", null);
__decorate([
    (0, common_1.Patch)('users/:userId/active'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin'),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, SetActiveDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "setUserActive", null);
__decorate([
    (0, common_1.Patch)('users/:userId/role'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin'),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, SetRoleDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "setUserRole", null);
__decorate([
    (0, common_1.Patch)('users/:userId/paid'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin'),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, SetPaidDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "setUserPaid", null);
exports.AdminController = AdminController = __decorate([
    (0, common_1.Controller)('admin'),
    __metadata("design:paramtypes", [matches_service_1.MatchesService,
        bets_service_1.BetsService,
        users_service_1.UsersService,
        config_1.ConfigService])
], AdminController);
//# sourceMappingURL=admin.controller.js.map