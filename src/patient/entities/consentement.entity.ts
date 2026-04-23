// src/patient/entities/consentement.entity.ts

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
import { Medecin } from '../../medecin/entities/medecin.entity';

export enum SignataireConsentement {
  PATIENT            = 'Patient',
  REPRESENTANT_LEGAL = 'Représentant légal',
  TUTEUR             = 'Tuteur',
}

@Entity('consentements')
export class Consentement {
  @ApiProperty({ example: 'uuid-xxxx', description: 'Identifiant unique (UUID)' })
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Sejour, s => s.consentements, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sejour_id' })
  sejour!: Sejour;

  @ManyToOne(() => Medecin, { onDelete: 'SET NULL', nullable: true, eager: true })
  @JoinColumn({ name: 'medecin_informateur_id' })
  medecinInformateur!: Medecin | null;

  @ApiProperty({ example: 'Appendicectomie', description: 'Type d\'acte concerné' })
  @Column({ name: 'type_acte', type: 'varchar', length: 150 })
  typeActe!: string;

  @ApiProperty({ example: '2024-01-15T07:30:00.000Z', description: 'Date de signature' })
  @Column({ name: 'date_signature', type: 'timestamp' })
  dateSignature!: Date;

  @ApiProperty({ enum: SignataireConsentement, description: 'Identité du signataire' })
  @Column({ type: 'enum', enum: SignataireConsentement })
  signataire!: SignataireConsentement;

  @ApiPropertyOptional({ example: 'https://...', description: 'URL du document signé', nullable: true })
  @Column({ name: 'document_url', type: 'varchar', length: 255, nullable: true })
  documentUrl!: string | null;

  @ApiProperty({ example: false, description: 'Consentement refusé' })
  @Column({ name: 'est_refuse', default: false })
  estRefuse!: boolean;

  @ApiPropertyOptional({ example: 'Patient lucide et informé', description: 'Observations', nullable: true })
  @Column({ type: 'text', nullable: true })
  observations!: string | null;

  @ApiProperty({ example: '2026-04-14T10:00:00.000Z', description: 'Date de création' })
  @CreateDateColumn()
  createdAt!: Date;
}
