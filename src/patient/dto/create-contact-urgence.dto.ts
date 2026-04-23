// src/patient/dto/create-contact-urgence.dto.ts

import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsEmail, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateContactUrgenceDto {
  @ApiProperty({ example: 'DOE', description: 'Nom du contact' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nom!: string;

  @ApiProperty({ example: 'Jane', description: 'Prénom du contact' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  prenom!: string;

  @ApiProperty({ example: 'Épouse', description: 'Lien de parenté' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  lienParente!: string;

  @ApiProperty({ example: '+229 97 11 22 33', description: 'Téléphone principal' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  telephone!: string;

  @ApiPropertyOptional({ example: '+229 96 44 55 66', description: 'Téléphone secondaire' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  telephoneSecondaire?: string;

  @ApiPropertyOptional({ example: 'contact@email.com', description: 'Email' })
  @IsOptional()
  @IsEmail()
  @MaxLength(100)
  email?: string;

  @ApiPropertyOptional({ example: false, description: 'Personne de confiance désignée' })
  @IsOptional()
  @IsBoolean()
  estPersonneConfiance?: boolean;
}
