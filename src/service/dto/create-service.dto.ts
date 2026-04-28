// src/service/dto/create-service.dto.ts

import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TypeService } from '../service.entity';

export class CreateServiceDto {
  @ApiProperty({ example: 'Cardiologie', description: 'Nom du service' })
  @IsString()
  @IsNotEmpty({ message: 'Le nom du service est requis.' })
  @MaxLength(100)
  nom!: string;

  @ApiProperty({ example: 'CARDIO', description: 'Code unique du service (ex : CARDIO, URG)' })
  @IsString()
  @IsNotEmpty({ message: 'Le code du service est requis.' })
  @MaxLength(20)
  code!: string;

  @ApiProperty({ enum: TypeService, example: TypeService.MEDECINE, description: 'Type de service médical' })
  @IsEnum(TypeService, { message: 'Type de service invalide.' })
  type!: TypeService;

  @ApiProperty({ example: 'uuid-xxxx-xxxx', description: 'UUID du pôle auquel rattacher ce service' })
  @IsUUID('4', { message: 'poleId doit être un UUID valide.' })
  @IsNotEmpty({ message: 'Le pôle est requis.' })
  poleId!: string;

  @ApiPropertyOptional({ example: '2ème', description: 'Étage du service' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  etage?: string;

  @ApiPropertyOptional({ example: 'Bâtiment A', description: 'Bâtiment' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  batiment?: string;

  @ApiPropertyOptional({ example: '+22997000000', description: 'Téléphone du service' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  telephone?: string;
}
