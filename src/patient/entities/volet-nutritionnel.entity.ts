// src/patient/entities/volet-nutritionnel.entity.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Sejour } from './sejour.entity';

export enum Appetit {
  BON    = 'Bon',
  REDUIT = 'Réduit',
  ABSENT = 'Absent',
}

@Entity('volet_nutritionnel')
export class VoletNutritionnel {
  @ApiProperty({ example: 'uuid-xxxx', description: 'Identifiant unique (UUID)' })
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @OneToOne(() => Sejour, s => s.voletNutritionnel, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sejour_id' })
  sejour!: Sejour;

  @ApiPropertyOptional({ example: 'NRS-2002', description: 'Score de dénutrition utilisé', nullable: true })
  @Column({ name: 'score_denutrition', type: 'varchar', length: 50, nullable: true })
  scoreDenutrition!: string | null;

  @ApiPropertyOptional({ example: 2.5, description: 'Valeur du score', nullable: true })
  @Column({ name: 'valeur_score', type: 'decimal', precision: 5, scale: 2, nullable: true })
  valeurScore!: number | null;

  @ApiPropertyOptional({ example: 75.0, description: 'Poids habituel (kg)', nullable: true })
  @Column({ name: 'poids_habituel', type: 'decimal', precision: 6, scale: 2, nullable: true })
  poidsHabituel!: number | null;

  @ApiPropertyOptional({ example: 68.5, description: 'Poids actuel (kg)', nullable: true })
  @Column({ name: 'poids_actuel', type: 'decimal', precision: 6, scale: 2, nullable: true })
  poidsActuel!: number | null;

  @ApiPropertyOptional({ example: 8.67, description: 'Perte de poids (%)', nullable: true })
  @Column({ name: 'perte_poids_percent', type: 'decimal', precision: 5, scale: 2, nullable: true })
  pertePoidsPercent!: number | null;

  @ApiPropertyOptional({ enum: Appetit, description: 'Appétit du patient', nullable: true })
  @Column({ type: 'enum', enum: Appetit, nullable: true })
  appetit!: Appetit | null;

  @ApiPropertyOptional({ example: 'Régime sans sel', description: 'Régime prescrit', nullable: true })
  @Column({ name: 'regime_prescrit', type: 'varchar', length: 150, nullable: true })
  regimePrescrit!: string | null;

  @ApiPropertyOptional({ example: 2000, description: 'Apports caloriques (kcal/jour)', nullable: true })
  @Column({ name: 'apports_caloriques', type: 'int', nullable: true })
  apportsCaloriques!: number | null;

  @ApiPropertyOptional({ example: 'Fortimel 2 unités/jour', description: 'Suppléments prescrits', nullable: true })
  @Column({ name: 'supplements_prescrits', type: 'text', nullable: true })
  supplementsPrescrits!: string | null;

  @ApiProperty({ example: '2026-04-14T10:00:00.000Z', description: 'Date de création' })
  @CreateDateColumn()
  createdAt!: Date;

  @ApiProperty({ example: '2026-04-14T10:00:00.000Z', description: 'Date de dernière modification' })
  @UpdateDateColumn()
  updatedAt!: Date;
}
