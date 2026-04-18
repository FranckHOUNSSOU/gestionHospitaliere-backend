// src/patient/entities/patient.entity.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Allergie } from './allergie.entity';
import { TraitementARisque } from './traitement-a-risque.entity';
import { ContactUrgence } from './contact-urgence.entity';
import { CouvertureSociale } from './couverture-sociale.entity';
import { Sejour } from './sejour.entity';

export enum SexePatient {
  M      = 'M',
  F      = 'F',
  AUTRE  = 'Autre',
}

export enum GroupeSanguinABO {
  A  = 'A',
  B  = 'B',
  AB = 'AB',
  O  = 'O',
}

export enum GroupeSanguinRhesus {
  POSITIF = 'Positif',
  NEGATIF = 'Négatif',
}

export enum StatutGroupeSanguin {
  CONFIRME     = 'Confirmé',
  NON_CONFIRME = 'Non confirmé',
}

export enum StatutReanimatoire {
  AUTORISE     = 'Autorisé',
  NON_AUTORISE = 'Non autorisé',
  CONDITIONNEL = 'Conditionnel',
}

@Entity('patients')
export class Patient {
  @ApiProperty({ example: 'uuid-xxxx', description: 'Identifiant unique (UUID)' })
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  // ── Volet Administratif ────────────────────────────────────────────────────

  @ApiProperty({ example: 'IPP-20240001', description: 'Numéro IPP unique du patient' })
  @Column({ name: 'numero_ipp', type: 'varchar', length: 20, unique: true })
  numeroIpp!: string;

  @ApiProperty({ example: 'DOE', description: 'Nom de famille' })
  @Column({ type: 'varchar', length: 100 })
  nom!: string;

  @ApiPropertyOptional({ example: 'MARTIN', description: 'Nom de jeune fille', nullable: true })
  @Column({ name: 'nom_jeune_fille', type: 'varchar', length: 100, nullable: true })
  nomJeuneFille!: string | null;

  @ApiProperty({ example: 'John', description: 'Prénom' })
  @Column({ type: 'varchar', length: 100 })
  prenom!: string;

  @ApiProperty({ example: '1990-05-14', description: 'Date de naissance' })
  @Column({ name: 'date_naissance', type: 'date' })
  dateNaissance!: Date;

  @ApiPropertyOptional({ example: 'Cotonou', description: 'Lieu de naissance', nullable: true })
  @Column({ name: 'lieu_naissance', type: 'varchar', length: 100, nullable: true })
  lieuNaissance!: string | null;

  @ApiProperty({ enum: SexePatient, description: 'Sexe du patient' })
  @Column({ type: 'enum', enum: SexePatient })
  sexe!: SexePatient;

  @ApiPropertyOptional({ example: 'Béninoise', description: 'Nationalité', nullable: true })
  @Column({ type: 'varchar', length: 50, nullable: true })
  nationalite!: string | null;

  @ApiPropertyOptional({ example: 'Français', description: 'Langue parlée', nullable: true })
  @Column({ type: 'varchar', length: 50, nullable: true })
  langue!: string | null;

  @ApiPropertyOptional({ example: 'https://...', description: 'URL photo du patient', nullable: true })
  @Column({ name: 'photo_url', type: 'varchar', length: 255, nullable: true })
  photoUrl!: string | null;

  @ApiPropertyOptional({ example: '12 Rue de la Paix', description: 'Adresse', nullable: true })
  @Column({ type: 'varchar', length: 255, nullable: true })
  adresse!: string | null;

  @ApiPropertyOptional({ example: 'Cotonou', description: 'Ville', nullable: true })
  @Column({ type: 'varchar', length: 100, nullable: true })
  ville!: string | null;

  @ApiPropertyOptional({ example: '01BP1234', description: 'Code postal', nullable: true })
  @Column({ name: 'code_postal', type: 'varchar', length: 10, nullable: true })
  codePostal!: string | null;

  @ApiPropertyOptional({ example: 'Bénin', description: 'Pays', nullable: true })
  @Column({ type: 'varchar', length: 50, nullable: true })
  pays!: string | null;

  @ApiPropertyOptional({ example: '+229 21 00 00 00', description: 'Téléphone fixe', nullable: true })
  @Column({ name: 'telephone_fixe', type: 'varchar', length: 20, nullable: true })
  telephoneFixe!: string | null;

  @ApiPropertyOptional({ example: '+229 97 00 00 00', description: 'Téléphone mobile', nullable: true })
  @Column({ name: 'telephone_mobile', type: 'varchar', length: 20, nullable: true })
  telephoneMobile!: string | null;

  @ApiPropertyOptional({ example: 'patient@email.com', description: 'Email', nullable: true })
  @Column({ type: 'varchar', length: 100, nullable: true })
  email!: string | null;

  // ── Données Critiques ──────────────────────────────────────────────────────

  @ApiPropertyOptional({ enum: GroupeSanguinABO, description: 'Groupe sanguin ABO', nullable: true })
  @Column({ name: 'groupe_sanguin_abo', type: 'enum', enum: GroupeSanguinABO, nullable: true })
  groupeSanguinAbo!: GroupeSanguinABO | null;

  @ApiPropertyOptional({ enum: GroupeSanguinRhesus, description: 'Rhésus', nullable: true })
  @Column({ name: 'groupe_sanguin_rhesus', type: 'enum', enum: GroupeSanguinRhesus, nullable: true })
  groupeSanguinRhesus!: GroupeSanguinRhesus | null;

  @ApiPropertyOptional({ example: 'Kell+, Duffy-', description: 'Phénotype étendu', nullable: true })
  @Column({ name: 'phenotype_etendu', type: 'varchar', length: 100, nullable: true })
  phenotypeEtendu!: string | null;

  @ApiPropertyOptional({ example: '2020-01-10', description: '1ère détermination groupe sanguin', nullable: true })
  @Column({ name: 'date_1ere_determination', type: 'date', nullable: true })
  date1ereDetermination!: Date | null;

  @ApiPropertyOptional({ example: '2020-02-15', description: '2ème détermination groupe sanguin', nullable: true })
  @Column({ name: 'date_2eme_determination', type: 'date', nullable: true })
  date2emeDetermination!: Date | null;

  @ApiPropertyOptional({ example: 'Labo Central', description: 'Laboratoire de détermination', nullable: true })
  @Column({ name: 'laboratoire_determination', type: 'varchar', length: 100, nullable: true })
  laboratoireDetermination!: string | null;

  @ApiPropertyOptional({ enum: StatutGroupeSanguin, description: 'Statut du groupe sanguin', nullable: true })
  @Column({ name: 'statut_groupe_sanguin', type: 'enum', enum: StatutGroupeSanguin, nullable: true })
  statutGroupeSanguin!: StatutGroupeSanguin | null;

  @ApiPropertyOptional({ enum: StatutReanimatoire, description: 'Statut réanimatoire', nullable: true })
  @Column({ name: 'statut_reanimatoire', type: 'enum', enum: StatutReanimatoire, nullable: true })
  statutReanimatoire!: StatutReanimatoire | null;

  @ApiProperty({ example: false, description: 'Directives anticipées renseignées' })
  @Column({ name: 'directives_anticipees', default: false })
  directivesAnticipees!: boolean;

  // ── Relations ──────────────────────────────────────────────────────────────

  @ApiProperty({ type: () => [Allergie], description: 'Allergies du patient' })
  @OneToMany(() => Allergie, a => a.patient, { cascade: true })
  allergies!: Allergie[];

  @ApiProperty({ type: () => [TraitementARisque], description: 'Traitements à risque' })
  @OneToMany(() => TraitementARisque, t => t.patient, { cascade: true })
  traitementsARisque!: TraitementARisque[];

  @ApiProperty({ type: () => [ContactUrgence], description: 'Contacts d\'urgence' })
  @OneToMany(() => ContactUrgence, c => c.patient, { cascade: true })
  contactsUrgence!: ContactUrgence[];

  @ApiProperty({ type: () => [CouvertureSociale], description: 'Couvertures sociales' })
  @OneToMany(() => CouvertureSociale, c => c.patient, { cascade: true })
  couverturesSociales!: CouvertureSociale[];

  @ApiProperty({ type: () => [Sejour], description: 'Séjours hospitaliers' })
  @OneToMany(() => Sejour, s => s.patient)
  sejours!: Sejour[];

  @ApiProperty({ example: '2026-04-14T10:00:00.000Z', description: 'Date de création' })
  @CreateDateColumn()
  createdAt!: Date;

  @ApiProperty({ example: '2026-04-14T10:00:00.000Z', description: 'Date de dernière modification' })
  @UpdateDateColumn()
  updatedAt!: Date;
}
