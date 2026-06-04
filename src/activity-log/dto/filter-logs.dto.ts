import { IsEnum, IsOptional, IsString, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { LogModule } from '../activity-log.entity';

export enum PeriodePredefinie {
  AUJOURD_HUI  = 'AUJOURD_HUI',
  HIER         = 'HIER',
  MOIS_EN_COURS = 'MOIS_EN_COURS',
  MOIS_DERNIER  = 'MOIS_DERNIER',
}

export class FilterLogsDto {
  @ApiPropertyOptional({ enum: PeriodePredefinie })
  @IsOptional()
  @IsEnum(PeriodePredefinie)
  periode?: PeriodePredefinie;

  @ApiPropertyOptional({ example: '2026-06-01' })
  @IsOptional()
  @IsString()
  dateDebut?: string;

  @ApiPropertyOptional({ example: '2026-06-30' })
  @IsOptional()
  @IsString()
  dateFin?: string;

  @ApiPropertyOptional({ enum: LogModule })
  @IsOptional()
  @IsEnum(LogModule)
  module?: LogModule;

  @ApiPropertyOptional({ type: Number, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ type: Number, default: 50 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(200)
  limit?: number = 50;
}
