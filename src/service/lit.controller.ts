// src/service/lit.controller.ts

import {
  Controller,
  Get,
  Post,
  Patch,
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
import { LitService } from './lit.service';
import { Lit } from './lit.entity';
import { CreateLitDto } from './dto/create-lit.dto';
import { UpdateLitDto } from './dto/update-lit.dto';
import { UpdateStatutLitDto } from './dto/update-statut-lit.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../auth/users/entities/user.entity';

@ApiTags('Lits')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('lits')
export class LitController {
  constructor(private readonly litService: LitService) {}

  @Post('chambre/:chambreId')
  @UseGuards(RolesGuard)
  @Roles(UserRole.AGENT_ADMINISTRATIF)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Ajouter un lit dans une chambre (agent administratif)',
    description: 'L\'agent administratif ajoute un lit dans une chambre existante.',
  })
  @ApiParam({ name: 'chambreId', description: 'UUID de la chambre' })
  @ApiBody({ type: CreateLitDto })
  @ApiResponse({ status: 201, description: 'Lit ajouté.', type: Lit })
  @ApiResponse({ status: 404, description: 'Chambre introuvable.' })
  @ApiResponse({ status: 409, description: 'Numéro de lit déjà utilisé dans cette chambre.' })
  @ApiResponse({ status: 403, description: 'Accès réservé à l\'agent administratif.' })
  create(@Param('chambreId') chambreId: string, @Body() dto: CreateLitDto): Promise<Lit> {
    return this.litService.create(chambreId, dto);
  }

  @Get('chambre/:chambreId')
  @ApiOperation({
    summary: 'Lister les lits d\'une chambre',
    description: 'Retourne tous les lits d\'une chambre avec leur statut.',
  })
  @ApiParam({ name: 'chambreId', description: 'UUID de la chambre' })
  @ApiResponse({ status: 200, description: 'Liste des lits.', type: [Lit] })
  @ApiResponse({ status: 404, description: 'Chambre introuvable.' })
  findByChambre(@Param('chambreId') chambreId: string): Promise<Lit[]> {
    return this.litService.findByChambre(chambreId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Voir un lit', description: 'Retourne les détails d\'un lit.' })
  @ApiParam({ name: 'id', description: 'UUID du lit' })
  @ApiResponse({ status: 200, description: 'Détails du lit.', type: Lit })
  @ApiResponse({ status: 404, description: 'Lit introuvable.' })
  findOne(@Param('id') id: string): Promise<Lit> {
    return this.litService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.AGENT_ADMINISTRATIF)
  @ApiOperation({
    summary: 'Modifier un lit (agent administratif)',
    description: 'Met à jour le numéro, le type ou le statut d\'un lit.',
  })
  @ApiParam({ name: 'id', description: 'UUID du lit' })
  @ApiBody({ type: UpdateLitDto })
  @ApiResponse({ status: 200, description: 'Lit mis à jour.', type: Lit })
  @ApiResponse({ status: 404, description: 'Lit introuvable.' })
  @ApiResponse({ status: 409, description: 'Numéro déjà utilisé dans cette chambre.' })
  @ApiResponse({ status: 403, description: 'Accès réservé à l\'agent administratif.' })
  update(@Param('id') id: string, @Body() dto: UpdateLitDto): Promise<Lit> {
    return this.litService.update(id, dto);
  }

  @Patch(':id/statut')
  @UseGuards(RolesGuard)
  @Roles(UserRole.AGENT_ADMINISTRATIF, UserRole.MEDECIN)
  @ApiOperation({
    summary: 'Changer le statut d\'un lit',
    description: 'Met à jour le statut d\'un lit (Libre, Occupé, En entretien, Hors service). Accessible à l\'agent administratif et au médecin.',
  })
  @ApiParam({ name: 'id', description: 'UUID du lit' })
  @ApiBody({ type: UpdateStatutLitDto })
  @ApiResponse({ status: 200, description: 'Statut mis à jour.', type: Lit })
  @ApiResponse({ status: 404, description: 'Lit introuvable.' })
  updateStatut(@Param('id') id: string, @Body() dto: UpdateStatutLitDto): Promise<Lit> {
    return this.litService.updateStatut(id, dto);
  }
}
