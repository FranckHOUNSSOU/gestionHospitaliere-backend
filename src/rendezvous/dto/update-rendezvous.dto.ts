import { IsDateString, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateRendezVousDto {
  @ApiPropertyOptional({ example: '2026-06-01T10:00:00' })
  @IsOptional()
  @IsDateString()
  dateHeure?: string;

  @ApiPropertyOptional({ example: 30 })
  @IsOptional()
  @IsInt()
  @Min(5)
  @Max(480)
  dureeMinutes?: number;

  @ApiPropertyOptional({ example: 'Suivi' })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiPropertyOptional({ example: 'Douleurs persistantes' })
  @IsOptional()
  @IsString()
  motif?: string;
}
