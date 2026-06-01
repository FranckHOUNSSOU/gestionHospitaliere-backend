import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './notification.entity';
import { User } from '../auth/users/entities/user.entity';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private readonly notifRepo: Repository<Notification>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async creer(destinataireId: string, message: string, rdvId?: string): Promise<void> {
    const destinataire = await this.userRepo.findOne({ where: { id: destinataireId } });
    if (!destinataire) return;
    const notif = this.notifRepo.create({ destinataire, message, rdvId: rdvId ?? null });
    await this.notifRepo.save(notif);
  }

  async getMesNotifications(userId: string) {
    const notifs = await this.notifRepo.find({
      where: { destinataire: { id: userId } },
      order: { createdAt: 'DESC' },
      take: 50,
    });
    return notifs.map((n) => ({
      id: n.id,
      message: n.message,
      lu: n.lu,
      rdvId: n.rdvId,
      createdAt: n.createdAt,
    }));
  }

  async marquerLu(id: string, userId: string): Promise<void> {
    await this.notifRepo.update({ id, destinataire: { id: userId } }, { lu: true });
  }

  async marquerToutLu(userId: string): Promise<void> {
    await this.notifRepo.update({ destinataire: { id: userId } }, { lu: true });
  }

  async countNonLu(userId: string): Promise<number> {
    return this.notifRepo.count({ where: { destinataire: { id: userId }, lu: false } });
  }
}
