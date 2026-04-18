// src/patient/dto/create-examen.dto.ts

import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsUUID,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TypeExamen, StatutExamen } from '../entities/examen.entity';

export class CreateExamenDto {
  @ApiPropertyOptional({ example: 'uuid-medecin', description: 'UUID du médecin prescripteur' })
  @IsOptional()
  @IsUUID()
  medecinPrescripteurId?: string;

  @ApiProperty({ enum: TypeExamen, description: 'Type d\'examen' })
  @IsEnum(TypeExamen)
  typeExamen!: TypeExamen;

  @ApiPropertyOptional({ example: 'NFS', description: 'Sous-type d\'examen' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  sousType?: string;

  @ApiPropertyOptional({ example: 'Abdomen', description: 'Région anatomique' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  regionAnatomique?: string;

  @ApiProperty({ example: '2024-01-15T09:00:00.000Z', description: 'Date et heure de prescription' })
  @IsString()
  @IsNotEmpty()
  dateHeurePrescription!: string;

  @ApiPropertyOptional({ example: '2024-01-15T11:00:00.000Z', description: 'Date et heure de réalisation' })
  @IsOptional()
  @IsString()
  dateHeureRealisation?: string;

  @ApiPropertyOptional({ example: 'Suspicion d\'appendicite', description: 'Indication clinique' })
  @IsOptional()
  @IsString()
  indication?: string;

  @ApiPropertyOptional({ enum: StatutExamen, description: 'Statut de l\'examen' })
  @IsOptional()
  @IsEnum(StatutExamen)
  statut?: StatutExamen;
}
