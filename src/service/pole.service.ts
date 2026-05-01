// src/service/pole.service.ts

import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pole } from './pole.entity';
import { Service } from './service.entity';
import { Chambre } from './chambre.entity';
import { Lit } from './lit.entity';
import { MedecinAffectation } from '../medecin/entities/medecin-affectation.entity';
import { User, UserRole } from '../auth/users/entities/user.entity';
import { CreatePoleDto } from './dto/create-pole.dto';
import { UpdatePoleDto } from './dto/update-pole.dto';

@Injectable()
export class PoleService {
  constructor(
    @InjectRepository(Pole)
    private readonly poleRepository: Repository<Pole>,
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,
    @InjectRepository(Chambre)
    private readonly chambreRepository: Repository<Chambre>,
    @InjectRepository(Lit)
    private readonly litRepository: Repository<Lit>,
    @InjectRepository(MedecinAffectation)
    private readonly affectationRepository: Repository<MedecinAffectation>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // ── CRÉER UN PÔLE ─────────────────────────────────────────────────────────
  async create(dto: CreatePoleDto): Promise<Pole> {
    const existant = await this.poleRepository.findOne({ where: { nom: dto.nom } });
    if (existant) {
      throw new ConflictException(`Le pôle "${dto.nom}" existe déjà.`);
    }
    const pole = this.poleRepository.create({
      nom:         dto.nom,
      description: dto.description ?? null,
    });
    return this.poleRepository.save(pole);
  }

  // ── LISTER TOUS LES PÔLES (simple) ───────────────────────────────────────
  async findAll(): Promise<Pole[]> {
    return this.poleRepository.find({ order: { nom: 'ASC' } });
  }

  // ── TROUVER UN PÔLE PAR ID (simple) ──────────────────────────────────────
  async findOne(id: string): Promise<Pole> {
    const pole = await this.poleRepository.findOne({ where: { id } });
    if (!pole) throw new NotFoundException('Pôle introuvable.');
    return pole;
  }

  // ── VUE COMPLÈTE D'UN PÔLE ────────────────────────────────────────────────
  // Retourne : pôle + ses services + médecins par service + chambres par service + lits par chambre
  // + agents administratifs et médecins rattachés au pôle
  async findOneWithDetails(id: string): Promise<any> {
    const pole = await this.findOne(id);

    // 1. Services du pôle
    const services = await this.serviceRepository.find({
      where: { pole: { id } },
      order: { nom: 'ASC' },
    });

    // 2. Pour chaque service : chambres + médecins affectés
    const servicesDetails = await Promise.all(
      services.map(async (service) => {
        // Chambres du service
        const chambres = await this.chambreRepository.find({
          where: { service: { id: service.id } },
          order: { numero: 'ASC' },
        });

        // Lits de chaque chambre
        const chambresAvecLits = await Promise.all(
          chambres.map(async (chambre) => {
            const lits = await this.litRepository.find({
              where: { chambre: { id: chambre.id } },
              order: { numero: 'ASC' },
            });
            return { ...chambre, lits };
          }),
        );

        // Médecins affectés à ce service
        const affectations = await this.affectationRepository.find({
          where: { service: { id: service.id }, estActive: true },
          relations: ['medecin', 'medecin.user'],
        });

        return {
          ...service,
          chambres: chambresAvecLits,
          medecins: affectations.map((a) => ({
            affectationId:    a.id,
            roleDansService:  a.roleDansService,
            estPrincipal:     a.estPrincipal,
            dateDebut:        a.dateDebut,
            dateFin:          a.dateFin,
            medecin:          a.medecin,
          })),
        };
      }),
    );

    // 3. Agents administratifs rattachés à ce pôle
    const agents = await this.userRepository.find({
      where: { pole: { id: pole.id }, role: UserRole.AGENT_ADMINISTRATIF },
      select: { id: true, nom: true, prenom: true, email: true, telephone: true, actif: true },
    });

    // 4. Médecins rattachés à ce pôle
    const medecinsUtilisateurs = await this.userRepository.find({
      where: { pole: { id: pole.id }, role: UserRole.MEDECIN },
      select: { id: true, nom: true, prenom: true, email: true, telephone: true, actif: true },
    });

    return {
      ...pole,
      services:            servicesDetails,
      agentsAdministratifs: agents,
      medecins:            medecinsUtilisateurs,
    };
  }

  // ── METTRE À JOUR UN PÔLE ─────────────────────────────────────────────────
  async update(id: string, dto: UpdatePoleDto): Promise<Pole> {
    const pole = await this.findOne(id);
    Object.assign(pole, dto);
    return this.poleRepository.save(pole);
  }

  // ── SUPPRIMER UN PÔLE ─────────────────────────────────────────────────────
  async remove(id: string): Promise<{ message: string }> {
    await this.findOne(id);

    const servicesLies = await this.serviceRepository.count({
      where: { pole: { id } },
    });
    if (servicesLies > 0) {
      throw new BadRequestException(
        `Impossible de supprimer ce pôle : il contient ${servicesLies} service(s). Supprimez-les d'abord.`,
      );
    }

    await this.poleRepository.delete(id);
    return { message: 'Pôle supprimé avec succès.' };
  }
}
