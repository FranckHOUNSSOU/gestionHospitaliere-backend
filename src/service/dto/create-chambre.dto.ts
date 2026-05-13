import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TypeChambre } from '../chambre.entity';

export class CreateChambreDto {
  @ApiProperty({ example: '101' })
  @IsString()
  @IsNotEmpty({ message: 'Le numéro de chambre est requis.' })
  @MaxLength(20)
  numero!: string;

  @ApiPropertyOptional({ example: 'Chambre individuelle VIP' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  designation?: string;

  @ApiPropertyOptional({ example: '1er' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  etage?: string;

  @ApiProperty({ enum: TypeChambre, example: TypeChambre.INDIVIDUELLE })
  @IsEnum(TypeChambre, { message: 'Type de chambre invalide.' })
  @IsNotEmpty()
  type!: TypeChambre;

  @ApiProperty({ example: 1, description: 'Nombre de lits (≥ 1)' })
  @IsInt()
  @IsPositive({ message: 'La capacité doit être un entier positif.' })
  capacite!: number;
}