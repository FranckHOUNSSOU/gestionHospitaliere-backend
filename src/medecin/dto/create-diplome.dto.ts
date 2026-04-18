// src/medecin/dto/create-diplome.dto.ts

import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TypeDiplome } from '../entities/medecin-diplome.entity';

export class CreateDiplomeDto {
  @ApiProperty({ example: 'Diplôme d\'État de Docteur en Médecine', description: 'Intitulé complet du diplôme' })
  @IsString()
  @IsNotEmpty({ message: 'L\'intitulé du diplôme est requis.' })
  @MaxLength(200)
  intitule!: string;

  @ApiProperty({ enum: TypeDiplome, description: 'Type de diplôme' })
  @IsEnum(TypeDiplome, { message: 'Type de diplôme invalide.' })
  type!: TypeDiplome;

  @ApiPropertyOptional({ example: 'Université d\'Abomey-Calavi', description: 'Établissement d\'obtention' })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  etablissement?: string;

  @ApiPropertyOptional({ example: 'Bénin', description: 'Pays d\'obtention' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  pays?: string;

  @ApiPropertyOptional({ example: '2010-06-30', description: 'Date d\'obtention (format ISO 8601)' })
  @IsOptional()
  @IsDateString({}, { message: 'Date d\'obtention invalide (format attendu : YYYY-MM-DD).' })
  dateObtention?: string;

  @ApiPropertyOptional({ example: 'https://storage.hopital.bj/docs/diplome.pdf', description: 'URL du document justificatif numérisé' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  documentUrl?: string;
}
