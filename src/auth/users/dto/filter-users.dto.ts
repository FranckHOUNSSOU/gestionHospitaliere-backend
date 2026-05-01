import { IsBoolean, IsEnum, IsOptional, IsUUID } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { UserRole } from '../entities/user.entity';

export class FilterUsersDto {
  @ApiPropertyOptional({ enum: UserRole, example: UserRole.MEDECIN, description: 'Filtrer par rôle' })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @ApiPropertyOptional({ example: true, description: 'Filtrer par statut (true = actif, false = inactif)' })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsBoolean()
  actif?: boolean;

  @ApiPropertyOptional({ example: 'uuid-xxxx-xxxx', description: 'Filtrer par ID du pôle' })
  @IsOptional()
  @IsUUID('4')
  poleId?: string;

  @ApiPropertyOptional({ example: 'uuid-xxxx-xxxx', description: 'Filtrer par ID du service' })
  @IsOptional()
  @IsUUID('4')
  serviceId?: string;
}
