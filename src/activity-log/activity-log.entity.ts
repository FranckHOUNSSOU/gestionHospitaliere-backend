import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

export enum LogModule {
  AUTH       = 'AUTH',
  PATIENT    = 'PATIENT',
  SEJOUR     = 'SEJOUR',
  MEDECIN    = 'MEDECIN',
  CHAMBRE    = 'CHAMBRE',
  RENDEZVOUS = 'RENDEZVOUS',
  FACTURATION = 'FACTURATION',
  SYSTEME    = 'SYSTEME',
}

@Entity('activity_logs')
@Index(['createdAt'])
@Index(['actorId'])
@Index(['module'])
export class ActivityLog {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid', nullable: true })
  actorId!: string | null;

  @Column({ type: 'varchar', length: 150, nullable: true })
  actorNom!: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  actorRole!: string | null;

  @Column({ type: 'varchar', length: 100 })
  action!: string;

  @Column({ type: 'varchar', length: 500 })
  description!: string;

  @Column({ type: 'enum', enum: LogModule, default: LogModule.SYSTEME })
  module!: LogModule;

  @Column({ type: 'varchar', length: 200, nullable: true })
  cible!: string | null;

  @Column({ type: 'uuid', nullable: true })
  cibleId!: string | null;

  @CreateDateColumn()
  createdAt!: Date;
}
