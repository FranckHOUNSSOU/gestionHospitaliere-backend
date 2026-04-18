// src/patient/entities/soin-infirmier.entity.ts

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

export enum TypeAuteurSoin {
  INFIRMIER     = 'Infirmier',
  AIDE_SOIGNANT = 'Aide-soignant',
}

@Entity('soins_infirmiers')
export class SoinInfirmier {
  @ApiProperty({ example: 'uuid-xxxx', description: 'Identifiant unique (UUID)' })
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Sejour, s => s.soinsInfirmiers, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sejour_id' })
  sejour!: Sejour;

  @ApiProperty({ example: '2024-01-15T14:00:00.000Z', description: 'Date et heure du soin' })
  @Column({ name: 'date_heure', type: 'timestamp' })
  dateHeure!: Date;

  @ApiProperty({ enum: TypeAuteurSoin, description: 'Type d\'auteur du soin' })
  @Column({ name: 'type_auteur', type: 'enum', enum: TypeAuteurSoin })
  typeAuteur!: TypeAuteurSoin;

  @ApiProperty({ example: 'Douleur', description: 'Cible du soin' })
  @Column({ type: 'varchar', length: 100 })
  cible!: string;

  @ApiPropertyOptional({ example: 'Patient se plaint de douleurs thoraciques', description: 'Données observées', nullable: true })
  @Column({ name: 'donnees_observees', type: 'text', nullable: true })
  donneesObservees!: string | null;

  @ApiPropertyOptional({ example: 'Administration antalgique prescrit', description: 'Actions réalisées', nullable: true })
  @Column({ name: 'actions_realisees', type: 'text', nullable: true })
  actionsRealisees!: string | null;

  @ApiPropertyOptional({ example: 'Diminution de la douleur EVA 8→3', description: 'Résultats obtenus', nullable: true })
  @Column({ name: 'resultats_obtenus', type: 'text', nullable: true })
  resultatsObtenus!: string | null;

  @ApiProperty({ example: '2026-04-14T10:00:00.000Z', description: 'Date de création' })
  @CreateDateColumn()
  createdAt!: Date;
}
