import {
  Controller, Post, Param, Get, UseGuards,
  Body, UnauthorizedException, NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IsEmail, IsString } from 'class-validator';
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

  @Get('unprocessed-matches')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  getUnprocessed() {
    return this.matchesService.findFinishedUnprocessed();
  }
}
