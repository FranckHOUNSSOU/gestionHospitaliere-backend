// src/service/service.controller.ts

import {
  Controller,
  Get,
  Post,
  Patch,
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
import { ServiceService } from './service.service';
import { Service } from './service.entity';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../auth/users/entities/user.entity';

@ApiTags('Services')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('services')
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMINISTRATEUR)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Créer un service (admin)',
    description: 'L\'administrateur crée un service et le rattache à un pôle via son UUID.',
  })
  @ApiBody({ type: CreateServiceDto })
  @ApiResponse({ status: 201, description: 'Service créé avec succès.', type: Service })
  @ApiResponse({ status: 404, description: 'Pôle introuvable.' })
  @ApiResponse({ status: 409, description: 'Code déjà utilisé.' })
  @ApiResponse({ status: 403, description: 'Accès réservé à l\'administrateur.' })
  create(@Body() dto: CreateServiceDto): Promise<Service> {
    return this.serviceService.create(dto);
  }

  @Get()
  @ApiOperation({
    summary: 'Lister les services',
    description: 'Retourne tous les services. Filtre optionnel par pôle (poleId = UUID du pôle).',
  })
  @ApiQuery({ name: 'poleId', type: String, required: false, description: 'Filtrer par UUID du pôle' })
  @ApiResponse({ status: 200, description: 'Liste des services.', type: [Service] })
  findAll(@Query('poleId') poleId?: string): Promise<Service[]> {
    return this.serviceService.findAll(poleId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Voir un service', description: 'Retourne les détails d\'un service (inclut le pôle rattaché).' })
  @ApiParam({ name: 'id', description: 'UUID du service' })
  @ApiResponse({ status: 200, description: 'Détails du service.', type: Service })
  @ApiResponse({ status: 404, description: 'Service introuvable.' })
  findOne(@Param('id') id: string): Promise<Service> {
    return this.serviceService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMINISTRATEUR)
  @ApiOperation({ summary: 'Modifier un service (admin)', description: 'Met à jour les informations d\'un service, y compris son pôle.' })
  @ApiParam({ name: 'id', description: 'UUID du service' })
  @ApiBody({ type: UpdateServiceDto })
  @ApiResponse({ status: 200, description: 'Service mis à jour.', type: Service })
  @ApiResponse({ status: 404, description: 'Service ou pôle introuvable.' })
  @ApiResponse({ status: 409, description: 'Code déjà utilisé.' })
  @ApiResponse({ status: 403, description: 'Accès réservé à l\'administrateur.' })
  update(@Param('id') id: string, @Body() dto: UpdateServiceDto): Promise<Service> {
    return this.serviceService.update(id, dto);
  }

  @Patch(':id/toggle-actif')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMINISTRATEUR)
  @ApiOperation({ summary: 'Activer / Désactiver un service (admin)', description: 'Bascule l\'état actif/inactif d\'un service.' })
  @ApiParam({ name: 'id', description: 'UUID du service' })
  @ApiResponse({ status: 200, description: 'État du service mis à jour.', type: Service })
  @ApiResponse({ status: 404, description: 'Service introuvable.' })
  @ApiResponse({ status: 403, description: 'Accès réservé à l\'administrateur.' })
  toggleActif(@Param('id') id: string): Promise<Service> {
    return this.serviceService.toggleActif(id);
  }
}
