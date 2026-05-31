import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RendezVous, StatutRendezVous } from './entities/rendezvous.entity';
import { CreateRendezVousDto } from './dto/create-rendezvous.dto';
import { UpdateRendezVousDto } from './dto/update-rendezvous.dto';
import { Patient } from '../patient/entities/patient.entity';
import { Medecin } from '../medecin/entities/medecin.entity';
import { User } from '../auth/users/entities/user.entity';
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class RendezVousService {
  constructor(
    @InjectRepository(RendezVous) private readonly rdvRepo: Repository<RendezVous>,
    @InjectRepository(Patient)   private readonly patientRepo: Repository<Patient>,
    @InjectRepository(Medecin)   private readonly medecinRepo: Repository<Medecin>,
    private readonly notifService: NotificationService,
  ) {}

  async create(dto: CreateRendezVousDto, creePar: User): Promise<RendezVous> {
    const patient = await this.patientRepo.findOne({ where: { id: dto.patientId } });
    if (!patient) throw new NotFoundException(`Patient ${dto.patientId} introuvable`);

    // Le médecin est identifié par l'id du compte User (ce que le frontend envoie)
    const medecin = await this.medecinRepo.findOne({
      where: { user: { id: dto.medecinUserId } },
      relations: ['user'],
    });
    if (!medecin) throw new NotFoundException(`Médecin avec userId ${dto.medecinUserId} introuvable`);

    const rdv = this.rdvRepo.create({
      patient,
      medecin,
      creePar,
      dateHeure: new Date(dto.dateHeure),
      dureeMinutes: dto.dureeMinutes ?? 30,
      type: dto.type ?? 'Consultation',
      motif: dto.motif ?? null,
      statut: StatutRendezVous.PROGRAMME,
    });

    return this.rdvRepo.save(rdv);
  }

  // Pour l'agent administratif : tous les RDV avec filtre date optionnel
  async findAll(debut?: string, fin?: string): Promise<object[]> {
    const qb = this.rdvRepo.createQueryBuilder('rdv')
      .leftJoinAndSelect('rdv.patient', 'patient')
      .leftJoinAndSelect('rdv.medecin', 'medecin')
      .leftJoinAndSelect('medecin.user', 'medecinUser')
      .leftJoinAndSelect('medecinUser.service', 'medecinUserService')
      .orderBy('rdv.dateHeure', 'ASC');

    if (debut && fin) {
      qb.where('rdv.dateHeure BETWEEN :debut AND :fin', {
        debut: new Date(debut),
        fin: new Date(fin),
      });
    } else if (debut) {
      qb.where('rdv.dateHeure >= :debut', { debut: new Date(debut) });
    }

    const rdvs = await qb.getMany();
    return rdvs.map((r) => this.toSecretaireView(r));
  }

  // Pour le médecin connecté : ses RDV uniquement, filtré par plage de dates
  async findForMedecin(medecinUserId: string, debut?: string, fin?: string): Promise<object[]> {
    const medecin = await this.medecinRepo.findOne({
      where: { user: { id: medecinUserId } },
      relations: ['user'],
    });
    if (!medecin) return [];

    const qb = this.rdvRepo.createQueryBuilder('rdv')
      .leftJoinAndSelect('rdv.patient', 'patient')
      .where('rdv.medecin_id = :medecinId', { medecinId: medecin.id })
      .andWhere('rdv.statut != :annule', { annule: StatutRendezVous.ANNULE })
      .orderBy('rdv.dateHeure', 'ASC');

    if (debut && fin) {
      qb.andWhere('rdv.dateHeure BETWEEN :debut AND :fin', {
        debut: new Date(debut),
        fin: new Date(fin),
      });
    } else if (debut) {
      qb.andWhere('rdv.dateHeure >= :debut', { debut: new Date(debut) });
    }

    const rdvs = await qb.getMany();
    return rdvs.map((r) => this.toMedecinView(r));
  }

  async update(id: string, dto: UpdateRendezVousDto): Promise<object> {
    const rdv = await this.rdvRepo.findOne({
      where: { id },
      relations: ['medecin', 'medecin.user', 'patient'],
    });
    if (!rdv) throw new NotFoundException(`Rendez-vous ${id} introuvable`);

    if (dto.dateHeure)     rdv.dateHeure    = new Date(dto.dateHeure);
    if (dto.dureeMinutes)  rdv.dureeMinutes = dto.dureeMinutes;
    if (dto.type)          rdv.type         = dto.type;
    if (dto.motif !== undefined) rdv.motif  = dto.motif ?? null;

    const saved = await this.rdvRepo.save(rdv);

    // Notification au médecin
    const doctorUserId = rdv.medecin?.user?.id;
    if (doctorUserId) {
      const patientName = rdv.patient ? `${rdv.patient.prenom} ${rdv.patient.nom}` : 'un patient';
      const dateStr = new Date(rdv.dateHeure).toLocaleDateString('fr-FR', {
        day: '2-digit', month: 'long', year: 'numeric',
      });
      const heureStr = new Date(rdv.dateHeure).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
      await this.notifService.creer(
        doctorUserId,
        `Le rendez-vous du ${dateStr} à ${heureStr} avec ${patientName} a été modifié.`,
        id,
      );
    }

    return this.toSecretaireView(saved);
  }

  async remove(id: string): Promise<{ message: string }> {
    const rdv = await this.rdvRepo.findOne({ where: { id } });
    if (!rdv) throw new NotFoundException(`Rendez-vous ${id} introuvable`);
    await this.rdvRepo.delete(id);
    return { message: 'Rendez-vous supprimé.' };
  }

  async updateStatut(id: string, statut: StatutRendezVous): Promise<RendezVous> {
    const rdv = await this.rdvRepo.findOne({ where: { id } });
    if (!rdv) throw new NotFoundException(`Rendez-vous ${id} introuvable`);
    rdv.statut = statut;
    return this.rdvRepo.save(rdv);
  }

  // ── Formats de réponse ────────────────────────────────────────────────────

  private toSecretaireView(r: RendezVous) {
    const d = r.dateHeure;
    const date = d.toISOString().split('T')[0];
    const time = d.toTimeString().slice(0, 5);
    const statusMap: Record<StatutRendezVous, string> = {
      [StatutRendezVous.PROGRAMME]: 'scheduled',
      [StatutRendezVous.CONFIRME]:  'confirmed',
      [StatutRendezVous.EFFECTUE]:  'completed',
      [StatutRendezVous.ANNULE]:    'cancelled',
    };
    return {
      id: r.id,
      patientId:   r.patient?.id,
      patientName: r.patient ? `${r.patient.prenom} ${r.patient.nom}` : '',
      doctorId:    r.medecin?.user?.id,
      doctorName:  r.medecin?.user ? `Dr. ${r.medecin.user.prenom} ${r.medecin.user.nom}` : '',
      department:  r.medecin?.user?.service?.nom ?? '',
      date,
      time,
      duration:    r.dureeMinutes,
      type:        r.type,
      status:      statusMap[r.statut] ?? 'scheduled',
      notes:       r.motif ?? undefined,
      createdAt:   r.createdAt?.toISOString(),
    };
  }

  private toMedecinView(r: RendezVous) {
    return {
      id: r.id,
      patient: r.patient
        ? { id: r.patient.id, nom: r.patient.nom, prenom: r.patient.prenom, numeroIpp: r.patient.numeroIpp }
        : null,
      dateHeure:     r.dateHeure.toISOString(),
      motif:         r.motif ?? '',
      statut:        r.statut,
      dureeMinutes:  r.dureeMinutes,
    };
  }
}
