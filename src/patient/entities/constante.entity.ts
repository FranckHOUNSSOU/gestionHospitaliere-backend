// src/patient/entities/constante.entity.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Sejour } from './sejour.entity';

@Entity('constantes')
export class Constante {
  @ApiProperty({ example: 'uuid-xxxx', description: 'Identifiant unique (UUID)' })
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Sejour, s => s.constantes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sejour_id' })
  sejour!: Sejour;

  @ApiProperty({ example: '2024-01-15T08:00:00.000Z', description: 'Date et heure de la mesure' })
  @Column({ name: 'date_heure', type: 'timestamp' })
  dateHeure!: Date;

  @ApiPropertyOptional({ example: 120.0, description: 'Tension systolique (mmHg)', nullable: true })
  @Column({ name: 'tension_systolique', type: 'decimal', precision: 5, scale: 1, nullable: true })
  tensionSystolique!: number | null;

  @ApiPropertyOptional({ example: 80.0, description: 'Tension diastolique (mmHg)', nullable: true })
  @Column({ name: 'tension_diastolique', type: 'decimal', precision: 5, scale: 1, nullable: true })
  tensionDiastolique!: number | null;

  @ApiPropertyOptional({ example: 72, description: 'Fréquence cardiaque (bpm)', nullable: true })
  @Column({ name: 'frequence_cardiaque', type: 'int', nullable: true })
  frequenceCardiaque!: number | null;

  @ApiPropertyOptional({ example: 16, description: 'Fréquence respiratoire (/min)', nullable: true })
  @Column({ name: 'frequence_respiratoire', type: 'int', nullable: true })
  frequenceRespiratoire!: number | null;

  @ApiPropertyOptional({ example: 37.2, description: 'Température (°C)', nullable: true })
  @Column({ type: 'decimal', precision: 4, scale: 1, nullable: true })
  temperature!: number | null;

  @ApiPropertyOptional({ example: 98.5, description: 'SpO2 (%)', nullable: true })
  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  spo2!: number | null;

  @ApiPropertyOptional({ example: 5.8, description: 'Glycémie capillaire (mmol/L)', nullable: true })
  @Column({ name: 'glycemie_capillaire', type: 'decimal', precision: 6, scale: 2, nullable: true })
  glycemieCapillaire!: number | null;

  @ApiPropertyOptional({ example: 72.5, description: 'Poids (kg)', nullable: true })
  @Column({ type: 'decimal', precision: 6, scale: 2, nullable: true })
  poids!: number | null;

  @ApiPropertyOptional({ example: 175.0, description: 'Taille (cm)', nullable: true })
  @Column({ type: 'decimal', precision: 5, scale: 1, nullable: true })
  taille!: number | null;

  @ApiPropertyOptional({ example: 15, description: 'Score de Glasgow (3 à 15)', nullable: true })
  @Column({ type: 'int', nullable: true })
  glasgow!: number | null;

  @ApiPropertyOptional({ example: 3, description: 'Douleur EVA (0 à 10)', nullable: true })
  @Column({ name: 'douleur_eva', type: 'int', nullable: true })
  douleurEva!: number | null;

  @ApiPropertyOptional({ example: 'Patient calme, bien orienté', description: 'Observations', nullable: true })
  @Column({ type: 'text', nullable: true })
  observations!: string | null;

  @ApiProperty({ example: '2026-04-14T10:00:00.000Z', description: 'Date de création' })
  @CreateDateColumn()
  createdAt!: Date;
}
