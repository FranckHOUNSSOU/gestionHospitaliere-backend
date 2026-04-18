// src/patient/dto/create-consentement.dto.ts

import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsUUID,
  IsBoolean,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SignataireConsentement } from '../entities/consentement.entity';

export class CreateConsentementDto {
  @ApiPropertyOptional({ example: 'uuid-medecin', description: 'UUID du médecin informateur' })
  @IsOptional()
  @IsUUID()
  medecinInformateurId?: string;

  @ApiProperty({ example: 'Appendicectomie', description: 'Type d\'acte concerné' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  typeActe!: string;

  @ApiProperty({ example: '2024-01-15T07:30:00.000Z', description: 'Date de signature' })
  @IsString()
  @IsNotEmpty()
  dateSignature!: string;

  @ApiProperty({ enum: SignataireConsentement, description: 'Identité du signataire' })
  @IsEnum(SignataireConsentement)
  signataire!: SignataireConsentement;

  @ApiPropertyOptional({ example: 'https://...', description: 'URL du document signé' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  documentUrl?: string;

  @ApiPropertyOptional({ example: false, description: 'Consentement refusé' })
  @IsOptional()
  @IsBoolean()
  estRefuse?: boolean;

  @ApiPropertyOptional({ example: 'Patient lucide et informé', description: 'Observations' })
  @IsOptional()
  @IsString()
  observations?: string;
}
