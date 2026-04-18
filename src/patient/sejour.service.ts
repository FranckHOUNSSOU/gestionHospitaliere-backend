// src/patient/sejour.service.ts

import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Sejour } from './entities/sejour.entity';
import { Mouvement } from './entities/mouvement.entity';
import { Diagnostic } from './entities/diagnostic.entity';
import { Prescription } from './entities/prescription.entity';
import { Examen } from './entities/examen.entity';
import { ResultatExamen } from './entities/resultat-examen.entity';
import { Constante } from './entities/constante.entity';
import { SoinInfirmier } from './entities/soin-infirmier.entity';
import { CompteRendu } from './entities/compte-rendu.entity';
import { Consentement } from './entities/consentement.entity';
import { VoletAnesthesie } from './entities/volet-anesthesie.entity';
import { VoletSocial } from './entities/volet-social.entity';
import { VoletNutritionnel } from './entities/volet-nutritionnel.entity';
import { Medecin } from '../medecin/entities/medecin.entity';
import { Patient } from './entities/patient.entity';
import { CreateSejourDto } from './dto/create-sejour.dto';
import { CloturerSejourDto } from './dto/cloturer-sejour.dto';
import { CreateMouvementDto } from './dto/create-mouvement.dto';
import { CreateDiagnosticDto } from './dto/create-diagnostic.dto';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';
import { UpdatePrescriptionDto } from './dto/update-prescription.dto';
import { CreateExamenDto } from './dto/create-examen.dto';
import { CreateResultatExamenDto } from './dto/create-resultat-examen.dto';
import { CreateConstanteDto } from './dto/create-constante.dto';
import { CreateSoinInfirmierDto } from './dto/create-soin-infirmier.dto';
import { CreateCompteRenduDto } from './dto/create-compte-rendu.dto';
import { CreateConsentementDto } from './dto/create-consentement.dto';
import { UpsertVoletAnesthesieDto } from './dto/upsert-volet-anesthesie.dto';
import { UpsertVoletSocialDto } from './dto/upsert-volet-social.dto';
import { UpsertVoletNutritionnelDto } from './dto/upsert-volet-nutritionnel.dto';

@Injectable()
export class SejourService {
  constructor(
    @InjectRepository(Sejour)
    private readonly sejourRepo: Repository<Sejour>,
    @InjectRepository(Mouvement)
    private readonly mouvementRepo: Repository<Mouvement>,
    @InjectRepository(Diagnostic)
    private readonly diagnosticRepo: Repository<Diagnostic>,
    @InjectRepository(Prescription)
    private readonly prescriptionRepo: Repository<Prescription>,
    @InjectRepository(Examen)
    private readonly examenRepo: Repository<Examen>,
    @InjectRepository(ResultatExamen)
    private readonly resultatRepo: Repository<ResultatExamen>,
    @InjectRepository(Constante)
    private readonly constanteRepo: Repository<Constante>,
    @InjectRepository(SoinInfirmier)
    private readonly soinRepo: Repository<SoinInfirmier>,
    @InjectRepository(CompteRendu)
    private readonly compteRenduRepo: Repository<CompteRendu>,
    @InjectRepository(Consentement)
    private readonly consentementRepo: Repository<Consentement>,
    @InjectRepository(VoletAnesthesie)
    private readonly voletAnesthesieRepo: Repository<VoletAnesthesie>,
    @InjectRepository(VoletSocial)
    private readonly voletSocialRepo: Repository<VoletSocial>,
    @InjectRepository(VoletNutritionnel)
    private readonly voletNutritionnelRepo: Repository<VoletNutritionnel>,
    @InjectRepository(Patient)
    private readonly patientRepo: Repository<Patient>,
    @InjectRepository(Medecin)
    private readonly medecinRepo: Repository<Medecin>,
  ) {}

  // ── Helpers ───────────────────────────────────────────────────────────────

  private async findPatient(patientId: string): Promise<Patient> {
    const patient = await this.patientRepo.findOne({ where: { id: patientId } });
    if (!patient) throw new NotFoundException(`Patient introuvable (id: ${patientId}).`);
    return patient;
  }

  private async findSejour(sejourId: string): Promise<Sejour> {
    const sejour = await this.sejourRepo.findOne({ where: { id: sejourId } });
    if (!sejour) throw new NotFoundException(`Séjour introuvable (id: ${sejourId}).`);
    return sejour;
  }

  private async findMedecinIfProvided(medecinId?: string): Promise<Medecin | null> {
    if (!medecinId) return null;
    const medecin = await this.medecinRepo.findOne({ where: { id: medecinId } });
    if (!medecin) throw new NotFoundException(`Médecin introuvable (id: ${medecinId}).`);
    return medecin;
  }

  // ── SÉJOURS ───────────────────────────────────────────────────────────────

  async creerSejour(patientId: string, dto: CreateSejourDto): Promise<Sejour> {
    const patient = await this.findPatient(patientId);
    const existing = await this.sejourRepo.findOne({ where: { numeroSejour: dto.numeroSejour } });
    if (existing) {
      throw new ConflictException(`Un séjour avec le numéro "${dto.numeroSejour}" existe déjà.`);
    }
    const medecin = await this.findMedecinIfProvided(dto.medecinResponsableId);
    const sejour = this.sejourRepo.create({
      patient,
      medecinResponsable: medecin,
      numeroSejour: dto.numeroSejour,
      dateAdmission: new Date(dto.dateAdmission),
      modeEntree: dto.modeEntree,
      motifHospitalisation: dto.motifHospitalisation,
      serviceInitial: dto.serviceInitial ?? null,
    });
    return this.sejourRepo.save(sejour);
  }

  async cloturerSejour(sejourId: string, dto: CloturerSejourDto): Promise<Sejour> {
    const sejour = await this.findSejour(sejourId);
    if (sejour.dateSortie) {
      throw new ConflictException('Ce séjour est déjà clôturé.');
    }
    sejour.dateSortie = new Date(dto.dateSortie);
    sejour.modeSortie = dto.modeSortie;
    return this.sejourRepo.save(sejour);
  }

  async getSejoursPatient(patientId: string): Promise<Sejour[]> {
    await this.findPatient(patientId);
    return this.sejourRepo.find({
      where: { patient: { id: patientId } },
      order: { dateAdmission: 'DESC' },
    });
  }

  async getSejourActif(patientId: string): Promise<Sejour | null> {
    await this.findPatient(patientId);
    return this.sejourRepo.findOne({
      where: { patient: { id: patientId }, dateSortie: IsNull() },
    });
  }

  async getHistoriquePatient(patientId: string): Promise<Sejour[]> {
    await this.findPatient(patientId);
    return this.sejourRepo.find({
      where: { patient: { id: patientId } },
      order: { dateAdmission: 'DESC' },
    });
  }

  async getSejourComplet(sejourId: string): Promise<Sejour> {
    const sejour = await this.sejourRepo.findOne({
      where: { id: sejourId },
      relations: [
        'patient',
        'medecinResponsable',
        'mouvements',
        'diagnostics',
        'diagnostics.medecin',
        'prescriptions',
        'prescriptions.medecinPrescripteur',
        'examens',
        'examens.medecinPrescripteur',
        'examens.resultats',
        'constantes',
        'soinsInfirmiers',
        'comptesRendus',
        'comptesRendus.medecin',
        'consentements',
        'consentements.medecinInformateur',
        'voletAnesthesie',
        'voletAnesthesie.anesthesiste',
        'voletSocial',
        'voletNutritionnel',
      ],
    });
    if (!sejour) throw new NotFoundException(`Séjour introuvable (id: ${sejourId}).`);
    return sejour;
  }

  // ── MOUVEMENTS ────────────────────────────────────────────────────────────

  async addMouvement(sejourId: string, dto: CreateMouvementDto): Promise<Mouvement> {
    const sejour = await this.findSejour(sejourId);
    const mouvement = this.mouvementRepo.create({
      sejour,
      dateHeureMouvement: new Date(dto.dateHeureMouvement),
      serviceDepart: dto.serviceDepart ?? null,
      serviceArrivee: dto.serviceArrivee,
      numeroChambre: dto.numeroChambre ?? null,
      numeroLit: dto.numeroLit ?? null,
      motifTransfertInterne: dto.motifTransfertInterne ?? null,
    });
    return this.mouvementRepo.save(mouvement);
  }

  // ── DIAGNOSTICS ───────────────────────────────────────────────────────────

  async addDiagnostic(sejourId: string, dto: CreateDiagnosticDto): Promise<Diagnostic> {
    const sejour = await this.findSejour(sejourId);
    const medecin = await this.findMedecinIfProvided(dto.medecinId);
    const diagnostic = this.diagnosticRepo.create({
      sejour,
      medecin,
      codeCim10: dto.codeCim10,
      libelle: dto.libelle,
      type: dto.type,
      statut: dto.statut,
      dateDiagnostic: new Date(dto.dateDiagnostic),
      observations: dto.observations ?? null,
    });
    return this.diagnosticRepo.save(diagnostic);
  }

  // ── PRESCRIPTIONS ─────────────────────────────────────────────────────────

  async addPrescription(sejourId: string, dto: CreatePrescriptionDto): Promise<Prescription> {
    const sejour = await this.findSejour(sejourId);
    const medecin = await this.findMedecinIfProvided(dto.medecinPrescripteurId);
    const prescription = this.prescriptionRepo.create({
      sejour,
      medecinPrescripteur: medecin,
      nomMedicamentDci: dto.nomMedicamentDci,
      nomCommercial: dto.nomCommercial ?? null,
      formeGalenique: dto.formeGalenique ?? null,
      dose: dto.dose ?? null,
      unite: dto.unite ?? null,
      frequence: dto.frequence ?? null,
      voieAdministration: dto.voieAdministration,
      dateDebut: new Date(dto.dateDebut),
      dateFin: dto.dateFin ? new Date(dto.dateFin) : null,
      statut: dto.statut,
      observations: dto.observations ?? null,
    });
    return this.prescriptionRepo.save(prescription);
  }

  async updatePrescription(prescriptionId: string, dto: UpdatePrescriptionDto): Promise<Prescription> {
    const prescription = await this.prescriptionRepo.findOne({ where: { id: prescriptionId } });
    if (!prescription) throw new NotFoundException(`Prescription introuvable (id: ${prescriptionId}).`);
    if (dto.medecinPrescripteurId !== undefined) {
      prescription.medecinPrescripteur = await this.findMedecinIfProvided(dto.medecinPrescripteurId);
    }
    if (dto.dateDebut) prescription.dateDebut = new Date(dto.dateDebut);
    if (dto.dateFin !== undefined) prescription.dateFin = dto.dateFin ? new Date(dto.dateFin) : null;
    const { medecinPrescripteurId: _, dateDebut: _d, dateFin: _df, ...rest } = dto;
    Object.assign(prescription, rest);
    return this.prescriptionRepo.save(prescription);
  }

  // ── EXAMENS ───────────────────────────────────────────────────────────────

  async addExamen(sejourId: string, dto: CreateExamenDto): Promise<Examen> {
    const sejour = await this.findSejour(sejourId);
    const medecin = await this.findMedecinIfProvided(dto.medecinPrescripteurId);
    const examen = this.examenRepo.create({
      sejour,
      medecinPrescripteur: medecin,
      typeExamen: dto.typeExamen,
      sousType: dto.sousType ?? null,
      regionAnatomique: dto.regionAnatomique ?? null,
      dateHeurePrescription: new Date(dto.dateHeurePrescription),
      dateHeureRealisation: dto.dateHeureRealisation ? new Date(dto.dateHeureRealisation) : null,
      indication: dto.indication ?? null,
      statut: dto.statut,
    });
    return this.examenRepo.save(examen);
  }

  async addResultatExamen(examenId: string, dto: CreateResultatExamenDto): Promise<ResultatExamen> {
    const examen = await this.examenRepo.findOne({ where: { id: examenId } });
    if (!examen) throw new NotFoundException(`Examen introuvable (id: ${examenId}).`);
    const resultat = this.resultatRepo.create({
      examen,
      parametre: dto.parametre,
      valeur: dto.valeur,
      unite: dto.unite ?? null,
      valeurMinReference: dto.valeurMinReference ?? null,
      valeurMaxReference: dto.valeurMaxReference ?? null,
      interpretation: dto.interpretation ?? null,
      commentaire: dto.commentaire ?? null,
      fichierUrl: dto.fichierUrl ?? null,
      dateValidation: dto.dateValidation ? new Date(dto.dateValidation) : null,
    });
    return this.resultatRepo.save(resultat);
  }

  // ── CONSTANTES ────────────────────────────────────────────────────────────

  async addConstante(sejourId: string, dto: CreateConstanteDto): Promise<Constante> {
    const sejour = await this.findSejour(sejourId);
    const constante = this.constanteRepo.create({
      sejour,
      dateHeure: new Date(dto.dateHeure),
      tensionSystolique: dto.tensionSystolique ?? null,
      tensionDiastolique: dto.tensionDiastolique ?? null,
      frequenceCardiaque: dto.frequenceCardiaque ?? null,
      frequenceRespiratoire: dto.frequenceRespiratoire ?? null,
      temperature: dto.temperature ?? null,
      spo2: dto.spo2 ?? null,
      glycemieCapillaire: dto.glycemieCapillaire ?? null,
      poids: dto.poids ?? null,
      taille: dto.taille ?? null,
      glasgow: dto.glasgow ?? null,
      douleurEva: dto.douleurEva ?? null,
      observations: dto.observations ?? null,
    });
    return this.constanteRepo.save(constante);
  }

  // ── SOINS INFIRMIERS ──────────────────────────────────────────────────────

  async addSoinInfirmier(sejourId: string, dto: CreateSoinInfirmierDto): Promise<SoinInfirmier> {
    const sejour = await this.findSejour(sejourId);
    const soin = this.soinRepo.create({
      sejour,
      dateHeure: new Date(dto.dateHeure),
      typeAuteur: dto.typeAuteur,
      cible: dto.cible,
      donneesObservees: dto.donneesObservees ?? null,
      actionsRealisees: dto.actionsRealisees ?? null,
      resultatsObtenus: dto.resultatsObtenus ?? null,
    });
    return this.soinRepo.save(soin);
  }

  // ── COMPTES RENDUS ────────────────────────────────────────────────────────

  async addCompteRendu(sejourId: string, dto: CreateCompteRenduDto): Promise<CompteRendu> {
    const sejour = await this.findSejour(sejourId);
    const medecin = await this.findMedecinIfProvided(dto.medecinId);
    const compteRendu = this.compteRenduRepo.create({
      sejour,
      medecin,
      type: dto.type,
      date: new Date(dto.date),
      specialite: dto.specialite ?? null,
      contenu: dto.contenu,
      destinataire: dto.destinataire ?? null,
      fichierUrl: dto.fichierUrl ?? null,
    });
    return this.compteRenduRepo.save(compteRendu);
  }

  // ── CONSENTEMENTS ─────────────────────────────────────────────────────────

  async addConsentement(sejourId: string, dto: CreateConsentementDto): Promise<Consentement> {
    const sejour = await this.findSejour(sejourId);
    const medecin = await this.findMedecinIfProvided(dto.medecinInformateurId);
    const consentement = this.consentementRepo.create({
      sejour,
      medecinInformateur: medecin,
      typeActe: dto.typeActe,
      dateSignature: new Date(dto.dateSignature),
      signataire: dto.signataire,
      documentUrl: dto.documentUrl ?? null,
      estRefuse: dto.estRefuse ?? false,
      observations: dto.observations ?? null,
    });
    return this.consentementRepo.save(consentement);
  }

  // ── VOLETS (UPSERT) ───────────────────────────────────────────────────────

  async upsertVoletAnesthesie(sejourId: string, dto: UpsertVoletAnesthesieDto): Promise<VoletAnesthesie> {
    const sejour = await this.findSejour(sejourId);
    const anesthesiste = await this.findMedecinIfProvided(dto.anesthesisteId);
    let volet = await this.voletAnesthesieRepo.findOne({ where: { sejour: { id: sejourId } } });
    if (!volet) {
      volet = this.voletAnesthesieRepo.create({ sejour });
    }
    if (anesthesiste !== undefined) volet.anesthesiste = anesthesiste;
    if (dto.dateConsultationPre !== undefined) volet.dateConsultationPre = dto.dateConsultationPre ? new Date(dto.dateConsultationPre) : null;
    if (dto.scoreAsa !== undefined) volet.scoreAsa = dto.scoreAsa ?? null;
    if (dto.typeAnesthesie !== undefined) volet.typeAnesthesie = dto.typeAnesthesie ?? null;
    if (dto.produitsUtilises !== undefined) volet.produitsUtilises = dto.produitsUtilises ?? null;
    if (dto.dureeAnesthesieMin !== undefined) volet.dureeAnesthesieMin = dto.dureeAnesthesieMin ?? null;
    if (dto.incidentsPerOperatoires !== undefined) volet.incidentsPerOperatoires = dto.incidentsPerOperatoires ?? null;
    if (dto.scoreAldrete !== undefined) volet.scoreAldrete = dto.scoreAldrete ?? null;
    if (dto.consignesPostOp !== undefined) volet.consignesPostOp = dto.consignesPostOp ?? null;
    return this.voletAnesthesieRepo.save(volet);
  }

  async upsertVoletSocial(sejourId: string, dto: UpsertVoletSocialDto): Promise<VoletSocial> {
    const sejour = await this.findSejour(sejourId);
    let volet = await this.voletSocialRepo.findOne({ where: { sejour: { id: sejourId } } });
    if (!volet) {
      volet = this.voletSocialRepo.create({ sejour });
    }
    Object.assign(volet, dto);
    return this.voletSocialRepo.save(volet);
  }

  async upsertVoletNutritionnel(sejourId: string, dto: UpsertVoletNutritionnelDto): Promise<VoletNutritionnel> {
    const sejour = await this.findSejour(sejourId);
    let volet = await this.voletNutritionnelRepo.findOne({ where: { sejour: { id: sejourId } } });
    if (!volet) {
      volet = this.voletNutritionnelRepo.create({ sejour });
    }
    Object.assign(volet, dto);
    return this.voletNutritionnelRepo.save(volet);
  }
}
