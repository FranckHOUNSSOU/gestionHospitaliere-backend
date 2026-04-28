// src/service/lit.service.ts

import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lit } from './lit.entity';
import { ChambreService } from './chambre.service';
import { CreateLitDto } from './dto/create-lit.dto';
import { UpdateLitDto } from './dto/update-lit.dto';
import { UpdateStatutLitDto } from './dto/update-statut-lit.dto';
import { TypeLit } from './lit.entity';

@Injectable()
export class LitService {
  constructor(
    @InjectRepository(Lit)
    private readonly litRepository: Repository<Lit>,
    private readonly chambreService: ChambreService,
  ) {}

  // ── AJOUTER UN LIT DANS UNE CHAMBRE ──────────────────────────────────────
  async create(chambreId: string, dto: CreateLitDto): Promise<Lit> {
    const chambre = await this.chambreService.findOne(chambreId);

    const numeroExistant = await this.litRepository.findOne({
      where: { numero: dto.numero, chambre: { id: chambreId } },
    });
    if (numeroExistant) {
      throw new ConflictException(
        `Le lit "${dto.numero}" existe déjà dans cette chambre.`,
      );
    }

    const lit = this.litRepository.create({
      numero: dto.numero,
      type:   dto.type ?? TypeLit.STANDARD,
      chambre,
    });
    return this.litRepository.save(lit);
  }

  // ── LISTER LES LITS D'UNE CHAMBRE ────────────────────────────────────────
  async findByChambre(chambreId: string): Promise<Lit[]> {
    await this.chambreService.findOne(chambreId);
    return this.litRepository.find({
      where: { chambre: { id: chambreId } },
      order: { numero: 'ASC' },
    });
  }

  // ── TROUVER UN LIT PAR ID ─────────────────────────────────────────────────
  async findOne(id: string): Promise<Lit> {
    const lit = await this.litRepository.findOne({ where: { id } });
    if (!lit) throw new NotFoundException('Lit introuvable.');
    return lit;
  }

  // ── METTRE À JOUR UN LIT ──────────────────────────────────────────────────
  async update(id: string, dto: UpdateLitDto): Promise<Lit> {
    const lit = await this.findOne(id);

    if (dto.numero && dto.numero !== lit.numero) {
      const numeroExistant = await this.litRepository.findOne({
        where: { numero: dto.numero, chambre: { id: lit.chambre.id } },
      });
      if (numeroExistant) {
        throw new ConflictException(
          `Le lit "${dto.numero}" existe déjà dans cette chambre.`,
        );
      }
    }

    Object.assign(lit, dto);
    return this.litRepository.save(lit);
  }

  // ── CHANGER LE STATUT D'UN LIT ────────────────────────────────────────────
  async updateStatut(id: string, dto: UpdateStatutLitDto): Promise<Lit> {
    const lit = await this.findOne(id);
    lit.statut = dto.statut;
    return this.litRepository.save(lit);
  }
}
