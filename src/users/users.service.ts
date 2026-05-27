import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User, UserDocument } from './user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(name: string, email: string, password: string, role = 'user'): Promise<UserDocument> {
    const existing = await this.userModel.findOne({ email: email.toLowerCase() });
    if (existing) throw new ConflictException('Email já cadastrado');

    const hashed = await bcrypt.hash(password, 10);
    const user = new this.userModel({ name, email, password: hashed, role });
    return user.save();
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email: email.toLowerCase() });
  }

  async findById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id);
  }

  async getRanking(): Promise<UserDocument[]> {
    return this.userModel
      .find({ active: true, role: 'user' })
      .select('-password')
      .sort({ totalPoints: -1, exactScores: -1, correctWinners: -1 })
      .lean();
  }

  async promoteToAdmin(email: string): Promise<{ name: string; email: string; role: string } | null> {
    const user = await this.userModel.findOneAndUpdate(
      { email: email.toLowerCase() },
      { $set: { role: 'admin' } },
      { new: true },
    ).select('name email role');
    return user ? { name: user.name, email: user.email, role: user.role } : null;
  }

  async incrementBetCount(userId: string): Promise<void> {
    await this.userModel.findByIdAndUpdate(userId, { $inc: { totalBets: 1 } });
  }

  async updateStats(
    userId: string,
    points: number,
    isExact: boolean,
    isCorrectWinner: boolean,
  ): Promise<void> {
    await this.userModel.findByIdAndUpdate(userId, {
      $inc: {
        totalPoints: points,
        exactScores: isExact ? 1 : 0,
        correctWinners: isCorrectWinner ? 1 : 0,
      },
    });
  }
}
