import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
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
import { UpdateRendezVousDto } from './dto/update-rendezvous.dto';
import { UpdateStatutRendezVousDto } from './dto/update-statut-rendezvous.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User, UserRole } from '../auth/users/entities/user.entity';
import { ActivityLogService } from '../activity-log/activity-log.service';
import { LogModule } from '../activity-log/activity-log.entity';

@ApiTags('Rendez-vous')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('rendezvous')
export class RendezVousController {
  constructor(
    private readonly rdvService: RendezVousService,
    private readonly logService: ActivityLogService,
  ) {}

  // ── AGENT ADMINISTRATIF : créer un RDV ────────────────────────────────────

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(RolesGuard)
  @Roles(UserRole.AGENT_ADMINISTRATIF, UserRole.ADMINISTRATEUR)
  @ApiOperation({ summary: 'Créer un rendez-vous pour un patient avec un médecin' })
  @ApiResponse({ status: 201, description: 'Rendez-vous créé.' })
  @ApiResponse({ status: 404, description: 'Patient ou médecin introuvable.' })
  async create(@Body() dto: CreateRendezVousDto, @CurrentUser() user: User) {
    const result = await this.rdvService.create(dto, user);
    this.logService.log({
      actorId: user.id, actorNom: `${user.prenom} ${user.nom}`, actorRole: user.role,
      action: 'CREATION_RENDEZVOUS', module: LogModule.RENDEZVOUS,
      description: `Rendez-vous créé le ${new Date(dto.dateHeure).toLocaleDateString('fr-FR')} — motif : ${dto.motif}`,
      cibleId: result.id,
    });
    return result;
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

  // ── MODIFIER UN RDV ──────────────────────────────────────────────────────

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.AGENT_ADMINISTRATIF, UserRole.ADMINISTRATEUR)
  @ApiOperation({ summary: 'Modifier un rendez-vous (date, heure, durée, type, motif)' })
  update(@Param('id') id: string, @Body() dto: UpdateRendezVousDto) {
    return this.rdvService.update(id, dto);
  }

  // ── SUPPRIMER UN RDV ─────────────────────────────────────────────────────

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.AGENT_ADMINISTRATIF, UserRole.ADMINISTRATEUR)
  @ApiOperation({ summary: 'Supprimer un rendez-vous' })
  async remove(@Param('id') id: string, @CurrentUser() user: User) {
    const result = await this.rdvService.remove(id);
    this.logService.log({
      actorId: user.id, actorNom: `${user.prenom} ${user.nom}`, actorRole: user.role,
      action: 'SUPPRESSION_RENDEZVOUS', module: LogModule.RENDEZVOUS,
      description: `Suppression du rendez-vous #${id}`,
      cibleId: id,
    });
    return result;
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
