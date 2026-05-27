import {
  Controller, Post, Patch, Param, Get, UseGuards,
  Body, UnauthorizedException, NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IsEmail, IsString, IsInt, IsBoolean, IsOptional, Min, IsIn } from 'class-validator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { MatchesService } from '../matches/matches.service';
import { BetsService } from '../bets/bets.service';
import { UsersService } from '../users/users.service';

class PromoteDto {
  @IsEmail() email: string;
  @IsString() secret: string;
}

class UpdateScoreDto {
  @IsInt() @Min(0) homeScore: number;
  @IsInt() @Min(0) awayScore: number;
  @IsBoolean() @IsOptional() finished?: boolean;
}

class SetActiveDto {
  @IsBoolean() active: boolean;
}

class SetPaidDto {
  @IsBoolean() paid: boolean;
}

class SetRoleDto {
  @IsString() @IsIn(['user', 'admin']) role: 'user' | 'admin';
}

@Controller('admin')
export class AdminController {
  constructor(
    private matchesService: MatchesService,
    private betsService: BetsService,
    private usersService: UsersService,
    private configService: ConfigService,
  ) {}

  // ─── Rota pública protegida por chave secreta (sem JWT) ─────────
  @Post('promote')
  async promote(@Body() dto: PromoteDto) {
    const expected = this.configService.get<string>('ADMIN_SECRET');
    if (!expected || dto.secret !== expected) {
      throw new UnauthorizedException('Chave secreta inválida');
    }
    const user = await this.usersService.promoteToAdmin(dto.email);
    if (!user) throw new NotFoundException('Usuário não encontrado');
    return { message: 'Usuário promovido a admin com sucesso', user };
  }

  // ─── Rotas protegidas por JWT + role admin ───────────────────────
  @Post('seed-matches')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  seedMatches() {
    return this.matchesService.seedMatches();
  }

  @Post('sync-fixtures')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  syncFixtures() {
    return this.matchesService.syncFixtures();
  }

  @Post('process-results/:matchId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  processResults(@Param('matchId') matchId: string) {
    return this.betsService.processMatchResults(matchId);
  }

  @Patch('matches/:matchId/score')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  updateScore(@Param('matchId') matchId: string, @Body() dto: UpdateScoreDto) {
    return this.matchesService.updateScore(matchId, dto.homeScore, dto.awayScore, dto.finished ?? true);
  }

  @Get('unprocessed-matches')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  getUnprocessed() {
    return this.matchesService.findFinishedUnprocessed();
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async getStats() {
    const [matchStats, totalUsers, totalBets] = await Promise.all([
      this.matchesService.getStats(),
      this.usersService.countAll(),
      this.usersService.sumTotalBets(),
    ]);
    return { ...matchStats, totalUsers, totalBets };
  }

  @Get('users')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  getUsers() {
    return this.usersService.getAllUsers();
  }

  @Patch('users/:userId/active')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async setUserActive(@Param('userId') userId: string, @Body() dto: SetActiveDto) {
    await this.usersService.setActive(userId, dto.active);
    return { ok: true };
  }

  @Patch('users/:userId/role')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async setUserRole(@Param('userId') userId: string, @Body() dto: SetRoleDto) {
    await this.usersService.setRole(userId, dto.role);
    return { ok: true };
  }

  @Patch('users/:userId/paid')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async setUserPaid(@Param('userId') userId: string, @Body() dto: SetPaidDto) {
    await this.usersService.setPaid(userId, dto.paid);
    return { ok: true };
  }
}
