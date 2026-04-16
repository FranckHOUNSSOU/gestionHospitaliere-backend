import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User, UserRole } from './users/entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from './users/dto/create-user.dto';
import { CreateUserByAdminDto } from './users/dto/create-user-by-admin.dto';
import { UpdateUserDto } from './users/dto/update-user.dto';
import { UpdateRoleDto } from './users/dto/update-role.dto';
import { ResetPasswordDto } from './users/dto/reset-password.dto';
import { FilterUsersDto } from './users/dto/filter-users.dto';
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

  // ── INSCRIPTION ADMINISTRATEUR (premier admin du système, route publique) ─
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

    const user = this.userRepository.create({ ...dto, actif: true, createur: null });
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

    const actif = dto.role === UserRole.ADMINISTRATEUR ? true : false;

    const user = this.userRepository.create({
      ...dto,
      actif,
      createur: { id: adminId } as User,
    });
    await this.userRepository.save(user);

    const statut = actif ? 'actif' : 'inactif par défaut';
    return { message: `Compte ${dto.role} créé avec succès. Il est ${statut}.` };
  }

  // ── ACTIVATION D'UN COMPTE ────────────────────────────────────────────────
  async activerCompte(userId: string): Promise<{ message: string }> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('Utilisateur introuvable.');
    if (user.actif) throw new ConflictException('Ce compte est déjà actif.');

    await this.userRepository.update(userId, { actif: true });
    return { message: 'Compte activé avec succès.' };
  }

  // ── DÉSACTIVATION D'UN COMPTE ─────────────────────────────────────────────
  async desactiverCompte(userId: string): Promise<{ message: string }> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('Utilisateur introuvable.');
    if (!user.actif) throw new ConflictException('Ce compte est déjà inactif.');

    await this.userRepository.update(userId, { actif: false });
    return { message: 'Compte désactivé avec succès.' };
  }

  // ── LISTE DES UTILISATEURS (avec filtres optionnels) ─────────────────────
  async listerUtilisateurs(filters: FilterUsersDto): Promise<Partial<User>[]> {
    const where: FindOptionsWhere<User> = {};
    if (filters.role !== undefined) where.role = filters.role;
    if (filters.actif !== undefined) where.actif = filters.actif;
    if (filters.service !== undefined) where.service = filters.service;

    return this.userRepository.find({
      select: {
        id: true,
        nom: true,
        prenom: true,
        email: true,
        role: true,
        service: true,
        telephone: true,
        numeroOrdre: true,
        actif: true,
        createdAt: true,
        createur: { id: true, nom: true, prenom: true },
      },
      relations: { createur: true },
      where,
      order: { createdAt: 'DESC' },
    });
  }

  // ── VOIR UN UTILISATEUR ───────────────────────────────────────────────────
  async voirUtilisateur(userId: string): Promise<Partial<User>> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: {
        id: true,
        nom: true,
        prenom: true,
        email: true,
        role: true,
        service: true,
        telephone: true,
        numeroOrdre: true,
        actif: true,
        createdAt: true,
        updatedAt: true,
        createur: { id: true, nom: true, prenom: true },
      },
      relations: { createur: true },
    });
    if (!user) throw new NotFoundException('Utilisateur introuvable.');
    return user;
  }

  // ── MODIFIER LES INFOS D'UN COMPTE ───────────────────────────────────────
  async modifierCompte(userId: string, dto: UpdateUserDto): Promise<{ message: string }> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('Utilisateur introuvable.');

    if (dto.email && dto.email !== user.email) {
      const emailExistant = await this.userRepository.findOne({ where: { email: dto.email } });
      if (emailExistant) throw new ConflictException('Cette adresse email est déjà utilisée.');
    }

    await this.userRepository.update(userId, dto);
    return { message: 'Compte mis à jour avec succès.' };
  }

  // ── CHANGER LE RÔLE D'UN COMPTE ──────────────────────────────────────────
  async changerRole(userId: string, dto: UpdateRoleDto): Promise<{ message: string }> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('Utilisateur introuvable.');
    if (user.role === dto.role) {
      throw new BadRequestException(`L'utilisateur a déjà le rôle ${dto.role}.`);
    }

    await this.userRepository.update(userId, { role: dto.role });
    return { message: `Rôle mis à jour : ${dto.role}.` };
  }

  // ── RÉINITIALISER LE MOT DE PASSE ────────────────────────────────────────
  async reinitialiserMotDePasse(userId: string, dto: ResetPasswordDto): Promise<{ message: string }> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: ['id', 'nom', 'prenom', 'email', 'motDePasse', 'role', 'actif', 'service', 'telephone', 'numeroOrdre'],
    });
    if (!user) throw new NotFoundException('Utilisateur introuvable.');

    // On utilise save() pour déclencher le hook @BeforeUpdate qui hash le mot de passe
    user.motDePasse = dto.nouveauMotDePasse;
    await this.userRepository.save(user);
    return { message: 'Mot de passe réinitialisé avec succès.' };
  }

  // ── SUPPRIMER UN COMPTE ───────────────────────────────────────────────────
  async supprimerCompte(userId: string): Promise<{ message: string }> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('Utilisateur introuvable.');

    await this.userRepository.delete(userId);
    return { message: 'Compte supprimé avec succès.' };
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