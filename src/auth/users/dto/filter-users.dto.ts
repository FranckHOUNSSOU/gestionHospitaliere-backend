import { IsBoolean, IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { UserRole } from '../entities/user.entity';

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

  @ApiPropertyOptional({ example: 'Cardiologie', description: 'Filtrer par service' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  service?: string;
}
