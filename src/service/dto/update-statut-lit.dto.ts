// src/service/dto/update-statut-lit.dto.ts

import { IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { StatutLit } from '../lit.entity';

export class UpdateStatutLitDto {
  @ApiProperty({ enum: StatutLit, example: StatutLit.OCCUPE, description: 'Nouveau statut du lit' })
  @IsEnum(StatutLit, { message: 'Statut invalide.' })
  @IsNotEmpty()
  statut!: StatutLit;
}
