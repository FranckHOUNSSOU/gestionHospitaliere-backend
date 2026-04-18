// src/medecin/dto/create-medecin.dto.ts

import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Sexe, StatutOrdre, TypeContrat } from '../entities/medecin.entity';

export class CreateMedecinDto {
  @ApiProperty({ example: 'uuid-xxxx-xxxx', description: 'UUID du compte utilisateur (rôle MEDECIN) à associer à ce profil' })
  @IsUUID('4', { message: 'userId doit être un UUID valide.' })
  @IsNotEmpty({ message: 'L\'identifiant utilisateur est requis.' })
  userId!: string;

  @ApiProperty({ example: 'OM-00142', description: 'Numéro d\'ordre professionnel (unique, ex : OM-00142)' })
  @IsString()
  @IsNotEmpty({ message: 'Le numéro d\'ordre est requis.' })
  @MaxLength(50)
  numeroOrdre!: string;

  @ApiPropertyOptional({ example: '2020-06-15', description: 'Date d\'inscription à l\'ordre (format ISO 8601)' })
  @IsOptional()
  @IsDateString({}, { message: 'Date d\'inscription invalide (format attendu : YYYY-MM-DD).' })
  dateInscriptionOrdre?: string;

  @ApiPropertyOptional({ enum: StatutOrdre, default: StatutOrdre.INSCRIT, description: 'Statut auprès de l\'ordre professionnel' })
  @IsOptional()
  @IsEnum(StatutOrdre, { message: 'Statut d\'ordre invalide.' })
  statutOrdre?: StatutOrdre;

  @ApiPropertyOptional({ example: '1985-03-22', description: 'Date de naissance (format ISO 8601)' })
  @IsOptional()
  @IsDateString({}, { message: 'Date de naissance invalide (format attendu : YYYY-MM-DD).' })
  dateNaissance?: string;

  @ApiPropertyOptional({ enum: Sexe, description: 'Sexe' })
  @IsOptional()
  @IsEnum(Sexe, { message: 'Sexe invalide. Valeurs acceptées : M, F, Autre.' })
  sexe?: Sexe;

  @ApiPropertyOptional({ example: 'Béninoise', description: 'Nationalité' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  nationalite?: string;

  @ApiPropertyOptional({ example: 'https://storage.hopital.bj/photos/dr-kokou.jpg', description: 'URL de la photo de profil' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  photoUrl?: string;

  @ApiPropertyOptional({ example: '+22997000000', description: 'Téléphone d\'urgence' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  telephoneUrgence?: string;

  @ApiPropertyOptional({ enum: TypeContrat, description: 'Type de contrat' })
  @IsOptional()
  @IsEnum(TypeContrat, { message: 'Type de contrat invalide.' })
  typeContrat?: TypeContrat;

  @ApiPropertyOptional({ example: '2022-01-01', description: 'Date de prise de fonction (format ISO 8601)' })
  @IsOptional()
  @IsDateString({}, { message: 'Date de prise de fonction invalide (format attendu : YYYY-MM-DD).' })
  datePriseDeFonction?: string;

  @ApiPropertyOptional({ example: '2025-12-31', description: 'Date de fin de contrat (format ISO 8601)' })
  @IsOptional()
  @IsDateString({}, { message: 'Date de fin de contrat invalide (format attendu : YYYY-MM-DD).' })
  dateFinContrat?: string;
}
