// src/service/lit.entity.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Chambre } from './chambre.entity';

export enum TypeLit {
  STANDARD    = 'Standard',
  REANIMATION = 'Réanimation',
  MATERNITE   = 'Maternité',
  PEDIATRIQUE = 'Pédiatrique',
  BARIATRIQUE = 'Bariatrique',
}

export enum StatutLit {
  LIBRE         = 'Libre',
  OCCUPE        = 'Occupé',
  EN_ENTRETIEN  = 'En entretien',
  HORS_SERVICE  = 'Hors service',
}

@Entity('lits')
export class Lit {
  @ApiProperty({ example: 'uuid-xxxx-xxxx', description: 'Identifiant unique (UUID)' })
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ApiProperty({ example: 'A', description: 'Numéro ou lettre du lit (unique dans la chambre)' })
  @Column({ length: 10 })
  numero!: string;

  @ApiProperty({ enum: TypeLit, example: TypeLit.STANDARD, description: 'Type de lit' })
  @Column({ type: 'enum', enum: TypeLit, default: TypeLit.STANDARD })
  type!: TypeLit;

  @ApiProperty({ enum: StatutLit, example: StatutLit.LIBRE, description: 'Statut actuel du lit' })
  @Column({ type: 'enum', enum: StatutLit, default: StatutLit.LIBRE })
  statut!: StatutLit;

  @ApiProperty({ description: 'Chambre à laquelle appartient le lit' })
  @ManyToOne(() => Chambre, { onDelete: 'RESTRICT', eager: true })
  @JoinColumn({ name: 'chambre_id' })
  chambre!: Chambre;

  @ApiProperty({ example: '2026-04-14T10:00:00.000Z', description: 'Date de création' })
  @CreateDateColumn()
  createdAt!: Date;

  @ApiProperty({ example: '2026-04-14T10:00:00.000Z', description: 'Date de dernière modification' })
  @UpdateDateColumn()
  updatedAt!: Date;
}
