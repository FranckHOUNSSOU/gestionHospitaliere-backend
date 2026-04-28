// src/service/dto/update-lit.dto.ts

import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { TypeLit, StatutLit } from '../lit.entity';

export class UpdateLitDto {
  @ApiPropertyOptional({ example: 'B', description: 'Nouveau numéro du lit' })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  numero?: string;

  @ApiPropertyOptional({ enum: TypeLit, description: 'Type de lit' })
  @IsOptional()
  @IsEnum(TypeLit, { message: 'Type de lit invalide.' })
  type?: TypeLit;

  @ApiPropertyOptional({ enum: StatutLit, description: 'Statut du lit' })
  @IsOptional()
  @IsEnum(StatutLit, { message: 'Statut de lit invalide.' })
  statut?: StatutLit;
}
