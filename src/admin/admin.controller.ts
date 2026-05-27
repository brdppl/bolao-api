import { Controller, Post, Param, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { MatchesService } from '../matches/matches.service';
import { BetsService } from '../bets/bets.service';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class AdminController {
  constructor(
    private matchesService: MatchesService,
    private betsService: BetsService,
  ) {}

  @Post('sync-fixtures')
  syncFixtures() {
    return this.matchesService.syncFixtures();
  }

  @Post('process-results/:matchId')
  processResults(@Param('matchId') matchId: string) {
    return this.betsService.processMatchResults(matchId);
  }

  @Get('unprocessed-matches')
  getUnprocessed() {
    return this.matchesService.findFinishedUnprocessed();
  }
}
