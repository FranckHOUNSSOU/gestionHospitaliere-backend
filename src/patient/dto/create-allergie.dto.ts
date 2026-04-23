// src/patient/dto/create-allergie.dto.ts

import { IsString, IsNotEmpty, IsOptional, IsEnum, IsDateString, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SeveriteAllergie } from '../entities/allergie.entity';

export class CreateAllergieDto {
  @ApiProperty({ example: 'Pénicilline', description: 'Allergène' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  allergene!: string;

  @ApiPropertyOptional({ example: 'Urticaire', description: 'Type de réaction' })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  typeReaction?: string;

  @ApiPropertyOptional({ enum: SeveriteAllergie, description: 'Sévérité' })
  @IsOptional()
  @IsEnum(SeveriteAllergie)
  severite?: SeveriteAllergie;

  @ApiPropertyOptional({ example: '2020-03-01', description: 'Date de découverte' })
  @IsOptional()
  @IsDateString()
  dateDecouverte?: string;

  @ApiPropertyOptional({ example: 'Médecin traitant', description: 'Source d\'information' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  sourceInformation?: string;

  @ApiPropertyOptional({ example: 'Allergie depuis l\'enfance', description: 'Observations' })
  @IsOptional()
  @IsString()
  observations?: string;
}
