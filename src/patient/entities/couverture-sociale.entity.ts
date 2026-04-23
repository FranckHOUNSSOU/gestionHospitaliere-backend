// src/patient/entities/couverture-sociale.entity.ts

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

export enum StatutCouverture {
  ASSURE_PRINCIPAL = 'Assuré principal',
  AYANT_DROIT      = 'Ayant droit',
}

@Entity('couvertures_sociales')
export class CouvertureSociale {
  @ApiProperty({ example: 'uuid-xxxx', description: 'Identifiant unique (UUID)' })
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Patient, p => p.couverturesSociales, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'patient_id' })
  patient!: Patient;

  @ApiProperty({ example: 'Assurance maladie', description: 'Type de couverture' })
  @Column({ name: 'type_couverture', type: 'varchar', length: 100 })
  typeCouverture!: string;

  @ApiProperty({ example: 'CNSS Bénin', description: 'Nom de l\'organisme' })
  @Column({ name: 'nom_organisme', type: 'varchar', length: 150 })
  nomOrganisme!: string;

  @ApiProperty({ example: 'AS-123456', description: 'Numéro d\'assuré' })
  @Column({ name: 'numero_assure', type: 'varchar', length: 50 })
  numeroAssure!: string;

  @ApiPropertyOptional({ example: 'POL-789', description: 'Numéro de police', nullable: true })
  @Column({ name: 'numero_police', type: 'varchar', length: 50, nullable: true })
  numeroPolice!: string | null;

  @ApiPropertyOptional({ example: 80.00, description: 'Taux de prise en charge (%)', nullable: true })
  @Column({ name: 'taux_prise_en_charge', type: 'decimal', precision: 5, scale: 2, nullable: true })
  tauxPriseEnCharge!: number | null;

  @ApiProperty({ enum: StatutCouverture, description: 'Statut du bénéficiaire' })
  @Column({ type: 'enum', enum: StatutCouverture })
  statut!: StatutCouverture;

  @ApiProperty({ example: '2024-01-01', description: 'Date de début de validité' })
  @Column({ name: 'date_debut', type: 'date' })
  dateDebut!: Date;

  @ApiPropertyOptional({ example: '2025-12-31', description: 'Date de fin de validité', nullable: true })
  @Column({ name: 'date_fin', type: 'date', nullable: true })
  dateFin!: Date | null;

  @ApiProperty({ example: true, description: 'Couverture active' })
  @Column({ name: 'est_active', default: true })
  estActive!: boolean;

  @ApiProperty({ example: '2026-04-14T10:00:00.000Z', description: 'Date de création' })
  @CreateDateColumn()
  createdAt!: Date;

  @ApiProperty({ example: '2026-04-14T10:00:00.000Z', description: 'Date de dernière modification' })
  @UpdateDateColumn()
  updatedAt!: Date;
}
