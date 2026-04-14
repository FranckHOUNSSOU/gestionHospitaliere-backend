// src/auth/auth.service.ts

import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User } from './users/entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from './users/dto/create-user.dto';
import { JwtPayload } from './strategies/jwt.strategy';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  tokens: AuthTokens;
  user: {
    id: string;
    nom: string;
    prenom: string;
    email: string;
    role: string;
    service: string | null;
  };
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  // ── INSCRIPTION ──────────────────────────────────────────────────────────
  async inscrire(dto: CreateUserDto): Promise<{ message: string }> {
    const existant = await this.userRepository.findOne({
      where: { email: dto.email },
    });

    if (existant) {
      throw new ConflictException('Cette adresse email est déjà utilisée.');
    }

    const user = this.userRepository.create({
      ...dto,
      actif: false, // le compte est désactivé jusqu'à validation par l'admin
    });

    await this.userRepository.save(user);

    return {
      message:
        'Votre demande a été enregistrée. Votre compte sera activé par un administrateur.',
    };
  }

  // ── CONNEXION ─────────────────────────────────────────────────────────────
  async login(dto: LoginDto): Promise<AuthResponse> {
    // Récupération avec le mot de passe (select: false sur la colonne)
    const user = await this.userRepository.findOne({
      where: { email: dto.email },
      select: ['id', 'nom', 'prenom', 'email', 'motDePasse', 'role', 'service', 'actif'],
    });

    if (!user) {
      throw new UnauthorizedException('Identifiants incorrects.');
    }

    if (!user.actif) {
      throw new UnauthorizedException(
        'Votre compte est inactif. Contactez un administrateur.',
      );
    }

    const motDePasseValide = await bcrypt.compare(dto.motDePasse, user.motDePasse);
    if (!motDePasseValide) {
      throw new UnauthorizedException('Identifiants incorrects.');
    }

    const tokens = await this._genererTokens(user);
    await this._sauvegarderRefreshToken(user.id, tokens.refreshToken);

    return {
      tokens,
      user: {
        id: user.id,
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        role: user.role,
        service: user.service ?? null,
      },
    };
  }

  // ── RAFRAÎCHISSEMENT DES TOKENS ───────────────────────────────────────────
  async rafraichirTokens(userId: string): Promise<AuthTokens> {
    const user = await this.userRepository.findOne({
      where: { id: userId, actif: true },
    });

    if (!user) {
      throw new NotFoundException('Utilisateur introuvable.');
    }

    const tokens = await this._genererTokens(user);
    await this._sauvegarderRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  // ── DÉCONNEXION ───────────────────────────────────────────────────────────
  async logout(userId: string): Promise<{ message: string }> {
    await this.userRepository.update(userId, { refreshToken: null });
    return { message: 'Déconnexion réussie.' };
  }

  // ── PROFIL UTILISATEUR CONNECTÉ ───────────────────────────────────────────
  async profil(userId: string): Promise<Partial<User>> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: ['id', 'nom', 'prenom', 'email', 'role', 'service', 'telephone', 'numeroOrdre', 'createdAt'],
    });

    if (!user) throw new NotFoundException('Utilisateur introuvable.');

    return user;
  }

  // ── MÉTHODES PRIVÉES ──────────────────────────────────────────────────────

  private async _genererTokens(user: User): Promise<AuthTokens> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: this.configService.get('JWT_EXPIRES_IN', '15m') as any,
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN', '7d') as any,
      }),
    ]);

    return { accessToken, refreshToken };
  }

  private async _sauvegarderRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<void> {
    const salt = await bcrypt.genSalt(10);
    const refreshTokenHashe = await bcrypt.hash(refreshToken, salt);
    await this.userRepository.update(userId, { refreshToken: refreshTokenHashe });
  }
}