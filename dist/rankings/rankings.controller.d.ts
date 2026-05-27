import { UsersService } from '../users/users.service';
export declare class RankingsController {
    private usersService;
    constructor(usersService: UsersService);
    getRanking(): Promise<import("../users/user.schema").UserDocument[]>;
    getPaidRanking(): Promise<import("../users/user.schema").UserDocument[]>;
}
