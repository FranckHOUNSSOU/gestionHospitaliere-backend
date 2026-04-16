import { IsIn, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../entities/user.entity';

export class UpdateRoleDto {
  @ApiProperty({
    enum: UserRole,
    example: UserRole.MEDECIN,
    description: 'Nouveau rôle (MEDECIN, AGENT_ADMINISTRATIF ou ADMINISTRATEUR)',
  })
  @IsNotEmpty({ message: 'Le rôle est requis.' })
  @IsIn([UserRole.MEDECIN, UserRole.AGENT_ADMINISTRATIF, UserRole.ADMINISTRATEUR], {
    message: 'Le rôle doit être MEDECIN, AGENT_ADMINISTRATIF ou ADMINISTRATEUR.',
  })
  role!: UserRole;
}
