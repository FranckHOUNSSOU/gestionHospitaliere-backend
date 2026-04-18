// src/patient/entities/compte-rendu.entity.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Sejour } from './sejour.entity';
import { Medecin } from '../../medecin/entities/medecin.entity';

export enum TypeCompteRendu {
  CONSULTATION = 'Consultation',
  OPERATOIRE   = 'Opératoire',
  SORTIE       = 'Sortie',
  TRANSFERT    = 'Transfert',
  AUTRE        = 'Autre',
}

@Entity('comptes_rendus')
export class CompteRendu {
  @ApiProperty({ example: 'uuid-xxxx', description: 'Identifiant unique (UUID)' })
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Sejour, s => s.comptesRendus, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sejour_id' })
  sejour!: Sejour;

  @ManyToOne(() => Medecin, { onDelete: 'SET NULL', nullable: true, eager: true })
  @JoinColumn({ name: 'medecin_id' })
  medecin!: Medecin | null;

  @ApiProperty({ enum: TypeCompteRendu, description: 'Type de compte rendu' })
  @Column({ type: 'enum', enum: TypeCompteRendu })
  type!: TypeCompteRendu;

  @ApiProperty({ example: '2024-01-20T14:00:00.000Z', description: 'Date du compte rendu' })
  @Column({ type: 'timestamp' })
  date!: Date;

  @ApiPropertyOptional({ example: 'Chirurgie', description: 'Spécialité', nullable: true })
  @Column({ type: 'varchar', length: 100, nullable: true })
  specialite!: string | null;

  @ApiProperty({ example: 'Patient opéré sous AG...', description: 'Contenu du compte rendu' })
  @Column({ type: 'text' })
  contenu!: string;

  @ApiPropertyOptional({ example: 'Dr. MARTIN - Médecin traitant', description: 'Destinataire', nullable: true })
  @Column({ type: 'varchar', length: 150, nullable: true })
  destinataire!: string | null;

  @ApiPropertyOptional({ example: 'https://...', description: 'URL du fichier joint', nullable: true })
  @Column({ name: 'fichier_url', type: 'varchar', length: 255, nullable: true })
  fichierUrl!: string | null;

  @ApiProperty({ example: '2026-04-14T10:00:00.000Z', description: 'Date de création' })
  @CreateDateColumn()
  createdAt!: Date;

  @ApiProperty({ example: '2026-04-14T10:00:00.000Z', description: 'Date de dernière modification' })
  @UpdateDateColumn()
  updatedAt!: Date;
}
