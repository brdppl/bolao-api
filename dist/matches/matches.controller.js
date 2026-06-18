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
exports.MatchesController = void 0;
const common_1 = require("@nestjs/common");
const matches_service_1 = require("./matches.service");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const match_schema_1 = require("./match.schema");
let MatchesController = class MatchesController {
    matchesService;
    constructor(matchesService) {
        this.matchesService = matchesService;
    }
    findAll() {
        return this.matchesService.findAll();
    }
    findLastResult() {
        return this.matchesService.findLastResult();
    }
    findLive() {
        return this.matchesService.findLive();
    }
    findUpcoming() {
        return this.matchesService.findUpcoming(10);
    }
    findByPhase(phase) {
        return this.matchesService.findByPhase(phase);
    }
    findOne(id) {
        return this.matchesService.findById(id);
    }
};
exports.MatchesController = MatchesController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MatchesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('last-result'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MatchesController.prototype, "findLastResult", null);
__decorate([
    (0, common_1.Get)('live'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MatchesController.prototype, "findLive", null);
__decorate([
    (0, common_1.Get)('upcoming'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MatchesController.prototype, "findUpcoming", null);
__decorate([
    (0, common_1.Get)('phase/:phase'),
    __param(0, (0, common_1.Param)('phase')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MatchesController.prototype, "findByPhase", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MatchesController.prototype, "findOne", null);
exports.MatchesController = MatchesController = __decorate([
    (0, common_1.Controller)('matches'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [matches_service_1.MatchesService])
], MatchesController);
//# sourceMappingURL=matches.controller.js.map