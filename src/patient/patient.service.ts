// src/patient/patient.service.ts

import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Patient } from './entities/patient.entity';
import { Allergie } from './entities/allergie.entity';
import { TraitementARisque } from './entities/traitement-a-risque.entity';
import { ContactUrgence } from './entities/contact-urgence.entity';
import { CouvertureSociale } from './entities/couverture-sociale.entity';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { CreateAllergieDto } from './dto/create-allergie.dto';
import { CreateTraitementARisqueDto } from './dto/create-traitement-a-risque.dto';
import { CreateContactUrgenceDto } from './dto/create-contact-urgence.dto';
import { CreateCouvertureSocialeDto } from './dto/create-couverture-sociale.dto';

@Injectable()
export class PatientService {
  constructor(
    @InjectRepository(Patient)
    private readonly patientRepo: Repository<Patient>,
    @InjectRepository(Allergie)
    private readonly allergieRepo: Repository<Allergie>,
    @InjectRepository(TraitementARisque)
    private readonly traitementRepo: Repository<TraitementARisque>,
    @InjectRepository(ContactUrgence)
    private readonly contactRepo: Repository<ContactUrgence>,
    @InjectRepository(CouvertureSociale)
    private readonly couvertureRepo: Repository<CouvertureSociale>,
  ) {}

  // ── PATIENT ───────────────────────────────────────────────────────────────

  async create(dto: CreatePatientDto): Promise<Patient> {
    const existing = await this.patientRepo.findOne({ where: { numeroIpp: dto.numeroIpp } });
    if (existing) {
      throw new ConflictException(`Un patient avec le numéro IPP "${dto.numeroIpp}" existe déjà.`);
    }
    const patient = this.patientRepo.create({
      ...dto,
      dateNaissance:           new Date(dto.dateNaissance),
      date1ereDetermination:   dto.date1ereDetermination   ? new Date(dto.date1ereDetermination)   : null,
      date2emeDetermination:   dto.date2emeDetermination   ? new Date(dto.date2emeDetermination)   : null,
    } as Partial<Patient>);
    return this.patientRepo.save(patient);
  }

  async findAll(): Promise<Patient[]> {
    return this.patientRepo.find({
      relations: ['allergies', 'traitementsARisque', 'contactsUrgence', 'couverturesSociales'],
      order: { nom: 'ASC', prenom: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Patient> {
    const patient = await this.patientRepo.findOne({
      where: { id },
      relations: ['allergies', 'traitementsARisque', 'contactsUrgence', 'couverturesSociales'],
    });
    if (!patient) throw new NotFoundException(`Patient introuvable (id: ${id}).`);
    return patient;
  }

  async findByNumeroIPP(ipp: string): Promise<Patient> {
    const patient = await this.patientRepo.findOne({
      where: { numeroIpp: ipp },
      relations: ['allergies', 'traitementsARisque', 'contactsUrgence', 'couverturesSociales'],
    });
    if (!patient) throw new NotFoundException(`Patient introuvable (IPP: ${ipp}).`);
    return patient;
  }

  async update(id: string, dto: UpdatePatientDto): Promise<Patient> {
    const patient = await this.findOne(id);
    if (dto.numeroIpp && dto.numeroIpp !== patient.numeroIpp) {
      const conflict = await this.patientRepo.findOne({ where: { numeroIpp: dto.numeroIpp } });
      if (conflict) {
        throw new ConflictException(`Le numéro IPP "${dto.numeroIpp}" est déjà utilisé.`);
      }
    }
    Object.assign(patient, dto);
    return this.patientRepo.save(patient);
  }

  async getDossierComplet(id: string): Promise<Patient> {
    const patient = await this.patientRepo.findOne({
      where: { id },
      relations: [
        'allergies',
        'traitementsARisque',
        'contactsUrgence',
        'couverturesSociales',
        'sejours',
      ],
    });
    if (!patient) throw new NotFoundException(`Patient introuvable (id: ${id}).`);
    return patient;
  }

  // ── ALLERGIES ─────────────────────────────────────────────────────────────

  async addAllergie(patientId: string, dto: CreateAllergieDto): Promise<Allergie> {
    const patient = await this.findOne(patientId);
    const allergie = this.allergieRepo.create({ ...dto, patient } as Partial<Allergie>);
    return this.allergieRepo.save(allergie);
  }

  async removeAllergie(allergieId: string): Promise<{ message: string }> {
    const allergie = await this.allergieRepo.findOne({ where: { id: allergieId } });
    if (!allergie) throw new NotFoundException(`Allergie introuvable (id: ${allergieId}).`);
    await this.allergieRepo.remove(allergie);
    return { message: 'Allergie supprimée avec succès.' };
  }

  // ── TRAITEMENTS À RISQUE ──────────────────────────────────────────────────

  async addTraitementARisque(patientId: string, dto: CreateTraitementARisqueDto): Promise<TraitementARisque> {
    const patient = await this.findOne(patientId);
    const traitement = this.traitementRepo.create({ ...dto, patient } as Partial<TraitementARisque>);
    return this.traitementRepo.save(traitement);
  }

  async removeTraitementARisque(id: string): Promise<{ message: string }> {
    const traitement = await this.traitementRepo.findOne({ where: { id } });
    if (!traitement) throw new NotFoundException(`Traitement à risque introuvable (id: ${id}).`);
    await this.traitementRepo.remove(traitement);
    return { message: 'Traitement à risque supprimé avec succès.' };
  }

  // ── CONTACTS D'URGENCE ────────────────────────────────────────────────────

  async addContactUrgence(patientId: string, dto: CreateContactUrgenceDto): Promise<ContactUrgence> {
    const patient = await this.findOne(patientId);
    const contact = this.contactRepo.create({ ...dto, patient } as Partial<ContactUrgence>);
    return this.contactRepo.save(contact);
  }

  async removeContactUrgence(id: string): Promise<{ message: string }> {
    const contact = await this.contactRepo.findOne({ where: { id } });
    if (!contact) throw new NotFoundException(`Contact d'urgence introuvable (id: ${id}).`);
    await this.contactRepo.remove(contact);
    return { message: 'Contact d\'urgence supprimé avec succès.' };
  }

  // ── COUVERTURES SOCIALES ──────────────────────────────────────────────────

  async addCouvertureSociale(patientId: string, dto: CreateCouvertureSocialeDto): Promise<CouvertureSociale> {
    const patient = await this.findOne(patientId);
    const couverture = this.couvertureRepo.create({
      ...dto,
      patient,
      dateDebut: new Date(dto.dateDebut),
      dateFin:   dto.dateFin ? new Date(dto.dateFin) : null,
    } as Partial<CouvertureSociale>);
    return this.couvertureRepo.save(couverture);
  }

  async desactiverCouvertureSociale(id: string): Promise<CouvertureSociale> {
    const couverture = await this.couvertureRepo.findOne({ where: { id } });
    if (!couverture) throw new NotFoundException(`Couverture sociale introuvable (id: ${id}).`);
    couverture.estActive = false;
    return this.couvertureRepo.save(couverture);
  }
}
