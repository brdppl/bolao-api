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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatchSchema = exports.Match = exports.MatchPhase = exports.MatchStatus = void 0;
const mongoose_1 = require("@nestjs/mongoose");
var MatchStatus;
(function (MatchStatus) {
    MatchStatus["SCHEDULED"] = "scheduled";
    MatchStatus["LIVE"] = "live";
    MatchStatus["FINISHED"] = "finished";
    MatchStatus["CANCELLED"] = "cancelled";
})(MatchStatus || (exports.MatchStatus = MatchStatus = {}));
var MatchPhase;
(function (MatchPhase) {
    MatchPhase["GROUP"] = "group";
    MatchPhase["ROUND_OF_32"] = "round_of_32";
    MatchPhase["ROUND_OF_16"] = "round_of_16";
    MatchPhase["QUARTER_FINAL"] = "quarter_final";
    MatchPhase["SEMI_FINAL"] = "semi_final";
    MatchPhase["THIRD_PLACE"] = "third_place";
    MatchPhase["FINAL"] = "final";
})(MatchPhase || (exports.MatchPhase = MatchPhase = {}));
let Match = class Match {
    apiMatchId;
    homeTeam;
    awayTeam;
    homeTeamFlag;
    awayTeamFlag;
    kickoff;
    status;
    phase;
    group;
    homeScore;
    awayScore;
    resultsProcessed;
    round;
};
exports.Match = Match;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Match.prototype, "apiMatchId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Match.prototype, "homeTeam", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Match.prototype, "awayTeam", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Match.prototype, "homeTeamFlag", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Match.prototype, "awayTeamFlag", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], Match.prototype, "kickoff", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: MatchStatus.SCHEDULED, enum: Object.values(MatchStatus) }),
    __metadata("design:type", String)
], Match.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: MatchPhase.GROUP, enum: Object.values(MatchPhase) }),
    __metadata("design:type", String)
], Match.prototype, "phase", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Match.prototype, "group", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, default: null }),
    __metadata("design:type", Object)
], Match.prototype, "homeScore", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, default: null }),
    __metadata("design:type", Object)
], Match.prototype, "awayScore", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], Match.prototype, "resultsProcessed", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 1 }),
    __metadata("design:type", Number)
], Match.prototype, "round", void 0);
exports.Match = Match = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Match);
exports.MatchSchema = mongoose_1.SchemaFactory.createForClass(Match);
//# sourceMappingURL=match.schema.js.map