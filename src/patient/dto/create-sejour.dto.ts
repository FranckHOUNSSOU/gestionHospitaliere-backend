// src/patient/dto/create-sejour.dto.ts

import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsUUID,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ModeEntree } from '../entities/sejour.entity';

export class CreateSejourDto {
  @ApiPropertyOptional({ example: 'uuid-medecin', description: 'UUID du médecin responsable' })
  @IsOptional()
  @IsUUID()
  medecinResponsableId?: string;

  @ApiProperty({ example: 'SEJ-20240001', description: 'Numéro de séjour unique' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  numeroSejour!: string;

  @ApiProperty({ example: '2024-01-15T08:00:00.000Z', description: 'Date et heure d\'admission' })
  @IsString()
  @IsNotEmpty()
  dateAdmission!: string;

  @ApiProperty({ enum: ModeEntree, description: 'Mode d\'entrée' })
  @IsEnum(ModeEntree)
  modeEntree!: ModeEntree;

  @ApiProperty({ example: 'Douleurs abdominales aiguës', description: 'Motif d\'hospitalisation' })
  @IsString()
  @IsNotEmpty()
  motifHospitalisation!: string;

  @ApiPropertyOptional({ example: 'Chirurgie générale', description: 'Service initial d\'accueil' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  serviceInitial?: string;
}
