import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsUUID, IsString, IsOptional, IsInt, Min, Max, IsDateString } from 'class-validator';

export class CreateRendezVousDto {
  @ApiProperty({ example: 'uuid-patient', description: 'UUID du patient' })
  @IsUUID()
  patientId!: string;

  @ApiProperty({ example: 'uuid-user-medecin', description: 'UUID du compte utilisateur du médecin' })
  @IsUUID()
  medecinUserId!: string;

  @ApiProperty({ example: '2026-05-22T09:00:00.000Z', description: 'Date et heure ISO du rendez-vous' })
  @IsDateString()
  dateHeure!: string;

  @ApiPropertyOptional({ example: 30, description: 'Durée en minutes (défaut: 30)' })
  @IsOptional()
  @IsInt()
  @Min(5)
  @Max(480)
  dureeMinutes?: number;

  @ApiPropertyOptional({ example: 'Consultation', description: 'Type de rendez-vous' })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiPropertyOptional({ example: 'Douleurs thoraciques', description: 'Motif / notes' })
  @IsOptional()
  @IsString()
  motif?: string;
}
