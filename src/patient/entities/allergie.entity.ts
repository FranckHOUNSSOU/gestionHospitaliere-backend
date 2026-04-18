// src/patient/entities/allergie.entity.ts

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

export enum SeveriteAllergie {
  LEGERE   = 'Légère',
  MODEREE  = 'Modérée',
  SEVERE   = 'Sévère',
  MORTELLE = 'Mortelle',
}

@Entity('allergies')
export class Allergie {
  @ApiProperty({ example: 'uuid-xxxx', description: 'Identifiant unique (UUID)' })
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Patient, p => p.allergies, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'patient_id' })
  patient!: Patient;

  @ApiProperty({ example: 'Pénicilline', description: 'Allergène' })
  @Column({ type: 'varchar', length: 150 })
  allergene!: string;

  @ApiPropertyOptional({ example: 'Urticaire, choc anaphylactique', description: 'Type de réaction', nullable: true })
  @Column({ name: 'type_reaction', type: 'varchar', length: 150, nullable: true })
  typeReaction!: string | null;

  @ApiPropertyOptional({ enum: SeveriteAllergie, description: 'Sévérité de l\'allergie', nullable: true })
  @Column({ type: 'enum', enum: SeveriteAllergie, nullable: true })
  severite!: SeveriteAllergie | null;

  @ApiPropertyOptional({ example: '2020-03-01', description: 'Date de découverte', nullable: true })
  @Column({ name: 'date_decouverte', type: 'date', nullable: true })
  dateDecouverte!: Date | null;

  @ApiPropertyOptional({ example: 'Médecin traitant', description: 'Source d\'information', nullable: true })
  @Column({ name: 'source_information', type: 'varchar', length: 100, nullable: true })
  sourceInformation!: string | null;

  @ApiPropertyOptional({ example: 'Patient allergique depuis l\'enfance', description: 'Observations', nullable: true })
  @Column({ type: 'text', nullable: true })
  observations!: string | null;

  @ApiProperty({ example: '2026-04-14T10:00:00.000Z', description: 'Date de création' })
  @CreateDateColumn()
  createdAt!: Date;

  @ApiProperty({ example: '2026-04-14T10:00:00.000Z', description: 'Date de dernière modification' })
  @UpdateDateColumn()
  updatedAt!: Date;
}
