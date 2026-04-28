import { IsBoolean, IsEnum, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { UserRole, PoleHospitalier } from '../entities/user.entity';

export class FilterUsersDto {
  @ApiPropertyOptional({
    enum: UserRole,
    example: UserRole.MEDECIN,
    description: 'Filtrer par rôle',
  })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @ApiPropertyOptional({
    example: true,
    description: 'Filtrer par statut (true = actif, false = inactif)',
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsBoolean()
  actif?: boolean;

  @ApiPropertyOptional({
    enum: PoleHospitalier,
    example: PoleHospitalier.POLE_MERE,
    description: 'Filtrer par pôle',
  })
  @IsOptional()
  @IsEnum(PoleHospitalier, { message: 'Le pôle doit être "POLE MERE", "POLE ENFANT" ou "POLE DES SERVICES COMMUNS".' })
  pole?: PoleHospitalier;
}
