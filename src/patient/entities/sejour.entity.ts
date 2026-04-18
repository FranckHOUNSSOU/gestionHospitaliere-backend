// src/patient/entities/sejour.entity.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Patient } from './patient.entity';
import { Medecin } from '../../medecin/entities/medecin.entity';
import { Mouvement } from './mouvement.entity';
import { Diagnostic } from './diagnostic.entity';
import { Prescription } from './prescription.entity';
import { Examen } from './examen.entity';
import { Constante } from './constante.entity';
import { SoinInfirmier } from './soin-infirmier.entity';
import { CompteRendu } from './compte-rendu.entity';
import { Consentement } from './consentement.entity';
import { VoletAnesthesie } from './volet-anesthesie.entity';
import { VoletSocial } from './volet-social.entity';
import { VoletNutritionnel } from './volet-nutritionnel.entity';

export enum ModeEntree {
  URGENCES   = 'Urgences',
  PROGRAMME  = 'Programmé',
  TRANSFERT  = 'Transfert',
  NAISSANCE  = 'Naissance',
  AUTRE      = 'Autre',
}

export enum ModeSortie {
  DOMICILE  = 'Domicile',
  DECES     = 'Décès',
  TRANSFERT = 'Transfert',
  FUGUE     = 'Fugue',
  AUTRE     = 'Autre',
}

@Entity('sejours')
export class Sejour {
  @ApiProperty({ example: 'uuid-xxxx', description: 'Identifiant unique (UUID)' })
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Patient, p => p.sejours, { onDelete: 'RESTRICT', eager: true })
  @JoinColumn({ name: 'patient_id' })
  patient!: Patient;

  @ManyToOne(() => Medecin, { onDelete: 'SET NULL', nullable: true, eager: true })
  @JoinColumn({ name: 'medecin_responsable_id' })
  medecinResponsable!: Medecin | null;

  @ApiProperty({ example: 'SEJ-20240001', description: 'Numéro de séjour unique' })
  @Column({ name: 'numero_sejour', type: 'varchar', length: 20, unique: true })
  numeroSejour!: string;

  @ApiProperty({ example: '2024-01-15T08:00:00.000Z', description: 'Date et heure d\'admission' })
  @Column({ name: 'date_admission', type: 'timestamp' })
  dateAdmission!: Date;

  @ApiPropertyOptional({ example: '2024-01-20T14:30:00.000Z', description: 'Date et heure de sortie', nullable: true })
  @Column({ name: 'date_sortie', type: 'timestamp', nullable: true })
  dateSortie!: Date | null;

  @ApiProperty({ enum: ModeEntree, description: 'Mode d\'entrée' })
  @Column({ name: 'mode_entree', type: 'enum', enum: ModeEntree })
  modeEntree!: ModeEntree;

  @ApiPropertyOptional({ enum: ModeSortie, description: 'Mode de sortie', nullable: true })
  @Column({ name: 'mode_sortie', type: 'enum', enum: ModeSortie, nullable: true })
  modeSortie!: ModeSortie | null;

  @ApiProperty({ example: 'Douleurs abdominales aiguës', description: 'Motif d\'hospitalisation' })
  @Column({ name: 'motif_hospitalisation', type: 'text' })
  motifHospitalisation!: string;

  @ApiPropertyOptional({ example: 'Chirurgie générale', description: 'Service initial d\'accueil', nullable: true })
  @Column({ name: 'service_initial', type: 'varchar', length: 100, nullable: true })
  serviceInitial!: string | null;

  // ── Relations ────────────────────────────────────────────────────────────

  @ApiProperty({ type: () => [Mouvement], description: 'Mouvements intra-hospitaliers' })
  @OneToMany(() => Mouvement, m => m.sejour, { cascade: true })
  mouvements!: Mouvement[];

  @ApiProperty({ type: () => [Diagnostic], description: 'Diagnostics posés' })
  @OneToMany(() => Diagnostic, d => d.sejour, { cascade: true })
  diagnostics!: Diagnostic[];

  @ApiProperty({ type: () => [Prescription], description: 'Prescriptions médicamenteuses' })
  @OneToMany(() => Prescription, p => p.sejour, { cascade: true })
  prescriptions!: Prescription[];

  @ApiProperty({ type: () => [Examen], description: 'Examens prescrits' })
  @OneToMany(() => Examen, e => e.sejour, { cascade: true })
  examens!: Examen[];

  @ApiProperty({ type: () => [Constante], description: 'Constantes vitales' })
  @OneToMany(() => Constante, c => c.sejour, { cascade: true })
  constantes!: Constante[];

  @ApiProperty({ type: () => [SoinInfirmier], description: 'Soins infirmiers' })
  @OneToMany(() => SoinInfirmier, s => s.sejour, { cascade: true })
  soinsInfirmiers!: SoinInfirmier[];

  @ApiProperty({ type: () => [CompteRendu], description: 'Comptes rendus médicaux' })
  @OneToMany(() => CompteRendu, c => c.sejour, { cascade: true })
  comptesRendus!: CompteRendu[];

  @ApiProperty({ type: () => [Consentement], description: 'Consentements signés' })
  @OneToMany(() => Consentement, c => c.sejour, { cascade: true })
  consentements!: Consentement[];

  @ApiPropertyOptional({ type: () => VoletAnesthesie, description: 'Volet anesthésie', nullable: true })
  @OneToOne(() => VoletAnesthesie, v => v.sejour, { cascade: true })
  voletAnesthesie!: VoletAnesthesie | null;

  @ApiPropertyOptional({ type: () => VoletSocial, description: 'Volet social', nullable: true })
  @OneToOne(() => VoletSocial, v => v.sejour, { cascade: true })
  voletSocial!: VoletSocial | null;

  @ApiPropertyOptional({ type: () => VoletNutritionnel, description: 'Volet nutritionnel', nullable: true })
  @OneToOne(() => VoletNutritionnel, v => v.sejour, { cascade: true })
  voletNutritionnel!: VoletNutritionnel | null;

  @ApiProperty({ example: '2026-04-14T10:00:00.000Z', description: 'Date de création' })
  @CreateDateColumn()
  createdAt!: Date;

  @ApiProperty({ example: '2026-04-14T10:00:00.000Z', description: 'Date de dernière modification' })
  @UpdateDateColumn()
  updatedAt!: Date;
}
