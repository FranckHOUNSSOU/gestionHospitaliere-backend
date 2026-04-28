// src/service/service.service.ts

import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Service } from './service.entity';
import { Pole } from './pole.entity';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';

@Injectable()
export class ServiceService {
  constructor(
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,
    @InjectRepository(Pole)
    private readonly poleRepository: Repository<Pole>,
  ) {}

  // ── CRÉER UN SERVICE ──────────────────────────────────────────────────────
  async create(dto: CreateServiceDto): Promise<Service> {
    const codeExistant = await this.serviceRepository.findOne({
      where: { code: dto.code },
    });
    if (codeExistant) {
      throw new ConflictException(`Le code "${dto.code}" est déjà attribué à un autre service.`);
    }

    const pole = await this.poleRepository.findOne({ where: { id: dto.poleId } });
    if (!pole) throw new NotFoundException(`Pôle introuvable (id: ${dto.poleId}).`);

    const service = this.serviceRepository.create({
      nom:       dto.nom,
      code:      dto.code,
      type:      dto.type,
      pole,
      etage:     dto.etage     ?? null,
      batiment:  dto.batiment  ?? null,
      telephone: dto.telephone ?? null,
    });
    return this.serviceRepository.save(service);
  }

  // ── LISTER TOUS LES SERVICES (filtre optionnel par pôle) ─────────────────
  async findAll(poleId?: string): Promise<Service[]> {
    return this.serviceRepository.find({
      where: poleId ? { pole: { id: poleId } } : {},
      order: { nom: 'ASC' },
    });
  }

  // ── TROUVER UN SERVICE PAR ID ─────────────────────────────────────────────
  async findOne(id: string): Promise<Service> {
    const service = await this.serviceRepository.findOne({ where: { id } });
    if (!service) throw new NotFoundException('Service introuvable.');
    return service;
  }

  // ── METTRE À JOUR UN SERVICE ──────────────────────────────────────────────
  async update(id: string, dto: UpdateServiceDto): Promise<Service> {
    const service = await this.findOne(id);

    if (dto.code && dto.code !== service.code) {
      const codeExistant = await this.serviceRepository.findOne({
        where: { code: dto.code },
      });
      if (codeExistant) {
        throw new ConflictException(`Le code "${dto.code}" est déjà attribué à un autre service.`);
      }
    }

    if (dto.poleId && dto.poleId !== service.pole?.id) {
      const pole = await this.poleRepository.findOne({ where: { id: dto.poleId } });
      if (!pole) throw new NotFoundException(`Pôle introuvable (id: ${dto.poleId}).`);
      service.pole = pole;
    }

    const { poleId: _, ...rest } = dto;
    Object.assign(service, rest);
    return this.serviceRepository.save(service);
  }

  // ── ACTIVER / DÉSACTIVER UN SERVICE ──────────────────────────────────────
  async toggleActif(id: string): Promise<Service> {
    const service = await this.findOne(id);
    service.estActif = !service.estActif;
    return this.serviceRepository.save(service);
  }
}
