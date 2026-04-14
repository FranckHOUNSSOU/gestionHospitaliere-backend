import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import * as bcrypt from 'bcrypt';

export enum UserRole {
  MEDECIN = 'MEDECIN',
  AGENT_ADMINISTRATIF = 'AGENT_ADMINISTRATIF',
  ADMINISTRATEUR = 'ADMINISTRATEUR',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 100 })
  nom!: string;

  @Column({ length: 100 })
  prenom!: string;

  @Column({ unique: true, length: 150 })
  email!: string;

  @Column({ select: false })
  motDePasse!: string;

  @Column({ length: 20, nullable: true })
  telephone!: string | null;

  @Column({
    type: 'enum',
    enum: UserRole,
  })
  role!: UserRole;

  @Column({ length: 100, nullable: true })
  service!: string | null;

  @Column({ length: 50, nullable: true })
  numeroOrdre!: string | null;

  @Column({ nullable: true, select: false })
  refreshToken!: string | null;

  @CreateDateColumn()
  createdAt!: Date;

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