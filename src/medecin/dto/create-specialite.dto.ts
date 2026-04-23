// src/medecin/dto/create-specialite.dto.ts

import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSpecialiteDto {
  @ApiProperty({ example: 'Cardiologie', description: 'Libellé de la spécialité médicale' })
  @IsString()
  @IsNotEmpty({ message: 'Le libellé de la spécialité est requis.' })
  @MaxLength(100)
  specialite!: string;

  @ApiPropertyOptional({ example: false, description: 'Indique si c\'est la spécialité principale du médecin' })
  @IsOptional()
  @IsBoolean()
  estPrincipale?: boolean;

  @ApiPropertyOptional({ example: '2015-06-30', description: 'Date d\'obtention de la spécialité (format ISO 8601)' })
  @IsOptional()
  @IsDateString({}, { message: 'Date d\'obtention invalide (format attendu : YYYY-MM-DD).' })
  dateObtention?: string;
}
