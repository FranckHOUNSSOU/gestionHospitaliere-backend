// src/patient/dto/create-patient-accueil.dto.ts

import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsDateString,
  IsEmail,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SexePatient } from '../entities/patient.entity';

export class CreatePatientAccueilDto {
  // ── Champs obligatoires ────────────────────────────────────────────────────

  @ApiProperty({ example: 'DOE', description: 'Nom de famille du patient' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nom!: string;

  @ApiProperty({ example: 'John', description: 'Prénom du patient' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  prenom!: string;

  @ApiProperty({ enum: SexePatient, description: 'Sexe du patient' })
  @IsEnum(SexePatient)
  sexe!: SexePatient;

  @ApiProperty({ example: '1990-05-14', description: 'Date de naissance (YYYY-MM-DD)' })
  @IsDateString()
  dateNaissance!: string;

  @ApiProperty({ example: '12 Rue de la Paix, Conakry', description: 'Adresse complète' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  adresse!: string;

  @ApiProperty({ example: '+224 620 00 00 00', description: 'Téléphone mobile' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  telephoneMobile!: string;

  @ApiProperty({ example: 'DOE', description: 'Nom du contact d\'urgence' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  contactUrgenceNom!: string;

  @ApiProperty({ example: 'Jane', description: 'Prénom du contact d\'urgence' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  contactUrgencePrenom!: string;

  @ApiProperty({ example: 'Épouse', description: 'Lien de parenté du contact d\'urgence' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  contactUrgenceLienParente!: string;

  @ApiProperty({ example: '+224 621 00 00 00', description: 'Téléphone du contact d\'urgence' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  contactUrgenceTelephone!: string;

  // ── Champs optionnels ──────────────────────────────────────────────────────

  @ApiPropertyOptional({ example: 'MARTIN', description: 'Nom de jeune fille' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  nomJeuneFille?: string;

  @ApiPropertyOptional({ example: 'Conakry', description: 'Lieu de naissance' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  lieuNaissance?: string;

  @ApiPropertyOptional({ example: 'Guinéenne', description: 'Nationalité' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  nationalite?: string;

  @ApiPropertyOptional({ example: 'Français', description: 'Langue parlée' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  langue?: string;

  @ApiPropertyOptional({ example: 'Conakry', description: 'Ville' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  ville?: string;

  @ApiPropertyOptional({ example: 'Guinée', description: 'Pays' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  pays?: string;

  @ApiPropertyOptional({ example: '+224 30 00 00 00', description: 'Téléphone fixe' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  telephoneFixe?: string;

  @ApiPropertyOptional({ example: 'patient@email.com', description: 'Email' })
  @IsOptional()
  @IsEmail()
  @MaxLength(100)
  email?: string;
}
