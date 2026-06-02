import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tarif } from './tarif.entity';
import { Facture } from './facture.entity';
import { FacturationService } from './facturation.service';
import { FacturationController } from './facturation.controller';
import { Patient } from '../patient/entities/patient.entity';
import { Sejour } from '../patient/entities/sejour.entity';
import { Chambre } from '../service/chambre.entity';
import { RendezVous } from '../rendezvous/entities/rendezvous.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Tarif, Facture, Patient, Sejour, Chambre, RendezVous])],
  controllers: [FacturationController],
  providers: [FacturationService],
})
export class FacturationModule {}
