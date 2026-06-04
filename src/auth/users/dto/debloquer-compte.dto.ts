import { IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class DebloquerCompteDto {
  @ApiProperty({
    example: 'MonMotDePasse@Admin1',
    description: "Mot de passe de l'administrateur (confirmation d'identité)",
  })
  @IsString()
  @IsNotEmpty({ message: 'Le mot de passe administrateur est requis.' })
  motDePasseAdmin!: string;

  @ApiPropertyOptional({
    example: 'NouveauMdp2026!',
    description: 'Nouveau mot de passe à attribuer au compte débloqué (min. 8 caractères)',
  })
  @IsOptional()
  @IsString()
  @MinLength(8, { message: 'Le nouveau mot de passe doit contenir au moins 8 caractères.' })
  nouveauMotDePasse?: string;
}
