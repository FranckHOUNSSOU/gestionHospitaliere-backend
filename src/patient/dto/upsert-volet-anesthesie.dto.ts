// src/patient/dto/upsert-volet-anesthesie.dto.ts

import {
  IsString,
  IsOptional,
  IsEnum,
  IsUUID,
  IsInt,
  IsDateString,
  Min,
  Max,
  MaxLength,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { ScoreASA, TypeAnesthesie } from '../entities/volet-anesthesie.entity';

export class UpsertVoletAnesthesieDto {
  @ApiPropertyOptional({ example: 'uuid-medecin', description: 'UUID de l\'anesthésiste' })
  @IsOptional()
  @IsUUID()
  anesthesisteId?: string;

  @ApiPropertyOptional({ example: '2024-01-10', description: 'Date de consultation pré-anesthésique' })
  @IsOptional()
  @IsDateString()
  dateConsultationPre?: string;

  @ApiPropertyOptional({ enum: ScoreASA, description: 'Score ASA' })
  @IsOptional()
  @IsEnum(ScoreASA)
  scoreAsa?: ScoreASA;

  @ApiPropertyOptional({ enum: TypeAnesthesie, description: 'Type d\'anesthésie' })
  @IsOptional()
  @IsEnum(TypeAnesthesie)
  typeAnesthesie?: TypeAnesthesie;

  @ApiPropertyOptional({ example: 'Propofol, Fentanyl, Rocuronium', description: 'Produits utilisés' })
  @IsOptional()
  @IsString()
  produitsUtilises?: string;

  @ApiPropertyOptional({ example: 90, description: 'Durée d\'anesthésie en minutes' })
  @IsOptional()
  @IsInt()
  @Min(0)
  dureeAnesthesieMin?: number;

  @ApiPropertyOptional({ example: 'Aucun incident', description: 'Incidents per-opératoires' })
  @IsOptional()
  @IsString()
  incidentsPerOperatoires?: string;

  @ApiPropertyOptional({ example: 10, description: 'Score d\'Aldrete (0 à 10)' })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(10)
  scoreAldrete?: number;

  @ApiPropertyOptional({ example: 'Surveillance rapprochée 4h', description: 'Consignes post-opératoires' })
  @IsOptional()
  @IsString()
  consignesPostOp?: string;
}
