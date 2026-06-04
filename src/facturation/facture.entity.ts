import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, RelationId } from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Patient } from '../patient/entities/patient.entity';

export enum StatutFacture {
  EMISE   = 'Émise',
  PAYEE   = 'Payée',
  ANNULEE = 'Annulée',
}

@Entity('factures')
export class Facture {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ApiProperty({ example: 'FAC-2026-00001' })
  @Column({ name: 'numero_facture', type: 'varchar', length: 20, unique: true })
  numeroFacture!: string;

  @ManyToOne(() => Patient, { onDelete: 'RESTRICT', eager: false, nullable: true })
  @JoinColumn({ name: 'patient_id' })
  patient!: Patient | null;

  @RelationId((f: Facture) => f.patient)
  patientId!: string | null;

  @ApiProperty()
  @Column({ name: 'patient_nom', type: 'varchar', length: 100 })
  patientNom!: string;

  @ApiProperty()
  @Column({ name: 'patient_prenom', type: 'varchar', length: 100 })
  patientPrenom!: string;

  @ApiProperty()
  @Column({ name: 'montant_total', type: 'decimal', precision: 12, scale: 2, default: 0 })
  montantTotal!: number;

  @ApiProperty()
  @Column({ name: 'statut', type: 'varchar', length: 20, default: 'Émise' })
  statut!: string;

  @ApiPropertyOptional()
  @Column({ name: 'snapshot', type: 'json', nullable: true })
  snapshot!: object | null;

  @ApiProperty()
  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}