// src/patient/dto/upsert-volet-nutritionnel.dto.ts

import { IsString, IsOptional, IsEnum, IsNumber, IsInt, Min, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Appetit } from '../entities/volet-nutritionnel.entity';

export class UpsertVoletNutritionnelDto {
  @ApiPropertyOptional({ example: 'NRS-2002', description: 'Score de dénutrition utilisé' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  scoreDenutrition?: string;

  @ApiPropertyOptional({ example: 2.5, description: 'Valeur du score' })
  @IsOptional()
  @IsNumber()
  valeurScore?: number;

  @ApiPropertyOptional({ example: 75.0, description: 'Poids habituel (kg)' })
  @IsOptional()
  @IsNumber()
  poidsHabituel?: number;

  @ApiPropertyOptional({ example: 68.5, description: 'Poids actuel (kg)' })
  @IsOptional()
  @IsNumber()
  poidsActuel?: number;

  @ApiPropertyOptional({ example: 8.67, description: 'Perte de poids (%)' })
  @IsOptional()
  @IsNumber()
  pertePoidsPercent?: number;

  @ApiPropertyOptional({ enum: Appetit, description: 'Appétit du patient' })
  @IsOptional()
  @IsEnum(Appetit)
  appetit?: Appetit;

  @ApiPropertyOptional({ example: 'Régime sans sel', description: 'Régime prescrit' })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  regimePrescrit?: string;

  @ApiPropertyOptional({ example: 2000, description: 'Apports caloriques (kcal/jour)' })
  @IsOptional()
  @IsInt()
  @Min(0)
  apportsCaloriques?: number;

  @ApiPropertyOptional({ example: 'Fortimel 2 unités/jour', description: 'Suppléments prescrits' })
  @IsOptional()
  @IsString()
  supplementsPrescrits?: string;
}
