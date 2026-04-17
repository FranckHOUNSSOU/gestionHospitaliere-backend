import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  @ApiProperty({
    example: 'NouveauMdp123',
    description: 'Nouveau mot de passe provisoire (min. 8 caractères)',
  })
  @IsString()
  @IsNotEmpty({ message: 'Le nouveau mot de passe est requis.' })
  @MinLength(8, { message: 'Le mot de passe doit contenir au moins 8 caractères.' })
  nouveauMotDePasse!: string;
}
