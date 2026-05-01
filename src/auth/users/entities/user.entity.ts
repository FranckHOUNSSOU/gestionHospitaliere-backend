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
import { Pole } from '../../../service/pole.entity';
import { Service } from '../../../service/service.entity';

export enum UserRole {
  MEDECIN              = 'MEDECIN',
  AGENT_ADMINISTRATIF  = 'AGENT_ADMINISTRATIF',
  ADMINISTRATEUR       = 'ADMINISTRATEUR',
  AGENT_RENSEIGNEMENT  = 'AGENT_RENSEIGNEMENT',
}

@Entity('users')
export class User {
  @ApiProperty({ example: 'uuid-xxxx-xxxx' })
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ApiProperty({ example: 'Dupont' })
  @Column({ length: 100 })
  nom!: string;

  @ApiProperty({ example: 'Jean' })
  @Column({ length: 100 })
  prenom!: string;

  @ApiProperty({ example: 'jean.dupont@hopital.bj' })
  @Column({ unique: true, length: 150 })
  email!: string;

  @Column({ select: false })
  motDePasse!: string;

  @ApiPropertyOptional({ example: '+22997000000', nullable: true })
  @Column({ type: 'varchar', length: 20, nullable: true })
  telephone!: string | null;

  @ApiProperty({ enum: UserRole, example: UserRole.MEDECIN })
  @Column({ type: 'enum', enum: UserRole })
  role!: UserRole;

  @ApiPropertyOptional({
    description: 'Pôle hospitalier. Obligatoire pour MEDECIN et AGENT_ADMINISTRATIF.',
    nullable: true,
  })
  @ManyToOne(() => Pole, { nullable: true, onDelete: 'SET NULL', eager: true })
  @JoinColumn({ name: 'pole_id' })
  pole!: Pole | null;

  @ApiPropertyOptional({
    description: 'Service hospitalier. Optionnel pour MEDECIN.',
    nullable: true,
  })
  @ManyToOne(() => Service, { nullable: true, onDelete: 'SET NULL', eager: true })
  @JoinColumn({ name: 'service_id' })
  service!: Service | null;

  @ApiPropertyOptional({ example: 'ORD-2024-001', nullable: true })
  @Column({ type: 'varchar', length: 50, nullable: true })
  numeroOrdre!: string | null;

  @ApiProperty({ example: true })
  @Column({ default: false })
  actif!: boolean;

  @ApiPropertyOptional({ nullable: true })
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
