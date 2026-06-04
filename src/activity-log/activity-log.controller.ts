import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ActivityLogService } from './activity-log.service';
import { FilterLogsDto } from './dto/filter-logs.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../auth/users/entities/user.entity';

@ApiTags('Activity Logs')
@Controller('activity-logs')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMINISTRATEUR)
@ApiBearerAuth('access-token')
export class ActivityLogController {
  constructor(private readonly svc: ActivityLogService) {}

  @Get()
  @ApiOperation({ summary: 'Liste des journaux d\'activité (admin)' })
  findAll(@Query() filters: FilterLogsDto) {
    return this.svc.findAll(filters);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Statistiques globales des journaux' })
  stats() {
    return this.svc.stats();
  }
}
