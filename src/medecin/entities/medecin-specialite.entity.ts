// src/medecin/entities/medecin-specialite.entity.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Medecin } from './medecin.entity';

@Entity('medecin_specialites')
export class MedecinSpecialite {
  @ApiProperty({ example: 'uuid-xxxx-xxxx', description: 'Identifiant unique (UUID)' })
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Medecin, m => m.specialites, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'medecin_id' })
  medecin!: Medecin;

  @ApiProperty({ example: 'Cardiologie', description: 'Libellé de la spécialité' })
  @Column({ length: 100 })
  specialite!: string;

  @ApiProperty({ example: false, description: 'Indique si c\'est la spécialité principale du médecin' })
  @Column({ name: 'est_principale', default: false })
  estPrincipale!: boolean;

  @ApiPropertyOptional({ example: '2015-06-30', description: 'Date d\'obtention de la spécialité', nullable: true })
  @Column({ name: 'date_obtention', type: 'date', nullable: true })
  dateObtention!: Date | null;

  @ApiProperty({ example: '2026-04-14T10:00:00.000Z', description: 'Date de création' })
  @CreateDateColumn()
  createdAt!: Date;
}
