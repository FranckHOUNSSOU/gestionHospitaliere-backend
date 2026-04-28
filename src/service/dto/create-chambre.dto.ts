// src/service/dto/create-chambre.dto.ts

import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateChambreDto {
  @ApiProperty({ example: '101', description: 'Numéro de chambre (unique dans le service)' })
  @IsString()
  @IsNotEmpty({ message: 'Le numéro de chambre est requis.' })
  @MaxLength(20)
  numero!: string;

  @ApiPropertyOptional({ example: 'Chambre individuelle VIP', description: 'Désignation ou description' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  designation?: string;

  @ApiPropertyOptional({ example: '1er', description: 'Étage de la chambre' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  etage?: string;
}
