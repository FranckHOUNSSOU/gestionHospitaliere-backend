// src/patient/entities/examen.entity.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Sejour } from './sejour.entity';
import { Medecin } from '../../medecin/entities/medecin.entity';
import { ResultatExamen } from './resultat-examen.entity';

export enum TypeExamen {
  BIOLOGIE          = 'Biologie',
  IMAGERIE          = 'Imagerie',
  ECG               = 'ECG',
  ANATOMOPATHOLOGIE = 'Anatomopathologie',
  AUTRE             = 'Autre',
}

export enum StatutExamen {
  PRESCRIT            = 'Prescrit',
  EN_COURS            = 'En cours',
  RESULTAT_DISPONIBLE = 'Résultat disponible',
  ANNULE              = 'Annulé',
}

@Entity('examens')
export class Examen {
  @ApiProperty({ example: 'uuid-xxxx', description: 'Identifiant unique (UUID)' })
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Sejour, s => s.examens, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sejour_id' })
  sejour!: Sejour;

  @ManyToOne(() => Medecin, { onDelete: 'SET NULL', nullable: true, eager: true })
  @JoinColumn({ name: 'medecin_prescripteur_id' })
  medecinPrescripteur!: Medecin | null;

  @ApiProperty({ enum: TypeExamen, description: 'Type d\'examen' })
  @Column({ name: 'type_examen', type: 'enum', enum: TypeExamen })
  typeExamen!: TypeExamen;

  @ApiPropertyOptional({ example: 'NFS', description: 'Sous-type d\'examen', nullable: true })
  @Column({ name: 'sous_type', type: 'varchar', length: 100, nullable: true })
  sousType!: string | null;

  @ApiPropertyOptional({ example: 'Abdomen', description: 'Région anatomique', nullable: true })
  @Column({ name: 'region_anatomique', type: 'varchar', length: 100, nullable: true })
  regionAnatomique!: string | null;

  @ApiProperty({ example: '2024-01-15T09:00:00.000Z', description: 'Date et heure de prescription' })
  @Column({ name: 'date_heure_prescription', type: 'timestamp' })
  dateHeurePrescription!: Date;

  @ApiPropertyOptional({ example: '2024-01-15T11:00:00.000Z', description: 'Date et heure de réalisation', nullable: true })
  @Column({ name: 'date_heure_realisation', type: 'timestamp', nullable: true })
  dateHeureRealisation!: Date | null;

  @ApiPropertyOptional({ example: 'Suspicion d\'appendicite', description: 'Indication clinique', nullable: true })
  @Column({ type: 'text', nullable: true })
  indication!: string | null;

  @ApiProperty({ enum: StatutExamen, description: 'Statut de l\'examen', default: StatutExamen.PRESCRIT })
  @Column({ type: 'enum', enum: StatutExamen, default: StatutExamen.PRESCRIT })
  statut!: StatutExamen;

  @ApiProperty({ type: () => [ResultatExamen], description: 'Résultats de l\'examen' })
  @OneToMany(() => ResultatExamen, r => r.examen, { cascade: true })
  resultats!: ResultatExamen[];

  @ApiProperty({ example: '2026-04-14T10:00:00.000Z', description: 'Date de création' })
  @CreateDateColumn()
  createdAt!: Date;

  @ApiProperty({ example: '2026-04-14T10:00:00.000Z', description: 'Date de dernière modification' })
  @UpdateDateColumn()
  updatedAt!: Date;
}
