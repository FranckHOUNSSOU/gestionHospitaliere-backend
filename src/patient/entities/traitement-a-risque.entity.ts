// src/patient/entities/traitement-a-risque.entity.ts

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
import { Patient } from './patient.entity';

export enum NiveauAlerteTraitement {
  FAIBLE   = 'Faible',
  MODERE   = 'Modéré',
  ELEVE    = 'Élevé',
  CRITIQUE = 'Critique',
}

@Entity('traitements_a_risque')
export class TraitementARisque {
  @ApiProperty({ example: 'uuid-xxxx', description: 'Identifiant unique (UUID)' })
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Patient, p => p.traitementsARisque, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'patient_id' })
  patient!: Patient;

  @ApiProperty({ example: 'Warfarine', description: 'Nom du médicament' })
  @Column({ name: 'nom_medicament', type: 'varchar', length: 150 })
  nomMedicament!: string;

  @ApiPropertyOptional({ example: 'Anticoagulant', description: 'Classe thérapeutique', nullable: true })
  @Column({ type: 'varchar', length: 100, nullable: true })
  classe!: string | null;

  @ApiPropertyOptional({ example: '5mg/j', description: 'Posologie en cours', nullable: true })
  @Column({ name: 'posologie_en_cours', type: 'varchar', length: 100, nullable: true })
  posologieEnCours!: string | null;

  @ApiPropertyOptional({ enum: NiveauAlerteTraitement, description: 'Niveau d\'alerte', nullable: true })
  @Column({ name: 'niveau_alerte', type: 'enum', enum: NiveauAlerteTraitement, nullable: true })
  niveauAlerte!: NiveauAlerteTraitement | null;

  @ApiPropertyOptional({ example: 'Risque de surdosage en cas d\'interaction', description: 'Observations', nullable: true })
  @Column({ type: 'text', nullable: true })
  observations!: string | null;

  @ApiProperty({ example: '2026-04-14T10:00:00.000Z', description: 'Date de création' })
  @CreateDateColumn()
  createdAt!: Date;

  @ApiProperty({ example: '2026-04-14T10:00:00.000Z', description: 'Date de dernière modification' })
  @UpdateDateColumn()
  updatedAt!: Date;
}
