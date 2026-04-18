// src/patient/entities/volet-social.entity.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Sejour } from './sejour.entity';

export enum NiveauAutonomie {
  AUTONOME                 = 'Autonome',
  PARTIELLEMENT_DEPENDANT  = 'Partiellement dépendant',
  DEPENDANT                = 'Dépendant',
}

export enum OrientationPrevue {
  DOMICILE         = 'Domicile',
  MAISON_RETRAITE  = 'Maison de retraite',
  SSR              = 'SSR',
  AUTRE            = 'Autre',
}

@Entity('volet_social')
export class VoletSocial {
  @ApiProperty({ example: 'uuid-xxxx', description: 'Identifiant unique (UUID)' })
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @OneToOne(() => Sejour, s => s.voletSocial, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sejour_id' })
  sejour!: Sejour;

  @ApiPropertyOptional({ example: 'Marié(e)', description: 'Situation familiale', nullable: true })
  @Column({ name: 'situation_familiale', type: 'varchar', length: 100, nullable: true })
  situationFamiliale!: string | null;

  @ApiPropertyOptional({ example: 'Appartement', description: 'Type de logement', nullable: true })
  @Column({ name: 'type_logement', type: 'varchar', length: 100, nullable: true })
  typeLogement!: string | null;

  @ApiPropertyOptional({ enum: NiveauAutonomie, description: 'Niveau d\'autonomie avant hospitalisation', nullable: true })
  @Column({ name: 'niveau_autonomie_avant', type: 'enum', enum: NiveauAutonomie, nullable: true })
  niveauAutonomieAvant!: NiveauAutonomie | null;

  @ApiPropertyOptional({ example: 'Aide ménagère 3h/semaine', description: 'Aides à domicile en place', nullable: true })
  @Column({ name: 'aides_domicile_en_place', type: 'text', nullable: true })
  aidesDomicileEnPlace!: string | null;

  @ApiPropertyOptional({ example: 'Kiné, portage de repas', description: 'Besoins pour retour à domicile', nullable: true })
  @Column({ name: 'besoins_retour_domicile', type: 'text', nullable: true })
  besoinsRetourDomicile!: string | null;

  @ApiPropertyOptional({ enum: OrientationPrevue, description: 'Orientation prévue à la sortie', nullable: true })
  @Column({ name: 'orientation_prevue', type: 'enum', enum: OrientationPrevue, nullable: true })
  orientationPrevue!: OrientationPrevue | null;

  @ApiPropertyOptional({ example: 'Dossier EHPAD en cours', description: 'Démarches engagées', nullable: true })
  @Column({ name: 'demarches_engagees', type: 'text', nullable: true })
  demarchesEngagees!: string | null;

  @ApiProperty({ example: '2026-04-14T10:00:00.000Z', description: 'Date de création' })
  @CreateDateColumn()
  createdAt!: Date;

  @ApiProperty({ example: '2026-04-14T10:00:00.000Z', description: 'Date de dernière modification' })
  @UpdateDateColumn()
  updatedAt!: Date;
}
