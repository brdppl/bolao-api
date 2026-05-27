import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
export declare class AuthService {
    private usersService;
    private jwtService;
    private configService;
    constructor(usersService: UsersService, jwtService: JwtService, configService: ConfigService);
    register(name: string, email: string, password: string, inviteCode: string): Promise<{
        token: string;
        user: any;
    }>;
    login(email: string, password: string): Promise<{
        token: string;
        user: any;
    }>;
    private signToken;
    private sanitize;
}
