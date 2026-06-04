import { Controller, Get, Post, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FacturationService } from './facturation.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Facturation')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('facturation')
export class FacturationController {
  constructor(private readonly facturationService: FacturationService) {}

  @Get('tarifs')
  @ApiOperation({ summary: 'Liste des tarifs actifs' })
  getTarifs() {
    return this.facturationService.getTarifs();
  }

  @Get('apercu/:patientId')
  @ApiOperation({ summary: 'Aperçu facture complet pour un patient' })
  getApercu(@Param('patientId') patientId: string) {
    return this.facturationService.getApercuFacture(patientId);
  }

  @Post('emettre/:patientId')
  @ApiOperation({ summary: 'Émettre et sauvegarder une facture pour un patient' })
  emettreFacture(@Param('patientId') patientId: string) {
    return this.facturationService.emettreFacture(patientId);
  }

  @Get('factures')
  @ApiOperation({ summary: 'Liste de toutes les factures émises' })
  listeFactures() {
    return this.facturationService.listeFactures();
  }

  @Get('diagnostic')
  @ApiOperation({ summary: 'Vérifie quelles tables existent en base' })
  async diagnostic() {
    return this.facturationService.diagnostic();
  }
}