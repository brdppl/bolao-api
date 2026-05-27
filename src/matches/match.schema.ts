import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MatchDocument = Match & Document;

export enum MatchStatus {
  SCHEDULED = 'scheduled',
  LIVE = 'live',
  FINISHED = 'finished',
  CANCELLED = 'cancelled',
}

export enum MatchPhase {
  GROUP = 'group',
  ROUND_OF_32 = 'round_of_32',
  ROUND_OF_16 = 'round_of_16',
  QUARTER_FINAL = 'quarter_final',
  SEMI_FINAL = 'semi_final',
  THIRD_PLACE = 'third_place',
  FINAL = 'final',
}

@Schema({ timestamps: true })
export class Match {
  @Prop({ required: true })
  apiMatchId: number;

  @Prop({ required: true })
  homeTeam: string;

  @Prop({ required: true })
  awayTeam: string;

  @Prop()
  homeTeamFlag: string;

  @Prop()
  awayTeamFlag: string;

  @Prop({ required: true })
  kickoff: Date;

  @Prop({ default: MatchStatus.SCHEDULED, enum: Object.values(MatchStatus) })
  status: MatchStatus;

  @Prop({ default: MatchPhase.GROUP, enum: Object.values(MatchPhase) })
  phase: MatchPhase;

  @Prop()
  group: string;

  @Prop({ type: Number, default: null })
  homeScore: number | null;

  @Prop({ type: Number, default: null })
  awayScore: number | null;

  @Prop({ default: false })
  resultsProcessed: boolean;

  @Prop({ default: 1 })
  round: number;
}

export const MatchSchema = SchemaFactory.createForClass(Match);
