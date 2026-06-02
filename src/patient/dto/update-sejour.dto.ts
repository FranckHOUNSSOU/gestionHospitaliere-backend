import { IsString, IsOptional, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { ModeEntree } from '../entities/sejour.entity';

export class UpdateSejourDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  medecinResponsableId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  dateAdmission?: string;

  @ApiPropertyOptional({ enum: ModeEntree })
  @IsOptional()
  @IsEnum(ModeEntree)
  modeEntree?: ModeEntree;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  motifHospitalisation?: string;
}