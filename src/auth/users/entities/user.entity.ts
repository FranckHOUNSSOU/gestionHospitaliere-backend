import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  BeforeUpdate,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum UserRole {
  MEDECIN               = 'MEDECIN',
  AGENT_ADMINISTRATIF   = 'AGENT_ADMINISTRATIF',
  AGENT_RENSEIGNEMENT   = 'AGENT_RENSEIGNEMENT',   
  ADMINISTRATEUR        = 'ADMINISTRATEUR',
}

@Entity('users')
export class User {
  @ApiProperty({ example: 'uuid-xxxx-xxxx', description: 'Identifiant unique (UUID)' })
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ApiProperty({ example: 'Dupont', description: 'Nom de famille' })
  @Column({ length: 100 })
  nom!: string;

  @ApiProperty({ example: 'Jean', description: 'Prénom' })
  @Column({ length: 100 })
  prenom!: string;

  @ApiProperty({ example: 'jean.dupont@hopital.bj', description: 'Adresse email (unique)' })
  @Column({ unique: true, length: 150 })
  email!: string;

  @Column({ select: false })
  motDePasse!: string;

  @ApiPropertyOptional({ example: '+22997000000', description: 'Numéro de téléphone', nullable: true })
  @Column({ type: 'varchar', length: 20, nullable: true })
  telephone!: string | null;

  @ApiProperty({ enum: UserRole, example: UserRole.MEDECIN, description: "Rôle de l'utilisateur" })
  @Column({ type: 'enum', enum: UserRole })
  role!: UserRole;

  @ApiPropertyOptional({ example: 'Cardiologie', description: 'Service hospitalier', nullable: true })
  @Column({ type: 'varchar', length: 100, nullable: true })
  service!: string | null;

  @ApiPropertyOptional({ example: 'ORD-2024-001', description: "Numéro d'ordre professionnel", nullable: true })
  @Column({ type: 'varchar', length: 50, nullable: true })
  numeroOrdre!: string | null;

  @ApiProperty({ example: true, description: 'Indique si le compte est actif.' })
  @Column({ default: false })
  actif!: boolean;

  @ApiPropertyOptional({ description: 'Administrateur ayant créé ce compte', nullable: true })
  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL', eager: false })
  @JoinColumn({ name: 'createdBy' })
  createur!: User | null;

  @Column({ type: 'text', nullable: true, select: false })
  refreshToken!: string | null;

  @ApiPropertyOptional({ example: '2026-04-16T08:45:00.000Z', nullable: true })
  @Column({ type: 'timestamp', nullable: true })
  derniereConnexion!: Date | null;

  @ApiProperty({ example: '2026-04-14T10:00:00.000Z' })
  @CreateDateColumn()
  createdAt!: Date;

  @ApiProperty({ example: '2026-04-14T10:00:00.000Z' })
  @UpdateDateColumn()
  updatedAt!: Date;

  @BeforeInsert()
  @BeforeUpdate()
  async hashMotDePasse() {
    if (this.motDePasse) {
      const salt = await bcrypt.genSalt(10);
      this.motDePasse = await bcrypt.hash(this.motDePasse, salt);
    }
  }

  async verifierMotDePasse(motDePassePlain: string): Promise<boolean> {
    return bcrypt.compare(motDePassePlain, this.motDePasse);
  }
}