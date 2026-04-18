// src/medecin/medecin.controller.ts

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
import { MedecinService } from './medecin.service';
import { Medecin } from './entities/medecin.entity';
import { MedecinSpecialite } from './entities/medecin-specialite.entity';
import { MedecinDiplome } from './entities/medecin-diplome.entity';
import { MedecinAccreditation } from './entities/medecin-accreditation.entity';
import { MedecinAffectation } from './entities/medecin-affectation.entity';
import { CreateMedecinDto } from './dto/create-medecin.dto';
import { UpdateMedecinDto } from './dto/update-medecin.dto';
import { CreateSpecialiteDto } from './dto/create-specialite.dto';
import { CreateDiplomeDto } from './dto/create-diplome.dto';
import { CreateAccreditationDto } from './dto/create-accreditation.dto';
import { CreateAffectationDto } from './dto/create-affectation.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { MessageResponse } from '../auth/dto/auth.responses';

@ApiTags('Médecins')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('medecins')
export class MedecinController {
  constructor(private readonly medecinService: MedecinService) {}

  // ── PROFIL ────────────────────────────────────────────────────────────────

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Créer un profil médecin',
    description: 'Crée le profil détaillé d\'un médecin à partir d\'un compte utilisateur existant avec le rôle MEDECIN.',
  })
  @ApiBody({ type: CreateMedecinDto })
  @ApiResponse({ status: 201, description: 'Profil médecin créé.', type: Medecin })
  @ApiResponse({ status: 400, description: 'L\'utilisateur n\'a pas le rôle MEDECIN.' })
  @ApiResponse({ status: 404, description: 'Utilisateur introuvable.' })
  @ApiResponse({ status: 409, description: 'Profil déjà existant ou numéro d\'ordre en double.' })
  create(@Body() dto: CreateMedecinDto): Promise<Medecin> {
    return this.medecinService.create(dto);
  }

  @Get()
  @ApiOperation({
    summary: 'Lister les médecins',
    description: 'Retourne tous les profils médecins avec leurs spécialités, diplômes, accréditations et affectations.',
  })
  @ApiResponse({ status: 200, description: 'Liste des médecins.', type: [Medecin] })
  findAll(): Promise<Medecin[]> {
    return this.medecinService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Voir un profil médecin',
    description: 'Retourne les détails complets d\'un profil médecin par son identifiant.',
  })
  @ApiParam({ name: 'id', description: 'UUID du profil médecin' })
  @ApiResponse({ status: 200, description: 'Profil médecin.', type: Medecin })
  @ApiResponse({ status: 404, description: 'Profil médecin introuvable.' })
  findOne(@Param('id') id: string): Promise<Medecin> {
    return this.medecinService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Modifier un profil médecin',
    description: 'Met à jour les informations d\'un profil médecin. L\'association utilisateur ne peut pas être modifiée.',
  })
  @ApiParam({ name: 'id', description: 'UUID du profil médecin' })
  @ApiBody({ type: UpdateMedecinDto })
  @ApiResponse({ status: 200, description: 'Profil médecin mis à jour.', type: Medecin })
  @ApiResponse({ status: 404, description: 'Profil médecin introuvable.' })
  @ApiResponse({ status: 409, description: 'Numéro d\'ordre déjà utilisé.' })
  update(@Param('id') id: string, @Body() dto: UpdateMedecinDto): Promise<Medecin> {
    return this.medecinService.update(id, dto);
  }

  // ── SPÉCIALITÉS ───────────────────────────────────────────────────────────

  @Post(':id/specialites')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Ajouter une spécialité à un médecin',
    description: 'Ajoute une spécialité médicale au profil d\'un médecin.',
  })
  @ApiParam({ name: 'id', description: 'UUID du profil médecin' })
  @ApiBody({ type: CreateSpecialiteDto })
  @ApiResponse({ status: 201, description: 'Spécialité ajoutée.', type: MedecinSpecialite })
  @ApiResponse({ status: 404, description: 'Profil médecin introuvable.' })
  addSpecialite(
    @Param('id') id: string,
    @Body() dto: CreateSpecialiteDto,
  ): Promise<MedecinSpecialite> {
    return this.medecinService.addSpecialite(id, dto);
  }

  @Delete(':id/specialites/:sid')
  @ApiOperation({
    summary: 'Supprimer une spécialité',
    description: 'Retire une spécialité du profil d\'un médecin.',
  })
  @ApiParam({ name: 'id', description: 'UUID du profil médecin' })
  @ApiParam({ name: 'sid', description: 'UUID de la spécialité' })
  @ApiResponse({ status: 200, description: 'Spécialité supprimée.', type: MessageResponse })
  @ApiResponse({ status: 404, description: 'Spécialité introuvable.' })
  removeSpecialite(
    @Param('sid') sid: string,
  ): Promise<{ message: string }> {
    return this.medecinService.removeSpecialite(sid);
  }

  // ── DIPLÔMES ──────────────────────────────────────────────────────────────

  @Post(':id/diplomes')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Ajouter un diplôme à un médecin',
    description: 'Ajoute un diplôme ou titre académique au profil d\'un médecin.',
  })
  @ApiParam({ name: 'id', description: 'UUID du profil médecin' })
  @ApiBody({ type: CreateDiplomeDto })
  @ApiResponse({ status: 201, description: 'Diplôme ajouté.', type: MedecinDiplome })
  @ApiResponse({ status: 404, description: 'Profil médecin introuvable.' })
  addDiplome(
    @Param('id') id: string,
    @Body() dto: CreateDiplomeDto,
  ): Promise<MedecinDiplome> {
    return this.medecinService.addDiplome(id, dto);
  }

  @Delete(':id/diplomes/:did')
  @ApiOperation({
    summary: 'Supprimer un diplôme',
    description: 'Retire un diplôme du profil d\'un médecin.',
  })
  @ApiParam({ name: 'id', description: 'UUID du profil médecin' })
  @ApiParam({ name: 'did', description: 'UUID du diplôme' })
  @ApiResponse({ status: 200, description: 'Diplôme supprimé.', type: MessageResponse })
  @ApiResponse({ status: 404, description: 'Diplôme introuvable.' })
  removeDiplome(
    @Param('did') did: string,
  ): Promise<{ message: string }> {
    return this.medecinService.removeDiplome(did);
  }

  // ── ACCRÉDITATIONS ────────────────────────────────────────────────────────

  @Post(':id/accreditations')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Ajouter une accréditation à un médecin',
    description: 'Ajoute une accréditation ou certification professionnelle au profil d\'un médecin.',
  })
  @ApiParam({ name: 'id', description: 'UUID du profil médecin' })
  @ApiBody({ type: CreateAccreditationDto })
  @ApiResponse({ status: 201, description: 'Accréditation ajoutée.', type: MedecinAccreditation })
  @ApiResponse({ status: 404, description: 'Profil médecin introuvable.' })
  addAccreditation(
    @Param('id') id: string,
    @Body() dto: CreateAccreditationDto,
  ): Promise<MedecinAccreditation> {
    return this.medecinService.addAccreditation(id, dto);
  }

  @Delete(':id/accreditations/:aid')
  @ApiOperation({
    summary: 'Supprimer une accréditation',
    description: 'Retire une accréditation du profil d\'un médecin.',
  })
  @ApiParam({ name: 'id', description: 'UUID du profil médecin' })
  @ApiParam({ name: 'aid', description: 'UUID de l\'accréditation' })
  @ApiResponse({ status: 200, description: 'Accréditation supprimée.', type: MessageResponse })
  @ApiResponse({ status: 404, description: 'Accréditation introuvable.' })
  removeAccreditation(
    @Param('aid') aid: string,
  ): Promise<{ message: string }> {
    return this.medecinService.removeAccreditation(aid);
  }

  // ── AFFECTATIONS ──────────────────────────────────────────────────────────

  @Post(':id/affectations')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Affecter un médecin à un service',
    description: 'Crée une affectation entre un médecin et un service hospitalier actif.',
  })
  @ApiParam({ name: 'id', description: 'UUID du profil médecin' })
  @ApiBody({ type: CreateAffectationDto })
  @ApiResponse({ status: 201, description: 'Affectation créée.', type: MedecinAffectation })
  @ApiResponse({ status: 400, description: 'Service inactif.' })
  @ApiResponse({ status: 404, description: 'Profil médecin ou service introuvable.' })
  addAffectation(
    @Param('id') id: string,
    @Body() dto: CreateAffectationDto,
  ): Promise<MedecinAffectation> {
    return this.medecinService.addAffectation(id, dto);
  }

  @Get(':id/affectations/actives')
  @ApiOperation({
    summary: 'Lister les affectations actives d\'un médecin',
    description: 'Retourne toutes les affectations actives d\'un médecin.',
  })
  @ApiParam({ name: 'id', description: 'UUID du profil médecin' })
  @ApiResponse({ status: 200, description: 'Affectations actives.', type: [MedecinAffectation] })
  @ApiResponse({ status: 404, description: 'Profil médecin introuvable.' })
  getAffectationsActives(@Param('id') id: string): Promise<MedecinAffectation[]> {
    return this.medecinService.getAffectationsActives(id);
  }

  @Patch(':id/affectations/:fid')
  @ApiOperation({
    summary: 'Désactiver une affectation',
    description: 'Désactive une affectation en cours et enregistre la date de fin à aujourd\'hui.',
  })
  @ApiParam({ name: 'id', description: 'UUID du profil médecin' })
  @ApiParam({ name: 'fid', description: 'UUID de l\'affectation' })
  @ApiResponse({ status: 200, description: 'Affectation désactivée.', type: MedecinAffectation })
  @ApiResponse({ status: 404, description: 'Affectation introuvable.' })
  @ApiResponse({ status: 409, description: 'Affectation déjà inactive.' })
  desactiverAffectation(@Param('fid') fid: string): Promise<MedecinAffectation> {
    return this.medecinService.desactiverAffectation(fid);
  }
}
