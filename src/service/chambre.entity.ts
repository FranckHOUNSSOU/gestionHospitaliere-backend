// src/service/chambre.entity.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Service } from './service.entity';

@Entity('chambres')
export class Chambre {
  @ApiProperty({ example: 'uuid-xxxx-xxxx', description: 'Identifiant unique (UUID)' })
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ApiProperty({ example: '101', description: 'Numéro de chambre (unique dans le service)' })
  @Column({ length: 20 })
  numero!: string;

  @ApiPropertyOptional({ example: 'Chambre individuelle VIP', description: 'Désignation ou description de la chambre', nullable: true })
  @Column({ type: 'varchar', length: 100, nullable: true })
  designation!: string | null;

  @ApiPropertyOptional({ example: '1er', description: 'Étage de la chambre', nullable: true })
  @Column({ type: 'varchar', length: 20, nullable: true })
  etage!: string | null;

  @ApiProperty({ description: 'Service hospitalier auquel appartient la chambre' })
  @ManyToOne(() => Service, { onDelete: 'RESTRICT', eager: true })
  @JoinColumn({ name: 'service_id' })
  service!: Service;

  @ApiProperty({ example: true, description: 'Indique si la chambre est active' })
  @Column({ name: 'est_active', default: true })
  estActive!: boolean;

  @ApiProperty({ example: '2026-04-14T10:00:00.000Z', description: 'Date de création' })
  @CreateDateColumn()
  createdAt!: Date;

  @ApiProperty({ example: '2026-04-14T10:00:00.000Z', description: 'Date de dernière modification' })
  @UpdateDateColumn()
  updatedAt!: Date;
}
