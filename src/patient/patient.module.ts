// src/patient/patient.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Patient } from './entities/patient.entity';
import { Allergie } from './entities/allergie.entity';
import { TraitementARisque } from './entities/traitement-a-risque.entity';
import { ContactUrgence } from './entities/contact-urgence.entity';
import { CouvertureSociale } from './entities/couverture-sociale.entity';
import { Sejour } from './entities/sejour.entity';
import { Mouvement } from './entities/mouvement.entity';
import { Diagnostic } from './entities/diagnostic.entity';
import { Prescription } from './entities/prescription.entity';
import { Examen } from './entities/examen.entity';
import { ResultatExamen } from './entities/resultat-examen.entity';
import { Constante } from './entities/constante.entity';
import { SoinInfirmier } from './entities/soin-infirmier.entity';
import { CompteRendu } from './entities/compte-rendu.entity';
import { Consentement } from './entities/consentement.entity';
import { VoletAnesthesie } from './entities/volet-anesthesie.entity';
import { VoletSocial } from './entities/volet-social.entity';
import { VoletNutritionnel } from './entities/volet-nutritionnel.entity';
import { PatientService } from './patient.service';
import { SejourService } from './sejour.service';
import { PatientController } from './patient.controller';
import { SejourController } from './sejour.controller';
import { AuthModule } from '../auth/auth.module';
import { MedecinModule } from '../medecin/medecin.module';
import { User } from '../auth/users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Patient,
      User,
      Allergie,
      TraitementARisque,
      ContactUrgence,
      CouvertureSociale,
      Sejour,
      Mouvement,
      Diagnostic,
      Prescription,
      Examen,
      ResultatExamen,
      Constante,
      SoinInfirmier,
      CompteRendu,
      Consentement,
      VoletAnesthesie,
      VoletSocial,
      VoletNutritionnel,
    ]),
    AuthModule,    // JwtAuthGuard, RolesGuard
    MedecinModule, // accès à MedecinRepository (FK vers médecins) + TypeOrmModule.forFeature([Medecin])
  ],
  controllers: [PatientController, SejourController],
  providers: [PatientService, SejourService],
  exports: [PatientService, SejourService],
})
export class PatientModule {}
