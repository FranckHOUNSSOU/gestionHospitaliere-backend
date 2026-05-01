import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum PoleHospitalier {
  POLE_MERE             = 'POLE MERE',
  POLE_ENFANT           = 'POLE ENFANT',
  POLE_SERVICES_COMMUNS = 'POLE DES SERVICES COMMUNS',
}

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

  @ApiPropertyOptional({ example: 'Pôle dédié à la santé maternelle', nullable: true })
  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @ApiProperty({ example: true })
  @Column({ name: 'est_actif', default: true })
  estActif!: boolean;

  @ApiProperty({ example: '2026-04-14T10:00:00.000Z' })
  @CreateDateColumn()
  createdAt!: Date;

  @ApiProperty({ example: '2026-04-14T10:00:00.000Z' })
  @UpdateDateColumn()
  updatedAt!: Date;
}
