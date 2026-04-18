// src/patient/entities/volet-anesthesie.entity.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Sejour } from './sejour.entity';
import { Medecin } from '../../medecin/entities/medecin.entity';

export enum ScoreASA {
  I   = 'I',
  II  = 'II',
  III = 'III',
  IV  = 'IV',
  V   = 'V',
}

export enum TypeAnesthesie {
  GENERALE      = 'Générale',
  LOCOREGIONALE = 'Locorégionale',
  LOCALE        = 'Locale',
  SEDATION      = 'Sédation',
}

@Entity('volet_anesthesie')
export class VoletAnesthesie {
  @ApiProperty({ example: 'uuid-xxxx', description: 'Identifiant unique (UUID)' })
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @OneToOne(() => Sejour, s => s.voletAnesthesie, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sejour_id' })
  sejour!: Sejour;

  @ManyToOne(() => Medecin, { onDelete: 'SET NULL', nullable: true, eager: true })
  @JoinColumn({ name: 'anesthesiste_id' })
  anesthesiste!: Medecin | null;

  @ApiPropertyOptional({ example: '2024-01-10', description: 'Date de consultation pré-anesthésique', nullable: true })
  @Column({ name: 'date_consultation_pre', type: 'date', nullable: true })
  dateConsultationPre!: Date | null;

  @ApiPropertyOptional({ enum: ScoreASA, description: 'Score ASA', nullable: true })
  @Column({ name: 'score_asa', type: 'enum', enum: ScoreASA, nullable: true })
  scoreAsa!: ScoreASA | null;

  @ApiPropertyOptional({ enum: TypeAnesthesie, description: 'Type d\'anesthésie', nullable: true })
  @Column({ name: 'type_anesthesie', type: 'enum', enum: TypeAnesthesie, nullable: true })
  typeAnesthesie!: TypeAnesthesie | null;

  @ApiPropertyOptional({ example: 'Propofol, Fentanyl, Rocuronium', description: 'Produits utilisés', nullable: true })
  @Column({ name: 'produits_utilises', type: 'text', nullable: true })
  produitsUtilises!: string | null;

  @ApiPropertyOptional({ example: 90, description: 'Durée d\'anesthésie en minutes', nullable: true })
  @Column({ name: 'duree_anesthesie_min', type: 'int', nullable: true })
  dureeAnesthesieMin!: number | null;

  @ApiPropertyOptional({ example: 'Aucun incident', description: 'Incidents per-opératoires', nullable: true })
  @Column({ name: 'incidents_per_operatoires', type: 'text', nullable: true })
  incidentsPerOperatoires!: string | null;

  @ApiPropertyOptional({ example: 10, description: 'Score d\'Aldrete (0 à 10)', nullable: true })
  @Column({ name: 'score_aldrete', type: 'int', nullable: true })
  scoreAldrete!: number | null;

  @ApiPropertyOptional({ example: 'Surveillance rapprochée 4h', description: 'Consignes post-opératoires', nullable: true })
  @Column({ name: 'consignes_post_op', type: 'text', nullable: true })
  consignesPostOp!: string | null;

  @ApiProperty({ example: '2026-04-14T10:00:00.000Z', description: 'Date de création' })
  @CreateDateColumn()
  createdAt!: Date;

  @ApiProperty({ example: '2026-04-14T10:00:00.000Z', description: 'Date de dernière modification' })
  @UpdateDateColumn()
  updatedAt!: Date;
}
