import { PartialType } from '@nestjs/swagger';
import { CreateChambreDto } from './create-chambre.dto';
import { IsBoolean, IsEnum, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { StatutChambre } from '../chambre.entity';

export class UpdateChambreDto extends PartialType(CreateChambreDto) {
  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  estActive?: boolean;

  @ApiPropertyOptional({ enum: StatutChambre, example: StatutChambre.DISPONIBLE })
  @IsOptional()
  @IsEnum(StatutChambre, { message: 'Statut de chambre invalide.' })
  statut?: StatutChambre;
}