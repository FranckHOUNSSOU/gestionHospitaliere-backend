// src/patient/dto/create-soin-infirmier.dto.ts

import { IsString, IsNotEmpty, IsOptional, IsEnum, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TypeAuteurSoin } from '../entities/soin-infirmier.entity';

export class CreateSoinInfirmierDto {
  @ApiProperty({ example: '2024-01-15T14:00:00.000Z', description: 'Date et heure du soin' })
  @IsString()
  @IsNotEmpty()
  dateHeure!: string;

  @ApiProperty({ enum: TypeAuteurSoin, description: 'Type d\'auteur du soin' })
  @IsEnum(TypeAuteurSoin)
  typeAuteur!: TypeAuteurSoin;

  @ApiProperty({ example: 'Douleur', description: 'Cible du soin' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  cible!: string;

  @ApiPropertyOptional({ example: 'Patient se plaint de douleurs thoraciques', description: 'Données observées' })
  @IsOptional()
  @IsString()
  donneesObservees?: string;

  @ApiPropertyOptional({ example: 'Administration antalgique prescrit', description: 'Actions réalisées' })
  @IsOptional()
  @IsString()
  actionsRealisees?: string;

  @ApiPropertyOptional({ example: 'Diminution de la douleur EVA 8→3', description: 'Résultats obtenus' })
  @IsOptional()
  @IsString()
  resultatsObtenus?: string;
}
