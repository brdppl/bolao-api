import { Module } from '@nestjs/common';
import { RankingsController } from './rankings.controller';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [RankingsController],
})
export class RankingsModule {}
