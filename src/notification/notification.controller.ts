import { Controller, Get, Patch, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { NotificationService } from './notification.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../auth/users/entities/user.entity';

@ApiTags('Notifications')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationController {
  constructor(private readonly notifService: NotificationService) {}

  @Get('moi')
  @ApiOperation({ summary: 'Mes notifications' })
  getMesNotifications(@CurrentUser() user: User) {
    return this.notifService.getMesNotifications(user.id);
  }

  @Get('moi/count')
  @ApiOperation({ summary: 'Nombre de notifications non lues' })
  async countNonLu(@CurrentUser() user: User) {
    const count = await this.notifService.countNonLu(user.id);
    return { count };
  }

  @Patch('moi/lire-tout')
  @ApiOperation({ summary: 'Marquer toutes les notifications comme lues' })
  marquerToutLu(@CurrentUser() user: User) {
    return this.notifService.marquerToutLu(user.id);
  }

  @Patch(':id/lire')
  @ApiOperation({ summary: 'Marquer une notification comme lue' })
  marquerLu(@Param('id') id: string, @CurrentUser() user: User) {
    return this.notifService.marquerLu(id, user.id);
  }
}
