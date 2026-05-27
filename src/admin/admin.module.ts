import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { MatchesModule } from '../matches/matches.module';
import { BetsModule } from '../bets/bets.module';

@Module({
  imports: [MatchesModule, BetsModule],
  controllers: [AdminController],
})
export class AdminModule {}
