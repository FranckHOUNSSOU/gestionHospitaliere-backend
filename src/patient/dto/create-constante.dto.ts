// src/patient/dto/create-constante.dto.ts

import { IsString, IsNotEmpty, IsOptional, IsNumber, IsInt, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateConstanteDto {
  @ApiProperty({ example: '2024-01-15T08:00:00.000Z', description: 'Date et heure de la mesure' })
  @IsString()
  @IsNotEmpty()
  dateHeure!: string;

  @ApiPropertyOptional({ example: 120.0, description: 'Tension systolique (mmHg)' })
  @IsOptional()
  @IsNumber()
  tensionSystolique?: number;

  @ApiPropertyOptional({ example: 80.0, description: 'Tension diastolique (mmHg)' })
  @IsOptional()
  @IsNumber()
  tensionDiastolique?: number;

  @ApiPropertyOptional({ example: 72, description: 'Fréquence cardiaque (bpm)' })
  @IsOptional()
  @IsInt()
  @Min(0)
  frequenceCardiaque?: number;

  @ApiPropertyOptional({ example: 16, description: 'Fréquence respiratoire (/min)' })
  @IsOptional()
  @IsInt()
  @Min(0)
  frequenceRespiratoire?: number;

  @ApiPropertyOptional({ example: 37.2, description: 'Température (°C)' })
  @IsOptional()
  @IsNumber()
  temperature?: number;

  @ApiPropertyOptional({ example: 98.5, description: 'SpO2 (%)' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  spo2?: number;

  @ApiPropertyOptional({ example: 5.8, description: 'Glycémie capillaire (mmol/L)' })
  @IsOptional()
  @IsNumber()
  glycemieCapillaire?: number;

  @ApiPropertyOptional({ example: 72.5, description: 'Poids (kg)' })
  @IsOptional()
  @IsNumber()
  poids?: number;

  @ApiPropertyOptional({ example: 175.0, description: 'Taille (cm)' })
  @IsOptional()
  @IsNumber()
  taille?: number;

  @ApiPropertyOptional({ example: 15, description: 'Score de Glasgow (3 à 15)' })
  @IsOptional()
  @IsInt()
  @Min(3)
  @Max(15)
  glasgow?: number;

  @ApiPropertyOptional({ example: 3, description: 'Douleur EVA (0 à 10)' })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(10)
  douleurEva?: number;

  @ApiPropertyOptional({ example: 'Patient calme, bien orienté', description: 'Observations' })
  @IsOptional()
  @IsString()
  observations?: string;
}
