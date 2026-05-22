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
  ApiQuery,
} from '@nestjs/swagger';
import { RendezVousService } from './rendezvous.service';
import { CreateRendezVousDto } from './dto/create-rendezvous.dto';
import { UpdateStatutRendezVousDto } from './dto/update-statut-rendezvous.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User, UserRole } from '../auth/users/entities/user.entity';

@ApiTags('Rendez-vous')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('rendezvous')
export class RendezVousController {
  constructor(private readonly rdvService: RendezVousService) {}

  // ── AGENT ADMINISTRATIF : créer un RDV ────────────────────────────────────

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(RolesGuard)
  @Roles(UserRole.AGENT_ADMINISTRATIF, UserRole.ADMINISTRATEUR)
  @ApiOperation({ summary: 'Créer un rendez-vous pour un patient avec un médecin' })
  @ApiResponse({ status: 201, description: 'Rendez-vous créé.' })
  @ApiResponse({ status: 404, description: 'Patient ou médecin introuvable.' })
  create(@Body() dto: CreateRendezVousDto, @CurrentUser() user: User) {
    return this.rdvService.create(dto, user);
  }

  // ── AGENT ADMINISTRATIF : liste de tous les RDV ───────────────────────────

  @Get()
  @UseGuards(RolesGuard)
  @Roles(UserRole.AGENT_ADMINISTRATIF, UserRole.ADMINISTRATEUR)
  @ApiOperation({ summary: 'Liste tous les rendez-vous (vue secrétaire)' })
  @ApiQuery({ name: 'debut', required: false, description: 'Date de début ISO' })
  @ApiQuery({ name: 'fin',   required: false, description: 'Date de fin ISO' })
  findAll(
    @Query('debut') debut?: string,
    @Query('fin')   fin?: string,
  ) {
    return this.rdvService.findAll(debut, fin);
  }

  // ── MÉDECIN : ses propres RDV ─────────────────────────────────────────────

  @Get('moi')
  @UseGuards(RolesGuard)
  @Roles(UserRole.MEDECIN)
  @ApiOperation({ summary: 'Rendez-vous du médecin connecté' })
  @ApiQuery({ name: 'debut', required: false })
  @ApiQuery({ name: 'fin',   required: false })
  findMesRdv(
    @CurrentUser() user: User,
    @Query('debut') debut?: string,
    @Query('fin')   fin?: string,
  ) {
    return this.rdvService.findForMedecin(user.id, debut, fin);
  }

  // ── MODIFIER LE STATUT D'UN RDV ───────────────────────────────────────────

  @Patch(':id/statut')
  @UseGuards(RolesGuard)
  @Roles(UserRole.MEDECIN, UserRole.AGENT_ADMINISTRATIF, UserRole.ADMINISTRATEUR)
  @ApiOperation({ summary: 'Mettre à jour le statut d\'un rendez-vous' })
  updateStatut(@Param('id') id: string, @Body() dto: UpdateStatutRendezVousDto) {
    return this.rdvService.updateStatut(id, dto.statut);
  }
}
