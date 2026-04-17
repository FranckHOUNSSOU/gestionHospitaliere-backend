import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '../entities/user.entity';

export class CreateUserByAdminDto {
  @ApiProperty({ example: 'Dupont', description: 'Nom de famille' })
  @IsString()
  @IsNotEmpty({ message: 'Le nom est requis.' })
  @MaxLength(100)
  nom!: string;

  @ApiProperty({ example: 'Jean', description: 'Prénom' })
  @IsString()
  @IsNotEmpty({ message: 'Le prénom est requis.' })
  @MaxLength(100)
  prenom!: string;

  @ApiProperty({ example: 'jean.dupont@hopital.bj', description: 'Adresse email (unique)' })
  @IsEmail({}, { message: 'Adresse email invalide.' })
  @IsNotEmpty()
  email!: string;

  @ApiProperty({ example: 'MotDePasse123', description: 'Mot de passe provisoire (min. 8 caractères)' })
  @IsString()
  @IsNotEmpty({ message: 'Le mot de passe est requis.' })
  @MinLength(8, { message: 'Le mot de passe doit contenir au moins 8 caractères.' })
  motDePasse!: string;

  @ApiProperty({
    enum: UserRole,
    example: UserRole.MEDECIN,
    description: 'Rôle du compte à créer (MEDECIN, AGENT_ADMINISTRATIF ou ADMINISTRATEUR)',
  })
  @IsIn([UserRole.MEDECIN, UserRole.AGENT_ADMINISTRATIF, UserRole.ADMINISTRATEUR], {
    message: 'Le rôle doit être MEDECIN, AGENT_ADMINISTRATIF ou ADMINISTRATEUR.',
  })
  role!: UserRole;

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
