import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../users/user.schema';
import { Match } from '../matches/match.schema';

export type BetDocument = Bet & Document;

@Schema({ timestamps: true })
export class Bet {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: User;

  @Prop({ type: Types.ObjectId, ref: 'Match', required: true })
  match: Match;

  @Prop({ required: true, min: 0 })
  homeScore: number;

  @Prop({ required: true, min: 0 })
  awayScore: number;

  @Prop({ default: 0 })
  points: number;

  @Prop({ default: false })
  processed: boolean;

  @Prop({ type: String, default: null })
  resultType: string | null;
}

export const BetSchema = SchemaFactory.createForClass(Bet);

BetSchema.index({ user: 1, match: 1 }, { unique: true });
