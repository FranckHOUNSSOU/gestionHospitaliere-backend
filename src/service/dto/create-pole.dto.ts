// src/service/dto/create-pole.dto.ts

import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PoleHospitalier } from '../pole.entity';

export class CreatePoleDto {
  @ApiProperty({
    enum: PoleHospitalier,
    example: PoleHospitalier.POLE_MERE,
    description: 'Nom du pôle (unique, 3 valeurs possibles)',
  })
  @IsEnum(PoleHospitalier, { message: 'Pôle invalide. Valeurs : "POLE MERE", "POLE ENFANT", "POLE DES SERVICES COMMUNS".' })
  nom!: PoleHospitalier;

  @ApiPropertyOptional({ example: 'Pôle dédié à la santé maternelle', description: 'Description du pôle' })
  @IsOptional()
  @IsString()
  description?: string;
}
