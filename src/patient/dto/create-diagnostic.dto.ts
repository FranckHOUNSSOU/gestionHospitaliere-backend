// src/patient/dto/create-diagnostic.dto.ts

import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsUUID,
  IsDateString,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TypeDiagnostic, StatutDiagnostic } from '../entities/diagnostic.entity';

export class CreateDiagnosticDto {
  @ApiPropertyOptional({ example: 'uuid-medecin', description: 'UUID du médecin posant le diagnostic' })
  @IsOptional()
  @IsUUID()
  medecinId?: string;

  @ApiProperty({ example: 'K35.2', description: 'Code CIM-10' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  codeCim10!: string;

  @ApiProperty({ example: 'Appendicite aiguë avec péritonite généralisée', description: 'Libellé du diagnostic' })
  @IsString()
  @IsNotEmpty()
  libelle!: string;

  @ApiProperty({ enum: TypeDiagnostic, description: 'Type de diagnostic' })
  @IsEnum(TypeDiagnostic)
  type!: TypeDiagnostic;

  @ApiProperty({ enum: StatutDiagnostic, description: 'Statut du diagnostic' })
  @IsEnum(StatutDiagnostic)
  statut!: StatutDiagnostic;

  @ApiProperty({ example: '2024-01-15', description: 'Date du diagnostic (YYYY-MM-DD)' })
  @IsDateString()
  dateDiagnostic!: string;

  @ApiPropertyOptional({ example: 'Confirmé par scanner', description: 'Observations' })
  @IsOptional()
  @IsString()
  observations?: string;
}
