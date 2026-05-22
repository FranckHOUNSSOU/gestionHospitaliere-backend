import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Patient } from '../../patient/entities/patient.entity';
import { Medecin } from '../../medecin/entities/medecin.entity';
import { User } from '../../auth/users/entities/user.entity';

export enum StatutRendezVous {
  PROGRAMME = 'Programme',
  CONFIRME  = 'Confirme',
  ANNULE    = 'Annule',
  EFFECTUE  = 'Effectue',
}

@Entity('rendezvous')
export class RendezVous {
  @ApiProperty({ example: 'uuid-xxxx', description: 'Identifiant unique' })
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ApiProperty({ description: 'Patient concerné' })
  @ManyToOne(() => Patient, { onDelete: 'CASCADE', eager: false })
  @JoinColumn({ name: 'patient_id' })
  patient!: Patient;

  @ApiProperty({ description: 'Médecin assigné' })
  @ManyToOne(() => Medecin, { onDelete: 'CASCADE', eager: false })
  @JoinColumn({ name: 'medecin_id' })
  medecin!: Medecin;

  @ApiProperty({ description: 'Agent administratif ayant créé le RDV' })
  @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true, eager: false })
  @JoinColumn({ name: 'cree_par_id' })
  creePar!: User | null;

  @ApiProperty({ example: '2026-05-22T09:00:00.000Z', description: 'Date et heure du rendez-vous' })
  @Column({ name: 'date_heure', type: 'timestamp' })
  dateHeure!: Date;

  @ApiProperty({ example: 30, description: 'Durée en minutes' })
  @Column({ name: 'duree_minutes', type: 'int', default: 30 })
  dureeMinutes!: number;

  @ApiProperty({ example: 'Consultation', description: 'Type de rendez-vous' })
  @Column({ type: 'varchar', length: 100, default: 'Consultation' })
  type!: string;

  @ApiProperty({ enum: StatutRendezVous, description: 'Statut du rendez-vous' })
  @Column({ type: 'enum', enum: StatutRendezVous, default: StatutRendezVous.PROGRAMME })
  statut!: StatutRendezVous;

  @ApiPropertyOptional({ description: 'Motif / notes', nullable: true })
  @Column({ type: 'text', nullable: true })
  motif!: string | null;

  @ApiProperty()
  @CreateDateColumn()
  createdAt!: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt!: Date;
}
