import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(name: string, email: string, password: string, inviteCode: string) {
    const validCode = this.configService.get<string>('INVITE_CODE');
    if (inviteCode !== validCode) {
      throw new BadRequestException('Código de convite inválido');
    }

    const user = await this.usersService.create(name, email, password);
    const token = this.signToken(user._id.toString(), user.role);
    return { token, user: this.sanitize(user) };
  }

  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException('Credenciais inválidas');

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new UnauthorizedException('Credenciais inválidas');

    const token = this.signToken(user._id.toString(), user.role);
    return { token, user: this.sanitize(user) };
  }

  private signToken(userId: string, role: string): string {
    return this.jwtService.sign({ sub: userId, role });
  }

  private sanitize(user: any) {
    const { password, ...rest } = user.toObject ? user.toObject() : user;
    return rest;
  }
}
