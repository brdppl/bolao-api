import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { MatchesService } from './matches.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { MatchPhase } from './match.schema';

@Controller('matches')
@UseGuards(JwtAuthGuard)
export class MatchesController {
  constructor(private matchesService: MatchesService) {}

  @Get()
  findAll() {
    return this.matchesService.findAll();
  }

  @Get('last-result')
  findLastResult() {
    return this.matchesService.findLastResult();
  }

  @Get('live')
  findLive() {
    return this.matchesService.findLive();
  }

  @Get('upcoming')
  findUpcoming() {
    return this.matchesService.findUpcoming(10);
  }

  @Get('phase/:phase')
  findByPhase(@Param('phase') phase: MatchPhase) {
    return this.matchesService.findByPhase(phase);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.matchesService.findById(id);
  }
}
