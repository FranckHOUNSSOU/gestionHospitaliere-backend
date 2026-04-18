// src/patient/entities/prescription.entity.ts

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

export enum VoieAdministration {
  ORALE    = 'Orale',
  IV       = 'IV',
  IM       = 'IM',
  SC       = 'SC',
  TOPIQUE  = 'Topique',
  AUTRE    = 'Autre',
}

export enum StatutPrescription {
  ACTIVE    = 'Active',
  SUSPENDUE = 'Suspendue',
  TERMINEE  = 'Terminée',
}

@Entity('prescriptions')
export class Prescription {
  @ApiProperty({ example: 'uuid-xxxx', description: 'Identifiant unique (UUID)' })
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Sejour, s => s.prescriptions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sejour_id' })
  sejour!: Sejour;

  @ManyToOne(() => Medecin, { onDelete: 'SET NULL', nullable: true, eager: true })
  @JoinColumn({ name: 'medecin_prescripteur_id' })
  medecinPrescripteur!: Medecin | null;

  @ApiProperty({ example: 'Amoxicilline', description: 'Nom DCI du médicament' })
  @Column({ name: 'nom_medicament_dci', type: 'varchar', length: 150 })
  nomMedicamentDci!: string;

  @ApiPropertyOptional({ example: 'Clamoxyl', description: 'Nom commercial', nullable: true })
  @Column({ name: 'nom_commercial', type: 'varchar', length: 150, nullable: true })
  nomCommercial!: string | null;

  @ApiPropertyOptional({ example: 'Comprimé', description: 'Forme galénique', nullable: true })
  @Column({ name: 'forme_galenique', type: 'varchar', length: 50, nullable: true })
  formeGalenique!: string | null;

  @ApiPropertyOptional({ example: '500', description: 'Dose', nullable: true })
  @Column({ type: 'varchar', length: 50, nullable: true })
  dose!: string | null;

  @ApiPropertyOptional({ example: 'mg', description: 'Unité', nullable: true })
  @Column({ type: 'varchar', length: 20, nullable: true })
  unite!: string | null;

  @ApiPropertyOptional({ example: '3 fois/jour', description: 'Fréquence', nullable: true })
  @Column({ type: 'varchar', length: 100, nullable: true })
  frequence!: string | null;

  @ApiProperty({ enum: VoieAdministration, description: 'Voie d\'administration' })
  @Column({ name: 'voie_administration', type: 'enum', enum: VoieAdministration })
  voieAdministration!: VoieAdministration;

  @ApiProperty({ example: '2024-01-15T08:00:00.000Z', description: 'Date de début' })
  @Column({ name: 'date_debut', type: 'timestamp' })
  dateDebut!: Date;

  @ApiPropertyOptional({ example: '2024-01-22T08:00:00.000Z', description: 'Date de fin', nullable: true })
  @Column({ name: 'date_fin', type: 'timestamp', nullable: true })
  dateFin!: Date | null;

  @ApiProperty({ enum: StatutPrescription, description: 'Statut de la prescription', default: StatutPrescription.ACTIVE })
  @Column({ type: 'enum', enum: StatutPrescription, default: StatutPrescription.ACTIVE })
  statut!: StatutPrescription;

  @ApiPropertyOptional({ example: 'À prendre au cours des repas', description: 'Observations', nullable: true })
  @Column({ type: 'text', nullable: true })
  observations!: string | null;

  @ApiProperty({ example: '2026-04-14T10:00:00.000Z', description: 'Date de création' })
  @CreateDateColumn()
  createdAt!: Date;

  @ApiProperty({ example: '2026-04-14T10:00:00.000Z', description: 'Date de dernière modification' })
  @UpdateDateColumn()
  updatedAt!: Date;
}
