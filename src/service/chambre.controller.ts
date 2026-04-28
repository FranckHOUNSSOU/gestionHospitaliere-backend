// src/service/chambre.controller.ts

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
import { ChambreService } from './chambre.service';
import { Chambre } from './chambre.entity';
import { CreateChambreDto } from './dto/create-chambre.dto';
import { UpdateChambreDto } from './dto/update-chambre.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../auth/users/entities/user.entity';

@ApiTags('Chambres')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('chambres')
export class ChambreController {
  constructor(private readonly chambreService: ChambreService) {}

  @Post('service/:serviceId')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMINISTRATEUR)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Créer une chambre (admin)',
    description: 'L\'administrateur crée une chambre dans un service donné.',
  })
  @ApiParam({ name: 'serviceId', description: 'UUID du service' })
  @ApiBody({ type: CreateChambreDto })
  @ApiResponse({ status: 201, description: 'Chambre créée.', type: Chambre })
  @ApiResponse({ status: 404, description: 'Service introuvable.' })
  @ApiResponse({ status: 409, description: 'Numéro de chambre déjà utilisé dans ce service.' })
  @ApiResponse({ status: 403, description: 'Accès réservé à l\'administrateur.' })
  create(@Param('serviceId') serviceId: string, @Body() dto: CreateChambreDto): Promise<Chambre> {
    return this.chambreService.create(serviceId, dto);
  }

  @Get('service/:serviceId')
  @ApiOperation({
    summary: 'Lister les chambres d\'un service',
    description: 'Retourne toutes les chambres d\'un service hospitalier.',
  })
  @ApiParam({ name: 'serviceId', description: 'UUID du service' })
  @ApiResponse({ status: 200, description: 'Liste des chambres.', type: [Chambre] })
  @ApiResponse({ status: 404, description: 'Service introuvable.' })
  findByService(@Param('serviceId') serviceId: string): Promise<Chambre[]> {
    return this.chambreService.findByService(serviceId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Voir une chambre', description: 'Retourne les détails d\'une chambre.' })
  @ApiParam({ name: 'id', description: 'UUID de la chambre' })
  @ApiResponse({ status: 200, description: 'Détails de la chambre.', type: Chambre })
  @ApiResponse({ status: 404, description: 'Chambre introuvable.' })
  findOne(@Param('id') id: string): Promise<Chambre> {
    return this.chambreService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMINISTRATEUR)
  @ApiOperation({ summary: 'Modifier une chambre (admin)', description: 'Met à jour les informations d\'une chambre.' })
  @ApiParam({ name: 'id', description: 'UUID de la chambre' })
  @ApiBody({ type: UpdateChambreDto })
  @ApiResponse({ status: 200, description: 'Chambre mise à jour.', type: Chambre })
  @ApiResponse({ status: 404, description: 'Chambre introuvable.' })
  @ApiResponse({ status: 409, description: 'Numéro déjà utilisé dans ce service.' })
  @ApiResponse({ status: 403, description: 'Accès réservé à l\'administrateur.' })
  update(@Param('id') id: string, @Body() dto: UpdateChambreDto): Promise<Chambre> {
    return this.chambreService.update(id, dto);
  }
}
