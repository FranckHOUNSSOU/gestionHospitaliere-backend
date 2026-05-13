// src/patient/entities/diagnostic.entity.ts

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

export enum TypeDiagnostic {
  PRINCIPAL     = 'Principal',
  ASSOCIE       = 'Associé',
  COMPLICATION  = 'Complication',
}

export enum StatutDiagnostic {
  CONFIRME = 'Confirmé',
  SUSPECTE = 'Suspecté',
  ECARTE   = 'Écarté',
}

@Entity('diagnostics')
export class Diagnostic {
  @ApiProperty({ example: 'uuid-xxxx', description: 'Identifiant unique (UUID)' })
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Sejour, s => s.diagnostics, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sejour_id' })
  sejour!: Sejour;

  @ManyToOne(() => Medecin, { onDelete: 'SET NULL', nullable: true, eager: true })
  @JoinColumn({ name: 'medecin_id' })
  medecin!: Medecin | null;

  @ApiProperty({ example: 'K35.2', description: 'Code CIM-10' })
  @Column({ name: 'code_cim10', type: 'varchar', length: 10 })
  codeCim10!: string;

  @ApiProperty({ example: 'Appendicite aiguë avec péritonite généralisée', description: 'Libellé du diagnostic' })
  @Column({ type: 'text' })
  libelle!: string;

  @ApiProperty({ enum: TypeDiagnostic, description: 'Type de diagnostic' })
  @Column({ type: 'enum', enum: TypeDiagnostic })
  type!: TypeDiagnostic;

  @ApiProperty({ enum: StatutDiagnostic, description: 'Statut du diagnostic' })
  @Column({ type: 'enum', enum: StatutDiagnostic })
  statut!: StatutDiagnostic;

  @ApiProperty({ example: '2024-01-15', description: 'Date du diagnostic' })
  @Column({ name: 'date_diagnostic', type: 'date' })
  dateDiagnostic!: Date;

  @ApiPropertyOptional({ example: 'Confirmé par scanner abdominal', description: 'Observations', nullable: true })
  @Column({ type: 'text', nullable: true })
  observations!: string | null;

  @ApiProperty({ example: false, description: 'Indique si le diagnostic a été validé par le médecin' })
  @Column({ default: false })
  valide!: boolean;

  @ApiProperty({ example: '2026-04-14T10:00:00.000Z', description: 'Date de création' })
  @CreateDateColumn()
  createdAt!: Date;

  @ApiProperty({ example: '2026-04-14T10:00:00.000Z', description: 'Date de dernière modification' })
  @UpdateDateColumn()
  updatedAt!: Date;
}
