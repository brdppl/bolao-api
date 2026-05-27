import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { MatchesModule } from '../matches/matches.module';
import { BetsModule } from '../bets/bets.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [MatchesModule, BetsModule, UsersModule],
  controllers: [AdminController],
})
export class AdminModule {}
