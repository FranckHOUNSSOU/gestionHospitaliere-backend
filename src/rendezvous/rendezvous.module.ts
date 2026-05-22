import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RendezVous } from './entities/rendezvous.entity';
import { RendezVousService } from './rendezvous.service';
import { RendezVousController } from './rendezvous.controller';
import { Patient } from '../patient/entities/patient.entity';
import { Medecin } from '../medecin/entities/medecin.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RendezVous, Patient, Medecin])],
  controllers: [RendezVousController],
  providers: [RendezVousService],
})
export class RendezVousModule {}
