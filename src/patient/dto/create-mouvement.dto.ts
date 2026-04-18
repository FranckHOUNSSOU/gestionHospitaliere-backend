// src/patient/dto/create-mouvement.dto.ts

import { IsString, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateMouvementDto {
  @ApiProperty({ example: '2024-01-15T10:30:00.000Z', description: 'Date et heure du mouvement' })
  @IsString()
  @IsNotEmpty()
  dateHeureMouvement!: string;

  @ApiPropertyOptional({ example: 'Urgences', description: 'Service de départ' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  serviceDepart?: string;

  @ApiProperty({ example: 'Chirurgie générale', description: 'Service d\'arrivée' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  serviceArrivee!: string;

  @ApiPropertyOptional({ example: 'CH-201', description: 'Numéro de chambre' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  numeroChambre?: string;

  @ApiPropertyOptional({ example: 'LIT-3', description: 'Numéro de lit' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  numeroLit?: string;

  @ApiPropertyOptional({ example: 'Stabilisation post-opératoire', description: 'Motif du transfert interne' })
  @IsOptional()
  @IsString()
  motifTransfertInterne?: string;
}
