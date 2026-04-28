// src/service/dto/update-chambre.dto.ts

import { PartialType } from '@nestjs/swagger';
import { CreateChambreDto } from './create-chambre.dto';
import { IsBoolean, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateChambreDto extends PartialType(CreateChambreDto) {
  @ApiPropertyOptional({ example: true, description: 'Activer ou désactiver la chambre' })
  @IsOptional()
  @IsBoolean()
  estActive?: boolean;
}
