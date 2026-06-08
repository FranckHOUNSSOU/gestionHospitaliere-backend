import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull, LessThan } from 'typeorm';
import { Sejour, TypeSejour } from './entities/sejour.entity';
import { Notification } from '../notification/notification.entity';
import { User, UserRole } from '../auth/users/entities/user.entity';

const SEUIL_HEURES = 12;

@Injectable()
export class ConsultationAnomalieService {
  private readonly logger = new Logger(ConsultationAnomalieService.name);

  constructor(
    @InjectRepository(Sejour)
    private readonly sejourRepo: Repository<Sejour>,
    @InjectRepository(Notification)
    private readonly notifRepo: Repository<Notification>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  @Cron(CronExpression.EVERY_HOUR)
  async verifierConsultationsOubliees(): Promise<void> {
    const seuil = new Date(Date.now() - SEUIL_HEURES * 60 * 60 * 1000);

    const consultations = await this.sejourRepo.find({
      where: {
        typeSejour: TypeSejour.CONSULTATION,
        dateSortie: IsNull(),
        dateAdmission: LessThan(seuil),
      },
      relations: ['patient'],
    });

    if (consultations.length === 0) return;

    const agents = await this.userRepo.find({
      where: { role: UserRole.AGENT_ADMINISTRATIF, actif: true },
    });

    if (agents.length === 0) return;

    const depuis24h = new Date(Date.now() - 23 * 60 * 60 * 1000);

    for (const sejour of consultations) {
      const duree = Math.floor(
        (Date.now() - new Date(sejour.dateAdmission).getTime()) / (60 * 60 * 1000),
      );
      const patientNom = sejour.patient
        ? `${sejour.patient.prenom} ${sejour.patient.nom}`
        : 'Patient inconnu';

      for (const agent of agents) {
        // Anti-doublon : ne pas notifier si déjà notifié sur ce séjour dans les 23h
        const dejaNotifie = await this.notifRepo
          .createQueryBuilder('n')
          .where('n.destinataire_id = :agentId', { agentId: agent.id })
          .andWhere('n.message LIKE :pattern', { pattern: `%[${sejour.id}]%` })
          .andWhere('n.createdAt > :since', { since: depuis24h })
          .getOne();

        if (dejaNotifie) continue;

        const notif = this.notifRepo.create({
          destinataire: agent,
          message: `Consultation [${sejour.id}] ${sejour.numeroSejour} — ${patientNom} — ouverte depuis ${duree}h sans sortie enregistrée.`,
          rdvId: null,
        });
        await this.notifRepo.save(notif);
      }
    }

    this.logger.log(
      `ConsultationAnomalie : ${consultations.length} consultation(s) oubliée(s) — notifications envoyées.`,
    );
  }
}
