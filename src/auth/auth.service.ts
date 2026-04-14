import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User, UserRole } from './users/entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from './users/dto/create-user.dto';
import { CreateUserByAdminDto } from './users/dto/create-user-by-admin.dto';
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

  // ── INSCRIPTION ADMINISTRATEUR (unique dans le système) ──────────────────
  async inscrire(dto: CreateUserDto): Promise<{ message: string }> {
    if (dto.role !== UserRole.ADMINISTRATEUR) {
      throw new ForbiddenException(
        'L\'inscription publique est réservée à l\'administrateur. Les autres comptes sont créés par l\'administrateur.',
      );
    }

    const adminExistant = await this.userRepository.findOne({
      where: { role: UserRole.ADMINISTRATEUR },
    });
    if (adminExistant) {
      throw new ConflictException('Un administrateur existe déjà dans le système.');
    }

    const emailExistant = await this.userRepository.findOne({
      where: { email: dto.email },
    });
    if (emailExistant) {
      throw new ConflictException('Cette adresse email est déjà utilisée.');
    }

    const user = this.userRepository.create({ ...dto, actif: true, createdBy: null });
    await this.userRepository.save(user);

    return { message: 'Compte administrateur créé et activé.' };
  }

  // ── CRÉATION DE COMPTE PAR L'ADMINISTRATEUR ───────────────────────────────
  async creerCompteParAdmin(
    adminId: string,
    dto: CreateUserByAdminDto,
  ): Promise<{ message: string }> {
    const emailExistant = await this.userRepository.findOne({
      where: { email: dto.email },
    });
    if (emailExistant) {
      throw new ConflictException('Cette adresse email est déjà utilisée.');
    }

    const user = this.userRepository.create({
      ...dto,
      actif: false,
      createdBy: adminId,
    });
    await this.userRepository.save(user);

    return { message: `Compte ${dto.role} créé avec succès. Il est inactif par défaut.` };
  }

  // ── ACTIVATION D'UN COMPTE ────────────────────────────────────────────────
  async activerCompte(userId: string): Promise<{ message: string }> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('Utilisateur introuvable.');
    if (user.role === UserRole.ADMINISTRATEUR) {
      throw new ForbiddenException('Le compte administrateur ne peut pas être modifié ainsi.');
    }
    if (user.actif) throw new ConflictException('Ce compte est déjà actif.');

    await this.userRepository.update(userId, { actif: true });
    return { message: 'Compte activé avec succès.' };
  }

  // ── DÉSACTIVATION D'UN COMPTE ─────────────────────────────────────────────
  async desactiverCompte(userId: string): Promise<{ message: string }> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('Utilisateur introuvable.');
    if (user.role === UserRole.ADMINISTRATEUR) {
      throw new ForbiddenException('Le compte administrateur ne peut pas être désactivé.');
    }
    if (!user.actif) throw new ConflictException('Ce compte est déjà inactif.');

    await this.userRepository.update(userId, { actif: false });
    return { message: 'Compte désactivé avec succès.' };
  }

  // ── LISTE DES UTILISATEURS ────────────────────────────────────────────────
  async listerUtilisateurs(): Promise<Partial<User>[]> {
    return this.userRepository.find({
      select: ['id', 'nom', 'prenom', 'email', 'role', 'service', 'telephone', 'actif', 'createdBy', 'createdAt'],
      order: { createdAt: 'DESC' },
    });
  }

  async login(dto: LoginDto): Promise<AuthResponse> {
    const user = await this.userRepository.findOne({
      where: { email: dto.email },
      select: ['id', 'nom', 'prenom', 'email', 'motDePasse', 'role', 'service', 'actif'],
    });

    if (!user) {
      throw new UnauthorizedException('Identifiants incorrects.');
    }

    if (!user.actif) {
      throw new UnauthorizedException('Votre compte est inactif. Contactez un administrateur.');
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

  async rafraichirTokens(userId: string): Promise<AuthTokens> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('Utilisateur introuvable.');
    }

    const tokens = await this._genererTokens(user);
    await this._sauvegarderRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  async logout(userId: string): Promise<{ message: string }> {
    await this.userRepository.update(userId, { refreshToken: null });
    return { message: 'Déconnexion réussie.' };
  }

  async profil(userId: string): Promise<Partial<User>> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: ['id', 'nom', 'prenom', 'email', 'role', 'service', 'telephone', 'numeroOrdre', 'createdAt'],
    });

    if (!user) throw new NotFoundException('Utilisateur introuvable.');

    return user;
  }

private async _genererTokens(user: User): Promise<AuthTokens> {
  const payload: JwtPayload = {
    sub: user.id,
    email: user.email,
    role: user.role as string,  // cast explicite enum -> string
  };

  const [accessToken, refreshToken] = await Promise.all([
    this.jwtService.signAsync({ ...payload }, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: this.configService.get('JWT_EXPIRES_IN', '900') as any,
    }),
    this.jwtService.signAsync({ ...payload }, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN', '604800') as any,
    }),
  ]);

  return { accessToken, refreshToken };
}

  private async _sauvegarderRefreshToken(userId: string, refreshToken: string): Promise<void> {
    const hash = await bcrypt.hash(refreshToken, 10);
    await this.userRepository.update(userId, { refreshToken: hash });
  }
}