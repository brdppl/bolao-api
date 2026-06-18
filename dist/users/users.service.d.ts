import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';
export declare class UsersService {
    private userModel;
    constructor(userModel: Model<UserDocument>);
    create(name: string, email: string, password: string, role?: string): Promise<UserDocument>;
    findByEmail(email: string): Promise<UserDocument | null>;
    findById(id: string): Promise<UserDocument | null>;
    findByIdSafe(id: string): Promise<(User & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }) | null>;
    getRanking(): Promise<UserDocument[]>;
    getPaidRanking(): Promise<UserDocument[]>;
    promoteToAdmin(email: string): Promise<{
        name: string;
        email: string;
        role: string;
    } | null>;
    incrementBetCount(userId: string): Promise<void>;
    updateStats(userId: string, points: number, isExact: boolean, isCorrectWinner: boolean): Promise<void>;
    getAllUsers(): Promise<Omit<UserDocument, 'password'>[]>;
    setActive(userId: string, active: boolean): Promise<void>;
    setRole(userId: string, role: 'user' | 'admin'): Promise<void>;
    setPaid(userId: string, paid: boolean): Promise<void>;
    countAll(): Promise<number>;
    sumTotalBets(): Promise<number>;
}
