import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum CategorieTarif {
  CHAMBRE        = 'CHAMBRE',
  EXAMEN         = 'EXAMEN',
  CONSULTATION   = 'CONSULTATION',
  SOIN_INFIRMIER = 'SOIN_INFIRMIER',
}

@Entity('tarifs')
export class Tarif {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'enum', enum: CategorieTarif })
  categorie!: CategorieTarif;

  @Column({ length: 100, unique: true })
  code!: string;

  @Column({ length: 200 })
  libelle!: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  prixUnitaire!: number;

  @Column({ length: 20, default: 'acte' })
  unite!: string;

  @Column({ default: true })
  estActif!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
