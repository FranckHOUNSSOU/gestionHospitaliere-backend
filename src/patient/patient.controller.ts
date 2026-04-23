// src/patient/patient.controller.ts

import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
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
  ApiQuery,
} from '@nestjs/swagger';
import { PatientService } from './patient.service';
import { Patient } from './entities/patient.entity';
import { Allergie } from './entities/allergie.entity';
import { TraitementARisque } from './entities/traitement-a-risque.entity';
import { ContactUrgence } from './entities/contact-urgence.entity';
import { CouvertureSociale } from './entities/couverture-sociale.entity';
import { User } from '../auth/users/entities/user.entity';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { CreateAllergieDto } from './dto/create-allergie.dto';
import { CreateTraitementARisqueDto } from './dto/create-traitement-a-risque.dto';
import { CreateContactUrgenceDto } from './dto/create-contact-urgence.dto';
import { CreateCouvertureSocialeDto } from './dto/create-couverture-sociale.dto';
import { CreatePatientAccueilDto } from './dto/create-patient-accueil.dto';
import { CreatePatientCritiqueDto } from './dto/create-patient-critique.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole } from '../auth/users/entities/user.entity';
import { MessageResponse } from '../auth/dto/auth.responses';

@ApiTags('Patients')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('patients')
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  // ── PROFIL ────────────────────────────────────────────────────────────────

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Créer un patient', description: 'Crée un nouveau dossier patient.' })
  @ApiBody({ type: CreatePatientDto })
  @ApiResponse({ status: 201, description: 'Patient créé.', type: Patient })
  @ApiResponse({ status: 409, description: 'Numéro IPP déjà utilisé.' })
  create(@Body() dto: CreatePatientDto): Promise<Patient> {
    return this.patientService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Lister les patients', description: 'Retourne tous les dossiers patients.' })
  @ApiResponse({ status: 200, description: 'Liste des patients.', type: [Patient] })
  findAll(): Promise<Patient[]> {
    return this.patientService.findAll();
  }

  @Get('ipp/:ipp')
  @ApiOperation({ summary: 'Rechercher par IPP', description: 'Retourne le patient correspondant au numéro IPP.' })
  @ApiParam({ name: 'ipp', description: 'Numéro IPP du patient' })
  @ApiResponse({ status: 200, description: 'Patient trouvé.', type: Patient })
  @ApiResponse({ status: 404, description: 'Patient introuvable.' })
  findByNumeroIPP(@Param('ipp') ipp: string): Promise<Patient> {
    return this.patientService.findByNumeroIPP(ipp);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Voir un patient', description: 'Retourne le dossier patient par son identifiant.' })
  @ApiParam({ name: 'id', description: 'UUID du patient' })
  @ApiResponse({ status: 200, description: 'Patient trouvé.', type: Patient })
  @ApiResponse({ status: 404, description: 'Patient introuvable.' })
  findOne(@Param('id') id: string): Promise<Patient> {
    return this.patientService.findOne(id);
  }

  @Get(':id/dossier')
  @ApiOperation({ summary: 'Dossier complet d\'un patient', description: 'Retourne le dossier complet incluant toutes les données permanentes.' })
  @ApiParam({ name: 'id', description: 'UUID du patient' })
  @ApiResponse({ status: 200, description: 'Dossier complet.', type: Patient })
  @ApiResponse({ status: 404, description: 'Patient introuvable.' })
  getDossierComplet(@Param('id') id: string): Promise<Patient> {
    return this.patientService.getDossierComplet(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Modifier un patient', description: 'Met à jour les informations d\'un dossier patient.' })
  @ApiParam({ name: 'id', description: 'UUID du patient' })
  @ApiBody({ type: UpdatePatientDto })
  @ApiResponse({ status: 200, description: 'Patient mis à jour.', type: Patient })
  @ApiResponse({ status: 404, description: 'Patient introuvable.' })
  @ApiResponse({ status: 409, description: 'Numéro IPP déjà utilisé.' })
  update(@Param('id') id: string, @Body() dto: UpdatePatientDto): Promise<Patient> {
    return this.patientService.update(id, dto);
  }

  // ── ACCUEIL / ADMISSIONS RAPIDES ──────────────────────────────────────────

  @Post('accueil')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(RolesGuard)
  @Roles(UserRole.AGENT_RENSEIGNEMENT, UserRole.AGENT_ADMINISTRATIF, UserRole.ADMINISTRATEUR)
  @ApiOperation({ summary: 'Accueillir un nouveau patient', description: 'Crée un dossier patient avec les informations minimales requises à l\'accueil. Génère automatiquement le numéro IPP et enregistre le contact d\'urgence.' })
  @ApiBody({ type: CreatePatientAccueilDto })
  @ApiResponse({ status: 201, description: 'Patient créé et contact d\'urgence enregistré.', type: Patient })
  @ApiResponse({ status: 403, description: 'Accès refusé — rôle insuffisant.' })
  @ApiResponse({ status: 409, description: 'Conflit IPP.' })
  accueillirNouveauPatient(
    @Body() dto: CreatePatientAccueilDto,
    @CurrentUser() user: User,
  ): Promise<Patient> {
    return this.patientService.accueillirNouveauPatient(dto, user);
  }

  @Post('critique')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(RolesGuard)
  @Roles(UserRole.AGENT_RENSEIGNEMENT, UserRole.AGENT_ADMINISTRATIF, UserRole.MEDECIN, UserRole.ADMINISTRATEUR)
  @ApiOperation({ summary: 'Admettre un patient critique / inconnu', description: 'Crée un dossier provisoire pour un patient arrivant en urgence dont l\'identité est inconnue ou partielle. Le numéro IPP provisoire est au format IPP-PROV-YYYY-XXXX. Le profil devra être complété ultérieurement.' })
  @ApiBody({ type: CreatePatientCritiqueDto })
  @ApiResponse({ status: 201, description: 'Dossier provisoire créé.', type: Patient })
  @ApiResponse({ status: 403, description: 'Accès refusé — rôle insuffisant.' })
  admettrePatientCritique(
    @Body() dto: CreatePatientCritiqueDto,
    @CurrentUser() user: User,
  ): Promise<Patient> {
    return this.patientService.admettrePatientCritique(dto, user);
  }

  @Get('recherche')
  @ApiOperation({ summary: 'Rechercher un patient', description: 'Recherche par nom, prénom ou numéro IPP (insensible à la casse). Retourne au maximum 20 résultats.' })
  @ApiQuery({ name: 'q', description: 'Terme de recherche (nom, prénom ou IPP)', required: true, example: 'Diallo' })
  @ApiResponse({ status: 200, description: 'Résultats de la recherche.', type: [Patient] })
  rechercherPatient(@Query('q') q: string): Promise<Patient[]> {
    return this.patientService.rechercherPatient(q ?? '');
  }

  @Patch(':id/completer')
  @UseGuards(RolesGuard)
  @Roles(UserRole.AGENT_RENSEIGNEMENT, UserRole.AGENT_ADMINISTRATIF, UserRole.ADMINISTRATEUR)
  @ApiOperation({ summary: 'Compléter le profil d\'un patient', description: 'Met à jour les informations d\'un dossier incomplet (ex : patient critique admis sans identité complète) et passe le statut du profil à "Complet".' })
  @ApiParam({ name: 'id', description: 'UUID du patient' })
  @ApiBody({ type: UpdatePatientDto })
  @ApiResponse({ status: 200, description: 'Profil complété, statut passé à Complet.', type: Patient })
  @ApiResponse({ status: 403, description: 'Accès refusé — rôle insuffisant.' })
  @ApiResponse({ status: 404, description: 'Patient introuvable.' })
  completerProfil(
    @Param('id') id: string,
    @Body() dto: UpdatePatientDto,
  ): Promise<Patient> {
    return this.patientService.completerProfil(id, dto);
  }

  // ── ALLERGIES ─────────────────────────────────────────────────────────────

  @Post(':id/allergies')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Ajouter une allergie', description: 'Ajoute une allergie au dossier patient.' })
  @ApiParam({ name: 'id', description: 'UUID du patient' })
  @ApiBody({ type: CreateAllergieDto })
  @ApiResponse({ status: 201, description: 'Allergie ajoutée.', type: Allergie })
  @ApiResponse({ status: 404, description: 'Patient introuvable.' })
  addAllergie(@Param('id') id: string, @Body() dto: CreateAllergieDto): Promise<Allergie> {
    return this.patientService.addAllergie(id, dto);
  }

  @Delete(':id/allergies/:aid')
  @ApiOperation({ summary: 'Supprimer une allergie', description: 'Retire une allergie du dossier patient.' })
  @ApiParam({ name: 'id', description: 'UUID du patient' })
  @ApiParam({ name: 'aid', description: 'UUID de l\'allergie' })
  @ApiResponse({ status: 200, description: 'Allergie supprimée.', type: MessageResponse })
  @ApiResponse({ status: 404, description: 'Allergie introuvable.' })
  removeAllergie(@Param('aid') aid: string): Promise<{ message: string }> {
    return this.patientService.removeAllergie(aid);
  }

  // ── TRAITEMENTS À RISQUE ──────────────────────────────────────────────────

  @Post(':id/traitements')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Ajouter un traitement à risque', description: 'Ajoute un traitement à risque au dossier patient.' })
  @ApiParam({ name: 'id', description: 'UUID du patient' })
  @ApiBody({ type: CreateTraitementARisqueDto })
  @ApiResponse({ status: 201, description: 'Traitement à risque ajouté.', type: TraitementARisque })
  @ApiResponse({ status: 404, description: 'Patient introuvable.' })
  addTraitementARisque(@Param('id') id: string, @Body() dto: CreateTraitementARisqueDto): Promise<TraitementARisque> {
    return this.patientService.addTraitementARisque(id, dto);
  }

  @Delete(':id/traitements/:tid')
  @ApiOperation({ summary: 'Supprimer un traitement à risque', description: 'Retire un traitement à risque du dossier patient.' })
  @ApiParam({ name: 'id', description: 'UUID du patient' })
  @ApiParam({ name: 'tid', description: 'UUID du traitement' })
  @ApiResponse({ status: 200, description: 'Traitement à risque supprimé.', type: MessageResponse })
  @ApiResponse({ status: 404, description: 'Traitement introuvable.' })
  removeTraitementARisque(@Param('tid') tid: string): Promise<{ message: string }> {
    return this.patientService.removeTraitementARisque(tid);
  }

  // ── CONTACTS D'URGENCE ────────────────────────────────────────────────────

  @Post(':id/contacts')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Ajouter un contact d\'urgence', description: 'Ajoute un contact d\'urgence au dossier patient.' })
  @ApiParam({ name: 'id', description: 'UUID du patient' })
  @ApiBody({ type: CreateContactUrgenceDto })
  @ApiResponse({ status: 201, description: 'Contact d\'urgence ajouté.', type: ContactUrgence })
  @ApiResponse({ status: 404, description: 'Patient introuvable.' })
  addContactUrgence(@Param('id') id: string, @Body() dto: CreateContactUrgenceDto): Promise<ContactUrgence> {
    return this.patientService.addContactUrgence(id, dto);
  }

  @Delete(':id/contacts/:cid')
  @ApiOperation({ summary: 'Supprimer un contact d\'urgence', description: 'Retire un contact d\'urgence du dossier patient.' })
  @ApiParam({ name: 'id', description: 'UUID du patient' })
  @ApiParam({ name: 'cid', description: 'UUID du contact' })
  @ApiResponse({ status: 200, description: 'Contact d\'urgence supprimé.', type: MessageResponse })
  @ApiResponse({ status: 404, description: 'Contact introuvable.' })
  removeContactUrgence(@Param('cid') cid: string): Promise<{ message: string }> {
    return this.patientService.removeContactUrgence(cid);
  }

  // ── COUVERTURES SOCIALES ──────────────────────────────────────────────────

  @Post(':id/couvertures')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Ajouter une couverture sociale', description: 'Ajoute une couverture sociale au dossier patient.' })
  @ApiParam({ name: 'id', description: 'UUID du patient' })
  @ApiBody({ type: CreateCouvertureSocialeDto })
  @ApiResponse({ status: 201, description: 'Couverture sociale ajoutée.', type: CouvertureSociale })
  @ApiResponse({ status: 404, description: 'Patient introuvable.' })
  addCouvertureSociale(@Param('id') id: string, @Body() dto: CreateCouvertureSocialeDto): Promise<CouvertureSociale> {
    return this.patientService.addCouvertureSociale(id, dto);
  }

  @Patch(':id/couvertures/:cid')
  @ApiOperation({ summary: 'Désactiver une couverture sociale', description: 'Désactive une couverture sociale du dossier patient.' })
  @ApiParam({ name: 'id', description: 'UUID du patient' })
  @ApiParam({ name: 'cid', description: 'UUID de la couverture' })
  @ApiResponse({ status: 200, description: 'Couverture sociale désactivée.', type: CouvertureSociale })
  @ApiResponse({ status: 404, description: 'Couverture sociale introuvable.' })
  desactiverCouvertureSociale(@Param('cid') cid: string): Promise<CouvertureSociale> {
    return this.patientService.desactiverCouvertureSociale(cid);
  }
}
