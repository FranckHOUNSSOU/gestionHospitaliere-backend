// src/patient/dto/create-resultat-examen.dto.ts

import { IsString, IsNotEmpty, IsOptional, IsEnum, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { InterpretationResultat } from '../entities/resultat-examen.entity';

export class CreateResultatExamenDto {
  @ApiProperty({ example: 'Globules rouges', description: 'Paramètre mesuré' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  parametre!: string;

  @ApiProperty({ example: '4.5', description: 'Valeur mesurée' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  valeur!: string;

  @ApiPropertyOptional({ example: '10^12/L', description: 'Unité de mesure' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  unite?: string;

  @ApiPropertyOptional({ example: '4.2', description: 'Valeur minimale de référence' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  valeurMinReference?: string;

  @ApiPropertyOptional({ example: '5.8', description: 'Valeur maximale de référence' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  valeurMaxReference?: string;

  @ApiPropertyOptional({ enum: InterpretationResultat, description: 'Interprétation du résultat' })
  @IsOptional()
  @IsEnum(InterpretationResultat)
  interpretation?: InterpretationResultat;

  @ApiPropertyOptional({ example: 'Valeur dans les normes', description: 'Commentaire' })
  @IsOptional()
  @IsString()
  commentaire?: string;

  @ApiPropertyOptional({ example: 'https://...', description: 'URL du fichier résultat' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  fichierUrl?: string;

  @ApiPropertyOptional({ example: '2024-01-15T12:00:00.000Z', description: 'Date de validation du résultat' })
  @IsOptional()
  @IsString()
  dateValidation?: string;
}
