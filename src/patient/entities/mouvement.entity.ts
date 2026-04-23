// src/patient/entities/mouvement.entity.ts

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

@Entity('mouvements')
export class Mouvement {
  @ApiProperty({ example: 'uuid-xxxx', description: 'Identifiant unique (UUID)' })
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Sejour, s => s.mouvements, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sejour_id' })
  sejour!: Sejour;

  @ApiProperty({ example: '2024-01-15T10:30:00.000Z', description: 'Date et heure du mouvement' })
  @Column({ name: 'date_heure_mouvement', type: 'timestamp' })
  dateHeureMouvement!: Date;

  @ApiPropertyOptional({ example: 'Urgences', description: 'Service de départ', nullable: true })
  @Column({ name: 'service_depart', type: 'varchar', length: 100, nullable: true })
  serviceDepart!: string | null;

  @ApiProperty({ example: 'Chirurgie générale', description: 'Service d\'arrivée' })
  @Column({ name: 'service_arrivee', type: 'varchar', length: 100 })
  serviceArrivee!: string;

  @ApiPropertyOptional({ example: 'CH-201', description: 'Numéro de chambre', nullable: true })
  @Column({ name: 'numero_chambre', type: 'varchar', length: 20, nullable: true })
  numeroChambre!: string | null;

  @ApiPropertyOptional({ example: 'LIT-3', description: 'Numéro de lit', nullable: true })
  @Column({ name: 'numero_lit', type: 'varchar', length: 20, nullable: true })
  numeroLit!: string | null;

  @ApiPropertyOptional({ example: 'Stabilisation post-opératoire', description: 'Motif du transfert interne', nullable: true })
  @Column({ name: 'motif_transfert_interne', type: 'text', nullable: true })
  motifTransfertInterne!: string | null;

  @ApiProperty({ example: '2026-04-14T10:00:00.000Z', description: 'Date de création' })
  @CreateDateColumn()
  createdAt!: Date;
}
