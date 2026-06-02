import { Controller, Get, Param, UseGuards } from '@nestjs/common';
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
}
