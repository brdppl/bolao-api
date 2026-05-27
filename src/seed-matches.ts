import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Match, MatchDocument, MatchPhase, MatchStatus } from './matches/match.schema';
import { getModelToken } from '@nestjs/mongoose';
import * as dotenv from 'dotenv';
dotenv.config();

// BRT = UTC-3
function brt(date: string, time: string): Date {
  return new Date(`${date}T${time}:00-03:00`);
}

const FLAGS: Record<string, string> = {
  'México': 'https://flagcdn.com/w80/mx.png',
  'África do Sul': 'https://flagcdn.com/w80/za.png',
  'Coreia do Sul': 'https://flagcdn.com/w80/kr.png',
  'República Tcheca': 'https://flagcdn.com/w80/cz.png',
  'Canadá': 'https://flagcdn.com/w80/ca.png',
  'Bósnia e Herzegovina': 'https://flagcdn.com/w80/ba.png',
  'Qatar': 'https://flagcdn.com/w80/qa.png',
  'Suíça': 'https://flagcdn.com/w80/ch.png',
  'Brasil': 'https://flagcdn.com/w80/br.png',
  'Marrocos': 'https://flagcdn.com/w80/ma.png',
  'Haiti': 'https://flagcdn.com/w80/ht.png',
  'Escócia': 'https://flagcdn.com/w80/gb-sct.png',
  'Estados Unidos': 'https://flagcdn.com/w80/us.png',
  'Paraguai': 'https://flagcdn.com/w80/py.png',
  'Austrália': 'https://flagcdn.com/w80/au.png',
  'Turquia': 'https://flagcdn.com/w80/tr.png',
  'Alemanha': 'https://flagcdn.com/w80/de.png',
  'Curaçau': 'https://flagcdn.com/w80/cw.png',
  'Costa do Marfim': 'https://flagcdn.com/w80/ci.png',
  'Equador': 'https://flagcdn.com/w80/ec.png',
  'Holanda': 'https://flagcdn.com/w80/nl.png',
  'Japão': 'https://flagcdn.com/w80/jp.png',
  'Suécia': 'https://flagcdn.com/w80/se.png',
  'Tunísia': 'https://flagcdn.com/w80/tn.png',
  'Bélgica': 'https://flagcdn.com/w80/be.png',
  'Egito': 'https://flagcdn.com/w80/eg.png',
  'Irã': 'https://flagcdn.com/w80/ir.png',
  'Nova Zelândia': 'https://flagcdn.com/w80/nz.png',
  'Espanha': 'https://flagcdn.com/w80/es.png',
  'Cabo Verde': 'https://flagcdn.com/w80/cv.png',
  'Arábia Saudita': 'https://flagcdn.com/w80/sa.png',
  'Uruguai': 'https://flagcdn.com/w80/uy.png',
  'França': 'https://flagcdn.com/w80/fr.png',
  'Senegal': 'https://flagcdn.com/w80/sn.png',
  'Iraque': 'https://flagcdn.com/w80/iq.png',
  'Noruega': 'https://flagcdn.com/w80/no.png',
  'Argentina': 'https://flagcdn.com/w80/ar.png',
  'Argélia': 'https://flagcdn.com/w80/dz.png',
  'Áustria': 'https://flagcdn.com/w80/at.png',
  'Jordânia': 'https://flagcdn.com/w80/jo.png',
  'Portugal': 'https://flagcdn.com/w80/pt.png',
  'RD Congo': 'https://flagcdn.com/w80/cd.png',
  'Uzbequistão': 'https://flagcdn.com/w80/uz.png',
  'Colômbia': 'https://flagcdn.com/w80/co.png',
  'Inglaterra': 'https://flagcdn.com/w80/gb-eng.png',
  'Croácia': 'https://flagcdn.com/w80/hr.png',
  'Gana': 'https://flagcdn.com/w80/gh.png',
  'Panamá': 'https://flagcdn.com/w80/pa.png',
};

interface GroupDef {
  teams: [string, string, string, string];
  r1: [string, string]; // [date, time] for Game1 (T0vT1)
  r1b: [string, string]; // Game2 (T2vT3)
  r2: [string, string]; // Game3 (T0vT2)
  r2b: [string, string]; // Game4 (T1vT3)
  r3: [string, string]; // Game5 (T0vT3) - simultaneous with r3b
  r3b: [string, string]; // Game6 (T1vT2)
}

const GROUPS: Record<string, GroupDef> = {
  A: {
    teams: ['México', 'África do Sul', 'Coreia do Sul', 'República Tcheca'],
    r1:  ['2026-06-11', '16:00'], r1b: ['2026-06-11', '22:00'],
    r2:  ['2026-06-17', '16:00'], r2b: ['2026-06-17', '19:00'],
    r3:  ['2026-06-25', '16:00'], r3b: ['2026-06-25', '16:00'],
  },
  B: {
    teams: ['Canadá', 'Bósnia e Herzegovina', 'Qatar', 'Suíça'],
    r1:  ['2026-06-12', '16:00'], r1b: ['2026-06-12', '19:00'],
    r2:  ['2026-06-18', '16:00'], r2b: ['2026-06-18', '19:00'],
    r3:  ['2026-06-25', '19:00'], r3b: ['2026-06-25', '19:00'],
  },
  C: {
    teams: ['Brasil', 'Marrocos', 'Haiti', 'Escócia'],
    r1:  ['2026-06-13', '19:00'], r1b: ['2026-06-13', '22:00'],
    r2:  ['2026-06-19', '21:30'], r2b: ['2026-06-19', '16:00'],
    r3:  ['2026-06-24', '19:00'], r3b: ['2026-06-24', '19:00'],
  },
  D: {
    teams: ['Estados Unidos', 'Paraguai', 'Austrália', 'Turquia'],
    r1:  ['2026-06-12', '22:00'], r1b: ['2026-06-13', '16:00'],
    r2:  ['2026-06-18', '22:00'], r2b: ['2026-06-19', '19:00'],
    r3:  ['2026-06-24', '22:00'], r3b: ['2026-06-24', '22:00'],
  },
  E: {
    teams: ['Alemanha', 'Curaçau', 'Costa do Marfim', 'Equador'],
    r1:  ['2026-06-14', '13:00'], r1b: ['2026-06-14', '16:00'],
    r2:  ['2026-06-20', '13:00'], r2b: ['2026-06-20', '16:00'],
    r3:  ['2026-06-25', '22:00'], r3b: ['2026-06-25', '22:00'],
  },
  F: {
    teams: ['Holanda', 'Japão', 'Suécia', 'Tunísia'],
    r1:  ['2026-06-14', '19:00'], r1b: ['2026-06-14', '22:00'],
    r2:  ['2026-06-20', '19:00'], r2b: ['2026-06-20', '22:00'],
    r3:  ['2026-06-26', '16:00'], r3b: ['2026-06-26', '16:00'],
  },
  G: {
    teams: ['Bélgica', 'Egito', 'Irã', 'Nova Zelândia'],
    r1:  ['2026-06-15', '13:00'], r1b: ['2026-06-15', '16:00'],
    r2:  ['2026-06-21', '13:00'], r2b: ['2026-06-21', '16:00'],
    r3:  ['2026-06-26', '19:00'], r3b: ['2026-06-26', '19:00'],
  },
  H: {
    teams: ['Espanha', 'Cabo Verde', 'Arábia Saudita', 'Uruguai'],
    r1:  ['2026-06-15', '19:00'], r1b: ['2026-06-15', '22:00'],
    r2:  ['2026-06-21', '19:00'], r2b: ['2026-06-21', '22:00'],
    r3:  ['2026-06-26', '22:00'], r3b: ['2026-06-26', '22:00'],
  },
  I: {
    teams: ['França', 'Senegal', 'Iraque', 'Noruega'],
    r1:  ['2026-06-16', '13:00'], r1b: ['2026-06-16', '16:00'],
    r2:  ['2026-06-22', '13:00'], r2b: ['2026-06-22', '16:00'],
    r3:  ['2026-06-27', '13:00'], r3b: ['2026-06-27', '13:00'],
  },
  J: {
    teams: ['Argentina', 'Argélia', 'Áustria', 'Jordânia'],
    r1:  ['2026-06-16', '19:00'], r1b: ['2026-06-16', '22:00'],
    r2:  ['2026-06-22', '19:00'], r2b: ['2026-06-22', '22:00'],
    r3:  ['2026-06-27', '16:00'], r3b: ['2026-06-27', '16:00'],
  },
  K: {
    teams: ['Portugal', 'RD Congo', 'Uzbequistão', 'Colômbia'],
    r1:  ['2026-06-17', '13:00'], r1b: ['2026-06-17', '16:00'],
    r2:  ['2026-06-23', '13:00'], r2b: ['2026-06-23', '16:00'],
    r3:  ['2026-06-27', '19:00'], r3b: ['2026-06-27', '19:00'],
  },
  L: {
    teams: ['Inglaterra', 'Croácia', 'Gana', 'Panamá'],
    r1:  ['2026-06-17', '19:00'], r1b: ['2026-06-17', '22:00'],
    r2:  ['2026-06-23', '19:00'], r2b: ['2026-06-23', '22:00'],
    r3:  ['2026-06-27', '22:00'], r3b: ['2026-06-27', '22:00'],
  },
};

function makeMatch(
  home: string,
  away: string,
  kickoff: Date,
  phase: MatchPhase,
  group: string,
  round: number,
  apiId: number,
) {
  return {
    apiMatchId: apiId,
    homeTeam: home,
    awayTeam: away,
    homeTeamFlag: FLAGS[home] ?? '',
    awayTeamFlag: FLAGS[away] ?? '',
    kickoff,
    status: MatchStatus.SCHEDULED,
    phase,
    group,
    homeScore: null,
    awayScore: null,
    resultsProcessed: false,
    round,
  };
}

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const matchModel = app.get<Model<MatchDocument>>(getModelToken(Match.name));

  const existing = await matchModel.countDocuments();
  if (existing > 0) {
    console.log(`Already have ${existing} matches. Drop manually if you want to re-seed.`);
    await app.close();
    return;
  }

  const matches: any[] = [];
  let apiId = 90000; // fake sequential IDs (no API)

  // ── FASE DE GRUPOS ──────────────────────────────────────────────
  for (const [grpKey, g] of Object.entries(GROUPS)) {
    const label = `Grupo ${grpKey}`;
    const [t0, t1, t2, t3] = g.teams;

    // Round 1
    matches.push(makeMatch(t0, t1, brt(g.r1[0],  g.r1[1]),  MatchPhase.GROUP, label, 1, apiId++));
    matches.push(makeMatch(t2, t3, brt(g.r1b[0], g.r1b[1]), MatchPhase.GROUP, label, 1, apiId++));
    // Round 2
    matches.push(makeMatch(t0, t2, brt(g.r2[0],  g.r2[1]),  MatchPhase.GROUP, label, 2, apiId++));
    matches.push(makeMatch(t1, t3, brt(g.r2b[0], g.r2b[1]), MatchPhase.GROUP, label, 2, apiId++));
    // Round 3 (simultaneous)
    matches.push(makeMatch(t0, t3, brt(g.r3[0],  g.r3[1]),  MatchPhase.GROUP, label, 3, apiId++));
    matches.push(makeMatch(t1, t2, brt(g.r3b[0], g.r3b[1]), MatchPhase.GROUP, label, 3, apiId++));
  }

  // ── FASE ELIMINATÓRIA — placeholders ─────────────────────────────
  const KO_MATCHES = [
    // Rodada de 32 (dezesseis-avos)
    { home: 'A Definir', away: 'A Definir', date: '2026-06-28', time: '13:00', phase: MatchPhase.ROUND_OF_32, group: 'Rodada de 32', round: 1 },
    { home: 'A Definir', away: 'A Definir', date: '2026-06-28', time: '17:00', phase: MatchPhase.ROUND_OF_32, group: 'Rodada de 32', round: 1 },
    { home: 'A Definir', away: 'A Definir', date: '2026-06-28', time: '21:00', phase: MatchPhase.ROUND_OF_32, group: 'Rodada de 32', round: 1 },
    { home: 'A Definir', away: 'A Definir', date: '2026-06-29', time: '13:00', phase: MatchPhase.ROUND_OF_32, group: 'Rodada de 32', round: 1 },
    { home: 'A Definir', away: 'A Definir', date: '2026-06-29', time: '17:00', phase: MatchPhase.ROUND_OF_32, group: 'Rodada de 32', round: 1 },
    { home: 'A Definir', away: 'A Definir', date: '2026-06-29', time: '21:00', phase: MatchPhase.ROUND_OF_32, group: 'Rodada de 32', round: 1 },
    { home: 'A Definir', away: 'A Definir', date: '2026-06-30', time: '13:00', phase: MatchPhase.ROUND_OF_32, group: 'Rodada de 32', round: 1 },
    { home: 'A Definir', away: 'A Definir', date: '2026-06-30', time: '17:00', phase: MatchPhase.ROUND_OF_32, group: 'Rodada de 32', round: 1 },
    { home: 'A Definir', away: 'A Definir', date: '2026-06-30', time: '21:00', phase: MatchPhase.ROUND_OF_32, group: 'Rodada de 32', round: 1 },
    { home: 'A Definir', away: 'A Definir', date: '2026-07-01', time: '13:00', phase: MatchPhase.ROUND_OF_32, group: 'Rodada de 32', round: 1 },
    { home: 'A Definir', away: 'A Definir', date: '2026-07-01', time: '17:00', phase: MatchPhase.ROUND_OF_32, group: 'Rodada de 32', round: 1 },
    { home: 'A Definir', away: 'A Definir', date: '2026-07-01', time: '21:00', phase: MatchPhase.ROUND_OF_32, group: 'Rodada de 32', round: 1 },
    { home: 'A Definir', away: 'A Definir', date: '2026-07-02', time: '13:00', phase: MatchPhase.ROUND_OF_32, group: 'Rodada de 32', round: 1 },
    { home: 'A Definir', away: 'A Definir', date: '2026-07-02', time: '17:00', phase: MatchPhase.ROUND_OF_32, group: 'Rodada de 32', round: 1 },
    { home: 'A Definir', away: 'A Definir', date: '2026-07-02', time: '21:00', phase: MatchPhase.ROUND_OF_32, group: 'Rodada de 32', round: 1 },
    { home: 'A Definir', away: 'A Definir', date: '2026-07-03', time: '21:00', phase: MatchPhase.ROUND_OF_32, group: 'Rodada de 32', round: 1 },
    // Oitavas de final
    { home: 'A Definir', away: 'A Definir', date: '2026-07-04', time: '13:00', phase: MatchPhase.ROUND_OF_16, group: 'Oitavas de Final', round: 1 },
    { home: 'A Definir', away: 'A Definir', date: '2026-07-04', time: '17:00', phase: MatchPhase.ROUND_OF_16, group: 'Oitavas de Final', round: 1 },
    { home: 'A Definir', away: 'A Definir', date: '2026-07-05', time: '13:00', phase: MatchPhase.ROUND_OF_16, group: 'Oitavas de Final', round: 1 },
    { home: 'A Definir', away: 'A Definir', date: '2026-07-05', time: '17:00', phase: MatchPhase.ROUND_OF_16, group: 'Oitavas de Final', round: 1 },
    { home: 'A Definir', away: 'A Definir', date: '2026-07-06', time: '13:00', phase: MatchPhase.ROUND_OF_16, group: 'Oitavas de Final', round: 1 },
    { home: 'A Definir', away: 'A Definir', date: '2026-07-06', time: '17:00', phase: MatchPhase.ROUND_OF_16, group: 'Oitavas de Final', round: 1 },
    { home: 'A Definir', away: 'A Definir', date: '2026-07-07', time: '13:00', phase: MatchPhase.ROUND_OF_16, group: 'Oitavas de Final', round: 1 },
    { home: 'A Definir', away: 'A Definir', date: '2026-07-07', time: '17:00', phase: MatchPhase.ROUND_OF_16, group: 'Oitavas de Final', round: 1 },
    // Quartas de final
    { home: 'A Definir', away: 'A Definir', date: '2026-07-09', time: '16:00', phase: MatchPhase.QUARTER_FINAL, group: 'Quartas de Final', round: 1 },
    { home: 'A Definir', away: 'A Definir', date: '2026-07-10', time: '13:00', phase: MatchPhase.QUARTER_FINAL, group: 'Quartas de Final', round: 1 },
    { home: 'A Definir', away: 'A Definir', date: '2026-07-11', time: '13:00', phase: MatchPhase.QUARTER_FINAL, group: 'Quartas de Final', round: 1 },
    { home: 'A Definir', away: 'A Definir', date: '2026-07-11', time: '17:00', phase: MatchPhase.QUARTER_FINAL, group: 'Quartas de Final', round: 1 },
    // Semifinais
    { home: 'A Definir', away: 'A Definir', date: '2026-07-14', time: '16:00', phase: MatchPhase.SEMI_FINAL, group: 'Semifinal', round: 1 },
    { home: 'A Definir', away: 'A Definir', date: '2026-07-15', time: '16:00', phase: MatchPhase.SEMI_FINAL, group: 'Semifinal', round: 1 },
    // 3º lugar
    { home: 'A Definir', away: 'A Definir', date: '2026-07-18', time: '16:00', phase: MatchPhase.THIRD_PLACE, group: '3º Lugar', round: 1 },
    // Final
    { home: 'A Definir', away: 'A Definir', date: '2026-07-19', time: '16:00', phase: MatchPhase.FINAL, group: 'Final', round: 1 },
  ];

  for (const m of KO_MATCHES) {
    matches.push(makeMatch(m.home, m.away, brt(m.date, m.time), m.phase, m.group, m.round, apiId++));
  }

  await matchModel.insertMany(matches);
  console.log(`✅ ${matches.length} jogos criados (72 fase de grupos + ${KO_MATCHES.length} fase eliminatória)`);
  await app.close();
}

seed().catch((e) => { console.error(e); process.exit(1); });
