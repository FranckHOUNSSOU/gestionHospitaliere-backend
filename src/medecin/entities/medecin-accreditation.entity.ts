// src/medecin/entities/medecin-accreditation.entity.ts

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

@Entity('medecin_accreditations')
export class MedecinAccreditation {
  @ApiProperty({ example: 'uuid-xxxx-xxxx', description: 'Identifiant unique (UUID)' })
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Medecin, m => m.accreditations, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'medecin_id' })
  medecin!: Medecin;

  @ApiProperty({ example: 'Certification ACLS', description: 'Intitulé de l\'accréditation ou certification' })
  @Column({ length: 200 })
  intitule!: string;

  @ApiPropertyOptional({ example: 'American Heart Association', description: 'Organisme certificateur', nullable: true })
  @Column({ name: 'organisme_certificateur', type: 'varchar', length: 150, nullable: true })
  organismeCertificateur!: string | null;

  @ApiPropertyOptional({ example: '2022-01-15', description: 'Date d\'obtention de l\'accréditation', nullable: true })
  @Column({ name: 'date_obtention', type: 'date', nullable: true })
  dateObtention!: Date | null;

  @ApiPropertyOptional({ example: '2025-01-15', description: 'Date d\'expiration', nullable: true })
  @Column({ name: 'date_expiration', type: 'date', nullable: true })
  dateExpiration!: Date | null;

  @ApiProperty({ example: true, description: 'Indique si l\'accréditation est encore valide' })
  @Column({ name: 'est_valide', default: true })
  estValide!: boolean;

  @ApiPropertyOptional({ example: 'https://storage.hopital.bj/docs/acls.pdf', description: 'URL du document justificatif', nullable: true })
  @Column({ name: 'document_url', type: 'varchar', length: 255, nullable: true })
  documentUrl!: string | null;

  @ApiProperty({ example: '2026-04-14T10:00:00.000Z', description: 'Date de création' })
  @CreateDateColumn()
  createdAt!: Date;

  @ApiProperty({ example: '2026-04-14T10:00:00.000Z', description: 'Date de dernière modification' })
  @UpdateDateColumn()
  updatedAt!: Date;
}
