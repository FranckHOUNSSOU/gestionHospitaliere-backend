// src/patient/patient.controller.ts

import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
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
import { PatientService } from './patient.service';
import { Patient } from './entities/patient.entity';
import { Allergie } from './entities/allergie.entity';
import { TraitementARisque } from './entities/traitement-a-risque.entity';
import { ContactUrgence } from './entities/contact-urgence.entity';
import { CouvertureSociale } from './entities/couverture-sociale.entity';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { CreateAllergieDto } from './dto/create-allergie.dto';
import { CreateTraitementARisqueDto } from './dto/create-traitement-a-risque.dto';
import { CreateContactUrgenceDto } from './dto/create-contact-urgence.dto';
import { CreateCouvertureSocialeDto } from './dto/create-couverture-sociale.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
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
