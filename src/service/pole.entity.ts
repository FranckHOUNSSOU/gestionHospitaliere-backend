// src/service/pole.entity.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PoleHospitalier } from '../auth/users/entities/user.entity';

@Entity('poles')
export class Pole {
  @ApiProperty({ example: 'uuid-xxxx-xxxx', description: 'Identifiant unique (UUID)' })
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ApiProperty({
    enum: PoleHospitalier,
    example: PoleHospitalier.POLE_MERE,
    description: 'Nom du pôle (unique)',
  })
  @Column({ type: 'enum', enum: PoleHospitalier, unique: true })
  nom!: PoleHospitalier;

  @ApiPropertyOptional({ example: 'Pôle dédié à la santé maternelle', description: 'Description du pôle', nullable: true })
  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @ApiProperty({ example: true, description: 'Indique si le pôle est actif' })
  @Column({ name: 'est_actif', default: true })
  estActif!: boolean;

  @ApiProperty({ example: '2026-04-14T10:00:00.000Z', description: 'Date de création' })
  @CreateDateColumn()
  createdAt!: Date;

  @ApiProperty({ example: '2026-04-14T10:00:00.000Z', description: 'Date de dernière modification' })
  @UpdateDateColumn()
  updatedAt!: Date;
}
