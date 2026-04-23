// src/patient/dto/cloturer-sejour.dto.ts

import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ModeSortie } from '../entities/sejour.entity';

export class CloturerSejourDto {
  @ApiProperty({ example: '2024-01-20T14:30:00.000Z', description: 'Date et heure de sortie' })
  @IsString()
  @IsNotEmpty()
  dateSortie!: string;

  @ApiProperty({ enum: ModeSortie, description: 'Mode de sortie' })
  @IsEnum(ModeSortie)
  modeSortie!: ModeSortie;
}
