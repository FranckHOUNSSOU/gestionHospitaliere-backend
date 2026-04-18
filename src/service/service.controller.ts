// src/service/service.controller.ts

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
import { ServiceService } from './service.service';
import { Service } from './service.entity';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Services')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('services')
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Créer un service',
    description: 'Crée un nouveau service hospitalier avec un code unique.',
  })
  @ApiBody({ type: CreateServiceDto })
  @ApiResponse({ status: 201, description: 'Service créé avec succès.', type: Service })
  @ApiResponse({ status: 409, description: 'Code déjà utilisé par un autre service.' })
  create(@Body() dto: CreateServiceDto): Promise<Service> {
    return this.serviceService.create(dto);
  }

  @Get()
  @ApiOperation({
    summary: 'Lister les services',
    description: 'Retourne tous les services hospitaliers triés par nom.',
  })
  @ApiResponse({ status: 200, description: 'Liste des services.', type: [Service] })
  findAll(): Promise<Service[]> {
    return this.serviceService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Voir un service',
    description: 'Retourne les détails d\'un service par son identifiant.',
  })
  @ApiParam({ name: 'id', description: 'UUID du service' })
  @ApiResponse({ status: 200, description: 'Détails du service.', type: Service })
  @ApiResponse({ status: 404, description: 'Service introuvable.' })
  findOne(@Param('id') id: string): Promise<Service> {
    return this.serviceService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Modifier un service',
    description: 'Met à jour les informations d\'un service existant.',
  })
  @ApiParam({ name: 'id', description: 'UUID du service' })
  @ApiBody({ type: UpdateServiceDto })
  @ApiResponse({ status: 200, description: 'Service mis à jour.', type: Service })
  @ApiResponse({ status: 404, description: 'Service introuvable.' })
  @ApiResponse({ status: 409, description: 'Code déjà utilisé par un autre service.' })
  update(@Param('id') id: string, @Body() dto: UpdateServiceDto): Promise<Service> {
    return this.serviceService.update(id, dto);
  }

  @Patch(':id/toggle-actif')
  @ApiOperation({
    summary: 'Activer / Désactiver un service',
    description: 'Bascule l\'état actif/inactif d\'un service.',
  })
  @ApiParam({ name: 'id', description: 'UUID du service' })
  @ApiResponse({ status: 200, description: 'État du service mis à jour.', type: Service })
  @ApiResponse({ status: 404, description: 'Service introuvable.' })
  toggleActif(@Param('id') id: string): Promise<Service> {
    return this.serviceService.toggleActif(id);
  }
}
