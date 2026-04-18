// src/patient/sejour.controller.ts

import {
  Controller,
  Get,
  Post,
  Patch,
  Put,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { SejourService } from './sejour.service';
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
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Séjours')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('sejours')
export class SejourController {
  constructor(private readonly sejourService: SejourService) {}

  // ── SÉJOURS ───────────────────────────────────────────────────────────────

  @Post('patient/:patientId')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Créer un séjour', description: 'Crée un nouveau séjour hospitalier pour un patient.' })
  @ApiParam({ name: 'patientId', description: 'UUID du patient' })
  @ApiBody({ type: CreateSejourDto })
  @ApiResponse({ status: 201, description: 'Séjour créé.', type: Sejour })
  @ApiResponse({ status: 404, description: 'Patient introuvable.' })
  @ApiResponse({ status: 409, description: 'Numéro de séjour déjà utilisé.' })
  creerSejour(@Param('patientId') patientId: string, @Body() dto: CreateSejourDto): Promise<Sejour> {
    return this.sejourService.creerSejour(patientId, dto);
  }

  @Get('patient/:patientId')
  @ApiOperation({ summary: 'Séjours d\'un patient', description: 'Retourne tous les séjours d\'un patient.' })
  @ApiParam({ name: 'patientId', description: 'UUID du patient' })
  @ApiResponse({ status: 200, description: 'Liste des séjours.', type: [Sejour] })
  @ApiResponse({ status: 404, description: 'Patient introuvable.' })
  getSejoursPatient(@Param('patientId') patientId: string): Promise<Sejour[]> {
    return this.sejourService.getSejoursPatient(patientId);
  }

  @Get('patient/:patientId/actif')
  @ApiOperation({ summary: 'Séjour actif d\'un patient', description: 'Retourne le séjour en cours (sans date de sortie) d\'un patient.' })
  @ApiParam({ name: 'patientId', description: 'UUID du patient' })
  @ApiResponse({ status: 200, description: 'Séjour actif ou null.', type: Sejour })
  @ApiResponse({ status: 404, description: 'Patient introuvable.' })
  getSejourActif(@Param('patientId') patientId: string): Promise<Sejour | null> {
    return this.sejourService.getSejourActif(patientId);
  }

  @Get('patient/:patientId/historique')
  @ApiOperation({ summary: 'Historique des séjours d\'un patient', description: 'Retourne tous les séjours triés par date décroissante.' })
  @ApiParam({ name: 'patientId', description: 'UUID du patient' })
  @ApiResponse({ status: 200, description: 'Historique des séjours.', type: [Sejour] })
  @ApiResponse({ status: 404, description: 'Patient introuvable.' })
  getHistoriquePatient(@Param('patientId') patientId: string): Promise<Sejour[]> {
    return this.sejourService.getHistoriquePatient(patientId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Séjour complet', description: 'Retourne un séjour avec toutes ses relations.' })
  @ApiParam({ name: 'id', description: 'UUID du séjour' })
  @ApiResponse({ status: 200, description: 'Séjour complet.', type: Sejour })
  @ApiResponse({ status: 404, description: 'Séjour introuvable.' })
  getSejourComplet(@Param('id') id: string): Promise<Sejour> {
    return this.sejourService.getSejourComplet(id);
  }

  @Patch(':id/cloturer')
  @ApiOperation({ summary: 'Clôturer un séjour', description: 'Enregistre la date de sortie et le mode de sortie du séjour.' })
  @ApiParam({ name: 'id', description: 'UUID du séjour' })
  @ApiBody({ type: CloturerSejourDto })
  @ApiResponse({ status: 200, description: 'Séjour clôturé.', type: Sejour })
  @ApiResponse({ status: 404, description: 'Séjour introuvable.' })
  @ApiResponse({ status: 409, description: 'Séjour déjà clôturé.' })
  cloturerSejour(@Param('id') id: string, @Body() dto: CloturerSejourDto): Promise<Sejour> {
    return this.sejourService.cloturerSejour(id, dto);
  }

  // ── MOUVEMENTS ────────────────────────────────────────────────────────────

  @Post(':id/mouvements')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Ajouter un mouvement', description: 'Enregistre un transfert intra-hospitalier.' })
  @ApiParam({ name: 'id', description: 'UUID du séjour' })
  @ApiBody({ type: CreateMouvementDto })
  @ApiResponse({ status: 201, description: 'Mouvement enregistré.', type: Mouvement })
  @ApiResponse({ status: 404, description: 'Séjour introuvable.' })
  addMouvement(@Param('id') id: string, @Body() dto: CreateMouvementDto): Promise<Mouvement> {
    return this.sejourService.addMouvement(id, dto);
  }

  // ── DIAGNOSTICS ───────────────────────────────────────────────────────────

  @Post(':id/diagnostics')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Ajouter un diagnostic', description: 'Ajoute un diagnostic au séjour.' })
  @ApiParam({ name: 'id', description: 'UUID du séjour' })
  @ApiBody({ type: CreateDiagnosticDto })
  @ApiResponse({ status: 201, description: 'Diagnostic ajouté.', type: Diagnostic })
  @ApiResponse({ status: 404, description: 'Séjour ou médecin introuvable.' })
  addDiagnostic(@Param('id') id: string, @Body() dto: CreateDiagnosticDto): Promise<Diagnostic> {
    return this.sejourService.addDiagnostic(id, dto);
  }

  // ── PRESCRIPTIONS ─────────────────────────────────────────────────────────

  @Post(':id/prescriptions')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Ajouter une prescription', description: 'Ajoute une prescription médicamenteuse au séjour.' })
  @ApiParam({ name: 'id', description: 'UUID du séjour' })
  @ApiBody({ type: CreatePrescriptionDto })
  @ApiResponse({ status: 201, description: 'Prescription ajoutée.', type: Prescription })
  @ApiResponse({ status: 404, description: 'Séjour ou médecin introuvable.' })
  addPrescription(@Param('id') id: string, @Body() dto: CreatePrescriptionDto): Promise<Prescription> {
    return this.sejourService.addPrescription(id, dto);
  }

  @Patch(':id/prescriptions/:pid')
  @ApiOperation({ summary: 'Modifier une prescription', description: 'Met à jour une prescription médicamenteuse.' })
  @ApiParam({ name: 'id', description: 'UUID du séjour' })
  @ApiParam({ name: 'pid', description: 'UUID de la prescription' })
  @ApiBody({ type: UpdatePrescriptionDto })
  @ApiResponse({ status: 200, description: 'Prescription mise à jour.', type: Prescription })
  @ApiResponse({ status: 404, description: 'Prescription introuvable.' })
  updatePrescription(@Param('pid') pid: string, @Body() dto: UpdatePrescriptionDto): Promise<Prescription> {
    return this.sejourService.updatePrescription(pid, dto);
  }

  // ── EXAMENS ───────────────────────────────────────────────────────────────

  @Post(':id/examens')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Prescrire un examen', description: 'Ajoute un examen au séjour.' })
  @ApiParam({ name: 'id', description: 'UUID du séjour' })
  @ApiBody({ type: CreateExamenDto })
  @ApiResponse({ status: 201, description: 'Examen prescrit.', type: Examen })
  @ApiResponse({ status: 404, description: 'Séjour ou médecin introuvable.' })
  addExamen(@Param('id') id: string, @Body() dto: CreateExamenDto): Promise<Examen> {
    return this.sejourService.addExamen(id, dto);
  }

  @Post(':id/examens/:eid/resultats')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Ajouter un résultat d\'examen', description: 'Enregistre un résultat pour un examen.' })
  @ApiParam({ name: 'id', description: 'UUID du séjour' })
  @ApiParam({ name: 'eid', description: 'UUID de l\'examen' })
  @ApiBody({ type: CreateResultatExamenDto })
  @ApiResponse({ status: 201, description: 'Résultat enregistré.', type: ResultatExamen })
  @ApiResponse({ status: 404, description: 'Examen introuvable.' })
  addResultatExamen(@Param('eid') eid: string, @Body() dto: CreateResultatExamenDto): Promise<ResultatExamen> {
    return this.sejourService.addResultatExamen(eid, dto);
  }

  // ── CONSTANTES ────────────────────────────────────────────────────────────

  @Post(':id/constantes')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Enregistrer des constantes', description: 'Ajoute une mesure de constantes vitales au séjour.' })
  @ApiParam({ name: 'id', description: 'UUID du séjour' })
  @ApiBody({ type: CreateConstanteDto })
  @ApiResponse({ status: 201, description: 'Constantes enregistrées.', type: Constante })
  @ApiResponse({ status: 404, description: 'Séjour introuvable.' })
  addConstante(@Param('id') id: string, @Body() dto: CreateConstanteDto): Promise<Constante> {
    return this.sejourService.addConstante(id, dto);
  }

  // ── SOINS INFIRMIERS ──────────────────────────────────────────────────────

  @Post(':id/soins')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Enregistrer un soin infirmier', description: 'Ajoute une note de soin infirmier au séjour.' })
  @ApiParam({ name: 'id', description: 'UUID du séjour' })
  @ApiBody({ type: CreateSoinInfirmierDto })
  @ApiResponse({ status: 201, description: 'Soin enregistré.', type: SoinInfirmier })
  @ApiResponse({ status: 404, description: 'Séjour introuvable.' })
  addSoinInfirmier(@Param('id') id: string, @Body() dto: CreateSoinInfirmierDto): Promise<SoinInfirmier> {
    return this.sejourService.addSoinInfirmier(id, dto);
  }

  // ── COMPTES RENDUS ────────────────────────────────────────────────────────

  @Post(':id/comptes-rendus')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Ajouter un compte rendu', description: 'Crée un compte rendu médical pour le séjour.' })
  @ApiParam({ name: 'id', description: 'UUID du séjour' })
  @ApiBody({ type: CreateCompteRenduDto })
  @ApiResponse({ status: 201, description: 'Compte rendu créé.', type: CompteRendu })
  @ApiResponse({ status: 404, description: 'Séjour ou médecin introuvable.' })
  addCompteRendu(@Param('id') id: string, @Body() dto: CreateCompteRenduDto): Promise<CompteRendu> {
    return this.sejourService.addCompteRendu(id, dto);
  }

  // ── CONSENTEMENTS ─────────────────────────────────────────────────────────

  @Post(':id/consentements')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Enregistrer un consentement', description: 'Enregistre un consentement éclairé pour le séjour.' })
  @ApiParam({ name: 'id', description: 'UUID du séjour' })
  @ApiBody({ type: CreateConsentementDto })
  @ApiResponse({ status: 201, description: 'Consentement enregistré.', type: Consentement })
  @ApiResponse({ status: 404, description: 'Séjour ou médecin introuvable.' })
  addConsentement(@Param('id') id: string, @Body() dto: CreateConsentementDto): Promise<Consentement> {
    return this.sejourService.addConsentement(id, dto);
  }

  // ── VOLETS ────────────────────────────────────────────────────────────────

  @Put(':id/volet-anesthesie')
  @ApiOperation({ summary: 'Créer/mettre à jour le volet anesthésie', description: 'Crée ou met à jour le volet anesthésie du séjour.' })
  @ApiParam({ name: 'id', description: 'UUID du séjour' })
  @ApiBody({ type: UpsertVoletAnesthesieDto })
  @ApiResponse({ status: 200, description: 'Volet anesthésie enregistré.', type: VoletAnesthesie })
  @ApiResponse({ status: 404, description: 'Séjour introuvable.' })
  upsertVoletAnesthesie(@Param('id') id: string, @Body() dto: UpsertVoletAnesthesieDto): Promise<VoletAnesthesie> {
    return this.sejourService.upsertVoletAnesthesie(id, dto);
  }

  @Put(':id/volet-social')
  @ApiOperation({ summary: 'Créer/mettre à jour le volet social', description: 'Crée ou met à jour le volet social du séjour.' })
  @ApiParam({ name: 'id', description: 'UUID du séjour' })
  @ApiBody({ type: UpsertVoletSocialDto })
  @ApiResponse({ status: 200, description: 'Volet social enregistré.', type: VoletSocial })
  @ApiResponse({ status: 404, description: 'Séjour introuvable.' })
  upsertVoletSocial(@Param('id') id: string, @Body() dto: UpsertVoletSocialDto): Promise<VoletSocial> {
    return this.sejourService.upsertVoletSocial(id, dto);
  }

  @Put(':id/volet-nutritionnel')
  @ApiOperation({ summary: 'Créer/mettre à jour le volet nutritionnel', description: 'Crée ou met à jour le volet nutritionnel du séjour.' })
  @ApiParam({ name: 'id', description: 'UUID du séjour' })
  @ApiBody({ type: UpsertVoletNutritionnelDto })
  @ApiResponse({ status: 200, description: 'Volet nutritionnel enregistré.', type: VoletNutritionnel })
  @ApiResponse({ status: 404, description: 'Séjour introuvable.' })
  upsertVoletNutritionnel(@Param('id') id: string, @Body() dto: UpsertVoletNutritionnelDto): Promise<VoletNutritionnel> {
    return this.sejourService.upsertVoletNutritionnel(id, dto);
  }
}
