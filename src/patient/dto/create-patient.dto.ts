// src/patient/dto/create-patient.dto.ts

import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsDateString,
  IsBoolean,
  IsEmail,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  SexePatient,
  GroupeSanguinABO,
  GroupeSanguinRhesus,
  StatutGroupeSanguin,
  StatutReanimatoire,
} from '../entities/patient.entity';

export class CreatePatientDto {
  @ApiProperty({ example: 'IPP-20240001', description: 'Numéro IPP unique' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  numeroIpp!: string;

  @ApiProperty({ example: 'DOE', description: 'Nom de famille' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nom!: string;

  @ApiPropertyOptional({ example: 'MARTIN', description: 'Nom de jeune fille' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  nomJeuneFille?: string;

  @ApiProperty({ example: 'John', description: 'Prénom' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  prenom!: string;

  @ApiProperty({ example: '1990-05-14', description: 'Date de naissance (YYYY-MM-DD)' })
  @IsDateString()
  dateNaissance!: string;

  @ApiPropertyOptional({ example: 'Cotonou', description: 'Lieu de naissance' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  lieuNaissance?: string;

  @ApiProperty({ enum: SexePatient, description: 'Sexe du patient' })
  @IsEnum(SexePatient)
  sexe!: SexePatient;

  @ApiPropertyOptional({ example: 'Béninoise', description: 'Nationalité' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  nationalite?: string;

  @ApiPropertyOptional({ example: 'Français', description: 'Langue parlée' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  langue?: string;

  @ApiPropertyOptional({ example: 'https://...', description: 'URL photo du patient' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  photoUrl?: string;

  @ApiPropertyOptional({ example: '12 Rue de la Paix', description: 'Adresse' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  adresse?: string;

  @ApiPropertyOptional({ example: 'Cotonou', description: 'Ville' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  ville?: string;

  @ApiPropertyOptional({ example: '01BP1234', description: 'Code postal' })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  codePostal?: string;

  @ApiPropertyOptional({ example: 'Bénin', description: 'Pays' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  pays?: string;

  @ApiPropertyOptional({ example: '+229 21 00 00 00', description: 'Téléphone fixe' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  telephoneFixe?: string;

  @ApiPropertyOptional({ example: '+229 97 00 00 00', description: 'Téléphone mobile' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  telephoneMobile?: string;

  @ApiPropertyOptional({ example: 'patient@email.com', description: 'Email' })
  @IsOptional()
  @IsEmail()
  @MaxLength(100)
  email?: string;

  @ApiPropertyOptional({ enum: GroupeSanguinABO, description: 'Groupe sanguin ABO' })
  @IsOptional()
  @IsEnum(GroupeSanguinABO)
  groupeSanguinAbo?: GroupeSanguinABO;

  @ApiPropertyOptional({ enum: GroupeSanguinRhesus, description: 'Rhésus' })
  @IsOptional()
  @IsEnum(GroupeSanguinRhesus)
  groupeSanguinRhesus?: GroupeSanguinRhesus;

  @ApiPropertyOptional({ example: 'Kell+, Duffy-', description: 'Phénotype étendu' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  phenotypeEtendu?: string;

  @ApiPropertyOptional({ example: '2020-01-10', description: '1ère détermination groupe sanguin' })
  @IsOptional()
  @IsDateString()
  date1ereDetermination?: string;

  @ApiPropertyOptional({ example: '2020-02-15', description: '2ème détermination groupe sanguin' })
  @IsOptional()
  @IsDateString()
  date2emeDetermination?: string;

  @ApiPropertyOptional({ example: 'Labo Central', description: 'Laboratoire de détermination' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  laboratoireDetermination?: string;

  @ApiPropertyOptional({ enum: StatutGroupeSanguin, description: 'Statut du groupe sanguin' })
  @IsOptional()
  @IsEnum(StatutGroupeSanguin)
  statutGroupeSanguin?: StatutGroupeSanguin;

  @ApiPropertyOptional({ enum: StatutReanimatoire, description: 'Statut réanimatoire' })
  @IsOptional()
  @IsEnum(StatutReanimatoire)
  statutReanimatoire?: StatutReanimatoire;

  @ApiPropertyOptional({ example: false, description: 'Directives anticipées renseignées' })
  @IsOptional()
  @IsBoolean()
  directivesAnticipees?: boolean;
}
