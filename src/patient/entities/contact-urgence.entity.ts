// src/patient/entities/contact-urgence.entity.ts

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

@Entity('contacts_urgence')
export class ContactUrgence {
  @ApiProperty({ example: 'uuid-xxxx', description: 'Identifiant unique (UUID)' })
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Patient, p => p.contactsUrgence, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'patient_id' })
  patient!: Patient;

  @ApiProperty({ example: 'DOE', description: 'Nom du contact' })
  @Column({ type: 'varchar', length: 100 })
  nom!: string;

  @ApiProperty({ example: 'Jane', description: 'Prénom du contact' })
  @Column({ type: 'varchar', length: 100 })
  prenom!: string;

  @ApiProperty({ example: 'Épouse', description: 'Lien de parenté' })
  @Column({ name: 'lien_parente', type: 'varchar', length: 50 })
  lienParente!: string;

  @ApiProperty({ example: '+229 97 11 22 33', description: 'Téléphone principal' })
  @Column({ type: 'varchar', length: 20 })
  telephone!: string;

  @ApiPropertyOptional({ example: '+229 96 44 55 66', description: 'Téléphone secondaire', nullable: true })
  @Column({ name: 'telephone_secondaire', type: 'varchar', length: 20, nullable: true })
  telephoneSecondaire!: string | null;

  @ApiPropertyOptional({ example: 'contact@email.com', description: 'Email', nullable: true })
  @Column({ type: 'varchar', length: 100, nullable: true })
  email!: string | null;

  @ApiProperty({ example: false, description: 'Personne de confiance désignée' })
  @Column({ name: 'est_personne_confiance', default: false })
  estPersonneConfiance!: boolean;

  @ApiProperty({ example: '2026-04-14T10:00:00.000Z', description: 'Date de création' })
  @CreateDateColumn()
  createdAt!: Date;

  @ApiProperty({ example: '2026-04-14T10:00:00.000Z', description: 'Date de dernière modification' })
  @UpdateDateColumn()
  updatedAt!: Date;
}
