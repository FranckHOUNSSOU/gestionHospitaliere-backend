// src/medecin/dto/create-accreditation.dto.ts

import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAccreditationDto {
  @ApiProperty({ example: 'Certification ACLS', description: 'Intitulé de l\'accréditation ou certification' })
  @IsString()
  @IsNotEmpty({ message: 'L\'intitulé de l\'accréditation est requis.' })
  @MaxLength(200)
  intitule!: string;

  @ApiPropertyOptional({ example: 'American Heart Association', description: 'Organisme ayant délivré la certification' })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  organismeCertificateur?: string;

  @ApiPropertyOptional({ example: '2022-01-15', description: 'Date d\'obtention (format ISO 8601)' })
  @IsOptional()
  @IsDateString({}, { message: 'Date d\'obtention invalide (format attendu : YYYY-MM-DD).' })
  dateObtention?: string;

  @ApiPropertyOptional({ example: '2025-01-15', description: 'Date d\'expiration (format ISO 8601)' })
  @IsOptional()
  @IsDateString({}, { message: 'Date d\'expiration invalide (format attendu : YYYY-MM-DD).' })
  dateExpiration?: string;

  @ApiPropertyOptional({ example: 'https://storage.hopital.bj/docs/acls.pdf', description: 'URL du document justificatif numérisé' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  documentUrl?: string;
}
