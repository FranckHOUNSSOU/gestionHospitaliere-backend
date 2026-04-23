// src/patient/entities/resultat-examen.entity.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Examen } from './examen.entity';

export enum InterpretationResultat {
  NORMAL   = 'Normal',
  ANORMAL  = 'Anormal',
  CRITIQUE = 'Critique',
}

@Entity('resultats_examen')
export class ResultatExamen {
  @ApiProperty({ example: 'uuid-xxxx', description: 'Identifiant unique (UUID)' })
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Examen, e => e.resultats, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'examen_id' })
  examen!: Examen;

  @ApiProperty({ example: 'Globules rouges', description: 'Paramètre mesuré' })
  @Column({ type: 'varchar', length: 150 })
  parametre!: string;

  @ApiProperty({ example: '4.5', description: 'Valeur mesurée' })
  @Column({ type: 'varchar', length: 100 })
  valeur!: string;

  @ApiPropertyOptional({ example: '10^12/L', description: 'Unité de mesure', nullable: true })
  @Column({ type: 'varchar', length: 50, nullable: true })
  unite!: string | null;

  @ApiPropertyOptional({ example: '4.2', description: 'Valeur minimale de référence', nullable: true })
  @Column({ name: 'valeur_min_reference', type: 'varchar', length: 50, nullable: true })
  valeurMinReference!: string | null;

  @ApiPropertyOptional({ example: '5.8', description: 'Valeur maximale de référence', nullable: true })
  @Column({ name: 'valeur_max_reference', type: 'varchar', length: 50, nullable: true })
  valeurMaxReference!: string | null;

  @ApiPropertyOptional({ enum: InterpretationResultat, description: 'Interprétation du résultat', nullable: true })
  @Column({ type: 'enum', enum: InterpretationResultat, nullable: true })
  interpretation!: InterpretationResultat | null;

  @ApiPropertyOptional({ example: 'Valeur dans les normes', description: 'Commentaire', nullable: true })
  @Column({ type: 'text', nullable: true })
  commentaire!: string | null;

  @ApiPropertyOptional({ example: 'https://...', description: 'URL du fichier résultat', nullable: true })
  @Column({ name: 'fichier_url', type: 'varchar', length: 255, nullable: true })
  fichierUrl!: string | null;

  @ApiPropertyOptional({ example: '2024-01-15T12:00:00.000Z', description: 'Date de validation du résultat', nullable: true })
  @Column({ name: 'date_validation', type: 'timestamp', nullable: true })
  dateValidation!: Date | null;

  @ApiProperty({ example: '2026-04-14T10:00:00.000Z', description: 'Date de création' })
  @CreateDateColumn()
  createdAt!: Date;
}
