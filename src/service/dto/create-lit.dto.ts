// src/service/dto/create-lit.dto.ts

import { IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TypeLit } from '../lit.entity';

export class CreateLitDto {
  @ApiProperty({ example: 'A', description: 'Numéro ou lettre du lit (unique dans la chambre)' })
  @IsString()
  @IsNotEmpty({ message: 'Le numéro du lit est requis.' })
  @MaxLength(10)
  numero!: string;

  @ApiPropertyOptional({
    enum: TypeLit,
    example: TypeLit.STANDARD,
    description: 'Type de lit (Standard par défaut)',
  })
  @IsOptional()
  @IsEnum(TypeLit, { message: 'Type de lit invalide.' })
  type?: TypeLit;
}
