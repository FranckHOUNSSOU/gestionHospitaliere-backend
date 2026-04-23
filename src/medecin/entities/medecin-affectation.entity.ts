// src/medecin/entities/medecin-affectation.entity.ts

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
import { Medecin } from './medecin.entity';
import { Service } from '../../service/service.entity';

export enum RoleDansService {
  CHEF_DE_SERVICE = 'Chef de service',
  PRATICIEN       = 'Praticien',
  ASSISTANT       = 'Assistant',
  INTERNE         = 'Interne',
  CONSULTANT      = 'Consultant',
}

@Entity('medecin_affectations')
export class MedecinAffectation {
  @ApiProperty({ example: 'uuid-xxxx-xxxx', description: 'Identifiant unique (UUID)' })
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Medecin, m => m.affectations, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'medecin_id' })
  medecin!: Medecin;

  @ApiProperty({ description: 'Service d\'affectation' })
  @ManyToOne(() => Service, { onDelete: 'RESTRICT', eager: true })
  @JoinColumn({ name: 'service_id' })
  service!: Service;

  @ApiProperty({ enum: RoleDansService, description: 'Rôle du médecin dans ce service' })
  @Column({ name: 'role_dans_service', type: 'enum', enum: RoleDansService })
  roleDansService!: RoleDansService;

  @ApiProperty({ example: false, description: 'Indique si c\'est l\'affectation principale du médecin' })
  @Column({ name: 'est_principal', default: false })
  estPrincipal!: boolean;

  @ApiProperty({ example: '2024-01-01', description: 'Date de début de l\'affectation' })
  @Column({ name: 'date_debut', type: 'date' })
  dateDebut!: Date;

  @ApiPropertyOptional({ example: '2025-12-31', description: 'Date de fin de l\'affectation (null si en cours)', nullable: true })
  @Column({ name: 'date_fin', type: 'date', nullable: true })
  dateFin!: Date | null;

  @ApiProperty({ example: true, description: 'Indique si l\'affectation est active' })
  @Column({ name: 'est_active', default: true })
  estActive!: boolean;

  @ApiProperty({ example: '2026-04-14T10:00:00.000Z', description: 'Date de création' })
  @CreateDateColumn()
  createdAt!: Date;

  @ApiProperty({ example: '2026-04-14T10:00:00.000Z', description: 'Date de dernière modification' })
  @UpdateDateColumn()
  updatedAt!: Date;
}
