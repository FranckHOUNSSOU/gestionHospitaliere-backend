import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../users/entities/user.entity';

export class MessageResponse {
  @ApiProperty({ example: 'Compte créé avec succès.' })
  message!: string;
}

export class AuthTokensResponse {
  @ApiProperty({ description: 'JWT access token (valide 15 min)', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  accessToken!: string;

  @ApiProperty({ description: 'JWT refresh token (valide 7 jours)', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  refreshToken!: string;
}

class UserInfoResponse {
  @ApiProperty({ example: 'uuid-xxxx-xxxx' })
  id!: string;

  @ApiProperty({ example: 'Dupont' })
  nom!: string;

  @ApiProperty({ example: 'Jean' })
  prenom!: string;

  @ApiProperty({ example: 'jean.dupont@hopital.bj' })
  email!: string;

  @ApiProperty({ enum: UserRole, example: UserRole.MEDECIN })
  role!: string;

  @ApiProperty({ example: 'Cardiologie', nullable: true })
  service!: string | null;
}

export class LoginResponse {
  @ApiProperty({ type: AuthTokensResponse })
  tokens!: AuthTokensResponse;

  @ApiProperty({ type: UserInfoResponse })
  user!: UserInfoResponse;
}
