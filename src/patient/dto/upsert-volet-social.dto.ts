// src/patient/dto/upsert-volet-social.dto.ts

import { IsString, IsOptional, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { NiveauAutonomie, OrientationPrevue } from '../entities/volet-social.entity';

export class UpsertVoletSocialDto {
  @ApiPropertyOptional({ example: 'Marié(e)', description: 'Situation familiale' })
  @IsOptional()
  @IsString()
  situationFamiliale?: string;

  @ApiPropertyOptional({ example: 'Appartement', description: 'Type de logement' })
  @IsOptional()
  @IsString()
  typeLogement?: string;

  @ApiPropertyOptional({ enum: NiveauAutonomie, description: 'Niveau d\'autonomie avant hospitalisation' })
  @IsOptional()
  @IsEnum(NiveauAutonomie)
  niveauAutonomieAvant?: NiveauAutonomie;

  @ApiPropertyOptional({ example: 'Aide ménagère 3h/semaine', description: 'Aides à domicile en place' })
  @IsOptional()
  @IsString()
  aidesDomicileEnPlace?: string;

  @ApiPropertyOptional({ example: 'Kiné, portage de repas', description: 'Besoins pour retour à domicile' })
  @IsOptional()
  @IsString()
  besoinsRetourDomicile?: string;

  @ApiPropertyOptional({ enum: OrientationPrevue, description: 'Orientation prévue à la sortie' })
  @IsOptional()
  @IsEnum(OrientationPrevue)
  orientationPrevue?: OrientationPrevue;

  @ApiPropertyOptional({ example: 'Dossier EHPAD en cours', description: 'Démarches engagées' })
  @IsOptional()
  @IsString()
  demarchesEngagees?: string;
}
