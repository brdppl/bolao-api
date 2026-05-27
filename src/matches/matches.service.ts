import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Match, MatchDocument, MatchPhase, MatchStatus } from './match.schema';
import { FootballApiService } from '../football-api/football-api.service';

const PHASE_MAP: Record<string, MatchPhase> = {
  'Group Stage': MatchPhase.GROUP,
  '1st Round': MatchPhase.GROUP,
  'Round of 16': MatchPhase.ROUND_OF_16,
  'Quarter-finals': MatchPhase.QUARTER_FINAL,
  'Semi-finals': MatchPhase.SEMI_FINAL,
  '3rd Place Final': MatchPhase.THIRD_PLACE,
  Final: MatchPhase.FINAL,
};

@Injectable()
export class MatchesService {
  private readonly logger = new Logger(MatchesService.name);

  constructor(
    @InjectModel(Match.name) private matchModel: Model<MatchDocument>,
    private footballApi: FootballApiService,
  ) {}

  async findAll(): Promise<MatchDocument[]> {
    return this.matchModel.find().sort({ kickoff: 1 }).lean();
  }

  async findById(id: string): Promise<MatchDocument | null> {
    return this.matchModel.findById(id);
  }

  async findUpcoming(limit = 5): Promise<MatchDocument[]> {
    return this.matchModel
      .find({ status: MatchStatus.SCHEDULED, kickoff: { $gte: new Date() } })
      .sort({ kickoff: 1 })
      .limit(limit)
      .lean();
  }

  async findByPhase(phase: MatchPhase): Promise<MatchDocument[]> {
    return this.matchModel.find({ phase }).sort({ kickoff: 1 }).lean();
  }

  async findFinishedUnprocessed(): Promise<MatchDocument[]> {
    return this.matchModel.find({ status: MatchStatus.FINISHED, resultsProcessed: false }).lean();
  }

  async markProcessed(id: string): Promise<void> {
    await this.matchModel.findByIdAndUpdate(id, { resultsProcessed: true });
  }

  @Cron(CronExpression.EVERY_HOUR)
  async syncFixtures(): Promise<void> {
    this.logger.log('Syncing fixtures from API...');
    const fixtures = await this.footballApi.getFixtures();

    for (const f of fixtures) {
      const fixture = f.fixture;
      const teams = f.teams;
      const goals = f.goals;
      const league = f.league;

      const status = this.mapStatus(fixture.status.short);
      const phase = PHASE_MAP[league.round] ?? MatchPhase.GROUP;

      await this.matchModel.findOneAndUpdate(
        { apiMatchId: fixture.id },
        {
          apiMatchId: fixture.id,
          homeTeam: teams.home.name,
          awayTeam: teams.away.name,
          homeTeamFlag: teams.home.logo,
          awayTeamFlag: teams.away.logo,
          kickoff: new Date(fixture.date),
          status,
          phase,
          group: league.round,
          homeScore: goals.home,
          awayScore: goals.away,
        },
        { upsert: true, new: true },
      );
    }

    this.logger.log(`Synced ${fixtures.length} fixtures`);
  }

  private mapStatus(short: string): MatchStatus {
    const live = ['1H', '2H', 'HT', 'ET', 'P', 'LIVE'];
    const finished = ['FT', 'AET', 'PEN'];
    if (live.includes(short)) return MatchStatus.LIVE;
    if (finished.includes(short)) return MatchStatus.FINISHED;
    return MatchStatus.SCHEDULED;
  }
}
