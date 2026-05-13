import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Service } from './service.entity';

export enum TypeChambre {
  INDIVIDUELLE    = 'INDIVIDUELLE',
  DOUBLE          = 'DOUBLE',
  COMMUNE         = 'COMMUNE',
  SOINS_INTENSIFS = 'SOINS_INTENSIFS',
  SUITE_PRIVEE    = 'SUITE_PRIVEE',
}

export enum StatutChambre {
  DISPONIBLE     = 'DISPONIBLE',
  OCCUPEE        = 'OCCUPEE',
  EN_MAINTENANCE = 'EN_MAINTENANCE',
  HORS_SERVICE   = 'HORS_SERVICE',
}

@Entity('chambres')
export class Chambre {
  @ApiProperty({ example: 'uuid-xxxx-xxxx' })
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ApiProperty({ example: '101' })
  @Column({ length: 20 })
  numero!: string;

  @ApiPropertyOptional({ example: 'Chambre individuelle VIP', nullable: true })
  @Column({ type: 'varchar', length: 100, nullable: true })
  designation!: string | null;

  @ApiPropertyOptional({ example: '1er', nullable: true })
  @Column({ type: 'varchar', length: 20, nullable: true })
  etage!: string | null;

  @ApiProperty({ enum: TypeChambre, example: TypeChambre.INDIVIDUELLE })
  @Column({ type: 'enum', enum: TypeChambre, default: TypeChambre.INDIVIDUELLE })
  type!: TypeChambre;

  @ApiProperty({ example: 1, description: 'Nombre de lits' })
  @Column({ type: 'int', default: 1 })
  capacite!: number;

  @ApiProperty({ enum: StatutChambre, example: StatutChambre.DISPONIBLE })
  @Column({ type: 'enum', enum: StatutChambre, default: StatutChambre.DISPONIBLE })
  statut!: StatutChambre;

  @ApiProperty()
  @ManyToOne(() => Service, { onDelete: 'RESTRICT', eager: true })
  @JoinColumn({ name: 'service_id' })
  service!: Service;

  @ApiProperty({ example: true })
  @Column({ name: 'est_active', default: true })
  estActive!: boolean;

  @ApiProperty()
  @CreateDateColumn()
  createdAt!: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt!: Date;
}