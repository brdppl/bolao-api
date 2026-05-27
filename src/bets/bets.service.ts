import {
  Injectable,
  Logger,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OnEvent } from '@nestjs/event-emitter';
import { Bet, BetDocument } from './bet.schema';
import { MatchesService, MATCH_FINISHED_EVENT } from '../matches/matches.service';
import { UsersService } from '../users/users.service';
import { MatchStatus } from '../matches/match.schema';

@Injectable()
export class BetsService {
  private readonly logger = new Logger(BetsService.name);

  constructor(
    @InjectModel(Bet.name) private betModel: Model<BetDocument>,
    private matchesService: MatchesService,
    private usersService: UsersService,
  ) {}

  async placeBet(userId: string, matchId: string, homeScore: number, awayScore: number) {
    const match = await this.matchesService.findById(matchId);
    if (!match) throw new NotFoundException('Jogo não encontrado');
    if (match.status !== MatchStatus.SCHEDULED) {
      throw new ForbiddenException('Palpites encerrados para este jogo');
    }
    if (new Date() >= match.kickoff) {
      throw new ForbiddenException('O jogo já começou, palpites encerrados');
    }

    const existing = await this.betModel.findOne({ user: userId, match: matchId } as any);

    if (existing) {
      existing.homeScore = homeScore;
      existing.awayScore = awayScore;
      existing.processed = false;
      return existing.save();
    }

    const bet = new this.betModel({ user: userId, match: matchId, homeScore, awayScore });
    await bet.save();
    await this.usersService.incrementBetCount(userId);
    return bet;
  }

  async getUserBets(userId: string) {
    return this.betModel
      .find({ user: userId } as any)
      .populate('match')
      .sort({ createdAt: -1 })
      .lean();
  }

  async getBetsForMatch(matchId: string) {
    return this.betModel
      .find({ match: matchId } as any)
      .populate('user', '-password')
      .lean();
  }

  async getParticipants(): Promise<Record<string, { _id: string; name: string }[]>> {
    const bets = await this.betModel
      .find({})
      .populate('user', 'name')
      .select('match user')
      .lean() as any[];

    const map: Record<string, { _id: string; name: string }[]> = {};
    for (const bet of bets) {
      const matchId = bet.match.toString();
      if (!map[matchId]) map[matchId] = [];
      if (bet.user?._id && bet.user?.name) {
        map[matchId].push({ _id: bet.user._id.toString(), name: bet.user.name });
      }
    }
    return map;
  }

  @OnEvent(MATCH_FINISHED_EVENT)
  async onMatchFinished(matchId: string): Promise<void> {
    this.logger.log(`Auto-processing bets for match ${matchId}`);
    await this.processMatchResults(matchId);
  }

  async processMatchResults(matchId: string): Promise<void> {
    const match = await this.matchesService.findById(matchId);
    if (!match || match.homeScore === null || match.awayScore === null) return;
    if (match.resultsProcessed) return;

    const bets = await this.betModel.find({ match: matchId, processed: false } as any);

    for (const bet of bets) {
      const { points, resultType } = this.calculatePoints(
        bet.homeScore,
        bet.awayScore,
        match.homeScore as number,
        match.awayScore as number,
      );

      bet.points = points;
      bet.resultType = resultType;
      bet.processed = true;
      await bet.save();

      await this.usersService.updateStats(
        bet.user.toString(),
        points,
        resultType === 'exact',
        resultType === 'winner',
      );
    }

    await this.matchesService.markProcessed(matchId);
  }

  private calculatePoints(
    betHome: number,
    betAway: number,
    realHome: number,
    realAway: number,
  ): { points: number; resultType: string } {
    if (betHome === realHome && betAway === realAway) {
      return { points: 3, resultType: 'exact' };
    }
    const betWinner = Math.sign(betHome - betAway);
    const realWinner = Math.sign(realHome - realAway);
    if (betWinner === realWinner) {
      return { points: 1, resultType: 'winner' };
    }
    return { points: 0, resultType: 'miss' };
  }
}
