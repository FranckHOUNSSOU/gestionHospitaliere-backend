// src/service/pole.controller.ts

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
import { PoleService } from './pole.service';
import { Pole } from './pole.entity';
import { CreatePoleDto } from './dto/create-pole.dto';
import { UpdatePoleDto } from './dto/update-pole.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../auth/users/entities/user.entity';

@ApiTags('Pôles')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('poles')
export class PoleController {
  constructor(private readonly poleService: PoleService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMINISTRATEUR)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Créer un pôle (admin)',
    description:
      'L\'administrateur initialise un pôle hospitalier. ' +
      'Trois pôles possibles : "POLE MERE", "POLE ENFANT", "POLE DES SERVICES COMMUNS".',
  })
  @ApiBody({ type: CreatePoleDto })
  @ApiResponse({ status: 201, description: 'Pôle créé.', type: Pole })
  @ApiResponse({ status: 409, description: 'Ce pôle existe déjà.' })
  @ApiResponse({ status: 403, description: 'Accès réservé à l\'administrateur.' })
  create(@Body() dto: CreatePoleDto): Promise<Pole> {
    return this.poleService.create(dto);
  }

  @Get()
  @ApiOperation({
    summary: 'Lister les pôles',
    description: 'Retourne tous les pôles hospitaliers (sans détails imbriqués).',
  })
  @ApiResponse({ status: 200, description: 'Liste des pôles.', type: [Pole] })
  findAll(): Promise<Pole[]> {
    return this.poleService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Vue complète d\'un pôle',
    description:
      'Retourne le pôle avec l\'intégralité de son contenu : ' +
      'services → médecins affectés + chambres → lits, ' +
      'agents administratifs du pôle, médecins rattachés au pôle.',
  })
  @ApiParam({ name: 'id', description: 'UUID du pôle' })
  @ApiResponse({ status: 200, description: 'Détails complets du pôle.' })
  @ApiResponse({ status: 404, description: 'Pôle introuvable.' })
  findOneWithDetails(@Param('id') id: string): Promise<any> {
    return this.poleService.findOneWithDetails(id);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMINISTRATEUR)
  @ApiOperation({ summary: 'Modifier un pôle (admin)', description: 'Modifie la description ou l\'état actif d\'un pôle.' })
  @ApiParam({ name: 'id', description: 'UUID du pôle' })
  @ApiBody({ type: UpdatePoleDto })
  @ApiResponse({ status: 200, description: 'Pôle mis à jour.', type: Pole })
  @ApiResponse({ status: 404, description: 'Pôle introuvable.' })
  @ApiResponse({ status: 403, description: 'Accès réservé à l\'administrateur.' })
  update(@Param('id') id: string, @Body() dto: UpdatePoleDto): Promise<Pole> {
    return this.poleService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMINISTRATEUR)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Supprimer un pôle (admin)',
    description: 'Supprime un pôle. Échoue si le pôle contient encore des services.',
  })
  @ApiParam({ name: 'id', description: 'UUID du pôle' })
  @ApiResponse({ status: 200, description: 'Pôle supprimé.' })
  @ApiResponse({ status: 400, description: 'Le pôle contient encore des services.' })
  @ApiResponse({ status: 404, description: 'Pôle introuvable.' })
  @ApiResponse({ status: 403, description: 'Accès réservé à l\'administrateur.' })
  remove(@Param('id') id: string): Promise<{ message: string }> {
    return this.poleService.remove(id);
  }
}
