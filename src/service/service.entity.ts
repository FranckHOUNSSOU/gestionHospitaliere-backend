// src/service/service.entity.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum TypeService {
  MEDECINE    = 'Médecine',
  CHIRURGIE   = 'Chirurgie',
  URGENCES    = 'Urgences',
  REANIMATION = 'Réanimation',
  MATERNITE   = 'Maternité',
  PEDIATRIE   = 'Pédiatrie',
  PSYCHIATRIE = 'Psychiatrie',
  REEDUCATION = 'Rééducation',
  IMAGERIE    = 'Imagerie',
  LABORATOIRE = 'Laboratoire',
  AUTRE       = 'Autre',
}

@Entity('services')
export class Service {
  @ApiProperty({ example: 'uuid-xxxx-xxxx', description: 'Identifiant unique (UUID)' })
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ApiProperty({ example: 'Cardiologie', description: 'Nom du service' })
  @Column({ length: 100 })
  nom!: string;

  @ApiProperty({ example: 'CARDIO', description: 'Code unique du service' })
  @Column({ length: 20, unique: true })
  code!: string;

  @ApiProperty({ enum: TypeService, description: 'Type de service médical' })
  @Column({ type: 'enum', enum: TypeService })
  type!: TypeService;

  @ApiPropertyOptional({ example: '2ème', description: 'Étage du service', nullable: true })
  @Column({ type: 'varchar', length: 20, nullable: true })
  etage!: string | null;

  @ApiPropertyOptional({ example: 'Bâtiment A', description: 'Bâtiment', nullable: true })
  @Column({ type: 'varchar', length: 50, nullable: true })
  batiment!: string | null;

  @ApiPropertyOptional({ example: '+22997000000', description: 'Téléphone du service', nullable: true })
  @Column({ type: 'varchar', length: 20, nullable: true })
  telephone!: string | null;

  @ApiProperty({ example: true, description: 'Indique si le service est actif' })
  @Column({ name: 'est_actif', default: true })
  estActif!: boolean;

  @ApiProperty({ example: '2026-04-14T10:00:00.000Z', description: 'Date de création' })
  @CreateDateColumn()
  createdAt!: Date;

  @ApiProperty({ example: '2026-04-14T10:00:00.000Z', description: 'Date de dernière modification' })
  @UpdateDateColumn()
  updatedAt!: Date;
}
