// src/service/dto/update-pole.dto.ts

import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdatePoleDto {
  @ApiPropertyOptional({ example: 'Description mise à jour', description: 'Description du pôle' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: true, description: 'Activer ou désactiver le pôle' })
  @IsOptional()
  @IsBoolean()
  estActif?: boolean;
}
