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
import { Pole } from '../service/pole.entity';
import { Service } from '../service/service.entity';
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
    pole: string | null;
  };
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Pole)
    private readonly poleRepository: Repository<Pole>,
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  // ── INSCRIPTION ADMINISTRATEUR (premier admin du système, route publique) ─
  async inscrire(dto: CreateUserDto): Promise<{ message: string }> {
    if (dto.role !== UserRole.ADMINISTRATEUR) {
      throw new ForbiddenException(
        "L'inscription publique est réservée à l'administrateur. Les autres comptes sont créés par l'administrateur.",
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

    // ── Règles métier sur le pôle ─────────────────────────────────────────
    const rolesAvecPole = [UserRole.MEDECIN, UserRole.AGENT_ADMINISTRATIF];
    const rolesSansPole = [UserRole.ADMINISTRATEUR, UserRole.AGENT_RENSEIGNEMENT];

    if (rolesAvecPole.includes(dto.role) && !dto.poleId) {
      throw new BadRequestException(`Le pôle est obligatoire pour le rôle ${dto.role}.`);
    }
    if (rolesSansPole.includes(dto.role) && dto.poleId) {
      throw new BadRequestException(`Le rôle ${dto.role} ne peut pas être associé à un pôle.`);
    }

    // ── Résolution des entités liées ──────────────────────────────────────
    let pole: Pole | null = null;
    if (dto.poleId) {
      pole = await this.poleRepository.findOne({ where: { id: dto.poleId } });
      if (!pole) throw new NotFoundException(`Pôle introuvable (id: ${dto.poleId}).`);
    }

    let service: Service | null = null;
    if (dto.serviceId) {
      service = await this.serviceRepository.findOne({ where: { id: dto.serviceId } });
      if (!service) throw new NotFoundException(`Service introuvable (id: ${dto.serviceId}).`);
    }

    const actif = dto.role === UserRole.ADMINISTRATEUR;

    const user = this.userRepository.create({
      nom:         dto.nom,
      prenom:      dto.prenom,
      email:       dto.email,
      motDePasse:  dto.motDePasse,
      role:        dto.role,
      telephone:   dto.telephone ?? null,
      numeroOrdre: dto.numeroOrdre ?? null,
      pole,
      service,
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
    if (filters.role      !== undefined) where.role    = filters.role;
    if (filters.actif     !== undefined) where.actif   = filters.actif;
    if (filters.poleId    !== undefined) where.pole    = { id: filters.poleId } as any;
    if (filters.serviceId !== undefined) where.service = { id: filters.serviceId } as any;

    return this.userRepository.find({
      select: {
        id:               true,
        nom:              true,
        prenom:           true,
        email:            true,
        role:             true,
        telephone:        true,
        numeroOrdre:      true,
        actif:            true,
        createdAt:        true,
        derniereConnexion:true,
        pole:             { id: true, nom: true },
        service:          { id: true, nom: true, code: true },
        createur:         { id: true, nom: true, prenom: true },
      },
      relations: { pole: true, service: true, createur: true },
      where,
      order: { createdAt: 'DESC' },
    });
  }

  // ── VOIR UN UTILISATEUR ───────────────────────────────────────────────────
  async voirUtilisateur(userId: string): Promise<Partial<User>> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: {
        id:               true,
        nom:              true,
        prenom:           true,
        email:            true,
        role:             true,
        telephone:        true,
        numeroOrdre:      true,
        actif:            true,
        createdAt:        true,
        updatedAt:        true,
        derniereConnexion:true,
        pole:             { id: true, nom: true },
        service:          { id: true, nom: true, code: true },
        createur:         { id: true, nom: true, prenom: true },
      },
      relations: { pole: true, service: true, createur: true },
    });
    if (!user) throw new NotFoundException('Utilisateur introuvable.');
    return user;
  }

  // ── MODIFIER LES INFOS D'UN COMPTE ───────────────────────────────────────
  async modifierCompte(userId: string, dto: UpdateUserDto): Promise<{ message: string }> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: { pole: true, service: true },
    });
    if (!user) throw new NotFoundException('Utilisateur introuvable.');

    if (dto.email && dto.email !== user.email) {
      const emailExistant = await this.userRepository.findOne({ where: { email: dto.email } });
      if (emailExistant) throw new ConflictException('Cette adresse email est déjà utilisée.');
    }

    if (dto.nom)       user.nom       = dto.nom;
    if (dto.prenom)    user.prenom    = dto.prenom;
    if (dto.email)     user.email     = dto.email;
    if (dto.telephone !== undefined) user.telephone = dto.telephone ?? null;
    if (dto.numeroOrdre !== undefined) user.numeroOrdre = dto.numeroOrdre ?? null;

    if (dto.poleId !== undefined) {
      if (dto.poleId === null || dto.poleId === '') {
        user.pole = null;
      } else {
        const pole = await this.poleRepository.findOne({ where: { id: dto.poleId } });
        if (!pole) throw new NotFoundException(`Pôle introuvable (id: ${dto.poleId}).`);
        user.pole = pole;
      }
    }

    if (dto.serviceId !== undefined) {
      if (dto.serviceId === null || dto.serviceId === '') {
        user.service = null;
      } else {
        const service = await this.serviceRepository.findOne({ where: { id: dto.serviceId } });
        if (!service) throw new NotFoundException(`Service introuvable (id: ${dto.serviceId}).`);
        user.service = service;
      }
    }

    await this.userRepository.save(user);
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
      relations: { pole: true, service: true },
    });
    if (!user) throw new NotFoundException('Utilisateur introuvable.');

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

  // ── CONNEXION ─────────────────────────────────────────────────────────────
  async login(dto: LoginDto): Promise<AuthResponse> {
    const user = await this.userRepository.findOne({
      where: { email: dto.email },
      select: {
        id: true, nom: true, prenom: true, email: true,
        motDePasse: true, role: true, actif: true,
        pole: { id: true, nom: true },
      },
      relations: { pole: true },
    });

    if (!user) throw new UnauthorizedException('Identifiants incorrects.');
    if (!user.actif) {
      throw new UnauthorizedException('Votre compte est inactif. Contactez un administrateur.');
    }

    const motDePasseValide = await bcrypt.compare(dto.motDePasse, user.motDePasse);
    if (!motDePasseValide) throw new UnauthorizedException('Identifiants incorrects.');

    const tokens = await this._genererTokens(user);
    await this._sauvegarderRefreshToken(user.id, tokens.refreshToken);
    await this.userRepository.update(user.id, { derniereConnexion: new Date() });

    return {
      tokens,
      user: {
        id:     user.id,
        nom:    user.nom,
        prenom: user.prenom,
        email:  user.email,
        role:   user.role,
        pole:   user.pole?.nom ?? null,
      },
    };
  }

  // ── RAFRAÎCHIR LES TOKENS ─────────────────────────────────────────────────
  async rafraichirTokens(userId: string): Promise<AuthTokens> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('Utilisateur introuvable.');

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
      select: {
        id:          true,
        nom:         true,
        prenom:      true,
        email:       true,
        role:        true,
        telephone:   true,
        numeroOrdre: true,
        createdAt:   true,
        pole:        { id: true, nom: true },
        service:     { id: true, nom: true, code: true },
      },
      relations: { pole: true, service: true },
    });
    if (!user) throw new NotFoundException('Utilisateur introuvable.');
    return user;
  }

  // ── Privé : génération tokens ─────────────────────────────────────────────
  private async _genererTokens(user: User): Promise<AuthTokens> {
    const payload: JwtPayload = {
      sub:   user.id,
      email: user.email,
      role:  user.role as string,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync({ ...payload }, {
        secret:    this.configService.get<string>('JWT_SECRET'),
        expiresIn: this.configService.get('JWT_EXPIRES_IN', '900') as any,
      }),
      this.jwtService.signAsync({ ...payload }, {
        secret:    this.configService.get<string>('JWT_REFRESH_SECRET'),
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
