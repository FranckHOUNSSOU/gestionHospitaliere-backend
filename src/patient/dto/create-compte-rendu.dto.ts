// src/patient/dto/create-compte-rendu.dto.ts

import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsUUID,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TypeCompteRendu } from '../entities/compte-rendu.entity';

export class CreateCompteRenduDto {
  @ApiPropertyOptional({ example: 'uuid-medecin', description: 'UUID du médecin rédacteur' })
  @IsOptional()
  @IsUUID()
  medecinId?: string;

  @ApiProperty({ enum: TypeCompteRendu, description: 'Type de compte rendu' })
  @IsEnum(TypeCompteRendu)
  type!: TypeCompteRendu;

  @ApiProperty({ example: '2024-01-20T14:00:00.000Z', description: 'Date du compte rendu' })
  @IsString()
  @IsNotEmpty()
  date!: string;

  @ApiPropertyOptional({ example: 'Chirurgie', description: 'Spécialité' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  specialite?: string;

  @ApiProperty({ example: 'Patient opéré sous AG...', description: 'Contenu du compte rendu' })
  @IsString()
  @IsNotEmpty()
  contenu!: string;

  @ApiPropertyOptional({ example: 'Dr. MARTIN - Médecin traitant', description: 'Destinataire' })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  destinataire?: string;

  @ApiPropertyOptional({ example: 'https://...', description: 'URL du fichier joint' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  fichierUrl?: string;
}
