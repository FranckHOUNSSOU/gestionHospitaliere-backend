import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tarif, CategorieTarif } from './tarif.entity';
import { Patient } from '../patient/entities/patient.entity';
import { Sejour } from '../patient/entities/sejour.entity';
import { Chambre, TypeChambre } from '../service/chambre.entity';
import { RendezVous } from '../rendezvous/entities/rendezvous.entity';

// Données de seed des tarifs
const TARIFS_SEED = [
  // Chambres
  { code: 'CHAMBRE_COMMUNE',        libelle: 'Chambre commune',         categorie: CategorieTarif.CHAMBRE,        prixUnitaire: 5000,  unite: 'jour' },
  { code: 'CHAMBRE_DOUBLE',         libelle: 'Chambre double',          categorie: CategorieTarif.CHAMBRE,        prixUnitaire: 10000, unite: 'jour' },
  { code: 'CHAMBRE_INDIVIDUELLE',   libelle: 'Chambre individuelle',    categorie: CategorieTarif.CHAMBRE,        prixUnitaire: 20000, unite: 'jour' },
  { code: 'CHAMBRE_SOINS_INTENSIFS',libelle: 'Soins intensifs',         categorie: CategorieTarif.CHAMBRE,        prixUnitaire: 50000, unite: 'jour' },
  { code: 'CHAMBRE_SUITE_PRIVEE',   libelle: 'Suite privée',            categorie: CategorieTarif.CHAMBRE,        prixUnitaire: 35000, unite: 'jour' },
  // Examens
  { code: 'EXAMEN_BIOLOGIE',        libelle: 'Biologie',                categorie: CategorieTarif.EXAMEN,         prixUnitaire: 15000, unite: 'acte' },
  { code: 'EXAMEN_IMAGERIE',        libelle: 'Imagerie',                categorie: CategorieTarif.EXAMEN,         prixUnitaire: 25000, unite: 'acte' },
  { code: 'EXAMEN_ECG',             libelle: 'ECG',                     categorie: CategorieTarif.EXAMEN,         prixUnitaire: 8000,  unite: 'acte' },
  { code: 'EXAMEN_ANATOMOPATHOLOGIE',libelle:'Anatomopathologie',       categorie: CategorieTarif.EXAMEN,         prixUnitaire: 30000, unite: 'acte' },
  { code: 'EXAMEN_AUTRE',           libelle: 'Examen autre',            categorie: CategorieTarif.EXAMEN,         prixUnitaire: 10000, unite: 'acte' },
  // Consultations
  { code: 'CONSULT_CONSULTATION',   libelle: 'Consultation',            categorie: CategorieTarif.CONSULTATION,   prixUnitaire: 5000,  unite: 'acte' },
  { code: 'CONSULT_SUIVI',          libelle: 'Suivi',                   categorie: CategorieTarif.CONSULTATION,   prixUnitaire: 3000,  unite: 'acte' },
  { code: 'CONSULT_CONTROLE',       libelle: 'Contrôle',                categorie: CategorieTarif.CONSULTATION,   prixUnitaire: 3000,  unite: 'acte' },
  { code: 'CONSULT_PREOPÉRATOIRE',  libelle: 'Pré-opératoire',          categorie: CategorieTarif.CONSULTATION,   prixUnitaire: 10000, unite: 'acte' },
  { code: 'CONSULT_URGENCE',        libelle: 'Urgence',                 categorie: CategorieTarif.CONSULTATION,   prixUnitaire: 15000, unite: 'acte' },
  { code: 'CONSULT_VACCINATION',    libelle: 'Vaccination',             categorie: CategorieTarif.CONSULTATION,   prixUnitaire: 5000,  unite: 'acte' },
  { code: 'CONSULT_AUTRE',          libelle: 'Consultation autre',      categorie: CategorieTarif.CONSULTATION,   prixUnitaire: 5000,  unite: 'acte' },
  // Soins infirmiers
  { code: 'SOIN_INFIRMIER',         libelle: 'Soin infirmier',          categorie: CategorieTarif.SOIN_INFIRMIER, prixUnitaire: 2500,  unite: 'acte' },
];

@Injectable()
export class FacturationService implements OnModuleInit {
  constructor(
    @InjectRepository(Tarif)    private readonly tarifRepo:   Repository<Tarif>,
    @InjectRepository(Patient)  private readonly patientRepo: Repository<Patient>,
    @InjectRepository(Sejour)   private readonly sejourRepo:  Repository<Sejour>,
    @InjectRepository(Chambre)  private readonly chambreRepo: Repository<Chambre>,
    @InjectRepository(RendezVous) private readonly rdvRepo:   Repository<RendezVous>,
  ) {}

  // Seed des tarifs au démarrage si la table est vide
  async onModuleInit() {
    try {
      const count = await this.tarifRepo.count();
      if (count === 0) {
        await this.tarifRepo.save(TARIFS_SEED.map(t => this.tarifRepo.create(t)));
      }
    } catch {
      // Table pas encore créée (premier démarrage en prod sans synchronize)
    }
  }

  async getTarifs(): Promise<Tarif[]> {
    return this.tarifRepo.find({ where: { estActif: true }, order: { categorie: 'ASC', libelle: 'ASC' } });
  }

  async getApercuFacture(patientId: string) {
    // 1. Patient
    const patient = await this.patientRepo.findOne({ where: { id: patientId } });
    if (!patient) return null;

    // Personnel hospitalier : gratuité totale
    if (patient.estPersonnelHospitalier) {
      return {
        patient: {
          id:            patient.id,
          nom:           patient.nom,
          prenom:        patient.prenom,
          numeroIpp:     patient.numeroIpp,
          dateNaissance: patient.dateNaissance,
          estPersonnelHospitalier: true,
        },
        lignesHospitalisation:  [],
        sejours:                [],
        consultations:          [],
        totalHospitalisation:   0,
        totalExamens:           0,
        totalSoins:             0,
        totalConsultations:     0,
        totalGeneral:           0,
        tarifs:                 {},
        genereLe:               new Date().toISOString(),
      };
    }

    // 2. Tarifs (map par code)
    const tarifs = await this.tarifRepo.find({ where: { estActif: true } });
    const tarifMap = new Map(tarifs.map(t => [t.code, Number(t.prixUnitaire)]));

    // 3. Séjours avec toutes les relations
    const sejours = await this.sejourRepo.find({
      where: { patient: { id: patientId } },
      relations: ['mouvements', 'examens', 'soinsInfirmiers'],
      order: { dateAdmission: 'ASC' },
    });

    // 4. RDV du patient
    const rdvs = await this.rdvRepo.find({
      where: { patient: { id: patientId } },
      relations: ['medecin', 'medecin.user'],
      order: { dateHeure: 'ASC' },
    });

    // 5. Calcul hospitalisation
    const lignesHospitalisation: object[] = [];
    let totalHospitalisation = 0;

    for (const sejour of sejours) {
      const dateDebut = new Date(sejour.dateAdmission);
      const dateFin   = sejour.dateSortie ? new Date(sejour.dateSortie) : new Date();
      const mouvements = [...(sejour.mouvements ?? [])].sort(
        (a, b) => new Date(a.dateHeureMouvement).getTime() - new Date(b.dateHeureMouvement).getTime(),
      );

      if (mouvements.length === 0) {
        // Pas de mouvement → hospitalisation générale
        const jours = Math.max(1, Math.ceil((dateFin.getTime() - dateDebut.getTime()) / 86400000));
        const tarif = tarifMap.get('CHAMBRE_COMMUNE') ?? 5000;
        const total = jours * tarif;
        totalHospitalisation += total;
        lignesHospitalisation.push({ sejourId: sejour.id, description: 'Hospitalisation (chambre commune)', jours, prixJour: tarif, total });
      } else {
        // Calculer par période de mouvement
        for (let i = 0; i < mouvements.length; i++) {
          const mvt     = mouvements[i];
          const debut   = new Date(mvt.dateHeureMouvement);
          const fin     = i + 1 < mouvements.length
            ? new Date(mouvements[i + 1].dateHeureMouvement)
            : (sejour.dateSortie ? new Date(sejour.dateSortie) : new Date());

          const jours = Math.max(1, Math.ceil((fin.getTime() - debut.getTime()) / 86400000));

          // Déterminer le type de chambre
          let typeChambre = TypeChambre.COMMUNE;
          let codeTarif   = 'CHAMBRE_COMMUNE';
          let libelleDesc = `${mvt.serviceArrivee}${mvt.numeroChambre ? ` — Chambre ${mvt.numeroChambre}` : ''}`;

          if (mvt.numeroChambre) {
            const chambre = await this.chambreRepo.findOne({ where: { numero: mvt.numeroChambre } });
            if (chambre) {
              typeChambre = chambre.type;
              const codeMap: Record<TypeChambre, string> = {
                [TypeChambre.COMMUNE]:         'CHAMBRE_COMMUNE',
                [TypeChambre.DOUBLE]:          'CHAMBRE_DOUBLE',
                [TypeChambre.INDIVIDUELLE]:    'CHAMBRE_INDIVIDUELLE',
                [TypeChambre.SOINS_INTENSIFS]: 'CHAMBRE_SOINS_INTENSIFS',
                [TypeChambre.SUITE_PRIVEE]:    'CHAMBRE_SUITE_PRIVEE',
              };
              codeTarif = codeMap[typeChambre];
              libelleDesc = `${mvt.serviceArrivee} — ${chambre.designation ?? chambre.type} (Ch.${mvt.numeroChambre})`;
            }
          }

          const prixJour = tarifMap.get(codeTarif) ?? 5000;
          const total    = jours * prixJour;
          totalHospitalisation += total;
          lignesHospitalisation.push({ sejourId: sejour.id, description: libelleDesc, jours, prixJour, total });
        }
      }

      // Examens du séjour
      const lignesExamens: object[] = [];
      let totalExamensSejour = 0;

      for (const examen of sejour.examens ?? []) {
        const codeMap: Record<string, string> = {
          'Biologie':          'EXAMEN_BIOLOGIE',
          'Imagerie':          'EXAMEN_IMAGERIE',
          'ECG':               'EXAMEN_ECG',
          'Anatomopathologie': 'EXAMEN_ANATOMOPATHOLOGIE',
          'Autre':             'EXAMEN_AUTRE',
        };
        const code   = codeMap[examen.typeExamen] ?? 'EXAMEN_AUTRE';
        const tarif  = tarifMap.get(code) ?? 10000;
        totalExamensSejour += tarif;
        lignesExamens.push({
          id: examen.id,
          description: `${examen.typeExamen}${examen.sousType ? ` — ${examen.sousType}` : ''}`,
          tarif,
        });
      }

      // Soins infirmiers du séjour
      const lignesSoins: object[] = [];
      let totalSoinsSejour = 0;
      const tarifSoin = tarifMap.get('SOIN_INFIRMIER') ?? 2500;

      for (const soin of sejour.soinsInfirmiers ?? []) {
        totalSoinsSejour += tarifSoin;
        lignesSoins.push({
          id:          soin.id,
          description: soin.cible + (soin.actionsRealisees ? ` — ${soin.actionsRealisees.substring(0, 60)}` : ''),
          dateHeure:   soin.dateHeure,
          tarif:       tarifSoin,
        });
      }

      (sejour as any)._lignesExamens  = lignesExamens;
      (sejour as any)._lignesSoins    = lignesSoins;
      (sejour as any)._totalExamens   = totalExamensSejour;
      (sejour as any)._totalSoins     = totalSoinsSejour;
    }

    // 6. Calcul examens et soins totaux
    let totalExamens = 0;
    let totalSoins   = 0;
    const sejoursData = sejours.map(s => {
      totalExamens += (s as any)._totalExamens;
      totalSoins   += (s as any)._totalSoins;
      return {
        id:            s.id,
        dateAdmission: s.dateAdmission,
        dateSortie:    s.dateSortie ?? null,
        motif:         s.motifHospitalisation,
        examens:       (s as any)._lignesExamens,
        soins:         (s as any)._lignesSoins,
        totalExamens:  (s as any)._totalExamens,
        totalSoins:    (s as any)._totalSoins,
      };
    });

    // 7. Calcul consultations / RDV
    const lignesConsultations = rdvs
      .filter(r => r.statut !== 'Annule')
      .map(r => {
        const typeMap: Record<string, string> = {
          'Consultation':   'CONSULT_CONSULTATION',
          'Suivi':          'CONSULT_SUIVI',
          'Contrôle':       'CONSULT_CONTROLE',
          'Pré-opératoire': 'CONSULT_PREOPÉRATOIRE',
          'Urgence':        'CONSULT_URGENCE',
          'Vaccination':    'CONSULT_VACCINATION',
        };
        const code   = typeMap[r.type] ?? 'CONSULT_AUTRE';
        const tarif  = tarifMap.get(code) ?? 5000;
        return {
          id:          r.id,
          dateHeure:   r.dateHeure,
          type:        r.type,
          medecin:     r.medecin?.user ? `Dr. ${r.medecin.user.prenom} ${r.medecin.user.nom}` : '—',
          statut:      r.statut,
          tarif,
        };
      });

    const totalConsultations = lignesConsultations.reduce((s, r) => s + (r as any).tarif, 0);
    const totalGeneral       = totalHospitalisation + totalExamens + totalSoins + totalConsultations;

    return {
      patient: {
        id:            patient.id,
        nom:           patient.nom,
        prenom:        patient.prenom,
        numeroIpp:     patient.numeroIpp,
        dateNaissance: patient.dateNaissance,
      },
      lignesHospitalisation,
      sejours: sejoursData,
      consultations:         lignesConsultations,
      totalHospitalisation,
      totalExamens,
      totalSoins,
      totalConsultations,
      totalGeneral,
      tarifs: Object.fromEntries(tarifMap),
      genereLe: new Date().toISOString(),
    };
  }
}
