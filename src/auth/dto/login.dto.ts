import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'jean.dupont@hopital.bj', description: 'Adresse email du compte' })
  @IsEmail({}, { message: 'Adresse email invalide.' })
  @IsNotEmpty({ message: "L'email est requis." })
  email!: string;

  @ApiProperty({ example: 'MotDePasse123', description: 'Mot de passe (min. 8 caractères)' })
  @IsString()
  @IsNotEmpty({ message: 'Le mot de passe est requis.' })
  @MinLength(8, { message: 'Le mot de passe doit contenir au moins 8 caractères.' })
  motDePasse!: string;
}