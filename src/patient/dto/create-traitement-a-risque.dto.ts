// src/patient/dto/create-traitement-a-risque.dto.ts

import { IsString, IsNotEmpty, IsOptional, IsEnum, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { NiveauAlerteTraitement } from '../entities/traitement-a-risque.entity';

export class CreateTraitementARisqueDto {
  @ApiProperty({ example: 'Warfarine', description: 'Nom du médicament' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  nomMedicament!: string;

  @ApiPropertyOptional({ example: 'Anticoagulant', description: 'Classe thérapeutique' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  classe?: string;

  @ApiPropertyOptional({ example: '5mg/j', description: 'Posologie en cours' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  posologieEnCours?: string;

  @ApiPropertyOptional({ enum: NiveauAlerteTraitement, description: 'Niveau d\'alerte' })
  @IsOptional()
  @IsEnum(NiveauAlerteTraitement)
  niveauAlerte?: NiveauAlerteTraitement;

  @ApiPropertyOptional({ example: 'Risque de surdosage', description: 'Observations' })
  @IsOptional()
  @IsString()
  observations?: string;
}
