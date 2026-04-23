// src/patient/dto/create-patient-critique.dto.ts

import {
  IsString,
  IsOptional,
  IsEnum,
  IsDateString,
  IsInt,
  Min,
  Max,
  MaxLength,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { SexePatient } from '../entities/patient.entity';

export class CreatePatientCritiqueDto {
  @ApiPropertyOptional({ example: 'DOE', description: 'Nom de famille (si connu)' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  nom?: string;

  @ApiPropertyOptional({ example: 'John', description: 'Prénom (si connu)' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  prenom?: string;

  @ApiPropertyOptional({ enum: SexePatient, description: 'Sexe (si identifiable)' })
  @IsOptional()
  @IsEnum(SexePatient)
  sexe?: SexePatient;

  @ApiPropertyOptional({ example: '1990-05-14', description: 'Date de naissance (YYYY-MM-DD), si connue' })
  @IsOptional()
  @IsDateString()
  dateNaissance?: string;

  @ApiPropertyOptional({ example: 35, description: 'Âge estimé en années (si date de naissance inconnue)' })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(150)
  ageEstime?: number;

  @ApiPropertyOptional({ example: 'Dupont', description: 'Nom de l\'accompagnant présent sur les lieux' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  accompagnantNom?: string;

  @ApiPropertyOptional({ example: '+224 622 00 00 00', description: 'Téléphone de l\'accompagnant' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  accompagnantTelephone?: string;

  @ApiPropertyOptional({ example: 'Accident de la voie publique, inconscient à l\'arrivée', description: 'Circonstances d\'admission aux urgences' })
  @IsOptional()
  @IsString()
  circonstancesAdmission?: string;
}
