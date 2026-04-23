// src/medecin/entities/medecin.entity.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { User } from '../../auth/users/entities/user.entity';
import { MedecinSpecialite } from './medecin-specialite.entity';
import { MedecinDiplome } from './medecin-diplome.entity';
import { MedecinAccreditation } from './medecin-accreditation.entity';
import { MedecinAffectation } from './medecin-affectation.entity';

export enum StatutOrdre {
  INSCRIT  = 'Inscrit',
  SUSPENDU = 'Suspendu',
  RADIE    = 'Radié',
}

export enum Sexe {
  M     = 'M',
  F     = 'F',
  AUTRE = 'Autre',
}

export enum TypeContrat {
  TITULAIRE    = 'Titulaire',
  CONTRACTUEL  = 'Contractuel',
  VACATAIRE    = 'Vacataire',
  LIBERAL      = 'Libéral',
  INTERNE      = 'Interne',
  RESIDENT     = 'Résident',
}

@Entity('medecins')
export class Medecin {
  @ApiProperty({ example: 'uuid-xxxx-xxxx', description: 'Identifiant unique (UUID)' })
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ApiProperty({ description: 'Compte utilisateur associé (contient nom, prénom, email, téléphone)' })
  @OneToOne(() => User, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @ApiProperty({ example: 'OM-00142', description: 'Numéro d\'ordre professionnel (unique)' })
  @Column({ name: 'numero_ordre', length: 50, unique: true })
  numeroOrdre!: string;

  @ApiPropertyOptional({ example: '2020-06-15', description: 'Date d\'inscription à l\'ordre', nullable: true })
  @Column({ name: 'date_inscription_ordre', type: 'date', nullable: true })
  dateInscriptionOrdre!: Date | null;

  @ApiProperty({ enum: StatutOrdre, example: StatutOrdre.INSCRIT, description: 'Statut auprès de l\'ordre professionnel' })
  @Column({
    name: 'statut_ordre',
    type: 'enum',
    enum: StatutOrdre,
    default: StatutOrdre.INSCRIT,
  })
  statutOrdre!: StatutOrdre;

  @ApiPropertyOptional({ example: '1985-03-22', description: 'Date de naissance', nullable: true })
  @Column({ name: 'date_naissance', type: 'date', nullable: true })
  dateNaissance!: Date | null;

  @ApiPropertyOptional({ enum: Sexe, description: 'Sexe', nullable: true })
  @Column({ type: 'enum', enum: Sexe, nullable: true })
  sexe!: Sexe | null;

  @ApiPropertyOptional({ example: 'Béninoise', description: 'Nationalité', nullable: true })
  @Column({ type: 'varchar', length: 50, nullable: true })
  nationalite!: string | null;

  @ApiPropertyOptional({ example: 'https://storage.hopital.bj/photos/dr-kokou.jpg', description: 'URL de la photo de profil', nullable: true })
  @Column({ name: 'photo_url', type: 'varchar', length: 255, nullable: true })
  photoUrl!: string | null;

  @ApiPropertyOptional({ example: '+22997000000', description: 'Téléphone d\'urgence', nullable: true })
  @Column({ name: 'telephone_urgence', type: 'varchar', length: 20, nullable: true })
  telephoneUrgence!: string | null;

  @ApiPropertyOptional({ enum: TypeContrat, description: 'Type de contrat', nullable: true })
  @Column({ name: 'type_contrat', type: 'enum', enum: TypeContrat, nullable: true })
  typeContrat!: TypeContrat | null;

  @ApiPropertyOptional({ example: '2022-01-01', description: 'Date de prise de fonction', nullable: true })
  @Column({ name: 'date_prise_de_fonction', type: 'date', nullable: true })
  datePriseDeFonction!: Date | null;

  @ApiPropertyOptional({ example: '2025-12-31', description: 'Date de fin de contrat', nullable: true })
  @Column({ name: 'date_fin_contrat', type: 'date', nullable: true })
  dateFinContrat!: Date | null;

  @ApiProperty({ example: true, description: 'Indique si le profil médecin est actif dans le système' })
  @Column({ name: 'est_actif', default: true })
  estActif!: boolean;

  @ApiProperty({ description: 'Spécialités du médecin', type: () => [MedecinSpecialite] })
  @OneToMany(() => MedecinSpecialite, s => s.medecin, { cascade: true })
  specialites!: MedecinSpecialite[];

  @ApiProperty({ description: 'Diplômes du médecin', type: () => [MedecinDiplome] })
  @OneToMany(() => MedecinDiplome, d => d.medecin, { cascade: true })
  diplomes!: MedecinDiplome[];

  @ApiProperty({ description: 'Accréditations du médecin', type: () => [MedecinAccreditation] })
  @OneToMany(() => MedecinAccreditation, a => a.medecin, { cascade: true })
  accreditations!: MedecinAccreditation[];

  @ApiProperty({ description: 'Affectations du médecin dans les services', type: () => [MedecinAffectation] })
  @OneToMany(() => MedecinAffectation, a => a.medecin, { cascade: true })
  affectations!: MedecinAffectation[];

  @ApiProperty({ example: '2026-04-14T10:00:00.000Z', description: 'Date de création du profil' })
  @CreateDateColumn()
  createdAt!: Date;

  @ApiProperty({ example: '2026-04-14T10:00:00.000Z', description: 'Date de dernière modification' })
  @UpdateDateColumn()
  updatedAt!: Date;
}
