import { IsIn, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../entities/user.entity';

export class UpdateRoleDto {
  @ApiProperty({
    enum: [UserRole.MEDECIN, UserRole.AGENT_ADMINISTRATIF],
    example: UserRole.MEDECIN,
    description: 'Nouveau rôle (MEDECIN ou AGENT_ADMINISTRATIF uniquement)',
  })
  @IsNotEmpty({ message: 'Le rôle est requis.' })
  @IsIn([UserRole.MEDECIN, UserRole.AGENT_ADMINISTRATIF], {
    message: 'Le rôle doit être MEDECIN ou AGENT_ADMINISTRATIF.',
  })
  role!: UserRole.MEDECIN | UserRole.AGENT_ADMINISTRATIF;
}
