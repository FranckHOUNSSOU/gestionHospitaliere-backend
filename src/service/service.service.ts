// src/service/service.service.ts

import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Service } from './service.entity';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';

@Injectable()
export class ServiceService {
  constructor(
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,
  ) {}

  // ── CRÉER UN SERVICE ──────────────────────────────────────────────────────
  async create(dto: CreateServiceDto): Promise<Service> {
    const codeExistant = await this.serviceRepository.findOne({
      where: { code: dto.code },
    });
    if (codeExistant) {
      throw new ConflictException(`Le code "${dto.code}" est déjà attribué à un autre service.`);
    }

    const service = this.serviceRepository.create({
      ...dto,
      etage:     dto.etage     ?? null,
      batiment:  dto.batiment  ?? null,
      telephone: dto.telephone ?? null,
    });
    return this.serviceRepository.save(service);
  }

  // ── LISTER TOUS LES SERVICES ──────────────────────────────────────────────
  async findAll(): Promise<Service[]> {
    return this.serviceRepository.find({ order: { nom: 'ASC' } });
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

    Object.assign(service, dto);
    return this.serviceRepository.save(service);
  }

  // ── ACTIVER / DÉSACTIVER UN SERVICE ──────────────────────────────────────
  async toggleActif(id: string): Promise<Service> {
    const service = await this.findOne(id);
    service.estActif = !service.estActif;
    return this.serviceRepository.save(service);
  }
}
