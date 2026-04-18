// src/medecin/medecin.service.ts

import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Medecin } from './entities/medecin.entity';
import { MedecinSpecialite } from './entities/medecin-specialite.entity';
import { MedecinDiplome } from './entities/medecin-diplome.entity';
import { MedecinAccreditation } from './entities/medecin-accreditation.entity';
import { MedecinAffectation } from './entities/medecin-affectation.entity';
import { User, UserRole } from '../auth/users/entities/user.entity';
import { Service } from '../service/service.entity';

import { CreateMedecinDto } from './dto/create-medecin.dto';
import { UpdateMedecinDto } from './dto/update-medecin.dto';
import { CreateSpecialiteDto } from './dto/create-specialite.dto';
import { CreateDiplomeDto } from './dto/create-diplome.dto';
import { CreateAccreditationDto } from './dto/create-accreditation.dto';
import { CreateAffectationDto } from './dto/create-affectation.dto';

@Injectable()
export class MedecinService {
  constructor(
    @InjectRepository(Medecin)
    private readonly medecinRepository: Repository<Medecin>,

    @InjectRepository(MedecinSpecialite)
    private readonly specialiteRepository: Repository<MedecinSpecialite>,

    @InjectRepository(MedecinDiplome)
    private readonly diplomeRepository: Repository<MedecinDiplome>,

    @InjectRepository(MedecinAccreditation)
    private readonly accreditationRepository: Repository<MedecinAccreditation>,

    @InjectRepository(MedecinAffectation)
    private readonly affectationRepository: Repository<MedecinAffectation>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,
  ) {}

  // ── CRÉER UN PROFIL MÉDECIN ───────────────────────────────────────────────
  async create(dto: CreateMedecinDto): Promise<Medecin> {
    const user = await this.userRepository.findOne({ where: { id: dto.userId } });
    if (!user) throw new NotFoundException('Utilisateur introuvable.');
    if (user.role !== UserRole.MEDECIN) {
      throw new BadRequestException('Seul un compte avec le rôle MEDECIN peut avoir un profil médecin.');
    }

    const profilExistant = await this.medecinRepository.findOne({
      where: { user: { id: dto.userId } },
    });
    if (profilExistant) {
      throw new ConflictException('Un profil médecin existe déjà pour cet utilisateur.');
    }

    const ordreExistant = await this.medecinRepository.findOne({
      where: { numeroOrdre: dto.numeroOrdre },
    });
    if (ordreExistant) {
      throw new ConflictException(`Le numéro d'ordre "${dto.numeroOrdre}" est déjà enregistré.`);
    }

    const medecin = this.medecinRepository.create({
      user,
      numeroOrdre:          dto.numeroOrdre,
      dateInscriptionOrdre: dto.dateInscriptionOrdre ?? null,
      statutOrdre:          dto.statutOrdre,
      dateNaissance:        dto.dateNaissance ?? null,
      sexe:                 dto.sexe ?? null,
      nationalite:          dto.nationalite ?? null,
      photoUrl:             dto.photoUrl ?? null,
      telephoneUrgence:     dto.telephoneUrgence ?? null,
      typeContrat:          dto.typeContrat ?? null,
      datePriseDeFonction:  dto.datePriseDeFonction ?? null,
      dateFinContrat:       dto.dateFinContrat ?? null,
    });

    return this.medecinRepository.save(medecin);
  }

  // ── LISTER TOUS LES MÉDECINS ──────────────────────────────────────────────
  async findAll(): Promise<Medecin[]> {
    return this.medecinRepository.find({
      relations: ['user', 'specialites', 'diplomes', 'accreditations', 'affectations', 'affectations.service'],
      order: { createdAt: 'DESC' },
    });
  }

  // ── TROUVER UN MÉDECIN PAR ID ─────────────────────────────────────────────
  async findOne(id: string): Promise<Medecin> {
    const medecin = await this.medecinRepository.findOne({
      where: { id },
      relations: ['user', 'specialites', 'diplomes', 'accreditations', 'affectations', 'affectations.service'],
    });
    if (!medecin) throw new NotFoundException('Profil médecin introuvable.');
    return medecin;
  }

  // ── TROUVER UN MÉDECIN PAR USER ID ───────────────────────────────────────
  async findByUserId(userId: string): Promise<Medecin> {
    const medecin = await this.medecinRepository.findOne({
      where: { user: { id: userId } },
      relations: ['user', 'specialites', 'diplomes', 'accreditations', 'affectations', 'affectations.service'],
    });
    if (!medecin) throw new NotFoundException('Profil médecin introuvable pour cet utilisateur.');
    return medecin;
  }

  // ── MODIFIER UN PROFIL MÉDECIN ────────────────────────────────────────────
  async update(id: string, dto: UpdateMedecinDto): Promise<Medecin> {
    const medecin = await this.findOne(id);

    if (dto.numeroOrdre && dto.numeroOrdre !== medecin.numeroOrdre) {
      const ordreExistant = await this.medecinRepository.findOne({
        where: { numeroOrdre: dto.numeroOrdre },
      });
      if (ordreExistant) {
        throw new ConflictException(`Le numéro d'ordre "${dto.numeroOrdre}" est déjà enregistré.`);
      }
    }

    Object.assign(medecin, dto);
    return this.medecinRepository.save(medecin);
  }

  // ── SPÉCIALITÉS ───────────────────────────────────────────────────────────

  async addSpecialite(medecinId: string, dto: CreateSpecialiteDto): Promise<MedecinSpecialite> {
    const medecin = await this.findOne(medecinId);
    const specialite = this.specialiteRepository.create({
      medecin,
      specialite:    dto.specialite,
      estPrincipale: dto.estPrincipale ?? false,
      dateObtention: dto.dateObtention ?? null,
    });
    return this.specialiteRepository.save(specialite);
  }

  async removeSpecialite(specialiteId: string): Promise<{ message: string }> {
    const specialite = await this.specialiteRepository.findOne({ where: { id: specialiteId } });
    if (!specialite) throw new NotFoundException('Spécialité introuvable.');
    await this.specialiteRepository.delete(specialiteId);
    return { message: 'Spécialité supprimée avec succès.' };
  }

  // ── DIPLÔMES ──────────────────────────────────────────────────────────────

  async addDiplome(medecinId: string, dto: CreateDiplomeDto): Promise<MedecinDiplome> {
    const medecin = await this.findOne(medecinId);
    const diplome = this.diplomeRepository.create({
      medecin,
      intitule:      dto.intitule,
      type:          dto.type,
      etablissement: dto.etablissement ?? null,
      pays:          dto.pays ?? null,
      dateObtention: dto.dateObtention ?? null,
      documentUrl:   dto.documentUrl ?? null,
    });
    return this.diplomeRepository.save(diplome);
  }

  async removeDiplome(diplomeId: string): Promise<{ message: string }> {
    const diplome = await this.diplomeRepository.findOne({ where: { id: diplomeId } });
    if (!diplome) throw new NotFoundException('Diplôme introuvable.');
    await this.diplomeRepository.delete(diplomeId);
    return { message: 'Diplôme supprimé avec succès.' };
  }

  // ── ACCRÉDITATIONS ────────────────────────────────────────────────────────

  async addAccreditation(medecinId: string, dto: CreateAccreditationDto): Promise<MedecinAccreditation> {
    const medecin = await this.findOne(medecinId);
    const accreditation = this.accreditationRepository.create({
      medecin,
      intitule:                dto.intitule,
      organismeCertificateur:  dto.organismeCertificateur ?? null,
      dateObtention:           dto.dateObtention ?? null,
      dateExpiration:          dto.dateExpiration ?? null,
      documentUrl:             dto.documentUrl ?? null,
    });
    return this.accreditationRepository.save(accreditation);
  }

  async removeAccreditation(accreditationId: string): Promise<{ message: string }> {
    const accreditation = await this.accreditationRepository.findOne({ where: { id: accreditationId } });
    if (!accreditation) throw new NotFoundException('Accréditation introuvable.');
    await this.accreditationRepository.delete(accreditationId);
    return { message: 'Accréditation supprimée avec succès.' };
  }

  // ── AFFECTATIONS ──────────────────────────────────────────────────────────

  async addAffectation(medecinId: string, dto: CreateAffectationDto): Promise<MedecinAffectation> {
    const medecin = await this.findOne(medecinId);

    const service = await this.serviceRepository.findOne({ where: { id: dto.serviceId } });
    if (!service) throw new NotFoundException('Service introuvable.');
    if (!service.estActif) {
      throw new BadRequestException('Impossible d\'affecter un médecin à un service inactif.');
    }

    const affectation = this.affectationRepository.create({
      medecin,
      service,
      roleDansService: dto.roleDansService,
      estPrincipal:    dto.estPrincipal ?? false,
      dateDebut:       dto.dateDebut as unknown as Date,
      dateFin:         dto.dateFin ? (dto.dateFin as unknown as Date) : null,
    });
    return this.affectationRepository.save(affectation);
  }

  async getAffectationsActives(medecinId: string): Promise<MedecinAffectation[]> {
    await this.findOne(medecinId); // vérifie que le médecin existe
    return this.affectationRepository.find({
      where: { medecin: { id: medecinId }, estActive: true },
      relations: ['service'],
      order: { dateDebut: 'DESC' },
    });
  }

  async desactiverAffectation(affectationId: string): Promise<MedecinAffectation> {
    const affectation = await this.affectationRepository.findOne({
      where: { id: affectationId },
      relations: ['service'],
    });
    if (!affectation) throw new NotFoundException('Affectation introuvable.');
    if (!affectation.estActive) {
      throw new ConflictException('Cette affectation est déjà inactive.');
    }

    affectation.estActive = false;
    affectation.dateFin   = new Date();
    return this.affectationRepository.save(affectation);
  }
}
