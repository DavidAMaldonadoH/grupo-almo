import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UsersService } from '../users/users.service';
import { User } from '../users/user.schema';
import { LoginDto } from './dtos/login.dto';
import type { AuthResponse, AuthUser, JwtPayload } from './auth.schema';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginDto): Promise<AuthResponse> {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const passwordMatches = await bcrypt.compare(
      String(dto.password),
      user.passwordHash,
    );
    if (!passwordMatches)
      throw new UnauthorizedException('Invalid credentials');

    const payload: JwtPayload = { sub: user.id, email: user.email };
    const access_token = await this.jwtService.signAsync(payload);

    return { access_token, user: this.toAuthUser(user) };
  }

  async getProfile(userId: number): Promise<AuthUser> {
    const user = await this.usersService.findOne(userId);
    return {
      id: String(user.id),
      email: user.email,
      name: this.nameFromEmail(user.email),
    };
  }

  private toAuthUser(user: User): AuthUser {
    return {
      id: String(user.id),
      email: user.email,
      name: this.nameFromEmail(user.email),
    };
  }

  private nameFromEmail(email: string): string {
    return email.split('@')[0];
  }
}
