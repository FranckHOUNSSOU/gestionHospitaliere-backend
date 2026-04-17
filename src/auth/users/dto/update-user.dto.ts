import {
  IsEmail,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'Dupont', description: 'Nom de famille' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  nom?: string;

  @ApiPropertyOptional({ example: 'Jean', description: 'Prénom' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  prenom?: string;

  @ApiPropertyOptional({ example: 'jean.dupont@hopital.bj', description: 'Adresse email (unique)' })
  @IsOptional()
  @IsEmail({}, { message: 'Adresse email invalide.' })
  email?: string;

  @ApiPropertyOptional({ example: '+22997000000', description: 'Numéro de téléphone' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  telephone?: string;

  @ApiPropertyOptional({ example: 'Cardiologie', description: 'Service hospitalier' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  service?: string;

  @ApiPropertyOptional({ example: 'ORD-2024-001', description: 'Numéro d\'ordre professionnel' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  numeroOrdre?: string;
}
