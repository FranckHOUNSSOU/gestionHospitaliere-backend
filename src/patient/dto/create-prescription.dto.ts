// src/patient/dto/create-prescription.dto.ts

import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsUUID,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { VoieAdministration, StatutPrescription } from '../entities/prescription.entity';

export class CreatePrescriptionDto {
  @ApiPropertyOptional({ example: 'uuid-medecin', description: 'UUID du médecin prescripteur' })
  @IsOptional()
  @IsUUID()
  medecinPrescripteurId?: string;

  @ApiProperty({ example: 'Amoxicilline', description: 'Nom DCI du médicament' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  nomMedicamentDci!: string;

  @ApiPropertyOptional({ example: 'Clamoxyl', description: 'Nom commercial' })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  nomCommercial?: string;

  @ApiPropertyOptional({ example: 'Comprimé', description: 'Forme galénique' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  formeGalenique?: string;

  @ApiPropertyOptional({ example: '500', description: 'Dose' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  dose?: string;

  @ApiPropertyOptional({ example: 'mg', description: 'Unité' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  unite?: string;

  @ApiPropertyOptional({ example: '3 fois/jour', description: 'Fréquence' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  frequence?: string;

  @ApiProperty({ enum: VoieAdministration, description: 'Voie d\'administration' })
  @IsEnum(VoieAdministration)
  voieAdministration!: VoieAdministration;

  @ApiProperty({ example: '2024-01-15T08:00:00.000Z', description: 'Date de début' })
  @IsString()
  @IsNotEmpty()
  dateDebut!: string;

  @ApiPropertyOptional({ example: '2024-01-22T08:00:00.000Z', description: 'Date de fin' })
  @IsOptional()
  @IsString()
  dateFin?: string;

  @ApiPropertyOptional({ enum: StatutPrescription, description: 'Statut de la prescription' })
  @IsOptional()
  @IsEnum(StatutPrescription)
  statut?: StatutPrescription;

  @ApiPropertyOptional({ example: 'À prendre au cours des repas', description: 'Observations' })
  @IsOptional()
  @IsString()
  observations?: string;
}
