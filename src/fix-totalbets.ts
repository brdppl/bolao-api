import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Bet, BetDocument } from './bets/bet.schema';
import { User, UserDocument } from './users/user.schema';
import * as dotenv from 'dotenv';
dotenv.config();

async function fix() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const betModel = app.get<Model<BetDocument>>(getModelToken(Bet.name));
  const userModel = app.get<Model<UserDocument>>(getModelToken(User.name));

  // Agrupa palpites por usuário e conta
  const counts = await betModel.aggregate([
    { $group: { _id: '$user', total: { $sum: 1 } } },
  ]);

  for (const { _id, total } of counts) {
    await userModel.findByIdAndUpdate(_id, { $set: { totalBets: total } });
    const user = await userModel.findById(_id).select('name email');
    console.log(`  ${user?.name} (${user?.email}): totalBets = ${total}`);
  }

  console.log(`\n✅ ${counts.length} usuário(s) corrigido(s).`);
  await app.close();
}

fix().catch((e) => { console.error(e); process.exit(1); });
