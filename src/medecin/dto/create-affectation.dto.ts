// src/medecin/dto/create-affectation.dto.ts

import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsUUID,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { RoleDansService } from '../entities/medecin-affectation.entity';

export class CreateAffectationDto {
  @ApiProperty({ example: 'uuid-xxxx-xxxx', description: 'UUID du service auquel affecter le médecin' })
  @IsUUID('4', { message: 'serviceId doit être un UUID valide.' })
  @IsNotEmpty({ message: 'L\'identifiant du service est requis.' })
  serviceId!: string;

  @ApiProperty({ enum: RoleDansService, description: 'Rôle du médecin dans ce service' })
  @IsEnum(RoleDansService, { message: 'Rôle dans le service invalide.' })
  roleDansService!: RoleDansService;

  @ApiPropertyOptional({ example: false, description: 'Indique si c\'est l\'affectation principale du médecin' })
  @IsOptional()
  @IsBoolean()
  estPrincipal?: boolean;

  @ApiProperty({ example: '2024-01-01', description: 'Date de début de l\'affectation (format ISO 8601)' })
  @IsNotEmpty({ message: 'La date de début est requise.' })
  @IsDateString({}, { message: 'Date de début invalide (format attendu : YYYY-MM-DD).' })
  dateDebut!: string;

  @ApiPropertyOptional({ example: '2025-12-31', description: 'Date de fin de l\'affectation (null si indéterminée)' })
  @IsOptional()
  @IsDateString({}, { message: 'Date de fin invalide (format attendu : YYYY-MM-DD).' })
  dateFin?: string;
}
