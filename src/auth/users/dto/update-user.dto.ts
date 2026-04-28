import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PoleHospitalier } from '../entities/user.entity';

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

  @ApiPropertyOptional({
    enum: PoleHospitalier,
    example: PoleHospitalier.POLE_MERE,
    description: 'Pôle hospitalier. Valeurs : "POLE MERE", "POLE ENFANT", "POLE DES SERVICES COMMUNS".',
  })
  @IsOptional()
  @IsEnum(PoleHospitalier, { message: 'Le pôle doit être "POLE MERE", "POLE ENFANT" ou "POLE DES SERVICES COMMUNS".' })
  pole?: PoleHospitalier;

  @ApiPropertyOptional({ example: 'ORD-2024-001', description: 'Numéro d\'ordre professionnel' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  numeroOrdre?: string;
}
