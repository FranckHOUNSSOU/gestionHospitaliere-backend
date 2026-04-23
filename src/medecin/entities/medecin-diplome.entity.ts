// src/medecin/entities/medecin-diplome.entity.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Medecin } from './medecin.entity';

export enum TypeDiplome {
  DOCTORAT = 'Doctorat',
  DES      = 'DES',
  DESC     = 'DESC',
  DU       = 'DU',
  DIU      = 'DIU',
  MASTER   = 'Master',
  AUTRE    = 'Autre',
}

@Entity('medecin_diplomes')
export class MedecinDiplome {
  @ApiProperty({ example: 'uuid-xxxx-xxxx', description: 'Identifiant unique (UUID)' })
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Medecin, m => m.diplomes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'medecin_id' })
  medecin!: Medecin;

  @ApiProperty({ example: 'Diplôme d\'État de Docteur en Médecine', description: 'Intitulé du diplôme' })
  @Column({ length: 200 })
  intitule!: string;

  @ApiProperty({ enum: TypeDiplome, description: 'Type de diplôme' })
  @Column({ type: 'enum', enum: TypeDiplome })
  type!: TypeDiplome;

  @ApiPropertyOptional({ example: 'Université d\'Abomey-Calavi', description: 'Établissement d\'obtention', nullable: true })
  @Column({ type: 'varchar', length: 150, nullable: true })
  etablissement!: string | null;

  @ApiPropertyOptional({ example: 'Bénin', description: 'Pays d\'obtention du diplôme', nullable: true })
  @Column({ type: 'varchar', length: 50, nullable: true })
  pays!: string | null;

  @ApiPropertyOptional({ example: '2010-06-30', description: 'Date d\'obtention', nullable: true })
  @Column({ name: 'date_obtention', type: 'date', nullable: true })
  dateObtention!: Date | null;

  @ApiPropertyOptional({ example: 'https://storage.hopital.bj/docs/diplome.pdf', description: 'URL du document justificatif', nullable: true })
  @Column({ name: 'document_url', type: 'varchar', length: 255, nullable: true })
  documentUrl!: string | null;

  @ApiProperty({ example: '2026-04-14T10:00:00.000Z', description: 'Date de création' })
  @CreateDateColumn()
  createdAt!: Date;
}
