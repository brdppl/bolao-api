import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cron } from '@nestjs/schedule';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Match, MatchDocument, MatchPhase, MatchStatus } from './match.schema';
import { FootballApiService } from '../football-api/football-api.service';

export const MATCH_FINISHED_EVENT = 'match.finished';

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

  // Copa 2026: 11 jun – 19 jul
  private readonly COPA_START = new Date('2026-06-11T00:00:00Z');
  private readonly COPA_END   = new Date('2026-07-20T00:00:00Z');

  constructor(
    @InjectModel(Match.name) private matchModel: Model<MatchDocument>,
    private footballApi: FootballApiService,
    private eventEmitter: EventEmitter2,
  ) {}

  async findAll(): Promise<MatchDocument[]> {
    return this.matchModel.find().sort({ kickoff: 1 }).lean();
  }

  async findById(id: string): Promise<MatchDocument | null> {
    return this.matchModel.findById(id);
  }

  async findLastResult(): Promise<MatchDocument | null> {
    return this.matchModel
      .findOne({ resultsProcessed: true })
      .sort({ kickoff: -1 })
      .lean();
  }

  async findLive(): Promise<MatchDocument[]> {
    const now = new Date();
    const windowStart = new Date(now.getTime() - 110 * 60 * 1000);
    return this.matchModel
      .find({ kickoff: { $gte: windowStart, $lte: now }, status: { $ne: MatchStatus.FINISHED } })
      .sort({ kickoff: 1 })
      .lean();
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

  async countMatches(): Promise<number> {
    return this.matchModel.countDocuments();
  }

  async getStats(): Promise<{ total: number; finished: number; live: number; scheduled: number; processed: number }> {
    const [total, finished, live, scheduled, processed] = await Promise.all([
      this.matchModel.countDocuments(),
      this.matchModel.countDocuments({ status: MatchStatus.FINISHED }),
      this.matchModel.countDocuments({ status: MatchStatus.LIVE }),
      this.matchModel.countDocuments({ status: MatchStatus.SCHEDULED }),
      this.matchModel.countDocuments({ resultsProcessed: true }),
    ]);
    return { total, finished, live, scheduled, processed };
  }

  async seedMatches(): Promise<{ created: number; skipped: boolean }> {
    const existing = await this.matchModel.countDocuments();
    if (existing > 0) {
      return { created: 0, skipped: true };
    }

    const FLAGS: Record<string, string> = {
      'México': 'https://flagcdn.com/w80/mx.png', 'África do Sul': 'https://flagcdn.com/w80/za.png',
      'Coreia do Sul': 'https://flagcdn.com/w80/kr.png', 'República Tcheca': 'https://flagcdn.com/w80/cz.png',
      'Canadá': 'https://flagcdn.com/w80/ca.png', 'Bósnia e Herzegovina': 'https://flagcdn.com/w80/ba.png',
      'Qatar': 'https://flagcdn.com/w80/qa.png', 'Suíça': 'https://flagcdn.com/w80/ch.png',
      'Brasil': 'https://flagcdn.com/w80/br.png', 'Marrocos': 'https://flagcdn.com/w80/ma.png',
      'Haiti': 'https://flagcdn.com/w80/ht.png', 'Escócia': 'https://flagcdn.com/w80/gb-sct.png',
      'Estados Unidos': 'https://flagcdn.com/w80/us.png', 'Paraguai': 'https://flagcdn.com/w80/py.png',
      'Austrália': 'https://flagcdn.com/w80/au.png', 'Turquia': 'https://flagcdn.com/w80/tr.png',
      'Alemanha': 'https://flagcdn.com/w80/de.png', 'Curaçau': 'https://flagcdn.com/w80/cw.png',
      'Costa do Marfim': 'https://flagcdn.com/w80/ci.png', 'Equador': 'https://flagcdn.com/w80/ec.png',
      'Holanda': 'https://flagcdn.com/w80/nl.png', 'Japão': 'https://flagcdn.com/w80/jp.png',
      'Suécia': 'https://flagcdn.com/w80/se.png', 'Tunísia': 'https://flagcdn.com/w80/tn.png',
      'Bélgica': 'https://flagcdn.com/w80/be.png', 'Egito': 'https://flagcdn.com/w80/eg.png',
      'Irã': 'https://flagcdn.com/w80/ir.png', 'Nova Zelândia': 'https://flagcdn.com/w80/nz.png',
      'Espanha': 'https://flagcdn.com/w80/es.png', 'Cabo Verde': 'https://flagcdn.com/w80/cv.png',
      'Arábia Saudita': 'https://flagcdn.com/w80/sa.png', 'Uruguai': 'https://flagcdn.com/w80/uy.png',
      'França': 'https://flagcdn.com/w80/fr.png', 'Senegal': 'https://flagcdn.com/w80/sn.png',
      'Iraque': 'https://flagcdn.com/w80/iq.png', 'Noruega': 'https://flagcdn.com/w80/no.png',
      'Argentina': 'https://flagcdn.com/w80/ar.png', 'Argélia': 'https://flagcdn.com/w80/dz.png',
      'Áustria': 'https://flagcdn.com/w80/at.png', 'Jordânia': 'https://flagcdn.com/w80/jo.png',
      'Portugal': 'https://flagcdn.com/w80/pt.png', 'RD Congo': 'https://flagcdn.com/w80/cd.png',
      'Uzbequistão': 'https://flagcdn.com/w80/uz.png', 'Colômbia': 'https://flagcdn.com/w80/co.png',
      'Inglaterra': 'https://flagcdn.com/w80/gb-eng.png', 'Croácia': 'https://flagcdn.com/w80/hr.png',
      'Gana': 'https://flagcdn.com/w80/gh.png', 'Panamá': 'https://flagcdn.com/w80/pa.png',
    };

    const brt = (date: string, time: string) => new Date(`${date}T${time}:00-03:00`);

    const mk = (home: string, away: string, kickoff: Date, phase: MatchPhase, group: string, round: number, id: number) => ({
      apiMatchId: id, homeTeam: home, awayTeam: away,
      homeTeamFlag: FLAGS[home] ?? '', awayTeamFlag: FLAGS[away] ?? '',
      kickoff, status: MatchStatus.SCHEDULED, phase, group,
      homeScore: null, awayScore: null, resultsProcessed: false, round,
    });

    const GROUPS: Record<string, { teams: [string,string,string,string]; r1:[string,string]; r1b:[string,string]; r2:[string,string]; r2b:[string,string]; r3:[string,string]; r3b:[string,string] }> = {
      A: { teams:['México','África do Sul','Coreia do Sul','República Tcheca'], r1:['2026-06-11','16:00'], r1b:['2026-06-11','22:00'], r2:['2026-06-17','16:00'], r2b:['2026-06-17','19:00'], r3:['2026-06-25','16:00'], r3b:['2026-06-25','16:00'] },
      B: { teams:['Canadá','Bósnia e Herzegovina','Qatar','Suíça'], r1:['2026-06-12','16:00'], r1b:['2026-06-12','19:00'], r2:['2026-06-18','16:00'], r2b:['2026-06-18','19:00'], r3:['2026-06-25','19:00'], r3b:['2026-06-25','19:00'] },
      C: { teams:['Brasil','Marrocos','Haiti','Escócia'], r1:['2026-06-13','19:00'], r1b:['2026-06-13','22:00'], r2:['2026-06-19','21:30'], r2b:['2026-06-19','16:00'], r3:['2026-06-24','19:00'], r3b:['2026-06-24','19:00'] },
      D: { teams:['Estados Unidos','Paraguai','Austrália','Turquia'], r1:['2026-06-12','22:00'], r1b:['2026-06-13','16:00'], r2:['2026-06-18','22:00'], r2b:['2026-06-19','19:00'], r3:['2026-06-24','22:00'], r3b:['2026-06-24','22:00'] },
      E: { teams:['Alemanha','Curaçau','Costa do Marfim','Equador'], r1:['2026-06-14','13:00'], r1b:['2026-06-14','16:00'], r2:['2026-06-20','13:00'], r2b:['2026-06-20','16:00'], r3:['2026-06-25','22:00'], r3b:['2026-06-25','22:00'] },
      F: { teams:['Holanda','Japão','Suécia','Tunísia'], r1:['2026-06-14','19:00'], r1b:['2026-06-14','22:00'], r2:['2026-06-20','19:00'], r2b:['2026-06-20','22:00'], r3:['2026-06-26','16:00'], r3b:['2026-06-26','16:00'] },
      G: { teams:['Bélgica','Egito','Irã','Nova Zelândia'], r1:['2026-06-15','13:00'], r1b:['2026-06-15','16:00'], r2:['2026-06-21','13:00'], r2b:['2026-06-21','16:00'], r3:['2026-06-26','19:00'], r3b:['2026-06-26','19:00'] },
      H: { teams:['Espanha','Cabo Verde','Arábia Saudita','Uruguai'], r1:['2026-06-15','19:00'], r1b:['2026-06-15','22:00'], r2:['2026-06-21','19:00'], r2b:['2026-06-21','22:00'], r3:['2026-06-26','22:00'], r3b:['2026-06-26','22:00'] },
      I: { teams:['França','Senegal','Iraque','Noruega'], r1:['2026-06-16','13:00'], r1b:['2026-06-16','16:00'], r2:['2026-06-22','13:00'], r2b:['2026-06-22','16:00'], r3:['2026-06-27','13:00'], r3b:['2026-06-27','13:00'] },
      J: { teams:['Argentina','Argélia','Áustria','Jordânia'], r1:['2026-06-16','19:00'], r1b:['2026-06-16','22:00'], r2:['2026-06-22','19:00'], r2b:['2026-06-22','22:00'], r3:['2026-06-27','16:00'], r3b:['2026-06-27','16:00'] },
      K: { teams:['Portugal','RD Congo','Uzbequistão','Colômbia'], r1:['2026-06-17','13:00'], r1b:['2026-06-17','16:00'], r2:['2026-06-23','13:00'], r2b:['2026-06-23','16:00'], r3:['2026-06-27','19:00'], r3b:['2026-06-27','19:00'] },
      L: { teams:['Inglaterra','Croácia','Gana','Panamá'], r1:['2026-06-17','19:00'], r1b:['2026-06-17','22:00'], r2:['2026-06-23','19:00'], r2b:['2026-06-23','22:00'], r3:['2026-06-27','22:00'], r3b:['2026-06-27','22:00'] },
    };

    const matches: any[] = [];
    let id = 90000;

    for (const [k, g] of Object.entries(GROUPS)) {
      const label = `Grupo ${k}`;
      const [t0, t1, t2, t3] = g.teams;
      matches.push(mk(t0,t1,brt(g.r1[0],g.r1[1]),   MatchPhase.GROUP, label, 1, id++));
      matches.push(mk(t2,t3,brt(g.r1b[0],g.r1b[1]), MatchPhase.GROUP, label, 1, id++));
      matches.push(mk(t0,t2,brt(g.r2[0],g.r2[1]),   MatchPhase.GROUP, label, 2, id++));
      matches.push(mk(t1,t3,brt(g.r2b[0],g.r2b[1]), MatchPhase.GROUP, label, 2, id++));
      matches.push(mk(t0,t3,brt(g.r3[0],g.r3[1]),   MatchPhase.GROUP, label, 3, id++));
      matches.push(mk(t1,t2,brt(g.r3b[0],g.r3b[1]), MatchPhase.GROUP, label, 3, id++));
    }

    const KO = [
      // Rodada de 32 — 28 jun a 3 jul (datas explícitas, junho só tem 30 dias)
      { d:'2026-06-28', t:'13:00', ph:MatchPhase.ROUND_OF_32, g:'Rodada de 32' },
      { d:'2026-06-28', t:'17:00', ph:MatchPhase.ROUND_OF_32, g:'Rodada de 32' },
      { d:'2026-06-28', t:'21:00', ph:MatchPhase.ROUND_OF_32, g:'Rodada de 32' },
      { d:'2026-06-29', t:'13:00', ph:MatchPhase.ROUND_OF_32, g:'Rodada de 32' },
      { d:'2026-06-29', t:'17:00', ph:MatchPhase.ROUND_OF_32, g:'Rodada de 32' },
      { d:'2026-06-29', t:'21:00', ph:MatchPhase.ROUND_OF_32, g:'Rodada de 32' },
      { d:'2026-06-30', t:'13:00', ph:MatchPhase.ROUND_OF_32, g:'Rodada de 32' },
      { d:'2026-06-30', t:'17:00', ph:MatchPhase.ROUND_OF_32, g:'Rodada de 32' },
      { d:'2026-06-30', t:'21:00', ph:MatchPhase.ROUND_OF_32, g:'Rodada de 32' },
      { d:'2026-07-01', t:'13:00', ph:MatchPhase.ROUND_OF_32, g:'Rodada de 32' },
      { d:'2026-07-01', t:'17:00', ph:MatchPhase.ROUND_OF_32, g:'Rodada de 32' },
      { d:'2026-07-01', t:'21:00', ph:MatchPhase.ROUND_OF_32, g:'Rodada de 32' },
      { d:'2026-07-02', t:'13:00', ph:MatchPhase.ROUND_OF_32, g:'Rodada de 32' },
      { d:'2026-07-02', t:'17:00', ph:MatchPhase.ROUND_OF_32, g:'Rodada de 32' },
      { d:'2026-07-02', t:'21:00', ph:MatchPhase.ROUND_OF_32, g:'Rodada de 32' },
      { d:'2026-07-03', t:'21:00', ph:MatchPhase.ROUND_OF_32, g:'Rodada de 32' },
      // Oitavas de Final — 4 a 7 jul
      { d:'2026-07-04', t:'13:00', ph:MatchPhase.ROUND_OF_16, g:'Oitavas de Final' },
      { d:'2026-07-04', t:'17:00', ph:MatchPhase.ROUND_OF_16, g:'Oitavas de Final' },
      { d:'2026-07-05', t:'13:00', ph:MatchPhase.ROUND_OF_16, g:'Oitavas de Final' },
      { d:'2026-07-05', t:'17:00', ph:MatchPhase.ROUND_OF_16, g:'Oitavas de Final' },
      { d:'2026-07-06', t:'13:00', ph:MatchPhase.ROUND_OF_16, g:'Oitavas de Final' },
      { d:'2026-07-06', t:'17:00', ph:MatchPhase.ROUND_OF_16, g:'Oitavas de Final' },
      { d:'2026-07-07', t:'13:00', ph:MatchPhase.ROUND_OF_16, g:'Oitavas de Final' },
      { d:'2026-07-07', t:'17:00', ph:MatchPhase.ROUND_OF_16, g:'Oitavas de Final' },
      // Quartas de Final — 9 a 11 jul
      { d:'2026-07-09', t:'16:00', ph:MatchPhase.QUARTER_FINAL, g:'Quartas de Final' },
      { d:'2026-07-10', t:'13:00', ph:MatchPhase.QUARTER_FINAL, g:'Quartas de Final' },
      { d:'2026-07-11', t:'13:00', ph:MatchPhase.QUARTER_FINAL, g:'Quartas de Final' },
      { d:'2026-07-11', t:'17:00', ph:MatchPhase.QUARTER_FINAL, g:'Quartas de Final' },
      // Semifinais — 14 e 15 jul
      { d:'2026-07-14', t:'16:00', ph:MatchPhase.SEMI_FINAL, g:'Semifinal' },
      { d:'2026-07-15', t:'16:00', ph:MatchPhase.SEMI_FINAL, g:'Semifinal' },
      // 3º Lugar e Final
      { d:'2026-07-18', t:'16:00', ph:MatchPhase.THIRD_PLACE, g:'3º Lugar' },
      { d:'2026-07-19', t:'16:00', ph:MatchPhase.FINAL, g:'Final' },
    ];

    for (const m of KO) {
      matches.push(mk('A Definir','A Definir', brt(m.d, m.t), m.ph, m.g, 1, id++));
    }

    await this.matchModel.insertMany(matches);
    return { created: matches.length, skipped: false };
  }

  private isDuringCopa(): boolean {
    const now = new Date();
    return now >= this.COPA_START && now <= this.COPA_END;
  }

  // A cada 5 minutos durante a Copa para capturar placares ao vivo
  @Cron('*/5 * * * *')
  async cronSync(): Promise<void> {
    if (this.isDuringCopa()) {
      await this.syncFixtures();
    }
  }

  // A cada hora fora da Copa (mantém dados atualizados no geral)
  @Cron('0 * * * *')
  async cronSyncOffSeason(): Promise<void> {
    if (!this.isDuringCopa()) {
      await this.syncFixtures();
    }
  }

  async syncFixtures(): Promise<{ synced: number; finished: number }> {
    this.logger.log('Syncing fixtures from API...');
    const fixtures = await this.footballApi.getFixtures();
    let finishedCount = 0;

    for (const f of fixtures) {
      const fixture = f.fixture;
      const teams   = f.teams;
      const goals   = f.goals;
      const league  = f.league;

      const newStatus = this.mapStatus(fixture.status.short);
      const phase = PHASE_MAP[league.round] ?? MatchPhase.GROUP;

      const existing = await this.matchModel.findOne({ apiMatchId: fixture.id });
      const wasFinished = existing?.status === MatchStatus.FINISHED;

      const updated = await this.matchModel.findOneAndUpdate(
        { apiMatchId: fixture.id },
        {
          apiMatchId: fixture.id,
          homeTeam: teams.home.name,
          awayTeam: teams.away.name,
          homeTeamFlag: teams.home.logo,
          awayTeamFlag: teams.away.logo,
          kickoff: new Date(fixture.date),
          status: newStatus,
          phase,
          group: league.round,
          homeScore: goals.home,
          awayScore: goals.away,
        },
        { upsert: true, new: true },
      );

      // Emite evento apenas uma vez quando o jogo termina
      if (!wasFinished && newStatus === MatchStatus.FINISHED && updated && !updated.resultsProcessed) {
        this.logger.log(`Match finished: ${updated.homeTeam} vs ${updated.awayTeam}`);
        this.eventEmitter.emit(MATCH_FINISHED_EVENT, updated._id.toString());
        finishedCount++;
      }
    }

    this.logger.log(`Synced ${fixtures.length} fixtures, ${finishedCount} newly finished`);
    return { synced: fixtures.length, finished: finishedCount };
  }

  async updateScore(
    matchId: string,
    homeScore: number,
    awayScore: number,
    finished = true,
  ): Promise<MatchDocument> {
    const match = await this.matchModel.findById(matchId);
    if (!match) throw new NotFoundException('Jogo não encontrado');

    const wasFinished = match.status === MatchStatus.FINISHED;
    const newStatus = finished ? MatchStatus.FINISHED : MatchStatus.LIVE;

    match.homeScore = homeScore;
    match.awayScore = awayScore;
    match.status = newStatus;
    await match.save();

    // Dispara processamento se acabou de terminar e ainda não foi processado
    if (!wasFinished && finished && !match.resultsProcessed) {
      this.logger.log(`Manual finish: ${match.homeTeam} vs ${match.awayTeam} (${homeScore}x${awayScore})`);
      this.eventEmitter.emit(MATCH_FINISHED_EVENT, match._id.toString());
    }

    return match;
  }

  private mapStatus(short: string): MatchStatus {
    const live     = ['1H', '2H', 'HT', 'ET', 'P', 'LIVE'];
    const finished = ['FT', 'AET', 'PEN'];
    if (live.includes(short))     return MatchStatus.LIVE;
    if (finished.includes(short)) return MatchStatus.FINISHED;
    return MatchStatus.SCHEDULED;
  }
}
