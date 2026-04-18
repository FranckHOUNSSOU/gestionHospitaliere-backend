// src/patient/dto/create-couverture-sociale.dto.ts

import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsDateString,
  IsBoolean,
  IsNumber,
  Min,
  Max,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { StatutCouverture } from '../entities/couverture-sociale.entity';

export class CreateCouvertureSocialeDto {
  @ApiProperty({ example: 'Assurance maladie', description: 'Type de couverture' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  typeCouverture!: string;

  @ApiProperty({ example: 'CNSS Bénin', description: 'Nom de l\'organisme' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  nomOrganisme!: string;

  @ApiProperty({ example: 'AS-123456', description: 'Numéro d\'assuré' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  numeroAssure!: string;

  @ApiPropertyOptional({ example: 'POL-789', description: 'Numéro de police' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  numeroPolice?: string;

  @ApiPropertyOptional({ example: 80.00, description: 'Taux de prise en charge (%)' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  tauxPriseEnCharge?: number;

  @ApiProperty({ enum: StatutCouverture, description: 'Statut du bénéficiaire' })
  @IsEnum(StatutCouverture)
  statut!: StatutCouverture;

  @ApiProperty({ example: '2024-01-01', description: 'Date de début de validité' })
  @IsDateString()
  dateDebut!: string;

  @ApiPropertyOptional({ example: '2025-12-31', description: 'Date de fin de validité' })
  @IsOptional()
  @IsDateString()
  dateFin?: string;

  @ApiPropertyOptional({ example: true, description: 'Couverture active' })
  @IsOptional()
  @IsBoolean()
  estActive?: boolean;
}
