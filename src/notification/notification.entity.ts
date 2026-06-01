import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { User } from '../auth/users/entities/user.entity';

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE', eager: false })
  @JoinColumn({ name: 'destinataire_id' })
  destinataire!: User;

  @Column({ type: 'text' })
  message!: string;

  @Column({ default: false })
  lu!: boolean;

  @Column({ name: 'rdv_id', type: 'uuid', nullable: true })
  rdvId!: string | null;

  @CreateDateColumn()
  createdAt!: Date;
}
