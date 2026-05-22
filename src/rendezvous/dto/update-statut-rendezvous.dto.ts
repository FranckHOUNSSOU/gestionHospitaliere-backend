import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { StatutRendezVous } from '../entities/rendezvous.entity';

export class UpdateStatutRendezVousDto {
  @ApiProperty({ enum: StatutRendezVous })
  @IsEnum(StatutRendezVous)
  statut!: StatutRendezVous;
}
