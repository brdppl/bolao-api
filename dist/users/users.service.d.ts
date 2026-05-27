import { Model } from 'mongoose';
import { UserDocument } from './user.schema';
export declare class UsersService {
    private userModel;
    constructor(userModel: Model<UserDocument>);
    create(name: string, email: string, password: string, role?: string): Promise<UserDocument>;
    findByEmail(email: string): Promise<UserDocument | null>;
    findById(id: string): Promise<UserDocument | null>;
    getRanking(): Promise<UserDocument[]>;
    incrementBetCount(userId: string): Promise<void>;
    updateStats(userId: string, points: number, isExact: boolean, isCorrectWinner: boolean): Promise<void>;
}
