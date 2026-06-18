import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
declare class RegisterDto {
    name: string;
    email: string;
    password: string;
    inviteCode: string;
}
declare class LoginDto {
    email: string;
    password: string;
}
export declare class AuthController {
    private authService;
    private usersService;
    constructor(authService: AuthService, usersService: UsersService);
    register(dto: RegisterDto): Promise<{
        token: string;
        user: any;
    }>;
    login(dto: LoginDto): Promise<{
        token: string;
        user: any;
    }>;
    me(user: any): Promise<(import("../users/user.schema").User & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }) | null>;
}
export {};
