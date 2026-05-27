import { Controller, Post, Get, Param, Body, UseGuards } from '@nestjs/common';
import { IsInt, Min } from 'class-validator';
import { BetsService } from './bets.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

class PlaceBetDto {
  @IsInt() @Min(0) homeScore: number;
  @IsInt() @Min(0) awayScore: number;
}

@Controller('bets')
@UseGuards(JwtAuthGuard)
export class BetsController {
  constructor(private betsService: BetsService) {}

  @Post('match/:matchId')
  placeBet(
    @CurrentUser() user: any,
    @Param('matchId') matchId: string,
    @Body() dto: PlaceBetDto,
  ) {
    return this.betsService.placeBet(user.id, matchId, dto.homeScore, dto.awayScore);
  }

  @Get('my')
  getMyBets(@CurrentUser() user: any) {
    return this.betsService.getUserBets(user.id);
  }

  @Get('participants')
  getParticipants() {
    return this.betsService.getParticipants();
  }

  @Get('match/:matchId')
  getBetsForMatch(@Param('matchId') matchId: string) {
    return this.betsService.getBetsForMatch(matchId);
  }
}
