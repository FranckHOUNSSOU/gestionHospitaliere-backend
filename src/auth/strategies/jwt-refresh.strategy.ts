// src/auth/strategies/jwt-refresh.strategy.ts


import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, StrategyOptionsWithRequest } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import type { Request } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    const jwtRefreshSecret = configService.get<string>('JWT_REFRESH_SECRET');
    if (!jwtRefreshSecret) {
      throw new Error('JWT_REFRESH_SECRET is not defined in environment variables');
    }
    const options: StrategyOptionsWithRequest = {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtRefreshSecret,
      passReqToCallback: true,
    };
    super(options);
  }

  async validate(req: Request, payload: { sub: string; email: string }): Promise<User> {
    const authHeader = req.headers.authorization;
    if (!authHeader) throw new UnauthorizedException('Refresh token manquant.');

    const refreshToken = authHeader.replace('Bearer ', '').trim();

    const user = await this.userRepository.findOne({
      where: { id: payload.sub, actif: true },
      select: ['id', 'email', 'role', 'actif', 'refreshToken'],
    });

    if (!user || !user.refreshToken) {
      throw new UnauthorizedException('Session expirée. Veuillez vous reconnecter.');
    }

    const tokenValide = await bcrypt.compare(refreshToken, user.refreshToken);
    if (!tokenValide) {
      throw new UnauthorizedException('Refresh token invalide.');
    }

    return user;
  }
}